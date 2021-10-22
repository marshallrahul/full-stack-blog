const {buildSchema} = require ('graphql');

module.exports = buildSchema (`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    name: String!
    email: String!
    password: String
    posts: [Post!]
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    imageUrl: String!
    content: String!
  }

  type AuthData {
    userId: String!
    token: String!
  }

  type RootMutation {
    createUser(inputData: UserInput!): User!
    createPost(inputData: PostInput!): Post!
    updatePost(id: ID!, inputData: PostInput!): Post!
    deletePost(id: ID!): Post!
  }

  type RootQuery {
    posts: [Post!]
    post(postId: ID!): Post!
    login(email: String!, password: String!): AuthData!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
