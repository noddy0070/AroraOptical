import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';


let otpStore = {"no":{otp:33,expires:123}}; // Simple in-memory store (use Redis or DB in prod)

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Case-insensitive match for stored emails (handles legacy mixed-case records). */
const findUserByEmailInsensitive = (email) => {
  const trimmed = (email || '').trim();
  if (!trimmed) return null;
  return User.findOne({
    email: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, 'i') },
  });
};

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
    const newUser= new User({email: email.trim().toLowerCase(),name,state,city,password:hashedPassword});
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
    const validUser= await findUserByEmailInsensitive(email);

    try{
        if(!validUser) return res.status(400).json({ success: false, message: "User Not Found" });

        const validPassword=bcryptjs.compareSync(password,validUser.password);

        if(!validPassword) return res.status(400).json({ success: false, message: "Invalid Credentials" })

        
        const token= jwt.sign({id:validUser._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        const {password:pass,...rest}=validUser._doc;
        res.cookie('token',token,{ httpOnly: true, secure: true, sameSite: "None",maxAge:7*24*60*60*1000, });
        res.status(200).json({success:true,message:rest});
    }
    catch(error){
        next(error);
    }
}

// POST /api/auth/logout  
export const logout=async(req,res)=>{
  try {
    res.clearCookie('token', { 
      httpOnly: true, 
      sameSite: 'None', 
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

const getMailTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email?.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const genericResponse = {
    success: true,
    message: 'If an account exists for that email, you will receive password reset instructions shortly.',
  };

  try {
    const user = await findUserByEmailInsensitive(email).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || process.env.FRONTEND_URL || '').replace(/\/$/, '');
    if (!clientUrl) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error('CLIENT_URL or FRONTEND_URL is not set');
      return res.status(500).json({
        success: false,
        message: 'Password reset is not configured. Please contact support.',
      });
    }

    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    const transporter = getMailTransporter();
    try {
      await transporter.sendMail({
        from: `"Arora Opticals" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Reset your Arora Opticals password',
        text: `You requested a password reset. Open this link to choose a new password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a> (link valid for 1 hour).</p><p>If you did not request this, you can ignore this email.</p>`,
      });
    } catch (mailErr) {
      console.error('Reset email error:', mailErr);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({
        success: false,
        message: 'Could not send reset email. Please try again later.',
      });
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password  { token, password }
export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset link. Please request a new one.' });
    }

    user.password = bcryptjs.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Your password has been reset. You can log in now.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/google/callback
export const googleCallback = async (req, res) => {
    // Set JWT cookie
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect back to frontend
    res.redirect(process.env.GOOGLE_CALLBACK_REDIRECT);
}