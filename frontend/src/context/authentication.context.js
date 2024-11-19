import { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie } from "../utils/cookies.util"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if(getCookie("user_id") && getCookie("username")) return true
    return false
  });
  const [userId, setUserId] = useState(() => getCookie("user_id"))
  const [username, setUsername] = useState(getCookie("username"))

  const login = (userId, username) => {
    setUsername(username)
    setUserId(userId)
    setCookie('user_id', userId, 3)
    setCookie('username', username, 3)
    setIsAuthenticated(true)
  };
  const logout = () => {
    setUsername(null)
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
