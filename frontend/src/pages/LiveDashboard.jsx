import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import axios from 'axios';
import { Activity, Package, Truck, RefreshCcw, AlertTriangle } from 'lucide-react';

const LiveDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/inventory/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
        setLastUpdate(new Date());
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 1 second
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {};
  const stockLevels = dashboardData?.stockLevels || [];
  const categoryDistribution = dashboardData?.categoryDistribution || [];
  const movementTimeline = dashboardData?.movementTimeline || [];
  const warehouseComparison = dashboardData?.warehouseComparison || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Live Inventory Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time warehouse and inventory monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition ${
              autoRefresh
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-200 text-gray-600'
            }`}
            title="Toggle auto-refresh"
          >
            <RefreshCcw size={20} className={autoRefresh ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Total Stock */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {kpis.totalProductsInStock || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Units in stock</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {kpis.lowStockItems || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Items alert</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        {/* Pending Receipts */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Receipts</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {kpis.pendingReceipts || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Incoming</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Truck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Deliveries</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {kpis.pendingDeliveries || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Outgoing</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Truck className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Internal Transfers */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Transfers</p>
              <p className="text-3xl font-bold text-teal-600 mt-2">
                {kpis.internalTransfers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">In progress</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <Activity className="text-teal-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels by Category - Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels by Category</h3>
          {stockLevels.length > 0 && stockLevels[0].name !== 'No Data' ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#0088FE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Distribution</h3>
          {categoryDistribution.length > 0 && categoryDistribution[0].name !== 'No Data' ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Movement Timeline - Line Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Movement Timeline</h3>
          {movementTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={movementTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="incoming" fill="#00C49F" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outgoing" fill="#FF8042" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Warehouse Comparison */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Warehouse Comparison</h3>
        {warehouseComparison.length > 0 && warehouseComparison[0].warehouse !== 'No Data' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={warehouseComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="warehouse" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="stock" fill="#82ca9d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Data updates automatically every second • Last sync: {lastUpdate.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default LiveDashboard;
