import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./UserProfile.css"
// import { signOut } from 'firebase/auth';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

function UserProfile() {
   
    const [isMenuOpen, setMenuOpen] = useState(false);
    const handleSignOut = async () =>{
        // signOut(auth)         
    }    
    const handleMenuToggle = () => {
      setMenuOpen(!isMenuOpen);
    };
  return (
    <div>
        
        <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          My App
        </Link>

        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            
            <li>
              <button onClick={handleSignOut}>Logout</button>
            </li>
          </ul>
        </div>

        <div className="mobile-menu-icon" onClick={handleMenuToggle}>
          <span className={`icon ${isMenuOpen ? 'open' : ''}`}></span>
        </div>
      </div>
    </nav>
    </div>
    
  )
}

export default UserProfile