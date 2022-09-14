const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    given_name: String
    family_name: String
    email: String
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

  type Tokens {
    accessToken: String
    refreshToken: String
  }

  type Auth {
    token: Tokens
    user: User
  }

  type Confirmation {
    message: String
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
    ): Confirmation
    login(email: String!, password: String!): Confirmation
    addPost(postText: String!): Post
    addComment(postId: ID!, commentText: String!): Post
    addLike(postId: ID!): Post
  }
`;

module.exports = typeDefs;
