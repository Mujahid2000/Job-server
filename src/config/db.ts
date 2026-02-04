import mongoose from 'mongoose';
import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// PostgreSQL Connection
const postgresUrl = process.env.POSTGRES_URL;
if (!postgresUrl) {
    console.error('POSTGRES_URL is not defined in environment variables');
}

const pool = new Pool({
    connectionString: postgresUrl,
    ssl: {
        rejectUnauthorized: false // Important for Neon and many managed DBs
    }
});

const connectPostgreSQL = async () => {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log('PostgreSQL connected successfully');
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        process.exit(1);
    } finally {
        if (client) {
            client.release(); // 🔥 Only release if it was actually connected
        }
    }
};

export { connectMongoDB, pool, connectPostgreSQL };