import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#f1f7f9] px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Share Your Recipes Section */}
        <div className="ml-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Share Your Recipes</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4 text-center">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, eum.
            Quia dignissimos, nihil vel consequuntur reprehenderit quo, maxime
            architecto quod, cumque laboriosam necessitatibus tempore!
          </p>
          <button className="bg-orange-500 text-white no-underline ml-[12rem]  px-6 py-2 text-center rounded hover:bg-orange-600 transition">
            <Link to="/addrecipes" className="no-underline text-white">Add Recipe</Link>
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-10 justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Flavors & Feasts</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Services</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Affiliate Program</a></li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Get Help</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Follow Us</h3>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="mt-8 border-1 border-gray-500" />
      <p className="text-center text-black text-md py-2 px-4">
        @2024 FoodBlogs. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
