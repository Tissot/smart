import * as React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { message } from 'antd';

import { UserContext } from '$contexts/User';
import { LocaleContext } from '$contexts/Locale';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export default React.memo(function(props: ApolloProviderProps) {
  const { locale } = React.useContext(LocaleContext);
  const { user, setUser } = React.useContext(UserContext);
  const client = React.useMemo(
    () =>
      new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        headers: {
          authorization: user.token,
        },
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
                  setUser({
                    id: '',
                    username: '',
                    token: '',
                    hasSignedIn: false,
                  });
                  break;
                case 'EXISTING_USERNAME':
                  message.error(locale.error.existingUsername);
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
    [user],
  );

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
});
