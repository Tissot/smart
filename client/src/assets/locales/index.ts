import en_US from './en_US';
import zh_CN from './zh_CN';

export interface Locale {
  locale: {
    key: string;
    value: string;
  };
  common: {
    loading: string;
    createdAt: string;
    updatedAt: string;
  };
  signIn: {
    signIn: string;
    signUp: string;
    username: string;
    password: string;
    usernameLimit: string;
    passwordLimit: string;
  };
  user: {
    signOut: string;
    home: {
      title: string;
      reports: {
        title: string;
        addReport: string;
        unnamedReport: string;
      };
      dataSources: {
        title: string;
        addDataSource: string;
      };
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
  error: {
    unauthorized: string;
    existingUsername: string;
    nonexistentUsernameOrWrongPassword: string;
    reportNotFound: string;
    dataSourceNotFound: string;
    networkError: string;
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
