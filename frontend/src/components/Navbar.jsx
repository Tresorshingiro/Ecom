import React, { useState, useContext, useRef, useEffect } from 'react'
import {assets} from '../assets/assets'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { AuthContext } from '../context/authContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const {setShowSearch, getCartCount} = useContext(ShopContext)
  const { user, dispatch } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    setIsDropdownOpen(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'><img src={assets.fashion} className='w-20' alt=''/></Link>
      
      {/* Navigation Links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img 
          onClick={()=>setShowSearch(true)} 
          src={assets.search_icon} 
          className='w-5 cursor-pointer' 
          alt=""
        />

        {/* Profile Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='cursor-pointer flex items-center gap-2 hover:text-gray-600'
          >
            <img src={assets.profile_icon} className='w-5' alt=''/>
            {user && (
              <span className='text-sm hidden sm:block'>{user.username}</span>
            )}
          </div>

          {/* Dropdown Menu */}
          <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[100] ${isDropdownOpen ? 'block' : 'hidden'}`}>
            {user ? (
              <>
                <div className='px-4 py-2 text-sm text-gray-500 border-b'>
                  Signed in as <br/>
                  <span className='font-medium text-gray-900'>{user.username}</span>
                </div>
                
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  My Profile
                </Link>
                
                <Link 
                  to="/orders" 
                  onClick={() => setIsDropdownOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  My Orders
                </Link>
                
                <div className='border-t'>
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsDropdownOpen(false)}
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt=''/>
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[-8px]'>
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img  
          onClick={() => setVisible(true)} 
          src={assets.menu_icon} 
          className='w-5 cursor-pointer sm:hidden'
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 ease-in-out ${visible ? 'w-64' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600 h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-4 border-b cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="back"/>
            <p>Close Menu</p>
          </div>
          
          {user && (
            <div className='p-4 border-b'>
              <p className='text-sm text-gray-500'>Signed in as</p>
              <p className='font-medium'>{user.email}</p>
            </div>
          )}

          <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/'>Home</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/collection'>Collection</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/about'>About</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/contact'>Contact</NavLink>
          
          {user ? (
            <>
              <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/profile'>My Profile</NavLink>
              <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/orders'>My Orders</NavLink>
              <button 
                onClick={() => {
                  handleLogout()
                  setVisible(false)
                }} 
                className='py-3 px-4 text-left text-red-600 hover:bg-gray-50'
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink onClick={()=> setVisible(false)} className='py-3 px-4 hover:bg-gray-50' to='/login'>Sign in</NavLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
