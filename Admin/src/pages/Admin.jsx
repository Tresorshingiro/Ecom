import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import '../index.css'
import AddProduct from '../components/AddProduct'
import ListProduct from '../components/ListProduct'
import UpdateProduct from '../components/UpdateProduct'
import AddCategory from '../components/AddCategory'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/updateproduct/:id' element={<UpdateProduct/>}/>
        <Route path='/addcategory' element={<AddCategory/>}/>
      </Routes>
    </div>
  )
}

export default Admin
