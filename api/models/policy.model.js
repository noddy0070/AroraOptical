import mongoose from 'mongoose'

const policySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    introduction:{
        type: String,
        required: true,
    },
    headings:{
        type: [String],
        required:true
    },
    descriptions:{
        type: [String],
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    number:{
        type:String,
        required:false
    }
},{timestamps: true});

const Policy = mongoose.model('Policies', policySchema);

export default Policy;
