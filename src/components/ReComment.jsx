// // import React, { useState } from 'react';

// // // Individual Comment Component
// // const CommentItem = ({ comment }) => {
// //   return (
// //     <div className="comment-item">
// //       <div className="comment-header">
// //         <img src={comment.avatar} alt={comment.author} className="avatar" />
// //         <div className="comment-info">
// //           <h4>{comment.author}</h4>
// //           <span>{comment.time}</span>
// //         </div>
// //       </div>
// //       <p>{comment.text}</p>
// //       <div className="comment-actions">
// //         <span>Reply</span> | <span>Quote</span> | <span>{comment.likes} Likes</span>
// //       </div>
// //     </div>
// //   );
// // };

// // // Comment List Component
// // const CommentList = () => {
// //   const [comments, setComments] = useState([
// //     {
// //       id: 1,
// //       author: "Julianne Uwi",
// //       time: "6 mins ago",
// //       text: "Synth pabeard tilnes chilwave glossier.",
// //       avatar: "avatar1-url-here",
// //       likes: 12
// //     },
// //     {
// //       id: 2,
// //       author: "Qu Xun",
// //       time: "9 mins ago",
// //       text: "Synth pastel chilwave pizza 🍕",
// //       avatar: "avatar2-url-here",
// //       likes: 8
// //     },
// //     // Add more comment objects
// //   ]);

// //   const loadMoreComments = () => {
// //     // Functionality to load more comments
// //   };

// //   return (
// //     <div className="comment-section">
// //       <h2>Comments ({comments.length})</h2>
// //       <div className="comment-list">
// //         {comments.map((comment) => (
// //           <CommentItem key={comment.id} comment={comment} />
// //         ))}
// //       </div>
// //       <button className="load-more" onClick={loadMoreComments}>
// //         Load 25 more comments
// //       </button>
// //     </div>
// //   );
// // };

// // // Comment Form Component
// // const CommentForm = () => {
// //   return (
// //     <div className="comment-form">
// //       <textarea placeholder="Write a comment..."></textarea>
// //       <button className="post-comment">Post comment</button>
// //     </div>
// //   );
// // };

// // // Main Comments Section
// // const ReComment = () => {
// //   return (
// //     <div className="comments-container">
// //       <CommentList />
// //       <CommentForm />
// //     </div>
// //   );
// // };

// // export default ReComment;

// // App.js
// import React, { useState } from 'react';
// import CommentForm from './CommentForm';
// import CommentsList from './CommentsList';

// const ReComment = () => {
//   const [showCommentForm, setShowCommentForm] = useState(false);

//   return (
//     <div className="app">
//       <h1>Comment System</h1>
//       <button onClick={() => setShowCommentForm(true)}>Post a Comment</button>
//       {showCommentForm && (
//         <CommentForm onCancel={() => setShowCommentForm(false)} />
//       )}
//       <CommentsList />
//     </div>
//   );
// };

// export default ReComment;


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
      where('recipeId', '==', recipeId), // Filter comments by recipeId
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
    <div className="comments-section">
      <h2>Comments</h2>

      {/* Display existing comments */}
      <CommentsList comments={comments} />

      {/* Button to open the comment form */}
      <button onClick={() => setShowCommentForm(true)}>Post a Comment</button>

      {/* Show CommentForm when the form is open */}
      {showCommentForm && (
        <CommentForm
          recipeId={recipeId}
          onCancel={() => setShowCommentForm(false)}
        />
      )}
    </div>
  );
};

export default ReComment;
