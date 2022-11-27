const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar Date

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: User
    createdAt: Date
    createdAtFormatted: String
    likes: [User]
    likesCount: Int
    replies: [Comment]
  }

  type Post {
    _id: ID
    postImage: String
    postText: String
    postAuthor: User
    createdAt: Date
    comments: [Comment]
    commentCount: Int
    likes: [User]
    likeCount: Int
    createdAtFormatted: String
  }

  type User {
    _id: ID
    given_name: String
    family_name: String
    email: String
    profileUrl: String
    isAdmin: Boolean
    isVerified: Boolean
    postCount: Int
    posts: [Post]
    friends: [User]
    messages: [Messages]
    blockedUsers: [User]
    friendRequests: [User]
    friendRequestCount: Int
    createdAt: Date
    updatedAt: Date
    provider: String
    fullName: String
    friendCount: Int
    createdAtFormatted: String
  }

  type Message {
    success: Boolean
    message: String
    subMessage: String
  }

  type Auth {
    success: Boolean
    message: String
    access_token: String
    user: User
    isLoggedIn: Boolean
  }

  type CommentSub {
    comment: Comment
    postId: ID
  }

  type LikeSub {
    postId: ID
    likeExists: Boolean
    user: User
  }

  type likeCommentSub {
    commentId: ID
    likeExists: Boolean
    user: User
  }

  type friendRequestSub {
    user: User
    friendId: ID
    requestExists: Boolean
  }

  type ChatMessage {
    sender: User
    text: String
    media: String
    createdAt: Date
    status: String
  }

  type Messages {
    _id: ID
    members: [User]
    messages: [ChatMessage]
  }

  type Notifications {
    _id: ID
    sender: User
    recipient: User
    type: String
    is_read: Boolean
    message: String
    postId: ID
  }

  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(postId: ID!): Post
    feed: [Post]
    chats: [Messages]
    chatById(id: ID!): [Messages]
    chatByUser: [Messages]
    notifications: [Notifications]
    notificationsByUser(userId: ID!): [Notifications]
  }

  type Mutation {
    register(
      given_name: String!
      family_name: String!
      email: String!
      password: String!
    ): Message
    verifyUser(token: String!): Message
    login(email: String!, password: String!): Auth
    logout: Auth
    refreshToken(id: ID!): Auth
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Comment
    updateComment(postId: ID!, commentId: ID!, commentText: String!): Comment
    deleteComment(postId: ID!, commentId: ID!): Message
    updatePost(postId: ID!, postText: String!): Post
    deletePost(postId: ID!): Message
    friendRequest(friendId: ID!): Message
    acceptFriendRequest(friendId: ID!): Message
    likes(postId: ID!): Message
    likeComment(commentId: ID!): Message
    googleLogin(tokenId: String!): Auth
    facebookLogin(fbAccessToken: String!): Auth
    removeFriend(friendId: ID!): Message
    resetPassword(token: String!, password: String!): Message
    forgotPassword(email: String!): Message
    resendVerificationEmail(email: String!): Message
    postMessage(recipientId: ID!, text: String, media: String): Messages
    markMessageAsRead(messageId: ID!): Messages
    getMessagesById(id: ID!, limit:Int!): [Messages]
    markAllNotificationsAsRead: Message
    markNotificationAsRead(notificationId: ID!): Message
  }

  type Subscription {
    newPostSubscription(userId: ID!): Post
    newCommentSubscription: CommentSub
    newLikeSubscription: LikeSub
    newLikeCommentSubscription: likeCommentSub
    newFriendRequestSubscription: Notifications
    newMessageSubscription(userId: ID!): Messages
    newLikeNotificationSubscription(userId: ID!): Notifications
  }
`;

module.exports = typeDefs;
