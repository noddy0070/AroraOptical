import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the user who placed the order
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', // Refers to the product ordered
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  // Shiprocket Integration Fields
  shiprocket: {
    orderId: { type: String }, // Shiprocket order ID
    shipmentId: { type: String }, // Shiprocket shipment ID
    awbCode: { type: String }, // Airway bill number
    courierName: { type: String }, // Courier company name
    courierId: { type: String }, // Courier ID
    trackingUrl: { type: String }, // Tracking URL
    pickupLocation: { type: String }, // Pickup location
    deliveryDate: { type: Date }, // Expected delivery date
    status: { type: String }, // Shiprocket status
    statusCode: { type: Number }, // Shiprocket status code
    lastUpdate: { type: Date }, // Last status update
  },
  paymentDetails: {
    method: { type: String, enum: ['COD', 'Online', 'Wallet'], default: 'COD' },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    transactionId: { type: String },
    amount: { type: Number },
  },
  deliveryCharges: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
