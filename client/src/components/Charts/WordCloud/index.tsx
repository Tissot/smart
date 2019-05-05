import * as React from 'react';
import { Canvas } from '@antv/g';
import Chart from 'bizcharts/lib/components/Chart';
import Legend from 'bizcharts/lib/components/Legend';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Coord from 'bizcharts/lib/components/Coord';
import Point from 'bizcharts/lib/components/TypedGeom/Point';
import { Shape } from 'bizcharts/lib/core';

import { CommonChartProps } from '../CommonChartProps';

export interface WordCloudOptions {}

interface WordCloudProps extends CommonChartProps {
  options: WordCloudOptions;
}

function getTextAttrs(cfg: any) {
  return {
    ...cfg.style,
    fillOpacity: cfg.opacity,
    fontSize: cfg.origin._origin.size,
    rotate: cfg.origin._origin.rotate,
    text: cfg.origin._origin.text,
    textAlign: 'center',
    fontFamily: cfg.origin._origin.font,
    fill: cfg.color,
    textBaseline: 'Alphabetic',
  };
}

// 给 point 注册一个词云的 shape
Shape.registerShape('point', 'cloud', {
  drawShape(cfg: any, container: Canvas) {
    const attrs = getTextAttrs(cfg);

    return container.addShape('text', {
      attrs: {
        ...attrs,
        x: cfg.x,
        y: cfg.y,
      },
    });
  },
});

export default React.memo(function WordCloud(props: WordCloudProps) {
  const { width, height, data } = props;

  const dataKeys = Object.keys(data.rows[0]);
  const key = dataKeys[0];
  const value = dataKeys[1];
  const category = dataKeys[2];
  const position = `${key}*y`;
  const tooltip = `${value}*${category}`;
  const scale = {
    x: { nice: false },
    y: { nice: false },
  };

  React.useMemo(() => {
    const range = data.range(value);
    const min = range[0];
    const max = range[1];

    data.transform({
      type: 'tag-cloud',
      fields: [key, value],
      font: 'Verdana',
      padding: 0,
      // 最大执行时间
      timeInterval: 5000,
      rotate() {
        let random = Math.round(Math.random() * 4) % 4;

        if (random == 2) {
          random = 0;
        }

        return random * 90; // 0, 90, 270
      },
      fontSize(d: any) {
        if (d.value) {
          const divisor = (max - min) !== 0 ? (max - min) : 1;

          return ((d.value - min) / divisor) * (80 - 24) + 24;
        }

        return 0;
      },
    });
  }, [data]);

  return (
    <Chart width={width} height={height} data={data} scale={scale}>
      <Legend />
      <Tooltip showTitle={false} />
      <Coord reflect="y" />
      <Point
        position={position}
        shape="cloud"
        color={category}
        tooltip={tooltip}
      />
    </Chart>
  );
});
