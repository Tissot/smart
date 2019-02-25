import * as React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { message } from 'antd';

import Routes from '$routes/index';

import ErrorBoundary from '$components/ErrorBoundary';

import { UserProvider } from '$contexts/User';
import { LocaleProvider, LocaleContext } from '$contexts/Locale';

import './App.less';

export default React.memo(function App() {
  const { locale } = React.useContext(LocaleContext);
  const client = React.useMemo(
    () =>
      new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.map(({ message: errorMessage, extensions }) => {
              if (!extensions) {
                message.error(errorMessage);

                return;
              }

              switch (extensions!.code) {
                case 'INVALID_AUTHORIZATION':
                  message.error(locale.error.invalidAuthorization);
                  break;
                case 'NONEXISTENT_USERNAME_OR_WRONG_PASSWORD':
                  message.error(
                    locale.error.nonexistentUsernameOrWrongPassword,
                  );
                  break;
                default:
                  message.error(errorMessage);
                  break;
              }
            });

            if (networkError) message.error(locale.error.networkError);
          }
        },
      }),
    [],
  );

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <LocaleProvider>
          <ErrorBoundary>
            <Routes />
          </ErrorBoundary>
        </LocaleProvider>
      </UserProvider>
    </ApolloProvider>
  );
});
