import React from 'react';
import Plot from 'react-plotly.js';

const ChartComponent = ({ data, layout }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Plot
        data={data}
        layout={{
          autosize: true,
          margin: { t: 40, l: 50, r: 30, b: 50 },
          ...layout
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ChartComponent;
