import * as React from 'react';
import { Router } from '@reach/router';

import Home from '$routes/User/Home';
import Reports from '$routes/User/Home/Reports';
import DataSources from '$routes/User/Home/DataSources';
import Report from '$routes/User/Report';

import Loading from '$components/Loading';

const SignIn = React.lazy(async() => import('$routes/SignIn'));
const User = React.lazy(async() => import('$routes/User'));
const NotFound = React.lazy(async() => import('$routes/NotFound'));

export const AbsoluteRoute = {
  SignIn: '/',
  User: {
    Path: '/user/:userId',
    Home: {
      Path: '/user/:userId',
      Reports: '/user/:userId',
      DataSources: '/user/:userId/data-sources',
    },
    Report: '/user/:userId/report/:reportId',
  },
};

export default React.memo(function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Router className="App">
        <SignIn path="/" />
        <User path="/user/:userId">
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
    </React.Suspense>
  );
});
