import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AddType = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setError('Please login to continue')
      setIsAuthenticated(false)
      setIsAdmin(false)
    } else {
      setIsAuthenticated(true)
      setIsAdmin(true)
    }
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      if (!token || !isAdmin) {
        setError('Not authorized. Please login again.')
        return
      }

      await axios.post('http://localhost:4000/api/type', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        }
      })
      setFormData({
        name: '',
        description: ''
      })
      setSuccess('Type added successfully')
      setError('')
    } catch (error) {
      console.error('Error adding Type:', error.response?.data?.error || error.message)
      setError(error.response?.data?.error || 'Error adding Type. Please try again')
      setSuccess('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-8">Add Type</h1>
        
        {!isAuthenticated || !isAdmin ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {!isAuthenticated ? 'Please login to continue' : 'Not authorized as admin'}
          </div>
        ) : (
          <>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
              <div className="relative mt-4 sm:mt-0">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-2 sm:px-2.5 pb-2 sm:pb-2.5 pt-3 sm:pt-4 text-sm sm:text-base text-slate-900 bg-transparent rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="name"
                  className="absolute text-xs sm:text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Name
                </label>
              </div>

              <div className="relative mt-4 sm:mt-0">
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="block w-full px-2 sm:px-2.5 pb-2 sm:pb-2.5 pt-3 sm:pt-4 text-sm sm:text-base text-slate-900 bg-transparent rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                  placeholder=" "
                  required
                />
                <label 
                  htmlFor="description"
                  className="absolute text-xs sm:text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Description
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base"
                >
                  Add Type
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AddType