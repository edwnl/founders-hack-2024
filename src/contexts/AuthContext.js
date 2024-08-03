import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/config'; // Adjust this import based on your Firebase setup

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Determine user mode (you might fetch this from a database)
        setUserMode('user'); // or 'organizer' based on your logic
      } else {
        setUser(null);
        setUserMode(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}