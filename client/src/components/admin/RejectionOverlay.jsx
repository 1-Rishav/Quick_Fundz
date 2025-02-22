import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

const RejectionOverlay = ({ isOpen, onClose, onSubmit}) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {

    onSubmit(message);
    onClose();
  };
  const handleClose=()=>{
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 gradient-bg-services text-neutral-50">
      <div className="gradient-bg-services rounded-lg p-6 shadow-lg w-full max-w-md mx-4 md:mx-0">
        <div className='w-full h-fit flex justify-end items-center'>
                <button className='text-white w-10 h-fit flex text-center justify-center items-center p-2 hover:bg-gray-700 rounded-full' onClick={handleClose}><RxCross2 size={22} /></button></div>
        <h2 className="text-xl font-semibold mb-4 text-center text-neutral-100 ">Reason for Rejection</h2>
        <textarea
          className="w-full text-black h-32 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-lg text-white focus:outline-none ${
                message.trim() == ""
                  ? 'bg-gray-700 cursor-not-allowed' : 'bg-black text-white hover:text-green-500 cursor-pointer'
              }`}
              disabled={message.trim() === ""}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionOverlay;