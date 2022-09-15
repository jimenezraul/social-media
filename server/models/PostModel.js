const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    postImage: {
      type: String,
      trim: true,
    },
    postText: {
      type: String,
      trim: true,
    },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
