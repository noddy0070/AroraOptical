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
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription', // Reference to the Prescription model
        required: false, // Optional - only required for Rx products
      },
      // Lens customization options (if applicable)
      lensOptions: {
        lensType: {
          type: String,
          enum: ['Single Vision', 'Bifocal', 'Progressive', 'Computer', 'Reading'],
          required: false,
        },
        lensCoating: {
          type: String,
          enum: ['Anti-Reflective', 'Blue Light Filter', 'Photochromic', 'None'],
          required: false,
        },
        lensThickness: {
          type: String,
          enum: ['Standard', 'Thin', 'Ultra Thin'],
          required: false,
        },
        lensTint: {
          type: String,
          enum: ['None', 'Grey', 'Brown', 'Green'],
          required: false,
        },
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

// Instance method to add product to order with prescription
orderSchema.methods.addProduct = function(productId, quantity, price, prescriptionId = null, lensOptions = {}) {
  this.products.push({
    productId,
    quantity,
    price,
    prescriptionId,
    lensOptions
  });
  
  // Recalculate total price
  this.totalPrice = this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  this.finalAmount = this.totalPrice + this.deliveryCharges + this.taxAmount - this.discountAmount;
  
  return this.save();
};

// Instance method to remove product from order
orderSchema.methods.removeProduct = function(productId, prescriptionId = null) {
  this.products = this.products.filter(product => 
    !(product.productId.toString() === productId.toString() && 
      product.prescriptionId?.toString() === prescriptionId?.toString())
  );
  
  // Recalculate total price
  this.totalPrice = this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
  this.finalAmount = this.totalPrice + this.deliveryCharges + this.taxAmount - this.discountAmount;
  
  return this.save();
};

// Instance method to get products requiring prescriptions
orderSchema.methods.getRxProducts = function() {
  return this.products.filter(product => product.prescriptionId);
};

// Instance method to check if order has Rx products
orderSchema.methods.hasRxProducts = function() {
  return this.products.some(product => product.prescriptionId);
};

// Static method to find orders with populated prescriptions
orderSchema.statics.findWithPrescriptions = function(orderId) {
  return this.findById(orderId)
    .populate('products.productId')
    .populate('products.prescriptionId')
    .populate('userId');
};

// Static method to find orders by user with prescriptions
orderSchema.statics.findByUserWithPrescriptions = function(userId) {
  return this.find({ userId })
    .populate('products.productId')
    .populate('products.prescriptionId')
    .sort({ orderDate: -1 });
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
