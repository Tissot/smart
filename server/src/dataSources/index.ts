import store from '../store';

import Users from './Users';
import DataSources from './DataSources';

export default () => ({
  users: new Users(store),
  dataSources: new DataSources(store),
});
