import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

const ReComment = ({ recipeId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState([]);

  // Fetch comments from Firestore for the specific recipe
  useEffect(() => {
    if (!recipeId) return;

    const q = query(
      collection(db, 'comments'),
      where('recipeId', '==', recipeId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ ...doc.data(), id: doc.id });
      });
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [recipeId]);

  return (
    <div className="mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h2>

      {/* Display existing comments */}
      <CommentsList comments={comments} />

      {/* Button to open the comment form */}
      {!showCommentForm && (
        <button
          onClick={() => setShowCommentForm(true)}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
        >
          Post a Comment
        </button>
      )}

      {/* Show CommentForm when open */}
      {showCommentForm && (
        <div className="mt-4">
          <CommentForm
            recipeId={recipeId}
            onCancel={() => setShowCommentForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ReComment;
