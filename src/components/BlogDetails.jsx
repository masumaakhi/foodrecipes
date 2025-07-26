import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  updateDoc,
  increment,
} from 'firebase/firestore';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    const incrementBlogVisits = async () => {
      try {
        const blogRef = doc(db, 'blogs', id);
        await updateDoc(blogRef, {
          visits: increment(1),
        });
      } catch (error) {
        console.error('Error updating blog visits:', error);
      }
    };
    incrementBlogVisits();
  }, [id]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error('No such blog exists!');
        }

        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(commentsQuery);
        const commentsData = querySnapshot.docs
          .filter((doc) => doc.data().blogId === id)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            replies: Array.isArray(doc.data().replies) ? doc.data().replies : [],
          }));

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching blog details or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;

    try {
      const newComment = {
        blogId: id,
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

  const handleReply = async (commentId, replyTextValue) => {
    const commentRef = doc(db, 'comments', commentId);
    const newReply = {
      id: Date.now().toString(),
      text: replyTextValue,
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
          replies: [...comment.replies, newReply],
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!blog) return <div className="text-center mt-10">No blog found!</div>;

  return (
    <div className="max-w-4xl mt-24 mb-2 mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">{blog.title}</h2>
      <p className="text-gray-600 mb-4">By {blog.author}</p>
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover rounded-md mb-6" />
      <p className="text-lg leading-relaxed mb-8">{blog.content}</p>

      {/* Comments Section */}
      <div className=" p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>

        {/* New Comment */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-2"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Comment
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-6">
            {comments.map((comment) => (
              <li key={comment.id} className="border-t pt-4">
                <div className="flex items-start gap-4">
                  <img
                    src={comment.userImage}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{comment.userName}</p>
                    <p>{comment.text}</p>
                    <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
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
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleReply(comment.id, replyText[comment.id]);
                        }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-2 mb-2"
                          placeholder="Write your reply..."
                          value={replyText[comment.id] || ''}
                          onChange={(e) =>
                            setReplyText({ ...replyText, [comment.id]: e.target.value })
                          }
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                        >
                          Reply
                        </button>
                      </form>
                    )}

                    {/* Replies */}
                    {showReplies[comment.id] && (
                      <ul className="mt-4 space-y-3 pl-4 border-l">
                        {comment.replies.length === 0 ? (
                          <p className="text-gray-500">No replies yet.</p>
                        ) : (
                          comment.replies.map((reply) => (
                            <li key={reply.id} className="flex gap-3 items-start">
                              <img
                                src={reply.userImage}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{reply.userName}</p>
                                <p>{reply.text}</p>
                                <p className="text-sm text-gray-500">{formatDate(reply.createdAt)}</p>
                                <div className="flex items-center gap-3 text-sm mt-1">
                                  <button
                                    onClick={() => handleLikeUnlike(reply.id, 'like', true, comment.id)}
                                  >
                                    👍 {reply.likes}
                                  </button>
                                  <button
                                    onClick={() => handleLikeUnlike(reply.id, 'unlike', true, comment.id)}
                                  >
                                    👎 {reply.unlikes}
                                  </button>
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
      </div>
    </div>
  );
};

export default BlogDetails;
