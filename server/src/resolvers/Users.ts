import { UserInputError, Config } from 'apollo-server';

interface UsersMutation {
  signUp(
    parent: any,
    args: { username: string; password: string },
    context: Config['context'],
    info: any,
  ): Promise<{ id: string; username: string; token: string }>;
  signInByPassword(
    parent: any,
    args: { username: string; password: string },
    context: Config['context'],
    info: any,
  ): Promise<{ id: string; username: string; token: string }>;
  signInByToken(
    parent: any,
    args: { id: string; token: string },
    context: Config['context'],
    info: any,
  ): Promise<{ id: string; username: string; token: string }>;
}

const Mutation: UsersMutation = {
  signUp: async(_, { username, password }, context) => {
    if (!/^[\da-zA-Z]{3,15}$/g.test(username)) {
      throw new UserInputError('用户名长度为 3 ～ 15，由字母或数字组成。');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\da-zA-Z]{6,15}$/.test(password)) {
      throw new UserInputError(
        '密码长度为 6 ～ 15，且至少有一个小写字母、大写字母以及数字。',
      );
    }

    const user = await context.dataSources.users.signUp(username, password);

    return user;
  },
  signInByPassword: async(_, { username, password }, context) => {
    if (!/^[\da-zA-Z]{3,15}$/g.test(username)) {
      throw new UserInputError('用户名长度为 3 ～ 15，由字母或数字组成。');
    }

    const user = await context.dataSources.users.signInByPassword(
      username,
      password,
    );

    return user;
  },
  signInByToken: async(_, { id, token }, context) => {
    const user = await context.dataSources.users.signInByToken(id, token);

    return user;
  },
};

export default {
  Mutation,
};
