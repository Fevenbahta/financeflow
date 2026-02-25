"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// routes/budget.routes.ts
var express_1 = require("express");
var controller = __importStar(require("./budget.controller"));
var auth_middleware_1 = require("../../middleware/auth.middleware");
var router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, controller.createBudget);
router.get("/", auth_middleware_1.authenticate, controller.getBudgets);
router.get("/user/:userId", auth_middleware_1.authenticate, controller.getBudgets);
router.get("/analyze", auth_middleware_1.authenticate, controller.analyze);
router.post("/check-purchase", auth_middleware_1.authenticate, controller.checkPurchase);
router.delete("/:id", auth_middleware_1.authenticate, controller.deleteBudget); // Add this line
router.put("/:id", auth_middleware_1.authenticate, controller.updateBudget); // Add this line
exports.default = router;
