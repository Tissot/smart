import * as React from 'react';
import { ApolloQueryResult } from 'apollo-boost';
import { graphql, OperationVariables, MutationFn } from 'react-apollo';
import gql from 'graphql-tag';
import { Upload, Button, Icon } from 'antd';
import { DataSet } from '@antv/data-set';

import { LocaleContext } from '$contexts/Locale';

interface UploadDataInputProps {
  onDataUploaded(
    variables?: OperationVariables | undefined,
  ): Promise<ApolloQueryResult<any>>;
}

interface Response {
  data: string;
}

interface Variables {
  name: string;
  data: string;
}

interface UploadDataProps {
  uploadData: MutationFn<Response, Variables> | undefined;
}

const ADD_DATA_SOURCE = gql`
  mutation addDataSource($name: String!, $data: String!) {
    addDataSource(name: $name, data: $data) {
      id
    }
  }
`;

function UploadData(props: UploadDataProps) {
  const { locale } = React.useContext(LocaleContext);
  const { uploadData } = props;

  const beforeUpload = React.useCallback(file => {
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = function(event: FileReaderEventMap['load']) {
      if (event.target) {
        const data = (event.target as any).result;
        const dataSetView = new DataSet.View().source(data, {
          type: 'csv',
        });

        uploadData &&
          uploadData({
            variables: {
              name: file.name,
              data: JSON.stringify(dataSetView.rows),
            },
          });
      }
    };

    return false;
  }, []);

  return (
    <Upload accept=".csv" showUploadList={false} beforeUpload={beforeUpload}>
      <Button>
        <Icon type="upload" />
        {locale.common.uploadData}
      </Button>
    </Upload>
  );
}

export default React.memo(
  graphql<UploadDataInputProps, Response, Variables, UploadDataProps>(
    ADD_DATA_SOURCE,
    {
      options: ({ onDataUploaded }) => ({
        onCompleted: onDataUploaded,
      }),
      props: ({ mutate }) => ({
        uploadData: mutate,
      }),
    },
  )(UploadData),
);
