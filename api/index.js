import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';

dotenv.config();

const app=express();


app.use(cors({
    origin: ['http://localhost:5173','*'], // Allow your Vercel app
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

app.use(bodyParser.json());

const CLOUDINARY_API_SECRET = "mGc4mgrnhkCrBuvXaN2vFnt5f_s";
const CLOUDINARY_API_KEY = '192436767777992';

app.get('/health', (req, res) => {
    res.send('🚀 Server is running');
  });
  
  // Route to generate signature for deleting images
  app.post('/generate-signature', (req, res) => {
    const { public_id, timestamp } = req.body;
  
    if (!public_id || !timestamp) {
      return res.status(400).json({ error: 'public_id and timestamp are required.' });
    }
  
    try {
      // Construct the signature string as per Cloudinary's requirements
      const signatureString = `public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
  
      res.json({ signature, api_key: CLOUDINARY_API_KEY });
    } catch (err) {
      console.error('Signature generation error:', err);
      res.status(500).json({ error: 'Failed to generate signature.' });
    }
  });