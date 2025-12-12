import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const addProduct= async (req,res,next)=>{
    const {modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx}=req.body;
    const newProduct= new Product({modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx});
    const existingProduct = await Product.findOne({ modelTitle });
    if (existingProduct) {
        return res.status(400).json({ message: 'Product already exists' });
    }
    try{
        await newProduct.save();
        res.status(201).json('Product created successfully');
    }catch(error){
        next(error);
    }
}

export const getProducts = async (req, res, next) => {
  try {
    const { category, gender, newArrivals, bestsellers, accessories } = req.query;
    let query = {};
    console.log('category',category);
    // Add filters if they exist
    if (category) {
      if(category==='accessories'){
        query.category = 'Accessories';
      } else if(category==='glasses'){
        query.category = { $in: ['Sunglasses', 'Eyeglasses'] };
      }
      else{
        query.category = category[0].toUpperCase() + category.slice(1);
      }
    }
    if (gender) {
      // Map the URL parameter to the actual gender value
      const genderMap = {
        'women': 'Women',
        'men': 'Men',
        'kids': 'Kids'
      };
      
      // Include both specific gender and Unisex products for all gender selections
      query.gender = { $in: [genderMap[gender.toLowerCase()], 'Unisex'] };
    }

    // Check if new arrivals filter is requested
    if (newArrivals === 'true') {
      // Case-insensitive regex pattern for various "new arrival" hashtag formats
      query.hashtags = {
        $regex: /new\s*arrival|new\s*arrivals/i
      };
    }
    
    let products;
    if (bestsellers === 'true') {
      // Get products sorted by orders (highest to lowest) and limit to top sellers
      products = await Product.find(query).sort({ orders: -1 }).limit(20);
    } else {
      products = await Product.find(query);
    }
    
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

export const getAccessories = async (req, res, next) => {
  try {
    const products = await Product.find({ category: 'Accessories' });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
};

export const getProductsColor = async (req, res, next) => {

  const {modelName}=req.body;
  try {
    const products= await Product.find({modelName});
    res.status(200).json({
      success:true,message:products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};


export const getSingleProduct = async (req, res, next) => {
  const { attributeId } = req.params;  
  if (!mongoose.Types.ObjectId.isValid(attributeId)) { 
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(attributeId );
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};


export const updateProduct=async (req,res)=>{
    if(req.body._id!==req.params.id){
        console.log("error");
        return;
    }
    const {modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx}=req.body;
    try{

        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,
            {$set:{
               modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes,rx
            }},{new:true}
        )
        res.status(200).json({success:true,message:updatedProduct});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const testProducts = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const sampleProducts = await Product.find().limit(5);
    
    res.status(200).json({
      success: true,
      totalProducts,
      sampleProducts: sampleProducts.map(p => ({
        id: p._id,
        modelTitle: p.modelTitle,
        modelName: p.modelName,
        brand: p.brand,
        isSellable: p.isSellable,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Test products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching test products',
      error: error.message
    });
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;
    
    console.log('Search request received:', { q, limit });
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    const searchTerm = q.trim();
    console.log('Searching for:', searchTerm);
    
    // First, let's check if there are any products at all
    const totalProducts = await Product.countDocuments();
    console.log('Total products in database:', totalProducts);
    
    // Get a sample product to check the structure
    const sampleProduct = await Product.findOne();
    console.log('Sample product structure:', sampleProduct ? Object.keys(sampleProduct.toObject()) : 'No products found');
    
    // Create search query for multiple fields
    const searchQuery = {
      $or: [
        // Text search in basic fields
        { modelTitle: { $regex: searchTerm, $options: 'i' } },
        { modelName: { $regex: searchTerm, $options: 'i' } },
        { modelCode: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { hashtags: { $regex: searchTerm, $options: 'i' } },
        
        // Search in frame attributes
        { 
          frameAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        },
        
        // Search in lens attributes
        { 
          lensAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        },
        
        // Search in general attributes
        { 
          generalAttributes: { 
            $elemMatch: { 
              $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { value: { $regex: searchTerm, $options: 'i' } }
              ]
            } 
          } 
        }
      ]
    };

    // Try search without isSellable filter first
    let products = await Product.find(searchQuery)
      .limit(parseInt(limit))
      .sort({ orders: -1, createdAt: -1 });

    console.log('Products found without isSellable filter:', products.length);

    // If no results, try with isSellable filter
    if (products.length === 0) {
      searchQuery.isSellable = { $in: ['true', 'True', 'TRUE', true] };
      products = await Product.find(searchQuery)
        .limit(parseInt(limit))
        .sort({ orders: -1, createdAt: -1 });
      console.log('Products found with isSellable filter:', products.length);
    }

    // If still no results, try without any filters
    if (products.length === 0) {
      const simpleQuery = {
        $or: [
          { modelTitle: { $regex: searchTerm, $options: 'i' } },
          { modelName: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } }
        ]
      };
      products = await Product.find(simpleQuery)
        .limit(parseInt(limit))
        .sort({ orders: -1, createdAt: -1 });
      console.log('Products found with simple query:', products.length);
    }

    res.status(200).json({
      success: true,
      products,
      total: products.length,
      searchTerm,
      debug: {
        totalProductsInDB: totalProducts,
        searchQuery: searchQuery
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during search',
      error: error.message
    });
  }
};