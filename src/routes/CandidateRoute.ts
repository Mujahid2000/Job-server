import express from 'express';
const router = express.Router();
import { candidateApplyJobList, candidateFavouriteJobList, candidateList } from '../controller/candidate.controller';


router.route('/candidateApplyJobList/:userId').get(candidateApplyJobList);

router.route('/candidateFavoriteJobList/:email').get(candidateFavouriteJobList);

router.route('/candidateList').get(candidateList);

export default router;
