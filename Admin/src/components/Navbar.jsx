import React from 'react'
import { FaUser } from 'react-icons/fa'
import '../index.css'

const Navbar = () => {
  return (
    <div className='navbar'>
    <div className='nav-logo'>
      <img src='/fashion.jpg'/>
      <p>Umuheto</p>
      </div>
      <FaUser className='nav-profile'/>
    </div>
  )
}

export default Navbar
