import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";

const HeaderView = () => {
  const [recipe, setRecipe] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);

  // ✅ Fetch Most Rated Recipe
  useEffect(() => {
    const fetchMostRatedRecipe = async () => {
      try {
        const q = query(collection(db, "recipes"), orderBy("rating", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const mainRecipe = { id: doc.id, ...doc.data() };
          setRecipe(mainRecipe);

          // ✅ Fetch Related Recipes by Category
          fetchRelatedRecipes(mainRecipe.category, mainRecipe.id);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchRelatedRecipes = async (category, excludeId) => {
      try {
        const relatedQ = query(
          collection(db, "recipes"),
          where("category", "==", category),
          orderBy("rating", "desc"),
          limit(6) // 6 আনছি, যাতে 1টা exclude করলে 5 টা থাকে
        );
        const relatedSnapshot = await getDocs(relatedQ);
        const related = relatedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.id !== excludeId)
          .slice(0, 5); // Ensure only 5 related items

        setRelatedDishes(related);
      } catch (error) {
        console.error("Error fetching related dishes:", error);
      }
    };

    fetchMostRatedRecipe();
  }, []);

  if (!recipe) return <div className="text-center py-10 text-lg font-semibold">Loading recipe...</div>;

  return (
    <div className="mt-[4rem] font-sans px-6 py-10">
      {/* Main Section */}
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Left Image */}
        <div className="flex justify-center">
          <div className="relative w-[300px] h-[300px] rounded-full transform -translate-y-5">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="rounded-full w-full h-full object-cover ring-2 ring-white z-10 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)]"
            />
            <div className="absolute inset-0 rounded-full bg-black opacity-25 blur-3xl z-0"></div>
          </div>
        </div>

        {/* Center Text */}
        <div className="text-center md:text-left">
          <p className="text-gray-400 text-sm">#1 Most loved dish</p>
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            {recipe.title?.split(" ")[0]} <br />
            <span className="text-6xl font-extrabold">
              {recipe.title?.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
              ▶ Play video
            </button>
            <button className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300">
              🍽️ Order food
            </button>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold">Overview</span>
            <span className="text-sm text-gray-400">Ingredients</span>
          </div>
          <div className="text-3xl font-bold text-orange-500">
            {recipe.rating || "4.9"} ⭐
          </div>
          <p className="font-semibold text-gray-800 mt-2">{recipe.title}</p>
          <p className="text-sm text-gray-500 mt-2">
            {recipe.description?.substring(0, 100) || "No description provided."}
          </p>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>👍 {recipe.likes || 0} likes</span>
            <span>💬 {recipe.reviews || 0} reviews</span>
          </div>
        </div>
      </div>

      {/* ✅ Related Dishes Slider */}
      <h2 className="text-xl font-bold mt-10 mb-4">You may also like</h2>
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
        {relatedDishes.length > 0 ? (
          relatedDishes.map(dish => (
            <div
              key={dish.id}
              className="min-w-[140px] flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={dish.imageUrl}
                alt={dish.title}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
              <p className="text-sm mt-2 text-center font-semibold">{dish.title}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No related dishes found.</p>
        )}
      </div>
    </div>
  );
};

export default HeaderView;
