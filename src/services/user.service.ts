import { Types } from "mongoose";
import UserSchema from "../models/UserModels";
import NotificationSchemas from "../models/NotificationSchema";
import JobAlertSchemas from "../models/JobAlertsSchema";
import ProfilePrivacySchemas from "../models/ProfilePrivacySchema";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "../utils/EmailService";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

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

const forgotPassword = async (email: string) => {
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

  const message = `
    <h1>Password Reset Request</h1>
    <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process within 15 minutes of receiving it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;

  try {
    await sendEmail(user.email, 'Password Reset Token', message);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Email could not be sent');
  }
};

const resetPassword = async (token: string, password: any) => {
  try {
    const decoded: any = jwt.verify(token, config.jwt.secret);
    const user = await UserSchema.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return user;
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired token');
  }
};

export const userService = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByEmail,
  forgotPassword,
  resetPassword,
};
