import React, { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';  // Correct import of jwt_decode

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

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);

      // Decode the token and extract necessary fields
      const decodedToken = jwt_decode(token);  // Decode the token
      const extractedUserId = decodedToken.userId;
      const extractedRole = decodedToken.role;
      const extractedPermissions = decodedToken.permissions;

      setUserId(extractedUserId);
      setRole(extractedRole);
      setPermissions(extractedPermissions);
    }
  }, []);

  const login = token => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);

    // Decode the token and extract necessary fields on login
    const decodedToken = jwt_decode(token);  // Decode the token
    const extractedUserId = decodedToken.userId;
    const extractedRole = decodedToken.role;
    const extractedPermissions = decodedToken.permissions;

    setUserId(extractedUserId);
    setRole(extractedRole);
    setPermissions(extractedPermissions);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserId(null);  // Clear userId on logout
    setRole(null);  // Clear role on logout
    setPermissions([]);  // Clear permissions on logout
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        userId,
        role,
        permissions,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider as default };
