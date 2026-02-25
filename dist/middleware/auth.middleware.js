"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utiles/jwt");
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ message: "Authentication token required" });
    const token = authHeader.split(" ")[1]; // Expect Bearer <token>
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
