import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function (for admin/staff)
  const login = (roleOrUser) => {
    if (roleOrUser === "admin") {
      setUser({ role: "admin" });
    } else {
      setUser(roleOrUser);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
