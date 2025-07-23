import React, { useState } from "react";
import "./MyAccount.css"; // Import CSS for styling
import SignOutButton from "./SignOut";

const MyAccount = ({ clearProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen); // Toggle the dropdown menu
  };

  return (
    <div className="dropdown">
      <button type="button" className="dropdown-toggle" onClick={handleToggle}>
        My Account
      </button>

      {/* Conditionally apply 'show' class to make dropdown visible */}
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <ul>
          <li><a href="/userprofile">Dashboard</a></li>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/addresses">Addresses</a></li>
          <li><a href="/account-details">Account details</a></li>
          <li><a href="/coupons">My Coupons</a></li>
          <li><a href="/wishlist">Wishlist</a></li>
          <li>
            {/* Trigger sign out when this button is clicked */}
            <SignOutButton clearProfile={clearProfile} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MyAccount;
