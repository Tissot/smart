import store from '../store';

import Users from './Users';
import DataSources from './DataSources';
import Reports from './Reports';

export default () => ({
  users: new Users(store),
  reports: new Reports(store),
  dataSources: new DataSources(store),
});
