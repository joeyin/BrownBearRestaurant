const express = require('express');
const router = express.Router();
const User = require('../models/user');

function validateInput(body) {
    const validType = ['customer', 'admin', 'deliveryman']
    if (!validType.includes(body.userType)){
        throw new Error(`Invalid status: ${body.userType}. Must be one of ${validType.join(', ')}`);
    }
}

//Sign In page
router.get("/signin", (req, res) => {
    return res.render("user/signIn.ejs", {
        username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
        userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null
    })
})

//Sign Up page
router.get("/signup", (req, res) => {
    return res.render("user/signUp.ejs", {
        username: req.session.loggedInUser ? req.session.loggedInUser.username : null,
        userType: req.session.loggedInUser ? req.session.loggedInUser.usertype : null
    })
})

router.post('/signup', async (req, res) => {
    try {
        validateInput(req.body)
        const inputUsername = req.body.email
        const inputPwd = req.body.password
        const inputPwd2 = req.body.re_password
        if (inputPwd !== inputPwd2) {
            throw new Error('Password is not same as Retype Password')
        }
        const checkUser = await User.find({ username: inputUsername });
        if (checkUser.length !== 0) {
            throw new Error(`${inputUsername} already exist!`)
        }
        const user = new User({
            username: inputUsername,
            password: inputPwd,
            usertype: req.body.userType
        });
        await user.save();
        req.session.loggedInUser = user
        res.redirect("/")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const results = await User.find({ username: req.body.email })

        if (results.length === 0) {
            throw new Error("ERROR: This user does not exist")
        }

        const userFromDB = results[0]

        if (userFromDB.password !== req.body.password) {
            throw new Error(`ERROR: Incorrect username or password`)
        }
        req.session.loggedInUser = userFromDB
        return res.redirect("/")
    } catch (err) {
        return res.redirect(`/signin?message=${err.message}`);
    }
});

router.get("/logout", (req, res) => {
    // delete the entire session
    req.session.destroy()
    return res.redirect("/")
})

module.exports = router;