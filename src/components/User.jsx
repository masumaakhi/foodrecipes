import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import MyAccount from "./MyAccount";

const User = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      {user ? (
        <MyAccount />
      ) : (
        <div className="flex items-center space-x-4">
          <Link
            to="/signin"
            className="text-gray-700 hover:text-orange-500 font-medium transition duration-300 text-decoration-none"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-gray-700 hover:text-orange-500 font-medium transition duration-300 text-decoration-none"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default User;
