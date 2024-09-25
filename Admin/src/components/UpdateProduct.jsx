import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import '../index.css'

const UpdateProduct = () => {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        price: 0,
        category: '',
        stockQuantity: 0,
        image: null
    })
    const [categories, setCategories] = useState([])
    const [image, setImage] = useState('')

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const response = await axios.get(`http://localhost:4000/api/products/${id}`);
                const product = response.data
                setFormData({
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    price: product.price,
                    category: product.category._id,
                    stockQuantity: product.stockQuantity,
                    image: null
                })
                setImage(`http://localhost:4000${product.image}`)
            } catch (error) {
                console.error('Error fetching product:', error)
            }
        };

        const fetchCategories = async() => {
            try{
                const response = await axios.get(`http://localhost:4000/api/category`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        })
        setImage(URL.createObjectURL(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        for (let key in formData) {
            form.append(key, formData[key]);
        }
         try{
            await axios.patch(`http://localhost:4000/api/products/${id}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Product updated successfully');
         } catch (error) {
            console.error('Error updating product:', error);
         }
    }


  return (
    <div className='add-product'>
      <form onSubmit={handleSubmit}>
      <div className='addproduct-itemfield'>
        <p>Product title</p>
        <input type='text' name='name'value={formData.name} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Description</p>
        <input type='text'name='description' value={formData.description} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Brand</p>
        <input type='text' name='brand'value={formData.brand} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Price</p>
        <input type='number' name='price' value={formData.price} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Category</p>
      <select name='category' className='add-product-selector' value={formData.category} onChange={handleInputChange}>
        <option value=''>Select category</option>
        {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
        ))}
      </select>
      </div>
      <div className='addproduct-itemfield'>
        <p>Stock Quantity</p>
      <input type='number' name='stockQuantity' value={formData.stockQuantity} onChange={handleInputChange}/>
      </div>
      <div className='addproduct-itemfield'>
        <p>Image</p>
        <label htmlFor='file-input'>
          {image ? (
            <img src={image} className='addproduct-thumnail-img'/>
          ) : (
            <p>No image available</p>
          )}
        </label>
      <input type='file' name='image' id='file-input' onChange={handleImageChange} hidden/>
      </div>
      <button type='submit' className='addproduct-btn'>Update Product</button>
      </form>
    </div>
  )
}

export default UpdateProduct
