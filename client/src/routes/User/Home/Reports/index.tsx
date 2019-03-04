import * as React from 'react';
import { NavigateFn } from '@reach/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Icon } from 'antd';

import { AbsoluteRoute } from '$routes/index';

import { LocaleContext } from '$contexts/Locale';

import CustomList from '$components/CustomList';

import { ReactComponent as ReportSvg } from '$assets/icons/report.svg';

interface ReportsProps {
  path: string;
  navigate?: NavigateFn;
}

const GET_REPORTS = gql`
  query {
    getReports {
      rows {
        id
        createdAt
        updatedAt
        name
      }
      count
    }
  }
`;

const ADD_REPORT = gql`
  mutation {
    addReport {
      id
    }
  }
`;

const REMOVE_REPORT = gql`
  mutation removeReport($id: ID!) {
    removeReport(id: $id)
  }
`;

const reportIcon = (
  <Icon
    component={ReportSvg as any}
    style={{ fontSize: 32, color: '#1890ff' }}
  />
);

export default React.memo(function Reports(props: ReportsProps) {
  const { locale } = React.useContext(LocaleContext);
  const { navigate } = props;
  const reportsHeader = React.useCallback(
    ({ refetch }) => (
      <Mutation
        mutation={ADD_REPORT}
        onCompleted={async({ addReport: { id } }) => {
          await refetch();
          navigate!(AbsoluteRoute.User.Report.replace(':reportId', id));
        }}
      >
        {(addReport, { loading }) => (
          <Button
            type="primary"
            icon="plus"
            loading={loading}
            onClick={addReport as any}
          >
            {locale.user.home.reports.addReport}
          </Button>
        )}
      </Mutation>
    ),
    [locale],
  );
  const handleListItemClick = React.useCallback(
    (id: string) =>
      props.navigate!(AbsoluteRoute.User.Report.replace(':reportId', id)),
    [],
  );
  const reportNameFormatter = React.useCallback(
    (name: string) => name || locale.user.home.reports.unnamedReport,
    [locale],
  );

  return (
    <div>
      <CustomList
        responseKey="getReports"
        getListItems={GET_REPORTS}
        removeListItem={REMOVE_REPORT}
        itemIcon={reportIcon}
        listHeader={reportsHeader}
        handleListItemClick={handleListItemClick}
        itemNameFormatter={reportNameFormatter}
      />
    </div>
  );
});
