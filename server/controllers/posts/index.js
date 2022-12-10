const {
  post,
  posts,
  addPost,
  updatePost,
  deletePost,
  newPostSubscription,
} = require('./post');
const {
  addComment,
  deleteComment,
  updateComment,
  newCommentSubscription,
} = require('./comment');
const {
  likes,
  likeComment,
  newLikeSubscription,
  newLikeCommentSubscription,
  newLikePostNotificationSubscription,
} = require('./likes');
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
    likeComment: likeComment,
  },
  postSubscription: {
    newCommentSubscription: newCommentSubscription,
    newLikeSubscription: newLikeSubscription,
    newPostSubscription: newPostSubscription,
    newLikeCommentSubscription: newLikeCommentSubscription,
    newLikePostNotificationSubscription: newLikePostNotificationSubscription,
  },
};

module.exports = postResolvers;
