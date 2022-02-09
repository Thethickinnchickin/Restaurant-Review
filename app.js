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
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoSanitze = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require("connect-mongo")



//Adding in body parser to produce better json requests
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = process.env.dbURL


const store = new MongoStore ({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR");
})

//Adding session to express
app.use(session({
    store,
    secret: process.env.SECRET,
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

//Adding Helmet and updating CSP
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

//Middlewear for redirecting over login
// app.use((req, res, next) => {
//     if(!["/login", "/register"].includes(req.originalUrl)) {
//         req.session.returnTo = req.originalUrl;
//     }
//     next();
// })

//Creating a returnTo varible to be able to go back to previous page after login

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Connecting to the DataBase

mongoose.connect(dbUrl, {
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


//Setting view engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//setting up method override for requests
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));


//Adding routes to express
app.use('/restaurants', restaurants);
app.use('/restaurants/:id/reviews', reviews);
app.use('/users', userRoutes);

//Setting public directory to static
app.use(express.static(path.join(__dirname, 'public')));

//Home Route for App
app.get('/', (req, res) => {
    res.render('home', {user: req.user, onLoginPage: false});
});

//Fallback Error middlewear
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

//Server Error catcher
app.use((err, req, res) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('others/error', {err});
})

//Starting up at on port 4000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})