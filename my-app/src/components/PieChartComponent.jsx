import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


// Pie Chart Component
const PieChartComponent = ({ data, title = "Pie Chart" }) => {
  return (
    <div style={{ padding: '40px', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={200}
            innerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={1000}
            animationDuration={1200}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;