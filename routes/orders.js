const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");
const isAuthenticated = require("../isAuthenticated");

// Create a new order
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const order = new Order({
      user: req.session.loggedInUser._id,
      customer_name: req.body.customer_name,
      product: req.body.product_id,
      shippingAddress: req.body.delivery_addres,
      totalAmount: req.body.total_amount,
    });
    await order.save();
    res.redirect(`/orders/fetch/${order._id}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.session.loggedInUser._id,
    }).populate("product");
    return res.render("order/orderList.ejs", {
      username: req.session.loggedInUser.username,
      userType: req.session.loggedInUser.usertype,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.query.orderId);
    return res.redirect(`/orders/fetch/${order._id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single order
router.get("/fetch/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.driver = await User.findById(order.driver); // Add driver details
    return res.render("order/orderReceipt.ejs", {
      username: req.session.loggedInUser.username,
      userType: req.session.loggedInUser.usertype,
      order: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a order
router.post("/update", isAuthenticated, async (req, res) => {
  try {
    const statusUpdate = req.body.order_status;
    const id = req.body.order_id;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: statusUpdate },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.redirect("/admin");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a order
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
