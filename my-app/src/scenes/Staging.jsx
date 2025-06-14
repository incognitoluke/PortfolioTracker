import React, { useEffect, useState } from 'react';
import LineChartComponent from '../components/LineChartComponent';
import ChartTitle from '../components/ChartTitle';

const Staging = () => {
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const [pctChange, setPctChange] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/stock/AAPL');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
          throw new Error('Unexpected data format from server');
        }

        if (transformedData.length >= 2) {
          const newest = transformedData[transformedData.length - 1].value;
          const oldest = transformedData[0].value;
          const change = ((newest - oldest) / oldest) * 100;
          setLatestPrice(newest);
          setPctChange(change);
        }

        setLineData(transformedData);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError(err.message);
        const fallbackData = [
          { name: '9:30', value: 196.50 },
          { name: '16:00', value: 199.10 }
        ];
        setLineData(fallbackData);

        const newest = fallbackData[fallbackData.length - 1].value;
        const oldest = fallbackData[0].value;
        const change = ((newest - oldest) / oldest) * 100;
        setLatestPrice(newest);
        setPctChange(change);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>

      <LineChartComponent
        data={lineData}
        title={<ChartTitle ticker={"AAPL"} latestPrice={latestPrice} pctChange={pctChange} />}
      />
    </div>
  );
};

export default Staging;
