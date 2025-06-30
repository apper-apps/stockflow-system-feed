import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  gradient = 'primary',
  onClick 
}) => {
  const gradients = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600"
  };

  const changeColors = {
    positive: "text-accent-600",
    negative: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-card card-hover cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradients[gradient]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center ${changeColors[changeType]}`}>
            <ApperIcon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              className="w-4 h-4 mr-1" 
            />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  );
};

export default MetricCard;