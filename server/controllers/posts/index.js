const { post, posts, addPost, updatePost, deletePost, newPostSubscription } = require('./post');
const { addComment, deleteComment, updateComment, newCommentSubscription } = require('./comment');
const { likes, newLikeSubscription } = require('./likes');
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
  postSubscription: {
    newCommentSubscription: newCommentSubscription,
    newLikeSubscription: newLikeSubscription,
    newPostSubscription: newPostSubscription,
  },
};

module.exports = postResolvers;
