import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
     type: String,
     required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    number:{
        type: String,
        required: false,
    },

    gender:{
        type: String,
        required: false,
    },
    address:{
        type: String,
        required: false,
    },
    addressList: [
      {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        pincode: { type: String, required: true },
        flat: { type: String, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        deliveryInstruction: { type: String, required: false }
      }
    ],
    city:{
        type:String,
        required:false,
    },
    state:{
        type:String,
        required:false,
    },
    zipcode:{
        type:Number,
        required:false,
    },
    password:{
        type:String,
        required:false
    },
    googleId:{
        type:String,
        default:null
    },
    blocked:{
        type:String,
        default:false
    },
    // Cart items: Array of products with quantity and prescription
    cart: [
        {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products', // Reference to the Product model
            required: true,
        },
        quantity: {
            type: Number,
            default: 1, // Default quantity is 1
            required: true,
        },
        lensType: {
            type: String,
            required: false,
            enum: ['Zero Power', 'Single Vision', 'Bifocal'],
        },
        lensCoating:{
            type: String,
            required: false,
            enum: ['Clear-Vision', 'Blue-Filter/Green', 'Blue-Filter/Blue', 'Blue-Filter/Mixed', 'Solid-Tinted-Lens/Green', 'Solid-Tinted-Lens/Brown',
                 'Solid-Tinted-Lens/Grey','Gradient-Tinted-Lens/Brown', 'Gradient-Tinted-Lens/Green', 'Gradient-Tinted-Lens/Grey', 'Photochromatic'],
        },
        lensThickness:{
            type: String,
            required: false,
            enum: ['Thin', 'Medium', 'Thick'],
        },
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription', // Reference to the Prescription model
            required: false, // Optional - only required for Rx products
        },
        },
    ],
    
    // Wishlist items: Array of product IDs
    wishlist: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', // Reference to the Product model
        },
    ],

    role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    },
    orders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  // User's saved prescriptions
  prescriptions: [
    {
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription', // Reference to the Prescription model
      },
      isDefault: {
        type: Boolean,
        default: false, // Mark as default prescription
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},{timestamps: true});

// Instance method to add prescription to user
userSchema.methods.addPrescription = function(prescriptionId, isDefault = false) {
  // If setting as default, remove default from other prescriptions
  if (isDefault) {
    this.prescriptions.forEach(prescription => {
      prescription.isDefault = false;
    });
  }
  
  this.prescriptions.push({
    prescriptionId,
    isDefault,
    addedAt: new Date()
  });
  
  return this.save();
};

// Instance method to remove prescription from user
userSchema.methods.removePrescription = function(prescriptionId) {
  this.prescriptions = this.prescriptions.filter(
    prescription => prescription.prescriptionId.toString() !== prescriptionId.toString()
  );
  return this.save();
};

// Instance method to set default prescription
userSchema.methods.setDefaultPrescription = function(prescriptionId) {
  this.prescriptions.forEach(prescription => {
    prescription.isDefault = prescription.prescriptionId.toString() === prescriptionId.toString();
  });
  return this.save();
};

// Instance method to get default prescription
userSchema.methods.getDefaultPrescription = function() {
  return this.prescriptions.find(prescription => prescription.isDefault);
};

// Instance method to add product to cart with prescription
userSchema.methods.addToCart = function(productId, quantity = 1, prescriptionId = null) {
  const existingItem = this.cart.find(item => 
    item.productId.toString() === productId.toString() && 
    item.prescriptionId?.toString() === prescriptionId?.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      productId,
      quantity,
      prescriptionId
    });
  }
  
  return this.save();
};

// Instance method to remove product from cart
userSchema.methods.removeFromCart = function(productId, prescriptionId = null) {
  this.cart = this.cart.filter(item => 
    !(item.productId.toString() === productId.toString() && 
      item.prescriptionId?.toString() === prescriptionId?.toString())
  );
  return this.save();
};

// Instance method to update cart item quantity
userSchema.methods.updateCartQuantity = function(productId, quantity, prescriptionId = null) {
  const item = this.cart.find(item => 
    item.productId.toString() === productId.toString() && 
    item.prescriptionId?.toString() === prescriptionId?.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.removeFromCart(productId, prescriptionId);
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Static method to find user with populated prescriptions
userSchema.statics.findWithPrescriptions = function(userId) {
  return this.findById(userId)
    .populate('prescriptions.prescriptionId')
    .populate('cart.productId')
    .populate('cart.prescriptionId');
};

const User = mongoose.model('User', userSchema);

export default User;
