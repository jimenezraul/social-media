const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      trim: true,
    },
    commentAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
