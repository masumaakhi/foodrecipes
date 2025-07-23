import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReplyForm from './ReplyForm';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [replyFormVisible, setReplyFormVisible] = useState(null); // To manage reply form visibility
  const [repliesVisible, setRepliesVisible] = useState({}); // To manage visibility of replies for each comment

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => commentsData.push({ ...doc.data(), id: doc.id }));
      setComments(commentsData);
    });
  
    return () => unsubscribe();
  }, [])

  // Like a comment
  const handleLike = async (id, currentLikes) => {
    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, {
      likes: currentLikes + 1,
    });
  };

  // Reply to a comment
  const handleReply = async (id, replyText) => {
    const commentRef = doc(db, 'comments', id);
    const commentDoc = await getDoc(commentRef);

    if (commentDoc.exists()) {
      const replies = commentDoc.data().replies || [];
      replies.push({
        text: replyText,
        createdAt: new Date(),
        userName: 'User Name', // Replace with actual user data
        userImage: 'user-image-url', // Replace with actual user image
      });

      await updateDoc(commentRef, { replies });
    }
  };

  // Toggle reply visibility
  const toggleReplies = (id) => {
    setRepliesVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="comments-section">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <img src={comment.userImage} alt={comment.userName} className="user-image" />
          <div className="comment-content">
            <p><strong>{comment.userName}</strong></p>
            <p>{comment.text}</p>

            {/* Like, Reply, and Reply Count */}
            <button onClick={() => handleLike(comment.id, comment.likes)}>Like ({comment.likes})</button>
            <button onClick={() => setReplyFormVisible(comment.id)}>Reply</button>
            <button onClick={() => toggleReplies(comment.id)}>
              {comment.replies?.length ? `View Replies (${comment.replies.length})` : 'No Replies'}
            </button>

            {/* Reply form, visible only for the selected comment */}
            {comment.id === replyFormVisible && (
              <ReplyForm
                onCancel={() => setReplyFormVisible(null)}
                onSubmit={(replyText) => {
                  handleReply(comment.id, replyText);
                  setReplyFormVisible(null);
                }}
              />
            )}

            {/* Toggle Display Replies */}
            {repliesVisible[comment.id] && comment.replies && comment.replies.length > 0 && (
              <div className="replies">
                {comment.replies.map((reply, index) => (
                  <div key={index} className="reply">
                    <img src={reply.userImage} alt={reply.userName} className="user-image" />
                    <p><strong>{reply.userName}</strong>: {reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
