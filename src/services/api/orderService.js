import { toast } from 'react-toastify';

class OrderService {
  constructor() {
    this.tableName = 'order';
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
          { field: { Name: "order_number" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "customer_address" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
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
      return (response.data || []).map(order => ({
        ...order,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerAddress: order.customer_address,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
        items: [] // Note: Items would need to be fetched separately from order_item table
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "order_number" } },
          { field: { Name: "customer_name" } },
          { field: { Name: "customer_address" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "status" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const order = response.data;
      return {
        ...order,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerAddress: order.customer_address,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
        items: [] // Note: Items would need to be fetched separately from order_item table
      };
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      toast.error("Failed to fetch order");
      return null;
    }
  }

  async create(orderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${String(Date.now()).slice(-4)}`;
      
      // Only include Updateable fields
      const params = {
        records: [
          {
            Name: orderNumber,
            order_number: orderNumber,
            customer_name: orderData.customerName,
            customer_address: orderData.customerAddress,
            total_amount: orderData.totalAmount,
            status: 'pending',
            created_at: new Date().toISOString()
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
          const order = successfulRecords[0].data;
          return {
            ...order,
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerAddress: order.customer_address,
            totalAmount: order.total_amount,
            createdAt: order.created_at,
            items: orderData.items || []
          };
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
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
            ...(updates.customerName && { customer_name: updates.customerName }),
            ...(updates.customerAddress && { customer_address: updates.customerAddress }),
            ...(updates.totalAmount !== undefined && { total_amount: updates.totalAmount }),
            ...(updates.status && { status: updates.status })
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
          const order = successfulUpdates[0].data;
          return {
            ...order,
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerAddress: order.customer_address,
            totalAmount: order.total_amount,
            createdAt: order.created_at
          };
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
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
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      throw error;
    }
  }
}

export const orderService = new OrderService();