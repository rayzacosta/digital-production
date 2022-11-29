import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BarType = {
  dataKey: string;
  fill: string;
};

type CharBarProps = {
  height: number;
  width: number;
  data: any[];
  bars: BarType[];
};

export const CharBar = ({ width, height, data, bars }: CharBarProps) => {
  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {bars.map((bar) => {
        return <Bar key={bar.dataKey} {...bar} />;
      })}
    </BarChart>
  );
};
