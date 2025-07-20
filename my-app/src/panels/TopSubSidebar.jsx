import React from 'react';

const TopSubSidebar = ({ currentChart, chartTypes, currentTimePeriod = 0 }) => {
  const timePeriods = ['1-Day', '1-Week', '1-Month', 'YTD', '5-Year'];

  return (
    <div style={{
      backgroundColor: 'rgba(256, 256, 256)',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      
      {/* Available Charts */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '500', 
          color: '#64748b', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginRight: '4px'
        }}>
          Available Charts:
        </span>
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
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
                fontWeight: currentChart === index ? '500' : '400',
                whiteSpace: 'nowrap'
              }}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Available Time Periods */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '500', 
          color: '#64748b', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginRight: '4px'
        }}>
          Available Time Periods:
        </span>
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap'
        }}>
          {timePeriods.map((period, index) => (
            <div
              key={period}
              style={{
                padding: '4px 8px',
                backgroundColor: currentTimePeriod === index ? '#dcfce7' : '#ffffff',
                border: currentTimePeriod === index ? '1px solid #16a34a' : '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '12px',
                color: currentTimePeriod === index ? '#16a34a' : '#64748b',
                fontWeight: currentTimePeriod === index ? '500' : '400',
                whiteSpace: 'nowrap'
              }}
            >
              {period}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSubSidebar;