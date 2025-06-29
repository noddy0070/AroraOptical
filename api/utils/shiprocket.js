import axios from 'axios';

class ShiprocketAPI {
  constructor() {
    this.baseURL = 'https://apiv2.shiprocket.in/v1';
    this.token = null;
    this.tokenExpiry = null;
  }

  // Get authentication token
  async getToken() {
    try {
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      const response = await axios.post(`${this.baseURL}/external/auth/login`, {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      });

      this.token = response.data.token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.token;
    } catch (error) {
      console.error('Shiprocket authentication error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  // Get headers with authentication
  async getHeaders() {
    const token = await this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Check courier serviceability
  async checkServiceability(pickupPincode, deliveryPincode, weight = 0.5) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/external/courier/serviceability`, {
        headers,
        params: {
          pickup_postcode: pickupPincode,
          delivery_postcode: deliveryPincode,
          weight: weight,
          cod: 1
        }
      });

      return response.data;
    } catch (error) {
      console.error('Serviceability check error:', error.response?.data || error.message);
      throw new Error('Failed to check serviceability');
    }
  }

  // Create shipment
  async createShipment(orderData) {
    try {
      const headers = await this.getHeaders();
      
      // Ensure pickup location exists
      await this.createPickupLocationIfNeeded();
      
      // Verify pickup location
      const pickupLocation = await this.verifyPickupLocation(process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary');
      const pickupLocationName = pickupLocation ? pickupLocation.pickup_location : 'Primary';
      
      // Split name into first and last name
      const nameParts = orderData.shippingAddress.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const shipmentData = {
        order_id: orderData.orderId,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: pickupLocationName,
        
        // Billing Address (Required)
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: orderData.shippingAddress.address || '',
        billing_address_2: '',
        billing_city: orderData.shippingAddress.city || '',
        billing_pincode: orderData.shippingAddress.zipcode || '',
        billing_state: orderData.shippingAddress.state || '',
        billing_country: 'India',
        billing_email: orderData.shippingAddress.email || '',
        billing_phone: orderData.shippingAddress.phone || '',
        
        // Shipping Address (Same as billing for now)
        shipping_is_billing: true,
        shipping_customer_name: firstName,
        shipping_last_name: lastName,
        shipping_address: orderData.shippingAddress.address || '',
        shipping_address_2: '',
        shipping_city: orderData.shippingAddress.city || '',
        shipping_pincode: orderData.shippingAddress.zipcode || '',
        shipping_state: orderData.shippingAddress.state || '',
        shipping_country: 'India',
        shipping_email: orderData.shippingAddress.email || '',
        shipping_phone: orderData.shippingAddress.phone || '',
        
        // Order Items
        order_items: orderData.products.map(product => ({
          name: product.productId.modelName || 'Product',
          sku: product.productId.modelCode || 'SKU',
          units: product.quantity || 1,
          selling_price: product.price || 0,
          discount: 0,
          tax: 0
        })),
        
        // Payment and Charges
        payment_method: orderData.paymentDetails.method === 'COD' ? 'COD' : 'Prepaid',
        shipping_charges: orderData.deliveryCharges || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: orderData.discountAmount || 0,
        sub_total: orderData.totalPrice || 0,
        
        // Package Details
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5
      };

      // Validate required fields
      const requiredFields = [
        'billing_customer_name', 'billing_address', 'billing_city', 
        'billing_pincode', 'billing_state', 'billing_email', 'billing_phone'
      ];
      
      for (const field of requiredFields) {
        if (!shipmentData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Debug log (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Shiprocket shipment data:', JSON.stringify(shipmentData, null, 2));
      }

      const response = await axios.post(`${this.baseURL}/external/orders/create/adhoc`, shipmentData, { headers });
      return response.data;
    } catch (error) {
      console.error('Create shipment error:', error.response?.data || error.message);
      
      // More detailed error logging
      if (error.response?.data) {
        console.error('Shiprocket API Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      throw new Error(`Failed to create shipment: ${error.response?.data?.message || error.message}`);
    }
  }

  // Generate AWB
  async generateAWB(shipmentId, courierId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseURL}/external/courier/assign/awb`, {
        shipment_id: shipmentId,
        courier_id: courierId
      }, { headers });

      return response.data;
    } catch (error) {
      console.error('Generate AWB error:', error.response?.data || error.message);
      throw new Error('Failed to generate AWB');
    }
  }

  // Track shipment
  async trackShipment(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/external/courier/track/shipment/${shipmentId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Track shipment error:', error.response?.data || error.message);
      throw new Error('Failed to track shipment');
    }
  }

  // Track by AWB
  async trackByAWB(awbCode) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/external/courier/track/awb/${awbCode}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Track AWB error:', error.response?.data || error.message);
      throw new Error('Failed to track AWB');
    }
  }

  // Get courier list
  async getCourierList() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/external/courier/courierList`, { headers });
      return response.data;
    } catch (error) {
      console.error('Get courier list error:', error.response?.data || error.message);
      throw new Error('Failed to get courier list');
    }
  }

  // Cancel shipment
  async cancelShipment(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseURL}/external/orders/cancel`, {
        ids: [shipmentId]
      }, { headers });

      return response.data;
    } catch (error) {
      console.error('Cancel shipment error:', error.response?.data || error.message);
      throw new Error('Failed to cancel shipment');
    }
  }

  // Get pickup locations
  async getPickupLocations() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseURL}/external/settings/company/pickup-location`, { headers });
      return response.data;
    } catch (error) {
      console.error('Get pickup locations error:', error.response?.data || error.message);
      throw new Error('Failed to get pickup locations');
    }
  }

  // Verify pickup location exists
  async verifyPickupLocation(pickupLocationName = 'Primary') {
    try {
      const locations = await this.getPickupLocations();
      if (locations.data && locations.data.length > 0) {
        const location = locations.data.find(loc => 
          loc.pickup_location.toLowerCase() === pickupLocationName.toLowerCase()
        );
        return location || locations.data[0]; // Return first location if specified not found
      }
      return null;
    } catch (error) {
      console.error('Verify pickup location error:', error);
      return null;
    }
  }

  // Create pickup location if none exists
  async createPickupLocationIfNeeded() {
    try {
      const locations = await this.getPickupLocations();
      if (!locations.data || locations.data.length === 0) {
        // Create a default pickup location
        const headers = await this.getHeaders();
        const pickupData = {
          pickup_location: 'Primary',
          name: 'Primary Location',
          email: process.env.SHIPROCKET_EMAIL,
          phone: '9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pin_code: '400001',
          address_2: '',
          address_type: 'home'
        };

        const response = await axios.post(`${this.baseURL}/external/settings/company/addpickup-location`, pickupData, { headers });
        console.log('Created pickup location:', response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Create pickup location error:', error.response?.data || error.message);
      return null;
    }
  }
}

export default new ShiprocketAPI(); 