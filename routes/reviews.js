const express = require('express');
const router = express.Router({mergeParams: true});
const Restaurant = require('../models/resturant');
const Review = require('../models/review');
const CatchAsync = require('../utils/CatchAsync');
const {reviewSchema} = require('../middleware/schemas');
const ExpressError = require('../utils/ExpressError');

const ValidateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', ValidateReview, CatchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:reviewId', CatchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;
