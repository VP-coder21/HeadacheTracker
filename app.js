'use strict';

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash")
const session = require("express-session");
const methodOverride = require("method-override");

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs')

const users = []

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

//routing
app.use('/public', express.static(path.join(__dirname, '/public')));

app.get('/', checkNotAuthenticated, (req,res) => {
    res.render("login.ejs")
});



app.post('/login', checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/homepage",
    failureRedirect: "/",
    failureFlash: true
}));

app.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        if(req.body.email === '' || req.body.username === ''){
            return res.redirect('/');
        }else{
        users.push({
            id: Date.now().toString(),
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        })
        // console.log(users); //testing only
        res.redirect('/');
    }
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
});

app.get('/homepage', checkAuthenticated, (req,res) => {
    res.render("homepage.ejs", {name: req.user.username});
});

app.get('/analyze', checkAuthenticated, (req,res) => {
     res.render("analyze.ejs");
});

app.get('/calender', checkAuthenticated, (req,res) => {
     res.render("calender.ejs");
});

app.route('/profile')
.get(checkAuthenticated, (req,res) => {
     res.render("profile.ejs");
})
.post(checkAuthenticated, (req, res) => {
    res.redirect("/profile")
});


app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err)
        res.redirect("/homepage")
    })
})

app.use(function(req, res, next) {
    res.status(404)
    res.render('error.ejs', { error: 'Not Found'});
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/homepage")
    }
    next()
}

app.listen(port, () => {
    console.log("App listening on port " + port)
})