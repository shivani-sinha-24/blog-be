import passport from 'passport';
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3009/auth/google"
  },
  async function(accessToken, refreshToken, profile, cb) {
    const oauthUser = await User.findOne({googleId:profile.id})
    if(oauthUser){
      const token = jwt.sign(
        { 
          googleId:profile.id,
          name: profile.displayName
        }, 
        'shhhhh'
        );
        res.status(201).send({message: "User loggedin successfully",user: token})
    }else{
      const user = new User({
        fullName: profile.displayName,
        googleId:profile.id,
        });
        user.save();
          res.status(400).send({ err: "User not found. Create a new account" });
        }
  }
));