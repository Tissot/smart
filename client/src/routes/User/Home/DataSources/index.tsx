import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Loading from '$components/Loading';
import Error from '$components/Error';

interface DataSourcesProps {
  path: string;
}

const getHello = gql`
  {
    hello
  }
`;

export default React.memo(function DataSources(props: DataSourcesProps) {
  return (
    <Query query={getHello}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;

        if (error !== undefined) return <Error />;

        return (
          <React.Fragment>
            <span>{data.hello}</span>
          </React.Fragment>
        );
      }}
    </Query>
  );
});
