import React from 'react';
import Plot from 'react-plotly.js';

const BarChartComponent = ({ labels, values, title = 'Bar Chart' }) => {
  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: labels,
          y: values,
          marker: { color: 'orange' },
        }
      ]}
      layout={{
        title,
        xaxis: { title: 'Categories' },
        yaxis: { title: 'Values' },
        autosize: true,
        margin: { t: 40, l: 50, r: 30, b: 50 },
      }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default BarChartComponent;
