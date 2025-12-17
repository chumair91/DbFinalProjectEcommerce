import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FiDownload } from 'react-icons/fi'

const Adminhome = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    orderPlaced: 0,
    packing: 0,
    shipped: 0,
    outForDelivery: 0,
    delivered: 0
  })
  const [chartData, setChartData] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token }
      })
      
      if (response.data.success) {
        const allOrders = response.data.orders
        setOrders(allOrders)
        calculateStats(allOrders)
        prepareChartData(allOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (allOrders) => {
    let totalOrders = allOrders.length
    let totalRevenue = 0
    let orderPlaced = 0
    let packing = 0
    let shipped = 0
    let outForDelivery = 0
    let delivered = 0

    allOrders.forEach(order => {
      totalRevenue += order.amount
      switch(order.status) {
        case 'Order Placed':
          orderPlaced++
          break
        case 'Packing':
          packing++
          break
        case 'Shipped':
          shipped++
          break
        case 'Out for delivery':
          outForDelivery++
          break
        case 'Delivered':
          delivered++
          break
        default:
          break
      }
    })

    setStats({
      totalOrders,
      totalRevenue,
      orderPlaced,
      packing,
      shipped,
      outForDelivery,
      delivered
    })
  }

  const prepareChartData = (allOrders) => {
    // Group orders by date for line chart
    const dateMap = {}
    allOrders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (!dateMap[date]) {
        dateMap[date] = 0
      }
      dateMap[date]++
    })

    const lineData = Object.entries(dateMap).map(([date, count]) => ({
      date,
      orders: count
    })).sort()

    setChartData(lineData)
  }

  const statusData = [
    { name: 'Order Placed', value: stats.orderPlaced, color: '#3B82F6' },
    { name: 'Packing', value: stats.packing, color: '#F59E0B' },
    { name: 'Shipped', value: stats.shipped, color: '#8B5CF6' },
    { name: 'Out for Delivery', value: stats.outForDelivery, color: '#EC4899' },
    { name: 'Delivered', value: stats.delivered, color: '#10B981' }
  ]

  const downloadOrderDetails = () => {
    const csvContent = [
      ['Order ID', 'Customer Email', 'Amount', 'Status', 'Payment Method', 'Date', 'Items'],
      ...orders.map(order => [
        order._id,
        order.address?.email || 'N/A',
        order.amount,
        order.status,
        order.paymentMethod,
        new Date(order.date).toLocaleDateString(),
        order.items.length
      ])
    ]

    const csvString = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `order-details-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-xl text-gray-600'>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>Welcome to your admin dashboard</p>
      </div>

      {/* Key Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
          <p className='text-gray-600 text-sm font-medium'>Total Orders</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalOrders}</p>
          <p className='text-gray-500 text-xs mt-2'>All orders</p>
        </div>
        
        <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-500'>
          <p className='text-gray-600 text-sm font-medium'>Total Revenue</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>Rs {stats.totalRevenue.toLocaleString()}</p>
          <p className='text-gray-500 text-xs mt-2'>All transactions</p>
        </div>

        <div className='bg-white rounded-lg shadow p-6 border-l-4 border-orange-500'>
          <p className='text-gray-600 text-sm font-medium'>Packing</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.packing}</p>
          <p className='text-gray-500 text-xs mt-2'>Orders being packed</p>
        </div>

        <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-500'>
          <p className='text-gray-600 text-sm font-medium'>Delivered</p>
          <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.delivered}</p>
          <p className='text-gray-500 text-xs mt-2'>Completed orders</p>
        </div>
      </div>

      {/* Download Button */}
      <div className='mb-8'>
        <button 
          onClick={downloadOrderDetails}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition'
        >
          <FiDownload size={20} />
          Download Order Details (CSV)
        </button>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        {/* Orders Over Time */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} orders`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown Bar Chart */}
      <div className='bg-white rounded-lg shadow p-6 mb-8'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Orders by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Summary Table */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Status Summary</h2>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b-2 border-gray-200'>
                <th className='text-left py-3 px-4 font-semibold text-gray-700'>Status</th>
                <th className='text-left py-3 px-4 font-semibold text-gray-700'>Count</th>
                <th className='text-left py-3 px-4 font-semibold text-gray-700'>Percentage</th>
                <th className='text-left py-3 px-4 font-semibold text-gray-700'>Indicator</th>
              </tr>
            </thead>
            <tbody>
              {statusData.map((status, idx) => (
                <tr key={idx} className='border-b border-gray-100 hover:bg-gray-50'>
                  <td className='py-3 px-4 text-gray-700'>{status.name}</td>
                  <td className='py-3 px-4 text-gray-800 font-semibold'>{status.value}</td>
                  <td className='py-3 px-4 text-gray-700'>
                    {stats.totalOrders > 0 ? ((status.value / stats.totalOrders) * 100).toFixed(1) : 0}%
                  </td>
                  <td className='py-3 px-4'>
                    <div className='w-24 bg-gray-200 rounded-full h-2'>
                      <div 
                        className='h-2 rounded-full' 
                        style={{
                          width: stats.totalOrders > 0 ? `${(status.value / stats.totalOrders) * 100}%` : '0%',
                          backgroundColor: status.color
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Adminhome
