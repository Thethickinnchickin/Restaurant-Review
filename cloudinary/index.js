const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config({path: "../.env"});

// cloudinary.config({
//     cloud_name: "dguf7livc",
//     api_key: "384914399372484",
//     api_secret: "88bIhq-VuSSQSUhqOXumCA_31QM"
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'RestaurantReview',
        allowedFormates: ['jpeg', 'png', 'jpg']     
    }

})

module.exports = {
    cloudinary,
    storage
}