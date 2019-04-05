import * as React from 'react';
import Chart from 'bizcharts/lib/components/Chart';
import Coord from 'bizcharts/lib/components/Coord';
import Legend from 'bizcharts/lib/components/Legend';
import Axis from 'bizcharts/lib/components/Axis';
// 引入 Geom 会把 bizcharts 和 G2 全部引入，后续留意 G2 按需加载组件的更新。
import Geom from 'bizcharts/lib/components/Geom';
import Label from 'bizcharts/lib/components/Label';

import { CommonChartProps } from '../CommonChartProps';

export interface PieChartOptions {}

interface PieChartProps extends CommonChartProps {
  options: PieChartOptions;
}

export default React.memo(function PieChart(props: PieChartProps) {
  const { width, height, data } = props;

  const dataKeys = Object.keys(data.rows[0]);
  const item = dataKeys[0];
  const count = dataKeys[1];
  const percent = 'percent';
  const scale = {
    percent: {
      formatter: (val: number) => `${val * 100}%`,
    },
  };

  React.useMemo(() => {
    data.transform({
      type: 'percent',
      fields: count,
      dimension: item,
      as: percent,
    });
  }, [data]);

  return (
    <Chart width={width} height={height} data={data} scale={scale}>
      <Coord type="theta" />
      <Axis name={percent} />
      <Legend offsetY={50} clickable={false} />
      <Geom
        type="intervalStack"
        position={percent}
        color={item}
        tooltip={[
          `${item}*${percent}`,
          (item: string, percent: number) => ({
            name: item,
            value: `${percent * 100}%`,
          }),
        ]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
      >
        <Label
          content={percent}
          formatter={(val: string, item: any) => `${item.point.item}: ${val}`}
        />
      </Geom>
    </Chart>
  );
});
