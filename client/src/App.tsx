import * as React from 'react';
import { Router } from '@reach/router';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import RouteNames from '$routes/constants';

import Loading from '$components/Loading';
import ErrorBoundary from '$components/ErrorBoundary';

import { LocaleProvider } from '$contexts/LocaleContext';

import './App.less';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
});

const User = React.lazy(async() => import('$routes/User'));
const SignIn = React.lazy(async() => import('$routes/SignIn'));
const Report = React.lazy(async() => import('$routes/Report'));
const NotFound = React.lazy(async() => import('$routes/NotFound'));

export default React.memo(function App() {
  console.log('$App re-render');

  // Router 的 children 的 props 总会更新，无法用 React.Memo 来阻止 children 进行 re-render，只好通过这种方式了。
  // prettier-ignore
  const memoSignIn = React.useMemo(
    () => <SignIn path={RouteNames.SignIn} />,
    [RouteNames.SignIn],
  );
  const memoUser = React.useMemo(
    () => <User path={`${RouteNames.User.Home}/:userId`} />,
    [RouteNames.User.Home],
  );
  const memoReport = React.useMemo(
    () => <Report path={`${RouteNames.User.Home}/:userId/:reportPath`} />,
    [RouteNames.User.Home],
  );
  const memoNotFound = React.useMemo(
    () => <NotFound path={RouteNames.NotFound} />,
    [RouteNames.NotFound],
  );

  return (
    <ApolloProvider client={client}>
      <LocaleProvider>
        <ErrorBoundary>
          <React.Suspense fallback={<Loading />}>
            <Router className="App">
              {memoSignIn}
              {memoUser}
              {memoReport}
              {memoNotFound}
            </Router>
          </React.Suspense>
        </ErrorBoundary>
      </LocaleProvider>
    </ApolloProvider>
  );
});
