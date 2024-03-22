const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const asyncHandler = require('express-async-handler');
const Message = require("../models/messageModel");
const NotFound = require("../errors/NotFound");
const BadReqError = require("../errors/BadReqError");

const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new BadReqError(`UserId not send`));
  }
  // find if this chat aleary exist don't create a new one
  const ischat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("latestMessage");
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    return res.send({ message, chatId: ischat[0]._id });
  }
  else {
    const createdChat = await Chat.create({
      chatName: "sender",
      users: [req.user._id, userId]
    });
    const chatId = await Chat.findOne({ _id: createdChat._id })._id
    res.status(201).json({ message: [], chatId });
  }
})

const getChats = asyncHandler(async (req, res, next) => {
  const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).sort("-updatedAt").populate("latestMessage")
  res.status(200).json(results);
})

const createGroupChat = asyncHandler(async (req, res, next) => {
  var { users } = req.body
  if (!req.body.users || !req.body.name) {
    return next(new BadReqError("Please Fill all the feilds"));
  } if (users.length < 2) {

    return next(new BadReqError("More than 2 users are required to form a group chat"));
  }
  const user = req.user._id
  users.push(user);
  //find if this chat aleary exist don't create a new one

  const ischat = await Chat.find({
    $and: [
      { users: { $eq: users } },
    ],
  })
  if (ischat.length > 0) {
    const message = await Message.find({ chat: ischat[0]._id })
    return res.send({ message, chatId: ischat[0]._id });
  }
  else {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      groupAdmin: user,
    });
    const chatId = await Chat.findOne({ _id: groupChat._id })._id
    res.status(201).json({ message: [], chatId });
  }
})

const addToGroup = asyncHandler(async (req, res, next) => {
  const chatId = req.params.id;
  const { userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    })
  if (!added) {
    return next(new NotFound("Chat Not Found"));
  }
  res.status(200).json(added);
});


const getGroupChat = asyncHandler(async (req, res, next) => {

  const results = await Chat.aggregate([
    {
      $match: {
        $and: [
          { $expr: { $gt: [{ $size: "$users" }, 2] } },
          { users: { $elemMatch: { $eq: req.user._id } } }]
      }
    }
  ])
  res.status(200).json(results);
})

module.exports = { accessChat, getChats, createGroupChat, addToGroup, getGroupChat };
