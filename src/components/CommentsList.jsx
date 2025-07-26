import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReplyForm from './ReplyForm';

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [replyFormVisible, setReplyFormVisible] = useState(null);
  const [repliesVisible, setRepliesVisible] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) =>
        commentsData.push({ ...doc.data(), id: doc.id })
      );
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (id, currentLikes) => {
    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, {
      likes: currentLikes + 1,
    });
  };

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

  const toggleReplies = (id) => {
    setRepliesVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mt-8 space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-4 pb-6 border-b border-gray-200"
        >
          <img
            src={comment.userImage}
            alt={comment.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">
              {comment.userName}
            </p>
            <p className="text-gray-700 text-sm mt-1">{comment.text}</p>

            <div className="flex gap-4 mt-3 text-sm text-blue-600">
              <button
                onClick={() => handleLike(comment.id, comment.likes)}
                className="hover:underline"
              >
                Like ({comment.likes})
              </button>
              <button
                onClick={() => setReplyFormVisible(comment.id)}
                className="hover:underline"
              >
                Reply
              </button>
              <button
                onClick={() => toggleReplies(comment.id)}
                className="hover:underline"
              >
                {comment.replies?.length
                  ? `View Replies (${comment.replies.length})`
                  : 'No Replies'}
              </button>
            </div>

            {comment.id === replyFormVisible && (
              <div className="mt-4">
                <ReplyForm
                  onCancel={() => setReplyFormVisible(null)}
                  onSubmit={(replyText) => {
                    handleReply(comment.id, replyText);
                    setReplyFormVisible(null);
                  }}
                />
              </div>
            )}

            {repliesVisible[comment.id] &&
              comment.replies &&
              comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-300 space-y-3">
                  {comment.replies.map((reply, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <img
                        src={reply.userImage}
                        alt={reply.userName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <p className="text-sm text-gray-800">
                        <strong>{reply.userName}</strong>: {reply.text}
                      </p>
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
