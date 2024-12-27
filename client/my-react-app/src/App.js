import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

// Axios instance to handle API calls
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', 
  withCredentials: true,  
});

function App() {
  const [fighters, setFighters] = useState([]);
  const [newFighter, setNewFighter] = useState('');
  const [idToUpdate, setIdToUpdate] = useState(null); 
  const [updatedFighterName, setUpdatedFighterName] = useState('');

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
      fetchAllFighters();
    } catch (error) {
      console.error('Error adding fighter:', error);
    }
  };

  const deleteFighter = async (id) => {
    try {
      await axiosInstance.delete(`/fighter/${id}`);
      fetchAllFighters();
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
      setIdToUpdate(null);
      setUpdatedFighterName('');
      fetchAllFighters();
    } catch (error) {
      console.error('Error updating fighter:', error);
    }
  };

  const deleteAllFighters = async () => {
    try {
      await axiosInstance.delete('/fighters');
      setFighters([]);
    } catch (error) {
      console.error('Error deleting all fighters:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Fighters CRUD App</h1>

      <div className="form-container">
        <h3>Add a New Fighter</h3>
        <form onSubmit={addFighter}>
          <input
            type="text"
            value={newFighter}
            onChange={(e) => setNewFighter(e.target.value)}
            placeholder="Enter new fighter name"
            className="input"
          />
          <button type="submit" className="btn add-btn">Add Fighter</button>
        </form>
      </div>

      {fighters.length > 0 ? (
        <div className="fighters-list">
          {fighters.map((fighter) => (
            <div key={fighter.id} className="fighter-card">
              <p>{fighter.name}</p>
              <div className="button-group">
                <button onClick={() => deleteFighter(fighter.id)} className="btn delete-btn">Delete</button>
                <button
                  onClick={() => {
                    setIdToUpdate(fighter.id);
                    setUpdatedFighterName(fighter.name);
                  }}
                  className="btn update-btn"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No fighters available</p>
      )}

      {idToUpdate && (
        <div className="form-container">
          <h3>Update Fighter</h3>
          <form onSubmit={updateFighter}>
            <input
              type="text"
              value={updatedFighterName}
              onChange={(e) => setUpdatedFighterName(e.target.value)}
              placeholder="Updated fighter name"
              className="input"
            />
            <button type="submit" className="btn update-btn">Save Update</button>
          </form>
        </div>
      )}

      <div className="button-container">
        <button onClick={fetchAllFighters} className="btn list-btn">List All Fighters</button>
        <button onClick={deleteAllFighters} className="btn delete-all-btn">Delete All Fighters</button>
      </div>
    </div>
  );
}

export default App;
