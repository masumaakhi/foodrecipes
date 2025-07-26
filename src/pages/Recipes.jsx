import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const RecipeGrid = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
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

  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.category === selectedCategory)
    : recipes;

  return (
    <div className="px-6 mt-24 mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-[#EBEEF8] border border-gray-200 rounded-lg shadow-md -translate-x-1 hover:-translate-y-2 transition-transform max-w-[600px] w-full mx-auto"
          >
            <Link to={`/recipe/${recipe.id}`}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-64  object-fill rounded-t-lg"
              />
            </Link>

            <div className="p-4">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl cursor-pointer transition-colors ${
                      index < (recipe.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    onClick={() => handleRating(recipe.id, index + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-1">{recipe.title}</h3>
              <div className="text-sm text-gray-600 ml-1">
                <p>By {recipe.authorName}</p>
                <p className="mt-1">{recipe.description.substring(0, 120)}...</p>
              </div>
              {/* Optional Like Button: Uncomment to show */}
              {/* <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleLike(recipe.id, recipe.likes || 0)}
                  className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  👍 Like
                </button>
                <span className="text-gray-700 text-sm">{recipe.likes || 0} likes</span>
              </div> */}
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">No recipes available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeGrid;
