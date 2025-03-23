import React, { createContext, useState, useEffect } from 'react';
import { getEmployeeData } from '../services/auth';  
import jwt_decode from 'jwt-decode';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {  // Ensure the correct export here
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) 
        return null;
    try {
      const decodedToken = jwt_decode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const fetchEmployeeData = async () => {
    if (!userId) {
      setError('No user ID found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getEmployeeData(userId);  
      setEmployeeData(data.points);  
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch employee data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEmployeeData();
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ employeeData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
