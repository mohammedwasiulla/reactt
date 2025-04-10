import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          Student Job Tracker
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Dashboard</Link>
            </li>
            <li>
              <Link to="/add" className="nav-link add-btn">Add Job</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;