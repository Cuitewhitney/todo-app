import React, { useState, useEffect } from 'react';

const Greetings: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  }));

  useEffect(() => {
    // time Update every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    // This section sets the background based on time of day
    const updateBackground = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        // Morning: Sky Blue
        document.body.style.background = 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%)';
        document.body.style.color = '#1e40af';
      } else if (hour >= 12 && hour < 17) {
        // Afternoon: Golden Sun
        document.body.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
        document.body.style.color = '#92400e';
      } else if (hour >= 17 && hour < 20) {
        // Evening: Sunset Orange
        document.body.style.background = 'linear-gradient(135deg, #FF8C00 0%, #FF4500 100%)';
        document.body.style.color = '#7c2d12';
      } else {
        // Night: Deep Teal
        document.body.style.background = 'linear-gradient(135deg, #1e3a3a 0%, #2F4F4F 50%, #12232e 100%)';
        document.body.style.color = '#e2e8f0';
      }
    };

    updateBackground();
    const interval = setInterval(updateBackground, 60000); // Re-check every minute

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="text-center py-12 px-6">
      <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-in fade-in slide-in-from-bottom duration-1000">
        <span className="bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-2xl">
          Hello, {getGreeting()}!
        </span>
      </h1>

      <div className="mb-10">
        <p className="text-3xl md:text-4xl font-mono font-bold tracking-wider">
          <span className="inline-block animate-pulse bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30 shadow-2xl">
            {currentTime}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Greetings;