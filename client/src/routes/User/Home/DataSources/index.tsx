import * as React from 'react';
import gql from 'graphql-tag';
import { Icon, message } from 'antd';

import CustomList from '$components/CustomList';
import UploadData from '$components/UploadData';

import { Locale } from '$assets/locales';
import { ReactComponent as DataSourceSvg } from '$assets/icons/data-source.svg';

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
  mutation removeDataSource($id: ID!) {
    removeDataSource(id: $id)
  }
`;

const dataSourceIcon = (
  <Icon
    component={DataSourceSvg as any}
    style={{ fontSize: 32, color: '#1890ff' }}
  />
);

const dataSourcesHeader = ({ refetch }: any, locale: Locale) => (
  <UploadData onDataUploaded={() => {
    refetch();
    message.success(locale.user.home.dataSources.uploadSuccessfully);
  }} />
);

export default React.memo(function DataSources(props: DataSourcesProps) {
  return (
    <div>
      <CustomList
        responseKey="getDataSources"
        getListItems={GET_DATA_SOURCES}
        removeListItem={REMOVE_DATA_SOURCE}
        itemIcon={dataSourceIcon}
        listHeader={dataSourcesHeader}
      />
    </div>
  );
});
