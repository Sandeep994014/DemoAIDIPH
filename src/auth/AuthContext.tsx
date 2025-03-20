import React, { useEffect, useState } from 'react'

const AuthContext = React.createContext();

export const useAuth = () => {
  return React.useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const empId = localStorage.getItem('employeeId')
    if (token) {
      setAuthToken(token)
      setEmployeeId(empId)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (token, empId) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('employeeId', empId)
    setAuthToken(token)
    setEmployeeId(empId)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('employeeId')
    setAuthToken(null)
    setEmployeeId(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, employeeId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
};

export { AuthProvider as default };
