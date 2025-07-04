# Restaurant Review

### Matthew Reiley

**Date:** January 8, 2024
**Source Code:** [Link to Repository](LINK)

---

## 📋 Intro

The Restaurant Review Project simplifies the dining feedback experience by reducing complexity and information overload. It provides an intuitive and concise way for users to share meaningful reviews on restaurants without being overwhelmed.

---

## 🧐 Problem

Existing restaurant review platforms often suffer from:

* **Information Overload:** Excessive menus and intricate rating categories overwhelm users.
* **Complex User Interfaces:** Cluttered and confusing UIs discourage participation.
* **Time-Consuming Reviews:** Lengthy processes lead to user fatigue.
* **Lack of Focus:** Reviews stray from key aspects like food, service, and ambiance.

---

## 🎯 Goals

* **Simplify the Review Process:** Quick and intuitive.
* **User-Friendly Interface:** Accessible for all users.
* **Efficient Time Management:** Fast to complete.
* **Focus on Key Elements:** Highlight the most important aspects of dining.

---

## 🖥️ Back End

Built with **Express.js**, **MongoDB**, and several supporting tools.

### Key Components

* **app.js**

  * Initializes the app, sets routes, and middleware.
  * Adds security with Helmet and session/user authentication with Passport.
  * Connects to MongoDB with Mongoose.
  * Integrates Cloudinary (for images) and Mapbox (for geocoding).

* **/routes/restaurants.js**

  * CRUD for restaurants.
  * Middleware to restrict access to authenticated users.
  * Robust error handling.

* **/routes/reviews.js**

  * Users can post and delete reviews.
  * Restricted to logged-in users with clear error messages.

* **/routes/users.js**

  * Handles registration, login, logout.
  * Flash messages enhance feedback.

* **/models/**

  * Defines schemas for restaurants, reviews, and users using Mongoose.
  * Supports virtual properties and cascading deletes.

* **/middleware/**

  * Authentication and validation middleware.
  * Validation powered by Joi to enforce data integrity.

* **/cloudinary/index.js**

  * Configures Cloudinary and Multer for image uploads.

### Back End Summary

A secure, maintainable, and robust backend that prioritizes user data integrity, security, and scalability.

---

## 🎨 Front End (EJS)

The frontend uses **EJS templates** for a dynamic and responsive UI.

### Key Views

* **/views/layouts/boilerplate.ejs**

  * Core layout with metadata, Bootstrap, Mapbox, nav, and footer.

* **/views/others/error.ejs**

  * Displays error messages clearly.

* **/views/partials/flash.ejs**

  * Shows success/error alerts that auto-fade.

* **/views/partials/footer.ejs & navbar.ejs**

  * Clean footer and dynamic navigation depending on login status.

* **/views/partials/restaurantValidation.ejs**

  * JavaScript for client-side form validation.

* **/views/restaurants/**

  * **edit.ejs:** Edit restaurant details with pre-filled forms.
  * **index.ejs:** List restaurants with cards and add-new button.
  * **new\.ejs:** Form to add new restaurants.
  * **show\.ejs:** Detailed view with carousel, map, and reviews.

* **/views/users/login.ejs & register.ejs**

  * Forms for authentication.

* **/views/restaurants/home.ejs**

  * Welcoming home page with a call-to-action.

### Front End Summary

A user-focused and consistent interface that guides users seamlessly from exploration to review submission.

---

## 🚀 Wrap Up

This Restaurant Review app is a polished web application combining a secure, scalable backend with an intuitive, engaging frontend. It integrates **Node.js**, **Express**, **MongoDB**, **Cloudinary**, and **Mapbox** on the backend, while the frontend leverages **EJS** and **Bootstrap** for a clean and responsive user experience.

With thoughtful form validation, clear navigation, and a focus on what matters most to diners — food, service, and ambiance — this platform offers a delightful and efficient way to explore and review restaurants.

---

### 🔗 Links

* [Live Demo](https://restaurant-review-six.vercel.app/)


