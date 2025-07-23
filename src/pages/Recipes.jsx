import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const RecipeGrid = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch Recipes
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchRecipes();
    fetchCategories();
  }, []);

  // Function to handle the like button
  const handleLike = async (recipeId, currentLikes) => {
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        likes: currentLikes + 1,
      });
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, likes: recipe.likes + 1 }
            : recipe
        )
      );
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  // Function to handle the rating
  const handleRating = async (recipeId, newRating) => {
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        rating: newRating,
      });
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, rating: newRating }
            : recipe
        )
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  // Filter recipes based on selected category
  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.category === selectedCategory)
    : recipes;

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid-recipes">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card-recipes">
            <Link to={`/recipe/${recipe.id}`}>
              <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image-recipes" />
              
            </Link>
            <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={index < (recipe.rating || 0) ? 'star filled' : 'star'}
                    onClick={() => handleRating(recipe.id, index + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <h3>{recipe.title}</h3>
            <div className="recipe-info-recipes">
              <p>By {recipe.authorName}</p>
              <p>{recipe.description.substring(0, 120)}....</p>
              {/* <p>👍 {recipe.likes || 0} likes</p>
              <button onClick={() => handleLike(recipe.id, recipe.likes || 0)}>Like</button> */}
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && <p>No recipes available in this category.</p>}
      </div>
    </div>
  );
};

export default RecipeGrid;
