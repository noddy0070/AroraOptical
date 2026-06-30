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
      size: {
        type: String,
        required: false,
      },
      productSnapshot: {
        modelTitle:  { type: String },
        modelName:   { type: String },
        modelCode:   { type: String },
        brand:       { type: String },
        category:    { type: String },
        images:      [{ type: String }],
        price:       { type: Number },
      },
      // Lens customization options (if applicable)
      lensOptions: {
        lensType: { type: String, required: false },
        lensCoating: { type: String, required: false },
        lensThickness: { type: String, required: false },
        lensTint: { type: String, required: false },
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Failed'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    area: { type: String, required: true },
    flat: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  paymentDetails: {
    method: { type: String, enum: ['COD', 'Online', 'PhonePe'], default: 'COD' },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    transactionId: { type: String },
    amount: { type: Number },
  },
  deliveryCharges: {
    type: Number,
    default: 0,
  },
  codCharges: {
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
  shippingDetails: {
    carrier:          { type: String, default: 'Delhivery' },
    waybill:          { type: String },        // Delhivery LR / tracking number
    status:           { type: String },        // Latest status synced from Delhivery
    pickupScheduled:  { type: Boolean, default: false },
    manifestPending:  { type: Boolean, default: false }, // true when API call failed — needs manual re-run
    lastUpdate:       { type: Date },
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
