const { Schema, model } = require('mongoose');
const date = require('date-and-time');

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      trim: true,
    },
    commentAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// format createdAt date
commentSchema.virtual('createdAtFormatted').get(function () {
  return date.format(this.createdAt, 'dddd MMM DD, YYYY');
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
