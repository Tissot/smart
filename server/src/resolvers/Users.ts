import { UserInputError, Config } from 'apollo-server';

interface UsersMutation {
  signUp(
    parent: any,
    args: { username: string; password: string },
    context: Config['context'],
    info: any,
  ): any;
  signInByPassword(
    parent: any,
    args: { username: string; password: string },
    context: Config['context'],
    info: any,
  ): any;
  signInByToken(
    parent: any,
    args: { id: string; token: string },
    context: Config['context'],
    info: any,
  ): any;
}

export const userMutation: UsersMutation = {
  signUp: async(_, { username, password }, { dataSources }) => {
    if (!/^[\da-zA-Z]{3,15}$/g.test(username)) {
      throw new UserInputError('用户名长度为 3 ～ 15，由字母或数字组成。');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\da-zA-Z]{6,15}$/.test(password)) {
      throw new UserInputError(
        '密码长度为 6 ～ 15，且至少有一个小写字母、大写字母以及数字。',
      );
    }

    const user = await dataSources.users.signUp(username, password);

    return user;
  },
  signInByPassword: async(_, { username, password }, { dataSources }) => {
    if (!/^[\da-zA-Z]{3,15}$/g.test(username)) {
      throw new UserInputError('用户名长度为 3 ～ 15，由字母或数字组成。');
    }

    const user = await dataSources.users.signInByPassword(username, password);

    return user;
  },
  signInByToken: async(_, { id, token }, { dataSources }) => {
    const user = await dataSources.users.signInByToken(id, token);

    return user;
  },
};
