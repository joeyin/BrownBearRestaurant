const express = require("express");
const multer = require("multer");
const isAuthenticated = require("../isAuthenticated");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

// const Delivery = require("../models/delivery");
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

const findOrders = async (parameters = {}) => {
  const _orders = await Order.find(parameters);
  const orders = _orders.map((order) => order.toObject());
  for (let order of orders) {
    order.customer = await User.findById(order.customer); // Add customer details
    order.product = await Product.findById(order.product); // Add product details
  }
  return orders;
};

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await findOrders({ status: "Ready For Delivery" });
    return res.render("../views/delivery/index.ejs", {
      orders,
      status: "pending",
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/in-transit", isAuthenticated, async (req, res) => {
  try {
    const orders = await findOrders({
      status: "In Transit",
      driver: req.session.loggedInUser._id,
    });
    return res.render("../views/delivery/index.ejs", {
      orders,
      status: "in-transit",
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/delivered", isAuthenticated, async (req, res) => {
  try {
    const orders = await findOrders({
      status: "Delivered",
      driver: req.session.loggedInUser._id,
    });
    return res.render("../views/delivery/index.ejs", {
      orders,
      status: "delivered",
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await findOrders({ _id: req.params.id });
    if (!order.length) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.render("../views/delivery/detail.ejs", {
      order: order?.[0],
      username: req.session.loggedInUser
        ? req.session.loggedInUser.username
        : null,
      userType: req.session.loggedInUser
        ? req.session.loggedInUser.usertype
        : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id", isAuthenticated, upload.single("photo"), async (req, res) => {
  try {
    const file = req.file;
    const result = await Order.findByIdAndUpdate(req.params.id, {
      ...req.body,
      ...(file && { photo: `/uploads/${file.filename}` }),
      driver: req.session.loggedInUser._id,
    });
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.redirect("/delivery");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
