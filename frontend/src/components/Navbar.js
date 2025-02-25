import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Event Booking</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Events</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/my-bookings">My Bookings</Link>
            </li>
            {user.isAdmin && (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <button onClick={logout} className="nav-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;