const mongoose = require('mongoose');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config()

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false // Important for Neon and many managed DBs
    }
});


const connectPostgreSQL = async () => {
    let client;
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


module.exports = { connectMongoDB, pool, connectPostgreSQL };