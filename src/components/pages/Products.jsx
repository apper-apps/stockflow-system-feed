import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ProductTable from '@/components/organisms/ProductTable';
import ProductModal from '@/components/organisms/ProductModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services/api/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productService.getAll();
      
      // Ensure data is valid before setting state
      const validData = Array.isArray(data) ? data : [];
      setProducts(validData);
      setFilteredProducts(validData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      // Set empty arrays as fallback to prevent downstream errors
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (productId, updates) => {
    const product = products.find(p => p.Id === productId);
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct.Id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productService.create(productData);
        toast.success('Product added successfully!');
      }
      loadProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(productId);
        toast.success('Product deleted successfully!');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadProducts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text font-display">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog and inventory</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAddProduct} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or SKU..."
          />
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 && !loading ? (
        <Empty
          title="No products found"
          description={searchTerm ? "No products match your search criteria" : "Start by adding your first product to the catalog"}
          actionLabel="Add Product"
          onAction={handleAddProduct}
          icon="Package"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </motion.div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default Products;