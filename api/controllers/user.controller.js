import User from "../models/user.model.js";

export const test=(req,res)=>{;
    res.json({message:'Hello World'});
}

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
