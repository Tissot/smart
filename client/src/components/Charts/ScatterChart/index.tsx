import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Legend from 'bizcharts/lib/components/Legend';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Point from 'bizcharts/lib/components/TypedGeom/Point';

import { CommonChartProps } from '../CommonChartProps';

export interface ScatterChartOptions {}

interface ScatterChartProps extends CommonChartProps {
  options: ScatterChartOptions;
}

export default React.memo(function ScatterChart(props: ScatterChartProps) {
  const { width, height, data } = props;

  const dataKeys = Object.keys(data.rows[0]);
  const xAxis = dataKeys[0];
  const yAxis = dataKeys[1];
  const point = dataKeys[2];
  const position = `${xAxis}*${yAxis}`;
  const scale = {
    [xAxis]: {
      nice: true,
    },
  };

  return (
    <Chart width={width} height={height} data={data} scale={scale}>
      <Legend />
      <Axis name={xAxis} />
      <Axis name={yAxis} />
      <Tooltip
        crosshairs={{
          type: 'cross',
        }}
      />
      <Point
        position={position}
        opacity={0.65}
        shape="circle"
        size={3}
        color={point}
      />
    </Chart>
  );
});
