import * as React from 'react';

interface UserProps {
  children: React.ReactNode;
  path: string;
}

export default React.memo(function User(props: UserProps) {
  return <React.Fragment>{props.children}</React.Fragment>;
});
