import * as React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { List, Button, Icon } from 'antd';
import moment from 'moment';

import { LocaleContext } from '$contexts/Locale';

import Loading from '$components/Loading';
import Error from '$components/Error';
import UploadData from '$components/UploadData';

import './index.less';

interface DataSourcesProps {
  path: string;
}

const GET_DATA_SOURCES = gql`
  query {
    getDataSources {
      rows {
        id
        createdAt
        updatedAt
        name
      }
      count
    }
  }
`;

const REMOVE_DATA_SOURCE = gql`
  mutation removeDataSource($id: String!) {
    removeDataSource(id: $id)
  }
`;

export default React.memo(function DataSources(props: DataSourcesProps) {
  const { locale } = React.useContext(LocaleContext);

  return (
    <div className="data-sources">
      <Query query={GET_DATA_SOURCES}>
        {({ data, loading, error, refetch: refetchDataSources }) => {
          if (loading) return <Loading />;

          if (error) return <Error />;

          return (
            data &&
            data.getDataSources &&
            data.getDataSources.rows && (
              <List
                header={<UploadData onDataUploaded={refetchDataSources} />}
                bordered
                dataSource={data.getDataSources.rows}
                renderItem={(item: any) => (
                  <List.Item key={item.id} className="data-source">
                    <div className="left-section">
                      <Icon
                        type="database"
                        style={{ fontSize: 28, color: '#1890ff' }}
                      />
                      <div className="data-source-info">
                        <span className="data-source-name">{item.name}</span>
                        <div className="data-source-op-time">
                          <span>
                            {locale.common.createdAt}:{' '}
                            {moment(item.createdAt).format('lll')}
                          </span>
                          <span>
                            {locale.common.updatedAt}:{' '}
                            {moment(item.updatedAt).format('lll')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Mutation
                      mutation={REMOVE_DATA_SOURCE}
                      variables={{ id: item.id }}
                      onCompleted={refetchDataSources}
                    >
                      {(removeDataSource, { loading }) => {
                        return (
                          <Button
                            type="danger"
                            shape="circle"
                            icon="delete"
                            loading={loading}
                            onClick={removeDataSource as any}
                          />
                        );
                      }}
                    </Mutation>
                  </List.Item>
                )}
              />
            )
          );
        }}
      </Query>
    </div>
  );
});
