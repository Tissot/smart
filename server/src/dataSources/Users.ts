import { Config, ApolloError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import * as jwt from 'jsonwebtoken';
import config from 'config';

import { Store } from '../store';

export default class Users extends DataSource {
  private _store: Store;
  private _context: any;

  public constructor(store: Store) {
    super();
    this._store = store;
    this._store;
  }

  public initialize(config: Config) {
    this._context = config.context;
    this._context;
  }

  public async signUp(username: string, password: string) {
    const secret = config.get<string>('server.secret');
    const token = jwt.sign({ username, now: Date.now() }, secret);
    const [user, create] = await this._store.users.findOrCreate({
      where: { username },
      defaults: { password, token } as any,
    });

    if (!create) {
      throw new ApolloError('用户名已存在。', 'EXISTING_USERNAME');
    }

    return user.get();
  }

  public async signInByPassword(username: string, password: string) {
    const secret = config.get<string>('server.secret');
    const user = await this._store.users.findOne({
      where: { username, password },
    });

    if (!user) {
      throw new ApolloError(
        '用户名不存在或密码错误。',
        'NONEXISTENT_USERNAME_OR_WRONG_PASSWORD',
      );
    }

    const token = jwt.sign({ username, now: Date.now() }, secret);
    const updatedUser = await user.update({ token });

    return updatedUser.get();
  }

  public async signInByToken(id: string, token: string) {
    const secret = config.get<string>('server.secret');
    const user = await this._store.users.findOne({
      where: { id, token },
    });

    if (!user) {
      throw new ApolloError('登录失效。', 'UNAUTHORIZED');
    }

    const username = user.getDataValue('username');
    const newToken = jwt.sign({ username, now: Date.now() }, secret);
    const updatedUser = await user.update({ token: newToken });

    return updatedUser.get();
  }
}
