import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import SignOutButton from "./SignOut";

const UserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(""); // Assume there's no default bio initially
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const clearProfile = () => {
    setName("");
    setEmail("");
    setBio("");
  };


  const handleSaveClick = () => {
    updateProfile(user, { displayName: name })
      .then(() => {
        alert("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(user?.displayName || ""); // Reset to original name
    setBio(""); // Reset bio if necessary
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Profile</h2>

      {/* Profile Picture */}
      <div style={styles.profileImageContainer}>
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          style={styles.profileImage}
        />
      </div>

      {/* User Info */}
      <div style={styles.info}>
        <label style={styles.label}>Name:</label>
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        ) : (
          <p>{name}</p>
        )}

        <label style={styles.label}>Email:</label>
        <p>{email}</p>

        <label style={styles.label}>Bio:</label>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={styles.textarea}
          />
        ) : (
          <p>{bio || "No bio available"}</p>
        )}
      </div>
      <div><SignOutButton clearProfile={clearProfile} /></div>

      {/* Buttons for edit/save/cancel */}
      {isEditing ? (
        <div style={styles.buttonGroup}>
          <button onClick={handleSaveClick} style={styles.saveButton}>
            Save
          </button>
          <button onClick={handleCancelClick} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleEditClick} style={styles.editButton}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  profileImageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  info: {
    textAlign: "left",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    height: "80px",
  },
  buttonGroup: {
    marginTop: "20px",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default UserProfile;
