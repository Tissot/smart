import { Config } from 'apollo-server';

import { Report } from '../store';

interface ReportsQuery {
  getReport(
    parent: any,
    args: { id: string },
    context: Config['context'],
    info: any,
  ): Promise<Report>;
  getAllReports(
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
  renameReport(
    parent: any,
    args: { id: string; name: string },
    context: Config['context'],
    info: any,
  ): Promise<boolean>;
  saveReportEls(
    parent: any,
    args: { id: string; elements: string },
    context: Config['context'],
    info: any,
  ): Promise<boolean>;
}

export const reportsQuery: ReportsQuery = {
  getReport: async(_, { id }, { dataSources }) => {
    const report = await dataSources.reports.getReport(id);

    return report;
  },
  getAllReports: async(_, __, { dataSources }) => {
    const reports = await dataSources.reports.getAllReports();

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
  renameReport: async(_, { id, name }, { dataSources }) => {
    const successful = await dataSources.reports.renameReport(id, name);

    return successful;
  },
  saveReportEls: async(_, { id, elements }, { dataSources }) => {
    const successful = await dataSources.reports.saveReportEls(id, elements);

    return successful;
  },
};
