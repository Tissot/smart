import { Config } from 'apollo-server';

import { Report } from '../store';

interface ReportsQuery {
  // getReportById(
  //   parent: any,
  //   args: { id: string },
  //   context: Config['context'],
  //   info: any,
  // ): Promise<Report>;
  getReports(
    parent: any,
    args: {},
    context: Config['context'],
    info: any,
  ): Promise<Report[]>;
}

interface ReportsMutation {
  addReport(
    parent: any,
    args: {},
    context: Config['context'],
    info: any,
  ): Promise<Report>;
  removeReport(
    parent: any,
    args: { id: string },
    context: Config['context'],
    info: any,
  ): Promise<boolean>;
  // renameReport(
  //   parent: any,
  //   args: { id: string; name: string },
  //   context: Config['context'],
  //   info: any,
  // ): boolean;
}

export const reportsQuery: ReportsQuery = {
  // getReportById: async(_, { id }, { dataSources }) => {
  //   const report = await dataSources.reportsgetReportById(id);

  //   return report;
  // },
  getReports: async(_, __, { dataSources }) => {
    const reports = await dataSources.reports.getReports();

    return reports;
  },
};

export const reportsMutation: ReportsMutation = {
  addReport: async(_, {}, { dataSources }) => {
    const report = await dataSources.reports.addReport();

    return report;
  },
  removeReport: async(_, { id }, { dataSources }) => {
    const successful = await dataSources.reports.removeReport(id);

    return successful;
  },
  // renameReport: async(_, { id, name }, { dataSources }) => {
  //   const successful = await dataSources.reports.renameReport(id, name);

  //   return successful;
  // },
};
