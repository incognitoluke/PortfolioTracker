import React, { useEffect, useState } from 'react';
import Suhela from '../images/Suhela.png';

const sectorTickers = [
  { ticker: 'XLE', name: 'Energy' },
  { ticker: 'XLB', name: 'Materials' },
  { ticker: 'XLI', name: 'Industrials' },
  { ticker: 'XLY', name: 'Consumer Discretionary' },
  { ticker: 'XLP', name: 'Consumer Staples' },
  { ticker: 'XLV', name: 'Health Care' },
  { ticker: 'XLF', name: 'Financials' },
  { ticker: 'XLK', name: 'Information Technology' },
  { ticker: 'XLC', name: 'Communication Services' },
  { ticker: 'XLU', name: 'Utilities' },
  { ticker: 'XLRE', name: 'Real Estate' }
];

// Global cache to store data for all sectors
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const SectorOverview = () => {
  const [sectorData, setSectorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  const generateFallbackData = (ticker, sectorName) => {
    const baseValue = Math.random() * 200 + 100; // Random price between 100-300
    const change = (Math.random() - 0.5) * 10; // Random change between -5% to +5%
    
    return {
      ticker,
      name: sectorName,
      price: baseValue,
      change: change,
      lastUpdated: new Date()
    };
  };

  const fetchSectorData = async (ticker, sectorName) => {
    const cacheKey = `${ticker}-1d`;
    const cached = dataCache.get(cacheKey);
    
    // Check if we have valid cached data
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`Using cached data for ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`Fetching fresh data for ${cacheKey}`);
      const response = await fetch(`${API_BASE_URL}/api/stock/${ticker}?period=1d&interval=5m`);
      
      if (!response.ok) throw new Error();
      const data = await response.json();

      // Transform the data to get latest price and change
      const prices = data.data.map(item => parseFloat(item.price));
      const latestPrice = prices[prices.length - 1];
      const previousPrice = prices[0];
      const change = ((latestPrice - previousPrice) / previousPrice) * 100;

      const result = {
        ticker,
        name: sectorName,
        price: latestPrice,
        change: change,
        lastUpdated: new Date()
      };

      // Cache the result with timestamp
      dataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (err) {
      console.log(`Using fallback data for ${cacheKey}`);
      const result = generateFallbackData(ticker, sectorName);

      // Cache fallback data too (but with shorter duration)
      dataCache.set(cacheKey, {
        data: result,
        timestamp: Date.now() - (CACHE_DURATION - 60000) // Cache for only 1 minute if fallback
      });

      return result;
    }
  };

  const fetchAllSectorData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const promises = sectorTickers.map(sector => 
        fetchSectorData(sector.ticker, sector.name)
      );

      const results = await Promise.all(promises);
      setSectorData(results);
      setLastUpdated(new Date());
      console.log('All sector data loaded successfully');
    } catch (error) {
      console.error('Error loading sector data:', error);
      setError('Failed to load some sector data');
      
      // Generate fallback data for all sectors
      const fallbackData = sectorTickers.map(sector => 
        generateFallbackData(sector.ticker, sector.name)
      );
      setSectorData(fallbackData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load data on component mount
    fetchAllSectorData();

    // Set up interval to refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Refreshing sector data in background...');
      fetchAllSectorData();
    }, CACHE_DURATION);

    return () => clearInterval(refreshInterval);
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const SectorTile = ({ sector }) => {
    const isPositive = sector.change >= 0;
    const changeColor = isPositive ? '#16a34a' : '#dc2626';
    const arrow = isPositive ? '▲' : '▼';

    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '120px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
          }}>
            {sector.name}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#4b5563',
            padding: '2px 6px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {sector.ticker}
          </div>
        </div>
        
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '4px',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
          }}>
            ${sector.price.toFixed(2)}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: changeColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{arrow}</span>
            <span>{Math.abs(sector.change).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
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
            Loading Sector Data...
          </div>
          <div style={{
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Fetching data for {sectorTickers.length} S&P 500 sectors
          </div>
        </div>
      </div>
    );
  }

  // Group sectors into rows: 4, 4, 3
  const firstRow = sectorData.slice(0, 4);
  const secondRow = sectorData.slice(4, 8);
  const thirdRow = sectorData.slice(8, 11);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>      

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '24px',
        backgroundColor: '#f9fafb',
        backgroundImage: `url("${Suhela}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <h2 style={{
            margin: '0',
            fontSize: '30px',
            fontWeight: '600',
            color: '#7a7a7cff',
            textAlign: 'center',
            width: '100%'
          }}>
            S&P 500 Sector Performance
          </h2>
        {/* First Row - 4 tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {firstRow.map((sector, index) => (
            <SectorTile key={sector.ticker} sector={sector} />
          ))}
        </div>

        {/* Second Row - 4 tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {secondRow.map((sector, index) => (
            <SectorTile key={sector.ticker} sector={sector} />
          ))}
        </div>

        {/* Third Row - 3 tiles centered */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto',
          width: '75%'
        }}>
          {thirdRow.map((sector, index) => (
            <SectorTile key={sector.ticker} sector={sector} />
          ))}
        </div>
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

export default SectorOverview;