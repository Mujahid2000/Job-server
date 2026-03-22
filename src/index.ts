import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { Server } from 'socket.io';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectMongoDB, connectPostgreSQL, pool } from './config/db';
import jwtMiddleware from './middleware/JWTTokenMiddleware';
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
import { errorMiddleware } from './middleware/errorMiddleware';
import { config } from './config/config';
import { logger } from './utils/logger';

// CORS setup
const allowedOrigins = config.env === 'production'
    ? [config.frontendUrl || '']
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

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal API',
            version: '1.0.0',
            description: 'API documentation for the Job Portal application',
        },
        servers: [
            {
                url: config.env === 'production'
                    ? 'https://job-server-fqvf.onrender.com'
                    : `http://localhost:${config.port}`,
                description: 'Server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use((req, res) => res.status(404).json({ error: 'Not Found' }))
app.use(errorMiddleware);

// Socket.IO connection
io.on('connection', (socket) => {
    logger.info(`a user connected ${socket.id}`);

    // Join user to their own room based on userId
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(userId);
            logger.info(`User ${userId} joined their room`);
        }
    });

    socket.on('disconnect', () => {
        logger.info(`user disconnected ${socket.id}`);
    });
});

// Server setup
const PORT = config.port;

const startServer = async () => {
    try {
        await connectMongoDB();
        await connectPostgreSQL();
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Server startup error:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await pool.end();
    await mongoose.connection.close();
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

startServer();
