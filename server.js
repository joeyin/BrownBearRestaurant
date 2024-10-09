const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const isAuthenticatedAdmin = require("./isAuthenticatedAdmin");
const isAuthenticated = require("./isAuthenticated");

const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/orders");
const deliveryRoutes = require('./routes/delivery');
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs");

// - extract data sent by <form> element in the client
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup sessions
const session = require("express-session");
app.use(
  session({
    secret: "the quick brown fox jumped over the lazy dog 1234567890", // random string, used for configuring the session
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Models
const Product = require("./models/product");
const Order = require("./models/order");

// Routes
app.use("/user", userRoutes);
app.use("/orders", orderRoutes);
app.use('/delivery', deliveryRoutes);

// Serve static files from the "public" directory
app.use(express.static("public"));

// RESTAURANT_WEBSITE
//Create a website that customers use to view information about the restaurant and order items.
app.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    return res.render("home.ejs", {
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
      products: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/orderform/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.findById(id);
    return res.render("order/orderForm.ejs", {
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
      product: products,
    });
  } catch (error) {
    return res.redirect("/");
  }
});

app.get("/admin", isAuthenticatedAdmin, async (req, res) => {
  try {
    let find_by = {};
    if (req.query.customer_name) {
      find_by.customer_name = req.query.customer_name;
    }
    if (req.query.status) {
      find_by.status = req.query.status;
    }
    const orders = await Order.find(find_by).populate("product");
    for (let order of orders) {
        order.driver = await User.findById(order.driver); // Add driver details
    }
    return res.render("order/orderProcessing.ejs", {
      username: req.session.loggedInUser.username,
      userType: req.session.loggedInUser.usertype,
      orders: orders,
      customer_search: find_by.customer_name,
      status: find_by.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// server running code
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
