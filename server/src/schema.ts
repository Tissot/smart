import { gql } from 'apollo-server';

export default gql`
  type Query {
    # DataSource
    getDataSources: DataSources!
    # Report
    getReport(id: ID!): Report!
    getAllReports: Reports!
  }

  type Mutation {
    # User
    signUp(username: String!, password: String!): User!
    signInByPassword(username: String!, password: String!): User!
    signInByToken(id: ID!, token: String!): User!
    # DataSource
    addDataSource(name: String!, data: String!): DataSource!
    removeDataSource(id: ID!): Boolean!
    # Report
    addReport: Report!
    removeReport(id: ID!): Boolean!
    renameReport(id: ID!, name: String!): Boolean!
    saveReportEls(id: ID!, elements: String!): Boolean!
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

  type Reports {
    rows: [Report]!
    count: Float!
  }

  type Report {
    id: ID!
    createdAt: String!
    updatedAt: String!
    name: String
    elements: String!
  }
`;
