import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup= async (req,res,next)=>{
    const {email,password,username}=req.body;
    const hashedPassword=  bcryptjs.hashSync(password,10);
    const newUser= new User({email,password:hashedPassword,username});
    try{
        await newUser.save();
    res.status(201).json('User created successfully');
    }catch(error){
        next(error);
    }
    
}

export const signin= async (req,res,next)=>{
    const {email,password}=req.body;
    try{
        const validUser= await User.findOne({email});
        if(!validUser) return res.status(404).json('User not found');

        const validPassword= bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return res.status(400).json('Invalid password');
        const token= jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=validUser._doc;
        res.cookie('token',token,{ httpOnly: true, secure: true, sameSite: "none" }).status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}