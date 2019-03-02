import { userMutation } from './Users';
import { dataSourcesQuery, dataSourcesMutation } from './DataSources';
import { reportsQuery, reportsMutation } from './Reports';

export default {
  Query: {
    ...dataSourcesQuery,
    ...reportsQuery,
  },
  Mutation: {
    ...userMutation,
    ...dataSourcesMutation,
    ...reportsMutation,
  },
};
