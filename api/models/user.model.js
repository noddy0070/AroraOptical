import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
     type: String,
     required: true,
     unique: true,   
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    number:{
        type: String,
        required: false,
    },
    surname:{
        type: String,
        required: false,
    },
    date_of_birth: {
        type: Date,
        required: false, // You can set this to false if DOB is optional
    },
    gender:{
        type: String,
        required: false,
    },
    
    addrees:{
        type: String,
        required: false,
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false,
    },
    city:{
        type:String,
        required:false,
    },
    state:{
        type:String,
        required:false,
    },
    password:{
        type:String,
        required:false
    }
    

},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
