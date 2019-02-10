const path = require('path');

const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
} = require('customize-cra');

module.exports = override(
  fixBabelImports('antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1890ff' },
  }),
  addWebpackAlias({
    $routes: path.resolve(__dirname, 'src/routes'),
    $components: path.resolve(__dirname, 'src/components'),
    $assets: path.resolve(__dirname, 'src/assets'),
    $contexts: path.resolve(__dirname, 'src/contexts'),
    $images: path.resolve(__dirname, 'src/assets/images'),
    $styles: path.resolve(__dirname, 'src/assets/styles'),
  }),
);
