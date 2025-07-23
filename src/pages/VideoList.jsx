import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videoSnapshot = await getDocs(collection(db, 'videos'));
      const videoData = videoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videoData);
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Video List</h2>
      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <Link to={`/video/${video.id}`}>{video.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
