import * as React from 'react';
import { NavigateFn } from '@reach/router';
import { Layout, Menu, Divider, Dropdown, Button, Icon, message } from 'antd';

import { AbsoluteRoute } from '$routes/index';

import { UserContext } from '$contexts/User';
import { LocaleContext } from '$contexts/Locale';

import { locales } from '$assets/locales';

import logo from '$images/logo.png';

import './index.less';

interface HomeProps {
  children: React.ReactNode;
  path: string;
  uri?: string;
  '*'?: string;
  navigate?: NavigateFn;
}

const { Header, Sider, Content } = Layout;

export default React.memo(function Home(props: HomeProps) {
  const { setUser } = React.useContext(UserContext);
  const { locale, setLocale } = React.useContext(LocaleContext);
  const currentPaths = React.useMemo(() => {
    if (props.uri === '/') {
      if (props['*']) {
        return [`/${props['*']}`];
      } else {
        return ['/'];
      }
    } else {
      if (props['*']) {
        return [`${props.uri}/${props['*']}`];
      } else {
        return [`${props.uri}`];
      }
    }
  }, [props.uri, props['*']]);
  const localeItems = React.useMemo(
    () => [
      {
        key: locales.en_US.locale.key,
        value: locales.en_US.locale.value,
      },
      {
        key: locales.zh_CN.locale.key,
        value: locales.zh_CN.locale.value,
      },
    ],
    [locale],
  );
  const siderMenuItems = React.useMemo(
    () => [
      {
        key: AbsoluteRoute.User.Home.Reports,
        value: locale.user.home.reports.title,
      },
      {
        key: AbsoluteRoute.User.Home.DataSources,
        value: locale.user.home.dataSources.title,
      },
    ],
    [locale],
  );
  const localeDropDown = React.useMemo(
    () => (
      <Menu>
        {localeItems.map(localeItem => (
          <Menu.Item
            key={localeItem.key}
            onClick={React.useCallback(
              () => setLocale(locales[localeItem.key]),
              [localeItem.key],
            )}
          >
            {localeItem.value}
          </Menu.Item>
        ))}
      </Menu>
    ),
    [localeItems],
  );

  const signOut = React.useCallback(() => {
    message.success(locale.user.signOutSuccessfully);
    setUser({ id: '', username: '', token: '', hasSignedIn: false });
  }, []);

  const changePath = React.useCallback(
    ({ key }: { key: string }) => props.navigate!(key),
    [],
  );

  return (
    <Layout className="page-container">
      <Header className="user-header">
        <img src={logo} alt="logo" className="logo" />
        <div className="right-section">
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
        <Sider className="user-sider">
          <Menu selectedKeys={currentPaths} onClick={changePath}>
            {siderMenuItems.map(siderMenuItem => (
              <Menu.Item key={siderMenuItem.key}>
                {siderMenuItem.value}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content className="user-content">{props.children}</Content>
      </Layout>
    </Layout>
  );
});
