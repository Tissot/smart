import * as React from 'react';
import { Link } from '@reach/router';
import { compose, graphql, Mutation, MutationFn } from 'react-apollo';
import gql from 'graphql-tag';
import { Layout, Icon } from 'antd';
import moment from 'moment';

import { LocaleContext } from '$contexts/Locale';

import { AbsoluteRoute } from '$routes/index';

import Loading from '$components/Loading';
import Error from '$components/Error';
import TextEditor from '$components/TextEditor';
import ReportEditor from '$components/ReportEditor';
import { ReportElType } from '$components/ReportEditor/widgets/ReportElement';

import './index.less';

const { Header } = Layout;

interface ReportProps {
  getReport: any;
  getDataSources: any;
  saveReport: MutationFn<any, any>;
}

const GET_REPORT = gql`
  query getReport($id: ID!) {
    getReport(id: $id) {
      id
      updatedAt
      name
      elements
    }
  }
`;

const GET_DATASOURCES = gql`
  query {
    getDataSources {
      rows {
        id
        name
        data
      }
      count
    }
  }
`;

const RENAME_REPORT = gql`
  mutation renameReport($id: ID!, $name: String!) {
    renameReport(id: $id, name: $name)
  }
`;

const SAVE_REPORT_ELS = gql`
  mutation saveReportEls($id: ID!, $elements: String!) {
    saveReportEls(id: $id, elements: $elements)
  }
`;

function Report(props: ReportProps) {
  const { getReport, getDataSources, saveReport } = props;
  const loading = getReport.loading || getDataSources.loading;
  const error = getReport.error || getDataSources.error;

  if (loading) return <Loading />;

  if (error) return <Error />;

  if (!getReport || !getDataSources || !saveReport) return null;

  const { locale } = React.useContext(LocaleContext);
  const [report, setReport] = React.useState(getReport.getReport);

  return (
    <Layout className="page-container">
      <Header className="report-header">
        <Link to={AbsoluteRoute.User.Home.Reports}>
          <Icon type="left" />
        </Link>
        <div className="report-info">
          <Mutation
            mutation={RENAME_REPORT}
            variables={{ id: report.id, name: report.name }}
          >
            {renameReport => {
              return (
                <TextEditor
                  className="title"
                  placeholder={locale.user.home.reports.unnamedReport}
                  text={report.name}
                  onKeyDown={event => {
                    if (event.keyCode === 13) {
                      event.preventDefault();
                      (event.target as any).blur();
                    }
                  }}
                  onChange={event =>
                    setReport({ ...report, name: event.target.value })
                  }
                  onBlur={e => renameReport()}
                />
              );
            }}
          </Mutation>
          <span className="detail">
            {locale.common.updatedAt}: {moment(report.updatedAt).format('lll')}
          </span>
        </div>
      </Header>
      <ReportEditor
        initialEls={report.elements}
        dataSources={getDataSources.getDataSources}
        onSave={reportEls => {
          saveReport({
            variables: {
              id: report.id,
              elements: JSON.stringify(
                reportEls.map(reportEl =>
                  reportEl.type === ReportElType.Chart
                    ? {
                        ...reportEl,
                        dataSource: {
                          ...reportEl.dataSource,
                          data: reportEl.dataSource.data.origin,
                        },
                      }
                    : reportEl,
                ),
              ),
            },
          });
          console.log(
            reportEls.map(reportEl =>
              reportEl.type === ReportElType.Chart
                ? {
                    ...reportEl,
                    dataSource: {
                      ...reportEl.dataSource,
                      data: reportEl.dataSource.data.origin,
                    },
                  }
                : reportEl,
            ),
          );
        }}
      />
    </Layout>
  );
}

// 后续打算用回 restful 重写该项目，下方的类型定义随便写了。
export default React.memo(
  compose(
    graphql<any, any, any, any>(GET_REPORT, {
      options: props => ({ variables: { id: props.reportId! } }),
      props: ({ data }) => {
        if (!data) return { data };

        const getReport = data.getReport
          ? {
              getReport: {
                ...data.getReport,
                elements: JSON.parse(data.getReport.elements),
              },
            }
          : {};

        return {
          getReport: {
            ...data,
            ...getReport,
          },
        };
      },
    }),
    graphql<any, any, any, any>(GET_DATASOURCES, {
      props: ({ data }) => {
        if (!data) return { data };

        const getDataSources = data.getDataSources
          ? {
              getDataSources: {
                ...data.getDataSources,
                rows: data.getDataSources.rows.map((dataSource: any) => ({
                  ...dataSource,
                  data: JSON.parse(dataSource.data),
                })),
              },
            }
          : {};

        return {
          getDataSources: {
            ...data,
            ...getDataSources,
          },
        };
      },
    }),
    graphql<any, any, any, any>(SAVE_REPORT_ELS, {
      props: ({ mutate }) => ({
        saveReport: mutate,
      }),
    }),
  )(Report),
);
