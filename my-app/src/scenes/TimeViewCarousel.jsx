import React, { useEffect, useState } from 'react';
import LineChartComponent from '../components/LineChartComponent';
import ChartTitle from '../components/ChartTitle';
import TopSubSidebar from '../panels/TopSubSidebar';
import Suhela from '../images/Suhela.png';

const timeViews = ['1-Day', 'YTD', '5-Year'];
const DEFAULT_TICKER = 'AAPL'; // You can make this configurable

// Global cache to store data for all tickers and time views
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const TimeViewCarousel = ({ ticker = DEFAULT_TICKER }) => {
  const [chartIndex, setChartIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataWithCache = async () => {
      setIsLoading(true);
      
      const results = await Promise.all(
        timeViews.map(async (timeView) => {
          const cacheKey = `${ticker}-${timeView}`;
          const cached = dataCache.get(cacheKey);
          
          // Check if we have valid cached data
          if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`Using cached data for ${cacheKey}`);
            return cached.data;
          }

          try {
            console.log(`Fetching fresh data for ${cacheKey}`);
            const { period, interval } = getPeriodAndInterval(timeView);
            const response = await fetch(`http://localhost:5000/api/stock/${ticker}?period=${period}&interval=${interval}`);
            
            if (!response.ok) throw new Error();
            const data = await response.json();

            // Set company name from first successful response
            if (!companyName && data.company_name) {
              setCompanyName(data.company_name);
            }

            // Transform the data to match our format
            const transformedData = data.data.map(item => ({
              name: item.date, // Server already formats dates appropriately
              value: parseFloat(item.price)
            }));

            const newest = transformedData[transformedData.length - 1].value;
            const oldest = transformedData[0].value;
            const change = ((newest - oldest) / oldest) * 100;

            const result = {
              timeView,
              ticker,
              data: transformedData,
              latestPrice: newest,
              pctChange: change
            };

            // Cache the result with timestamp
            dataCache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            });

            return result;
          } catch (err) {
            console.log(`Using fallback data for ${cacheKey}`);
            // Fallback data for each time view
            const fallbackData = generateFallbackData(timeView);
            const newest = fallbackData[fallbackData.length - 1].value;
            const oldest = fallbackData[0].value;
            const change = ((newest - oldest) / oldest) * 100;
            
            const result = {
              timeView,
              ticker,
              data: fallbackData,
              latestPrice: newest,
              pctChange: change
            };

            // Cache fallback data too (but with shorter duration)
            dataCache.set(cacheKey, {
              data: result,
              timestamp: Date.now() - (CACHE_DURATION - 60000) // Cache for only 1 minute if fallback
            });

            return result;
          }
        })
      );
      
      setChartData(results);
      setIsLoading(false);
    };

    // Initial fetch
    fetchDataWithCache();

    // Set up interval to refresh data every 5 minutes
    const dataRefreshInterval = setInterval(() => {
      // Don't show loading on background refreshes
      fetchDataWithCache();
    }, CACHE_DURATION);

    return () => clearInterval(dataRefreshInterval);
  }, [ticker, companyName]);

  useEffect(() => {
    // Only start the carousel animation after data is loaded
    if (!isLoading && chartData.length > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setChartIndex(prev => (prev + 1) % timeViews.length);
          setAnimationKey(prev => prev + 1);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 800);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isLoading, chartData]);

  const getPeriodAndInterval = (timeView) => {
    // Map time views to appropriate yfinance period and interval parameters
    switch (timeView) {
      case '1-Day':
        return { period: '1d', interval: '5m' }; // Intraday 5-minute intervals
      case 'YTD':
        return { period: 'ytd', interval: '1d' }; // Year-to-date daily data
      case '5-Year':
        return { period: '5y', interval: '1wk' }; // 5 years with weekly intervals
      default:
        return { period: '1d', interval: '5m' };
    }
  };

  const formatDateForTimeView = (dateString, timeView) => {
    // The server already formats dates appropriately based on interval
    // So we can just return the date string as-is
    return dateString;
  };

  const generateFallbackData = (timeView) => {
    const baseValue = 150;
    const volatility = 0.02;
    
    switch (timeView) {
      case '1-Day':
        // Generate hourly data for trading day (9:30 AM to 4:00 PM)
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
      
      case 'YTD':
        // Generate monthly data from January to current month
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
        // Generate yearly data for last 5 years
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

  const getDisplayTitle = (entry) => {
    const timeViewLabel = entry.timeView;
    return (
      <ChartTitle 
        ticker={entry.ticker} 
        companyName={companyName || entry.ticker}
        latestPrice={entry.latestPrice} 
        pctChange={entry.pctChange}
        timeView={timeViewLabel}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <TopSubSidebar 
        currentChart={chartIndex} 
        chartTypes={timeViews}
        ticker={ticker}
        companyName={companyName}
      />
      <div style={{ 
        flex: 1,
        position: 'relative', 
        backgroundColor: '#ffffff',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url("${Suhela}")`,
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
      }}>
        {isLoading ? (
          // Loading state - show spinner
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
          // Charts - only render when data is loaded
          <>
            {chartData.map((entry, index) => (
              <div
                key={`${index}-${animationKey}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: chartIndex === index && !isTransitioning ? 1 : 0,
                  transform: chartIndex === index && !isTransitioning ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  zIndex: chartIndex === index ? 3 : 1,
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
                zIndex: 10
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