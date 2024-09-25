import React from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaList, FaEdit, FaTags } from 'react-icons/fa'
import '../index.css'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to='/addproduct' style={{textDecoration: "none", color: "black", fontSize: "16px", fontWeight: "500"}}>
      <div className='sidebar-item'>
        <FaPlus className='icon'/>
        <p>Add Product</p>
      </div>
      </Link>
      <Link to='/listproduct' style={{textDecoration: "none", color: "black", fontSize: "16px", fontWeight: "500"}}>
      <div className='sidebar-item'>
        <FaList className='icon'/>
        <p>Product List</p>
      </div>
      </Link>
      <Link to='/addcategory' style={{textDecoration: "none", color: "black", fontSize: "16px", fontWeight: "500"}}>
      <div className='sidebar-item'>
        <FaTags className='icon'/>
        <p>Add Category</p>
      </div>
      </Link>
    </div>
  )
}

export default Sidebar
