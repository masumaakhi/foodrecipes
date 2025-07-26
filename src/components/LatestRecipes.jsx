import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const LatestRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
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

  const renderStars = (rating) => (
    <div className="flex gap-1 text-yellow-400 mb-2">
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="max-w-[86rem] mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Latest Recipes</h2>
        <Link to="/recipes" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300">
                  See More →
                </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <Link to={`/recipe/${recipe.id}`} className="block">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                {renderStars(recipe.rating || 0)}
                <h3 className="text-xl font-semibold text-gray-800">{recipe.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestRecipes;
