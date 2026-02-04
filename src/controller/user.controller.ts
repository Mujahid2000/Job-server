import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import NotificationSchemas from "../models/NotificationSchema";
import JobAlertSchemas from "../models/JobAlertsSchema";
import ProfilePrivacySchemas from "../models/ProfilePrivacySchema";
import UserSchema from "../models/UserModels";
import { genarateTokens, refreashToken } from "../utils/genarateTokens";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, phoneNumber } = req.body;

  if (!name || !email || !password || !role || !phoneNumber) {
    throw new ApiError(400, 'All fields are required');
  }

  const session = await UserSchema.startSession();
  session.startTransaction();

  try {
    // Create a new user instance
    const newUser = new UserSchema({
      name,
      email,
      password, // In a real application, hash the password before saving
      role,
      phoneNumber,
    });

    // Save the user within the transaction
    const saveUserData = await newUser.save({ session });

    // If role is applicant, create default records within the transaction
    if (role.toLowerCase() === 'applicant') {
      const notificationData = new NotificationSchemas({
        userId: saveUserData._id,
        shortlist: false,
        jobsExpire: false,
        jobAlerts: false,
        savedProfile: false,
        rejected: false,
      });
      await notificationData.save({ session });

      const jobAlertData = new JobAlertSchemas({
        userId: saveUserData._id,
        jobRole: '',
        location: '',
      });
      await jobAlertData.save({ session });

      const profilePrivacyData = new ProfilePrivacySchemas({
        userId: saveUserData._id,
        profilePublic: false,
        resumePublic: false,
      });
      await profilePrivacyData.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    const accessToken = genarateTokens(saveUserData);
    const refreashTokens = refreashToken(saveUserData);

    res.cookie("refreashTokens", refreashTokens, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json(
      new ApiResponse(201, saveUserData, 'User registered successfully')
    );
  } catch (error: any) {
    // Rollback the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, 'Failed to register user', [error.message]);
  }
})


const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  try {
    // Find user by email and password
    const user = await UserSchema.findOne({ email, password });

    if (!user) {
      throw new ApiError(404, 'Invalid email or password');
    }

    res.status(200).json(
      new ApiResponse(200, user, 'User found')
    );
  } catch (error: any) {
    throw new ApiError(500, 'Failed to fetch user', [error.message]);
  }
})


const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  try {
    // Find user by email
    const user = await UserSchema.findOne({ email });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.status(200).json(
      new ApiResponse(200, user, 'User found')
    );
  } catch (error: any) {
    throw new ApiError(500, 'Failed to fetch user', [error.message]);
  }
})


const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await UserSchema.aggregate([
      {
        $addFields: {
          idString: { $toString: "$_id" } // Convert ObjectId to string
        }
      },
      {
        $lookup: {
          from: "payments",
          localField: "idString",      // Now a string version of _id
          foreignField: "userId",      // String field in payments
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
    res.status(200).json(
      new ApiResponse(200, users, 'Users fetched successfully')
    );
  } catch (error: any) {
    throw new ApiError(500, 'Failed to fetch users', [error.message]);
  }
})
export { registerUser, loginUser, getUserByEmail, getAllUsers }