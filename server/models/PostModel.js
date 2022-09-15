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

// comments count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// likes count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

const Post = model("Post", postSchema);

module.exports = Post;
