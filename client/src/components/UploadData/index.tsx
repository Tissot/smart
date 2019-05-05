import * as React from 'react';
import { graphql, MutationFn } from 'react-apollo';
import gql from 'graphql-tag';
import { Upload, Button, Icon, message } from 'antd';
import { DataSet } from '@antv/data-set';

import { LocaleContext } from '$contexts/Locale';

interface UploadDataInputProps {
  onDataUploaded(): void;
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
        if (file.type === 'application/json') {
          // 确保上传的 json 文件内容格式正确。
          try {
            const data = JSON.stringify(
              JSON.parse((event.target as any).result),
            );
            uploadData &&
              uploadData({
                variables: {
                  name: file.name,
                  data,
                },
              });
          } catch (error) {
            message.error(locale.error.fileContentError);
          }
        }

        if (file.type === 'text/csv') {
          const dataView = new DataSet.View()
            .source((event.target as any).result, {
              type: 'csv',
            })
            // 上传数据类型自动转换，优先级: Number > Text。
            .transform({
              type: 'map',
              callback(row: any) {
                const result = {};

                for (const key in row) {
                  const valueToNumber = Number(row[key]);

                  if (!Number.isNaN(valueToNumber)) {
                    result[key] = valueToNumber;
                    continue;
                  }

                  result[key] = row[key];
                }

                return result;
              },
            });

          uploadData &&
            uploadData({
              variables: {
                name: file.name,
                data: JSON.stringify(dataView.rows),
              },
            });
        }
      }
    };

    return false;
  }, []);

  return (
    <Upload
      accept=".csv,.json"
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      <Button>
        <Icon type="upload" />
        {locale.user.home.dataSources.addDataSource}
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
