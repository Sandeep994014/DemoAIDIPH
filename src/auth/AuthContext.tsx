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
      setUserPoints(extractedUserPoints);
      fetchUserPointsFromAPI(extractedUserId, token);
    } else {
      setIsAuthenticated(false); 
      setLoading(false); 
    }
  }, []);
  const fetchUserPointsFromAPI = async (userId, authToken) => {
    try {
      const points = await getEmployeeData(userId, authToken);
      setUserPoints(points);  
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Failed to fetch user points:", error);
      setUserPoints(0);  
    } finally {
      setLoading(false);  
    }
  };
  const login = (token) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);
    alert("Login successful")
    const decodedToken = jwt_decode(token);
    const extractedUserId = decodedToken.userId;
    const extractedRole = decodedToken.role;
    const extractedPermissions = decodedToken.permissions;
    setUserId(extractedUserId);
    setRole(extractedRole);
    setPermissions(extractedPermissions);
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
    alert("Logout successful")
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