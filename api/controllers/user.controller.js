import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import mongoose from "mongoose";
export const test=(req,res)=>{;
    res.json({message:'Hello World'});
}


// Editing User Profile Function
export const update=async (req,res)=>{
    if(req.body.id!==req.params.id){
        return;}

    try{
        const updateUser=await User.findByIdAndUpdate(req.params.id,
            {$set:{
                name:req.body.name,
                gender:req.body.gender,
                number:req.body.number,
                city:req.body.city,
                state:req.body.state,
                address:req.body.address,
                zipcode:req.body.zipcode,
            }},{new:true}
        )
        res.status(200).json({success:true,message:updateUser});
    }catch(error){
        console.log(error.message);
    }
}


// Fetching All User
export const getUsers = async (req, res, next) => {
  try {
    const users= await User.find();

    res.status(200).json({
      users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching prousersducts' });
  }
};


export const addUser= async (req,res,next)=>{
    const {email,name,state,city,password,role,gender,address,zipcode,number}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser= new User({email,name,state,city,password:hashedPassword,role,gender,address,zipcode,number});
    try{
        await newUser.save();
    res.status(201).json('User created successfully');
    }catch(error){
        next(error);
    }
    
}

export const getUser = async (req, res, next) => {
  const { id } = req.params;  
  if (!mongoose.Types.ObjectId.isValid(id)) { 
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const user = await User.findById(id);
    res.status(200).json({success:true,message:user});
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// Cart Controllers
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product already exists in cart
    const existingCartItem = user.cart.find(item => 
      item.productId.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity if product exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();
    res.status(200).json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product from cart' });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItem = user.cart.find(item => 
      item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();
    res.status(200).json({ success: true, message: 'Cart quantity updated successfully' });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart quantity' });
  }
};

// Wishlist Controllers
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product already exists in wishlist
    const existingItem = user.wishlist.find(item => 
      item.toString() === productId
    );

    if (!existingItem) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to add product to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => 
      item.toString() !== productId
    );

    await user.save();
    res.status(200).json({ success: true, message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove product from wishlist' });
  }
};

// Get cart items with product details
export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ success: false, message: 'Failed to get cart items' });
  }
};

// Get wishlist items with product details
export const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist items error:', error);
    res.status(500).json({ success: false, message: 'Failed to get wishlist items' });
  }
};

// Toggle user's blocked status
export const toggleBlockUser = async (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the blocked status
    user.blocked = user.blocked === "true" ? "false" : "true";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.blocked === "true" ? "blocked" : "unblocked"} successfully`,
      blocked: user.blocked
    });
  } catch (err) {
    console.error('Error toggling user block status:', err);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};