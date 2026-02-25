"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsReadRepo = exports.getNotificationsByUserRepo = exports.createNotificationRepo = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createNotificationRepo = (data) => prisma_1.default.notification.create({ data });
exports.createNotificationRepo = createNotificationRepo;
const getNotificationsByUserRepo = (userId) => prisma_1.default.notification.findMany({ where: { userId } });
exports.getNotificationsByUserRepo = getNotificationsByUserRepo;
const markAsReadRepo = (id) => prisma_1.default.notification.update({
    where: { id },
    data: { isRead: true }
});
exports.markAsReadRepo = markAsReadRepo;
