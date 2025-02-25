import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setError('Please login to view your bookings');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const response = await axios.get('/api/bookings', config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3>{booking.event.name}</h3>
              <div className="booking-details">
                <p><strong>Venue:</strong> {booking.event.venue}</p>
                <p><strong>Date:</strong> {formatDate(booking.event.date)}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;