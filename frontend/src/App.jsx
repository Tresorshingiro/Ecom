import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Orders from './pages/Orders';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Product';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import { AuthContextProvider } from './context/authContext'

const App = () => {
  return (
    <AuthContextProvider>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer/>
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path='/place-order' element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          } />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </AuthContextProvider>
  );
};

export default App;
