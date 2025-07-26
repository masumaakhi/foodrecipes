import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

const VideoDetails = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Fetch video
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoRef = collection(db, "videos");
        const q = query(videoRef, where("__name__", "==", videoId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setVideo({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          console.warn("No video found with the provided ID.");
          setVideo(null);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Fetch comments
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("videoId", "==", videoId),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });
    return () => unsubscribe();
  }, [videoId]);

  // Post comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "comments"), {
        videoId,
        commentText,
        username: "Anonymous",
        timestamp: serverTimestamp(),
        upvotes: 0,
      });
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment: ", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md mt-18 mb-3">
      {video && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {video.title}
          </h2>
          <p className="text-gray-600 mb-4">{video.description}</p>

          {/* Show video */}
          {video.videoUrl && (
            <div className="w-full aspect-video mb-4">
              <iframe
                src={video.videoUrl}
                className="w-full h-full rounded-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Comments</h3>
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              <p className="text-gray-800 font-medium">{comment.username}</p>
              <p className="text-gray-700">{comment.commentText}</p>
              <span className="text-sm text-gray-500">
                Upvotes: {comment.upvotes}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handlePostComment} className="space-y-4">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default VideoDetails;
