import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <h1>Upcoming Events</h1>
      <div className="events-grid">
        {Array.isArray(events) && events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {(!Array.isArray(events) || events.length === 0) && (
        <p className="no-events">No events available at the moment.</p>
      )}
    </div>
  );
}

export default Home;