import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { productService } from '@/services/api/productService';
import { orderService } from '@/services/api/orderService';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, ordersData] = await Promise.all([
        productService.getAll(),
        orderService.getAll()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;
  
  const lowStockItems = products.filter(product => 
    product.stock <= product.lowStockThreshold
  ).length;

  const topProducts = products
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 3);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text font-display">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change="+12.5%"
          changeType="positive"
          icon="DollarSign"
          gradient="primary"
        />
        <MetricCard
          title="Orders Today"
          value={todayOrders}
          change="+8.2%"
          changeType="positive"
          icon="ShoppingCart"
          gradient="accent"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems}
          change={lowStockItems > 0 ? "Needs attention" : "All good"}
          changeType={lowStockItems > 0 ? "negative" : "positive"}
          icon="AlertTriangle"
          gradient={lowStockItems > 0 ? "danger" : "accent"}
        />
        <MetricCard
          title="Total Products"
          value={products.length}
          change="+3 this week"
          changeType="positive"
          icon="Package"
          gradient="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <ApperIcon name="ShoppingCart" className="w-5 h-5 text-primary-600" />
          </div>
          
          {recentOrders.length === 0 ? (
            <Empty
              title="No orders yet"
              description="Orders will appear here once customers start purchasing"
              icon="ShoppingCart"
            />
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.createdAt), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-accent-600" />
          </div>
          
          {topProducts.length === 0 ? (
            <Empty
              title="No products yet"
              description="Add products to see your top performers here"
              icon="Package"
            />
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.price}</p>
                    <p className="text-sm text-gray-600">{product.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Low Stock Alert</h3>
              <p className="text-red-700">
                You have {lowStockItems} product{lowStockItems > 1 ? 's' : ''} running low on stock. 
                Review your inventory to avoid stockouts.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;