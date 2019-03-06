import { Config, ApolloError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';

import { Store } from '../store';

export default class Reports extends DataSource {
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

  public async getReport(id: string) {
    const ownerId = this._context.user.id;

    const report = await this._store.reports.findOne({
      where: {
        id,
        ownerId,
      },
    });

    if (!report) {
      throw new ApolloError('报告不存在。', 'REPORT_NOT_FOUND');
    }

    return report.get();
  }

  public async getAllReports() {
    const ownerId = this._context.user.id;

    const reports = await this._store.reports.findAndCountAll({
      where: { ownerId },
      order: [['updatedAt', 'DESC']],
    });

    return reports;
  }

  public async addReport() {
    const ownerId = this._context.user.id;
    const elements = JSON.stringify([]);

    const report = await this._store.reports.create({
      ownerId,
      name: '',
      elements,
    } as any);

    return report.get();
  }

  public async removeReport(id: string) {
    const ownerId = this._context.user.id;

    const reportRemovedCount = await this._store.reports.destroy({
      where: { id, ownerId },
    });

    if (!reportRemovedCount) {
      throw new ApolloError('报告不存在。', 'REPORT_NOT_FOUND');
    }

    return !!reportRemovedCount;
  }

  public async renameReport(id: string, name: string) {
    const ownerId = this._context.user.id;

    const [reportRenamedCount] = await this._store.reports.update(
      { name },
      {
        where: { id, ownerId },
      },
    );

    if (!reportRenamedCount) {
      throw new ApolloError('报告不存在。', 'REPORT_NOT_FOUND');
    }

    return !!reportRenamedCount;
  }

  public async saveReportEls(id: string, elements: string) {
    const ownerId = this._context.user.id;

    const [reportSavedCount] = await this._store.reports.update(
      { elements },
      {
        where: { id, ownerId },
      },
    );

    if (!reportSavedCount) {
      throw new ApolloError('报告不存在。', 'REPORT_NOT_FOUND');
    }

    return !!reportSavedCount;
  }
}
