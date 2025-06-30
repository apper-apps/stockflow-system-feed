import mockProducts from '@/services/mockData/products.json';

class ProductService {
  constructor() {
    this.products = [...mockProducts];
  }

  async getAll() {
    await this.delay(300);
    return [...this.products];
  }

  async getById(id) {
    await this.delay(200);
    const product = this.products.find(p => p.Id === id);
    if (!product) {
      throw new Error(`Product with Id ${id} not found`);
    }
    return { ...product };
  }

  async create(productData) {
    await this.delay(400);
    const newId = Math.max(...this.products.map(p => p.Id), 0) + 1;
    const newProduct = {
      ...productData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, updates) {
    await this.delay(300);
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.products[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    const deletedProduct = this.products.splice(index, 1)[0];
    return { ...deletedProduct };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const productService = new ProductService();