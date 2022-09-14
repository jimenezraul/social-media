const { Schema, model } = require("mongoose");

const postSchema = new Schema({
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
    postComments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    postLikes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

const Post = model("Post", postSchema);

module.exports = Post;