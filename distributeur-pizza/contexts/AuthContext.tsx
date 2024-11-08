// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "guest" | "admin" | "user";

interface AuthContextType {
  role: UserRole;
  userId: string; 
  login: (role: UserRole, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("guest");
  const [userId, setUserId] = useState<string>("guest"); 

  useEffect(() => {
    const loadUser = async () => {
      const storedRole = await AsyncStorage.getItem("userRole");
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedRole) setRole(storedRole as UserRole);
      if (storedUserId) setUserId(storedUserId);
    };
    loadUser();
  }, []);

  const login = async (role: UserRole, userId: string) => {
    setRole(role);
    setUserId(userId);
    await AsyncStorage.setItem("userRole", role);
    await AsyncStorage.setItem("userId", userId);
  };

  const logout = async () => {
    setRole("guest");
    setUserId("guest");
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
