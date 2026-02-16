import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model, ObjectId } from "mongoose";

// Interface for User document properties
interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    phoneNumber?: number;
    refreshToken?: string | undefined;
}

// Interface for User instance methods
interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

// Create a type that combines the User document with methods
type UserDocument = Document & IUser & IUserMethods;

// Create a type for the User model
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        trim: true,
    },
    refreshToken: {
        type: String,
    },

}, {
    timestamps: true,
});


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
            name: this.name,
        },
        process.env.SECRET_TOKEN as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any,
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        role: this.role,
        name: this.name,
    },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
        }
    )
}


export default mongoose.model<IUser, UserModel>('User', userSchema);
