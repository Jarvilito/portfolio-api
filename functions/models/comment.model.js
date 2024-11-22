const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    postedBy: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comments = mongoose.model("Comments", commentSchema);

module.exports = Comments;
