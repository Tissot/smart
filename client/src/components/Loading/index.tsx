import * as React from 'react';
import { Spin } from 'antd';

import { LocaleContext } from '$contexts/Locale';

interface LoadingProps {
  children?: React.ReactNode;
}

export default React.memo(function Loading(props: LoadingProps) {
  const { locale } = React.useContext(LocaleContext);

  return (
    <div className="loading">
      <Spin tip={locale.common.loading}>{props.children}</Spin>
    </div>
  );
});
