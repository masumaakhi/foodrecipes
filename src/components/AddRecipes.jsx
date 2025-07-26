import React from 'react';
import recipespic from '../assets/product/f8.jpg';
import { Link } from 'react-router-dom';

const AddRecipes = () => {
  return (
    <div className="max-w-[86rem] mx-auto grid grid-cols-1 md:grid-cols-2 items-center mt-24 px-8 md:px-20 gap-10">
      <div className="flex justify-center">
        <img
          src={recipespic}
          alt="Share your recipe"
          className="w-[500px] h-[500px] rounded-xl object-cover shadow-lg"
        />
      </div>

      <div className="text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
          Share Your Recipes
        </h2>
        <p className="text-lg text-gray-600 px-4 mb-2 md:px-0">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, eum. Quia dignissimos, nihil vel consequuntur reprehenderit quo, maxime architecto quod, cumque laboriosam necessitatibus tempore!
        </p>
        <Link to="/addrecipes">
          <button className="bg-[#681f28] hover:bg-[#811e26] text-white text-lg px-6 py-2 rounded-md transition duration-300 shadow-md">
            Add Recipe
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AddRecipes;
