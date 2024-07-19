const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const { extractTokenFromHeader } = require("../utils/helper");

const verifySuperAdmin = async (req, res, next) => {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: "Authorization failed: No token provided.", success: false });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(403).json({ error: "Access denied: Admin not found.", success: false });
        }

        if (admin.role !== "superadmin") {
            return res.status(403).json({ error: "Access denied: You do not have super admin privileges.", success: false });
        }

        req.superadmin = admin;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please log in again.", success: false });
        }
        return res.status(401).json({ error: "Authorization failed: Invalid token.", success: false });
    }
};

module.exports = verifySuperAdmin;
