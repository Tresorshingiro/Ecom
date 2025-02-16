import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:4000/api/order/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
        console.log('API response:', response.data);
      } catch (error) {
        console.log('Error fetching orders:', error);
        setError(
          error.response?.data?.error ||
            'An error occurred while fetching data.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'shipped':
        return 'bg-green-500 text-white';
      case 'delivered':
        return 'bg-green-700 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-6 px-4 sm:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Orders</h1>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500'></div>
          </div>
        ) : error ? (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{error}</span>
          </div>
        ) : (
          <div className='bg-white shadow-md rounded-lg overflow-hidden border border-gray-200'>
            <table className='w-full text-left text-gray-700'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='py-3 px-4'>Customer</th>
                  <th className='py-3 px-4'>Total</th>
                  <th className='py-3 px-4'>Status</th>
                  <th className='py-3 px-4'>Date</th>
                  <th className='py-3 px-4'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className='border-t'>
                    <td className='py-3 px-4'>{order.user?.email}</td>
                    <td className='py-3 px-4 font-medium'>${order.totalAmount}</td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatus(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='py-3 px-4'>
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className='text-blue-500 hover:text-blue-700'
                      >
                        <FaEye className='inline-block' /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
