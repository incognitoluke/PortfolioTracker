import React from 'react';
import WatchlistSidebar from './panels/WatchlistSidebar';
import RotatingChart from './scenes/RotatingChart';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';


const App = () => {
  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Watchlist Sidebar - 20% width */}
      <div style={{
        width: '20%',
        height: '100%',
        flexShrink: 0
      }}>
        <WatchlistSidebar />
      </div>

      {/* Main Content Area - 80% width */}
      <div style={{
        width: '80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <RotatingChart />
      </div>
    </div>
  );
};

export default App;