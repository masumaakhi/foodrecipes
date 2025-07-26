import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadImageUrl = '';

    if (image) {
      const storageRef = ref(storage, `blog-images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        },
        async () => {
          uploadImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await saveBlog(uploadImageUrl);
        }
      );
    } else {
      await saveBlog('');
    }
  };

  const saveBlog = async (imageUrl) => {
    try {
      const newBlog = {
        title,
        author,
        content,
        imageUrl,
      };

      await addDoc(collection(db, 'blogs'), newBlog);

      setTitle('');
      setAuthor('');
      setContent('');
      setImage(null);
      document.querySelector('input[type="file"]').value = '';

      alert('Blog added successfully!');
    } catch (error) {
      console.error('Error adding blog: ', error);
      alert('Failed to add the blog');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 mb-3 p-6 bg-orange-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Blog Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Author Name:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            maxLength="5000"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none h-40 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-orange-500 file:text-white
                       hover:file:bg-orange-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
