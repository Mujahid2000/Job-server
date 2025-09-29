const express = require('express');
const router = express.Router();
const UserSchema = require('../models/UserModels'); 
const JobAlertSchemas = require('../models/JobAlertsSchema');
const ProfilePrivacySchemas = require('../models/ProfilePrivacySchema');
const NotificationSchemas = require('../models/NotificationSchema');

router.post('/userReg', async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    if (!name || !email || !password || !role || !phoneNumber) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const session = await UserSchema.startSession();
    session.startTransaction();

    try {
        // Create a new user instance
        const newUser = new UserSchema({
            name,
            email,
            password, // In a real application, hash the password before saving
            role,
            phoneNumber,
        });

        // Save the user within the transaction
        const saveUserData = await newUser.save({ session });

        // If role is applicant, create default records within the transaction
        if (role.toLowerCase() === 'applicant') {
            const notificationData = new NotificationSchemas({
                userId: saveUserData._id,
                shortlist: false,
                jobsExpire: false,
                jobAlerts: false,
                savedProfile: false,
                rejected: false,
            });
            await notificationData.save({ session });

            const jobAlertData = new JobAlertSchemas({
                userId: saveUserData._id,
                jobRole: '',
                location: '',
            });
            await jobAlertData.save({ session });

            const profilePrivacyData = new ProfilePrivacySchemas({
                userId: saveUserData._id,
                profilePublic: false,
                resumePublic: false,
            });
            await profilePrivacyData.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'User registered successfully', user: saveUserData });
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
});

// Get all users
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email and password
        const user = await UserSchema.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'User found', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});


router.get('/users/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Find user by email
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User found', user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await UserSchema.aggregate([
  {
    $addFields: {
      idString: { $toString: "$_id" } // Convert ObjectId to string
    }
  },
  {
    $lookup: {
      from: "payments",
      localField: "idString",      // Now a string version of _id
      foreignField: "userId",      // String field in payments
      as: "userData"
    }
  },
  {
    $unwind: {
      path: "$userData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $set: {
      packageName: "$userData.packageName",
      formatDate: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt"

        }
      }
      
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      packageName: 1,
      date: "$formatDate"
  		
    }
  }
]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
});

module.exports = router;
