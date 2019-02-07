import * as React from 'react';
import { Spin } from 'antd';

import { LocaleContext } from '$contexts/LocaleContext';

import './index.less';

interface LoadingProps {
  children?: React.ReactNode;
}

export default React.memo(function Loading(props: LoadingProps) {
  console.log('$Loading re-render');

  const [locale] = React.useContext(LocaleContext);

  return <Spin tip={locale.common.loading}>{props.children}</Spin>;
});
