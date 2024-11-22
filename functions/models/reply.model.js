const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    replyBy: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
