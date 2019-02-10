import * as React from 'react';
import { LocaleProvider as AntdLocaleProvider } from 'antd';
import antd_en_US from 'antd/lib/locale-provider/en_US';
import antd_zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { locales } from '$assets/locales';

export const LocaleContext = React.createContext([locales.en_US, null as any]);

const otherLocaleMap = {
  [locales.en_US.locale.key]: {
    antd: antd_en_US,
    moment: 'en',
  },
  [locales.zh_CN.locale.key]: {
    antd: antd_zh_CN,
    moment: 'zh',
  },
};

interface LocaleProviderProps {
  children: React.ReactNode;
}

// prettier-ignore
export const LocaleProvider = React.memo(function LocaleProvider(props: LocaleProviderProps) {
  console.log('$LocaleProvider re-render');

  const [locale, setLocale] = React.useState(locales.en_US);
  const [antdLocale, setAntdLocale] = React.useState(antd_en_US);

  React.useEffect(() => {
    const otherLocale = otherLocaleMap[locale.locale.key];

    setAntdLocale(otherLocale.antd as any);
    moment.locale(otherLocale.moment);
  }, [locale]);

  return (
    <LocaleContext.Provider value={[locale, setLocale]}>
      <AntdLocaleProvider locale={antdLocale}>
        {props.children}
      </AntdLocaleProvider>
    </LocaleContext.Provider>
  );
});
