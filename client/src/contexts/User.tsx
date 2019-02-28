import * as React from 'react';
import { navigate } from '@reach/router';

import { AbsoluteRoute } from '$routes/index';

interface User {
  id: string;
  username: string;
  token: string;
  hasSignedIn: boolean;
}

export const UserContext = React.createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}>({
  user: {
    id: window.localStorage.getItem('id') || '',
    username: window.localStorage.getItem('username') || '',
    token: window.localStorage.getItem('token') || '',
    hasSignedIn: false,
  },
  // tslint:disable-next-line
  setUser: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = React.memo(function UserProvider(
  props: UserProviderProps,
) {
  const [user, setUser] = React.useState({
    id: window.localStorage.getItem('id') || '',
    username: window.localStorage.getItem('username') || '',
    token: window.localStorage.getItem('token') || '',
    hasSignedIn: false,
  });
  const UserContextValue = React.useMemo(() => ({ user, setUser }), [user]);

  React.useEffect(() => {
    const { id, username, token } = user;

    if (!id || !username || !token) {
      navigate(AbsoluteRoute.SignIn);
    }

    window.localStorage.setItem('id', id);
    window.localStorage.setItem('username', username);
    window.localStorage.setItem('token', token);
  }, [user]);

  return (
    <UserContext.Provider value={UserContextValue}>
      {props.children}
    </UserContext.Provider>
  );
});
