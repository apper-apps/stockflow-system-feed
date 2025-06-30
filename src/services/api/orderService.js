import mockOrders from '@/services/mockData/orders.json';

class OrderService {
  constructor() {
    this.orders = [...mockOrders];
  }

  async getAll() {
    await this.delay(300);
    return [...this.orders];
  }

  async getById(id) {
    await this.delay(200);
    const order = this.orders.find(o => o.Id === id);
    if (!order) {
      throw new Error(`Order with Id ${id} not found`);
    }
    return { ...order };
  }

  async create(orderData) {
    await this.delay(400);
    const newId = Math.max(...this.orders.map(o => o.Id), 0) + 1;
    const orderNumber = `ORD-${String(newId).padStart(4, '0')}`;
    const newOrder = {
      ...orderData,
      Id: newId,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return { ...newOrder };
  }

  async update(id, updates) {
    await this.delay(300);
    const index = this.orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with Id ${id} not found`);
    }
    this.orders[index] = {
      ...this.orders[index],
      ...updates
    };
    return { ...this.orders[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with Id ${id} not found`);
    }
    const deletedOrder = this.orders.splice(index, 1)[0];
    return { ...deletedOrder };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const orderService = new OrderService();