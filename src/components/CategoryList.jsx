// CategoryList.js
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

        // Group by category and select the most liked recipe in each
        const categoryMap = {};
        recipesData.forEach((recipe) => {
          const { category, likes } = recipe;
          if (!categoryMap[category] || recipe.likes > categoryMap[category].likes) {
            categoryMap[category] = recipe;
          }
        });

        // Set the top liked recipe for each category and limit to 6
        setCategoriesWithTopRecipes(Object.values(categoryMap).slice(0, 6));
      } catch (error) {
        console.error("Error fetching top liked recipes by category:", error);
      }
    };

    fetchTopRecipesByCategory();
  }, []);

  return (
    <div className="category-list">
      <h2>Popular Categories</h2>
      <Link to="/allcategory" className="view-more-link">View more</Link>
      <div className="categories-grid">
        {categoriesWithTopRecipes.map((recipe) => (
          <div key={recipe.id} className="category-item">
            <Link to={`/category/${recipe.category}`}>
              <img 
                src={recipe.imageUrl} 
                alt={recipe.category} 
                className="category-image" 
                // style={{ borderRadius: "50%" }} 
              />
              <p>{recipe.category}</p>
            </Link>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default CategoryList;
