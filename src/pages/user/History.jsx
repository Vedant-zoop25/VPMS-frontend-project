// pages/user/History.jsx

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { secureFetch } from '../../utils/api'; 

const HISTORY_ENDPOINT = '/reservations/history';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Secure Fetch Function ---
  const fetchHistory = async () => {
    try {
      // Use secureFetch to get history (filtered by user ID in the backend)
      const data = await secureFetch(HISTORY_ENDPOINT);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching reservation history:', error);
      alert(`Could not load reservation history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <Header title="Reservation History" />;
  }

  return (
    <div>
      <Header title="Reservation History" />
      <div className="p-6">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Slot</th>
              <th className="px-4 py-2 border">Parking Lot</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map(res => (
              <tr key={res.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{res.slots?.slot_number}</td>
                <td className="border px-4 py-2">{res.slots?.lots?.name}</td>
                
                <td className="border px-4 py-2">{new Date(res.startTime).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(res.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {history.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No reservation history found.</p>
        )}
      </div>
    </div>
  );
};

export default History;