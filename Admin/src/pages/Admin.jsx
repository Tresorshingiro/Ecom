import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ items: 0, users: 0, orders: 0, sales: 0 });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:4000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.stats);
        setSalesData(response.data.salesData);
        setRecentOrders(response.data.recentOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {['Items', 'Users', 'Orders', 'Sales'].map((key, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold">{key}</h2>
            <p className="text-2xl font-bold text-blue-600">{stats[key.toLowerCase()]}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border">
                <td className="p-2 border">{order._id.slice(-6)}</td>
                <td className="p-2 border">{order.user.email}</td>
                <td className="p-2 border font-bold">${order.totalAmount}</td>
                <td className="p-2 border text-green-600 font-semibold">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
