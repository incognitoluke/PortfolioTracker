import React, { useEffect, useState } from 'react';
import LineChartComponent from '../components/LineChartComponent';
import ChartTitle from '../components/ChartTitle';
import TopSubSidebar from '../panels/TopSubSidebar';
import Suhela from '../images/Suhela.png';

const timeViews = ['1-Day', '1-Week', '1-Month', 'YTD', '5-Year'];
const DEFAULT_TICKER = 'AAPL';

const TimeViewCarousel = ({ 
  ticker = DEFAULT_TICKER, 
  preloadedData = [], 
  showTopBar = true, 
  showBottomBar = true,
  currentTickerIndex = 0,
  allTickers = [],
  onTimePeriodChange
}) => {
  const [chartIndex, setChartIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [companyName, setCompanyName] = useState('');

  const getPeriodAndInterval = (timeView) => {
    switch (timeView) {
      case '1-Day':
        return { period: '1d', interval: '5m' };
      case '1-Week':
        return { period: '5d', interval: '1h' };
      case '1-Month':
        return { period: '1mo', interval: '1d' };
      case 'YTD':
        return { period: 'ytd', interval: '1d' };
      case '5-Year':
        return { period: '5y', interval: '1wk' };
      default:
        return { period: '1d', interval: '5m' };
    }
  };

  const generateFallbackData = (timeView) => {
    const baseValue = 150;
    const volatility = 0.02;
    
    switch (timeView) {
      case '1-Day':
        return Array.from({ length: 7 }, (_, i) => {
          const hour = 9 + Math.floor((i * 6.5) / 6);
          const minute = i === 0 ? 30 : (i * 30) % 60;
          const time = `${hour}:${minute.toString().padStart(2, '0')}`;
          const randomChange = (Math.random() - 0.5) * volatility;
          return {
            name: time,
            value: baseValue * (1 + randomChange * (i + 1))
          };
        });
      
      case '1-Week':
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        return Array.from({ length: 5 }, (_, i) => {
          const randomChange = (Math.random() - 0.5) * 0.05;
          return {
            name: weekDays[i],
            value: baseValue * (1 + randomChange * (i + 1))
          };
        });
      
      case '1-Month':
        return Array.from({ length: 20 }, (_, i) => {
          const day = i + 1;
          const randomChange = (Math.random() - 0.5) * 0.08;
          return {
            name: `${day}`,
            value: baseValue * (1 + randomChange * (i + 1))
          };
        });
      
      case 'YTD':
        const currentMonth = new Date().getMonth() + 1;
        return Array.from({ length: currentMonth }, (_, i) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const randomChange = (Math.random() - 0.4) * 0.3;
          return {
            name: monthNames[i],
            value: baseValue * (1 + randomChange * (i + 1))
          };
        });
      
      case '5-Year':
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => {
          const year = currentYear - 4 + i;
          const randomChange = (Math.random() - 0.3) * 0.8;
          return {
            name: year.toString(),
            value: baseValue * (1 + randomChange * (i + 1))
          };
        });
      
      default:
        return [{ name: 'No Data', value: baseValue }];
    }
  };

  const fetchDataIndividually = async () => {
    const results = await Promise.all(
      timeViews.map(async (timeView) => {
        try {
          const { period, interval } = getPeriodAndInterval(timeView);
          const response = await fetch(`http://localhost:5000/api/stock/${ticker}?period=${period}&interval=${interval}`);
          
          if (!response.ok) throw new Error();
          const data = await response.json();

          if (!companyName && data.company_name) {
            setCompanyName(data.company_name);
          }

          const transformedData = data.data.map(item => ({
            name: item.date,
            value: parseFloat(item.price)
          }));

          const newest = transformedData[transformedData.length - 1].value;
          const oldest = transformedData[0].value;
          const change = ((newest - oldest) / oldest) * 100;

          return {
            timeView,
            ticker,
            data: transformedData,
            latestPrice: newest,
            pctChange: change,
            companyName: data.company_name || ticker
          };
        } catch (err) {
          console.log(`Using fallback data for ${ticker}-${timeView}`);
          const fallbackData = generateFallbackData(timeView);
          const newest = fallbackData[fallbackData.length - 1].value;
          const oldest = fallbackData[0].value;
          const change = ((newest - oldest) / oldest) * 100;
          
          return {
            timeView,
            ticker,
            data: fallbackData,
            latestPrice: newest,
            pctChange: change,
            companyName: ticker
          };
        }
      })
    );
    
    setChartData(results);
  };

  useEffect(() => {
    if (preloadedData && preloadedData.length > 0) {
      // Always ensure we have exactly 5 time views in the correct order
      const completeData = timeViews.map(timeView => {
        const found = preloadedData.find(item => item.timeView === timeView);
        if (found) {
          return found;
        }
        
        // Generate fallback if missing
        const fallbackData = generateFallbackData(timeView);
        const newest = fallbackData[fallbackData.length - 1].value;
        const oldest = fallbackData[0].value;
        const change = ((newest - oldest) / oldest) * 100;
        
        return {
          timeView,
          ticker,
          data: fallbackData,
          latestPrice: newest,
          pctChange: change,
          companyName: ticker
        };
      });
      
      setChartData(completeData);
      
      const firstEntry = completeData[0];
      if (firstEntry && firstEntry.companyName) {
        setCompanyName(firstEntry.companyName);
      }
    } else {
      fetchDataIndividually();
    }
  }, [ticker, preloadedData]);

  // Report time period changes to parent component
  useEffect(() => {
    if (onTimePeriodChange) {
      onTimePeriodChange(chartIndex);
    }
  }, [chartIndex, onTimePeriodChange]);

  useEffect(() => {
    if (chartData.length === 5) { // Only start when we have all 5 charts
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setChartIndex(prev => {
            const nextIndex = (prev + 1) % 5; // Always cycle through 5 charts
            return nextIndex;
          });
          setAnimationKey(prev => prev + 1);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 800);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [chartData]);

  const getDisplayTitle = (entry) => {
    const timeViewLabel = entry.timeView;
    return (
      <ChartTitle 
        ticker={entry.ticker} 
        companyName={entry.companyName || companyName || entry.ticker}
        latestPrice={entry.latestPrice} 
        pctChange={entry.pctChange}
        timeView={timeViewLabel}
      />
    );
  };

  const isLoading = !preloadedData.length && !chartData.length;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {showTopBar && (
        <TopSubSidebar 
          currentChart={currentTickerIndex}
          chartTypes={allTickers.length > 0 ? allTickers : [ticker]}
          currentTimePeriod={chartIndex}
        />
      )}
      
      <div style={{ 
        height: showBottomBar ? 'calc(100vh - 180px)' : showTopBar ? 'calc(100vh - 120px)' : '100%',
        position: 'relative', 
        backgroundColor: '#ffffff',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url("${Suhela}")`,
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                }}></div>
              ))}
            </div>
            <div style={{
              color: '#626566',
              fontSize: '16px',
              fontWeight: '400'
            }}>
              Loading {ticker} data...
            </div>
          </div>
        ) : (
          <>
            {chartData.map((entry, index) => (
              <div
                key={`${entry.timeView}-${animationKey}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: chartIndex === index && !isTransitioning ? 1 : 0,
                  transform: chartIndex === index && !isTransitioning ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  zIndex: chartIndex === index ? 1 : 0,
                  pointerEvents: chartIndex === index ? 'auto' : 'none'
                }}
              >
                <LineChartComponent
                  data={entry.data}
                  title={getDisplayTitle(entry)}
                />
              </div>
            ))}

            {isTransitioning && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                    }}></div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>


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

export default TimeViewCarousel;