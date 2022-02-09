module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in');
        return res.redirect('/users/login');
    } 
    next();
}

//Middlewear Checking if the request was sent by a user that has been authenticated and logged in 