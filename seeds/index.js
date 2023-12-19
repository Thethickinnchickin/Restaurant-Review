const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, cuisine, images } = require('./seedHelpers');
const Campground = require('../models/resturant');

mongoose.connect(process.env.dbURL, {
    useNewUrlParser: true,
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '620346d889d7c09fa8e30570',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(places)}`,
            cuisine: `${sample(cuisine)}`,
            images: [
                {
                    url: `https://res.cloudinary.com/mattreiley/image/upload/c_scale,w_600/v1644370711/RestaurantReview/${sample(images)}`,
                    filename: `RestaurantReview/${sample(images)}` 
                  },
                  {
                    url: `https://res.cloudinary.com/mattreiley/image/upload/c_fill,h_300,w_600/v1644370711/RestaurantReview/${sample(images)}`,
                    filename: `RestaurantReview/${sample(images)}`
                  }
            ],
            geometry: {
                type: "Point",
                coordinates: 
                [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description:" Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem, sequi laudantium, deleniti molestias voluptas quos totam magni illo debitis optio commodi molestiae sapiente. Quod quisquam magnam modi pariatur aperiam ratione"
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


