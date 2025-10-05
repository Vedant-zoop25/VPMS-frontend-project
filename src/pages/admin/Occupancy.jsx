import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { secureFetch } from '../../utils/api'; 

const OCCUPANCY_ENDPOINT = '/api/occupancy';

const Occupancy = () => {
  const [activeReservations, setActiveReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch Occupancy Data (GET) ---
  const fetchOccupancy = async () => {
    try {
      // Use secureFetch to get the list of currently active reservations
      const data = await secureFetch(OCCUPANCY_ENDPOINT);
      setActiveReservations(data);
    } catch (error) {
      console.error('Error fetching occupancy data:', error);
      // Display a user-friendly error message
      alert(`Failed to load active occupancy: ${error.message}. Check server logs.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupancy();
    // Optional: Set up an interval to refresh the occupancy data every 30 seconds
    const interval = setInterval(fetchOccupancy, 30000); 

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <Header title="Active Parking Occupancy" />;
  }

  return (
    <div>
      <Header title="Active Parking Occupancy" />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Currently Occupied Spots ({activeReservations.length})</h2>
        
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Slot No.</th>
              <th className="px-4 py-2 border">Parking Lot</th>
              <th className="px-4 py-2 border">Reserved By</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
            </tr>
          </thead>
          <tbody>
            {activeReservations.map((res) => (
              <tr key={res.reservationId} className="hover:bg-gray-100">
                {/* Data keys match the camelCase fields returned by the /api/occupancy route */}
                <td className="border px-4 py-2 font-semibold">{res.slotNumber}</td>
                <td className="border px-4 py-2">{res.lotName}</td>
                <td className="border px-4 py-2">{res.userName}</td>
                <td className="border px-4 py-2">{new Date(res.startTime).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(res.endTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {activeReservations.length === 0 && (
          <p className="text-center text-green-600 mt-4 text-lg font-medium">✅ All spots are currently vacant.</p>
        )}
      </div>
    </div>
  );
};

export default Occupancy;