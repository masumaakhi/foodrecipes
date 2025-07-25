// Blog.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore';
// import './Blog.css'; // Assume you have some CSS for the grid and card styles

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);
  

  return (
    <div className="blog-container mt-[5rem]">
      <h2>Blog List</h2>
      <div className="blog-grid mt-[4rem]">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <Link to={`/blog/${blog.id}`}>
              <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
              <h3>{blog.title}</h3>
            </Link>
            <div className="blog-info">
              <p>{blog.content.substring(0, 100)}...</p> {/* Displaying a preview of the blog details */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
