const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating Review schema with body, rating, and the author who posts it

const ReviewSchema = new Schema({
    body: String,
    rating: String,
    author: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", ReviewSchema);

