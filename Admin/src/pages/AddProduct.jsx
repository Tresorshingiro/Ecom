import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FiUpload } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'
import '../index.css'

const AddProduct = () => {
  const [categories, setCategories] = useState([])
  const [type, setType] = useState([])
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
  const [previewImages, setPreviewImages] = useState([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] // predefined sizes

  useEffect(() => {
    const fetchCategories = async() => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('http://localhost:4000/api/category', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch(error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories');
      }
    }

    fetchCategories();
  }, [])

  useEffect(() => {
    const fetchType = async() => {
      const token = localStorage.getItem('adminToken');
      try {
        const response = await axios.get('http://localhost:4000/api/type', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setType(response.data);
      } catch(error) {
        console.error('Error fetching subcategories:', error);
        setError('Error fetching subcategories');
      }
    }

    fetchType();
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageClick = (index) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // Create a copy of the current images array
        const newImages = [...formData.images]
        const newPreviews = [...previewImages]
        
        // Update the specific index
        newImages[index] = file
        newPreviews[index] = URL.createObjectURL(file)
        
        // Remove empty slots
        const filteredImages = newImages.filter(img => img)
        const filteredPreviews = newPreviews.filter(preview => preview)
        
        setFormData(prev => ({
          ...prev,
          images: filteredImages
        }))
        setPreviewImages(filteredPreviews)
      }
    }
    input.click()
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    const newPreviews = [...previewImages]
    
    // Remove image at index
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
    setPreviewImages(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name || !formData.description || !formData.brand || !formData.price || !formData.category || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.sizes.length === 0) {
      setError('Please select at least one size');
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Please login first');
      return;
    }

    //Prepare form data for file upload
    const form = new FormData();
    
    // Append all fields
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        // Append each image file
        formData.images.forEach(image => {
          if (image) {
            form.append('images', image);
          }
        });
      } else if (key === 'sizes') {
        // Send sizes as an array
        formData.sizes.forEach((size, index) => {
          form.append(`sizes[${index}]`, size);
        });
      } else {
        form.append(key, formData[key]);
      }
    });

    // Debug log
    console.log('Form data before sending:', {
      name: form.get('name'),
      description: form.get('description'),
      brand: form.get('brand'),
      price: form.get('price'),
      category: form.get('category'),
      type: form.get('type')
    });

    try {
      const response = await axios.post('http://localhost:4000/api/products', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Reset form after successful submission
      setFormData({
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
      });
      setPreviewImages([]);
      setSuccess('Product added successfully');
      setError('');
    } catch (error) {
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || 'Error adding product. Please try again.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
            placeholder="Enter product description"
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
              min="0"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37cd0d]"
            >
              <option value="">Select Type</option>
              {type.map((type) => (
                <option key={type._id} value={type._id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-md border ${
                  formData.sizes.includes(size)
                    ? 'bg-[#37cd0d] text-white border-[#37cd0d]'
                    : 'bg-white text-gray-700 border-gray-300'
                } hover:bg-[#c586A5]/10 transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
                className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-[#37cd0d] transition-colors cursor-pointer"
              >
                {previewImages[index] ? (
                  <div className="relative group">
                    <img
                      src={previewImages[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <FiUpload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Click on each spot to upload an image. Up to 5 images allowed.
          </p>
        </div>

        {/* Best Seller Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="bestSeller"
            checked={formData.bestSeller}
            onChange={handleInputChange}
            className="w-4 h-4 text-[#37cd0d] border-gray-300 rounded focus:ring-[#37cd0d]"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Mark as Best Seller</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#37cd0d] text-white py-2 px-4 rounded-md hover:bg-[#37cd0d]/90 transition-colors"
        >
          Add Product
        </button>

        {/* Messages */}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}

export default AddProduct