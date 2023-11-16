import React from "react";

const Message = ({ message }) => {
  return (
    <p className="text-red-500 font-bold bg-gray-100 border border-red-500 rounded-full mb-5 text-center mt-3">
      {message}
    </p>
  );
};

export default Message;
