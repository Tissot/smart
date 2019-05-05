import * as React from 'react';
import { Empty } from 'antd';

import LineChart, { LineChartOptions } from '$components/Charts/LineChart';
import BarChart, { BarChartOptions } from '$components/Charts/BarChart';
import PieChart, { PieChartOptions } from '$components/Charts/PieChart';
import ScatterChart, {
  ScatterChartOptions,
} from '$components/Charts/ScatterChart';

import Text from './Text';

import './index.less';

export enum ReportElType {
  Chart = 'chart',
  Text = 'text',
}

export enum ReportChartType {
  LineChart = 'lineChart',
  AreaChart = 'areaChart',
  BarChart = 'barChart',
  PieChart = 'pieChart',
  ScatterChart = 'scatterChart',
}

interface ReportCommonEl {
  id: string;
  type: ReportElType;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  editing: boolean;
}

export interface ReportChartDataSource {
  id: string;
  data: any;
}

export type ReportChartOptions =
  | LineChartOptions
  | BarChartOptions
  | PieChartOptions
  | ScatterChartOptions;

interface ReportChart extends ReportCommonEl {
  type: ReportElType.Chart;
  chartType: ReportChartType;
  dataSource: ReportChartDataSource;
  options: ReportChartOptions;
}

interface ReportText extends ReportCommonEl {
  type: ReportElType.Text;
  text: string;
}

export type ReportEl = ReportChart | ReportText;

type ReportElementProps = ReportEl & {
  onMouseDown?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  onMouseUp?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  onInputText?(event: any): void;
  onMouseMove?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
};

// 与 './index.less' 中的 @report-element-selected-border-width 保持同步。
const reportElSelectedBorderWidth = 2;

export default React.memo(function ReportElement(props: ReportElementProps) {
  const {
    id,
    type,
    x,
    y,
    width,
    height,
    selected,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onInputText,
  } = props;

  return (
    <div
      style={{
        width: width + reportElSelectedBorderWidth * 2,
        height:
          height +
          (type === ReportElType.Chart ? 6 : 0) +
          reportElSelectedBorderWidth * 2,
        transform: `translate(${x}px, ${y}px)`,
      }}
      className={`report-element${selected ? ' report-element-selected' : ''}`}
      id={id}
      data-x={x}
      data-y={y}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {(() => {
        switch (props.type) {
          case ReportElType.Chart:
            if (
              !props.dataSource ||
              !props.dataSource.id ||
              !props.dataSource.data.rows ||
              props.dataSource.data.rows.length === 0
            ) {
              return <Empty style={{ height: '100%' }} />;
            }

            const chartProps = {
              width,
              height,
              data: props.dataSource.data,
              options: props.options,
            };

            switch (props.chartType) {
              case ReportChartType.LineChart:
                return <LineChart {...chartProps} />;
              case ReportChartType.AreaChart:
                (chartProps.options as LineChartOptions).showArea = true;

                return <LineChart {...chartProps} />;
              case ReportChartType.BarChart:
                return <BarChart {...chartProps} />;
              case ReportChartType.PieChart:
                return <PieChart {...chartProps} />;
              case ReportChartType.ScatterChart:
                return <ScatterChart {...chartProps} />;
              default:
                // prettier-ignore
                throw new Error(`Invalid reportEl chartType ${props.chartType}.`);
            }
          case ReportElType.Text:
            return <Text text={props.text} onChange={onInputText} />;
          default:
            // prettier-ignore
            throw new Error(`Invalid reportEl type ${(props as any).type}.`);
        }
      })()}
    </div>
  );
});
