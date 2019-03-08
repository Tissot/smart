import * as React from 'react';
import { Layout, Select, Switch, Icon } from 'antd';

import { LocaleContext } from '$contexts/Locale';

import {
  ReportEl,
  ReportChartType,
  ReportElType,
  ReportChartDataSource,
  ReportChartOptions,
} from '../ReportElement';

import './index.less';

const { Sider } = Layout;

interface ConfigPanelProps {
  editingReportEl: ReportEl | null;
  dataSources: {
    rows: {
      id: string;
      name: string;
      data: any[];
    }[];
    count: number;
  };
  onChartDataSourceSelect(id: string, dataSource: ReportChartDataSource): void;
  onChartOptionsChange(id: string, options: ReportChartOptions): void;
}

export default React.memo(function ConfigPanel(props: ConfigPanelProps) {
  const {
    editingReportEl,
    dataSources,
    onChartDataSourceSelect,
    onChartOptionsChange,
  } = props;
  const { locale } = React.useContext(LocaleContext);

  if (!editingReportEl) return <Sider className="config-panel" />;

  let title = locale.user.report[editingReportEl.type];

  if (
    editingReportEl.type === ReportElType.Chart &&
    editingReportEl.chartType
  ) {
    title += ` > ${locale.user.report[editingReportEl.chartType]}`;
  }

  return (
    <Sider className="config-panel">
      <div className="title">{title}</div>
      {(() => {
        const pannelItems = [];

        switch (editingReportEl.type) {
          case ReportElType.Text:
            break;
          case ReportElType.Chart:
            if (editingReportEl.dataSource) {
              pannelItems.push(
                <div key="data-source" className="config-item">
                  <div>{locale.user.home.dataSources.title}</div>
                  <Select
                    value={editingReportEl.dataSource.id}
                    style={{ width: '160px' }}
                    // onSelect 用 useCallBack 添加 report element 会报错。
                    onSelect={dataSourceId => {
                      for (const dataSource of dataSources.rows) {
                        if (dataSource.id === dataSourceId) {
                          const { id, data } = dataSource;
                          onChartDataSourceSelect(editingReportEl.id, {
                            id,
                            data,
                          });
                        }
                      }
                    }}
                  >
                    {dataSources.rows.map(dataSource => (
                      <Select.Option key={dataSource.id} value={dataSource.id}>
                        {dataSource.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>,
              );
            }

            if (
              editingReportEl.type === ReportElType.Chart &&
              editingReportEl.chartType === ReportChartType.LineChart
            ) {
              pannelItems.push(
                <div key="is-x-axis-time" className="config-item">
                  <div>{locale.user.report.isXAxisTime}</div>
                  <Switch
                    checked={(editingReportEl.options as any).isXAxisTime}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    onClick={React.useCallback(
                      isXAxisTime => {
                        const { id, options } = editingReportEl;
                        onChartOptionsChange(id, { ...options, isXAxisTime });
                      },
                      [editingReportEl],
                    )}
                  />
                </div>,
                <div key="is-line-smooth" className="config-item">
                  <div>{locale.user.report.isLineSmooth}</div>
                  <Switch
                    checked={(editingReportEl.options as any).isLineSmooth}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    onClick={React.useCallback(
                      isLineSmooth => {
                        const { id, options } = editingReportEl;
                        onChartOptionsChange(id, { ...options, isLineSmooth });
                      },
                      [editingReportEl],
                    )}
                  />
                </div>,
              );
            }
            break;
          default:
            break;
        }

        return pannelItems;
      })()}
    </Sider>
  );
});
