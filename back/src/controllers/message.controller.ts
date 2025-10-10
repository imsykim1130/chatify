import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 로그인 된 유저 id
    const loggedInUserId = req.user?._id;

    // 로그인된 유저 제외한 유저 가져오기
    const users = await User.find({ _id: { $ne: loggedInUserId } });
    res.status(200).json(users);
  } catch (e) {
    console.error("getAllContacts error: ", e);
    next(e);
  }
};

export const getMessagesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const myId = req.user?._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
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
