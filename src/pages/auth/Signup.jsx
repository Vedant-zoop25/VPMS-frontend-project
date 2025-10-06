import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name, 
        }
      }
    });
    console.log(data);
    
    setLoading(false);

    if (error) {
      alert(`Signup Error: ${error.message}`);
      console.error('Signup Error:', error);
    } else {
      alert('Success! Check your email to confirm your account.');
      navigate('/login'); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center min-h-screen bg-gray-100 p-4">
      
      {/* Left Card: Image/Branding - aligned to left (hidden on mobile, visible on md+) */}
      <div className="hidden md:flex flex-col justify-center items-center w-5/12 p-8 ml-8">
        <img src="/parkease.png" alt="ParkEase" className="w-52 h-52 mb-4" /> 
        <h2 className="text-3xl text-center font-bold mb-2">Join ParkEase Today!</h2>
        <p className="text-center text-lg text-black-500">
          Create an account to simplify your parking experience.
        </p>
      </div>

      {/* Mobile Logo Section (visible only on mobile) */}
      <div className="flex md:hidden flex-col items-center mb-4">
        <img src="/parkease.png" alt="ParkEase" className="w-32 h-32 mb-2" /> 
        <h2 className="text-2xl font-bold text-center">Join ParkEase Today!</h2>
      </div>

      {/* Right Card: Signup Form - centered on mobile, aligned to right on desktop */}
      <div className="w-full max-w-md md:max-w-none md:w-4/12 bg-white p-8 md:p-10 rounded-xl shadow-2xl md:mr-48">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sign Up</h1>
        <input
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-300 p-3 rounded-lg w-full mb-6 focus:ring-green-500 focus:border-green-500 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-green-600 text-white py-3 w-full rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md disabled:opacity-50"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Signup'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>

    </div>
  );
};

export default Signup;