import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { config } from "../config/config";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  res.status(201).json(
    new ApiResponse(201, user, 'User registered successfully')
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await userService.loginUser(email, password);

  const options = {
    httpOnly: true,
    secure: config.env === 'production',
  };

  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, { user, accessToken, refreshToken }, 'User logged in successfully')
    );
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(
    new ApiResponse(200, users, 'Users fetched successfully')
  );
});

const getUserByEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await userService.getUserByEmail(email as string);
  res.status(200).json(
    new ApiResponse(200, user, 'User found')
  );
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await userService.forgotPassword(email);
  res.status(200).json(
    new ApiResponse(200, null, 'Password reset email sent')
  );
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await userService.resetPassword(token, password);
  res.status(200).json(
    new ApiResponse(200, null, 'Password reset successful')
  );
});

export { getAllUsers, loginUser, registerUser, getUserByEmail, forgotPassword, resetPassword };
