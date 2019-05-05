import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Coord from 'bizcharts/lib/components/Coord';
import Legend from 'bizcharts/lib/components/Legend';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Area from 'bizcharts/lib/components/TypedGeom/Area';
import Line from 'bizcharts/lib/components/TypedGeom/Line';
import Point from 'bizcharts/lib/components/TypedGeom/Point';

import { CommonChartProps } from '../CommonChartProps';

export interface RadarChartOptions {}

interface RadarChartProps extends CommonChartProps {
  options: RadarChartOptions;
}

export default React.memo(function RadarChart(props: RadarChartProps) {
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
    [yAxisValue]: {
      min: 0,
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
      <Coord type="polar" radius={0.9} />
      <Legend />
      <Axis
        name={xAxis}
        line={null}
        tickLine={null}
        grid={{
          lineStyle: {
            lineDash: null,
          },
          hideFirstLine: false,
        }}
      />
      <Axis
        name={yAxisValue}
        line={null}
        tickLine={null}
        grid={{
          type: 'polygon',
          lineStyle: {
            lineDash: null,
          },
          alternateColor: 'rgba(0, 0, 0, 0.04)',
        }}
      />
      <Tooltip />
      <Area type="area" position={position} color={yAxisKey} />
      <Line type="line" position={position} color={yAxisKey} size={2} />
      <Point
        type="point"
        position={position}
        color={yAxisKey}
        shape="circle"
        size={4}
        style={{
          stroke: '#fff',
          lineWidth: 1,
          fillOpacity: 1,
        }}
      />
    </Chart>
  );
});
