const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static('public'));


//Sign In page
app.get("/signin", (req, res) => {
    return res.render("signIn.ejs")
})


// RESTAURANT_WEBSITE
//Create a website that customers use to view information about the restaurant and order items.
app.get("/", (req, res) => {
    return res.render("restaurant.ejs")
})





// ORDER_PROCESSIN
// used by the restaurant to manage orders and update an order status.







// DELIVERY_DRIV
// Create a website that allows users to register as a delivery driver for the restaurant






// server running code
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});