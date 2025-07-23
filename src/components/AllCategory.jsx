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
          if (data.category) {
            // Only add the category if it has an image and isn't already in the map
            if (!categoryMap.has(data.category) && data.imageUrl) {
              categoryMap.set(data.category, data.imageUrl);
            }
          }
        });

        // Convert the map to an array of objects for rendering
        setCategories(Array.from(categoryMap, ([name, imageUrl]) => ({ name, imageUrl })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="all-categories">
      <h2>All Categories</h2>
      <div className="category-list">
        {categories.map((category) => (
          <Link to={`/category/${category.name}`} key={category.name} className="category-link">
            <div className="category-item">
              <img src={category.imageUrl} alt={category.name} className="category-image" />
              <p>{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllCategories;
