import * as React from 'react';
import { navigate, Link } from '@reach/router';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Layout, Menu, Divider, Dropdown, Button, Icon } from 'antd';

import RouteNames from '$routes/constants';

import Loading from '$components/Loading';
import Error from '$components/Error';

import { LocaleContext } from '$contexts/LocaleContext';

import { locales } from '$assets/locales';

import logo from '$images/logo.png';

import './index.less';

interface UserProps {
  path: string;
}

// interface MenuItem {
//   key: string;
//   value: string;
// }

const { Header, Sider, Content } = Layout;

export default React.memo(function User(props: UserProps) {
  console.log('$User re-render');

  const { locale, setLocale } = React.useContext(LocaleContext);
  // const [currentPath, setCurrentPath] = React.useState();
  // const menuItems: MenuItem[] = [
  //   {
  //     key: locales.en_US.user.home.title,
  //     value: locale.user.home.title,
  //   },
  // ];
  const localeItems = [
    {
      key: locales.en_US.locale.key,
      value: locales.en_US.locale.value,
    },
    {
      key: locales.zh_CN.locale.key,
      value: locales.zh_CN.locale.value,
    },
  ];
  const localeDropDown = (
    <Menu>
      {localeItems.map(localeItem => (
        <Menu.Item
          key={localeItem.key}
          onClick={React.useCallback(
            () =>
              locale.locale.key !== localeItem.key &&
              setLocale(locales[localeItem.key]),
            [locale.locale.key, localeItem.key],
          )}
        >
          {localeItem.value}
        </Menu.Item>
      ))}
    </Menu>
  );
  const signOut = React.useCallback(() => {
    navigate(RouteNames.SignIn);
  }, []);
  const getHello = gql`
    {
      hello
    }
  `;

  return (
    <Layout className="page-container">
      <Header className="user-header">
        <img src={logo} alt="logo" className="logo" />
        <div className="right-section">
          {/* <Menu
          mode="horizontal"
        >
          {menuItems.map(menuItem => (
            <Menu.Item key={menuItem.key}>{menuItem.value}</Menu.Item>
          ))}
        </Menu> */}
          {/* <Divider type="vertical" /> */}
          <Dropdown overlay={localeDropDown} trigger={['click']}>
            <Button size="small">
              {locale.locale.value} <Icon type="down" />
            </Button>
          </Dropdown>
          <Divider type="vertical" />
          <Button size="small" onClick={signOut}>
            {locale.user.signOut}
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider className="user-sider">Sider</Sider>
        <Content className="user-content">
          <Query query={getHello}>
            {({ loading, error, data }) => {
              if (loading) return <Loading />;

              if (error !== undefined) return <Error />;

              return (
                <React.Fragment>
                  <Link to={`${RouteNames.User.Home}/Tissot/test`}>report</Link>
                  <span>{data.hello}</span>
                </React.Fragment>
              );
            }}
          </Query>
        </Content>
      </Layout>
    </Layout>
  );
});
