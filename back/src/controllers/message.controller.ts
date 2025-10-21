import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { UserType } from "../types/auth.type.js";
import { MessageType } from "../types/message.type.js";

/**
 * 로그인 유저를 제외한 모든 유저 가져오기
 *
 * @param {Request} req - The HTTP request object, containing information about the logged-in user.
 * @param {Response} res - The HTTP response object used to send the resulting user data or errors.
 * @param {NextFunction} next - The callback function to pass errors to the next middleware.
 * @throws Will pass any encountered errors to the next middleware using `next`.
 * @description Queries the database to fetch a list of users, excluding the user currently authenticated via `req.user._id`.
 * Responds with a JSON object containing the list of users on success or an error status if an exception occurs.
 */
export const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 로그인 된 유저 id
    const loggedInUserId = req.user?._id;

    // 로그인된 유저 제외한 유저 가져오기
    const users = await User.find<UserType>({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(users);
  } catch (e) {
    console.error("getAllContacts error: ", e);
    next(e);
  }
};

/**
 * Asynchronously retrieves chat messages between the currently authenticated user and another user specified by their user ID.
 *
 * @function getMessagesByUserId
 * @param {Request} req - The HTTP request object, containing user authentication data and route parameters.
 * @param {Response} res - The HTTP response object, used to send the retrieved messages or errors.
 * @param {NextFunction} next - Middleware callback to pass control to the next middleware in case of an error.
 * @throws Will pass any encountered database or processing errors to the next middleware.
 */
export const getMessagesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const myId = req.user?._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find<MessageType>({
      $or: [
        { sender: myId, receiver: userToChatId },
        { sender: userToChatId, receiver: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (e) {
    console.error("getMessagesByUserId error: ", e);
    next(e);
  }
};

export const getChatPartners = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUserId = req.user?._id;
    const messages = await Message.find({
      $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set<string>(
        messages.map((message) =>
          message.senderId === loggedInUserId
            ? message.receiverId.toString()
            : message.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (e) {
    console.error("getChatPartners error: ", e);
    next(e);
  }
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl = "";
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (e) {
    console.error("sendMessage error: ", e);
    next(e);
  }
};
