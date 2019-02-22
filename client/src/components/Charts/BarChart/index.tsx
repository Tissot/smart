import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Interval from 'bizcharts/lib/components/TypedGeom/Interval';

import { CommonChartProps } from '../CommonChartProps';

interface BarChartProps extends CommonChartProps {}

export default React.memo(function BarChart(props: BarChartProps) {
  const { width, height, data, cols } = props;

  return (
    <Chart width={width} height={height} data={data} scale={cols}>
      <Axis name="year" />
      <Axis name="sales" />
      <Tooltip
        crosshairs={{
          type: 'y',
        }}
      />
      <Interval position="year*sales" />
    </Chart>
  );
});
