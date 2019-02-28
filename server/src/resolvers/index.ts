import { userMutation } from './Users';
import { dataSourcesQuery, dataSourcesMutation } from './DataSources';

export default {
  Query: {
    ...dataSourcesQuery,
  },
  Mutation: {
    ...userMutation,
    ...dataSourcesMutation,
  },
};
