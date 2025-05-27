import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'


let otpStore = {"no":{otp:33,expires:123}}; // Simple in-memory store (use Redis or DB in prod)

export const sendOTP=async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    const mailOptions = {
      from: `"Arora Opticals" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5-minute expiry
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
}

export const verifyOTP=async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
      }
    const record = otpStore[email];
    
    if (!record || record.otp !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  
    if (Date.now() > record.expires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
  
    delete otpStore[email]; // Remove OTP after successful verification
    res.json({ success: true, message: "OTP verified" });
}

// POST /api/auth/signup
export const signup= async (req,res,next)=>{
    const {email,name,state,city,password}=req.body;
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser= new User({email,name,state,city,password:hashedPassword});
    try{
        await newUser.save();
    res.status(201).json('User created successfully');
    }catch(error){
        next(error);
    }
    
}

// POST /api/auth/login
export const login= async (req,res,next)=>{
    const {email,password}=req.body;
    const validUser= await User.findOne({email});

    try{
        if(!validUser) return res.status(400).json({ success: false, message: "User Not Found" });

        const validPassword=bcryptjs.compareSync(password,validUser.password);

        if(!validPassword) return res.status(400).json({ success: false, message: "Invalid Credentials" })

        
        const token= jwt.sign({id:validUser._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        const {password:pass,...rest}=validUser._doc;
        res.cookie('token',token,{ httpOnly: true, secure: true, sameSite: "None",maxAge:7*24*60*60*1000, });
        res.status(200).json({success:true,message:rest});
        console.log("User logged in successfully");
    }
    catch(error){
        next(error);
    }
}

// POST /api/auth/logout  
export const logout=async(req,res)=>{
  try {
    console.log("Logout called");
    res.clearCookie('token', { 
      httpOnly: true, 
      sameSite: 'Strict', 
      secure: process.env.NODE_ENV === 'production' 
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: 'Failed to logout' });
  }
}

// GET /api/auth/me
export const me=async(req,res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};

// GET /api/google/callback
export const googleCallback = async (req, res) => {
    try {
        console.log('Processing Google callback, user:', req.user?._id); // Debug log

        if (!req.user) {
            console.error('No user data in Google callback');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=NoUserData`);
        }

        // Set JWT cookie
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookie with proper configuration
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Always use secure in production
            sameSite: 'none', // Required for cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
        });

        console.log('Auth cookie set, redirecting to frontend'); // Debug log

        // Redirect back to frontend
        res.redirect(`${process.env.FRONTEND_URL}?loginSuccess=true`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
    }
};