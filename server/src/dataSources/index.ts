import SQL, { Instance } from 'sequelize';
import config from 'config';

import Users from './Users';

interface User {
  id: string;
  username: string;
  password: string;
  token: string;
}

export interface Store {
  users: SQL.Model<Instance<User>, User>;
}

const db = new SQL({
  ...config.get('db'),
  dialect: 'sqlite',
  storage: './store.sqlite',
  operatorsAliases: false,
  logging: false,
});

const users = db.define<Instance<User>, User>(
  'user',
  {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      comment: '用户 id',
    },
    username: {
      type: SQL.STRING,
      unique: true,
      comment: '用户名',
    },
    password: {
      type: SQL.STRING,
      comment: '用户密码',
    },
    token: {
      type: SQL.STRING,
      unique: true,
      comment: '用户 token',
    },
  },
  { timestamps: true },
);

const store = { users };

const dataSources = () => ({
  users: new Users(store),
});

export default dataSources;
