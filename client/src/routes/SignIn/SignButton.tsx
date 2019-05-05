import * as React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, message } from 'antd';

import { UserContext } from '$contexts/User';
import { LocaleContext } from '$contexts/Locale';

import { FormValue } from './index';

interface SignButtonProps {
  type: 'sign-up' | 'sign-in';
  validateFields(options: Object): void;
}

const SIGN_UP = gql`
  mutation signUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      id
      username
      token
    }
  }
`;

const SIGN_IN_BY_PASSWORD = gql`
  mutation signInByPassword($username: String!, $password: String!) {
    signInByPassword(username: $username, password: $password) {
      id
      username
      token
    }
  }
`;

export default function SignButton(props: SignButtonProps) {
  const { setUser } = React.useContext(UserContext);
  const { locale } = React.useContext(LocaleContext);
  const { mutation, type, text } = React.useMemo(() => {
    if (props.type === 'sign-up') {
      return {
        mutation: SIGN_UP,
        type: 'default',
        text: locale.signIn.signUp,
      };
    } else {
      return {
        mutation: SIGN_IN_BY_PASSWORD,
        type: 'primary',
        text: locale.signIn.signIn,
      };
    }
  }, [props.type]);

  const onMutationCompleted = React.useCallback(response => {
    message.success(props.type === 'sign-up' ? locale.signIn.signUpSuccessfully : locale.signIn.signInSuccessfully);
    const data = response.signUp || response.signInByPassword;
    const { id, username, token } = data;
    setUser({ id, username, token, hasSignedIn: true });
  }, []);

  return (
    <Mutation mutation={mutation} onCompleted={onMutationCompleted}>
      {(mutate, { loading }) => {
        const onButtonClick = () =>
          props.validateFields((err: Error, formValue: FormValue) => {
            if (!err) {
              mutate({ variables: formValue });
            }
          });

        return (
          <Button type={type as any} loading={loading} onClick={onButtonClick}>
            {text}
          </Button>
        );
      }}
    </Mutation>
  );
}
