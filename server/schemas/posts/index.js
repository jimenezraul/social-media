const { post, posts, addPost } = require("./post");
const { addComment, removeComment } = require("./comment");
const { likes } = require("./likes");
const { feed } = require("./feed");

module.exports = {
  posts: posts,
  post: post,
  addPost: addPost,
  addComment: addComment,
  removeComment: removeComment,
  likes: likes,
  feed: feed,
};
