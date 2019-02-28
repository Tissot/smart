import { gql } from 'apollo-server';

export default gql`
  type Query {
    # DataSource
    getDataSources: DataSources!
  }

  type Mutation {
    # User
    signUp(username: String!, password: String!): User!
    signInByPassword(username: String!, password: String!): User!
    signInByToken(id: String!, token: String!): User!
    # DataSource
    addDataSource(name: String!, data: String!): DataSource!
    removeDataSource(id: String!): Boolean!
  }

  type User {
    id: ID!
    createdAt: String!
    updatedAt: String!
    username: String!
    token: String!
  }

  type DataSources {
    rows: [DataSource]!
    count: Float!
  }

  type DataSource {
    id: ID!
    createdAt: String!
    updatedAt: String!
    name: String!
    data: String!
  }
`;
