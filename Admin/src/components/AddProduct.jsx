import React, {useState, useEffect} from 'react'
import axios from 'axios'
import '../index.css'

const AddProduct = () => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: 0,
    category: '',
    stockQuantity: 0,
    image: null,
  })
  const [image, setImage] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategory = async() => {
      try{
        const response = await axios.get('http://localhost:4000/api/category');
        setCategories(response.data);
      } catch(error){
        console.error('Error fetching category');
      }
    }

    fetchCategory();
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });

    // Create URL for the selected image
    if(file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    } else{
      setImage('');
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Prepare form data for file upload
    const form = new FormData();
    for (let key in formData) {
      if (key === 'image') {
        if (formData.image) {
          form.append('image', formData.image);
        }
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post('http://localhost:4000/api/products', form,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({
        name: '',
        description: '',
        brand: '',
        price: 0,
        category: '',
        stockQuantity: 0,
        image: null,
      })
      setImage('');
      setSuccess('Product added successfully');
      setError('')
      console.log('Product added successfully:', response.data);
    }catch (error){
      console.error('Error adding product:', error);
      setError('Error adding product. Please try again.');
    }
  }


  return (
    <div className='add-product'>
      <form onSubmit={handleSubmit}>
      <div className='addproduct-itemfield'>
        <p>Product title</p>
        <input type='text' name='name' placeholder='Product name' value={formData.name} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Description</p>
        <input type='text'name='description'placeholder='Description' value={formData.description} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Brand</p>
        <input type='text' name='brand' placeholder='Brand' value={formData.brand} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Price</p>
        <input type='number' name='price' value={formData.price} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Category</p>
        <select name='category' className='add-product-selector' value={formData.category} onChange={handleInputChange}>
          <option value=''>Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className='addproduct-itemfield'>
        <p>Stock Quantity</p>
        <input type='number'name='stockQuantity'placeholder='Stock Quantity' value={formData.stockQuantity} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Image</p>
        <label htmlFor="file-input">
          <img src={image || '/upload.png'} className='addproduct-thumnail-img' alt='Upload'/>
        </label>
        <input type='file'name='image'id='file-input' hidden onChange={handleImageChange}/>
      </div>
      <button type='submit' className='addproduct-btn'>Add Product</button>
      {success && <p className='success-message'>{success}</p>}
      {error && <p className='error-message'>{error}</p>}
      </form>
    </div>
  )
}

export default AddProduct