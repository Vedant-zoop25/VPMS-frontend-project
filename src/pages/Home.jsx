import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar / Header */}
      <nav className="bg-gradient-to-br from-blue-200 via-white to-blue-100 shadow-md py-4 px-6 flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
            ParkEase
          </h1>
          <img
            src="/parkease.png"
            alt="ParkEase logo"
            className="w-9 h-9 sm:w-11 sm:h-11"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 bg-white">
        {/* Hero Image */}
        <img
          src="/home.png"
          alt="Car parking illustration"
          className="w-60 sm:w-80 md:w-96 mb-8 transition-transform duration-500 hover:scale-105"
        />

        {/* Hero Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Smart Parking, Simplified.
        </h2>

        {/* Hero Description */}
        <p className="text-lg sm:text-xl text-black-600 max-w-2xl mb-10">
          Effortlessly find, book, and manage your vehicle parking reservations — anytime, anywhere.
        </p>

        {/* CTA Button */}
        <button
          className="bg-blue-600 text-white px-8 sm:px-10 py-4 text-lg font-semibold rounded-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105"
          onClick={() => navigate('/login')}
        >
          Reserve Your Spot Now
        </button>
      </div>

      {/* Footer (optional, subtle brand touch) */}
      <footer className="text-center py-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} ParkEase. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
