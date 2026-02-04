import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserByEmail, getAllUsers } from '../controller/user.controller';


// User Routes register and login
router.route('/userReg').post(registerUser);
router.route('/login').post(loginUser);
// User Routes get user by email
router.route('/users/:email').get(getUserByEmail);
// get all users
router.route('/users').get(getAllUsers);

export default router;
