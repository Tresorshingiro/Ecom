import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Admin from './pages/Admin'
import Sidebar from './components/Sidebar'
import AddProduct from './pages/AddProduct'
import ListProduct from './pages/ListProduct'
import Login from './components/Login'
import Orders from './pages/Orders'
import ProtectedRoute from './components/ProtectedRoute'
import EditProduct from './pages/EditProduct'
import AddCategory from './pages/AddCategory'
import AddType from './pages/AddType'
import ListCategories from './pages/ListCategories'
import ListType from './pages/ListType'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  return (
    <div className='bg-gray-50 min-h-screen'>
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col h-screen">
          <Navbar setToken={setToken} />
          <div className='flex flex-1 pt-16'>
            <Sidebar/>
            <main className='flex-1 p-4 md:p-6 lg:p-8 overflow-auto'>
              <Routes>
                <Route path='/addproduct' element={
                  <ProtectedRoute token={token}>
                    <AddProduct/>
                  </ProtectedRoute>
                }/>
                <Route path='/list' element={
                  <ProtectedRoute token={token}>
                    <ListProduct/>
                  </ProtectedRoute>
                }/>
                <Route path='/orders' element={
                  <ProtectedRoute token={token}>
                    <Orders/>
                  </ProtectedRoute>
                }/>
                <Route path="/updateproduct/:id" element={<EditProduct />} />
                <Route path="/addcategory" element={<AddCategory />} />
                <Route path="/addType" element={<AddType />} />
                <Route path="/categories" element={<ListCategories />} />
                <Route path="/type" element={<ListType />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
