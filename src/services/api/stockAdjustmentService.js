import mockAdjustments from '@/services/mockData/stockAdjustments.json';

class StockAdjustmentService {
  constructor() {
    this.adjustments = [...mockAdjustments];
  }

  async getAll() {
    await this.delay(300);
    return [...this.adjustments];
  }

  async getById(id) {
    await this.delay(200);
    const adjustment = this.adjustments.find(a => a.Id === id);
    if (!adjustment) {
      throw new Error(`Stock adjustment with Id ${id} not found`);
    }
    return { ...adjustment };
  }

  async create(adjustmentData) {
    await this.delay(400);
    const newId = Math.max(...this.adjustments.map(a => a.Id), 0) + 1;
    const newAdjustment = {
      ...adjustmentData,
      Id: newId,
      timestamp: new Date().toISOString()
    };
    this.adjustments.push(newAdjustment);
    return { ...newAdjustment };
  }

  async update(id, updates) {
    await this.delay(300);
    const index = this.adjustments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error(`Stock adjustment with Id ${id} not found`);
    }
    this.adjustments[index] = {
      ...this.adjustments[index],
      ...updates
    };
    return { ...this.adjustments[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.adjustments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error(`Stock adjustment with Id ${id} not found`);
    }
    const deletedAdjustment = this.adjustments.splice(index, 1)[0];
    return { ...deletedAdjustment };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const stockAdjustmentService = new StockAdjustmentService();