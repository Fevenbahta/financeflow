"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.loginUser = exports.createUser = void 0;
const user_service_1 = require("./user.service");
const service = new user_service_1.UserService();
const createUser = async (req, res) => {
    try {
        const { user, token } = await service.createUser(req.body);
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    try {
        const { email } = req.body;
        const { user, token } = await service.loginUser(email);
        res.json({ user, token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const getUser = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await service.getUser(id);
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getUser = getUser;
