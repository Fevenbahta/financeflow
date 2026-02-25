"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTokens = exports.generateToken = void 0;
// In-memory token store (replace with DB/Redis in production)
var VALID_TOKENS = {};
// Simple function to generate a random token
var generateRandomToken = function () { return Math.random().toString(36).substr(2, 16); };
var generateToken = function (req, res) {
    var userId = req.body.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    // Generate a new token
    var token = generateRandomToken();
    // Save token -> userId mapping
    VALID_TOKENS[token] = userId;
    res.json({ token: token, userId: userId });
};
exports.generateToken = generateToken;
// For debugging: list all valid tokens
var listTokens = function (_req, res) {
    res.json(VALID_TOKENS);
};
exports.listTokens = listTokens;
exports.default = { generateToken: exports.generateToken, listTokens: exports.listTokens };
