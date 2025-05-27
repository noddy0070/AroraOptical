const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

module.exports = cookieConfig; 