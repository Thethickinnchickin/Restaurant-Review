const Joi = require('joi');


module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        cuisine: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required()
    }).required()
});