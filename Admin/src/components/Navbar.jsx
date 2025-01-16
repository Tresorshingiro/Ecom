import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
  }

  return (
    <div className='fixed top-0 right-0 left-0 bg-white z-50 flex items-center h-16 px-4 md:px-6 justify-between shadow-md'>
      <div className="flex items-center">
        <img 
          className='h-10 w-auto pl-12 md:pl-0' 
          src={assets.logo} 
          alt='logo'
        />
      </div>
      <button 
        onClick={handleLogout}
        className='bg-green-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar