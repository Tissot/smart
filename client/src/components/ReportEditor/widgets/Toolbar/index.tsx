import * as React from 'react';

import { Layout, Menu, Dropdown, Button, Icon, Divider } from 'antd';
import { LocaleContext } from '$contexts/LocaleContext';

import { MouseEventController } from '../../controllers';

import { ReportChartType } from '../ReportElement';

import './index.less';

interface ToolbarProps {
  mouseEventController: MouseEventController;
}

const { Header } = Layout;

export default React.memo(function Toolbar(props: ToolbarProps) {
  console.log(`$Toolbar re-render`);

  const { mouseEventController } = props;
  const { locale } = React.useContext(LocaleContext);

  const reportChartTypeItems = [
    {
      key: ReportChartType.LineChart,
      value: locale.user.report.lineChart,
    },
    {
      key: ReportChartType.BarChart,
      value: locale.user.report.barChart,
    },
  ];
  const addChartTypeMenu = (
    <Menu>
      {reportChartTypeItems.map(reportChartTypeItem => (
        <Menu.Item
          key={reportChartTypeItem.key}
          onClick={React.useCallback(
            () =>
              mouseEventController.onChartListItemClick(
                reportChartTypeItem.key,
              ),
            [reportChartTypeItem.key],
          )}
        >
          {reportChartTypeItem.value}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Header className="toolbar">
      <Button onClick={mouseEventController.onRedoBtnClick}>
        {locale.user.report.redo}
      </Button>
      <Button onClick={mouseEventController.onUndoBtnClick}>
        {locale.user.report.undo}
      </Button>
      <Divider type="vertical" />
      <Button onClick={mouseEventController.onSelectAllBtnClick}>
        {locale.user.report.selectAll}
      </Button>
      <Button onClick={mouseEventController.onUnselectAllBtnClick}>
        {locale.user.report.unselectAll}
      </Button>
      <Divider type="vertical" />
      <Dropdown overlay={addChartTypeMenu} trigger={['click']}>
        <Button>
          {locale.user.report.addChart} <Icon type="down" />
        </Button>
      </Dropdown>
      <Divider type="vertical" />
      <Button onClick={mouseEventController.onAddTextBtnClick}>
        {locale.user.report.addText}
      </Button>
      <Divider type="vertical" />
      <Button onClick={mouseEventController.onDeleteSelectedBtnClick}>
        {locale.user.report.deleteSelected}
      </Button>
    </Header>
  );
});
