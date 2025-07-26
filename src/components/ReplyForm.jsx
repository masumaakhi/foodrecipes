import React, { useState } from 'react';

const ReplyForm = ({ onSubmit, onCancel }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === '') return;

    onSubmit(replyText);
    setReplyText('');
  };

  return (
    <div className="mt-3 ml-14">
      <form onSubmit={handleReplySubmit} className="flex flex-col gap-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full h-20 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        ></textarea>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
          >
            Reply
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
