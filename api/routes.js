//Set Up

const User = require('../models/User');
const dbh = require('../config/db');


module.exports = function(app, passport, homepageRouter){

    app.use('/homepage', homepageRouter);
//Routes
    //registerstration base code 
    app.post('/register',(req, res) => {
    let {username, email, password} = req.body

    password = password.trim()
    email=email.trim()
    username = username.trim()

    if(username == "" || email=="" || password==""){
        req.flash('errorS', "Empty Input Fields")
        res.redirect('/signUp')
    } else if(!/^[a-zA-Z]*$/.test(username)) {
        req.flash('errorS', "Invalid Name Entered")
        res.redirect('/signUp')
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        req.flash('errorS', "Invalid Email Entered")
        res.redirect('/signUp')
    } else if(password.length < 8) {
        req.flash('errorS', "Password Must Be 8 Characters Or Longer")
        res.redirect('/signUp')
    } else{
        //Checking if user already exists
        process.nextTick(function(){
        User.find({email}).then(result =>{
            if (result.length) {
                req.flash('errorS', "A User With That Email Already Exists")
                res.redirect('/signUp')
            }
            else {
                    User.register(new User({
                        email,
                        username,
                    }), password, (err) =>{
                        if(err){
                            res.redirect('/signUp')
                        }
                        passport.authenticate('local')(req, res, function(){
                            //storing new user id in mysql user
                            const userId = req.user._id.toString();
                            // console.log(userId);
                            dbh.logNewUser(userId);
                            res.redirect('/homepage');
                        })
                    })
            }

        }).catch(err =>{
            console.log(err);
            req.flash('errorS', "An Error Occured While Checking For Existing User")
            res.redirect('/signUp')
        })
        })
    }
    })
    //login base code
    app.post('/login', isLoggedIn, (req, res) => {
    let {email, password} = req.body

        if(email == "" || password == ""){
            req.flash('errorL', "No Credentials Supplied")
            res.redirect('/')
        } else {
            //User exits?
            process.nextTick(function(){
            User.findOne({email: email}).then(user => {
                if (!user) {
                    req.flash('errorL', "Invalid Email")
                    res.redirect('/')
                } else{
                    passport.authenticate('local', { failureRedirect: '/loginFail' })(req, res, function(){
                            res.redirect('/homepage')
                        })
                }
            }).catch(err =>{
                console.log(err);
                req.flash('errorL', "An Error Occured While Checking For Existing User")
                res.redirect('/')
            })
        })
        }
    })

    app.get('/signUp', isLoggedIn, (req,res) => {
        res.render("login.ejs", {renderSignUp: true})
    });

    app.get('/loginFail', isLoggedIn, (req,res) => {
        req.flash('errorL', "Invalid Password")
        res.redirect('/')
    });

    app.get('/', isLoggedIn, (req,res) => {
        res.render("login.ejs", {renderSignUp: false})
    });

    app.get('/homepage', isLoggedOut, (req,res) => {
        username = req.user.username
        // console.log(username)
        res.render("homepage.ejs", {name: username});
    });

    homepageRouter.route('/record')
    .get(isLoggedOut, (req,res) => {
        res.render('record.ejs')
    })

    app.get('/analyze', isLoggedOut,(req,res) => {
        res.render("analyze.ejs");
    });

    app.get('/calender', isLoggedOut, (req,res) => {
        res.render("calender.ejs");
    });

    app.route('/profile')
    .get( isLoggedOut,(req,res) => {
        res.render("profile.ejs");
    })
    .post(isLoggedOut, (req, res) => {
        res.redirect("/profile")
    });

    app.get('/logout', function(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });

    //add a Delete Account delete from database

    //Error Page
    app.use(function(req, res) {
        res.status(404)
        res.render('error.ejs', { error: 'Not Found'});
    });

};

function isLoggedOut(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/homepage')
    }
    return next()
}