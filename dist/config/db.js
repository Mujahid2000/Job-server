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
exports.connectPostgreSQL = exports.pool = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// MongoDB Connection
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        yield mongoose_1.default.connect(mongoUri);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});
exports.connectMongoDB = connectMongoDB;
// PostgreSQL Connection
const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
    console.error('POSTGRES_URL is not defined in environment variables');
}
const pool = new pg_1.Pool({
    connectionString: postgresUrl,
    ssl: {
        rejectUnauthorized: false // Important for Neon and many managed DBs
    }
});
exports.pool = pool;
const connectPostgreSQL = () => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield pool.connect();
        console.log('PostgreSQL connected successfully');
    }
    catch (error) {
        console.error('PostgreSQL connection error:', error);
        process.exit(1);
    }
    finally {
        if (client) {
            client.release(); // 🔥 Only release if it was actually connected
        }
    }
});
exports.connectPostgreSQL = connectPostgreSQL;
