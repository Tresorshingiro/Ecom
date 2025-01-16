import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa'

const ListProduct = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async() => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:4000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(response.data);
        console.log('API response', response.data);
      } catch(error) {
        console.error('Error details:', error.response?.data);
        setError(error.response?.data?.error || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")){
      try{
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:4000/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(products.filter(product => product._id !== id));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Products</h1>
          <Link 
            to="/addproduct" 
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base rounded-md transition-colors duration-200 ease-in-out shadow-sm w-full sm:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              {/* For mobile screens */}
              <div className="block sm:hidden">
                {products.map((product) => (
                  <div key={product._id} className="p-4 border-b border-slate-200">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={`http://localhost:4000${product.images[0]}`}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-sm text-slate-500">RWF {product.price.toLocaleString()}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Link 
                          to={`/updateproduct/${product._id}`}
                          className="text-green-500 hover:text-green-600 transition-colors duration-200"
                          title="Edit Product"
                        >
                          <FaEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                          title="Delete Product"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* For larger screens */}
              <table className="min-w-full divide-y divide-slate-200 hidden sm:table">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={`http://localhost:4000${product.images[0]}`}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-md shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">RWF {product.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <Link 
                            to={`/updateproduct/${product._id}`}
                            className="text-green-500 hover:text-green-600 transition-colors duration-200"
                            title="Edit Product"
                          >
                            <FaEdit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                            title="Delete Product"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListProduct
