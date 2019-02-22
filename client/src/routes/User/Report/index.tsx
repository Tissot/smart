import * as React from 'react';
import { Layout, Icon } from 'antd';
import { Link } from '@reach/router';

import { AbsoluteRoute } from '$routes/index';

import ReportEditor from '$components/ReportEditor';

import './index.less';

const { Header } = Layout;

interface ReportProps {
  path: string;
}

export default React.memo(function Report(props: ReportProps) {
  return (
    <Layout className="page-container">
      <Header>
        <Link to={AbsoluteRoute.User.Home.Reports.replace(':userId', 'Tissot')}>
          <Icon type="left" />
        </Link>
      </Header>
      <ReportEditor />
    </Layout>
  );
});
