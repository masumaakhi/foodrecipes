import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Firebase imports
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
// import './LatestRecipes.css'; // Optional CSS for styling

const LatestRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        // Query to get the latest 5 recipes
        const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching latest recipes:', error);
      }
    };

    fetchLatestRecipes();
  }, []);

   // Function to render stars based on rating
   const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < rating ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="latest-recipes-container">
      <h2>Latest Recipes</h2>
      <Link to="/recipes" className="see-more-button">
        See More
      </Link>
      <div className="latest-recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="latest-recipe-card">
            <Link to={`/recipe/${recipe.id}`}>
              <img src={recipe.imageUrl} alt={recipe.title} className="latest-recipe-image" />
              {renderStars(recipe.rating || 0)} {/* Display star rating */}
              <h3>{recipe.title}</h3>
            </Link>
            {/* <div className="latest-recipe-info">
              <p>{recipe.description.substring(0, 20)}...</p>
            </div> */}
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default LatestRecipes;
