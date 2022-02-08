const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const User = require('../models/user');
const passport = require('passport');

//Rendering the Register Page

router.get('/register', (req, res) => {
    req.flash('info', 'This is a flash')
    res.render("users/register", {user: req.user, onLoginPage: false})
});

//Register route, Users create accounts through this route

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({
            email: email,
            username: username
        });
        const registeredUser = await User.register(user, password);  
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', "Account successfully created!")
            res.redirect('/restaurants');            
        })

    }catch (err) {
        req.flash('error', err.message);
        res.redirect('/restaurants');   
    }    
}));

//Rendering the login page for the user

router.get('/login', (req, res) => {
    res.render('users/login', {user: req.user, onLoginPage: true});
});

//Login Route, Authentication done using passport
//Using session to return user to their previous url or /restaurants if that is null

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || "/restaurants"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

//Logout Route UnAuthenticating user with passport 

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye see you soon!")
    res.redirect('/');
})

module.exports = router;