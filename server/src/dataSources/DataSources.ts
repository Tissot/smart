import { Config, ApolloError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';

import { Store } from '../store';

export default class DataSources extends DataSource {
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

  public async getDataSources() {
    const ownerId = this._context.user.id;

    const dataSources = await this._store.dataSources.findAndCountAll({
      where: { ownerId },
      order: [['updatedAt', 'DESC']],
    });

    return dataSources;
  }

  public async addDataSource(name: string, data: string) {
    const ownerId = this._context.user.id;

    const dataSource = await this._store.dataSources.create({
      ownerId,
      name,
      data,
    } as any);

    return dataSource.get();
  }

  public async removeDataSource(id: string) {
    const ownerId = this._context.user.id;

    const dataSourcesRemovedCount = await this._store.dataSources.destroy({
      where: { id, ownerId },
    });

    if (!dataSourcesRemovedCount) {
      throw new ApolloError('数据源不存在。', 'DATA_SOURCE_NOT_FOUND');
    }

    return !!dataSourcesRemovedCount;
  }
}
