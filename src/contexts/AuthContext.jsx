import { createContext, useContext, useState, useEffect } from "react";
import { login, register, logout, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loginUser = async (email, password) => {
    const user = await login(email, password);
    setCurrentUser(user);
    return user;
  };

  // register no longer takes a role
  const registerUser = async (email, password) => {
    const user = await register(email, password);
    setCurrentUser(user);
    return user;
  };

  const logoutUser = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login: loginUser,
      register: registerUser,
      logout: logoutUser,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
