const path = require('path');

const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addTslintLoader,
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
    $contexts: path.resolve(__dirname, 'src/contexts'),
    $routes: path.resolve(__dirname, 'src/routes'),
    $components: path.resolve(__dirname, 'src/components'),
    $decorators: path.resolve(__dirname, 'src/decorators'),
    $utils: path.resolve(__dirname, 'src/utils'),
    $assets: path.resolve(__dirname, 'src/assets'),
    $images: path.resolve(__dirname, 'src/assets/images'),
    $styles: path.resolve(__dirname, 'src/assets/styles'),
  }),
  addTslintLoader(),
);
