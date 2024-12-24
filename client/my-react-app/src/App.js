import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Axios instance to handle API calls
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Correct URL of your Flask API
  withCredentials: true,  // Ensures that cookies (if needed) are sent with requests
});

function App() {
  const [fighters, setFighters] = useState([]);
  const [newFighter, setNewFighter] = useState('');
  const [idToUpdate, setIdToUpdate] = useState(null); // Fix initialization to null
  const [updatedFighterName, setUpdatedFighterName] = useState(''); // New state for the update form

  // Fetch all fighters when the component mounts
  useEffect(() => {
    fetchAllFighters();
  }, []);

  const fetchAllFighters = async () => {
    try {
      const response = await axiosInstance.get('/fighters');
      setFighters(response.data);
    } catch (error) {
      console.error('Error fetching fighters:', error);
    }
  };

  const addFighter = async (event) => {
    event.preventDefault();
    if (!newFighter.trim()) {
      alert('Fighter name is required');
      return;
    }
    try {
      const response = await axiosInstance.post('/fighter', { name: newFighter });
      console.log('Fighter added:', response.data);
      setNewFighter('');
      fetchAllFighters();  // Refresh fighters list
    } catch (error) {
      console.error('Error adding fighter:', error);
    }
  };

  const deleteFighter = async (id) => {
    try {
      await axiosInstance.delete(`/fighter/${id}`);
      fetchAllFighters();  // Refresh fighters list after deletion
    } catch (error) {
      console.error('Error deleting fighter:', error);
    }
  };

  const updateFighter = async (event) => {
    event.preventDefault();
    if (!updatedFighterName.trim()) {
      alert('Updated fighter name is required');
      return;
    }
    try {
      const response = await axiosInstance.put(`/fighter/${idToUpdate}/update`, { name: updatedFighterName });
      console.log('Fighter updated:', response.data);
      setIdToUpdate(null); // Reset ID to null after update
      setUpdatedFighterName(''); // Clear the update input
      fetchAllFighters();  // Refresh fighters list after update
    } catch (error) {
      console.error('Error updating fighter:', error);
    }
  };

  const deleteAllFighters = async () => {
    try {
      await axiosInstance.delete('/fighters');
      setFighters([]);  // Clear the fighters list
    } catch (error) {
      console.error('Error deleting all fighters:', error);
    }
  };

  return (
    <div>
      <h1>Fighters CRUD App</h1>

      {/* Form to add a new fighter */}
      <form onSubmit={addFighter}>
        <input 
          type="text" 
          value={newFighter} 
          onChange={(e) => setNewFighter(e.target.value)} 
          placeholder="Enter new fighter name"
        />
        <button type="submit">Add Fighter</button>
      </form>

      {/* Display list of fighters */}
      {fighters.length > 0 ? (
        fighters.map(fighter => (
          <div key={fighter.id}>
            <p>{fighter.name}</p>
            <button onClick={() => deleteFighter(fighter.id)}>Delete</button>
            <button onClick={() => {
              setIdToUpdate(fighter.id);
              setUpdatedFighterName(fighter.name); // Set name for update
            }}>Update</button>
          </div>
        ))
      ) : (
        <p>No fighters available</p>
      )}

      {/* Update form */}
      {idToUpdate && (
        <form onSubmit={updateFighter}>
          <input 
            type="text" 
            value={updatedFighterName} 
            onChange={(e) => setUpdatedFighterName(e.target.value)} 
            placeholder="Updated fighter name"
          />
          <button type="submit">Save Update</button>
        </form>
      )}

      {/* Additional buttons */}
      <button onClick={fetchAllFighters}>List All Fighters</button>
      <button onClick={deleteAllFighters}>Delete All Fighters</button>
    </div>
  );
}

export default App;
