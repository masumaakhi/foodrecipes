import React, { useEffect, useState } from 'react';
import { collection, query, where, addDoc, getDocs, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { useParams } from 'react-router-dom'; // For getting the videoId from URL
import { db } from '../firebase';

const VideoDetails = () => {
  const { videoId } = useParams();  // Get the videoId from the URL
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      const videoRef = collection(db, 'videos');
      const videoSnapshot = await getDocs(query(videoRef, where('id', '==', videoId)));
      setVideo(videoSnapshot.docs[0].data());  // Assuming videoId is unique
    };
    fetchVideo();
  }, [videoId]);

  // Fetch comments for this video in real-time
  useEffect(() => {
    const q = query(collection(db, 'comments'), where('videoId', '==', videoId), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsArray);
    });
    return () => unsubscribe();
  }, [videoId]);

  // Function to post a new comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "comments"), {
        videoId: videoId,
        commentText,
        username: "Anonymous", // Replace this with actual user if authentication is added
        timestamp: serverTimestamp(),
        upvotes: 0
      });
      setCommentText('');  // Clear the input after posting
    } catch (err) {
      console.error("Error adding comment: ", err);
    }
  };

  return (
    <div>
      {video && (
        <div>
          <h2>{video.title}</h2>
          <p>{video.description}</p>
        </div>
      )}

      <div>
        <h3>Comments</h3>
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <p>{comment.username}: {comment.commentText}</p>
              <span>Upvotes: {comment.upvotes}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handlePostComment}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

export default VideoDetails;
