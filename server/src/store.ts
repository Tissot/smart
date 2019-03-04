import SQL, { Instance } from 'sequelize';
import config from 'config';

export interface User {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  username: string;
  password: string;
  token: string;
}

export interface Report {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId: string;
  name: string;
  elements: string;
}

export interface DataSource {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId: string;
  name: string;
  data: string;
}

export interface Store {
  users: SQL.Model<Instance<User>, User>;
  reports: SQL.Model<Instance<Report>, Report>;
  dataSources: SQL.Model<Instance<DataSource>, DataSource>;
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

const reports = db.define<Instance<Report>, Report>(
  'reports',
  {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      comment: '报告 id',
    },
    ownerId: {
      type: SQL.INTEGER,
      comment: '报告所有者 id',
    },
    name: {
      type: SQL.STRING,
      comment: '报告名',
    },
    elements: {
      type: SQL.TEXT,
      comment: '报告元素',
    },
  },
  { timestamps: true },
);

const dataSources = db.define<Instance<DataSource>, DataSource>(
  'dataSources',
  {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      comment: '数据源 id',
    },
    ownerId: {
      type: SQL.INTEGER,
      comment: '数据源所有者 id',
    },
    name: {
      type: SQL.STRING,
      comment: '数据源名',
    },
    data: {
      type: SQL.STRING,
      comment: '数据源数据',
    },
  },
  { timestamps: true },
);

export default { users, reports, dataSources };
