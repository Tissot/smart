import * as React from 'react';

import { LocaleContext } from '$contexts/LocaleContext';

import './index.less';

interface NotFoundProps {
  default: boolean;
}

export default React.memo(function NotFound(props: NotFoundProps) {
  const { locale } = React.useContext(LocaleContext);

  return <span>{locale.notFound}</span>;
});
