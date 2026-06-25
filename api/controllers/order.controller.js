import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import shiprocketAPI from '../utils/shiprocket.js';

import dotenv from 'dotenv';
import crypto from 'crypto';
import { StandardCheckoutClient, StandardCheckoutPayRequest, Env, MetaInfo } from 'pg-sdk-node';
dotenv.config();


// PhonePe Instance - Lazy initialization to handle missing env vars
let phonepeClient = null;
let activePhonepeEnv = null;

const getPhonepeEnv = () => {
  const envName = (process.env.PHONEPE_ENV || 'PRODUCTION').toUpperCase();
  return envName === 'SANDBOX' ? Env.SANDBOX : Env.PRODUCTION;
};

const buildPhonePePayRequest = (order, finalAmount, redirectUrl, shippingAddress, userId) => {
  const request = StandardCheckoutPayRequest
    .builder()
    .merchantOrderId(order._id.toString())
    .amount(finalAmount)
    .redirectUrl(redirectUrl)
    .metaInfo(
      MetaInfo.builder()
        .udf1(userId?.toString() || '')
        .udf2(shippingAddress?.mobileNumber || '')
        .udf3(shippingAddress?.email || '')
        .build()
    )
    .message(`Order ${order._id}`)
    .expireAfter(1200)
    .build();

  const mobileNumber = shippingAddress?.mobileNumber?.replace(/\D/g, '').slice(-10);
  if (mobileNumber) {
    request.prefillUserLoginDetails = { phoneNumber: mobileNumber };
  }

  return request;
};

const getPhonepeClient = () => {
  const selectedEnv = getPhonepeEnv();
  if (!phonepeClient || activePhonepeEnv !== selectedEnv) {
    try {
      // Validate required environment variables
      if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET || !process.env.PHONEPE_CLIENT_VERSION) {
        console.error('PhonePe environment variables missing:', {
          PHONEPE_CLIENT_ID: !!process.env.PHONEPE_CLIENT_ID,
          PHONEPE_CLIENT_SECRET: !!process.env.PHONEPE_CLIENT_SECRET,
          PHONEPE_CLIENT_VERSION: !!process.env.PHONEPE_CLIENT_VERSION
        });
        throw new Error('PhonePe configuration missing');
      }
      
      phonepeClient = StandardCheckoutClient.getInstance(
        process.env.PHONEPE_CLIENT_ID,
        process.env.PHONEPE_CLIENT_SECRET,
        process.env.PHONEPE_CLIENT_VERSION,
        selectedEnv
      );
      activePhonepeEnv = selectedEnv;
      console.log(`PhonePe client initialized (${selectedEnv})`);
    } catch (error) {
      console.error('Failed to initialize PhonePe client:', error);
      throw error;
    }
  }
  return phonepeClient;
};

// PhonePe health check endpoint
export const checkPhonepeHealth = async (req, res) => {
  try {
    const client = getPhonepeClient();
    res.status(200).json({
      success: true,
      message: 'PhonePe service is available',
      environment: getPhonepeEnv()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'PhonePe service unavailable',
      error: error.message,
      missingEnvVars: {
        PHONEPE_CLIENT_ID: !process.env.PHONEPE_CLIENT_ID,
        PHONEPE_CLIENT_SECRET: !process.env.PHONEPE_CLIENT_SECRET,
        PHONEPE_CLIENT_VERSION: !process.env.PHONEPE_CLIENT_VERSION,
        PHONEPE_REDIRECT_URL: !process.env.PHONEPE_REDIRECT_URL
      }
    });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentDetails,
      deliveryCharges = 0,
      notes
    } = req.body;

    const userId = req.user.id;

    // Calculate totals
    let totalPrice = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    // Validate and calculate totals for each product
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;
      
      // Calculate tax
      const itemTax = (itemTotal * product.taxRate) / 100;
      taxAmount += itemTax;
      
      // Calculate discount
      const itemDiscount = (itemTotal * product.discount) / 100;
      discountAmount += itemDiscount;
    }

    const finalAmount = totalPrice + taxAmount + deliveryCharges - discountAmount;

    // Create order
    const order = new Order({
      userId,
      products,
      totalPrice,
      taxAmount,
      discountAmount,
      deliveryCharges,
      finalAmount,
      shippingAddress,
      paymentDetails,
      notes
    });

    await order.save();

    // Create Shiprocket shipment
    try {
      const shipmentData = {
        orderId: order._id.toString(),
        shippingAddress,
        products: await Promise.all(products.map(async (item) => {
          const product = await Product.findById(item.productId);
          return {
            productId: product,
            quantity: item.quantity,
            price: product.price
          };
        })),
        totalPrice,
        deliveryCharges,
        discountAmount,
        paymentDetails
      };

      const shiprocketResponse = await shiprocketAPI.createShipment(shipmentData);
      
      // Update order with Shiprocket details
      order.shiprocket.orderId = shiprocketResponse.order_id;
      order.shiprocket.shipmentId = shiprocketResponse.shipment_id;
      order.shiprocket.status = shiprocketResponse.status;
      order.shiprocket.statusCode = shiprocketResponse.status_code;
      order.shiprocket.lastUpdate = new Date();
      
      await order.save();

    } catch (shiprocketError) {
      console.error('Shiprocket integration error:', shiprocketError);
      // Continue with order creation even if Shiprocket fails
    }

    // Update user's orders
    await User.findByIdAndUpdate(userId, {
      $push: {
        orders: {
          orderId: order._id,
          date: new Date()
        }
      }
    });

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cart: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};


// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('products.productId', 'modelName modelCode brand price images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .populate('products.productId', 'modelName modelCode brand price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email')
      .populate('products.productId', 'modelName modelCode brand price images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.userId._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (notes) order.notes = notes;

    // If status is being updated to Shipped, generate AWB
    if (status === 'Shipped' && order.shiprocket.shipmentId && !order.shiprocket.awbCode) {
      try {
        const awbResponse = await shiprocketAPI.generateAWB(
          order.shiprocket.shipmentId,
          order.shiprocket.courierId || '1' // Default courier ID
        );
        
        order.shiprocket.awbCode = awbResponse.awb_code;
        order.shiprocket.courierName = awbResponse.courier_name;
        order.shiprocket.trackingUrl = awbResponse.tracking_url;
        order.shiprocket.lastUpdate = new Date();
      } catch (awbError) {
        console.error('AWB generation error:', awbError);
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// Track order
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    let trackingInfo = null;

    // Track via Shiprocket if available
    if (order.shiprocket.shipmentId) {
      try {
        trackingInfo = await shiprocketAPI.trackShipment(order.shiprocket.shipmentId);
        
        // Update order with latest tracking info
        if (trackingInfo.data && trackingInfo.data.length > 0) {
          const latestUpdate = trackingInfo.data[0];
          order.shiprocket.status = latestUpdate.status;
          order.shiprocket.statusCode = latestUpdate.status_code;
          order.shiprocket.lastUpdate = new Date();
          await order.save();
        }
      } catch (trackingError) {
        console.error('Tracking error:', trackingError);
      }
    }

    res.status(200).json({
      success: true,
      order,
      trackingInfo
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
};

// Check delivery serviceability
export const checkServiceability = async (req, res) => {
  try {
    const {
      pickupPincode,
      deliveryPincode,
      weight = 0.5,
      cod = 0,
      declaredValue,
    } = req.query;

    if (!pickupPincode || !deliveryPincode) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and delivery pincodes are required'
      });
    }

    const serviceability = await shiprocketAPI.checkServiceability(
      pickupPincode,
      deliveryPincode,
      weight,
      Number(cod),
      declaredValue ? Number(declaredValue) : undefined
    );

    res.status(200).json({
      success: true,
      serviceability
    });

  } catch (error) {
    console.error('Serviceability check error:', error);
    res.status(500).json({ success: false, message: 'Failed to check serviceability' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Cancel Shiprocket shipment if exists
    if (order.shiprocket.shipmentId) {
      try {
        await shiprocketAPI.cancelShipment(order.shiprocket.shipmentId);
      } catch (cancelError) {
        console.error('Shiprocket cancellation error:', cancelError);
      }
    }

    order.status = 'Cancelled';
    if (reason) order.notes = reason;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

// Get courier list
export const getCourierList = async (req, res) => {
  try {
    const couriers = await shiprocketAPI.getCourierList();
    
    res.status(200).json({
      success: true,
      couriers
    });

  } catch (error) {
    console.error('Get courier list error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courier list' });
  }
};

// Get pickup locations
export const getPickupLocations = async (req, res) => {
  try {
    const locations = await shiprocketAPI.getPickupLocations();
    
    res.status(200).json({
      success: true,
      locations
    });

  } catch (error) {
    console.error('Get pickup locations error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pickup locations' });
  }
};




export const createPhonepeOrder = async (req, res) => {
  try {
    const {
      cartItems,
      shippingAddress,
      totalAmount,
      deliveryCharges,
      notes,
      userId,
    } = req.body;
    const products = cartItems;
    // Validate required fields
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Products array is required and must not be empty' 
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shipping address is required' 
      });
    }

 


    const mappedProducts = [];

    for (const item of products) {
      // Validate item structure
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Each product must have productId and valid quantity' 
        });
      }
      // Map product to order model format
      const mappedProduct = {
        productId: item.productId?._id || item.productId || item._id,
        quantity: item.quantity,
        price: item.totalAmount,
        prescriptionId: item.prescriptionId || null,
        lensOptions: {
          lensType: item.lensType=="None"? null : item.lensType,
          lensCoating: item.lensCoating=="None"? null : item.lensCoating,
          lensThickness: item.lensThickness=="None"? null : item.lensThickness,
          lensTint:item.lensTint=="None"? null : item.lensTint
        }
      };

      mappedProducts.push(mappedProduct);
    }

    const finalAmountPaise = Math.round(Number(totalAmount));
    if (!Number.isFinite(finalAmountPaise) || finalAmountPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount. Minimum order value is ₹1.'
      });
    }
    // Store monetary values in rupees; PhonePe SDK expects paise
    const finalAmountRupees = Math.round(finalAmountPaise / 100);

    // Create order in database first
    const order = new Order({
      userId,
      products: mappedProducts,
      totalPrice: finalAmountRupees,
      finalAmount: finalAmountRupees,
      deliveryCharges: Number(deliveryCharges) || 0,
      shippingAddress,
      paymentDetails: {
        method: 'PhonePe',
        status: 'Pending',
        amount: finalAmountRupees
      },
      notes,
      status: 'Pending'
    });
    
    await order.save();

    const redirectBase = process.env.PHONEPE_REDIRECT_URL;
    if (!redirectBase) {
      return res.status(500).json({
        success: false,
        message: 'PHONEPE_REDIRECT_URL is not configured',
      });
    }

    if (getPhonepeEnv() === Env.PRODUCTION && redirectBase.startsWith('http://')) {
      return res.status(400).json({
        success: false,
        message: 'Production PhonePe requires a public HTTPS redirect URL. Set PHONEPE_REDIRECT_URL to your deployed backend, e.g. https://your-api.com/api/order/status',
      });
    }

    const redirectUrl = `${redirectBase}?merchantOrderId=${order._id}`;
    const request = buildPhonePePayRequest(order, finalAmountPaise, redirectUrl, shippingAddress, userId);

    // Get PhonePe client with error handling
    let client;
    try {
      client = getPhonepeClient();
    } catch (error) {
      console.error('PhonePe client initialization failed:', error);
      return res.status(500).json({
        success: false,
        message: 'PhonePe service unavailable. Please try again later.',
        error: error.message
      });
    }

    const response = await client.pay(request);
    order.paymentDetails.transactionId = response.orderId;
    await order.save();

    console.log('PhonePe checkout created', {
      merchantOrderId: order._id.toString(),
      phonePeOrderId: response.orderId,
      amountPaise: finalAmountPaise,
      redirectUrl,
    });

    return res.json({
      checkoutPageUrl: response.redirectUrl
    });
    
  } catch (error) {
    console.error('Create PhonePe order error:', error);

    if (error?.type === 'UnauthorizedAccess' || error?.httpStatusCode === 401) {
      return res.status(401).json({
        success: false,
        message: 'PhonePe authentication failed. Check PHONEPE_CLIENT_ID, PHONEPE_CLIENT_SECRET, PHONEPE_CLIENT_VERSION, and PHONEPE_ENV (use PRODUCTION for live credentials, SANDBOX for test credentials).',
        environment: getPhonepeEnv(),
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create PhonePe order',
      error: error.message 
    });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const {merchantOrderId} = req.query;
    
    if(!merchantOrderId){
      return res.status(400).json({ 
        success: false, 
        message: 'Merchant order ID is required' 
      });
    }
    const order = await Order.findById(merchantOrderId);
    if(!order){
      return res.status(400).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Get PhonePe client with error handling
    let client;
    try {
      client = getPhonepeClient();
    } catch (error) {
      console.error('PhonePe client initialization failed:', error);
      return res.status(500).json({
        success: false,
        message: 'PhonePe service unavailable. Please try again later.',
        error: error.message
      });
    }

    const response = await client.getOrderStatus(merchantOrderId);

    const status = response.state;
    if(status === 'COMPLETED'){
      // Update order status
      order.status = 'Confirmed';
      order.paymentDetails.status = 'Completed';
      await order.save();

      // Find the user and update their cart and orders
      const user = await User.findById(order.userId);
      if (user) {
        const cartItems = [...user.cart];
        user.cart = [];
        user.orders.push({
          orderId: order._id,
          date: new Date(),
          items: cartItems,
        });
        await user.save();
      }

      triggerShiprocketForOrder(order); // non-blocking

      return res.redirect(process.env.PHONEPE_FRONTEND_URL + '/thank-you')
    }else{
      // Update order status for failed payment
      order.status = 'Failed';
      order.paymentDetails.status = 'Failed';
      await order.save();
      
      return res.redirect(process.env.PHONEPE_FRONTEND_URL + '/failed')
    }

  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check order status',
      error: error.message
    });
  }
};

// --- Shiprocket trigger (fire-and-forget; never blocks the main response) ---
const triggerShiprocketForOrder = async (order) => {
  try {
    const populated = await Order.findById(order._id)
      .populate('products.productId', 'modelName modelCode');
    if (!populated) return;

    // Step 1: Create order in Shiprocket
    const shiprocketResponse = await shiprocketAPI.createShipment({
      orderId: populated._id.toString(),
      shippingAddress: populated.shippingAddress,
      products: populated.products,
      paymentDetails: populated.paymentDetails,
      deliveryCharges: populated.deliveryCharges || 0,
      codCharges: populated.codCharges || 0,
      discountAmount: populated.discountAmount || 0,
      totalPrice: populated.totalPrice,
    });

    const shipmentId = shiprocketResponse.shipment_id;

    const updateData = {
      'shiprocket.orderId':    shiprocketResponse.order_id?.toString() || '',
      'shiprocket.shipmentId': shipmentId?.toString() || '',
      'shiprocket.status':     shiprocketResponse.status || 'NEW',
      'shiprocket.lastUpdate': new Date(),
    };

    // Step 2: Auto-assign courier and generate AWB
    try {
      const awbResponse = await shiprocketAPI.assignCourier(shipmentId);
      // Shiprocket nests the AWB data under response.data
      const awbData = awbResponse?.response?.data || awbResponse;
      if (awbData?.awb_code) {
        updateData['shiprocket.awbCode']     = awbData.awb_code;
        updateData['shiprocket.courierName'] = awbData.courier_name || '';
        updateData['shiprocket.courierId']   = awbData.courier_company_id?.toString() || '';
        updateData['shiprocket.status']      = 'AWB_ASSIGNED';
        console.log('[Shiprocket] AWB assigned:', awbData.awb_code, '| Courier:', awbData.courier_name);

        // Step 3: Schedule pickup
        try {
          await shiprocketAPI.schedulePickup(shipmentId);
          updateData['shiprocket.status'] = 'PICKUP_SCHEDULED';
          console.log('[Shiprocket] Pickup scheduled for shipment:', shipmentId);
        } catch (pickupErr) {
          console.warn('[Shiprocket] Pickup scheduling failed (non-fatal):', pickupErr.message);
        }
      } else {
        console.warn('[Shiprocket] AWB not assigned — no courier available for this pincode.');
      }
    } catch (awbErr) {
      console.warn('[Shiprocket] AWB assignment failed (non-fatal):', awbErr.message);
    }

    await Order.findByIdAndUpdate(order._id, { $set: updateData });

    console.log('[Shiprocket] Processing complete:', {
      orderId:    updateData['shiprocket.orderId'],
      shipmentId: updateData['shiprocket.shipmentId'],
      awbCode:    updateData['shiprocket.awbCode'],
      courier:    updateData['shiprocket.courierName'],
      status:     updateData['shiprocket.status'],
    });
  } catch (err) {
    console.error('[Shiprocket] Integration error (non-fatal):', err.message);
    if (err.response?.data) {
      console.error('[Shiprocket] API response body:', JSON.stringify(err.response.data, null, 2));
    }
  }
};

// --- Shared helper to build a cart snapshot from cart items ---
const mapCartToProducts = (cartItems) =>
  cartItems.map((item) => ({
    productId: item.productId?._id || item.productId,
    quantity: item.quantity,
    price: item.totalAmount,
    prescriptionId: item.prescriptionId || null,
    lensOptions: {
      lensType:      item.lensType      === 'None' ? null : item.lensType,
      lensCoating:   item.lensCoating   === 'None' ? null : item.lensCoating,
      lensThickness: item.lensThickness === 'None' ? null : item.lensThickness,
      lensTint:      item.lensTint      === 'None' ? null : item.lensTint,
    },
  }));

const saveOrderToUser = async (userId, orderId) => {
  const user = await User.findById(userId);
  if (!user) return;
  const cartSnapshot = [...user.cart];
  user.cart = [];
  user.orders.push({ orderId, date: new Date(), items: cartSnapshot });
  await user.save();
};

// Cash on Delivery order
export const createCODOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, totalAmount, deliveryCharges, codCharges, userId, notes } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const finalAmountRupees = Math.round(Number(totalAmount));
    if (!Number.isFinite(finalAmountRupees) || finalAmountRupees < 1) {
      return res.status(400).json({ success: false, message: 'Invalid order amount' });
    }

    const order = new Order({
      userId,
      products: mapCartToProducts(cartItems),
      totalPrice: finalAmountRupees,
      finalAmount: finalAmountRupees,
      deliveryCharges: Number(deliveryCharges) || 0,
      codCharges: Number(codCharges) || 0,
      shippingAddress,
      paymentDetails: {
        method: 'COD',
        status: 'Pending',
        amount: finalAmountRupees,
      },
      notes,
      status: 'Confirmed',
    });

    await order.save();
    await saveOrderToUser(userId, order._id);

    triggerShiprocketForOrder(order); // non-blocking

    return res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error('Create COD order error:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Remove the order reference from the user's orders array
    await User.findByIdAndUpdate(order.userId, {
      $pull: { orders: { orderId: order._id } },
    });
    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// Mock payment — dev/staging only; simulates an instant confirmed payment
export const createMockOrder = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  try {
    const { cartItems, shippingAddress, totalAmount, userId, notes } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // totalAmount arrives in paise (same payload as the PhonePe flow) so convert
    const finalAmountPaise = Math.round(Number(totalAmount));
    const finalAmountRupees = Math.round(finalAmountPaise / 100);

    const order = new Order({
      userId,
      products: mapCartToProducts(cartItems),
      totalPrice: finalAmountRupees,
      finalAmount: finalAmountRupees,
      shippingAddress,
      paymentDetails: {
        method: 'PhonePe',
        status: 'Completed',
        transactionId: `MOCK_${userId}_${Date.now()}`,
        amount: finalAmountRupees,
      },
      notes,
      status: 'Confirmed',
    });

    await order.save();
    await saveOrderToUser(userId, order._id);

    return res.status(201).json({ success: true, message: 'Mock order created', orderId: order._id });
  } catch (error) {
    console.error('Create mock order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create mock order' });
  }
};

