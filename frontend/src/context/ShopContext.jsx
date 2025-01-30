import React, { createContext, useState, useEffect } from 'react'
import { fetchProducts } from '../services/api'
import { toast } from 'react-toastify'

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
  const currency = 'RWF '
  const delivery_fee = 1000
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({})

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Load user's cart from backend
  const loadUserCart = async (token) => {
    try {
      const response = await fetch('http://localhost:4000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const cart = await response.json()
        setCartItems(cart)
      }
    } catch (err) {
      console.error('Error loading cart:', err)
    }
  }

  // Save cart to backend
  const saveCartToBackend = async (token, cartData) => {
    try {
      await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      })
    } catch (err) {
      console.error('Error saving cart:', err)
    }
  }

  const addToCart = async (itemId, size) => {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }

    if (!size) {
      toast.error('Please select a size')
      return
    }

    try {
      // Check stock availability first
      const response = await fetch(`http://localhost:4000/api/products/${itemId}/check-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          size,
          quantity: (cartItems[itemId]?.[size] || 0) + 1
        })
      })

      const { available } = await response.json()

      if (!available) {
        toast.error('Selected quantity not available in stock')
        return
      }

      // Continue with existing cart logic
      const newCartItems = { ...cartItems }
      if (!newCartItems[itemId]) {
        newCartItems[itemId] = {}
      }
      if (!newCartItems[itemId][size]) {
        newCartItems[itemId][size] = 0
      }
      newCartItems[itemId][size] += 1

      setCartItems(newCartItems)
      await saveCartToBackend(user.token, newCartItems)
      toast.success('Item added to cart')
    } catch (err) {
      toast.error('Error adding item to cart')
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (!user) {
      toast.error('Please login to update cart')
      return
    }

    const newCartItems = { ...cartItems }
    if (quantity === 0) {
      if (newCartItems[itemId]) {
        delete newCartItems[itemId][size]
        if (Object.keys(newCartItems[itemId]).length === 0) {
          delete newCartItems[itemId]
        }
      }
    } else {
      if (!newCartItems[itemId]) newCartItems[itemId] = {}
      newCartItems[itemId][size] = quantity
    }

    setCartItems(newCartItems)
    await saveCartToBackend(user.token, newCartItems)
  }

  const getCartCount = () => {
    let count = 0
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        count += cartItems[itemId][size]
      }
    }
    return count
  }

  const getCartAmount = () => {
    let total = 0
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const product = products.find(p => p._id === itemId)
        if (product) {
          total += product.price * cartItems[itemId][size]
        }
      }
    }
    return total
  }

  return (
    <ShopContext.Provider value={{
      search,
      setSearch,
      setShowSearch,
      showSearch,
      loadUserCart,
      products,
      loading,
      error,
      currency,
      delivery_fee,
      cartItems,
      addToCart,
      updateQuantity,
      getCartCount,
      getCartAmount
    }}>
      {children}
    </ShopContext.Provider>
  )
}
export default ShopContextProvider
