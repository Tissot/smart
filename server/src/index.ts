// import Koa from 'koa';
// import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server';
import config from 'config';

import typeDefs from './schema';
import resolvers from './resolvers';
import dataSources from './dataSources';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
});
const port = Number(config.get('server.port'));

server
  .listen({ port: port })
  .then(({ url }) => console.log(`🚀 app running at ${url}`));
