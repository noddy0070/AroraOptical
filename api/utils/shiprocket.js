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
      // Shiprocket JWTs last 24 h; cache for 23 h to avoid expiry mid-request
      this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
      
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
  async checkServiceability(pickupPincode, deliveryPincode, weight = 0.5, cod = 0, declaredValue) {
    try {
      const headers = await this.getHeaders();
      const params = {
        pickup_postcode:   pickupPincode,
        delivery_postcode: deliveryPincode,
        weight:            weight || .5 ,
        cod:               cod,           // 0 = prepaid, 1 = COD
        is_return:         0,
        shipping_dangerous_goods: 0,
        secure_shipment:   0,
        declared_value:    Math.max(1, Number(declaredValue) || 1),
      };

      const response = await axios.get(`${this.baseURL}/external/courier/serviceability`, {
        headers,
        params,
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
      
      // Fetch pickup location from Shiprocket account
      const pickupLocation = await this.verifyPickupLocation(process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary');
      if (!pickupLocation) {
        throw new Error('No pickup location found in Shiprocket. Please add one at app.shiprocket.in → Settings → Pickup Addresses.');
      }
      const pickupLocationName = pickupLocation.pickup_location;
      
      // Split fullName into first and last name
      const nameParts = (orderData.shippingAddress.fullName || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName  = nameParts.slice(1).join(' ') || '';

      // Combine flat + area for the street address line
      const streetAddress = [
        orderData.shippingAddress.flat,
        orderData.shippingAddress.area,
      ].filter(Boolean).join(', ');

      // Shiprocket requires exactly 10 digits — strip country code / spaces
      const sanitizePhone = (num) =>
        (num || '').replace(/\D/g, '').slice(-10);

      const phone = sanitizePhone(orderData.shippingAddress.mobileNumber);

      // sub_total = sum of (unit price × qty) for each line item
      // Shiprocket validates: sub_total + shipping_charges - total_discount = payable amount
      const orderItems = orderData.products.map(product => {
        const qty = Number(product.quantity) > 0 ? Number(product.quantity) : 1;
        // product.price is the line total (unitPrice × qty); Shiprocket needs per-unit price
        const unitPrice = Math.round(Number(product.price) / qty) || 0;
        return {
          name:          (product.productId?.modelName) || 'Eyewear',
          sku:           (product.productId?.modelCode) || `SKU-${product.productId?._id || product.productId}`,
          units:         qty,
          selling_price: unitPrice,
          discount:      0,
          tax:           0,
        };
      });

      const itemsSubTotal = orderItems.reduce(
        (sum, item) => sum + item.selling_price * item.units, 0
      );
      const totalQty = orderItems.reduce((sum, item) => sum + item.units, 0);

      const shipmentData = {
        order_id:        orderData.orderId,
        order_date:      new Date().toISOString().split('T')[0],
        pickup_location: pickupLocationName,

        // Billing Address
        billing_customer_name: firstName,
        billing_last_name:     lastName,
        billing_address:       streetAddress,
        billing_address_2:     '',
        billing_city:          orderData.shippingAddress.city  || '',
        billing_pincode:       orderData.shippingAddress.pincode || '',
        billing_state:         orderData.shippingAddress.state || '',
        billing_country:       'India',
        billing_email:         orderData.shippingAddress.email || '',
        billing_phone:         phone,

        // Shipping (same as billing)
        shipping_is_billing:      true,
        shipping_customer_name:   firstName,
        shipping_last_name:       lastName,
        shipping_address:         streetAddress,
        shipping_address_2:       '',
        shipping_city:            orderData.shippingAddress.city  || '',
        shipping_pincode:         orderData.shippingAddress.pincode || '',
        shipping_state:           orderData.shippingAddress.state || '',
        shipping_country:         'India',
        shipping_email:           orderData.shippingAddress.email || '',
        shipping_phone:           phone,

        // Items
        order_items: orderItems,

        // Payment & charges
        payment_method:      orderData.paymentDetails.method === 'COD' ? 'COD' : 'Prepaid',
        shipping_charges:    Number(orderData.deliveryCharges)  || 0,
        giftwrap_charges:    0,
        transaction_charges: Number(orderData.codCharges)       || 0,
        total_discount:      Number(orderData.discountAmount)   || 0,
        sub_total:           itemsSubTotal,

        // Package dimensions (standard eyewear box)
        length:  20,
        breadth: 15,
        height:  8,
        weight:  0.5 * totalQty,
      };

      // Validate required fields before hitting the API
      const requiredFields = [
        'billing_customer_name', 'billing_address', 'billing_city',
        'billing_pincode', 'billing_state', 'billing_email', 'billing_phone',
      ];
      for (const field of requiredFields) {
        if (!shipmentData[field]) {
          throw new Error(`Missing required Shiprocket field: ${field}`);
        }
      }

      console.log('[Shiprocket] Sending order payload:', JSON.stringify(shipmentData, null, 2));

      const response = await axios.post(
        `${this.baseURL}/external/orders/create/adhoc`,
        shipmentData,
        { headers }
      );

      console.log('[Shiprocket] Response:', JSON.stringify(response.data, null, 2));

      // Shiprocket returns HTTP 200 even for errors — detect by absence of order_id
      if (!response.data?.order_id) {
        throw new Error(
          `Shiprocket rejected order: ${response.data?.message || JSON.stringify(response.data)}`
        );
      }

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

  // Auto-assign courier and generate AWB (Shiprocket picks best courier based on dashboard rules)
  async assignCourier(shipmentId) {
    const headers = await this.getHeaders();
    const response = await axios.post(
      `${this.baseURL}/external/courier/assign/awb`,
      { shipment_id: shipmentId },
      { headers }
    );
    console.log('[Shiprocket] AWB response:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // Schedule pickup for an assigned shipment
  async schedulePickup(shipmentId) {
    const headers = await this.getHeaders();
    const response = await axios.post(
      `${this.baseURL}/external/orders/schedule-pickup`,
      { shipment_id: [shipmentId] },
      { headers }
    );
    console.log('[Shiprocket] Pickup schedule response:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // Generate AWB (legacy — kept for backwards compat)
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
      const response = await axios.get(`${this.baseURL}/external/settings/company/pickup`, { headers });
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
      // console.log('[Shiprocket] Raw pickup locations response:', JSON.stringify(locations, null, 2));

      // Shiprocket API returns different shapes depending on version — try all known ones
      const list =
        (Array.isArray(locations?.data?.data)              && locations.data.data)             ||
        (Array.isArray(locations?.data?.shipping_address)  && locations.data.shipping_address) ||
        (Array.isArray(locations?.data)                    && locations.data)                  ||
        (Array.isArray(locations?.shipping_address)        && locations.shipping_address)       ||
        [];

      console.log('[Shiprocket] Parsed pickup list:', list.map(l => l.pickup_location));

      if (list.length > 0) {
        const match = list.find(
          loc => loc.pickup_location.toLowerCase() === pickupLocationName.toLowerCase()
        );
        return match || list[0];
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
      const list = Array.isArray(locations?.data?.data)
        ? locations.data.data
        : Array.isArray(locations?.data)
          ? locations.data
          : [];
      if (list.length === 0) {
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

        const response = await axios.post(`${this.baseURL}/external/settings/company/addpickup`, pickupData, { headers });
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