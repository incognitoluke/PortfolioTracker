import React from 'react';
import TreeChartComponent from '../components/TreeChartComponent';

const Staging = () => {
  // Sample tree map data
  const sampleData = [
    { name: 'Technology', size: 2500 },
    { name: 'Healthcare', size: 1800 },
    { name: 'Finance', size: 1200 },
    { name: 'Education', size: 950 },
    { name: 'Retail', size: 800 },
    { name: 'Manufacturing', size: 650 },
    { name: 'Energy', size: 500 },
    { name: 'Transportation', size: 400 },
    { name: 'Media', size: 300 },
    { name: 'Food & Beverage', size: 250 }
  ];

  return (
    <div style={{ 
      width: '100%',
      height: '100vh',
      backgroundColor: '#f8f9fa' 
    }}>
      {/* Tree Map Section */}
      <div style={{ 
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
      }}>
        <TreeChartComponent
          data={sampleData}
          title="Market Share by Industry"
        />
      </div>
    </div>
  );
};

export default Staging;