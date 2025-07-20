import React from 'react';

const EnhancedTopSubSidebar = ({ 
  currentTickerIndex = 0, 
  currentTimeViewIndex = 0, 
  tickers = [], 
  timeViews = ['1-Day', '1-Week', '1-Month', 'YTD', '5-Year'],
  ticker = '',
  companyName = ''
}) => {
  // Get current date and time
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const formatDate = (date) => {
    const formatted = date.toLocaleDateString('en-US', options);
    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return formatted.replace(/(\d{1,2}),/, `$1${suffix},`).replace(/ at /, ' | ');
  };

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top Row - Date/Time */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{ 
          margin: '0', 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1e293b' 
        }}>
          {formatDate(now)}
        </h2>
      </div>
      
      {/* Second Row - Available Charts */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '500', 
          color: '#64748b', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Available Charts:
        </span>
        {tickers.map((tickerItem, index) => (
          <div
            key={tickerItem}
            style={{
              padding: '4px 8px',
              backgroundColor: currentTickerIndex === index ? '#e0f2fe' : '#ffffff',
              border: currentTickerIndex === index ? '1px solid #0891b2' : '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '12px',
              color: currentTickerIndex === index ? '#0891b2' : '#64748b',
              fontWeight: currentTickerIndex === index ? '500' : '400'
            }}
          >
            {tickerItem}
          </div>
        ))}
      </div>

      {/* Third Row - Available Series */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '500', 
          color: '#64748b', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Available Series:
        </span>
        {timeViews.map((timeView, index) => (
          <div
            key={timeView}
            style={{
              padding: '4px 8px',
              backgroundColor: currentTimeViewIndex === index ? '#dcfce7' : '#ffffff',
              border: currentTimeViewIndex === index ? '1px solid #16a34a' : '1px solid #e2e8f0',
              borderRadius: '4px',
              fontSize: '12px',
              color: currentTimeViewIndex === index ? '#16a34a' : '#64748b',
              fontWeight: currentTimeViewIndex === index ? '500' : '400'
            }}
          >
            {timeView}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedTopSubSidebar;