const express = require('express');
const router = express.Router();
const Restaurant = require('../models/resturant');
const Review = require('../models/review');
const CatchAsync = require('../utils/CatchAsync');
const {restaurantSchema} = require('../middleware/schemas')
const ExpressError = require('../utils/ExpressError');

const ValidateRestaurant = (req, res, next) => {
    const {error} = restaurantSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', CatchAsync(async(req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', {restaurants});
}));

router.get('/new', (req, res) => {
    res.render('restaurants/new');
});

router.get('/:id', CatchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    res.render('restaurants/show', {restaurant});
}));

router.get('/:id/edit', CatchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render('restaurants/edit', {restaurant});
}));

router.post('/', ValidateRestaurant, CatchAsync(async(req, res, next) => {
    //if(!req.body.restaurant) throw new ExpressError('Invalid Restaurant Data', 400);
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`restaurants/${restaurant._id}`);
}));

router.put('/:id', ValidateRestaurant, CatchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
    res.redirect(`restaurants/${id}`);
}));

router.delete('/:id', CatchAsync(async (req, res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));

module.exports = router;
