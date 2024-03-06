require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport')

passport.serializeUser(function(user, cb){
    cb(null, user)
})

passport.deserializeUser(function(user, cb){
    cb(null, user)
})

const strategy = new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:'http://localhost:3000/google/callback',
    passReqToCallback:true
}, function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
})

module.exports = strategy