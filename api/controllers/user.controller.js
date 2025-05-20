import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import mongoose from "mongoose";
export const test=(req,res)=>{;
    res.json({message:'Hello World'});
}


// Editing User Profile Function
export const update=async (req,res)=>{
    if(req.body.id!==req.params.id){
        console.log("error");
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
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    res.status(200).json({success:true,message:user});
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};