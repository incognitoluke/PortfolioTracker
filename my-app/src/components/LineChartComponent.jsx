import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Line Chart Component
const LineChartComponent = ({ data, title = "Line Chart" }) => {
  // Calculate y-axis domain with 10% padding
  const calculateYAxisDomain = (data) => {
    if (!data || data.length === 0) return [0, 100];
    
    const values = data.map(item => item.value).filter(val => val !== null && val !== undefined);
    if (values.length === 0) return [0, 100];
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Add 10% padding above and below
    const padding = range * 0.1;
    const lowerBound = minValue - padding;
    const upperBound = maxValue + padding;
    
    return [lowerBound, upperBound];
  };

  const yAxisDomain = calculateYAxisDomain(data);

  return (
    <div style={{ padding: '40px', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            domain={yAxisDomain}
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
            animationBegin={300}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;