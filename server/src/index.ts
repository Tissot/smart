const Koa = require('koa');
const cors = require('@koa/cors');

const { ApolloServer } = require('apollo-server-koa');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = new Koa();
app.use(cors({
  origin: 'http://localhost:3000',
  keepHeadersOnError: true,
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.applyMiddleware({ app });

const port = 3001;
const host = 'localhost';

app.listen(port, host, () =>
  console.log(`🚀 Server ready at http://${host}:${port}${server.graphqlPath}`),
);