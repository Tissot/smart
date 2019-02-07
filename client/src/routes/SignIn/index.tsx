import * as React from 'react';
import { Link } from '@reach/router';

import RouteNames from '$routes/constants';

import './index.less';

interface SignInProps {
  path: string;
}

export default React.memo(function SignIn(props: SignInProps) {
  console.log('$SignIn re-render');

  return (
    <React.Fragment>
      <Link to={`${RouteNames.User.Home}/Tissot`}>User</Link>
      Sign In
    </React.Fragment>
  );
});
