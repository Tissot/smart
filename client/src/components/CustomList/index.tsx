import * as React from 'react';
import { Query, Mutation, QueryResult, OperationVariables } from 'react-apollo';
import { List, Button } from 'antd';
import moment from 'moment';

import { LocaleContext } from '$contexts/Locale';

import Loading from '$components/Loading';
import Error from '$components/Error';
import DoActionOnMount from '$components/DoActionOnMount';

import './index.less';

interface CustomListProps {
  responseKey: string;
  itemIcon: React.ReactNode;
  getListItems: any;
  removeListItem?: any;
  listHeader?:
    | ((queryResult: QueryResult<any, OperationVariables>) => any)
    | React.ReactNode;
  handleListItemClick?(id: string): void;
  itemNameFormatter?(name: string): string;
}

export default React.memo(function CustomList(props: CustomListProps) {
  const { locale } = React.useContext(LocaleContext);
  const {
    responseKey,
    getListItems,
    handleListItemClick,
    removeListItem,
    itemIcon,
    itemNameFormatter,
    listHeader,
  } = props;

  return (
    <Query query={getListItems}>
      {queryResult => {
        const { data, loading, error, refetch } = queryResult;

        if (loading) return <Loading />;

        if (error) return <Error />;

        const dataSource =
          (data && data[responseKey] && data[responseKey].rows) || [];
        const header = listHeader
          ? typeof listHeader === 'function'
            ? (listHeader as (
                queryResult: QueryResult<any, OperationVariables>,
              ) => any)(queryResult)
            : listHeader
          : undefined;
        const listItemStyle = handleListItemClick
          ? { cursor: 'pointer' }
          : undefined;

        return (
          <div className="custom-list">
            <DoActionOnMount doAction={refetch} />
            <List
              header={header}
              bordered
              dataSource={dataSource}
              renderItem={(item: any) => (
                <List.Item
                  key={item.id}
                  className="list-item"
                  style={listItemStyle}
                  onClick={
                    handleListItemClick
                      ? e => handleListItemClick(item.id)
                      : undefined
                  }
                >
                  <div className="left-section">
                    {itemIcon}
                    <div className="list-item-info">
                      <span className="list-item-name">
                        {itemNameFormatter
                          ? itemNameFormatter(item.name)
                          : item.name}
                      </span>
                      <div className="list-item-op-time">
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
                  {removeListItem && (
                    <Mutation
                      mutation={removeListItem}
                      variables={{ id: item.id }}
                      onCompleted={refetch}
                    >
                      {(removeListItem, { loading }) => (
                        <Button
                          type="danger"
                          shape="circle"
                          icon="delete"
                          loading={loading}
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                          ) => {
                            e.stopPropagation();
                            removeListItem();
                          }}
                        />
                      )}
                    </Mutation>
                  )}
                </List.Item>
              )}
            />
          </div>
        );
      }}
    </Query>
  );
});
