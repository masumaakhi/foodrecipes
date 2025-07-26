import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { Link } from 'react-router-dom';

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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">🎬 Video List</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <Link 
            key={video.id}
            to={`/video/${video.id}`} 
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden group"
          >
            {/* Thumbnail if exists */}
            {video.thumbnailUrl ? (
              <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-lg">
                No Thumbnail
              </div>
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {video.description || "No description available."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
