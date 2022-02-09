const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

//Creating Image Schema 

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};

// Creating the Restaurant Model

const RestaurantSchema = new Schema({
    title: String,
    images: [ImageSchema],
    description: String,
    geometry: {
        type : {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates : {
            type: [Number],
            required: true
        }
    },
    location: String,
    cuisine: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

//Creating popUp in MapBox using virtual with restuarant schema

RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/restaurants/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

//Creating cascading deletion when restaurant is deleted so the reviews associated are deleted as well

RestaurantSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
      })
    }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);