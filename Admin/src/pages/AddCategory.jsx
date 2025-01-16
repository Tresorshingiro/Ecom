import React, { useState } from 'react'
import axios from 'axios'

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

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
      await axios.post('http://localhost:4000/api/category', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      setFormData({
        name: '',
        description: ''
      })
      setSuccess('Category added successfully')
      setError('')
    } catch (error) {
      console.error('Error adding category:', error)
      setError('Error adding category. Please try again')
      setSuccess('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-8">Add Category</h1>
        
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
          <div className="relative">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-slate-900 bg-transparent rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
              required
            />
            <label 
              htmlFor="name"
              className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Name
            </label>
          </div>

          <div className="relative">
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-slate-900 bg-transparent rounded-lg border border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
              placeholder=" "
              required
            />
            <label 
              htmlFor="description"
              className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Description
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategory
