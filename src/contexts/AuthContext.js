"use client"; // Ensure this file is a client component

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config'; // Ensure this path matches your project structure

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Example logic for setting userMode
        // Make sure to handle cases where fetchUserData might return undefined
        try {
          const userData = await fetchUserData(authUser.uid);
          setUserMode(userData?.mode || null); // Use optional chaining and default value
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserMode(null); // Default to null if there's an error
        }
        setLoading(false);
      } else {
        setUser(null);
        setUserMode(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    user,
    userMode,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
