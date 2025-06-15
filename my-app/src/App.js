import React from 'react';
import WatchlistSidebar from './panels/WatchlistSidebar';
import RotatingChart from './scenes/RotatingChart';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Staging from './scenes/Staging';
import SPcarousel from './scenes/SPcarousel';
import TimeViewCarousel from './scenes/TimeViewCarousel';


const App = () => {
  return (
    <Router>
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
          <Routes>
            <Route path="/" element={<RotatingChart />} />
            <Route path="/staging" element={<Staging />} />
            <Route path="/carousel" element={<SPcarousel />} />
            <Route path="/time" element={<TimeViewCarousel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;