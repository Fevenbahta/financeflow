"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("./user.controller");
var auth_middleware_1 = require("../../middleware/auth.middleware");
var router = (0, express_1.Router)();
router.post("/register", user_controller_1.createUser); // register new user
router.post("/login", user_controller_1.loginUser); // login user by email
router.get("/:id", auth_middleware_1.authenticate, user_controller_1.getUser); // get user info (protected)
exports.default = router;
