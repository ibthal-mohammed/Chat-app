const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    // isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

//for Population
chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'users',
  });
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;