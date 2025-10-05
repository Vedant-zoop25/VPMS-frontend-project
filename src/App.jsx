import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // 🚨 CRITICAL: Import Supabase
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/user/Dashboard';
import History from './pages/user/History';
import BookReservation from './pages/user/BookReservation';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSpots from './pages/admin/ManageSpots';
import ManageSlots from './pages/admin/ManageSlots';
import Occupancy from './pages/admin/Occupancy'; // 🚨 Added missing import
import Home from './pages/Home';

function App() {
  // 1. Initialize state by reading persisted values from localStorage
  const [isAuth, setIsAuth] = useState(localStorage.getItem('app_is_authenticated') === 'true');
  const [role, setRole] = useState(localStorage.getItem('app_user_role') || 'user');
  const [loadingSession, setLoadingSession] = useState(true); // 🚨 New state for initial loading

  useEffect(() => {
    // Function to check initial session status
    const initializeAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            // If no valid session on load, clear local storage
            localStorage.clear();
            setIsAuth(false);
            setRole('user');
        } else {
            // If session is found, ensure local state reflects persisted data
            setIsAuth(localStorage.getItem('app_is_authenticated') === 'true');
            setRole(localStorage.getItem('app_user_role') || 'user');
        }
        setLoadingSession(false);
    };

    initializeAuth();

    // 2. Set up real-time listener for Auth State changes (REQUIRED FOR LOGOUT)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
            // 🚨 FIX: When Supabase signs out, we update state immediately.
            setIsAuth(false);
            setRole('user');
            localStorage.clear(); 
        } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            // If signed in, rely on local storage set during successful login
            setIsAuth(localStorage.getItem('app_is_authenticated') === 'true');
            setRole(localStorage.getItem('app_user_role') || 'user');
        }
        setLoadingSession(false);
      }
    );

    return () => {
      // Clean up the subscription when the component unmounts
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show loading screen while checking session
  if (loadingSession) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-blue-600 font-medium">Loading Application...</p>
      </div>
    );
  }


  // --- Routing Logic ---

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setIsAuth} setRole={setRole} />} />
        <Route path="/signup" element={<Signup />} />
        {/* Redirects any other path to /login if not authenticated */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/spots" element={<ManageSpots />} />
        <Route path="/admin/slots" element={<ManageSlots />} />
        <Route path="/admin/occupancy" element={<Occupancy />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book" element={<BookReservation />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
