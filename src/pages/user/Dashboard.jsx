import React from 'react';
import Header from '../../components/Header';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear custom local storage flags
      localStorage.removeItem('app_is_authenticated');
      localStorage.removeItem('app_user_role');
      
      //  Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  const cards = [
    { title: 'Book Parking', description: 'Reserve a parking slot right now', path: '/book' },
    { title: 'View History', description: 'See your past and upcoming reservations', path: '/history' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Header title="User Dashboard" />
      <div className="p-4 md:px-8 pt-4 flex justify-end">
        <button
          onClick={handleLogout} // Calls the logout function
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md text-sm md:text-base"
        >
          Logout
        </button>
      </div>
      
      <div className="p-4 md:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
          {cards.map((card, idx) => (
            <Card key={idx} title={card.title} description={card.description} onClick={() => navigate(card.path)} />
          ))}
        </div>

        <div className="flex justify-center items-center px-2">
          <img 
            src="/car-parking.jpg" 
            alt="Parking System Map Illustration" 
            className="w-full max-w-2xl h-auto object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;