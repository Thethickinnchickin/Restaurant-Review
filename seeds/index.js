const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, cuisine } = require('./seedHelpers');
const Campground = require('../models/resturant');

mongoose.connect('mongodb://localhost:27017/restaurant-review', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            cuisine: `${sample(cuisine)}`,
            image: 'https://images.unsplash.com/photo-1612966809481-b84cb86ee3f3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
            description:" Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem, sequi laudantium, deleniti molestias voluptas quos totam magni illo debitis optio commodi molestiae sapiente. Quod quisquam magnam modi pariatur aperiam ratione"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
