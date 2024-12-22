import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Twilio  from "twilio";

const client =Twilio("AC59f839ba4ecc99cbda287b33b122b391","a5588afa79c25bd9021a438ae83f52f1");



export const sendOTP=async (req,res,next)=>{
    const {number}=req.body;
    
    const formatNumber= `+91${number}`;
    console.log(formatNumber);
    try{
        client.verify.v2.services("VAbf9066da9311dd6295bf87e9fb68a8e6").verifications.create({ to: formatNumber, channel: "sms" })
    .then(() => res.json({ success: true }))
    }catch(error){
        console.error("Twilio Error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
}


export const verifyOTP=async (req,res,next)=>{
    console.log("hii")
    const {number,otp}=req.body;
    const formatNumber= `+91${number}`;
    try{
        client.verify.v2.services("VAbf9066da9311dd6295bf87e9fb68a8e6")
    .verificationChecks.create({ to: formatNumber, code: otp })
    .then((verification_check) => {
      if (verification_check.status === "approved") {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    })
    }
    catch(error){
        console.error("Twilio Error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
}

export const signup= async (req,res,next)=>{
    const {email,name,state,city,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser= new User({email,username:name,state,city,password:hashedPassword});
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
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(401,'Invalid Credentials'))
        const token= jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        console.log(token);
        const {password:pass,...rest}=validUser._doc;
        res.cookie('token',token,{ httpOnly: true, secure: true, sameSite: "none" }).status(200).json(rest);
        console.log("User logged in successfully");
    }
    catch(error){
        next(error);
    }
}