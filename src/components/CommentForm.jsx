import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const CommentForm = ({ recipeId, onCancel }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() === '') return;

    await addDoc(collection(db, 'comments'), {
      recipeId,
      text: comment,
      createdAt: new Date(),
      likes: 0,
      replies: [],
      userName: 'User Name',
      userImage: 'user-image-url',
    });

    setComment('');
    onCancel();
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        ></textarea>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Post Comment
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
