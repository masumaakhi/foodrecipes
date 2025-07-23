import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firebase Firestore instance
import { Link } from 'react-router-dom';

const TrendingRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Query to fetch top-rated recipes, sorted by rating in descending order
    const q = query(
      collection(db, 'recipes'),
      orderBy('rating', 'desc'), // Sort by the 'rating' field
      limit(4) // Limit to top 4 recipes
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRecipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(newRecipes);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
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
    <div className="trending-recipes">
      <h2>Trending Recipes</h2>
      <Link to="/recipes">
        <button className='btnrecipes'>See More</button>
      </Link>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <Link to={`/recipe/${recipe.id}`}>
              <img src={recipe.imageUrl} alt={recipe.title} />
              {renderStars(recipe.rating || 0)} {/* Display star rating */}
              <h3>{recipe.title}</h3>
              {/* <p>{recipe.description}</p> */}  
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRecipes;
