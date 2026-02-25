"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var SECRET_KEY = "your_super_secret_key"; // replace with env variable
var generateToken = function (userId) {
    // Token expires in 7 days
    return jsonwebtoken_1.default.sign({ userId: userId }, SECRET_KEY, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
};
exports.verifyToken = verifyToken;
