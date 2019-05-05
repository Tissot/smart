import * as React from 'react';
import { LocaleContext } from '$contexts/Locale';

import './index.less';

export default React.memo(function Error() {
  const { locale } = React.useContext(LocaleContext);

  return <div className="error">{locale.common.error}</div>;
});
