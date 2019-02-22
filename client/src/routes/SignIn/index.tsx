import * as React from 'react';
import { Link } from '@reach/router';

import { AbsoluteRoute } from '$routes/index';

import './index.less';

interface SignInProps {
  path: string;
}

export default React.memo(function SignIn(props: SignInProps) {
  return (
    <React.Fragment>
      <Link to={AbsoluteRoute.User.Path.replace(':userId', 'Tissot')}>
        User
      </Link>
      Sign In
    </React.Fragment>
  );
});
