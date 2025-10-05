import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Asynchronously uploads a profile picture to the Cloudinary service and returns the URL of the uploaded image.
 *
 * @param {string} profilePic - The file path or base64 string representation of the profile picture to be uploaded.
 * @returns {Promise<string>} A promise that resolves to the secure URL of the uploaded profile picture.
 * @throws Will throw an error if the upload process fails.
 */
export const uploadProfilePic = async (profilePic: string): Promise<string> => {
  const response = await cloudinary.uploader.upload(profilePic);
  return response.secure_url;
};
