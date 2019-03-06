import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Legend from 'bizcharts/lib/components/Legend';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Interval from 'bizcharts/lib/components/TypedGeom/Interval';

import { CommonChartProps } from '../CommonChartProps';

export interface BarChartOptions {}

interface BarChartProps extends CommonChartProps {
  options: BarChartOptions;
}

export default React.memo(function BarChart(props: BarChartProps) {
  const { width, height, data } = props;

  const dataKeys = Object.keys(data.rows[0]);
  const xAxis = dataKeys[0];
  const yAxes = dataKeys.slice(1, dataKeys.length);
  const yAxisKey = 'yAxisKey';
  const yAxisValue = 'yAxisValue';
  const position = `${xAxis}*${yAxisValue}`;
  const scale = {
    [xAxis]: {
      nice: true,
    },
  };

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
          type: 'y',
        }}
      />
      <Interval
        position={position}
        color={yAxisKey}
        adjust={[
          {
            type: 'dodge',
            marginRatio: 0,
          },
        ]}
      />
    </Chart>
  );
});
