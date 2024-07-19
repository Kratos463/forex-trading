const jwt = require("jsonwebtoken");
const { extractTokenFromHeader } = require("../utils/helper");
const User = require("../models/user.model");

const verifyUser = async (req, res, next) => {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: "Authorization failed: No token provided.", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(403).json({ error: "Access denied: User not found.", success: false });
        }

        if (user.isDisabled) {
            return res.status(403).json({ error: "Your account has been disabled. Please contact support for assistance.", success: false });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please log in again.", success: false });
        }
        return res.status(401).json({ error: "Authorization failed: Invalid token.", success: false });
    }
};

module.exports = verifyUser;
