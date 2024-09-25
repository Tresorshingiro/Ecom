import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaTrash, FaEdit } from 'react-icons/fa'
import '../index.css'

const ListProduct = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get('http://localhost:4000/api/products');
        setProducts(response.data);
        console.log('API response', response.data);
      } catch(error) {
        setError(error.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")){
      try{
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleteing product:', error);
        alert('Failed to delete product.');
      }
    }
  }
  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
        <div className='listproduct-format-main'>
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Category</p>
          <p>Action</p>
        </div>
        <div className='listproduct-allproducts'>
          <hr />
          {products.map((product) => (
            <>
            <div key={product._id} className='listproduct-format-main listproduct-format'>
              <img src={`http://localhost:4000${product.image}`} className='listproduct-product-icon'/>
              <p>{product.name}</p>
              <p>RWF{product.price}</p>
              <p>{product.category.name}</p>
              <p className='listproduct-remove-icon'>
                <Link to={`/updateproduct/${product._id}`} className='edit-icon'>
                 <FaEdit/>
                </Link>
                <FaTrash onClick={() => handleDelete(product._id)} className='delete-icon'/>
                </p>
            </div>
            <hr />
            </>
          ))}
        </div>
        </>
      )}
    </div>
  )
}

export default ListProduct
