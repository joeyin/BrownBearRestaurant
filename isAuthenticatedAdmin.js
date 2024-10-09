function isAuthenticatedAdmin(req, res, next) {
  if (req.session.hasOwnProperty("loggedInUser")) {
    if (req.session.loggedInUser.usertype === "admin") {
      return next();
    } else {
      res.redirect("/user/signin");
    }
  } else {
    res.redirect("/user/signin");
  }
}

module.exports = isAuthenticatedAdmin;