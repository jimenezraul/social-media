const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    given_name: String
    family_name: String
    email: String
    isAdmin: Boolean
    isVerified: Boolean
    postCount: Int
    posts: [Post]
  }

  type Post {
    _id: ID
    postText: String
    postAuthor: String
    createdAt: String
    comments: [Comment]
    commentCount: Int
    likes: [Like]
    likeCount: Int
  }

  type Comment {
    _id: ID
    commentText: String
    commentAuthor: String
    createdAt: String
  }

  type Like {
    _id: ID
    likeAuthor: String
    createdAt: String
  }

  type Auth {
    message: String
    access_token: String
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    posts(username: String): [Post]
    post(postId: ID!): Post
  }

  type Mutation {
    addUser(
      given_name: String!
      family_name: String!
      email: String!
      password: String!
    ): Auth
    login(email: String!, password: String!): Auth
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    addLike(postId: ID!): Post
  }
`;

module.exports = typeDefs;
