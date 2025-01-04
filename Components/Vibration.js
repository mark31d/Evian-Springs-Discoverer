import React, { createContext, useState, useContext } from 'react';

const VibrationContext = createContext();

export const VibrationProvider = ({ children }) => {
  const [vibrationOn, setVibrationOn] = useState(true);

  return (
    <VibrationContext.Provider value={{ vibrationOn, setVibrationOn }}>
      {children}
    </VibrationContext.Provider>
  );
};

export const useVibration = () => {
  const context = useContext(VibrationContext);
  if (!context) {
    throw new Error('useVibration must be used within a VibrationProvider');
  }
  return context;
};