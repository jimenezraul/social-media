const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    commentText: {
        type: String,
        trim: true,
    },
    commentAuthor: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    commentPost: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;