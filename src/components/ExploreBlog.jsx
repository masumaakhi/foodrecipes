import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Firebase configuration
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
// import './ExploreBlog.css'; // Optional CSS file for styling

const ExploreBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchMostVisitedBlogs = async () => {
      try {
        // Query to get the top 3 most visited blogs
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
    <div className="explore-blog-container">
      <h2>Most Visited Blogs</h2>
      <Link to="/blog" className="see-more-btn">
        See More
      </Link>
      <div className="explore-blog-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="explore-blog-card">
            <Link to={`/blog/${blog.id}`}>
              <img src={blog.imageUrl} alt={blog.title} className="explore-blog-image" />
              <h3>{blog.title}</h3>
            </Link>
            {/* Short preview of content */}
            <div className="explore-blog-info">
              <p>{blog.content.substring(0, 50)}...</p> 
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ExploreBlog;
