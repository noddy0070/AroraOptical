import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();

// Debug log for environment variables
console.log('Google OAuth Config:', {
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    hasClientID: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV
});

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const CALLBACK_URL = process.env.NODE_ENV === 'production'
    ? 'https://arora-optical-backend.vercel.app/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: CALLBACK_URL,
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('Google OAuth Profile:', profile); // Debug log

                // Check if user exists by email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    console.log('Creating new user for Google OAuth'); // Debug log
                    // Create new user if doesn't exist
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        password: Math.random().toString(36).slice(-8), // Random password for Google users
                    });
                    await user.save();
                } else if (!user.googleId) {
                    console.log('Updating existing user with Google ID'); // Debug log
                    // Update existing user's Google ID if not set
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                console.error('Google OAuth Error:', err); // Debug log
                return done(err, null);
            }
        }
    )
);

export default passport;
