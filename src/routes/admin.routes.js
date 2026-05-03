import express from 'express';
import { getPendingRequests, handleUserRequest } from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { createMatch, getMatchById, updateTeamStats, getAllUpcomingMatches } from '../controllers/match.controller.js';

const router = express.Router();

// Route to see the list of people who clicked 'request'
router.get('/pending-members', getPendingRequests);

// Route to approve or reject them
router.post('/handle-request', handleUserRequest);

// Route: POST /api/admin/create-match
router.post('/create-match',verifyToken, createMatch);
router.get('/get-all-match',verifyToken, getAllUpcomingMatches);

router.get('/get-match/:id', getMatchById);
router.post('/update-team', updateTeamStats);

export default router;