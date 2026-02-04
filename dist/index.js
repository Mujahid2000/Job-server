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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const db_1 = require("./config/db");
const JWTTokenMiddleware_1 = __importDefault(require("./middlewareFolder/JWTTokenMiddleware"));
const AccountSetupRoute_1 = __importDefault(require("./routes/AccountSetupRoute"));
const ApplicantRoute_1 = __importDefault(require("./routes/ApplicantRoute"));
const AppliedJobsRoute_1 = __importDefault(require("./routes/AppliedJobsRoute"));
const CandidateRoute_1 = __importDefault(require("./routes/CandidateRoute"));
const CompanyRoute_1 = __importDefault(require("./routes/CompanyRoute"));
const JobApplicationRoute_1 = __importDefault(require("./routes/JobApplicationRoute"));
const LiveNotification_1 = __importDefault(require("./routes/LiveNotification"));
const NotificationData_1 = __importDefault(require("./routes/NotificationData"));
const PaypalRoutes_1 = __importDefault(require("./routes/PaypalRoutes"));
const ShortListedRoute_1 = __importDefault(require("./routes/ShortListedRoute"));
const SubscriptionData_1 = __importDefault(require("./routes/SubscriptionData"));
const TagsRoute_1 = __importDefault(require("./routes/TagsRoute"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
// Load environment variables
dotenv_1.default.config();
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || '']
    : ['http://localhost:3000', 'https://my-job-brown.vercel.app'];
// Initialize Express app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: false
    },
    transports: ['websocket', 'polling']
});
// Pass io to routes (extending Request type locally for now, or just implicit any)
app.use((req, res, next) => {
    req.io = io; // Attach io to request object
    next();
});
// Middleware
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: false,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'template', 'index.html'));
});
// main route path
app.use('/user', UserRoute_1.default);
app.use('/applicantData', ApplicantRoute_1.default);
app.use('/companyData', AccountSetupRoute_1.default);
app.use('/jobs', JobApplicationRoute_1.default);
app.use('/api/paypal', PaypalRoutes_1.default);
app.use('/data/payments', SubscriptionData_1.default);
app.use('/tags', TagsRoute_1.default);
app.use('/getCompanyData', CompanyRoute_1.default);
app.use('/appliedJobs', AppliedJobsRoute_1.default);
app.use('/shortList', ShortListedRoute_1.default);
app.use('/candidateJobApplyData', CandidateRoute_1.default);
app.use('/liveNotification', LiveNotification_1.default);
app.use('/notification', NotificationData_1.default);
app.use('/jwt', JWTTokenMiddleware_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectMongoDB)();
        yield (0, db_1.connectPostgreSQL)();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
});
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGTERM signal received: closing HTTP server');
    yield db_1.pool.end();
    yield mongoose_1.default.connection.close();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
}));
startServer();
