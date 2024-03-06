const LocalStrategy = require('passport-local')
const passport = require('passport')
const User = require('../model/User')

const strategy = new LocalStrategy(async function verify(username, password, cb){
    const findUser = await User.findOne({username, password});
    if(!findUser){
        return cb(null, false)
    }
    passport.serializeUser(function(user, cb){
        process.nextTick(function(){
            return cb(null, {
                id:user._id,
                username:user.username,
                password:user.password
            })
        })
    })
    passport.deserializeUser(function(user, cb){
        process.nextTick(function(){
            return cb(null, user);
        })
    })
    return cb(null, findUser)
})

module.exports = strategy;