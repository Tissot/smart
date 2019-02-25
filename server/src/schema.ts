import { gql } from 'apollo-server';

export default gql`
  type Query {
    hello: String
  }

  type Mutation {
    signUp(username: String!, password: String!): User!
    signInByPassword(username: String!, password: String!): User!
    signInByToken(id: String!, token: String!): User!
  }

  type User {
    id: ID!
    username: String!
    token: String!
  }
`;
