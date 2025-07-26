import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const cache = {};

const CategoryRecipes = () => {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
      if (cache[categoryName]) {
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

  if (loading) return <p className="text-center py-10 text-gray-500 text-lg">Loading recipes...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-12 mb-3">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🍳 Recipes in <span className="text-green-600">"{categoryName}"</span>
      </h2>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">No recipes found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryRecipes;
