const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/user');
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Seed data
const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();

        // Create users
        await User.create([
            {
                username: 'admin@test.com',
                password: 'admin',
                usertype: "admin"
            },
            {
                username: 'customer@test.com',
                password: 'customer',
                usertype: "customer"
            },
            {
                username: 'deliveryman@test.com',
                password: 'deliveryman',
                usertype: "deliveryman"
            },
        ]);
        await Product.create([
            {
                name: 'Family Bucket Feast',
                price: 49.99,
                describtion: '1180 Cals/Person   Serves 5',
                imgsrc: '/img/KFC_CA_Family_Bucket_Feast.png'
            },
            {
                name: '4 Piece Original Recipe Box',
                price: 17.49,
                describtion: '1790 Cals   Serves 1',
                imgsrc: '/img/BigBoxMeal_4Piece.png'
            },
            {
                name: '3 Original Recipe Tenders Box Meal',
                price: 15.49,
                describtion: '1350 Cals   Serves 1',
                imgsrc: '/img/Tenders_Boneless_Box.png'
            },
            {
                name: 'KFC Famous Chicken Sandwich Box Meal',
                price: 15.99,
                describtion: '1430 Cals   Serves 1',
                imgsrc: '/img/Sandwich_FCCS_boxmeal.png'
            },
            {
                name: 'Big Crunch Sandwich Box Meal',
                price: 14.99,
                describtion: '1590 Cals   Serves 1',
                imgsrc: '/img/BigCrunch_boxmeal.png'
            },
            {
                name: 'KFC Famous Chicken Sandwich Combo',
                price: 12.99,
                describtion: '1240 Cals   Serves 1',
                imgsrc: '/img/Sandwich_FCCS_combo.png'
            }
        ])
        console.log('Seed data created successfully');
    } catch (error) {
        console.error('Error creating seed data:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedData()