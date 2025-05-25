const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
const { connectMongoDB, connectPostgreSQL, pool } = require('./config/db');
const user = require('./routes/UserRoute');
const applicant = require('./routes/ApplicantRoute');
const AccountSetupRoute  = require('./routes/AccountSetupRoute');
const JobApplicationRoute = require('./routes/JobApplicationRoute')
const PaypalRoutes = require('./routes/PaypalRoutes');
const SubscriptionRoutes = require('./routes/SubscriptionData');
const Tags = require('./routes/TagsRoute');
const CompanyRoute = require('./routes/CompanyRoute');
const AppliedJobs = require('./routes/AppliedJobsRoute');
const shortList = require('./routes/ShortListedRoute');
const candidateRoute = require('./routes/CandidateRoute')
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// app.use('/api/mongo/users', mongoUsersRoutes);
// app.use('/api/pg/users', pgUsersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Server setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to databases
        await connectMongoDB();
        await connectPostgreSQL();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port to ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};


app.use('/user', user)
app.use('/applicantData', applicant)
app.use('/companyData', AccountSetupRoute)
app.use('/jobs', JobApplicationRoute)
app.use('/api/paypal', PaypalRoutes);
app.use('/data/payments', SubscriptionRoutes);
app.use('/tags', Tags);
app.use('/getCompanyData', CompanyRoute);
app.use('/appliedJobs', AppliedJobs);
app.use('/shortList', shortList);
app.use('/candidateJobApplyData', candidateRoute)

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await pool.end();
    await mongoose.connection.close();
    process.exit(0);
});

startServer();