import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';

const ProductTable = ({ products, onEdit, onDelete, onStockUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.Id);
    setEditValues({ ...product });
  };

  const handleSave = async () => {
    await onEdit(editingId, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const getStockStatus = (stock, threshold) => {
    if (stock <= threshold) return { variant: 'danger', label: 'Low' };
    if (stock <= threshold * 2) return { variant: 'warning', label: 'Medium' };
    return { variant: 'success', label: 'High' };
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <motion.tr
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mr-3">
                      <ApperIcon name="Package" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      {editingId === product.Id ? (
                        <Input
                          value={editValues.name || ''}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="text-sm"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{product.name}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.Id ? (
                    <Input
                      value={editValues.sku || ''}
                      onChange={(e) => setEditValues({ ...editValues, sku: e.target.value })}
                      className="text-sm w-24"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{product.sku}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.Id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editValues.price || ''}
                      onChange={(e) => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                      className="text-sm w-20"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">${product.price}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.Id ? (
                    <Input
                      type="number"
                      value={editValues.stock || ''}
                      onChange={(e) => setEditValues({ ...editValues, stock: parseInt(e.target.value) })}
                      className="text-sm w-16"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{product.stock}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    const status = getStockStatus(product.stock, product.lowStockThreshold);
                    return <Badge variant={status.variant}>{status.label} Stock</Badge>;
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {editingId === product.Id ? (
                      <>
                        <Button variant="accent" size="sm" onClick={handleSave}>
                          <ApperIcon name="Check" className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleCancel}>
                          <ApperIcon name="X" className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(product.Id)}>
                          <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;