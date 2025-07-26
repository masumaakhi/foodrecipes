import React, { useState } from "react";
import SignOutButton from "./SignOut";
import { Link } from "react-router-dom";

const MyAccount = ({ clearProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const listStyle = "block no-underline px-4 py-2 hover:bg-gray-100 cursor-pointer hover:max-w-full";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className="bg-orange-500 hover:bg-orange-400 text-white font-medium py-2 px-4 rounded-lg shadow focus:outline-none"
      >
        My Account
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-2 text-gray-700">
            <li>
              <Link to="/userprofile" className={listStyle}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/orders" className={listStyle}>
                Orders
              </Link>
            </li>
            <li>
              <Link to="/addresses" className={listStyle}>
                Addresses
              </Link>
            </li>
            <li>
              <Link to="/account-details" className={listStyle}>
                Account Details
              </Link>
            </li>
            <li>
              <Link to="/coupons" className={listStyle}>
                My Coupons
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className={listStyle}>
                Wishlist
              </Link>
            </li>
            <li className="border-t border-gray-200 mt-2">
              <div className="px-4 py-1">
                <SignOutButton clearProfile={clearProfile} />
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
