import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000);
 

  // Функции для управления балансом
  const addBalance = (amount) => {
    setBalance((prev) => prev + amount);
  };

  const subtractBalance = (amount) => {
    setBalance((prev) => (prev >= amount ? prev - amount : prev));
  };


  

  // Загрузка данных из AsyncStorage при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) setBalance(parseInt(storedBalance));
      } catch (e) {
        console.log('Failed to load data');
      }
    };

    loadData();
  }, []);

 
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('balance', balance.toString());
        
      } catch (e) {
        console.log('Failed to save data');
      }
    };

    saveData();
  },[balance]);

  return (
    <UserContext.Provider
      value={{
        balance,
        
        addBalance,
        subtractBalance,
       
      }}
    >
      {children}
    </UserContext.Provider>
  );
};