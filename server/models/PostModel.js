const { Schema, model } = require('mongoose');
const date = require('date-and-time');

const postSchema = new Schema(
  {
    postImage: {
      type: String,
      trim: true,
    },
    postText: {
      type: String,
      trim: true,
      required: true,
    },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// comments count
postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// likes count
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// format createdAt date
postSchema.virtual('createdAtFormatted').get(function () {
  return date.format(this.createdAt, 'dddd MMM DD, YYYY');
});

const Post = model('Post', postSchema);

module.exports = Post;
