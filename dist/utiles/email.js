"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Sends an email using Gmail SMTP
 * @param to Recipient email address
 * @param subject Email subject
 * @param text Email body
 */
const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email credentials are not set in environment variables");
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
    }
    catch (error) {
        console.error("Failed to send email:", error.message);
        throw error; // re-throw to handle in controllers
    }
};
exports.sendEmail = sendEmail;
