import React from 'react';

const Card = ({ title, description, onClick }) => (
  // Enhanced styling with stronger shadow, rounded corners, and a border accent
  <div
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer transition duration-300 border-l-4 border-blue-400 hover:border-blue-600 transform hover:-translate-y-1"
    onClick={onClick}
  >
    <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default Card;