"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var jwt_1 = require("../utiles/jwt");
var authenticate = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    if (!authHeader)
        return res.status(401).json({ message: "Authentication token required" });
    var token = authHeader.split(" ")[1]; // Expect Bearer <token>
    try {
        var payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
