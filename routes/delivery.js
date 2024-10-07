const express = require("express");
const multer = require("multer");

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
    for (let i = 0; i < order.products.length; i++) {
      order.products[i] = {
        ...(await Product.findById(order.products[i].product)).toObject(), // Add product details
        quantity: order.products[i].quantity,
      };
    }
  }
  return orders;
};

router.get("/", async (req, res) => {
  try {
    const orders = await findOrders({ status: "Pending" });
    return res.render("../views/delivery/index.ejs", {
      orders,
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

router.get("/shippings", async (req, res) => {
  try {
    const orders = await findOrders({ status: "In Transit" });
    return res.render("../views/delivery/index.ejs", {
      orders,
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

router.get("/:id", async (req, res) => {
  try {
    const order = await findOrders({ _id: req.params.id });
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

router.post("/:id", upload.single("photo"), async (req, res) => {
  try {
    const file = req.file;
    console.log(file)
    const result = await Order.findByIdAndUpdate(req.params.id, {
      ...req.body,
      ...(file && { photo: `/uploads/${file.filename}` }),
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
