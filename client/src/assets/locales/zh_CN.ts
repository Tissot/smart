export default {
  locale: {
    key: 'zh_CN',
    value: '简体中文',
  },
  common: {
    loading: '加载中...',
    createdAt: '创建于',
    updatedAt: '更新于',
    uploadData: '上传数据',
  },
  signIn: {
    signIn: '登录',
    signUp: '注册',
    username: '用户名',
    password: '密码',
    usernameLimit: '用户名长度为 3 ～ 15，由字母或数字组成。',
    passwordLimit:
      '密码长度为 6 ～ 15，且至少有一个小写字母、大写字母以及数字。',
  },
  user: {
    signOut: '登出',
    home: {
      title: '首页',
      reports: {
        title: '报告',
        addReport: '新建报告',
        unnamedReport: '未命名报告',
      },
      dataSources: {
        title: '数据源',
        addDataSource: '新建数据源',
      },
    },
    report: {
      redo: '重做',
      undo: '撤回',
      selectAll: '全选',
      unselectAll: '取消选择',
      deleteSelected: '删除所选',
      addChart: '添加图表',
      addText: '文本',
      lineChart: '折线图',
      barChart: '柱状图',
    },
  },
  error: {
    unauthorized: '登录失效，请重新登录。',
    existingUsername: '用户名已存在。',
    nonexistentUsernameOrWrongPassword: '用户名不存在或密码错误。',
    reportNotFound: '报告不存在。',
    dataSourceNotFound: '数据源不存在。',
    networkError: '网络错误。',
  },
  notFound: '该页面不存在。',
};
