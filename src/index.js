const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const { connectMongoDB, connectPostgreSQL, pool } = require('./config/db');
const user = require('./routes/UserRoute');
const applicant = require('./routes/ApplicantRoute');
const AccountSetupRoute = require('./routes/AccountSetupRoute');
const JobApplicationRoute = require('./routes/JobApplicationRoute');
const PaypalRoutes = require('./routes/PaypalRoutes');
const SubscriptionRoutes = require('./routes/SubscriptionData');
const Tags = require('./routes/TagsRoute');
const CompanyRoute = require('./routes/CompanyRoute');
const AppliedJobs = require('./routes/AppliedJobsRoute');
const shortList = require('./routes/ShortListedRoute');
const candidateRoute = require('./routes/CandidateRoute');
const liveNotification = require('./routes/LiveNotification');
const notificationData = require('./routes/NotificationData')
// Load environment variables
dotenv.config();
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:3000', 'https://my-job-brown.vercel.app'];
// Initialize Express app
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
    transports: ['websocket', 'polling']
  },
});

// Pass io to routes
app.use((req, res, next) => {
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
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

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
app.use('/notification', notificationData)
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