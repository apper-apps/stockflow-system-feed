import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import StockAdjustmentModal from '@/components/organisms/StockAdjustmentModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services/api/productService';
import { stockAdjustmentService } from '@/services/api/stockAdjustmentService';
import { format } from 'date-fns';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsData, adjustmentsData] = await Promise.all([
        productService.getAll(),
        stockAdjustmentService.getAll()
      ]);
      setProducts(productsData);
      setAdjustments(adjustmentsData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (filterStatus === 'low') return product.stock <= product.lowStockThreshold;
        if (filterStatus === 'medium') return product.stock > product.lowStockThreshold && product.stock <= product.lowStockThreshold * 2;
        if (filterStatus === 'high') return product.stock > product.lowStockThreshold * 2;
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, products, filterStatus]);

  const handleStockAdjustment = () => {
    setIsModalOpen(true);
  };

  const handleSaveAdjustment = async (adjustmentData) => {
    try {
      await stockAdjustmentService.create(adjustmentData);
      // Update product stock
      const product = products.find(p => p.Id === adjustmentData.productId);
      if (product) {
        const newStock = product.stock + adjustmentData.quantity;
        await productService.update(adjustmentData.productId, { stock: newStock });
      }
      toast.success('Stock adjustment saved successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to save stock adjustment');
    }
  };

  const getStockStatus = (stock, threshold) => {
    if (stock <= threshold) return { variant: 'danger', label: 'Low', color: 'text-red-600' };
    if (stock <= threshold * 2) return { variant: 'warning', label: 'Medium', color: 'text-yellow-600' };
    return { variant: 'success', label: 'High', color: 'text-green-600' };
  };

  const getRecentAdjustments = () => {
    return adjustments
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
      .map(adjustment => {
        const product = products.find(p => p.Id === adjustment.productId);
        return { ...adjustment, productName: product?.name || 'Unknown Product' };
      });
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text font-display">Inventory</h1>
          <p className="text-gray-600 mt-2">Monitor stock levels and manage inventory adjustments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleStockAdjustment} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Stock Adjustment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
              />
            </div>
            <div className="flex gap-2">
              {['all', 'low', 'medium', 'high'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <Empty
              title="No products found"
              description={searchTerm ? "No products match your search criteria" : "No products available"}
              icon="Package"
            />
          ) : (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.stock, product.lowStockThreshold);
                      return (
                        <tr key={product.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mr-3">
                                <ApperIcon name="Package" className="w-5 h-5 text-primary-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-lg font-semibold ${status.color}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={status.variant}>{status.label} Stock</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              ${(product.price * product.stock).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Adjustments */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Adjustments</h3>
              <ApperIcon name="History" className="w-5 h-5 text-gray-600" />
            </div>
            
            {getRecentAdjustments().length === 0 ? (
              <p className="text-gray-500 text-sm">No recent adjustments</p>
            ) : (
              <div className="space-y-3">
                {getRecentAdjustments().map((adjustment) => (
                  <div key={adjustment.Id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {adjustment.productName}
                      </span>
                      <span className={`text-sm font-medium ${
                        adjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {adjustment.reason} • {format(new Date(adjustment.timestamp), 'MMM dd, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAdjustment}
        products={products}
      />
    </div>
  );
};

export default Inventory;