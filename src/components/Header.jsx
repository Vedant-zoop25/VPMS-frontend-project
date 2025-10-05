import React from 'react';

const Header = ({ title }) => (
  // Updated background, text, and added a border/accent
  <header className="bg-white text-gray-800 py-4 px-8 shadow-md border-b-4 border-blue-600">
    <h1 className="text-3xl font-extrabold text-blue-600">{title}</h1>
  </header>
);

export default Header;