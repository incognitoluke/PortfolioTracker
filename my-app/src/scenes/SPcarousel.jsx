import React, { useEffect, useState } from 'react';
import TimeViewCarousel from './TimeViewCarousel';
import TopSubSidebar from '../panels/TopSubSidebar';
import Suhela from '../images/Suhela.png';

const tickers = ['XLE', 'XLP', 'XLF', "GOOGL", 'AMZN', 'NFLX', 'NVDA', 'META', 'AMD', 'INTC','MMM'];
const timeViews = ['1-Day', '1-Week', '1-Month', 'YTD', '5-Year'];

// Global cache to store data for all tickers and time views
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const SPcarousel = ({ onRotationComplete }) => {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [allTickerData, setAllTickerData] = useState(new Map());
  const [currentTimePeriod, setCurrentTimePeriod] = useState(0);

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

  const fetchTickerData = async (ticker, timeView) => {
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

      // Transform the data to match our format
      const transformedData = data.data.map(item => ({
        name: item.date,
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
        pctChange: change,
        companyName: data.company_name || ticker
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
        pctChange: change,
        companyName: ticker
      };

      // Cache fallback data too (but with shorter duration)
      dataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now() - (CACHE_DURATION - 60000) // Cache for only 1 minute if fallback
      });

      return result;
    }
  };

  const preloadAllData = async () => {
    setIsPreloading(true);
    setPreloadProgress(0);
    
    const totalRequests = tickers.length * timeViews.length;
    let completedRequests = 0;
    const tickerDataMap = new Map();

    // Create all fetch promises in the correct order
    const fetchPromises = tickers.flatMap(ticker => 
      timeViews.map(async (timeView, timeViewIndex) => {
        const data = await fetchTickerData(ticker, timeView);
        
        // Update progress
        completedRequests++;
        setPreloadProgress((completedRequests / totalRequests) * 100);
        
        // Store data in ticker map with proper ordering
        if (!tickerDataMap.has(ticker)) {
          tickerDataMap.set(ticker, new Array(timeViews.length));
        }
        tickerDataMap.get(ticker)[timeViewIndex] = data;
        
        return data;
      })
    );

    try {
      await Promise.all(fetchPromises);
      setAllTickerData(tickerDataMap);
      console.log('All ticker data preloaded successfully');
    } catch (error) {
      console.error('Error preloading data:', error);
      // Even if some requests fail, we should have fallback data
      setAllTickerData(tickerDataMap);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    // Preload all data on component mount
    preloadAllData();

    // Set up interval to refresh all data every 5 minutes
    const dataRefreshInterval = setInterval(() => {
      console.log('Refreshing all ticker data in background...');
      preloadAllData();
    }, CACHE_DURATION);

    return () => clearInterval(dataRefreshInterval);
  }, []);

  useEffect(() => {
    // Only start the carousel animation after preloading is complete
    if (!isPreloading && allTickerData.size > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          const nextIndex = (currentTickerIndex + 1) % tickers.length;
          setCurrentTickerIndex(nextIndex);
          setAnimationKey(prev => prev + 1);
          
          // Check if we've completed a full rotation (back to index 0)
          if (nextIndex === 0 && onRotationComplete) {
            console.log('SPcarousel completed full rotation');
            onRotationComplete();
          }
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 800);
      }, 30000); // Changed from 18000 to 30000 (5 time views × 6 seconds each)
      return () => clearInterval(interval);
    }
  }, [isPreloading, allTickerData, currentTickerIndex, onRotationComplete]);

  const currentTicker = tickers[currentTickerIndex];

  if (isPreloading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        height: '100vh', 
        fontFamily: 'Arial, sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        backgroundImage: `url("${Suhela}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '32px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
              }}></div>
            ))}
          </div>
          <div style={{
            color: '#374151',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Loading Market Data...
          </div>
          <div style={{
            width: '300px',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${preloadProgress}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {Math.round(preloadProgress)}% complete ({tickers.length} tickers × {timeViews.length} time views)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      {/* Top Sub Sidebar - Shows ticker rotation and time periods */}
      <TopSubSidebar 
        currentChart={currentTickerIndex} 
        chartTypes={tickers}
        currentTimePeriod={currentTimePeriod}
      />
      
      {/* Chart Area - Between top and bottom sidebars */}
      <div style={{ 
        flex: 1,
        position: 'relative', 
        backgroundColor: '#ffffff',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
      }}>
        {tickers.map((ticker, index) => (
          <div
            key={`${ticker}-${animationKey}`}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: currentTickerIndex === index && !isTransitioning ? 1 : 0,
              transform: currentTickerIndex === index && !isTransitioning ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: currentTickerIndex === index ? 3 : 1,
              pointerEvents: currentTickerIndex === index ? 'auto' : 'none'
            }}
          >
            {/* Only render TimeViewCarousel for the current ticker, but pass preloaded data */}
            {currentTickerIndex === index && (
              <TimeViewCarousel 
                ticker={ticker} 
                preloadedData={allTickerData.get(ticker) || []}
                showTopBar={false}
                showBottomBar={true}
                currentTickerIndex={currentTickerIndex}
                allTickers={tickers}
                onTimePeriodChange={setCurrentTimePeriod}
              />
            )}
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

export default SPcarousel;