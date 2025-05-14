
/**
 * Index Page for Agrovet Dashboard
 */

import React, { useEffect, useRef } from 'react';

const Index = () => {
  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAgrovetApp = async () => {
      try {
        // Dynamically import the App component to use it without React integration
        const { default: App } = await import('../components/App.js');
        
        // Initialize the app
        if (appContainerRef.current) {
          new App(appContainerRef.current);
        }
      } catch (error) {
        console.error('Error loading Agrovet Dashboard:', error);
      }
    };
    
    loadAgrovetApp();
  }, []);

  return (
    <div ref={appContainerRef} className="min-h-screen w-full">
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agrovet-600"></div>
      </div>
    </div>
  );
};

export default Index;
