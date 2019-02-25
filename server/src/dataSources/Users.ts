import { Config, ApolloError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import * as jwt from 'jsonwebtoken';
import config from 'config';

import { Store } from './index';

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

  public async signUp(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string; token: string }> {
    const secret = config.get<string>('server.secret');
    const token = jwt.sign({ username, now: Date.now() }, secret);
    const [user, create] = await this._store.users.findOrCreate({
      where: { username },
      defaults: { password, token } as any,
    });

    if (!create) {
      throw new ApolloError('用户名已存在。', 'USERNAME_EXISTED');
    }

    const id = user.getDataValue('id');

    return { id, username, token };
  }

  public async signInByPassword(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string; token: string }> {
    const secret = config.get<string>('server.secret');
    const user = await this._store.users.findOne({
      where: { username, password },
    });

    if (!user) {
      throw new ApolloError(
        '用户名不存在或密码错误',
        'NONEXISTENT_USERNAME_OR_WRONG_PASSWORD',
      );
    }

    const token = jwt.sign({ username, now: Date.now() }, secret);
    const id = user.getDataValue('id');

    await user.update({ token });

    return { id, username, token };
  }

  public async signInByToken(
    id: string,
    token: string,
  ): Promise<{ id: string; username: string; token: string }> {
    const secret = config.get<string>('server.secret');
    const user = await this._store.users.findOne({
      where: { id, token },
    });

    if (!user) {
      throw new ApolloError('登录失效', 'INVALID_AUTHORIZATION');
    }

    const username = user.getDataValue('username');
    token = jwt.sign({ username, now: Date.now() }, secret);

    await user.update({ token });

    return { id, username, token };
  }
}
