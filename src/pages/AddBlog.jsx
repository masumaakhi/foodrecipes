// AddBlog.js
import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Firebase imports
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // For image file

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let uploadImageUrl = '';

    if (image) {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `blog-images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress here if needed
        },
        (error) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        },
        async () => {
          // Get the download URL of the uploaded image
          uploadImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await saveBlog(uploadImageUrl);
        }
      );
    } else {
      // If no image, save the blog without an image URL
      await saveBlog('');
    }
  };

  const saveBlog = async (imageUrl) => {
    try {
      // Prepare blog data for Firestore
      const newBlog = {
        title,
        author,
        content,
        imageUrl, // Save the image URL here
      };

      // Add the new blog to Firestore
      await addDoc(collection(db, 'blogs'), newBlog);

      // Reset form fields after successful submission
      setTitle('');
      setAuthor('');
      setContent('');
      setImage(null); // Clear image input
      document.querySelector('input[type="file"]').value = ''; // Clear file input
      
      // Show success alert
      alert('Blog added successfully!');
    } catch (error) {
      console.error('Error adding blog: ', error);
      alert('Failed to add the blog');
    }
  };

  return (
    <div className="blog-form-container mt-[7rem]">
      <h2>Add a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blog Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required // Make this field required
          />
        </div>

        <div className="form-group">
          <label>Author Name:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required // Make this field required
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here"
            maxLength="5000"
            required // Make this field required
          />
        </div>

        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button type="submit">Submit Blog</button>
      </form>
    </div>
  );
};

export default AddBlog;
