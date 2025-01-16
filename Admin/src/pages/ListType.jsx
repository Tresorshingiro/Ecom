import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa'

const ListType = () => {
  const [type, setType] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        setLoading(false)
      } catch (error) {
        console.error('Error fetching subcategories:', error)
        setError('Failed to fetch subcategories')
        setLoading(false)
      }
    }
    fetchType()
  }, [])

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this Type?")) {
      try {
        const token = localStorage.getItem('adminToken')
        await axios.delete(`http://localhost:4000/api/type/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setSubCategories(type.filter(type => type._id !== id))
      } catch (error) {
        console.error('Error deleting subcategory:', error)
        setError('Failed to delete subcategory')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Type</h1>
          <Link 
            to="/addType" 
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base rounded-md transition-colors duration-200 ease-in-out shadow-sm w-full sm:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add Type
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {type.map((type) => (
                  <tr key={type._id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{type.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">{type.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link 
                          to={`/updatesubcategory/${type._id}`}
                          className="text-green-500 hover:text-green-600 transition-colors duration-200"
                          title="Edit Sub Category"
                        >
                          <FaEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(type._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                          title="Delete Sub Category"
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
      </div>
    </div>
  )
}

export default ListType