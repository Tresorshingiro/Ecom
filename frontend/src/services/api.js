const BASE_URL = 'http://localhost:4000/api';

// Products
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }
    
    const data = await response.json();
    if (!data) {
      throw new Error('No products data received');
    }
    
    return data;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error('Failed to fetch products');
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Cart
export const fetchCart = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Auth
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signupUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Signup failed');
    return await response.json();
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Orders
export const fetchOrders = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/order`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}; 