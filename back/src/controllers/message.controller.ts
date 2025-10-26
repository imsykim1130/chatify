import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { UserType } from "../types/auth.type.js";
import { MessageType } from "../types/message.type.js";

// 로그인 유저를 제외한 모든 유저 가져오기
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

// 특정 유저의 메세지 가져오기
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
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (e) {
    console.error("getMessagesByUserId error: ", e);
    next(e);
  }
};

// 대화를 주고 받은 유저들
export const getChatPartners = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUserId = req.user?._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set<string>(
        messages.map((message) =>
          message.senderId.toString() === loggedInUserId?.toString()
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

// 메세지 보내기
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
    // 이미지 메세지인 경우
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    // DB 에 메세지 저장
    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    // 메세지 수신자가 온라인 상태라면 소켓으로 메세지 바로 전송
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log("new message socket");

      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (e) {
    console.error("sendMessage error: ", e);
    next(e);
  }
};
