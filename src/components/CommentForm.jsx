// // CommentForm.js
// import React, { useState } from 'react';
// import { addDoc, collection } from 'firebase/firestore';
// import { db } from '../firebase';

// const CommentForm = ({ onCancel }) => {
//   const [comment, setComment] = useState('');
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (comment.trim() === '') return;

//     await addDoc(collection(db, 'comments'), {
//       text: comment,
//       createdAt: new Date(),
//       likes: 0,
//       replies: [],
//       userName: 'User Name', // Replace with actual user data
//       userImage: 'user-image-url', // Replace with actual user image
//     });

//     setComment('');
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Write a comment..."
//         ></textarea>
//         <button type="submit">Post Comment</button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </form>
//     </div>
//   );
// };

// export default CommentForm;


import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const CommentForm = ({ recipeId, onCancel }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.trim() === '') return;

    await addDoc(collection(db, 'comments'), {
      recipeId, // Associate the comment with the specific recipe
      text: comment,
      createdAt: new Date(),
      likes: 0,
      replies: [],
      userName: 'User Name', // Replace with actual user data
      userImage: 'user-image-url', // Replace with actual user image
    });

    setComment('');
    onCancel(); // Close the form after submitting
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        ></textarea>
        <button type="submit">Post Comment</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default CommentForm;
