import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

function BookEvent() {
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/login');
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const response = await axios.post('/api/bookings', {
        eventId: id,
        quantity: parseInt(quantity)
      }, config);

      // Generate PDF ticket
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Event Ticket', 20, 20);
      doc.setFontSize(12);
      doc.text(`Event: ${event.name}`, 20, 40);
      doc.text(`Venue: ${event.venue}`, 20, 50);
      doc.text(`Date: ${new Date(event.date).toLocaleString()}`, 20, 60);
      doc.text(`Quantity: ${quantity}`, 20, 70);
      doc.text(`Total Price: $${event.price * quantity}`, 20, 80);
      doc.text(`Booking ID: ${response.data._id}`, 20, 90);
      doc.save('event-ticket.pdf');

      // Add a small delay before navigation to ensure the booking is properly saved
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="error">Event not found</div>;

  return (
    <div className="book-event">
      <h2>Book Event: {event.name}</h2>
      <div className="event-details">
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Price per ticket:</strong> ${event.price}</p>
      </div>
      {!showPayment ? (
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Number of Tickets:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="total-price">
            <p><strong>Total Price:</strong> ${event.price * quantity}</p>
          </div>
          <button type="submit" className="submit-button">Proceed to Payment</button>
        </form>
      ) : (
        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-group">
            <label>Card Number:</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date:</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="form-group">
            <label>CVV:</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              required
            />
          </div>
          <div className="total-price">
            <p><strong>Total Price:</strong> ${event.price * quantity}</p>
          </div>
          <button type="submit" className="submit-button">Pay and Download Ticket</button>
        </form>
      )}
    </div>
  );
}

export default BookEvent;