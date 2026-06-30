import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';
import * as delhiveryAPI from '../utils/delhivery.js';

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

    triggerDelhiveryForOrder(order); // non-blocking

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
      .populate('products.prescriptionId', 'prescriptionName prescriptionDate prescriptionType rightEye leftEye pupillaryDistance prescriptionImage otherDetails source')
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
      .populate('products.productId', 'modelName modelCode brand price images')
      .populate('products.prescriptionId', 'prescriptionName prescriptionDate source rightEye leftEye pupillaryDistance prescriptionImage otherDetails');

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

    if (order.shippingDetails?.waybill) {
      try {
        const raw = await delhiveryAPI.trackShipment(order.shippingDetails.waybill);
        const scans = raw?.ShipmentData?.[0]?.Shipment?.Scans || [];

        // Normalise to the shape both admin and customer pages expect:
        // trackingInfo.data[0].activities — array of { activity, status, location, date, timestamp }
        const activities = scans.map(s => ({
          activity:  s.ScanDetail?.Scan || '',
          status:    s.ScanDetail?.Scan || '',
          location:  s.ScanDetail?.ScannedLocation || '',
          date:      s.ScanDetail?.ScanDateTime || '',
          timestamp: s.ScanDetail?.ScanDateTime || '',
        }));

        trackingInfo = { data: [{ activities }] };

        const latest = raw?.ShipmentData?.[0]?.Shipment?.Status;
        if (latest?.Status) {
          await Order.findByIdAndUpdate(orderId, {
            $set: {
              'shippingDetails.status':     latest.Status,
              'shippingDetails.lastUpdate': new Date(),
            },
          });
        }
      } catch (trackingError) {
        console.error('Delhivery tracking error:', trackingError.message);
      }
    }

    res.status(200).json({ success: true, order, trackingInfo });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
};

// Check delivery serviceability
export const checkServiceability = async (req, res) => {
  try {
    const { deliveryPincode, weight = 0.5, cod = 0 } = req.query;

    if (!deliveryPincode) {
      return res.status(400).json({ success: false, message: 'Delivery pincode is required' });
    }

    const result      = await delhiveryAPI.checkServiceability(deliveryPincode);
    const pincodeData = result?.delivery_codes?.[0]?.postal_code;

    if (!pincodeData) {
      return res.status(200).json({ success: true, serviceable: false, deliveryRate: 0 });
    }

    const isCOD           = Number(cod) === 1;
    const isServiceable   = pincodeData.pre_paid === 'Y' || pincodeData.cod === 'Y';
    const isCODAvailable  = pincodeData.cod === 'Y';

    if (!isServiceable || (isCOD && !isCODAvailable)) {
      return res.status(200).json({ success: true, serviceable: false, deliveryRate: 0 });
    }

    // Simple weight-based rate: ₹60 for first 0.5 kg + ₹30 per additional 0.5 kg slab + ₹25 COD surcharge
    const weightKg    = Math.max(0.5, parseFloat(weight) || 0.5);
    const slabs       = Math.ceil(weightKg / 0.5);
    const deliveryRate = 60 + (slabs - 1) * 30 + (isCOD ? 25 : 0);

    res.status(200).json({ success: true, serviceable: true, deliveryRate, serviceability: result });

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

 


    // Validate each item before building
    for (const item of products) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each product must have productId and valid quantity'
        });
      }
    }

    const mappedProducts = await buildOrderProducts(products);

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
        const enrichedItems = await attachProductSnapshots([...user.cart]);
        user.cart = [];
        user.orders.push({
          orderId: order._id,
          date: new Date(),
          items: enrichedItems,
        });
        await user.save();
      }

      reduceStockForOrder(order.products); // non-blocking
      const phonepeCustomerName = order.shippingAddress?.fullName || order.shippingAddress?.name || 'Customer';
      createOrderNotification(order, phonepeCustomerName); // non-blocking
      triggerDelhiveryForOrder(order); // non-blocking

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

// --- Notification helper (fire-and-forget) ---
const createOrderNotification = async (order, customerName) => {
  try {
    await Notification.create({
      type: 'new_order',
      message: `New order placed by ${customerName}`,
      orderId: order._id,
      customerName,
      amount: order.finalAmount,
      paymentMethod: order.paymentDetails?.method || 'COD',
    });
  } catch (err) {
    console.error('[Notification] Failed to create notification:', err.message);
  }
};

// --- Delhivery trigger (fire-and-forget; never blocks the main response) ---
const triggerDelhiveryForOrder = async (order) => {
  try {
    const populated = await Order.findById(order._id)
      .populate('products.productId', 'modelName modelCode');
    if (!populated) return;

    const delhiveryResponse = await delhiveryAPI.createShipment({
      orderId:        populated._id.toString(),
      shippingAddress: populated.shippingAddress,
      products:       populated.products,
      paymentDetails: populated.paymentDetails,
      totalPrice:     populated.totalPrice,
    });

    const waybill = delhiveryResponse.packages[0].waybill;

    await Order.findByIdAndUpdate(order._id, {
      $set: {
        'shippingDetails.carrier':         'Delhivery',
        'shippingDetails.waybill':         waybill,
        'shippingDetails.status':          delhiveryResponse.packages[0].status || 'manifested',
        'shippingDetails.manifestPending': false,
        'shippingDetails.lastUpdate':      new Date(),
      },
    });

    console.log('[Delhivery] Order manifested:', { orderId: populated._id.toString(), waybill });
  } catch (err) {
    console.error('[Delhivery] Integration error (non-fatal):', err.message);
    if (err.response?.data) {
      console.error('[Delhivery] API response:', JSON.stringify(err.response.data, null, 2));
    }

    // When the warehouse name is wrong, fetch and log the registered names so the fix is obvious
    if (err.message?.includes('ClientWarehouse')) {
      try {
        const locData = await delhiveryAPI.getPickupLocations();
        const registered = (locData?.warehouses || locData?.data || []).map(w => w.name || w.registered_name).filter(Boolean);
        console.error(
          '[Delhivery] ❌ DELHIVERY_PICKUP_LOCATION is wrong.\n' +
          `   Current value : "${process.env.DELHIVERY_PICKUP_LOCATION}"\n` +
          `   Registered names in your account: ${JSON.stringify(registered)}\n` +
          '   Fix: set DELHIVERY_PICKUP_LOCATION to one of the names above (exact case).'
        );
      } catch (locErr) {
        console.error('[Delhivery] Could not fetch warehouse list:', locErr.message);
      }
    }

    // Flag order for admin to manually re-manifest
    try {
      await Order.findByIdAndUpdate(order._id, {
        $set: {
          'shippingDetails.carrier':         'Delhivery',
          'shippingDetails.manifestPending': true,
          'shippingDetails.status':          'MANIFEST_FAILED',
          'shippingDetails.lastUpdate':      new Date(),
        },
      });
    } catch (_) { /* best-effort */ }
  }
};

// --- Build a product snapshot from a Product document ---
const makeProductSnapshot = (product) => ({
  modelTitle: product.modelTitle,
  modelName:  product.modelName,
  modelCode:  product.modelCode  || null,
  brand:      product.brand,
  category:   product.category,
  images:     product.images    || [],
  price:      product.price,
});

// --- Build order products array, embedding a snapshot of each product at purchase time ---
const buildOrderProducts = async (cartItems) => {
  const products = [];
  for (const item of cartItems) {
    const productId = item.productId?._id || item.productId || item._id;
    let productSnapshot = null;
    try {
      const product = await Product.findById(productId).lean();
      if (product) productSnapshot = makeProductSnapshot(product);
    } catch (err) {
      console.error('[Snapshot] Failed to fetch product snapshot for', productId, ':', err.message);
    }
    products.push({
      productId,
      quantity: item.quantity,
      price: item.totalAmount,
      prescriptionId: item.prescriptionId || null,
      size: item.size || null,
      productSnapshot,
      lensOptions: {
        lensType:      item.lensType      === 'None' ? null : item.lensType,
        lensCoating:   item.lensCoating   === 'None' ? null : item.lensCoating,
        lensThickness: item.lensThickness === 'None' ? null : item.lensThickness,
        lensTint:      item.lensTint      === 'None' ? null : item.lensTint,
      },
    });
  }
  return products;
};

// --- Enrich cart items with product snapshots before saving to user.orders.items ---
const attachProductSnapshots = async (cartItems) => {
  return Promise.all(
    cartItems.map(async (item) => {
      const productId = item.productId?._id || item.productId;
      const plain = item.toObject ? item.toObject() : { ...item };
      try {
        const product = await Product.findById(productId).lean();
        if (product) plain.productSnapshot = makeProductSnapshot(product);
      } catch (err) {
        console.error('[Snapshot] Failed to attach snapshot:', err.message);
      }
      return plain;
    })
  );
};

// --- Reduce per-size stock after a confirmed order (fire-and-forget) ---
const reduceStockForOrder = async (products) => {
  for (const item of products) {
    if (!item.size) continue;
    try {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const sizeIndex = product.size.indexOf(item.size);
      if (sizeIndex === -1) continue;
      const current = Number(product.stock[sizeIndex]) || 0;
      product.stock[sizeIndex] = Math.max(0, current - item.quantity);
      product.markModified('stock');
      await product.save();
    } catch (err) {
      console.error('[Stock] Failed to reduce stock for product', item.productId, ':', err.message);
    }
  }
};

const saveOrderToUser = async (userId, orderId) => {
  const user = await User.findById(userId);
  if (!user) return;
  const enrichedItems = await attachProductSnapshots([...user.cart]);
  user.cart = [];
  user.orders.push({ orderId, date: new Date(), items: enrichedItems });
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
      products: await buildOrderProducts(cartItems),
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
    reduceStockForOrder(order.products); // non-blocking

    const customerName = shippingAddress.fullName || shippingAddress.name || 'Customer';
    createOrderNotification(order, customerName); // non-blocking
    triggerDelhiveryForOrder(order); // non-blocking

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

// List Delhivery registered warehouses — helps verify DELHIVERY_PICKUP_LOCATION
export const getDelhiveryWarehouses = async (req, res) => {
  try {
    const data = await delhiveryAPI.getPickupLocations();
    const names = (data?.warehouses || data?.data || []).map(w => w.name || w.registered_name);
    res.status(200).json({ success: true, warehouses: data, names });
  } catch (error) {
    console.error('Delhivery warehouse fetch error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch Delhivery warehouses', error: error.message });
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
      products: await buildOrderProducts(cartItems),
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
    reduceStockForOrder(order.products); // non-blocking

    const mockCustomerName = shippingAddress.fullName || shippingAddress.name || 'Customer';
    createOrderNotification(order, mockCustomerName); // non-blocking

    return res.status(201).json({ success: true, message: 'Mock order created', orderId: order._id });
  } catch (error) {
    console.error('Create mock order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create mock order' });
  }
};

