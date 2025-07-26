import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const categoryMap = new Map();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category && data.imageUrl && !categoryMap.has(data.category)) {
            categoryMap.set(data.category, data.imageUrl);
          }
        });

        setCategories(Array.from(categoryMap, ([name, imageUrl]) => ({ name, imageUrl })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🍽️ All Categories</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            to={`/category/${category.name}`} 
            key={category.name} 
            className="block bg-white rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <div className="overflow-hidden rounded-t-xl">
              <img 
                src={category.imageUrl} 
                alt={category.name} 
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-700 capitalize">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
