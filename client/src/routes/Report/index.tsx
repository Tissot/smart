import * as React from 'react';
import { Link } from '@reach/router';
import { Icon } from 'antd';

import RouteNames from '$routes/constants';

import ReportEditor from '$components/ReportEditor';

import './index.less';

interface ReportProps {
  path: string;
}

export default React.memo(function Report(props: ReportProps) {
  console.log('$Report re-render');

  return (
    <React.Fragment>
      <nav className="report-nav">
        <Link to={`${RouteNames.User.Home}/Tissot`}>
          <Icon type="left" />
        </Link>
      </nav>
      <ReportEditor />
    </React.Fragment>
  );
});
