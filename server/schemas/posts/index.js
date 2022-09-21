const { post, posts, addPost, updatePost, deletePost } = require('./post');
const { addComment, deleteComment, updateComment } = require('./comment');
const { likes } = require('./likes');
const { feed } = require('./feed');

const postResolvers = {
  postQuery: {
    post: post,
    posts: posts,
    feed: feed,
  },
  postMutation: {
    addPost: addPost,
    updatePost: updatePost,
    deletePost: deletePost,
    addComment: addComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    likes: likes,
  },
};

module.exports = postResolvers;
