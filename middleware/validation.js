const {restaurantSchema, reviewSchema} = require('../middleware/schemas');

module.exports.ValidateRestaurant = (req, res, next) => {
    const {error} = restaurantSchema.validate(req.body);
    if(error) {
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