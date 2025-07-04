import React, { useState, useEffect } from 'react';
import './Loader.css';

function Loader({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 800); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`loader-container ${!isVisible ? 'hidden' : ''}`}>
      <div className="neon-text">DU_ARTSTUDIO</div>
    </div>
  );
}

export default Loader;