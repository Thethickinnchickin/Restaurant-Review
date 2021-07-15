const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    cuisine: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

RestaurantSchema.post('findOneAndDelete', async function() {
    if (doc) {
        await review.remove({
            _id: {
                $in: doc.reviews
            }
      })
    }
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);