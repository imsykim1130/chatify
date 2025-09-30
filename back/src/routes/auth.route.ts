import express from "express";

const authRouter = express.Router();

authRouter.get("/signup", (req, res) => {
  res.send("signup");
});
authRouter.get("/login", (req, res) => {
  res.send("");
});
authRouter.get("/logout", (req, res) => {
  res.send("");
});

export default authRouter;
