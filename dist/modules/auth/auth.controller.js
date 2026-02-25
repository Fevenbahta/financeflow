"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTokens = exports.generateToken = void 0;
// In-memory token store (replace with DB/Redis in production)
const VALID_TOKENS = {};
// Simple function to generate a random token
const generateRandomToken = () => Math.random().toString(36).substr(2, 16);
const generateToken = (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    // Generate a new token
    const token = generateRandomToken();
    // Save token -> userId mapping
    VALID_TOKENS[token] = userId;
    res.json({ token, userId });
};
exports.generateToken = generateToken;
// For debugging: list all valid tokens
const listTokens = (_req, res) => {
    res.json(VALID_TOKENS);
};
exports.listTokens = listTokens;
exports.default = { generateToken: exports.generateToken, listTokens: exports.listTokens };
