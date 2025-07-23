import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; // Firebase configuration
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, updateDoc, increment } from 'firebase/firestore';

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL parameters
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]); // Store comments for the blog
  const [commentText, setCommentText] = useState(''); // Input for new comment
  const [replyText, setReplyText] = useState({}); // Input for replies (each comment has its own reply text)
  const [showReplyForm, setShowReplyForm] = useState({}); // To control showing reply form per comment
  const [showReplies, setShowReplies] = useState({}); // To control showing replies per comment

  // Increment blog visits when the component loads
  useEffect(() => {
    const incrementBlogVisits = async () => {
      try {
        const blogRef = doc(db, 'blogs', id);
        await updateDoc(blogRef, {
          visits: increment(1), // Increment visits by 1
        });
      } catch (error) {
        console.error('Error updating blog visits:', error);
      }
    };

    incrementBlogVisits();
  }, [id]);

  // Fetch blog details and associated comments
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        // Fetch the blog details
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such blog exists!');
        }

        // Fetch the comments for this blog, ordered by createdAt
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs
          .filter((doc) => doc.data().blogId === id) // Only get comments for this blog
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            replies: Array.isArray(doc.data().replies) ? doc.data().replies : [], // Ensure replies is an array
          }));

        setComments(commentsData); // Set comments in state
      } catch (error) {
        console.error('Error fetching blog details or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Function to handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;

    try {
      const newComment = {
        blogId: id,
        text: commentText,
        createdAt: new Date(), // Using JavaScript Date
        userName: 'User Name', // In a real app, fetch the logged-in user’s name
        userImage: 'user-image-url', // Placeholder for user’s avatar/image
        likes: 0, // Initialize likes and unlikes
        unlikes: 0,
        replies: [], // Initialize an empty array for replies
      };

      // Add comment to Firestore
      const docRef = await addDoc(collection(db, 'comments'), newComment);

      // After successfully adding to Firestore, append the new comment to the local state
      setComments((prev) => [{ id: docRef.id, ...newComment }, ...prev]);

      setCommentText(''); // Reset the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to handle like/unlike for a comment or reply
  const handleLikeUnlike = async (itemId, type, isReply = false, parentCommentId = null) => {
    try {
      if (isReply && parentCommentId) {
        // Handle likes/unlikes for replies
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

                // Update Firestore
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
        // Handle likes/unlikes for comments
        const itemRef = doc(db, 'comments', itemId);
        const updatedComments = comments.map((comment) => {
          if (comment.id === itemId) {
            const updatedComment = {
              ...comment,
              likes: type === 'like' ? comment.likes + 1 : comment.likes,
              unlikes: type === 'unlike' ? comment.unlikes + 1 : comment.unlikes,
            };

            // Update Firestore
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
      id: Date.now().toString(), // Unique ID for reply (use string to avoid indexOf errors)
      text: replyText,
      userName: 'User Name', // In a real app, fetch the logged-in user’s name
      userImage: 'user-image-url',
      createdAt: new Date(),
      likes: 0,
      unlikes: 0,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedComment = {
          ...comment,
          replies: Array.isArray(comment.replies) ? [...comment.replies, newReply] : [newReply], // Ensure replies is always an array
        };
        // Update in Firestore
        updateDoc(commentRef, {
          replies: updatedComment.replies,
        });
        return updatedComment;
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyText({ ...replyText, [commentId]: '' }); // Reset the reply input for this comment
  };

  // Helper function to handle timestamp conversion
  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString(); // Convert Firestore Timestamp to Date
    }
    return new Date(timestamp).toLocaleString(); // If it's already a JavaScript Date
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
    return <div>Loading...</div>; // Display loading state
  }

  if (!blog) {
    return <div>No blog found!</div>; // Handle case where no blog is found
  }

  return (
    <div className="blog-details">
      <h2>{blog.title}</h2>
      <p>By {blog.author}</p>
      <img src={blog.imageUrl} alt={blog.title} className="blog-details-image" />
      <p>{blog.content}</p>

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

export default BlogDetails;
