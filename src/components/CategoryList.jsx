import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase";

const CategoryList = () => {
  const [categoriesWithTopRecipes, setCategoriesWithTopRecipes] = useState([]);

  useEffect(() => {
    const fetchTopRecipesByCategory = async () => {
      try {
        const recipeSnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = recipeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoryMap = {};
        recipesData.forEach((recipe) => {
          const { category, likes } = recipe;
          if (!categoryMap[category] || recipe.likes > categoryMap[category].likes) {
            categoryMap[category] = recipe;
          }
        });

        setCategoriesWithTopRecipes(Object.values(categoryMap).slice(0, 6));
      } catch (error) {
        console.error("Error fetching top liked recipes by category:", error);
      }
    };

    fetchTopRecipesByCategory();
  }, []);

  return (
    <div className="max-w-[86rem] mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Popular Categories</h2>
        <Link
          to="/allcategory"
          className="text-[#681f28] no-underline text-lg  hover:text-red-800 transition"
        >
          View more →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categoriesWithTopRecipes.map((recipe) => (
          <div key={recipe.id} className="text-center">
            <Link to={`/category/${recipe.category}`} className="no-underline">
              <img
                src={recipe.imageUrl}
                alt={recipe.category}
                className="sm:w-[8rem] sm:h-[8rem] w-[10rem] h-[10rem] object-cover rounded-full mx-auto transition-transform duration-500 hover:scale-105 shadow-md"
              />
              <p className="mt-4 text-xl font-medium text-gray-700 hover:text-[#681f28] transition cursor-pointer">
                {recipe.category}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
