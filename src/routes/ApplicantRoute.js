const express = require('express');
const ApplicantModel = require('../models/ApplicantModels');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const router = express.Router();
const multer  = require('multer');
const ResumeSchema = require('../models/ResumeSchema');
const CandidatePersonalDataSchema = require('../models/CandidatePersonalDataSchema');
const UserSchema = require('../models/UserModels')
const NotificationSchemas = require('../models/NotificationSchema');
const JobAlertSchemas = require('../models/JobAlertsSchema');
const ProfilePrivacySchemas = require('../models/ProfilePrivacySchema');
const { Types } = require('mongoose');
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });    

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


router.post('/applicant', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId, title, email, experience, education, portfolio, fullName } = req.body;

    
    const profilePictureFile = req.file;

   
    if (!profilePictureFile) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    // Cloudinary-তে ফাইল আপলোড করি (সরাসরি বাফার ব্যবহার করে)
    const uploadResult = await cloudinary.uploader.upload(
      `data:${profilePictureFile.mimetype};base64,${profilePictureFile.buffer.toString('base64')}`,
      { resource_type: 'image' }
    );

  
    const profilePictureUrl = uploadResult.secure_url;

   
    const newApplicant = new ApplicantModel({
      userId,
      profilePicture: profilePictureUrl, 
      title,
      email,
      experience,
      education,
      portfolio,
      fullName,
    });

    await newApplicant.save();

  
    res.status(201).json({ message: 'Applicant created successfully', applicant: newApplicant });
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ message: 'Error creating applicant', error: error.message });
  }
});

router.get('/resumes/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const resumes = await ResumeSchema.find({ email });
    res.status(200).json({ message: 'Resume data fetched successfully', data: resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
});


router.post('/uploadCv', upload.single('file'), async (req, res) => {
  try {
    const { resumeName, userId, email } = req.body;
    const resume = req.file;
    const resumeSize = req.file.size/1024;

    let rSize = 0
    
    if(resumeSize >= 1024){
      rSize = resumeSize/1024
    }else{
      rSize= resumeSize
    }

    
    if (!resume) {
      return res.status(400).json({ message: 'No resume file provided' });
    }

    const result = await cloudinary.uploader.upload(
      `data:${resume.mimetype};base64,${resume.buffer.toString('base64')}`,
      { resource_type: 'raw' } // PDF ফাইলের জন্য 'raw' ব্যবহার করা হয়
    );

    const resumeUrl = result.secure_url;

    const saveCvData = new ResumeSchema({
      resumeName,
      userId,
      email,
      resumeUrl,
      size: rSize
    });

    const data = await saveCvData.save();
    res.status(201).json({ message: 'CV/Resume uploaded successfully', resume: data });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ message: 'Error uploading CV', error: error.message });
  }
});

router.get('/applicant/:email', async (req, res) => {
    try {
        const applicant = await ApplicantModel.findOne({email: req.params.email});
        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }
        res.status(200).json(applicant);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applicant', error: error.message });
    }
});



router.post('/personal', async (req, res) =>{
  const { country,biography, userId, email, dateOfBirth, gender, maritalStatus, education, experience } = req.body;
  try {
     if (!country || !biography|| !dateOfBirth || !gender || !maritalStatus || !education || !experience) {
      return res.status(400).json({ message: 'Fill all data' });
    }
    const applicantPersonalData = new CandidatePersonalDataSchema({
      country,
      biography,
      dateOfBirth,
      gender,
      maritalStatus,
      education,
      experience,
      userId,
      email
    });
    const saveApplicantPersonalData = await applicantPersonalData.save();
    res.status(201).json({ message: 'personalData insert successfully', data: saveApplicantPersonalData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personal data', error: error.message });
  }
})


router.patch('/updateNotification/:id', async (req, res) => {
  try {
    const { id: userId } = req.params; // URL থেকে userId নেওয়া
    const { shortlist, jobsExpire, jobAlerts, savedProfile, rejected } = req.body;

    const allowedFields = ['shortlist', 'jobsExpire', 'jobAlerts', 'savedProfile', 'rejected'];
    const updateData = {};


    for (const field of allowedFields) {
      if (req.body[field] !== undefined) { 
        updateData[field] = req.body[field];
      }
    }

    console.log('Fields to update:', updateData); 

  
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }


    const updatedNotification = await NotificationSchemas.updateOne(
      { userId: userId }, 
      {
        $set: updateData, 
      },
      { runValidators: true }
    );

    console.log('Update result:', updatedNotification);

    if (updatedNotification.matchedCount === 0) {
      return res.status(404).json({ message: 'Notification not found for this userId' });
    }

    if (updatedNotification.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made to notification' });
    }

    res.status(200).json({ message: 'Notification updated successfully', result: updatedNotification });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});


router.get('/getNotificationData/:userId', async (req, res) =>{
  const {userId} = req.params;
 try {
  const findNotification = await NotificationSchemas.findOne({userId: userId});
  res.status(200).json({message: 'get notification data' , result: findNotification})
 } catch (error) {
  console.error('Error:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
 }
})

router.patch('/updateJobAlerts/:userId', async (req, res) =>{
  try {
    const {userId} = req.params;
    const jobAlertsData = req.body;
    const updateJobAlerts = await JobAlertSchemas.updateOne(
      {userId: userId},
      {
        $set: jobAlertsData
      },
       { runValidators: true }
      
    )
    
    if(updateJobAlerts.modifiedCount === 0){
       return res.status(400).json({ message: 'No changes made to job alerts' });
    }
    res.status(200).json({message: 'data modified success', data:updateJobAlerts})
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
})

router.get('/getJobAlertsData/:userId', async (req, res) =>{
  try {
    const {userId} = req.params;
    const jobAlertsFind = await JobAlertSchemas.findOne({userId: userId})
    res.status(200).json({message: 'data get successfully', data:jobAlertsFind})  
  } catch (error) {
    console.error('data not found', error)
  }
})


router.patch('/privacyOnOf/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const privacy = req.body;
    const updatePrivacy = await ProfilePrivacySchemas.updateOne(
      { userId: userId },
      { $set: privacy },
      { runValidators: true }
    );
    if (updatePrivacy.modifiedCount === 0) {
      return res.status(400).json({ message: 'Privacy mode not updated' });
    }
    res.status(200).json({ message: 'Updated data successfully', data: updatePrivacy });
  } catch (error) {
    console.error('Error updating privacy:', error);
    res.status(500).json({ message: 'Error updating privacy', error: error.message });
  }
});



router.get('/getProfilePrivacyData/:userId', async (req, res) =>{
  try {
    const {userId} = req.params;
    const privacyDataFindByUser = await ProfilePrivacySchemas.findOne({userId : userId});
    if(!privacyDataFindByUser){
      res.status(400).json({message: 'data not found'})
    }
    res.status(200).json({message: 'data get successfully', data: privacyDataFindByUser})
  } catch (error) {
    console.error('Error updating privacy:', error);
    res.status(500).json({ message: 'Error updating privacy', error: error.message });
  }
})

router.patch('/updatePassword/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const _userId = new Types.ObjectId(userId);
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Find user by id and current password
    const user = await UserSchema.findOne({ _id: _userId, password: currentPassword });
    if (!user) {
      return res.status(400).json({ message: 'Current password does not match' });
    }

    // Update password
    const result = await UserSchema.updateOne(
      { _id: _userId },
      { $set: { password: newPassword } },
      { runValidators: true }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made to password' });
    }

    res.status(200).json({ message: 'Password updated successfully', data:result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});


// router.put('/applicant/:id', async (req, res) => {
  //     try {
//         const updatedApplicant = await ApplicantModel.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updatedApplicant) {
//             return res.status(404).json({ message: 'Applicant not found' });
//         }
//         res.status(200).json({ message: 'Applicant updated successfully', applicant: updatedApplicant });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating applicant', error: error.message });
//     }
// });

// router.delete('/applicant/:id', async (req, res) => {
//     try {
//         const deletedApplicant = await ApplicantModel.findByIdAndDelete(req.params.id);
//         if (!deletedApplicant) {
//             return res.status(404).json({ message: 'Applicant not found' });
//         }
//         res.status(200).json({ message: 'Applicant deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting applicant', error: error.message });
//     }
// });

module.exports = router;
