import * as React from 'react';

import { LocaleContext } from '$contexts/Locale';

import './index.less';

interface NotFoundProps {
  default: boolean;
}

export default React.memo(function NotFound(props: NotFoundProps) {
  const { locale } = React.useContext(LocaleContext);

  return <div className="not-found">{locale.notFound}</div>;
});
