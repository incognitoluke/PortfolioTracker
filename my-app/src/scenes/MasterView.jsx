import React, { useEffect, useState, useCallback } from 'react';
import WACarousel from './WAcarousel';
import SPcarousel from './SPcarousel';
import SectorOverview from './SectorOverview';
import TopSidebar from '../panels/TopSidebar';
import Suhela from '../images/Suhela.png';

const views = [
  { name: 'Watchlist Carousel', component: WACarousel },
  { name: 'S&P Carousel', component: SPcarousel },
  { name: 'Sector Overview', component: SectorOverview }
];

const MasterView = () => {
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sectorViewTimer, setSectorViewTimer] = useState(null);

  // Callback function that child components can call when they complete a rotation
  const handleRotationComplete = useCallback(() => {
    console.log(`${views[currentViewIndex].name} completed rotation, switching to next view`);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentViewIndex(prev => (prev + 1) % views.length);
      setAnimationKey(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 800);
  }, [currentViewIndex]);

  // Handle SectorOverview timing (since it doesn't have a rotation)
  useEffect(() => {
    if (currentViewIndex === 2) { // SectorOverview index
      // Show SectorOverview for 30 seconds, then move to next view
      const timer = setTimeout(() => {
        handleRotationComplete();
      }, 30000);
      setSectorViewTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    } else {
      // Clear any existing sector timer when not on sector view
      if (sectorViewTimer) {
        clearTimeout(sectorViewTimer);
        setSectorViewTimer(null);
      }
    }
  }, [currentViewIndex, handleRotationComplete]);

  const currentView = views[currentViewIndex];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Top Sidebar - Shows view rotation */}
      <TopSidebar 
        currentChart={currentViewIndex} 
        chartTypes={views.map(view => view.name)}
        currentTicker={currentView.name}
      />
      
      {/* View Area */}
      <div style={{ 
        flex: 1,
        position: 'relative', 
        backgroundColor: '#ffffff',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '800px 800px',
        overflow: 'hidden'
      }}>
        {views.map((view, index) => {
          const ViewComponent = view.component;
          return (
            <div
              key={`${view.name}-${animationKey}`}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: currentViewIndex === index && !isTransitioning ? 1 : 0,
                transform: currentViewIndex === index && !isTransitioning ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: currentViewIndex === index ? 3 : 1,
                pointerEvents: currentViewIndex === index ? 'auto' : 'none'
              }}
            >
              {/* Only render the current view component to optimize performance */}
              {currentViewIndex === index && (
                <div style={{ width: '100%', height: '100%' }}>
                  {/* Pass the rotation complete callback to carousel components */}
                  {view.name === 'Watchlist Carousel' && (
                    <ViewComponent onRotationComplete={handleRotationComplete} />
                  )}
                  {view.name === 'S&P Carousel' && (
                    <ViewComponent onRotationComplete={handleRotationComplete} />
                  )}
                  {view.name === 'Sector Overview' && (
                    <ViewComponent />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Transition Loading Indicator */}
        {isTransitioning && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                }}></div>
              ))}
            </div>
            <div style={{
              color: '#626566',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              Switching to {views[(currentViewIndex + 1) % views.length].name}...
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

export default MasterView;