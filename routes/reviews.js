const express = require('express');
const router = express.Router({mergeParams: true});
const Restaurant = require('../models/resturant');
const Review = require('../models/review');
const CatchAsync = require('../utils/CatchAsync');
const {ValidateReview} = require('../middleware/validation')
const {isReviewAuthor} = require('../middleware/validation');
const {isLoggedIn} = require('../middleware/authentication');
const ExpressError = require('../utils/ExpressError');


//Route to post new review

router.post('/',isLoggedIn, ValidateReview, CatchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review({
        body: req.body.body,
        rating: req.body.rating,
        author: req.user._id
    });
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
}));

//Route to delete a review

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, CatchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Review.findOneAndDelete({_id: reviewId});
    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;
