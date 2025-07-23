import React, { useState } from 'react';

const ReplyForm = ({ onSubmit, onCancel }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') return;

    onSubmit(replyText);
    setReplyText(''); // Clear the input field after submit
  };

  return (
    <div className="reply-form">
      <form onSubmit={handleReplySubmit}>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
        ></textarea>
        <button type="submit">Reply</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ReplyForm;
