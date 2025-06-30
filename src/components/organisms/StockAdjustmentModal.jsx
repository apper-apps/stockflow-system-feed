import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const StockAdjustmentModal = ({ isOpen, onClose, onSave, products = [] }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    reason: '',
    type: 'add'
  });
  const [loading, setLoading] = useState(false);

  const reasonOptions = [
    { value: '', label: 'Select reason' },
    { value: 'restock', label: 'Restock' },
    { value: 'damage', label: 'Damaged goods' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'return', label: 'Customer return' },
    { value: 'correction', label: 'Inventory correction' },
    { value: 'other', label: 'Other' }
  ];

  const typeOptions = [
    { value: 'add', label: 'Add stock' },
    { value: 'remove', label: 'Remove stock' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adjustmentData = {
        ...formData,
        productId: parseInt(formData.productId),
        quantity: formData.type === 'remove' ? -parseInt(formData.quantity) : parseInt(formData.quantity)
      };

      await onSave(adjustmentData);
      onClose();
      setFormData({ productId: '', quantity: '', reason: '', type: 'add' });
    } catch (error) {
      console.error('Error saving stock adjustment:', error);
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map(product => ({
    value: product.Id.toString(),
    label: `${product.name} (Current: ${product.stock})`
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Stock Adjustment</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Select
                label="Product"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                options={[{ value: '', label: 'Select a product' }, ...productOptions]}
                required
              />

              <Select
                label="Adjustment Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={typeOptions}
                required
              />

              <Input
                label="Quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />

              <Select
                label="Reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                options={reasonOptions}
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Save Adjustment
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StockAdjustmentModal;