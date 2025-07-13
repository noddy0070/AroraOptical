import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // ✅ Reads token from cookie

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Verifies token
    req.user = decoded; // ✅ Sets req.user for downstream use
    console.log("req.user",req.user); 
    next();
  } catch (err) {
    console.log("err",err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export {authMiddleware}