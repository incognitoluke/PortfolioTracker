import React, { useEffect, useState } from 'react';
import TimeViewCarousel from './TimeViewCarousel';
import TopSidebar from '../panels/TopSidebar';
import Suhela from '../images/Suhela.png';

const tickers = ['XLE', 'XLP', 'XLF', "GOOGL", 'AMZN', 'NFLX', 'NVDA', 'META', 'AMD', 'INTC','MMM'];

const SPcarousel = () => {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Cycle through companies every 18 seconds (6 seconds per time view × 3 views)
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTickerIndex(prev => (prev + 1) % tickers.length);
        setAnimationKey(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 800);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const currentTicker = tickers[currentTickerIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <TopSidebar 
        currentChart={currentTickerIndex} 
        chartTypes={tickers}
        currentTicker={currentTicker}
      />
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
            {/* Only render TimeViewCarousel for the current ticker to optimize performance */}
            {currentTickerIndex === index && (
              <TimeViewCarousel ticker={ticker} />
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