import * as React from 'react';

import LineChart from '$components/Charts/LineChart';
import BarChart from '$components/Charts/BarChart';
import Text from '$components/Text';

import customMetaKey from '$utils/customMetaKEey';

import MouseController from '../../controllers/MouseController';
import KeyboardController from '../../controllers/KeyboardController';

import './index.less';

export enum ReportElType {
  Chart = 'chart',
  Text = 'text',
}

export enum ReportChartType {
  LineChart = 'lineChart',
  BarChart = 'barChart',
}

interface ReportCommonEl {
  id: string;
  type: ReportElType;
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  selected: boolean;
}

interface ReportChart extends ReportCommonEl {
  type: ReportElType.Chart;
  chartType: ReportChartType;
  data: any;
  cols: any;
}

interface ReportText extends ReportCommonEl {
  type: ReportElType.Text;
  data: string;
}

export type ReportEl = ReportChart | ReportText;

type ReportElementProps = ReportEl & {
  mouseController: MouseController;
  keyboardController: KeyboardController;
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
    data,
    selected,
    mouseController,
    keyboardController,
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
      onMouseMove={
        type === ReportElType.Chart
          ? mouseController.onReportElMouseMove
          : undefined
      }
      onMouseDown={React.useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          mouseController.onReportElMouseDown(
            [id],
            !customMetaKey({ ctrlKey: event.ctrlKey, metaKey: event.metaKey }),
          ),
        [id],
      )}
      onMouseUp={mouseController.onReportElMouseUp}
    >
      {(() => {
        switch (props.type) {
          case ReportElType.Chart:
            const commonChartProps = {
              width,
              height,
              data,
              cols: props.cols,
            };

            switch (props.chartType) {
              case ReportChartType.LineChart:
                const lineChartProps = {
                  ...commonChartProps,
                };

                return <LineChart {...lineChartProps} />;
              case ReportChartType.BarChart:
                const barChartProps = {
                  ...commonChartProps,
                };

                return <BarChart {...barChartProps} />;
              default:
                // prettier-ignore
                throw new Error(`Invalid reportEl chartType ${props.chartType}.`);
            }
          case ReportElType.Text:
            return (
              <Text
                id={id}
                data={data}
                onInputUpdate={keyboardController._onTextInputUpdate}
              />
            );
          default:
            // prettier-ignore
            throw new Error(`Invalid reportEl type ${(props as any).type}.`);
        }
      })()}
    </div>
  );
});
