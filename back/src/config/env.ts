import dotenv from "dotenv";

// 기본 .env 먼저 로드
dotenv.config();

dotenv.config({
  path: `${process.env.ENV_MODE === "dev" ? ".env.dev" : ".env"}`,
});

export const {
  PORT,
  CLIENT_URL,
  ENV_MODE,
  MONGO_URI,
  JWT_SECRET,
  RESEND_API_KEY,
  EMAIL_FROM,
  EMAIL_FROM_NAME,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  ARCJET_KEY,
} = process.env;
