import dotenv from "dotenv";
dotenv.config({
    path: `.env.${process.env.ENV_MODE || "dev"}`,
});
export const { PORT, ENV_MODE } = process.env;
