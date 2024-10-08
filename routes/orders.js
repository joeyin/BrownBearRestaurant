const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            user: req.session.loggedInUser._id,
            customer_name: req.body.customer_name,
            product: req.body.product_id,
            shippingAddress: req.body.delivery_addres,
            totalAmount: req.body.total_amount
        });
        await order.save();
        res.redirect(`/orders/fetch/${order._id}`)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({user:req.session.loggedInUser._id});
        return res.render("orderList.ejs", { 
            username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
            userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null,
            orders: orders
         })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single order
router.get('/fetch/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('product') ;
        if (!order) return res.status(404).json({ message: 'Order not found' });
        return res.render("orderReceipt.ejs", { 
            username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
            userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null,
            order: order
         })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a order
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;