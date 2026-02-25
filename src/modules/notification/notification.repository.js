"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsReadRepo = exports.getNotificationsByUserRepo = exports.createNotificationRepo = void 0;
var prisma_1 = __importDefault(require("../../config/prisma"));
var createNotificationRepo = function (data) {
    return prisma_1.default.notification.create({ data: data });
};
exports.createNotificationRepo = createNotificationRepo;
var getNotificationsByUserRepo = function (userId) {
    return prisma_1.default.notification.findMany({ where: { userId: userId } });
};
exports.getNotificationsByUserRepo = getNotificationsByUserRepo;
var markAsReadRepo = function (id) {
    return prisma_1.default.notification.update({
        where: { id: id },
        data: { isRead: true }
    });
};
exports.markAsReadRepo = markAsReadRepo;
