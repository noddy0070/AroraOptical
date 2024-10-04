import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';

dotenv.config();

const app=express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connection to mongodb success.")
}).catch((err)=>{
    console.log(err)
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

app.use('/api/user',userRouter);