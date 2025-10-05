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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700 transition disabled:opacity-50"
          onClick={handleSignup}
          disabled={loading} 
        >
          {loading ? 'Signing Up...' : 'Signup'}
        </button>
      </div>
    </div>
  );
};

export default Signup;