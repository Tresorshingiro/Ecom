import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignup from './pages/loginSignup'
import Hero from './components/Hero'
import Offers from './components/Offers'
import ShopCategory from './pages/ShopCategory'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Pages with Hero and Offers */}
          <Route 
            path="/" 
            element={
              <>
                <Hero />
                <Offers />
              </>
            } 
          />
          <Route 
            path="/men" 
            element={
              <>
                <Hero />
                <Offers />
                <ShopCategory category="men" />
              </>
            } 
          />
          <Route 
            path="/women" 
            element={
              <>
                <Hero />
                <Offers />
                <ShopCategory category="women" />
              </>
            } 
          />
          <Route 
            path="/kids" 
            element={
              <>
                <Hero />
                <Offers />
                <ShopCategory category="kids" />
              </>
            } 
          />
          
          {/* Pages without Hero and Offers */}
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
