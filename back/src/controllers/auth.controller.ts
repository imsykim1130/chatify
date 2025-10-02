import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/jwt.js";

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

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

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
  });

  // TODO: send welcome email
};
