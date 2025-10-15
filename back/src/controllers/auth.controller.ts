import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt.js";
import { sendWelcomeEmail } from "../lib/email.js";
import { CLIENT_URL } from "../config/env.js";
import {
  LogInRequest,
  SignUpRequest,
  UpdateProfileRequest,
  UserType,
} from "../types/auth.type.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password }: SignUpRequest = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // user check
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  // password check
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  // email check(regex)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  // create user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  if (!newUser)
    return res.status(500).json({ message: "User creation failed" });

  await newUser.save();

  generateToken(newUser._id.toString(), res);

  // send welcome email
  // await sendWelcomeEmail(email, fullName, CLIENT_URL!);

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: LogInRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // 이메일, 비밀번호 둘 중 어느것이 틀렸는지 알려주지 않음
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Authentication failed" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password!);
  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Authentication failed" });

  generateToken(user._id.toString(), res);

  // success
  res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  });
};

export const logout = async (req: Request, res: Response) => {
  // remove token in cookie
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (
  req: Request & { body: { profilePic: string } },
  res: Response
) => {
  const { profilePic } = req.body;

  if (!profilePic)
    return res.status(400).json({ message: "profilePic is required" });

  const userId = req.user?._id;
  const response = await cloudinary.uploader.upload(profilePic);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: response.secureUrl,
    },
    { new: true } // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
  ).select("-password");
  res.status(200).json(updatedUser);
};
