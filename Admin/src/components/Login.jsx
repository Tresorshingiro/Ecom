import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setError('')
        
        try {
            const response = await axios.post('http://localhost:4000/api/admin/login', {
                email, 
                password
            })
            
            // Save admin token to localStorage
            localStorage.setItem('adminToken', response.data.token)
            setToken(response.data.token)
            navigate('/add')
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed')
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                {error && <p className='text-red-500 mb-4'>{error}</p>}
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input 
                            onChange={(e)=>setEmail(e.target.value)} 
                            value={email} 
                            className='round-md w-full px-3 py-2 border border-gray-300 outline-none' 
                            type='email' 
                            placeholder='your@email.com'
                        />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input 
                            onChange={(e)=>setPassword(e.target.value)} 
                            value={password} 
                            className='round-md w-full px-3 py-2 border border-gray-300 outline-none' 
                            type='password' 
                            placeholder='Enter your password'
                        />
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
