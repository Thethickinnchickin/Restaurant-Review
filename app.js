const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Restaurant = require('./models/resturant');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/restaurant-review', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.use('/restaurants', restaurants);
app.use('/restaurants/:id/reviews', reviews);
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('others/error', {err});
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})