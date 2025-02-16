import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBox, FaList, FaSitemap, FaBars, FaTimes, FaHome } from 'react-icons/fa'

const Sidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {path: '/', icon: FaHome, label: 'Dashboard'},
    { path: '/list', icon: FaBox, label: 'Products' },
    { path: '/orders', icon: FaList, label: 'Orders'},
    { path: '/categories', icon: FaList, label: 'Categories' },
    { path: '/type', icon: FaSitemap, label: 'Type' },
  ]

  return (
    <>
      {/* Mobile Menu Button - Adjusted positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 md:hidden z-50 p-2 rounded-md text-slate-600 hover:bg-slate-100"
        aria-label="Toggle Menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Updated styling */}
      <div className={`
        fixed md:sticky top-16 h-[calc(100vh-4rem)]
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        bg-white shadow-lg w-64 
        overflow-y-auto
        z-40
      `}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6 hidden md:block">Admin Dashboard</h2>
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-green-500 text-white font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar