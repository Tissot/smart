import * as React from 'react';

import { Layout, Icon } from 'antd';

import { Link } from '@reach/router';

import RouteNames from '$routes/constants';

import ReportEditor from '$components/ReportEditor';

import './index.less';

const { Header } = Layout;

interface ReportProps {
  path: string;
}

export default React.memo(function Report(props: ReportProps) {
  console.log('$Report re-render');

  return (
    <Layout className="page-container">
      <Header>
        <Link to={`${RouteNames.User.Home}/Tissot`}>
          <Icon type="left" />
        </Link>
      </Header>
      <ReportEditor />
    </Layout>
  );
});
