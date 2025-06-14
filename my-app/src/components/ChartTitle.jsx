import React from 'react';

const ChartTitle = ({ ticker, companyName, latestPrice, pctChange }) => {
  if (latestPrice === null || pctChange === null) return null;

  const arrow = pctChange < 0 ? '▼' : pctChange > 0 ? '▲' : '';
  const color = pctChange < 0 ? 'red' : pctChange > 0 ? 'green' : 'black';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        {ticker} - {companyName}   
        <span style={{ color }}>  ${latestPrice.toFixed(2)}{' '}</span>
        <span style={{ color }}>({pctChange.toFixed(2)}%{arrow})</span>
      </h2>
    </div>
  );
};

export default ChartTitle;