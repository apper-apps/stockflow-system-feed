import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import OrderTable from '@/components/organisms/OrderTable';
import OrderModal from '@/components/organisms/OrderModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { orderService } from '@/services/api/orderService';
import { productService } from '@/services/api/productService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll()
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setFilteredOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleAddOrder = () => {
    setIsModalOpen(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      await orderService.create(orderData);
      toast.success('Order created successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.update(orderId, { status: newStatus });
      toast.success('Order status updated successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    // For now, just show a toast with order details
    toast.info(`Order #${order.orderNumber} - ${order.items.length} items`);
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text font-display">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and track fulfillment</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAddOrder} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders by number or customer name..."
          />
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 && !loading ? (
        <Empty
          title="No orders found"
          description={searchTerm ? "No orders match your search criteria" : "Start by creating your first order"}
          actionLabel="New Order"
          onAction={handleAddOrder}
          icon="ShoppingCart"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OrderTable
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
            onView={handleViewOrder}
          />
        </motion.div>
      )}

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        products={products}
      />
    </div>
  );
};

export default Orders;