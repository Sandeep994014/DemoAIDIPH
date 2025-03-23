import React, { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode'; 
import { getEmployeeData } from "../services/auth"; 


const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [userPoints, setUserPoints] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);

     
      const decodedToken = jwt_decode(token); 
      const extractedUserId = decodedToken.userId;
      const extractedRole = decodedToken.role;
      const extractedPermissions = decodedToken.permissions;
      const extractedUserPoints = decodedToken.userPoints;

      setUserId(extractedUserId);
      setRole(extractedRole);
      setPermissions(extractedPermissions);
      

     
      fetchUserPointsFromAPI(extractedUserId, token);
    }
  }, []);

  // Fetch points from the API
  const fetchUserPointsFromAPI = async (userId, authToken) => {
    try {
      const points = await getEmployeeData(userId, authToken);
      setUserPoints(points);  
    } catch (error) {
      console.error("Failed to fetch user points:", error);
      setUserPoints(0);  
    }
  };

  const login = token => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);


    const decodedToken = jwt_decode(token);  
    const extractedUserId = decodedToken.userId;
    const extractedRole = decodedToken.role;
    const extractedPermissions = decodedToken.permissions;

    setUserId(extractedUserId);
    setRole(extractedRole);
    setPermissions(extractedPermissions);

    // Fetch the user points after login
    fetchUserPointsFromAPI(extractedUserId, token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserId(null); 
    setRole(null); 
    setPermissions([]); 
    setUserPoints(null); 
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        userId,
        role,
        permissions,
        userPoints,  
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider as default };
