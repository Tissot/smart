import { ApolloServer, ApolloError } from 'apollo-server';
import config from 'config';

import typeDefs from './schema';
import resolvers from './resolvers';
import dataSources from './dataSources';
import store from './store';

const context = async({ req }: any) => {
  // 用户注册登录不做权限验证。
  if (
    req.body &&
    ['signUp', 'signInByPassword', 'signInByToken'].indexOf(
      req.body.operationName,
    ) !== -1
  ) {
    return;
  }

  const token = req.headers && req.headers.authorization;

  if (!token) {
    throw new ApolloError('登录失效。', 'INVALID_AUTHORIZATION');
  }

  const user = await store.users.findOne({ where: { token } });

  if (!user) {
    throw new ApolloError('登录失效。', 'INVALID_AUTHORIZATION');
  }

  return { user: user.get() };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  cors: {
    origin: 'http://localhost:3000',
  },
});
const port = Number(config.get('server.port'));

server
  .listen({ port: port })
  .then(({ url }) => console.log(`🚀 app running at ${url}`));
