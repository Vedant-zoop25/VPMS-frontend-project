// pages/admin/ManageSpots.jsx

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { secureFetch } from '../../utils/api';

const LOTS_ENDPOINT = '/lots';

const ManageSpots = () => {
  const [lots, setLots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newLot, setNewLot] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(true);

  const fetchLots = async () => {
    try {
      const data = await secureFetch(LOTS_ENDPOINT);
      setLots(data);
    } catch (error) {
      console.error(error);
      alert(`Error fetching parking lots: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleAdd = async () => {
    if (!newLot.name || !newLot.location) return alert('Please fill all fields');

    try {
      const addedLot = await secureFetch(LOTS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(newLot),
      });

      setLots([...lots, addedLot]);
      setShowModal(false);
      setNewLot({ name: '', location: '' });
      alert('Parking lot added successfully.');
    } catch (error) {
      console.error(error);
      alert(`Failed to add parking lot: ${error.message}`);
    }
  };

  const toggleActive = async (id) => {
    try {
      const updatedLot = await secureFetch(`${LOTS_ENDPOINT}/${id}/toggle`, {
        method: 'PUT',
      });

      setLots(lots.map(lot => (lot.id === id ? updatedLot : lot)));
    } catch (error) {
      console.error(error);
      alert(`Failed to update lot status: ${error.message}`);
    }
  };

  if (loading) {
    return <Header title="Manage Parking Lots" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manage Parking Lots" />
      <div className="p-4 md:p-6">
        
        {/* Add Button */}
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition w-full sm:w-auto text-sm md:text-base" 
          onClick={() => setShowModal(true)}
        >
          Add Parking Lot
        </button>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {lots.map(lot => (
            <div key={lot.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{lot.name}</h3>
                  <p className="text-sm text-gray-600">{lot.location}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${lot.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {lot.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button 
                className={`w-full mt-2 px-3 py-2 text-sm rounded transition ${lot.is_active ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                onClick={() => toggleActive(lot.id)}
              >
                {lot.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Active</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => (
                <tr key={lot.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{lot.name}</td>
                  <td className="border px-4 py-2">{lot.location}</td>
                  <td className="border px-4 py-2">{lot.is_active ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition" 
                      onClick={() => toggleActive(lot.id)}
                    >
                      {lot.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h2 className="text-lg md:text-xl font-bold mb-2">Add Parking Lot</h2>
            <input 
              className="border p-2 mb-2 w-full rounded text-sm md:text-base" 
              placeholder="Name" 
              value={newLot.name} 
              onChange={e => setNewLot({ ...newLot, name: e.target.value })} 
            />
            <input 
              className="border p-2 mb-2 w-full rounded text-sm md:text-base" 
              placeholder="Location" 
              value={newLot.location} 
              onChange={e => setNewLot({ ...newLot, location: e.target.value })} 
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition text-sm md:text-base" 
              onClick={handleAdd}
            >
              Add
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageSpots;