import express from "express";

const messageRouter = express.Router();

messageRouter.get("/send", (req, res) => {
  res.send("");
});

export default messageRouter;
