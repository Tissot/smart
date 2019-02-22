import * as React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Routes from './routes';

import ErrorBoundary from '$components/ErrorBoundary';

import { LocaleProvider } from '$contexts/LocaleContext';

import './App.less';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
});

export default React.memo(function App() {
  return (
    <ApolloProvider client={client}>
      <LocaleProvider>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </LocaleProvider>
    </ApolloProvider>
  );
});
