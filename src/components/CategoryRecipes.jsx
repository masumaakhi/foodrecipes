import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const cache = {}; // Cache object to store fetched recipes by category

const CategoryRecipes = () => {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
      if (cache[categoryName]) {
        // If data exists in cache, use it and skip fetch
        setRecipes(cache[categoryName]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const recipesRef = collection(db, 'recipes');
        const categoryQuery = query(recipesRef, where('category', '==', categoryName));
        const querySnapshot = await getDocs(categoryQuery);

        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Save the fetched data to cache
        cache[categoryName] = recipesData;
        setRecipes(recipesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category recipes:', error);
        setLoading(false);
      }
    };

    fetchCategoryRecipes();
  }, [categoryName]);

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  return (
    <div className="category-recipes">
      <h2>Recipes in "{categoryName}"</h2>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRecipes;
