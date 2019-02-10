import * as React from 'react';
import Error from '$components/Error';

import './index.less';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// prettier-ignore
export default class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }
  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public render() {
    return this.state.hasError ? <Error /> : this.props.children;
  }
}
