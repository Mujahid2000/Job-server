import express from 'express';
const router = express.Router();
import { 
  getNotificationData, 
  sendNotificationCustomerProfile, 
  customerMessageForAdmin, 
  adminMessageForCustomer } from 
  '../controller/notificationdata.controller';


router.route('/notificationData/:userId').get(getNotificationData);

router.route('/customerProfile/:senderId').get(sendNotificationCustomerProfile);

router.route('/customerMessageForAdmin/:customerId').get(customerMessageForAdmin)

router.route('/adminMessageForCustomer').get(adminMessageForCustomer);


export default router;