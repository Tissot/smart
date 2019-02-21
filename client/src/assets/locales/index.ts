import en_US from './en_US';
import zh_CN from './zh_CN';

export interface Locale {
  locale: {
    key: string;
    value: string;
  };
  common: {
    signIn: string;
    signUp: string;
    loading: string;
  };
  user: {
    signOut: string;
    home: {
      title: string;
    };
    report: {
      redo: string;
      undo: string;
      selectAll: string;
      unselectAll: string;
      deleteSelected: string;
      addChart: string;
      addText: string;
      lineChart: string;
      barChart: string;
    };
  };
  notFound: string;
}

interface Locales {
  [key: string]: Locale;
}

export const locales: Locales = {
  en_US,
  zh_CN,
};
