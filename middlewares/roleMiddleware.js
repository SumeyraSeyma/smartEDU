module.exports = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role;
        if (!roles.includes(userRole)) {
            return res.status(401).send("you are not authorized to use transaction");
        }
        next();
    };
}