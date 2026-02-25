"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
const jwt_1 = require("../../utiles/jwt");
class UserService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
    }
    async createUser(data) {
        const existing = await this.userRepo.findByEmail(data.email);
        if (existing)
            throw new Error("User already exists");
        const user = await this.userRepo.create(data);
        // Generate token on registration
        const token = (0, jwt_1.generateToken)(user.id);
        return { user, token };
    }
    async loginUser(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user)
            throw new Error("User not found");
        // Generate token on login
        const token = (0, jwt_1.generateToken)(user.id);
        return { user, token };
    }
    async getUser(id) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new Error("User not found");
        return user;
    }
}
exports.UserService = UserService;
