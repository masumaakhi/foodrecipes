import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure you have the Firestore setup correctly
import RecipeDetails from './RecipeDetails';

const RecipeCon = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const recipeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipeData);
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeDetails
            key={recipe.id}
            title={recipe.title}
            description={recipe.description}
            imageUrl={recipe.imageUrl}
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            nutrition={recipe.nutrition}
          />
        ))
      ) : (
        <p>Loading recipes...</p>
      )}
    </div>
  );
};

export default RecipeCon;
