"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const candidate_controller_1 = require("../controller/candidate.controller");
router.route('/candidateApplyJobList/:userId').get(candidate_controller_1.candidateApplyJobList);
router.route('/candidateFavoriteJobList/:email').get(candidate_controller_1.candidateFavouriteJobList);
router.route('/candidateList').get(candidate_controller_1.candidateList);
exports.default = router;
