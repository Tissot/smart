import * as React from 'react';

import './index.less';

export default React.memo(function Error() {
  console.log('$Error re-render');

  return <span>Error :(</span>;
});
