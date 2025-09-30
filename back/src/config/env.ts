import dotenv from "dotenv";

// 기본 .env 먼저 로드
dotenv.config();

dotenv.config({
  path: `.env.${process.env.ENV_MODE}`,
});

export const { PORT, ENV_MODE } = process.env;
