import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const ExploreBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchMostVisitedBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('visits', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching most visited blogs:', error);
      }
    };

    fetchMostVisitedBlogs();
  }, []);

  return (
    <div className="max-w-[86rem] mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Most Visited Blogs</h2>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium decoration-none transition duration-300">
          See More →
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <Link to={`/blog/${blog.id}`} className="block">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-52 object-cover rounded-t-xl transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{blog.content?.substring(0, 100)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreBlog;
