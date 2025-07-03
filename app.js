'use strict';
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

// mongodb
require('./config/db')

//Dependicies
const express = require('express');
const cookieParser = require('cookie-parser')
const flash = require("express-flash")
const session = require("express-session");
const bodyParser = require('body-parser')
const passport = require('passport')

require('./config/passport')(passport)

//Set Up
const port = process.env.PORT || 3000;
const app = express();


app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(flash())
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs')

require('./api/routes.js')(app, passport);

app.listen(port, () => {
    console.log("App listening on port " + port)
})