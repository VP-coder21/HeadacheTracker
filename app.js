'use strict';
require('dotenv').config
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

app.use('/public', express.static(path.join(__dirname, '/public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.route('/login').post((req,res) => {
    res.redirect('/homepage');
});

app.route('/register').post((req,res) => {
    res.redirect('/homepage');
});

app.get('/homepage', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/homepage.html'));
});

app.get('/analyze', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/analyze.html'));
});

app.get('/calender', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/calender.html'));
});

app.get('/profile', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/profile.html'));
});


app.listen(port, () => {
    console.log("App listening on port " + port)
})