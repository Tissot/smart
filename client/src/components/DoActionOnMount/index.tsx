import * as React from 'react';

interface DoActionOnMountProps {
  doAction(): any;
}

export default React.memo(function DoActionOnMount(
  props: DoActionOnMountProps,
) {
  React.useEffect(() => {
    props.doAction();
  }, []);

  return null;
});
