import React from 'react';

const TopSubSidebar = ({ currentChart, chartTypes }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(256, 256, 256)',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      flexWrap: 'wrap'
    }}>

      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '500', 
          color: '#64748b', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Available Charts:
        </span>
        {chartTypes.map((type, index) => (
          <div
            key={type}
            style={{
              padding: '4px 8px',
              backgroundColor: currentChart === index ? '#e0f2fe' : '#ffffff',
              border: currentChart === index ? '1px solid #0891b2' : '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '12px',
              color: currentChart === index ? '#0891b2' : '#64748b',
              fontWeight: currentChart === index ? '500' : '400'
            }}
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSubSidebar;