import * as React from 'react';

import { Layout } from 'antd';

import './index.less';

const { Sider } = Layout;

interface ConfigPanelProps {}

export default React.memo(function ConfigPanel(props: ConfigPanelProps) {
  console.log(`$ConfigPanel re-render`);

  return <Sider className="config-panel">ConfigPanel</Sider>;
});