import * as React from 'react';

import { Layout } from 'antd';

import './index.less';

const { Sider } = Layout;

interface ConfigPanelProps {}

export default React.memo(function ConfigPanel(props: ConfigPanelProps) {
  return <Sider className="config-panel">ConfigPanel</Sider>;
});
