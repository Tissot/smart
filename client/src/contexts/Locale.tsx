import * as React from 'react';
import { LocaleProvider as AntdLocaleProvider } from 'antd';
import antd_en_US from 'antd/lib/locale-provider/en_US';
import antd_zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { Locale, locales } from '$assets/locales';

export const LocaleContext = React.createContext<{
  locale: Locale;
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
}>({
  locale:
    locales[window.localStorage.getItem('locale') || 'en_US'] || locales.en_US,
  // tslint:disable-next-line
  setLocale: () => {},
});

const otherLocaleMap = {
  [locales.en_US.locale.key]: {
    antd: antd_en_US,
    moment: 'en',
  },
  [locales.zh_CN.locale.key]: {
    antd: antd_zh_CN,
    moment: 'zh-cn',
  },
};

interface LocaleProviderProps {
  children: React.ReactNode;
}

export const LocaleProvider = React.memo(function LocaleProvider(
  props: LocaleProviderProps,
) {
  const [locale, setLocale] = React.useState(
    locales[window.localStorage.getItem('locale') || 'en_US'] || locales.en_US,
  );
  const [antdLocale, setAntdLocale] = React.useState(antd_en_US);
  const LocaleContextValue = React.useMemo(() => ({ locale, setLocale }), [
    locale,
  ]);

  React.useEffect(() => {
    const otherLocale = otherLocaleMap[locale.locale.key];

    setAntdLocale(otherLocale.antd as any);
    moment.locale(otherLocale.moment);

    window.localStorage.setItem('locale', locale.locale.key);
  }, [locale]);

  return (
    <LocaleContext.Provider value={LocaleContextValue}>
      <AntdLocaleProvider locale={antdLocale}>
        {props.children}
      </AntdLocaleProvider>
    </LocaleContext.Provider>
  );
});
