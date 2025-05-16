import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const addProduct= async (req,res,next)=>{
    const {modelName,modelTitle,modelCode,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes}=req.body;
    const newProduct= new Product({modelName,modelTitle,modelCode,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes});
    const existingProduct = await Product.findOne({ modelName });
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
    const products= await Product.find();

    res.status(200).json({
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error fetching products' });
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
