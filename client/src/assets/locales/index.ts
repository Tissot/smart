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
    signInSuccessfully: string;
    signUpSuccessfully: string;
    usernameLimit: string;
    passwordLimit: string;
  };
  user: {
    signOut: string;
    signOutSuccessfully: string;
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
        uploadSuccessfully: string;
      };
    };
    report: {
      redo: string;
      undo: string;
      selectAll: string;
      unselectAll: string;
      deleteSelected: string;
      chart: string;
      text: string;
      lineChart: string;
      areaChart: string;
      barChart: string;
      pieChart: string;
      radarChart: string;
      wordCloud: string;
      scatterChart: string;
      textEmptyTips: string;
      isXAxisTime: string;
      isLineSmooth: string;
      renamedSuccessfully: string;
      savedSuccessfully: string;
    };
  };
  error: {
    unauthorized: string;
    existingUsername: string;
    nonexistentUsernameOrWrongPassword: string;
    reportNotFound: string;
    dataSourceNotFound: string;
    networkError: string;
    fileContentError: string;
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
