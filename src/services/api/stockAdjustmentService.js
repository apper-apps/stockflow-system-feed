import { toast } from 'react-toastify';

class StockAdjustmentService {
  constructor() {
    this.tableName = 'stock_adjustment';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "product_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "timestamp" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return (response.data || []).map(adjustment => ({
        ...adjustment,
        productId: adjustment.product_id?.Id || adjustment.product_id
      }));
    } catch (error) {
      console.error("Error fetching stock adjustments:", error);
      toast.error("Failed to fetch stock adjustments");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "product_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "quantity" } },
          { field: { Name: "reason" } },
          { field: { Name: "timestamp" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const adjustment = response.data;
      return {
        ...adjustment,
        productId: adjustment.product_id?.Id || adjustment.product_id
      };
    } catch (error) {
      console.error(`Error fetching stock adjustment with ID ${id}:`, error);
      toast.error("Failed to fetch stock adjustment");
      return null;
    }
  }

  async create(adjustmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: `Adjustment-${Date.now()}`,
            product_id: adjustmentData.productId,
            quantity: adjustmentData.quantity,
            reason: adjustmentData.reason,
            timestamp: new Date().toISOString()
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const adjustment = successfulRecords[0].data;
          return {
            ...adjustment,
            productId: adjustment.product_id
          };
        }
      }
    } catch (error) {
      console.error("Error creating stock adjustment:", error);
      toast.error("Failed to create stock adjustment");
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Only include Updateable fields
      const params = {
        records: [
          {
            Id: id,
            ...(updates.productId && { product_id: updates.productId }),
            ...(updates.quantity !== undefined && { quantity: updates.quantity }),
            ...(updates.reason && { reason: updates.reason }),
            ...(updates.timestamp && { timestamp: updates.timestamp })
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const adjustment = successfulUpdates[0].data;
          return {
            ...adjustment,
            productId: adjustment.product_id
          };
        }
      }
    } catch (error) {
      console.error("Error updating stock adjustment:", error);
      toast.error("Failed to update stock adjustment");
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting stock adjustment:", error);
      toast.error("Failed to delete stock adjustment");
      throw error;
    }
  }
}

export const stockAdjustmentService = new StockAdjustmentService();