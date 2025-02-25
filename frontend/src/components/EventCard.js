import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <div className="event-details">
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Date:</strong> {formatDate(event.date)}</p>
        <p><strong>Price:</strong> ${event.price}</p>
      </div>
      <Link to={`/book/${event._id}`} className="book-button">
        Book Now
      </Link>
    </div>
  );
}

export default EventCard;