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
  const [loading, setLoading] = useState(true);  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      initializeAuthState(token);
    } else {
      setLoading(false); 
    }
  }, []);
  const initializeAuthState = (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    const decodedToken = jwt_decode(token);
    const extractedUserId = decodedToken.userId; 
    const extractedRole = decodedToken.role; 
    const extractedPermissions = decodedToken.permissions; 
    setUserId(extractedUserId);
    setRole(extractedRole);
    setPermissions(extractedPermissions);
    fetchUserPointsFromAPI(extractedUserId, token); 
  };
  const fetchUserPointsFromAPI = async (userId, token) => {
    try {
      const points = await getEmployeeData(userId, token);
      setUserPoints(points);  
    } catch (error) {
      console.error("Failed to fetch user points:", error);
      setUserPoints(0);  
    } finally {
      setLoading(false);  
    }
  };
  const login = (token) => {
    localStorage.setItem("authToken", token);
    initializeAuthState(token);
    alert("Login successful");
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
    setPermissions([]);
    setUserPoints(null);
    alert("Logout successful");
  };
  return (
    <>
      {loading ? (
        <div>Loading...</div> 
      ) : (
        <AuthContext.Provider
          value={{
            isAuthenticated,
            authToken,
            userId,
            role,
            permissions,
            userPoints,
            login,
            logout,
            loading,  
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
}
export { AuthProvider as default };