import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';


// ========== CLOUDINARY SIGNATURE ==========
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

export const test= (req, res) => {
  res.send('🚀 Server is running');
};






export const generate_signature=async (req, res) => {
  const { public_id, timestamp } = req.body;

  if (!public_id || !timestamp) {
    return res.status(400).json({ error: 'public_id and timestamp are required.' });
  }
  
  try {
    const signatureString = `public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
    
    res.json({ signature, api_key: CLOUDINARY_API_KEY });
  } catch (err) {
    console.error('Signature generation error:', err);
    res.status(500).json({ error: 'Failed to generate signature.' });
  }
};


cloudinary.config({
  cloud_name: "dohfbsepn",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const  delete_image = async(req, res) =>{
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'Missing public_id' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
