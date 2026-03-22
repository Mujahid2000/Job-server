import { Types } from "mongoose";
import UserSchema from "../models/UserModels";
import NotificationSchemas from "../models/NotificationSchema";
import JobAlertSchemas from "../models/JobAlertsSchema";
import ProfilePrivacySchemas from "../models/ProfilePrivacySchema";
import { ApiError } from "../utils/ApiError";

const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await UserSchema.findById(new Types.ObjectId(userId));
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (userData: any) => {
  const { name, email, password, role, phoneNumber } = userData;

  const userExists = await UserSchema.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const session = await UserSchema.startSession();
  session.startTransaction();

  try {
    const newUser = new UserSchema({
      name,
      email,
      password,
      role,
      phoneNumber,
    });

    const savedUser = await newUser.save({ session });

    if (role.toLowerCase() === 'applicant') {
      await new NotificationSchemas({ userId: savedUser._id }).save({ session });
      await new JobAlertSchemas({ userId: savedUser._id }).save({ session });
      await new ProfilePrivacySchemas({ userId: savedUser._id }).save({ session });
    }

    await session.commitTransaction();
    return savedUser;
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(500, 'Failed to register user', [error.message]);
  } finally {
    session.endSession();
  }
};

const loginUser = async (email: string, password: string) => {
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'Email not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());
  
  const userResponse = user.toObject();
  delete (userResponse as any).password;
  delete (userResponse as any).refreshToken;

  return { user: userResponse, accessToken, refreshToken };
};

const getAllUsers = async () => {
  return await UserSchema.aggregate([
    {
      $addFields: {
        idString: { $toString: "$_id" }
      }
    },
    {
      $lookup: {
        from: "payments",
        localField: "idString",
        foreignField: "userId",
        as: "userData"
      }
    },
    {
      $unwind: {
        path: "$userData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "companydatas",
        localField: "idString",
        foreignField: "userId",
        as: "companydata"
      }
    },
    {
      $unwind: {
        path: "$companydata",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $set: {
        packageName: "$userData.packageName",
        companyName: "$companydata.companyName",
        formatDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        packageName: 1,
        date: "$formatDate",
        companyName: 1
      }
    }
  ]);
};

const getUserByEmail = async (email: string) => {
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const userService = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByEmail,
};
