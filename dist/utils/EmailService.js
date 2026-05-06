"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
const logger_1 = require("./logger");
console.log('EMAIL_USER:', config_1.config.email.user);
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.pass,
    },
});
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: config_1.config.email.user || '"Job Portal" <noreply@jobportal.com>',
            to,
            subject,
            html,
        };
        const info = yield transporter.sendMail(mailOptions);
        logger_1.logger.info(`Email sent: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error('NODEMAILER ERROR:', error);
        logger_1.logger.error('Error sending email:', error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
