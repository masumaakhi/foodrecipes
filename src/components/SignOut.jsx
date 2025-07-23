import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignOutButton = ({ clearProfile }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Optionally clear profile data
        clearProfile();
        // Redirect to home page
        navigate("/");
        alert("Signed out successfully!");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <button onClick={handleSignOut} style={styles.signOutButton}>
      Sign Out
    </button>
  );
};

// Add any styling as needed
const styles = {
  signOutButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default SignOutButton;
