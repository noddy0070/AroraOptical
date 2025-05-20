import Product from "../models/product.model.js";
import mongoose from "mongoose";
export const addProduct= async (req,res,next)=>{
    const {modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes}=req.body;
    const newProduct= new Product({modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes});
    const existingProduct = await Product.findOne({ modelCode });
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


export const updateProduct=async (req,res)=>{
    if(req.body._id!==req.params.id){
        console.log("error");
        return;
    }
    const {modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes}=req.body;
    try{

        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,
            {$set:{
               modelName,modelTitle,modelCode,brand,isSellable,category,gender,description,price,taxRate,discount,hashtags,images,size,stock,lensAttributes,frameAttributes,generalAttributes
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
