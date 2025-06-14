import React, { useEffect, useState } from 'react';
import LineChartComponent from '../components/LineChartComponent';
import ChartTitle from '../components/ChartTitle';
import TopSidebar from '../panels/TopSidebar';
import Suhela from '../images/Suhela.png';

const tickers = ['TSLA', 'AAPL', 'MSFT', "GOOGL", 'AMZN', 'NFLX', 'NVDA', 'META', 'AMD', 'INTC'];

const SPcarousel = () => {
  const [chartIndex, setChartIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const results = await Promise.all(
        tickers.map(async ticker => {
          try {
            const response = await fetch(`http://localhost:5000/api/stock/${ticker}`);
            if (!response.ok) throw new Error();
            const data = await response.json();

            let transformedData;
            if (Array.isArray(data)) {
              transformedData = data.map(item => ({
                name: formatDate(item.date || item.timestamp),
                value: parseFloat(item.price || item.close || item.value)
              }));
            } else if (data.dates && data.prices) {
              transformedData = data.dates.map((date, index) => ({
                name: formatDate(date),
                value: parseFloat(data.prices[index])
              }));
            } else if (data.data) {
              transformedData = data.data.map(item => ({
                name: formatDate(item.date || item.timestamp),
                value: parseFloat(item.price || item.close || item.value)
              }));
            } else {
              throw new Error('Unexpected format');
            }

            const newest = transformedData[transformedData.length - 1].value;
            const oldest = transformedData[0].value;
            const change = ((newest - oldest) / oldest) * 100;

            return {
              ticker,
              data: transformedData,
              latestPrice: newest,
              pctChange: change
            };
          } catch (err) {
            const fallback = [
              { name: '9:30', value: 100 },
              { name: '16:00', value: 105 }
            ];
            const change = ((105 - 100) / 100) * 100;
            return {
              ticker,
              data: fallback,
              latestPrice: 105,
              pctChange: change
            };
          }
        })
      );
      setChartData(results);
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setChartIndex(prev => (prev + 1) % tickers.length);
        setAnimationKey(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 800);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <TopSidebar 
        currentChart={chartIndex} 
        chartTypes={tickers} 
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
              title={<ChartTitle ticker={entry.ticker} latestPrice={entry.latestPrice} pctChange={entry.pctChange} />}
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
