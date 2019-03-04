import * as React from 'react';
import { Layout, Tooltip, Icon, Button, Divider, Menu, Dropdown } from 'antd';

import { LocaleContext } from '$contexts/Locale';

import { ReactComponent as UndoSvg } from '$assets/icons/undo.svg';
import { ReactComponent as RedoSvg } from '$assets/icons/redo.svg';
import { ReactComponent as SelectAllSvg } from '$assets/icons/select-all.svg';
import { ReactComponent as TextSvg } from '$assets/icons/text.svg';

import { MouseController } from '../../controllers';
import { ReportChartType } from '../ReportElement';

import './index.less';

interface ToolbarProps {
  disableUndo: boolean;
  disableRedo: boolean;
  mouseController: MouseController;
}

const { Header } = Layout;

export default React.memo(function Toolbar(props: ToolbarProps) {
  const { mouseController, disableUndo, disableRedo } = props;
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
            () => mouseController.onChartListItemClick(reportChartTypeItem.key),
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
      <div className="toolbar-btn">
        <Tooltip title={locale.user.report.undo} placement="bottom">
          <Button
            disabled={disableUndo}
            onClick={mouseController.onUndoBtnClick}
          >
            <Icon component={UndoSvg as any} />
          </Button>
        </Tooltip>
      </div>
      <div className="toolbar-btn">
        <Tooltip title={locale.user.report.redo} placement="bottom">
          <Button
            disabled={disableRedo}
            onClick={mouseController.onRedoBtnClick}
          >
            <Icon component={RedoSvg as any} />
          </Button>
        </Tooltip>
      </div>
      <Divider type="vertical" />
      <div className="toolbar-btn">
        <Tooltip title={locale.user.report.selectAll} placement="bottom">
          <Button onClick={mouseController.onSelectAllBtnClick}>
            <Icon component={SelectAllSvg as any} />
          </Button>
        </Tooltip>
      </div>
      <Divider type="vertical" />
      <div className="toolbar-btn">
        <Dropdown overlay={addChartTypeMenu} trigger={['click']}>
          <Button>
            <Icon type="bar-chart" /> {locale.user.report.addChart}{' '}
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
      <Divider type="vertical" />
      <div className="toolbar-btn">
        <Tooltip title={locale.user.report.text} placement="bottom">
          <Button onClick={mouseController.onAddTextBtnClick}>
            <Icon component={TextSvg as any} />
          </Button>
        </Tooltip>
      </div>
      <Divider type="vertical" />
      <div className="toolbar-btn">
        <Tooltip title={locale.user.report.deleteSelected} placement="bottom">
          <Button
            type="danger"
            onClick={mouseController.onDeleteSelectedBtnClick}
          >
            <Icon type="delete" />
          </Button>
        </Tooltip>
      </div>
    </Header>
  );
});
