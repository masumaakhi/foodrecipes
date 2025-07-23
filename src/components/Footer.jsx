import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-grid-card">
        <div className="footer-recipes">
          <div className="recipedetails">
            <h2>Share Your Recipes</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis,
              eum. Quia dignissimos, nihil vel consequuntur reprehenderit quo,
              maxime architecto quod, cumque laboriosam necessitatibus tempore!
            </p>
            <button>
              <Link to="/addrecipes">Add Recipe</Link>
            </button>
          </div>
        </div>
        <div className="footer-list">
        <div className="footer-grid-item">
          <h3>Flavors & Feasts</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Affiliate Program</a></li>
          </ul>
        </div>
        <div className="footer-grid-item">
          <h3>Get Help</h3>
          <ul>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        <div className="footer-grid-item">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
        </div>
      </div>
      <hr></hr>
      <p>@2024 FoodBlogs. All rights reserved.</p>
    </div>
  );
};

export default Footer;
