import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; 
import { secureFetch } from '../../utils/api'; 

const Login = ({ setAuth, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    // --- Supabase Sign In (Authentication) ---
    // NOTE: Supabase client automatically persists the JWT token, 
  
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Login failed: ${error.message}`);
      setLoading(false);
      return;
    }

    // --- Fetch User Profile and Role (Authorization) ---
    try {
      // 2a. Call backend to check/create the profile.
      await secureFetch('/user/ensure-profile', { method: 'POST' });
      console.log('User profile existence ensured successfully.');

      // 2b. Fetch the VERIFIED role from the database via the backend API
      const roleResponse = await secureFetch('/user/role'); 
      const verifiedRole = roleResponse.role;

      localStorage.setItem('app_is_authenticated', 'true');
      localStorage.setItem('app_user_role', verifiedRole);
      
      // 3. Final Navigation
      setAuth(true); // Update React state
      setRole(verifiedRole);
      
      // Navigate based on the fetched role
      navigate(verifiedRole === 'admin' ? '/admin' : '/dashboard');

    } catch (apiError) {
      console.error('Login failed during profile setup or role fetch:', apiError);
      alert(`Login failed: Unable to verify user profile or role. Please re-login.`);
      
      localStorage.removeItem('app_is_authenticated');
      localStorage.removeItem('app_user_role');
      
      await supabase.auth.signOut(); 
      setAuth(false);

    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for the full page, with a pleasing background
    <div className="flex flex-col md:flex-row justify-between items-center min-h-screen bg-gray-100 p-4">
      
      {/* Left Card: Image/Branding - aligned to left (hidden on mobile, visible on md+) */}
      <div className="hidden md:flex flex-col justify-center items-center w-5/12 p-8 ml-8">
        <img src="/parkease.png" alt="ParkEase" className="w-52 h-52 mb-4" /> 
        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-center text-xl text-black-500">
          Log in to manage your parking reservations quickly and efficiently.
        </p>
      </div>

      {/* Mobile Logo Section (visible only on mobile) */}
      <div className="flex md:hidden flex-col items-center mb-6 mt-4">
        <img src="/parkease.png" alt="ParkEase" className="w-32 h-32 mb-3" /> 
        <h2 className="text-2xl font-bold text-center">Welcome Back!</h2>
      </div>

      {/* Right Card: Login Form - centered on mobile, aligned to right on desktop */}
      <div className="w-full md:w-4/12 bg-white p-8 md:p-10 rounded-xl shadow-2xl md:mr-48">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Login</h1>
        <input
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-300 p-3 rounded-lg w-full mb-6 focus:ring-blue-500 focus:border-blue-500 transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-3 w-full rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Sign up</span>
        </p>
      </div>

    </div>
  );
};

export default Login;