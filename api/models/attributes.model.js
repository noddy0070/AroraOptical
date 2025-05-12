import mongoose from 'mongoose'

const attributeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    attributeType:{
        type: String,
        required: true,
    },
    attributeValueType:{
        type: String,
        required:true
    },
    attributeValues:{
        type: [String],
        required:false,
    }
},{timestamps: true});

const Attributes = mongoose.model('Attributes', attributeSchema);

export default Attributes;
