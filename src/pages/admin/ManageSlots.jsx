// pages/admin/ManageSlots.jsx

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Modal from '../../components/Modal';
import { secureFetch } from '../../utils/api'; 

// API Endpoints
const SLOTS_ENDPOINT = '/slots';
const LOTS_ENDPOINT = '/lots';

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [lotsList, setLotsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // State for adding a new slot
  const [newSlot, setNewSlot] = useState({ lotId: '', slotNumber: '', type: '' });
  // State for editing an existing slot
  const [editingSlot, setEditingSlot] = useState(null); 
  const [loading, setLoading] = useState(true);

  // --- Utility Functions ---
  const fetchData = async () => {
    try {
      // 1. Fetch Slots (Protected)
      const slotsData = await secureFetch(SLOTS_ENDPOINT);
      setSlots(slotsData);

      // 2. Fetch Lots for the Modal dropdown (Protected)
      const lotsData = await secureFetch(LOTS_ENDPOINT);
      setLotsList(lotsData.filter(lot => lot.is_active));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert(`Error fetching slots/lots: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const closeModal = () => {
    setShowModal(false);
    setEditingSlot(null); // Clear editing state
    setNewSlot({ lotId: '', slotNumber: '', type: '' }); // Clear new slot state
  };
  
  // --- NEW: Handle Edit Click (Setup for Update) ---
  const handleEditClick = (slot) => {
    // Load the slot data into editing state. 
    setEditingSlot({
        ...slot, 
        lotId: slot.lot_id, 
        slotNumber: String(slot.slot_number) 
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSlot) {
        setEditingSlot({ ...editingSlot, [name]: value });
    } else {
        setNewSlot({ ...newSlot, [name]: value });
    }
  };

  // --- Secure Add Function (POST) --
  const handleAdd = async () => {
    if (!newSlot.lotId || !newSlot.slotNumber || !newSlot.type) return alert('Please fill all fields');
    
    const slotData = { 
        ...newSlot, 
        slotNumber: parseInt(newSlot.slotNumber),
        lotId: parseInt(newSlot.lotId) 
    };

    try {
      const addedSlot = await secureFetch(SLOTS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(slotData),
      });

      setSlots([...slots, addedSlot]); 
      closeModal();
      alert('Parking Slot added successfully!');
    } catch (error) {
      console.error('Add Error:', error);
      alert(`Failed to add slot: ${error.message}`);
    }
  };

  // --- NEW: Secure Edit/Update Function (PUT) ---
  const handleUpdate = async () => {
    if (!editingSlot.lotId || !editingSlot.slotNumber || !editingSlot.type) return alert('Please fill all fields');
    
    const slotData = {
        slotNumber: parseInt(editingSlot.slotNumber),
        type: editingSlot.type,
        lotId: parseInt(editingSlot.lotId),
    };
    
    try {
      const updatedSlot = await secureFetch(`${SLOTS_ENDPOINT}/${editingSlot.id}`, {
        method: 'PUT',
        body: JSON.stringify(slotData),
      });

      setSlots(slots.map(slot => 
        slot.id === updatedSlot.id ? updatedSlot : slot
      ));
      closeModal();
      alert(`Parking Slot ${updatedSlot.slot_number} updated successfully!`);
    } catch (error) {
      console.error('Update Error:', error);
      alert(`Failed to update slot: ${error.message}`);
    }
  };


  // --- Secure Toggle Function (DELETE equivalent) ---
  const toggleActive = async (id) => {
    const slotToToggle = slots.find(slot => slot.id === id);
    if (!slotToToggle) return;

    try {
      await secureFetch(`${SLOTS_ENDPOINT}/${id}/toggle`, {
        method: 'PUT',
      });
      
      setSlots(slots.map(slot => 
        slot.id === id ? { ...slot, is_active: !slot.is_active } : slot
      ));
      alert(`Slot ${slotToToggle.slot_number} status updated.`);
    } catch (error) {
      console.error('Toggle Error:', error);
      alert(`Failed to toggle status: ${error.message}`);
    }
  };

  if (loading) {
    return <Header title="Manage Parking Slots" />;
  }

  // Determine modal properties based on state
  const modalData = editingSlot || newSlot;
  const modalTitle = editingSlot ? `Edit Parking Slot ${editingSlot.slotNumber}` : 'Add New Parking Slot';
  const modalAction = editingSlot ? handleUpdate : handleAdd;
  const modalButtonText = editingSlot ? 'Save Changes' : 'Add Parking Slot';

  return (
    <div>
      <Header title="Manage Parking Slots" />
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Add Slot Button */}
        <button className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6 shadow-lg hover:bg-green-700 transition transform hover:scale-[1.01] font-semibold text-sm sm:text-base" onClick={() => setShowModal(true)}>
          + Add New Slot
        </button>

        {/* Slots Table (Responsive) */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-blue-100 border-b border-blue-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lot</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slot Number</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {slots.map(slot => (
                <tr key={slot.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{slot.lots ? slot.lots.name : 'N/A'}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-600">{slot.slot_number}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-600">{slot.type}</td>
                  <td className={`px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-semibold ${slot.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {slot.is_active ? 'Yes' : 'No'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm flex gap-2">
                    <button 
                        className="px-2 py-1 rounded-full text-xs font-semibold transition bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleEditClick(slot)}
                    >
                      Edit
                    </button>
                    <button 
                        className={`px-2 py-1 rounded-full text-xs font-semibold transition ${slot.is_active ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                        onClick={() => toggleActive(slot.id)}
                    >
                      {slot.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {slots.length === 0 && !loading && (
            <p className="text-center text-gray-500 mt-4 sm:mt-6 p-4 border border-dashed rounded-lg text-sm sm:text-base">No parking slots found. Add slots to your parking lots.</p>
        )}

        {/* Modal for adding/editing slot */}
        {showModal && (
          <Modal onClose={closeModal}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-5 ${editingSlot ? 'text-blue-600' : 'text-green-600'}`}>{modalTitle}</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Parking Lot</label>
            <select
              className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm text-sm"
              name="lotId"
              value={modalData.lotId}
              onChange={handleInputChange}
            >
              <option value="">Select Parking Lot</option>
              {lotsList.map(lot => (
                <option key={lot.id} value={lot.id}>{lot.name}</option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slot Number</label>
            <input 
                className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm text-sm" 
                type="number"
                placeholder="e.g., 101" 
                name="slotNumber"
                value={modalData.slotNumber} 
                onChange={handleInputChange} 
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Type (e.g., Standard, EV, Compact)</label>
            <input 
                className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:ring-green-500 focus:border-green-500 transition shadow-sm text-sm" 
                placeholder="e.g., Standard" 
                name="type"
                value={modalData.type} 
                onChange={handleInputChange} 
            />
            <button 
                className={`text-white px-4 py-3 w-full rounded-lg font-semibold transition transform hover:scale-[1.01] ${editingSlot ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`} 
                onClick={modalAction}
            >
                {modalButtonText}
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ManageSlots;