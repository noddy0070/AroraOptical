import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import mongoose from "mongoose";
import Prescription from "../models/prescription.model.js";
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
    const { userId, productId, quantity = 1, lensType='None', lensCoating='None', lensThickness='None', prescriptionId, totalAmount} = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(totalAmount);

    // Check if product already exists in cart
    const existingCartItem = user.cart.find(item => 
      item.productId.toString() === productId
    );

    if (existingCartItem && existingCartItem.lensType==lensType && existingCartItem.lensCoating==lensCoating && existingCartItem.lensThickness==lensThickness) {
      // Update quantity if product exists
      existingCartItem.quantity += quantity;
    } else {
      // Add new product to cart
      console.log(totalAmount);
      console.log(lensThickness);
      console.log('here we are');
      if(prescriptionId){
        user.cart.push({ productId, quantity, lensType, lensCoating, lensThickness, prescriptionId, totalAmount });
      }else{
        user.cart.push({ productId, quantity, lensType, lensCoating, lensThickness, totalAmount });
      }
    }
    console.log(user.cart);
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

// Add address to user's addressList
export const addAddressToList = async (req, res) => {
  try {
    const userId = req.params.id;
    const address = req.body.address;
    console.log(userId, address);
    if (!userId || !address) {
      return res.status(400).json({ success: false, message: 'User ID and address are required.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    user.addressList.push(address);
    await user.save();
    res.status(200).json({ success: true, addressList: user.addressList });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Failed to add address.' });
  }
};

export const removeAddressFromList = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressIndex = req.body.index;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (addressIndex < 0 || addressIndex >= user.addressList.length) {
      return res.status(400).json({ success: false, message: 'Invalid address index.' });
    }
    user.addressList.splice(addressIndex, 1);
    await user.save();
    res.status(200).json({ success: true, addressList: user.addressList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove address.' });
  }
};

export const editAddressInList = async (req, res) => {
  try {
    const userId = req.params.id;
    const addressIndex = req.body.index;
    const newAddress = req.body.address;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (addressIndex < 0 || addressIndex >= user.addressList.length) {
      return res.status(400).json({ success: false, message: 'Invalid address index.' });
    }
    user.addressList[addressIndex] = newAddress;
    await user.save();
    res.status(200).json({ success: true, addressList: user.addressList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to edit address.' });
  }
};

export const addPrescription = async (req, res) => {
  try {
    const prescriptionForm = req.body;
    const prescriptionData = {
      userId: req.body.userId,
      prescriptionName: prescriptionForm.prescriptionName,
      prescriptionDate: prescriptionForm.prescriptionDate,
      rightEye: {
        sphere: prescriptionForm.prescriptionRightSphere,
        cylinder: prescriptionForm.prescriptionRightCylinder,
        axis: prescriptionForm.prescriptionRightAxis,
        add: prescriptionForm.prescriptionRightNear,
      },
      leftEye: {
        sphere: prescriptionForm.prescriptionLeftSphere,
        cylinder: prescriptionForm.prescriptionLeftCylinder,
        axis: prescriptionForm.prescriptionLeftAxis,
        add: prescriptionForm.prescriptionLeftNear,
      },
      pupillaryDistance: {
        main: prescriptionForm.prescriptionPupilsDistance,
        left: prescriptionForm.prescriptionLeftPupilsDistance,
        right: prescriptionForm.prescriptionRightPupilsDistance,
      },
      otherDetails: prescriptionForm.prescriptionOtherDetails,
      termsAccepted: true,
      source: 'Manual Entry',
    };
    const newPrescription = new Prescription(prescriptionData);
    await newPrescription.save();
    const user = await User.findById(prescriptionData.userId);
    user.prescriptions.push(newPrescription._id);
    await user.save();
    res.status(200).json({ success: true, message: 'Prescription added successfully' });
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ success: false, message: 'Failed to add prescription' });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const prescriptions = await Prescription.find({userId: userId});
    res.status(200).json({ success: true, prescriptions: prescriptions });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ success: false, message: 'Failed to get prescriptions' });
  }
};