import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo513.svg";
import User from "./User";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const baseStyle =
    "relative text-gray-700 text-decoration-none text-md font-medium font-bold px-3 py-2 transition duration-300 hover:text-orange-500";
  const activeStyle = "text-orange-600 font-semibold";

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-14 h-14" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${baseStyle} ${activeStyle}` : baseStyle
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                isActive ? `${baseStyle} ${activeStyle}` : baseStyle
              }
            >
              Recipes
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? `${baseStyle} ${activeStyle}` : baseStyle
              }
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                isActive ? `${baseStyle} ${activeStyle}` : baseStyle
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/admin/addblog"
              className={({ isActive }) =>
                isActive ? `${baseStyle} ${activeStyle}` : baseStyle
              }
            >
              Add Blog
            </NavLink>

            {/* User or Auth Links */}
            <div className="ml-4 text-decoration-none">
              <User />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 text-2xl focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md px-4 py-3 space-y-3 shadow-md">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-orange-500"
          >
            Home
          </NavLink>
          <NavLink
            to="/recipes"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-orange-500"
          >
            Recipes
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-orange-500"
          >
            About
          </NavLink>
          <NavLink
            to="/blog"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-orange-500"
          >
            Blog
          </NavLink>
          <NavLink
            to="/admin/addblog"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-orange-500"
          >
            Add Blog
          </NavLink>
          <User />
        </div>
      )}
    </nav>
  );
};

export default Nav;
