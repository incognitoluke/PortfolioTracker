import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BarChartComponent from '../components/BarChartComponent';
import LineChartComponent from '../components/LineChartComponent';
import PieChartComponent from '../components/PieChartComponent'
import TopSidebar from '../panels/TopSidebar';
import Suhela from '../images/Suhela.png';

// Main Rotating Chart Component (Stage Parent)
const RotatingChart = () => {
  const [currentChart, setCurrentChart] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade-out to complete, then switch charts
      setTimeout(() => {
        setCurrentChart(prev => (prev + 1) % 3);
        setAnimationKey(prev => prev + 1);
        
        // Allow new chart to fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 800); // Wait for fade-out transition
      
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Sample data for each chart
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
    { name: '9:30', value: 196.50 },
    { name: '9:45', value: 197.20 },
    { name: '10:00', value: 196.85 },
    { name: '10:15', value: 197.65 },
    { name: '10:30', value: 198.10 },
    { name: '10:45', value: 197.90 },
    { name: '11:00', value: 198.45 },
    { name: '11:15', value: 198.75 },
    { name: '11:30', value: 198.20 },
    { name: '11:45', value: 197.95 },
    { name: '12:00', value: 198.30 },
    { name: '12:15', value: 198.60 },
    { name: '12:30', value: 198.15 },
    { name: '12:45', value: 197.80 },
    { name: '13:00', value: 198.25 },
    { name: '13:15', value: 198.50 },
    { name: '13:30', value: 199.10 },
    { name: '13:45', value: 199.35 },
    { name: '14:00', value: 198.95 },
    { name: '14:15', value: 199.20 },
    { name: '14:30', value: 198.70 },
    { name: '14:45', value: 199.40 },
    { name: '15:00', value: 199.75 },
    { name: '15:15', value: 199.30 },
    { name: '15:30', value: 199.55 },
    { name: '15:45', value: 199.85 },
    { name: '16:00', value: 199.10 }
];

  const chartTypes = ['Line Chart', 'Bar Chart', 'Asset Allocation'];

  // Chart configurations
  const chartConfigs = [
    {
      component: LineChartComponent,
      data: lineData,
      title: "Line Chart"
    },
    {
      component: BarChartComponent,
      data: barData,
      title: "Bar Chart"
    },
    {
      component: PieChartComponent,
      data: pieData,
      title: "Asset Allocation"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      {/* Top Sidebar Component */}
      <TopSidebar 
        currentChart={currentChart} 
        chartTypes={chartTypes} 
      />

      {/* Chart Area - Full width below top bar */}
      <div style={{ 
        flex: 1,
        position: 'relative', 
        backgroundColor: '#ffffff',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url("${Suhela}")`,
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
      }}>
        {chartConfigs.map((config, index) => {
          const ChartComponent = config.component;
          const isActive = currentChart === index;
          
          return (
            <div
              key={`${index}-${animationKey}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: isActive && !isTransitioning ? 1 : 0,
                transform: isActive && !isTransitioning ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: isActive ? 3 : 1,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <ChartComponent 
                data={config.data} 
                title={config.title}
              />
            </div>
          );
        })}

        {/* Transition Loading Indicator */}
        {isTransitioning && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite both',
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out 0.16s infinite both',
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out 0.32s infinite both',
              }}></div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default RotatingChart;