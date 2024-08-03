"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMode, setUserMode] = useState("user"); // Default to "user"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // If user is logged in, get the mode from localStorage
        const storedMode = localStorage.getItem("userType");
        setUserMode(storedMode || "user");
      } else {
        // If user is logged out, reset to default
        setUserMode("user");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to update user mode
  const updateUserMode = (newMode) => {
    console.log("Updating user mode to:", newMode);
    setUserMode(newMode);
    localStorage.setItem("userType", newMode);
  };

  const value = {
    user,
    loading,
    userMode,
    updateUserMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
