import { Timestamp } from "bson";

const userSchema = new Schema({
    username:{
     type: String,
     required: true,
     unique: true,   
    }
},{Timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
