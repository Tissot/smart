import * as React from 'react';

import { UserProvider } from '$contexts/User';
import { LocaleProvider } from '$contexts/Locale';

import Routes from '$routes/index';

import ErrorBoundary from '$components/ErrorBoundary';
import ApolloProvider from '$components/ApolloProvider';

import './App.less';

export default React.memo(function App() {
  return (
    <UserProvider>
      <LocaleProvider>
        <ErrorBoundary>
          <ApolloProvider>
            <Routes />
          </ApolloProvider>
        </ErrorBoundary>
      </LocaleProvider>
    </UserProvider>
  );
});
