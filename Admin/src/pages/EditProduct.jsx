import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [type, setType] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewImages, setPreviewImages] = useState([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: 0,
    category: '',
    type: '',
    stockQuantity: 0,
    sizes: [],
    images: [],
    bestSeller: false
  })

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.get(`http://localhost:4000/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const product = response.data
        console.log('Fetched product:', product)
        setFormData({
          name: product.name,
          description: product.description,
          brand: product.brand,
          price: product.price,
          category: product.category._id,
          type: product.type._id,
          stockQuantity: product.stockQuantity,
          sizes: product.sizes,
          images: product.images,
          bestSeller: product.bestSeller
        })
        setPreviewImages(product.images.map(img => 
          img.startsWith('http') ? img : `http://localhost:4000${img}`
        ))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to fetch product details')
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.get('http://localhost:4000/api/category', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Error fetching categories')
      }
    }
    fetchCategories()
  }, [])

  // Fetch subcategories
  useEffect(() => {
    const fetchType = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.get('http://localhost:4000/api/type', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setType(response.data)
      } catch (error) {
        console.error('Error fetching subcategories:', error)
        setError('Error fetching subcategories')
      }
    }
    fetchType()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))

    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('adminToken')
      const form = new FormData()

      // Append all fields to form data
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          // Handle both new file uploads and existing image paths
          formData.images.forEach(image => {
            if (image instanceof File) {
              form.append('images', image)
            } else if (typeof image === 'string') {
              form.append('existingImages', image)
            }
          })
        } else if (key === 'sizes') {
          formData.sizes.forEach((size, index) => {
            form.append(`sizes[${index}]`, size)
          })
        } else {
          form.append(key, formData[key])
        }
      })

      await axios.patch(`http://localhost:4000/api/products/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })

      setSuccess('Product updated successfully')
      setTimeout(() => navigate('/products'), 2000)
    } catch (error) {
      console.error('Error updating product:', error)
      setError(error.response?.data?.error || 'Error updating product')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Product</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Sub Category</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select Type</option>
              {type.map(type => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    formData.sizes.includes(size)
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="bestSeller"
              checked={formData.bestSeller}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-500 focus:ring-green-500 border-slate-300 rounded"
            />
            <label className="ml-2 block text-sm text-slate-700">
              Mark as Best Seller
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct 