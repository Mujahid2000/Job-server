import express from 'express';
const router = express.Router();
import { payparOrderCreate, payparOrderCapture } from '../controller/paypal.controller';



router.route('/create-order').post(payparOrderCreate);

// Capture order
router.route('/capture-order').post(payparOrderCapture);


export default router;
