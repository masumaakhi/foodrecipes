
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LatestRecipes from './LatestRecipes';
import { db } from '../firebase'; // Firebase configuration
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, updateDoc, increment } from 'firebase/firestore';

const RecipesDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL parameters
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]); // Store comments for the recipe
  const [commentText, setCommentText] = useState(''); // Input for new comment
  const [replyText, setReplyText] = useState({}); // Input for replies (each comment has its own reply text)
  const [showReplyForm, setShowReplyForm] = useState({}); // To control showing reply form per comment
  const [showReplies, setShowReplies] = useState({}); // To control showing replies per comment

  // Increment recipe visits when the component loads
  useEffect(() => {
    const incrementRecipeVisits = async () => {
      try {
        const recipeRef = doc(db, 'recipes', id);
        await updateDoc(recipeRef, {
          visits: increment(1), // Increment visits by 1
        });
      } catch (error) {
        console.error('Error updating recipe visits:', error);
      }
    };

    incrementRecipeVisits();
  }, [id]);

  // Fetch recipe details and associated comments
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        // Fetch the recipe details
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such recipe exists!');
        }

        // Fetch the comments for this recipe, ordered by createdAt
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs
          .filter((doc) => doc.data().recipeId === id) // Only get comments for this recipe
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            replies: Array.isArray(doc.data().replies) ? doc.data().replies : [], // Ensure replies is an array
          }));

        setComments(commentsData); // Set comments in state
      } catch (error) {
        console.error('Error fetching recipe details or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Function to handle adding a new comment
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
      setCommentText(''); // Reset input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to handle like/unlike for a comment or reply
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
                }).catch((error) => {
                  console.error('Error updating reply likes/unlikes in Firestore:', error);
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
            }).catch((error) => {
              console.error('Error updating likes/unlikes in Firestore:', error);
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

  // Function to handle replies
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
          replies: Array.isArray(comment.replies) ? [...comment.replies, newReply] : [newReply],
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

  // Helper function to handle timestamp conversion
  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  // Toggle showing replies
  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Toggle showing reply form
  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>No recipe found!</div>;
  }

  return (
    <div className="recipe-details">
      <h2>{recipe.title}</h2>
      <p>By {recipe.author}</p>
      <img src={recipe.imageUrl} alt={recipe.name} className="recipe-details-image" />
      <p>{recipe.description}</p>
      <div className="recipe-info">
        <div><strong>Prep Time:</strong> {recipe.prepTime} min</div>
        <div><strong>Cook Time:</strong> {recipe.cookTime} min</div>
        <div><strong>Servings:</strong> {recipe.servings}</div>
      </div>

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.name}</li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <ol>
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction.step}</li>
        ))}
      </ol>

      {recipe.nutrition && (
        <div className="nutrition-facts">
          <h2>Nutrition Facts</h2>
          <ul>
            <li>Calories: {recipe.nutrition.calories}</li>
            <li>Fat: {recipe.nutrition.totalFat}g</li>
            <li>Carbs: {recipe.nutrition.totalCarbs}g</li>
            <li>Protein: {recipe.nutrition.protein}g</li>
          </ul>
        </div>
      )}
      <LatestRecipes />
      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-details">
                  <img src={comment.userImage} alt={comment.userName} className="comment-user-image" />
                  <div>
                    <p>{comment.userName}</p>
                    <p>{comment.text}</p>
                    <p>Posted on: {formatDate(comment.createdAt)}</p>
                  </div>
                  <div className="comment-actions">
                    <button onClick={() => handleLikeUnlike(comment.id, 'like')}>👍 {comment.likes}</button>
                    <button onClick={() => handleLikeUnlike(comment.id, 'unlike')}>👎 {comment.unlikes}</button>
                    <button onClick={() => toggleReplyForm(comment.id)}>Reply</button>
                    <button onClick={() => toggleReplies(comment.id)}>
                      {showReplies[comment.id] ? 'Hide Replies' : 'Show Replies'}
                    </button>
                  </div>

                  {/* Reply Form */}
                  {showReplyForm[comment.id] && (
                    <form
                      className="reply-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReply(comment.id, replyText[comment.id]);
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Write your reply..."
                        value={replyText[comment.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                      />
                      <button type="submit">Reply</button>
                    </form>
                  )}

                  {/* Replies */}
                  {showReplies[comment.id] && (
                    <ul className="replies">
                      {comment.replies.length === 0 ? (
                        <p>No replies yet. Be the first to reply!</p>
                      ) : (
                        comment.replies.map((reply) => (
                          <li key={reply.id} className="reply">
                            <img src={reply.userImage} alt={reply.userName} className="reply-user-image" />
                            <div>
                              <p>{reply.userName}</p>
                              <p>{reply.text}</p>
                              <p>Posted on: {formatDate(reply.createdAt)}</p>
                            </div>
                            <div className="reply-actions">
                              <button onClick={() => handleLikeUnlike(reply.id, 'like', true, comment.id)}>
                                👍 {reply.likes}
                              </button>
                              <button onClick={() => handleLikeUnlike(reply.id, 'unlike', true, comment.id)}>
                                👎 {reply.unlikes}
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add New Comment Form */}
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <textarea
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default RecipesDetails;
