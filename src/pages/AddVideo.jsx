import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';  // To redirect the user

const AddVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();  // For navigation after submission

  // Function to handle form submission
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'videos'), {
        title,
        description,
        videoUrl,
        createdAt: serverTimestamp()
      });
      setTitle('');
      setDescription('');
      setVideoUrl('');

      // Redirect to the video list page after adding the video
      navigate('/');
    } catch (err) {
      console.error('Error adding video: ', err);
    }
  };

  return (
    <div>
      <h2>Add New Video</h2>
      <form onSubmit={handleAddVideo}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            required
          />
        </div>
        <div>
          <label>Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            required
          />
        </div>
        <button type="submit">Add Video</button>
      </form>
    </div>
  );
};

export default AddVideo;
