import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import { connectMongoDB, connectPostgreSQL, pool } from './config/db';
import jwtMiddleware from './middlewareFolder/JWTTokenMiddleware';
import AccountSetupRoute from './routes/AccountSetupRoute';
import applicant from './routes/ApplicantRoute';
import AppliedJobs from './routes/AppliedJobsRoute';
import candidateRoute from './routes/CandidateRoute';
import CompanyRoute from './routes/CompanyRoute';
import JobApplicationRoute from './routes/JobApplicationRoute';
import liveNotification from './routes/LiveNotification';
import notificationData from './routes/NotificationData';
import PaypalRoutes from './routes/PaypalRoutes';
import shortList from './routes/ShortListedRoute';
import SubscriptionRoutes from './routes/SubscriptionData';
import Tags from './routes/TagsRoute';
import user from './routes/UserRoute';

// Load environment variables
dotenv.config();
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || '']
    : ['http://localhost:3000', 'https://my-job-brown.vercel.app'];

// Initialize Express app
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: false
    },
    transports: ['websocket', 'polling']
});

// Pass io to routes (extending Request type locally for now, or just implicit any)
app.use((req: any, res, next) => {
    req.io = io; // Attach io to request object
    next();
});

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'index.html'));
});
// main route path
app.use('/user', user);
app.use('/applicantData', applicant);
app.use('/companyData', AccountSetupRoute);
app.use('/jobs', JobApplicationRoute);
app.use('/api/paypal', PaypalRoutes);
app.use('/data/payments', SubscriptionRoutes);
app.use('/tags', Tags);
app.use('/getCompanyData', CompanyRoute);
app.use('/appliedJobs', AppliedJobs);
app.use('/shortList', shortList);
app.use('/candidateJobApplyData', candidateRoute);
app.use('/liveNotification', liveNotification);
app.use('/notification', notificationData);
app.use('/jwt', jwtMiddleware);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);

    // Join user to their own room based on userId
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
    });
});

// Server setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectMongoDB();
        await connectPostgreSQL();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await pool.end();
    await mongoose.connection.close();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

startServer();
