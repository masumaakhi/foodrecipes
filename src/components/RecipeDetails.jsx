
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import LatestRecipes from './LatestRecipes';
// import { db } from '../firebase'; // Firebase configuration
// import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, updateDoc, increment } from 'firebase/firestore';

// const RecipesDetails = () => {
//   const { id } = useParams(); // Get the recipe ID from the URL parameters
//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState([]); // Store comments for the recipe
//   const [commentText, setCommentText] = useState(''); // Input for new comment
//   const [replyText, setReplyText] = useState({}); // Input for replies (each comment has its own reply text)
//   const [showReplyForm, setShowReplyForm] = useState({}); // To control showing reply form per comment
//   const [showReplies, setShowReplies] = useState({}); // To control showing replies per comment

//   // Increment recipe visits when the component loads
//   useEffect(() => {
//     const incrementRecipeVisits = async () => {
//       try {
//         const recipeRef = doc(db, 'recipes', id);
//         await updateDoc(recipeRef, {
//           visits: increment(1), // Increment visits by 1
//         });
//       } catch (error) {
//         console.error('Error updating recipe visits:', error);
//       }
//     };

//     incrementRecipeVisits();
//   }, [id]);

//   // Fetch recipe details and associated comments
//   useEffect(() => {
//     const fetchRecipeDetails = async () => {
//       try {
//         // Fetch the recipe details
//         const docRef = doc(db, 'recipes', id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setRecipe({ id: docSnap.id, ...docSnap.data() });
//         } else {
//           console.error('No such recipe exists!');
//         }

//         // Fetch the comments for this recipe, ordered by createdAt
//         const commentsRef = collection(db, 'comments');
//         const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
//         const querySnapshot = await getDocs(commentsQuery);
//         const commentsData = querySnapshot.docs
//           .filter((doc) => doc.data().recipeId === id) // Only get comments for this recipe
//           .map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//             replies: Array.isArray(doc.data().replies) ? doc.data().replies : [], // Ensure replies is an array
//           }));

//         setComments(commentsData); // Set comments in state
//       } catch (error) {
//         console.error('Error fetching recipe details or comments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipeDetails();
//   }, [id]);

//   // Function to handle adding a new comment
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (commentText.trim() === '') return;

//     try {
//       const newComment = {
//         recipeId: id,
//         text: commentText,
//         createdAt: new Date(),
//         userName: 'User Name',
//         userImage: 'user-image-url',
//         likes: 0,
//         unlikes: 0,
//         replies: [],
//       };

//       const docRef = await addDoc(collection(db, 'comments'), newComment);
//       setComments((prev) => [{ id: docRef.id, ...newComment }, ...prev]);
//       setCommentText(''); // Reset input
//     } catch (error) {
//       console.error('Error adding comment:', error);
//     }
//   };

//   // Function to handle like/unlike for a comment or reply
//   const handleLikeUnlike = async (itemId, type, isReply = false, parentCommentId = null) => {
//     try {
//       if (isReply && parentCommentId) {
//         const parentCommentRef = doc(db, 'comments', parentCommentId);
//         const updatedComments = comments.map((comment) => {
//           if (comment.id === parentCommentId) {
//             const updatedReplies = comment.replies.map((reply) => {
//               if (reply.id === itemId) {
//                 const updatedReply = {
//                   ...reply,
//                   likes: type === 'like' ? reply.likes + 1 : reply.likes,
//                   unlikes: type === 'unlike' ? reply.unlikes + 1 : reply.unlikes,
//                 };

//                 updateDoc(parentCommentRef, {
//                   replies: comment.replies.map((r) => (r.id === reply.id ? updatedReply : r)),
//                 }).catch((error) => {
//                   console.error('Error updating reply likes/unlikes in Firestore:', error);
//                 });

//                 return updatedReply;
//               }
//               return reply;
//             });
//             return { ...comment, replies: updatedReplies };
//           }
//           return comment;
//         });
//         setComments(updatedComments);
//       } else {
//         const itemRef = doc(db, 'comments', itemId);
//         const updatedComments = comments.map((comment) => {
//           if (comment.id === itemId) {
//             const updatedComment = {
//               ...comment,
//               likes: type === 'like' ? comment.likes + 1 : comment.likes,
//               unlikes: type === 'unlike' ? comment.unlikes + 1 : comment.unlikes,
//             };

//             updateDoc(itemRef, {
//               likes: updatedComment.likes,
//               unlikes: updatedComment.unlikes,
//             }).catch((error) => {
//               console.error('Error updating likes/unlikes in Firestore:', error);
//             });

//             return updatedComment;
//           }
//           return comment;
//         });
//         setComments(updatedComments);
//       }
//     } catch (error) {
//       console.error('Error handling like/unlike:', error);
//     }
//   };

//   // Function to handle replies
//   const handleReply = async (commentId, replyText) => {
//     const commentRef = doc(db, 'comments', commentId);
//     const newReply = {
//       id: Date.now().toString(),
//       text: replyText,
//       userName: 'User Name',
//       userImage: 'user-image-url',
//       createdAt: new Date(),
//       likes: 0,
//       unlikes: 0,
//     };

//     const updatedComments = comments.map((comment) => {
//       if (comment.id === commentId) {
//         const updatedComment = {
//           ...comment,
//           replies: Array.isArray(comment.replies) ? [...comment.replies, newReply] : [newReply],
//         };
//         updateDoc(commentRef, {
//           replies: updatedComment.replies,
//         });
//         return updatedComment;
//       }
//       return comment;
//     });
//     setComments(updatedComments);
//     setReplyText({ ...replyText, [commentId]: '' });
//   };

//   // Helper function to handle timestamp conversion
//   const formatDate = (timestamp) => {
//     if (timestamp?.seconds) {
//       return new Date(timestamp.seconds * 1000).toLocaleString();
//     }
//     return new Date(timestamp).toLocaleString();
//   };

//   // Toggle showing replies
//   const toggleReplies = (commentId) => {
//     setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
//   };

//   // Toggle showing reply form
//   const toggleReplyForm = (commentId) => {
//     setShowReplyForm((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!recipe) {
//     return <div>No recipe found!</div>;
//   }

//   return (
//     <div className="recipe-details">
//       <h2>{recipe.title}</h2>
//       <p>By {recipe.author}</p>
//       <img src={recipe.imageUrl} alt={recipe.name} className="recipe-details-image" />
//       <p>{recipe.description}</p>
//       <div className="recipe-info">
//         <div><strong>Prep Time:</strong> {recipe.prepTime} min</div>
//         <div><strong>Cook Time:</strong> {recipe.cookTime} min</div>
//         <div><strong>Servings:</strong> {recipe.servings}</div>
//       </div>

//       <h2>Ingredients</h2>
//       <ul>
//         {recipe.ingredients.map((ingredient, index) => (
//           <li key={index}>{ingredient.name}</li>
//         ))}
//       </ul>

//       <h2>Instructions</h2>
//       <ol>
//         {recipe.instructions.map((instruction, index) => (
//           <li key={index}>{instruction.step}</li>
//         ))}
//       </ol>

//       {recipe.nutrition && (
//         <div className="nutrition-facts">
//           <h2>Nutrition Facts</h2>
//           <ul>
//             <li>Calories: {recipe.nutrition.calories}</li>
//             <li>Fat: {recipe.nutrition.totalFat}g</li>
//             <li>Carbs: {recipe.nutrition.totalCarbs}g</li>
//             <li>Protein: {recipe.nutrition.protein}g</li>
//           </ul>
//         </div>
//       )}
//       <LatestRecipes />
//       {/* Comments Section */}
//       <div className="comments-section">
//         <h3>Comments</h3>
//         {comments.length === 0 ? (
//           <p>No comments yet. Be the first to comment!</p>
//         ) : (
//           <ul>
//             {comments.map((comment) => (
//               <li key={comment.id} className="comment">
//                 <div className="comment-details">
//                   <img src={comment.userImage} alt={comment.userName} className="comment-user-image" />
//                   <div>
//                     <p>{comment.userName}</p>
//                     <p>{comment.text}</p>
//                     <p>Posted on: {formatDate(comment.createdAt)}</p>
//                   </div>
//                   <div className="comment-actions">
//                     <button onClick={() => handleLikeUnlike(comment.id, 'like')}>👍 {comment.likes}</button>
//                     <button onClick={() => handleLikeUnlike(comment.id, 'unlike')}>👎 {comment.unlikes}</button>
//                     <button onClick={() => toggleReplyForm(comment.id)}>Reply</button>
//                     <button onClick={() => toggleReplies(comment.id)}>
//                       {showReplies[comment.id] ? 'Hide Replies' : 'Show Replies'}
//                     </button>
//                   </div>

//                   {/* Reply Form */}
//                   {showReplyForm[comment.id] && (
//                     <form
//                       className="reply-form"
//                       onSubmit={(e) => {
//                         e.preventDefault();
//                         handleReply(comment.id, replyText[comment.id]);
//                       }}
//                     >
//                       <input
//                         type="text"
//                         placeholder="Write your reply..."
//                         value={replyText[comment.id] || ''}
//                         onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
//                       />
//                       <button type="submit">Reply</button>
//                     </form>
//                   )}

//                   {/* Replies */}
//                   {showReplies[comment.id] && (
//                     <ul className="replies">
//                       {comment.replies.length === 0 ? (
//                         <p>No replies yet. Be the first to reply!</p>
//                       ) : (
//                         comment.replies.map((reply) => (
//                           <li key={reply.id} className="reply">
//                             <img src={reply.userImage} alt={reply.userName} className="reply-user-image" />
//                             <div>
//                               <p>{reply.userName}</p>
//                               <p>{reply.text}</p>
//                               <p>Posted on: {formatDate(reply.createdAt)}</p>
//                             </div>
//                             <div className="reply-actions">
//                               <button onClick={() => handleLikeUnlike(reply.id, 'like', true, comment.id)}>
//                                 👍 {reply.likes}
//                               </button>
//                               <button onClick={() => handleLikeUnlike(reply.id, 'unlike', true, comment.id)}>
//                                 👎 {reply.unlikes}
//                               </button>
//                             </div>
//                           </li>
//                         ))
//                       )}
//                     </ul>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Add New Comment Form */}
//         <form className="add-comment-form" onSubmit={handleAddComment}>
//           <textarea
//             placeholder="Write your comment..."
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//           ></textarea>
//           <button type="submit">Add Comment</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RecipesDetails;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LatestRecipes from './LatestRecipes';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, updateDoc, increment } from 'firebase/firestore';

const RecipesDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    const incrementRecipeVisits = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id);
        await updateDoc(recipeRef, {
          visits: increment(1),
        });
      } catch (error) {
        console.error('Error updating recipe visits:', error);
      }
    };
    incrementRecipeVisits();
  }, [id]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        }
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs
          .filter((doc) => doc.data().recipeId === id)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            replies: Array.isArray(doc.data().replies) ? doc.data().replies : [],
          }));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching recipe details or comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    try {
      const newComment = {
        recipeId: id,
        text: commentText,
        createdAt: new Date(),
        userName: 'User Name',
        userImage: 'user-image-url',
        likes: 0,
        unlikes: 0,
        replies: [],
      };
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      setComments((prev) => [{ id: docRef.id, ...newComment }, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeUnlike = async (itemId, type, isReply = false, parentCommentId = null) => {
    try {
      if (isReply && parentCommentId) {
        const parentCommentRef = doc(db, 'comments', parentCommentId);
        const updatedComments = comments.map((comment) => {
          if (comment.id === parentCommentId) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply.id === itemId) {
                const updatedReply = {
                  ...reply,
                  likes: type === 'like' ? reply.likes + 1 : reply.likes,
                  unlikes: type === 'unlike' ? reply.unlikes + 1 : reply.unlikes,
                };
                updateDoc(parentCommentRef, {
                  replies: comment.replies.map((r) => (r.id === reply.id ? updatedReply : r)),
                });
                return updatedReply;
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        const itemRef = doc(db, 'comments', itemId);
        const updatedComments = comments.map((comment) => {
          if (comment.id === itemId) {
            const updatedComment = {
              ...comment,
              likes: type === 'like' ? comment.likes + 1 : comment.likes,
              unlikes: type === 'unlike' ? comment.unlikes + 1 : comment.unlikes,
            };
            updateDoc(itemRef, {
              likes: updatedComment.likes,
              unlikes: updatedComment.unlikes,
            });
            return updatedComment;
          }
          return comment;
        });
        setComments(updatedComments);
      }
    } catch (error) {
      console.error('Error handling like/unlike:', error);
    }
  };

  const handleReply = async (commentId, replyText) => {
    const commentRef = doc(db, 'comments', commentId);
    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      userName: 'User Name',
      userImage: 'user-image-url',
      createdAt: new Date(),
      likes: 0,
      unlikes: 0,
    };
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedComment = {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
        updateDoc(commentRef, {
          replies: updatedComment.replies,
        });
        return updatedComment;
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyText({ ...replyText, [commentId]: '' });
  };

  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!recipe) return <div className="text-center py-10 text-red-500">No recipe found!</div>;

  return (
    <div className="max-w-5xl mt-24 mb-3 mx-auto p-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-sm text-gray-600 mb-4">By {recipe.author}</p>
      <img src={recipe.imageUrl} alt={recipe.name} className="w-[30rem] h-[30rem] ml-4 object-fill rounded-full border mb-4" />
      <p className="mb-6 text-lg">{recipe.description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg"><strong>Prep Time:</strong> {recipe.prepTime} min</div>
        <div className="bg-gray-100 p-4 rounded-lg"><strong>Cook Time:</strong> {recipe.cookTime} min</div>
        <div className="bg-gray-100 p-4 rounded-lg"><strong>Servings:</strong> {recipe.servings}</div>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-6">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.name}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
      <ol className="list-decimal list-inside space-y-2">
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction.step}</li>
        ))}
      </ol>

      {recipe.nutrition && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Nutrition Facts</h2>
          <ul className="list-disc list-inside">
            <li>Calories: {recipe.nutrition.calories}</li>
            <li>Fat: {recipe.nutrition.totalFat}g</li>
            <li>Carbs: {recipe.nutrition.totalCarbs}g</li>
            <li>Protein: {recipe.nutrition.protein}g</li>
          </ul>
        </div>
      )}

      <LatestRecipes />

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-4 rounded-md">
                <div className="flex items-start gap-4">
                  <img src={comment.userImage} alt={comment.userName} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{comment.userName}</p>
                    <p className="text-gray-700">{comment.text}</p>
                    <p className="text-xs text-gray-400">Posted on: {formatDate(comment.createdAt)}</p>
                    <div className="flex gap-3 mt-2 text-sm">
                      <button onClick={() => handleLikeUnlike(comment.id, 'like')}>👍 {comment.likes}</button>
                      <button onClick={() => handleLikeUnlike(comment.id, 'unlike')}>👎 {comment.unlikes}</button>
                      <button onClick={() => toggleReplyForm(comment.id)}>Reply</button>
                      <button onClick={() => toggleReplies(comment.id)}>
                        {showReplies[comment.id] ? 'Hide Replies' : 'Show Replies'}
                      </button>
                    </div>

                    {showReplyForm[comment.id] && (
                      <form onSubmit={(e) => { e.preventDefault(); handleReply(comment.id, replyText[comment.id]); }} className="mt-2">
                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          placeholder="Write your reply..."
                          value={replyText[comment.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                        />
                        <button type="submit" className="mt-2 text-blue-600">Reply</button>
                      </form>
                    )}

                    {showReplies[comment.id] && (
                      <ul className="mt-2 pl-4 border-l">
                        {comment.replies.length === 0 ? (
                          <p className="text-sm text-gray-400">No replies yet.</p>
                        ) : (
                          comment.replies.map((reply) => (
                            <li key={reply.id} className="mt-2">
                              <div className="flex items-start gap-2">
                                <img src={reply.userImage} alt={reply.userName} className="w-8 h-8 rounded-full" />
                                <div>
                                  <p className="text-sm font-semibold">{reply.userName}</p>
                                  <p className="text-sm text-gray-700">{reply.text}</p>
                                  <p className="text-xs text-gray-400">Posted on: {formatDate(reply.createdAt)}</p>
                                  <div className="flex gap-2 mt-1 text-xs">
                                    <button onClick={() => handleLikeUnlike(reply.id, 'like', true, comment.id)}>👍 {reply.likes}</button>
                                    <button onClick={() => handleLikeUnlike(reply.id, 'unlike', true, comment.id)}>👎 {reply.unlikes}</button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddComment} className="mt-6">
          <textarea
            className="w-full border rounded-md p-3"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default RecipesDetails;
