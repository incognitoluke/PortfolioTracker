import React, { useState, useEffect } from 'react';

const WatchlistSidebar = () => {
  const [holdings, setHoldings] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      shares: 50,
      value: 8771.50
    },
    {
      id: 2,
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.56,
      change: -1.23,
      changePercent: -0.85,
      shares: 25,
      value: 3564.00
    },
    {
      id: 3,
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.85,
      change: 4.67,
      changePercent: 1.25,
      shares: 30,
      value: 11365.50
    },
    {
      id: 4,
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.42,
      change: -8.15,
      changePercent: -3.18,
      shares: 15,
      value: 3726.30
    },
    {
      id: 5,
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 456.78,
      change: 12.34,
      changePercent: 2.78,
      shares: 20,
      value: 9135.60
    }
  ]);

  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);

  useEffect(() => {
    const total = holdings.reduce((sum, holding) => sum + holding.value, 0);
    const gainLoss = holdings.reduce((sum, holding) => sum + (holding.change * holding.shares), 0);
    setTotalValue(total);
    setTotalGainLoss(gainLoss);
  }, [holdings]);

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
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Portfolio Watchlist
        </h2>
        
        {/* Portfolio Summary */}
        <div style={{
          backgroundColor: '#f1f5f9',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Total Value
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            {formatCurrency(totalValue)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <span style={{ color: '#64748b', marginRight: '8px' }}>Today:</span>
          <span style={{
            color: totalGainLoss >= 0 ? '#10b981' : '#ef4444'
          }}>
            {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
          </span>
        </div>
      </div>

      {/* Holdings List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0'
      }}>
        {holdings.map((holding) => (
          <div
            key={holding.id}
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {/* Stock Symbol and Name */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px'
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

            {/* Holdings Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div style={{ color: '#64748b' }}>
                {holding.shares} shares
              </div>
              <div style={{
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {formatCurrency(holding.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <button style={{
          width: '100%',
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
        >
          + Add to Watchlist
        </button>
      </div>
    </div>
  );
};

export default WatchlistSidebar;