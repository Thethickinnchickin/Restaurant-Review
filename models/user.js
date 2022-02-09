const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Creating User model with passport for authentication

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

//Using passport-local-mongoose to create authentication 

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);