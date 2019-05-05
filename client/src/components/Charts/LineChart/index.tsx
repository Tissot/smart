import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Legend from 'bizcharts/lib/components/Legend';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Area from 'bizcharts/lib/components/TypedGeom/Area';
import Line from 'bizcharts/lib/components/TypedGeom/Line';

import { CommonChartProps } from '../CommonChartProps';

export interface LineChartOptions {
  isXAxisTime?: boolean;
  isLineSmooth?: boolean;
  showArea?: boolean;
}

interface LineChartProps extends CommonChartProps {
  options: LineChartOptions;
}

export default React.memo(function LineChart(props: LineChartProps) {
  const { width, height, data, options } = props;

  const dataKeys = Object.keys(data.rows[0]);
  const xAxis = dataKeys[0];
  const yAxes = dataKeys.slice(1, dataKeys.length);
  const yAxisKey = 'yAxisKey';
  const yAxisValue = 'yAxisValue';
  const position = `${xAxis}*${yAxisValue}`;
  const scale = React.useMemo(
    () => ({
      [xAxis]: options.isXAxisTime
        ? {
            type: 'time',
            nice: true,
          }
        : {
            nice: true,
          },
    }),
    [options.isXAxisTime],
  );

  React.useMemo(() => {
    data.transform({
      type: 'fold',
      fields: yAxes,
      key: yAxisKey,
      value: yAxisValue,
    });
  }, [data]);

  return (
    <Chart width={width} height={height} data={data} scale={scale}>
      <Legend />
      <Axis name={xAxis} />
      <Axis name={yAxisValue} />
      <Tooltip
        crosshairs={{
          type: 'line',
        }}
      />
      {
        options.showArea && <Area
          position={position}
          color={yAxisKey}
          shape={options.isLineSmooth ? 'smooth' : undefined}
        />
      }
      <Line
        position={position}
        size={2}
        color={yAxisKey}
        shape={options.isLineSmooth ? 'smooth' : undefined}
      />
    </Chart>
  );
});
