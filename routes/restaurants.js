const express = require('express');
const router = express.Router();
const Restaurant = require('../models/resturant');
const CatchAsync = require('../utils/CatchAsync');
const { storage, cloudinary } = require('../cloudinary');
const {isLoggedIn} = require('../middleware/authentication');
const {isRestaurantAuthor, ValidateRestaurant, restaurantOwnerEditAbility} = require('../middleware/validation');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MapToken;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const multer = require('multer');
const upload = multer({storage});





//Route to get all Restaurants from DataBase

router.get('/', CatchAsync(async(req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        console.log(restaurants)
        res.render('restaurants/index', {restaurants, user: req.user, onLoginPage: false});
    } catch(err)
    {
        console.log(err);
    }
    

}));

//Route to get creating of new reataurant page

router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new', {user: req.user, onLoginPage: false});
});


//Route that gets an individual restaurant based on it's ID 

router.get('/:id', CatchAsync(async (req, res) => {
    try {
        const isOwner = await restaurantOwnerEditAbility(req, res);
        const restaurant = await Restaurant.findOne({_id: req.params.id}).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        const LoggedInUser = req.user;

        
        if (!restaurant) {
            req.flash('error', 'No Restaurant Found');
            return res.redirect('/restaurants', 200, {user: LoggedInUser});
        }
        res.render('restaurants/show', {restaurant: restaurant, user: LoggedInUser, onLoginPage: false, owner: isOwner});
    } catch (err) {
        req.flash('error', 'No Restaurant Found');
        return res.redirect('/restaurants');
    }

}));

//Route that gets the edit page for a restaurant with 

router.get('/:id/edit', isLoggedIn, isRestaurantAuthor, CatchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        req.flash('error', 'No Restaurant Found');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', {restaurant, user: req.user, onLoginPage: false});
}));

//Route that creats a new restaurant

router.post('/', isLoggedIn, upload.array('images'), ValidateRestaurant, CatchAsync(async(req, res, next) => {
    //if(!req.body.restaurant) throw new ExpressError('Invalid Restaurant Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();

    if(!geoData.body.features.length > 0) {
        req.flash('error', 'No location found');
        return res.redirect('/restaurants/new');
    }
    
    const restaurant = new Restaurant({
        title: req.body.title,
        geometry: geoData.body.features[0].geometry,
        location: req.body.location,
        images: req.files.map(f => ({ url: f.path, filename: f.filename})),
        description: req.body.description,
        cuisine: req.body.cuisine,
        author: req.user._id
    });
    await restaurant.save();
    req.flash('success', "Successfully created new restaurant");
    res.redirect(`restaurants/${restaurant._id}`, 200, {user: req.user});
}));

//Route that edits a restaurant in the database using it's ID from the database

router.put('/:id', isLoggedIn, upload.array('images'), isRestaurantAuthor, ValidateRestaurant, CatchAsync(async (req, res, next) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        cuisine: req.body.cuisine,
    });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    restaurant.images.push(...imgs);
    await restaurant.save();
    if(req.body.deletedImages) {
        for (let filename of req.body.deletedImages) {
            console.log(filename);
            await cloudinary.uploader.destroy(filename);
        }
        await restaurant.updateOne({$pull: {images: {filename: {$in: req.body.deletedImages}}}}, {new: true}); 
    }

    req.flash('success', "Successfully updated restaurant info");
    res.redirect(`${id}`, {user: req.user}, 200);
}));

//Route that delets a restaurant in the database using it's ID from the database

router.delete('/:id', isLoggedIn, isRestaurantAuthor,  CatchAsync(async (req, res) => {
    const {id} = req.params;
    await Restaurant.findOneAndDelete({_id: id});
    req.flash('danger', "Successfully deleted restaurant");
    res.redirect('/restaurants', {user: req.user}, 200);
}));





module.exports = router;
