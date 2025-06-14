import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import React from 'react'

// Bar Chart Component
const BarChartComponent = ({ data, title = "Bar Chart" }) => {
  return (
    <div style={{ padding: '40px', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Bar 
            dataKey="value" 
            fill="#f97316"
            radius={[4, 4, 0, 0]}
            animationBegin={500}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export default BarChartComponent