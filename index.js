require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('./middleware/local')
const googleStrategy = require('./middleware/google')
const path = require('path')

mongoose.connect(process.env.MONGO_URI)
.then(res => console.log("Connected to Database"))
.catch(err => console.log(err))

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('views'))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{secure:true}
}))
app.use(passport.authenticate('session'))

passport.use(localStrategy);
passport.use(googleStrategy);

app.set('view engine', 'ejs')

app.get('/secured', (req, res) => {
    res.send('Secured endpoint')
})

app.get('/fail', (req, res) => {
    res.send('Fail')
})

app.get("/success", (req, res) => [
    res.send('seccess')
])

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/google', passport.authenticate('google', {
    scope:['email', 'profile']
}))

app.get('/google/callback', passport.authenticate('google', {
    failureRedirect:'/fail'}),
    (req, res) => {
        res.redirect('/success');
    }
)

app.post('/login', passport.authenticate('local', {failureRedirect:'/login', failureMessage:true}), (req, res) => {
    res.redirect('/secured')
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})