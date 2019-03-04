import { Config } from 'apollo-server';

import { DataSource } from '../store';

interface DataSourcesQuery {
  getDataSources(
    parent: any,
    args: {},
    context: Config['context'],
    info: any,
  ): Promise<DataSource[]>;
}

interface DataSourcesMutation {
  addDataSource(
    parent: any,
    args: { name: string; data: string },
    context: Config['context'],
    info: any,
  ): Promise<DataSource>;
  removeDataSource(
    parent: any,
    args: { id: string },
    context: Config['context'],
    info: any,
  ): Promise<boolean>;
}

export const dataSourcesQuery: DataSourcesQuery = {
  getDataSources: async(_, __, { dataSources }) => {
    const dataSourcesFound = await dataSources.dataSources.getDataSources();

    return dataSourcesFound;
  },
};

export const dataSourcesMutation: DataSourcesMutation = {
  addDataSource: async(_, { name, data }, { dataSources }) => {
    const dataSource = await dataSources.dataSources.addDataSource(name, data);

    return dataSource;
  },
  removeDataSource: async(_, { id }, { dataSources }) => {
    const successful = await dataSources.dataSources.removeDataSource(id);

    return successful;
  },
};
