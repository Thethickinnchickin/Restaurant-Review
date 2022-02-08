const {restaurantSchema, reviewSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Restaurant = require('../models/resturant');
const Review = require('../models/review');

module.exports.ValidateRestaurant = (req, res, next) => {
    const {error} = restaurantSchema.validate({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        cuisine: req.body.cuisine,
        author: req.user._id
    });

    if(error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.ValidateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Checking to see if the user is the author of a restaurant

module.exports.isRestaurantAuthor = async(req, res, next) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findOne({_id: id});
    if(!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/restaurants/${id}`)
    }
    next();
}

//Checking to see if logged in user is the owner of a review

module.exports.isReviewAuthor = async(req, res, next) => {
    const {reviewId, id} = req.params;
    const review = await Review.findOne({_id: reviewId});
    if(!req.user) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/restaurants/${id}`)
    }
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/restaurants/${id}`)
    }

    next();
}
