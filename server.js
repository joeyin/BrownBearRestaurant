const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs")

// - extract data sent by <form> element in the client
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

// setup sessions
const session = require('express-session')
app.use(session({
    secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
    resave: false,
    saveUninitialized: true
}))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/users', userRoutes);

// Serve static files from the "public" directory
app.use(express.static('public'));


//Sign In page
app.get("/signin", (req, res) => {
    return res.render("signIn.ejs", { 
        username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
        userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null
     })
})

//Sign Up page
app.get("/signup", (req, res) => {
    return res.render("signUp.ejs", { 
        username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
        userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null
     })
})


// RESTAURANT_WEBSITE
//Create a website that customers use to view information about the restaurant and order items.
app.get("/", (req, res) => {
    return res.render("restaurant.ejs", { 
        username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
        userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null
     })
})





// ORDER_PROCESSIN
// used by the restaurant to manage orders and update an order status.







// DELIVERY_DRIV
// Create a website that allows users to register as a delivery driver for the restaurant






// server running code
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});