import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';
dotenv.config();

const app=express();


app.use(cors({
    origin: ['http://localhost:5173'], // Allow your Vercel app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: 'Content-Type',
    credentials: true
  }));

  app.use(express.json());

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connection to mongodb success.")
}).catch((err)=>{
    console.log(err)
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})