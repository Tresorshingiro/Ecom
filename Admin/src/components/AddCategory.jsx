import React, { useState } from 'react'
import axios from 'axios'
import '../index.css'

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
      const response = await axios.post(`http://localhost:4000/api/category`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setFormData({
        name: '',
        description: ''
      })
      setSuccess('Category added successfully')
      setError('')
      console.log('Category added successfully:', response.data)
    } catch (error) {
      console.error('Error adding category', error)
      setError('Error adding category. Please try again')
      setSuccess('')
    }
  }

  return (
    <div className='add-product'>
      <form onSubmit={handleSubmit}>
        <div className='addproduct-itemfield'>
          <p>Name</p>
          <input
            type='text'
            name='name'
            value={formData.name}
            placeholder="Category's Name"
            onChange={handleInputChange}
          />
        </div>
        <div className='addproduct-itemfield'>
          <p>Description</p>
          <input
            type='text'
            name='description'
            value={formData.description}
            placeholder='Description'
            onChange={handleInputChange}
          />
        </div>
        <br />
        <button type='submit' className='addproduct-btn'>Add Category</button>
        {success && <p className='success-message'>{success}</p>}
        {error && <p className='error-message'>{error}</p>} {/* Corrected class name */}
      </form>
    </div>
  )
}

export default AddCategory
