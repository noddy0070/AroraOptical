
import Policy from "../models/policy.model.js";
import mongoose from "mongoose";

// Editing User Profile Function
export const updatePolicy=async (req,res)=>{
    try{
        const updatePolicy=await Policy.findByIdAndUpdate(req.params.id,
            {$set:{
                introduction:req.body.introduction,
                descriptions:req.body.descriptions,
                headings:req.body.headings,
                email:req.body.email,
                number:req.body.number,
            }},{new:true}
        )
        res.status(200).json({success:true,message:updatePolicy});
    }catch(error){
        console.log(error.message);
    }
}



export const getPolicy = async (req, res, next) => {
  const { id } = req.params;  
  if (!mongoose.Types.ObjectId.isValid(id)) { 
    return res.status(400).json({ message: "Invalid Policy ID" });
  }
  try {
    console.log(id);
    const policy = await Policy.findById(id);
    console.log(policy);
    res.status(200).json({success:true,message:policy});
  } catch (err) {
    console.error('Error fetching Policy:', err);
    res.status(500).json({ message: 'Server error fetching Policy' });
  }
};

export const addPolicy= async (req,res,next)=>{
    const {introduction,headings, descriptions,email,number}=req.body;

    const newCancellationPolciy= new Policy({name:"PrivacyPolicy", introduction,headings,descriptions,email,number});
    try{
        await newCancellationPolciy.save();
        res.status(201).json('Policy Saved Successfully');
    }catch(error){
        next(error);
    }
}