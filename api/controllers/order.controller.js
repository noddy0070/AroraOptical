import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import shiprocketAPI from '../utils/shiprocket.js';

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
    const { pickupPincode, deliveryPincode, weight = 0.5 } = req.query;

    if (!pickupPincode || !deliveryPincode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pickup and delivery pincodes are required' 
      });
    }

    const serviceability = await shiprocketAPI.checkServiceability(
      pickupPincode,
      deliveryPincode,
      weight
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