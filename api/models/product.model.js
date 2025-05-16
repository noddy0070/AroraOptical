import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    
    modelTitle:{
        type: String,
        required: true,
    },
    modelName:{
        type: String,
        required: true,
    },
    modelCode:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required:true
    },
    gender:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    taxRate:{
        type: Number,
        default:18
    },
    discount:{
        type:Number,
        default:0
    },
    hashtags:{
        type: String,
        required: true,
    },
    size:{
        type: Array,
        required: true,
    },
    stock:{
        type: Array,
        required: true,
    },
    images:{
        type: Array,
        required: true,
    },
    orders:{
        type: Number,
        default: 0,
    },
    wishlist:{
        type:Number,
        default:0
    },
    frameAttributes:{
        type: [ 
            {
              name: { type: String, required: true },
              value: { type: String, required: true }
            }
          ],
        default:[]
    },
    lensAttributes:{
        type: [ 
            {
              name: { type: String, required: true },
              value: { type: String, required: true }
            }
          ],
        default:[]
    },
    generalAttributes:{
        type: [ 
            {
              name: { type: String, required: true },
              value: { type: String, required: true }
            }
          ],
        default:[]
    },
     reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review', // Reference to the Review model
    },
  ],

},{timestamps: true});

const Product = mongoose.model('Products', productSchema);

export default Product;
