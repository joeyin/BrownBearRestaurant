function isAuthenticated(req, res, next) {
  if (req.session.hasOwnProperty("loggedInUser")) {
    return next();
  } else {
    res.redirect("/user/signin");
  }
}

module.exports = isAuthenticated;