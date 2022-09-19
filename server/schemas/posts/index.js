const { post, posts, addPost, updatePost, deletePost } = require("./post");
const { addComment, deleteComment } = require("./comment");
const { likes } = require("./likes");
const { feed } = require("./feed");

module.exports = {
  posts: posts,
  post: post,
  addPost: addPost,
  updatePost: updatePost,
  deletePost: deletePost,
  addComment: addComment,
  deleteComment: deleteComment,
  likes: likes,
  feed: feed,
};
