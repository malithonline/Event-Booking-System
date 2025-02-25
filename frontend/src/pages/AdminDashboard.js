import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    venue: '',
    date: '',
    price: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      await axios.post('/api/events', newEvent, config);
      setNewEvent({
        name: '',
        venue: '',
        date: '',
        price: ''
      });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDelete = async (eventId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      await axios.delete(`/api/events/${eventId}`, config);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="create-event">
        <h3>Create New Event</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name:</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Venue:</label>
            <input
              type="text"
              name="venue"
              value={newEvent.venue}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={newEvent.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <button type="submit" className="submit-button">Create Event</button>
        </form>
      </div>

      <div className="events-list">
        <h3>Manage Events</h3>
        {events.map((event) => (
          <div key={event._id} className="event-item">
            <div className="event-info">
              <h4>{event.name}</h4>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              <p><strong>Price:</strong> ${event.price}</p>
            </div>
            <button
              onClick={() => handleDelete(event._id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;