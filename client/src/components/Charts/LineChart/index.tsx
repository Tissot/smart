import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Line from 'bizcharts/lib/components/TypedGeom/Line';
import Point from 'bizcharts/lib/components/TypedGeom/Point';

import { CommonChartProps } from '../CommonChartProps';

interface LineChartProps extends CommonChartProps {}

export default React.memo(function LineChart(props: LineChartProps) {
  console.log(`$LineChart re-render`);

  const { width, height, data, cols } = props;

  return (
    <Chart width={width} height={height} data={data} scale={cols}>
      <Axis name="year" />
      <Axis name="value" />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Line position="year*value" size={2} />
      <Point
        position="year*value"
        size={4}
        shape={'circle'}
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
      />
    </Chart>
  );
});
