const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            console.log("No token found");
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        console.log("Received token:", token);

        if (!token) {
            console.log("Invalid token format");
            return res.status(401).json({ error: "Invalid token format." });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified:", verified);

        req.user = verified;
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        return res.status(401).json({ error: "Invalid token." });
    }
};