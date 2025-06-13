import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RotatingChart = () => {
  const [currentChart, setCurrentChart] = useState(0); // 0: line, 1: bar, 2: pie
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsTransitioning(true);
      
      // After fade out completes, switch chart and fade in
      setTimeout(() => {
        setCurrentChart(prev => (prev + 1) % 3); // Cycle through 3 charts
        setAnimationKey(prev => prev + 1);
        setIsTransitioning(false);
      }, 500); // Half second for fade out
      
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const barData = [
    { name: 'A', value: 12 },
    { name: 'B', value: 19 },
    { name: 'C', value: 3 },
    { name: 'D', value: 5 },
  ];

  const pieData = [
    { name: 'Stocks', value: 45, color: '#3b82f6' },
    { name: 'Bonds', value: 25, color: '#10b981' },
    { name: 'Real Estate', value: 15, color: '#f59e0b' },
    { name: 'Commodities', value: 10, color: '#ef4444' },
    { name: 'Cash', value: 5, color: '#8b5cf6' },
  ];

  const lineData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 13 },
    { name: 'Apr', value: 17 },
  ];

  const chartTypes = ['Line Chart', 'Bar Chart', 'Asset Allocation'];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar - 20% width */}
      <div style={{
        width: '20%',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1e293b' 
        }}>
          Dashboard
        </h2>
        
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#64748b', 
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Current View
          </h3>
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {chartTypes[currentChart]}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#64748b', 
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Chart Rotation
          </h3>
          <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>
            Charts rotate every 5 seconds automatically
          </div>
        </div>

        <div>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#64748b', 
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Available Charts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chartTypes.map((type, index) => (
              <div
                key={type}
                style={{
                  padding: '8px 12px',
                  backgroundColor: currentChart === index ? '#e0f2fe' : '#ffffff',
                  border: currentChart === index ? '1px solid #0891b2' : '1px solid #e2e8f0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: currentChart === index ? '#0891b2' : '#64748b',
                  fontWeight: currentChart === index ? '500' : '400'
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area - 80% width */}
      <div style={{ 
        width: '80%', 
        position: 'relative', 
        minHeight: '400px',
        backgroundColor: '#ffffff'
      }}>
        {/* Line Chart */}
        <div
          key={`line-${animationKey}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: currentChart === 0 && !isTransitioning ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: currentChart === 0 ? 3 : 1,
          }}
        >
          <div style={{ padding: '40px', height: '100%' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
              Line Chart
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={lineData}>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
                  // Animation properties
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div
          key={`bar-${animationKey}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: currentChart === 1 && !isTransitioning ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: currentChart === 1 ? 3 : 1,
          }}
        >
          <div style={{ padding: '40px', height: '100%' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
              Bar Chart
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={barData}>
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
                  // Animation properties
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div
          key={`pie-${animationKey}`}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: currentChart === 2 && !isTransitioning ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: currentChart === 2 ? 3 : 1,
          }}
        >
          <div style={{ padding: '40px', height: '100%' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: '600' }}>
              Asset Allocation
            </h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                >
                  {pieData.map((entry, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default RotatingChart;