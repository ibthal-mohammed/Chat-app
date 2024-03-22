const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const BadReqError = require("../errors/BadReqError")

const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body
  if (!content || !chatId) {
    return next(new BadReqError("Invalid Data"))
  }
  const newMessage = await Message.create({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });
  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: newMessage });
  res.status(201).json({ newMessage })
});
const getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params
  const message = await Message.find({ chat: chatId })
  res.status(200).json(message)
})

module.exports = { sendMessage, getMessages };
