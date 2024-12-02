import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext(undefined);

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.error("useUser must be used within a UserProvider");
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

