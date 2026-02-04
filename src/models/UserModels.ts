import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({

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


userSchema.methods.comparePassword = async function (password: any) {
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



export default mongoose.model('User', userSchema);
