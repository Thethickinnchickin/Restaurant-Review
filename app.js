const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');
const userRoutes = require('./routes/users');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoSanitze = require('express-mongo-sanitize');
const helmet = require('helmet');



require('dotenv').config({path: "../.env"});

app.use(bodyParser.urlencoded({ extended: false }));

//Adding session to express

app.use(session({
    secret: 'gay',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

//Setting Static Files
app.use(express.static(path.join(__dirname,"public")));

//Connecting flash

app.use(flash());

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/YOUR_CLOUDINARY_ACCOUNT/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/YOUR_CLOUDINARY_ACCOUNT/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/YOUR_CLOUDINARY_ACCOUNT/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/YOUR_CLOUDINARY_ACCOUNT/" ];
 
// app.use(
//     helmet.contentSecurityPolicy({
//         directives : {
//             defaultSrc : [],
//             connectSrc : [ "'self'", ...connectSrcUrls ],
//             scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
//             styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
//             workerSrc  : [ "'self'", "blob:" ],
//             objectSrc  : [],
//             imgSrc     : [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.coYOUR_CLOUDINARY_ACCOUNT/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//                 "https://images.unsplash.com/"
//             ],
//             fontSrc    : [ "'self'", ...fontSrcUrls ],
//             mediaSrc   : [ "https://res.cloudinary.com/mattreiley/" ],
//             childSrc   : [ "blob:" ]
//         }
//     })
// );

// app.use(helmet());


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
// ];
// const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/mattreiley/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//Creating a returnTo varible to be able to go back to previous page after login

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Connecting to the DataBase

mongoose.connect('mongodb+srv://appuser:TomBrady12@restaurant-review.iqjbz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app.use(mongoSanitze({
    replaceWith: '_'
}));

//Adding passport to express and authenticating user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Setting view engine 

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//setting up method override


app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));


//Adding routes to express

app.use('/restaurants', restaurants);
app.use('/restaurants/:id/reviews', reviews);
app.use('/users', userRoutes);

//Setting public directory to static

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('home', {user: req.user, onLoginPage: false});
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});


app.use((err, req, res) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('others/error', {err});
})

app.listen(5000, () => {
    console.log("Server running on port 5000");
})