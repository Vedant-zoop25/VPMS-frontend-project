import React from 'react';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    { title: 'Manage Parking Lots', description: 'Add, edit, or delete parking lots', path: '/admin/spots' },
    { title: 'Manage Parking Slots', description: 'Manage individual slots within lots', path: '/admin/slots' },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
        return;
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Header with Logout */}
      <header className="bg-white text-gray-800 py-4 px-4 md:px-8 shadow-md border-b-4 border-blue-600">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold transition duration-300 shadow-md text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="p-4 md:p-6">
        {/* Card Section - responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {cards.map((card, idx) => (
            <Card key={idx} title={card.title} description={card.description} onClick={() => navigate(card.path)} />
          ))}
        </div>

        {/* Image Section - responsive sizing */}
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

export default AdminDashboard;