const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//Extension to implement sanitize-html to prevent html entries on site
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

//Extending escapeHTML onto Base Joi
const Joi = BaseJoi.extend(extension)

//Schema Validator for restaurants
module.exports.restaurantSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    cuisine: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    geometry: Joi.any(),
    author: Joi.any(),
    deleteImages: Joi.array()
});

//Schema validator for reviews posted
module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required().escapeHTML()
})