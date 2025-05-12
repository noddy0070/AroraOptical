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
    date_of_birth: {
        type: Date,
        required: false, // You can set this to false if DOB is optional
    },
    gender:{
        type: String,
        required: false,
    },
    address:{
        type: String,
        required: false,
    },
    city:{
        type:String,
        required:false,
    },
    state:{
        type:String,
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
    // Cart items: Array of products with quantity
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
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
