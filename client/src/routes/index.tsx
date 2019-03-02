import * as React from 'react';
import { Router } from '@reach/router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { UserContext } from '$contexts/User';

import Home from '$routes/User/Home';
import Reports from '$routes/User/Home/Reports';
import DataSources from '$routes/User/Home/DataSources';
import Report from '$routes/User/Report';

import DoActionOnMount from '$components/DoActionOnMount';
import Loading from '$components/Loading';

const SignIn = React.lazy(async() => import('$routes/SignIn'));
const User = React.lazy(async() => import('$routes/User'));
const NotFound = React.lazy(async() => import('$routes/NotFound'));

export const AbsoluteRoute = {
  SignIn: '/',
  User: {
    Path: '/',
    Home: {
      Path: '/',
      Reports: '/',
      DataSources: '/data-sources',
    },
    Report: '/report/:reportId',
  },
};

const SIGN_IN_BY_TOKEN = gql`
  mutation signInByToken($id: ID!, $token: String!) {
    signInByToken(id: $id, token: $token) {
      id
      username
      token
    }
  }
`;

export default React.memo(function Routes(props) {
  const {
    user: { id, username, token, hasSignedIn },
    setUser,
  } = React.useContext(UserContext);
  const onMutationCompleted = React.useCallback(({ signInByToken }) => {
    const { id, username, token } = signInByToken;
    setUser({ id, username, token, hasSignedIn: true });
  }, []);

  return (
    <React.Suspense fallback={<Loading />}>
      <Mutation
        mutation={SIGN_IN_BY_TOKEN}
        variables={{
          id,
          token,
        }}
        onCompleted={onMutationCompleted}
      >
        {(signInByToken, { loading, error }) => {
          if (!id || !username || !token) {
            return (
              <Router className="Routes">
                <SignIn path="/" />
                <NotFound default />
              </Router>
            );
          }

          if (!hasSignedIn) {
            return <DoActionOnMount doAction={signInByToken} />;
          }

          if (loading) return <Loading />;

          if (error) {
            return (
              <Router className="Routes">
                <SignIn path="/" />
                <NotFound default />
              </Router>
            );
          }

          return (
            <Router className="Routes">
              <User path="/">
                <Home path="/">
                  <Reports path="/" />
                  <DataSources path="data-sources" />
                  <NotFound default />
                </Home>
                <Report path="report/:reportId" />
                <NotFound default />
              </User>
              <NotFound default />
            </Router>
          );
        }}
      </Mutation>
    </React.Suspense>
  );
});
