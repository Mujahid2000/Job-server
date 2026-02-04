import express from 'express';
const router = express.Router();
import multer from 'multer';
import {
  postApplicant,
  getResumesByEmail,
  uploadCv,
  getApplicantByEmail,
  postPersonalData,
  updateNotification,
  getNotificationData,
  updateJobAlerts,
  getJobAlertsData,
  updatePrivacy,
  getProfilePrivacyData,
  updatePassword,
  getProfileComplete
} from '../controller/applicant.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/applicant', upload.single('profilePicture'), postApplicant);

router.get('/resumes/:email', getResumesByEmail);

router.post('/uploadCv', upload.single('file'), uploadCv);

router.get('/applicant/:email', getApplicantByEmail);

router.post('/personal', postPersonalData);

router.patch('/updateNotification/:id', updateNotification);

router.get('/getNotificationData/:userId', getNotificationData);

router.patch('/updateJobAlerts/:userId', updateJobAlerts);

router.get('/getJobAlertsData/:userId', getJobAlertsData);

router.patch('/privacyOnOf/:userId', updatePrivacy);

router.get('/getProfilePrivacyData/:userId', getProfilePrivacyData);

router.patch('/updatePassword/:userId', updatePassword);

router.get('/profileComplete/:userId', getProfileComplete);

export default router;
