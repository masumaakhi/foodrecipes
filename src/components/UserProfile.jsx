import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import SignOutButton from "./SignOut";

const UserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);

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
    setName(user?.displayName || "");
    setBio("");
  };

  const clearProfile = () => {
    setName("");
    setBio("");
  };

  return (
    <div className="max-w-md mx-auto mt-24 mb-3  bg-white shadow-lg rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-orange-400"
        />
      </div>

      {/* User Info */}
      <div className="text-left space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Name:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
            />
          ) : (
            <p className="text-gray-800">{name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Email:</label>
          <p className="text-gray-800">{email}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Bio:</label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-md resize-none h-24 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          ) : (
            <p className="text-gray-800">{bio || "No bio available"}</p>
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-6">
        <SignOutButton clearProfile={clearProfile} />
      </div>

      {/* Buttons */}
      <div className="mt-6 space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveClick}
              className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="bg-green-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
