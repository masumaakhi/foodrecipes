import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import MyAccount from "./MyAccount"; // Your MyAccount dropdown component

const User = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="header">
      {user ? (
        // Show "My Account" dropdown if user is authenticated
        <MyAccount />
      ) : (
        // Show "Sign In" and "Sign Up" if no user is authenticated
        <div className="auth-buttons">
          <a href="/signin" className="auth-button"><Link to="/signin">Log In</Link></a>
          <a href="/signup" className="auth-button"><Link to= "/signup">Sign Up</Link></a>
        </div>
      )}
    </div>
  );
};

export default User;
