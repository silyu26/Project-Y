import { createContext, useContext, useState } from 'react';

const HealthDataContext = createContext();

export const HealthDataProvider = ({ children }) => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateHealthData = (newData) => {
    setHealthData(newData);
    setLoading(false);
  };

  return (
    <HealthDataContext.Provider value={{ healthData, loading, updateHealthData, setLoading }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  return useContext(HealthDataContext);
};