import React, { useState, useEffect } from 'react';

const WatchlistSidebar = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  const fetchWatchlistData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist/data`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch watchlist data');
      }

      const data = await response.json();
      
      setHoldings(data.watchlist || []);
      setLastUpdated(new Date());
      
    } catch (err) {
      setError('Failed to load watchlist data');
      console.error('Error fetching watchlist data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlistData();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchWatchlistData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const addToWatchlist = async () => {
    const symbol = newSymbol.trim().toUpperCase();
    
    if (!symbol) {
      setError('Please enter a valid symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist/${symbol}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add symbol');
      }

      setNewSymbol('');
      setError('');
      
      // Refresh the watchlist data
      await fetchWatchlistData();
      
    } catch (err) {
      setError(err.message || 'Failed to add symbol to watchlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/watchlist/${symbol}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove symbol');
      }

      // Refresh the watchlist data
      await fetchWatchlistData();
      
    } catch (err) {
      setError(err.message || 'Failed to remove symbol from watchlist');
      console.error('Error removing symbol:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString() : '';
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8fafc',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            margin: '0',
            fontSize: '24px', // Fixed the typo from '2-px'
            fontWeight: '600',
            color: '#737375ff',
            textAlign: 'center',
            width: '100%',
            fontFamily: 'Arapey'
          }}>
            SUHELA
          </h2>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center', 
          justifyContent: 'center' // This centers the content horizontally
        }}>
          {lastUpdated && (
            <span style={{
              fontSize: '11px',
              color: '#64748b'
            }}>
              <b>Latest Price Update: </b>
              {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchWatchlistData}
            disabled={loading}
            style={{
              padding: '4px 8px',
              backgroundColor: loading ? '#e2e8f0' : '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#64748b'
            }}
          >
            {loading ? '↻' : '⟳'}
          </button>
        </div>

        {error && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            fontSize: '12px',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Holdings List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0'
      }}>
        {loading && holdings.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px'
          }}>
            Loading watchlist...
          </div>
        ) : holdings.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px'
          }}>
            No stocks in watchlist. Add some symbols to get started!
          </div>
        ) : (
          holdings.map((holding, index) => (
            <div
              key={`${holding.symbol}-${index}`}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#ffffff',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                const removeBtn = e.currentTarget.querySelector('.remove-btn');
                if (removeBtn) removeBtn.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                const removeBtn = e.currentTarget.querySelector('.remove-btn');
                if (removeBtn) removeBtn.style.opacity = '0';
              }}
            >
              {/* Remove Button */}
              <button
                className="remove-btn"
                onClick={() => removeFromWatchlist(holding.symbol)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  fontSize: '12px',
                  cursor: 'pointer',
                  opacity: '0',
                  transition: 'opacity 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>

              {/* Stock Symbol and Name */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '2px'
                  }}>
                    {holding.symbol}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    lineHeight: '1.2'
                  }}>
                    {holding.name}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    {formatCurrency(holding.price)}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: holding.change >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)} ({formatPercent(holding.changePercent)})
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Symbol Form - Always Visible */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <input
            type="text"
            placeholder="Enter symbol (e.g., AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
            disabled={loading}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          />

        </div>
      </div>
    </div>
  );
};

export default WatchlistSidebar;