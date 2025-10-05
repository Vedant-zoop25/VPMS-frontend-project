import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { secureFetch } from '../../utils/api'; 

// API Endpoints
const SLOTS_API = 'http://localhost:3001/api/slots'; 
const RESERVATIONS_ENDPOINT = '/reservations'; 

const BookReservation = () => {
  const [availableSlots, setAvailableSlots] = useState([]); 
  const [currentReservations, setCurrentReservations] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ slotId: '', startTime: '', endTime: '' });
  const [loading, setLoading] = useState(true);

  // --- Secure Fetch Data Function (GET) ---
  const fetchData = async () => {
    try {
      // 1. Fetch ALL active slots 
      const slotsResponse = await fetch(SLOTS_API);
      if (!slotsResponse.ok) {
        throw new Error(`Failed to fetch slots. Status: ${slotsResponse.status}`);
      }
      const slotsData = await slotsResponse.json();
      setAvailableSlots(slotsData.filter(slot => slot.is_active));

      // 2. Fetch User's Upcoming Reservations (MUST be secure)
      const resHistoryData = await secureFetch(`${RESERVATIONS_ENDPOINT}/history`);

      // Filter and Sort Logic: Use camelCase keys (startTime, endTime) as returned by Express
      const now = new Date();
      const upcoming = resHistoryData
        // Filter: Use res.endTime (camelCase) for filtering
        .filter(res => new Date(res.endTime) > now)
        
        // Sort: Use res.startTime (camelCase) for sorting
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); 

      setCurrentReservations(upcoming);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert(`Error fetching data: ${error.message}. Please ensure you are logged in.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Secure Book Function (POST) ---
  const handleBook = async () => {
    // 1. Validation checks
    if (!newRes.slotId || !newRes.startTime || !newRes.endTime) {
      alert('Please select a slot and times');
      return;
    }

    if (new Date(newRes.endTime) <= new Date(newRes.startTime)) {
      alert('End time must be after start time.');
      return;
    }

    // FIX: Convert local time strings to ISO 8601 (UTC) format for database
    const startTimeUTC = new Date(newRes.startTime).toISOString();
    const endTimeUTC = new Date(newRes.endTime).toISOString();

    try {
      // 2. Send the booking request.
      await secureFetch(RESERVATIONS_ENDPOINT, { 
        method: 'POST',
        body: JSON.stringify({
          slotId: parseInt(newRes.slotId), 
          startTime: startTimeUTC,     
          endTime: endTimeUTC          
        }),
      });

      // 3. Success logic
      alert('Booking successful!');
      setShowModal(false);
      setNewRes({ slotId: '', startTime: '', endTime: '' });
    
      await fetchData(); 

    } catch (error) {
      console.error('Booking Error:', error);
      alert(`Booking failed: ${error.message}`);
    }
  };

  // --- Secure Cancel Function (DELETE) ---
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      // Use secureFetch for DELETE request
      await secureFetch(`${RESERVATIONS_ENDPOINT}/${id}`, {
        method: 'DELETE',
      });

      // Update state by calling fetchData to ensure data consistency
      await fetchData(); 
      alert('Reservation cancelled successfully.');
    } catch (error) {
      console.error('Cancel Error:', error);
      alert(`Failed to cancel reservation: ${error.message}`);
    }
  };

  if (loading) {
    return <Header title="Book Parking Slot" />;
  }

  return (
    <div>
      <Header title="Book Parking Slot" />
      <div className="p-6">
        {/* Book Slot Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShowModal(true)}>Book New Slot</button>

        {/* Current Reservations Table */}
        <h2 className="text-xl font-bold mb-3">Your Upcoming Reservations</h2>
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">Slot</th>
              <th className="px-4 py-2 border">Parking Lot</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-100">
                {/* Display FIX: Use optional chaining on nested objects */}
                <td className="border px-4 py-2">{res.slots?.slot_number}</td>
                <td className="border px-4 py-2">{res.slots?.lots?.name}</td>
                <td className="border px-4 py-2">{new Date(res.startTime).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(res.endTime).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleCancel(res.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentReservations.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No upcoming reservations found.</p>
        )}

        {/* Booking Modal */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-bold mb-4">Book Parking Slot</h2>
            <select
              className="border p-2 mb-3 w-full rounded"
              value={newRes.slotId}
              onChange={(e) => setNewRes({ ...newRes, slotId: e.target.value })}
            >
              <option value="">Select Slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.slot_number} - {slot.lotName} ({slot.type})
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="border p-2 mb-3 w-full rounded"
              value={newRes.startTime}
              onChange={(e) => setNewRes({ ...newRes, startTime: e.target.value })}
            />
            <input
              type="datetime-local"
              className="border p-2 mb-4 w-full rounded"
              value={newRes.endTime}
              onChange={(e) => setNewRes({ ...newRes, endTime: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition"
              onClick={handleBook}
            >
              Book
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default BookReservation;