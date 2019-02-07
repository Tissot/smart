import * as React from 'react';

import { LocaleContext } from '$contexts/LocaleContext';

import './index.less';

interface NotFoundProps {
  path: string;
}

export default React.memo(function NotFound(props: NotFoundProps) {
  console.log('$NotFound re-render');

  const [locale] = React.useContext(LocaleContext);

  return (
    <span>{locale.notFound}</span>
  );
});
