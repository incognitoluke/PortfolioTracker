import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Area Chart Component
const LineChartComponent = ({ data, title = "Line Chart" }) => {
  const calculateYAxisDomain = (data) => {
    if (!data || data.length === 0) return [0, 100];

    const values = data.map(item => item.value).filter(val => val !== null && val !== undefined);
    if (values.length === 0) return [0, 100];

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    const padding = range * 0.1;
    const lowerBound = Math.max(0, minValue - padding); // Ensure never below 0
    const upperBound = maxValue + padding;

    return [lowerBound, upperBound];
  };

  const yAxisDomain = calculateYAxisDomain(data);

  const getLineColor = (data) => {
    if (!data || data.length < 2) return '#2563eb';
    const first = data[0].value;
    const last = data[data.length - 1].value;
    return last >= first ? '#16a34a' : '#dc2626';
  };

  const lineColor = getLineColor(data);

  return (
    <div style={{ padding: '10px', height: '100%' }}>
      <h3 style={{ textAlign: 'left', marginBottom: '20px', color: '#626566', fontSize: '32px', fontWeight: '400' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            interval={Math.max(Math.floor((data?.length || 1) / 5), 1)}
            tick={{ dx: 15 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            domain={yAxisDomain}
            tickFormatter={(value) => value.toFixed(2)}
            tick={{ dy: -5 }}
          />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={lineColor} 
            strokeWidth={3}
            fill={lineColor}
            fillOpacity={0.25}
            activeDot={{ r: 8, stroke: lineColor, strokeWidth: 2 }}
            animationBegin={300}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;