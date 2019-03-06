import { userMutation } from './Users';
import { reportsQuery, reportsMutation } from './Reports';
import { dataSourcesQuery, dataSourcesMutation } from './DataSources';

export default {
  Query: {
    ...reportsQuery,
    ...dataSourcesQuery,
  },
  Mutation: {
    ...userMutation,
    ...reportsMutation,
    ...dataSourcesMutation,
  },
};
