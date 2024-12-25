const User = require("../models/User");

module.exports = (req, res, next) => {
    if (!req.session.userID) {
        return res.status(401).redirect("/login");
    }
    next();
};
