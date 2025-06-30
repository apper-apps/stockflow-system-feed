import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 font-display">
            E-commerce Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar 
              placeholder="Search products, orders..." 
              className="w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ApperIcon name="Settings" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;