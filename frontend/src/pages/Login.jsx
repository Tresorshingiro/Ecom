import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/authContext'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Login = () => {
  const backendURL = "https://umuheto-backend.onrender.com"
  const [currentState, setCurrentState] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = useContext(AuthContext)
  const { loadUserCart } = useContext(ShopContext)

  // Get the return URL from location state, default to home page
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const endpoint = currentState === 'Login' ? '/api/user/login' : '/api/user/signup'
    const userData = currentState === 'Login' 
      ? { email, password }
      : { email, password, username }

    try {
      const response = await axios.post(`${backendURL}${endpoint}`, userData)

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(response.data))

      // Update auth context
      dispatch({ type: 'LOGIN', payload: response.data })

      // Load user's cart
      await loadUserCart(response.data.token)

      // Redirect to the page they tried to visit or home
      navigate(from, { replace: true })
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-8'>
        <Title text1={currentState.toUpperCase()} text2={'ACCOUNT'} />
      </div>

      <form onSubmit={handleSubmit} className='max-w-md mx-auto'>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {currentState === 'Sign Up' && (
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
        )}

        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Email
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        <div className='flex flex-col gap-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:bg-gray-400'
          >
            {isLoading ? 'Processing...' : currentState}
          </button>
          
          <p className='text-center text-sm text-gray-600'>
            {currentState === 'Login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type='button'
              onClick={() => {
                setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')
                setError(null)
              }}
              className='text-black font-semibold hover:underline'
            >
              {currentState === 'Login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
