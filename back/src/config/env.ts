import dotenv from "dotenv";

// 기본 .env 먼저 로드
dotenv.config();

dotenv.config({
  path: `.env.${process.env.ENV_MODE}`,
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
} = process.env;
