import express from 'express';
const router = express.Router();
import { getSubscriptionDataByEmail, getSubscriptionDataById } from '../controller/subscription.controller';


// get subscription by email
router.route('/subscriptions/:email').get(getSubscriptionDataByEmail);


// get subscription by id
router.route('/subscription/:id').get(getSubscriptionDataById);


export default router;