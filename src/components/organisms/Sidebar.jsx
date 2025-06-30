import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: 'Dashboard', to: '/', icon: 'BarChart3' },
    { name: 'Products', to: '/products', icon: 'Package' },
    { name: 'Orders', to: '/orders', icon: 'ShoppingCart' },
    { name: 'Inventory', to: '/inventory', icon: 'Warehouse' },
  ];

  return (
    <div className="flex flex-col h-full bg-white shadow-xl border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold gradient-text font-display">StockFlow</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div 
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-current'}`} 
                />
                <span>{item.name}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-600">Store Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;