import { gql } from 'apollo-server'

export default gql`
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    doesUserExists(email: String): Boolean
    login(email: String, password: String): String
    requestPasswordRecoveryUrlOverEmail(email: String): Boolean
  }

  type Mutation {
    addUser(user: UserInput!): User
    changePasswordWithToken(password: String, token: String): Boolean
  }

  type User {
    id: ID!
    names: String
    surnames: String
    email: String!
    password: String!
    isEmailContactAllowed: Boolean!
  }

  input UserInput {
    names: String
    surnames: String
    email: String!
    password: String!
    isEmailContactAllowed: Boolean!
  }
`
