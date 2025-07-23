//context/AuthContext.js

import React, { useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, updateEmail as updateFirebaseEmail, updatePassword as updateFirebasePassword } from "firebase/auth";
import  auth  from "../firebase"; // Firebase configuration

// Create the AuthContext
const AuthContext = React.createContext();

// Export the useAuth hook to use the context easily
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // Signup function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Reset password function
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update email function
  function updateEmail(email) {
    return updateFirebaseEmail(currentUser, email);
  }

  // Update password function
  function updatePassword(password) {
    return updateFirebasePassword(currentUser, password);
  }

  // Effect to listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Values provided by the context
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  // Only render children if not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
