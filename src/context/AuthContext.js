import React, { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import auth, { db } from "../firebase"; // ⬅️ import db from firebase config

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // ⬅️ holds Firestore user data including role
  const [loading, setLoading] = useState(true);

  // ✅ Signup function with Firestore user creation
  async function signup(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Add user to Firestore with default role
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "customer", // default role
    });

    return user;
  }

  // ✅ Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // ✅ Logout function
  function logout() {
    setUserData(null);
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return updateFirebaseEmail(currentUser, email);
  }

  function updatePassword(password) {
    return updateFirebasePassword(currentUser, password);
  }

  // ✅ Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data()); // save role & other data
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData, // ⬅️ access this in components to get role
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}