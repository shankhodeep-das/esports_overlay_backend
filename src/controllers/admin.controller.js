import { userModel } from '../models/authorisiedUser.model.js';

// 1. Get all pending requests
export const getPendingRequests = async (req, res) => {
    try {
        // Find users where status is exactly 'PENDING'
        const pendingUsers = await userModel.find({ status: 'PENDING' });
        console.log("DB result:",pendingUsers);
        
        
        res.status(200).json({
            total_pending_members: pendingUsers.length,
            pending_members: pendingUsers
        });
    }catch (error) {
        res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

// 2. Accept or Reject a request
export const handleUserRequest = async (req, res) => {
    try {
        const { userId, action } = req.body; // action will be 'APPROVED' or 'REJECTED'

        // Check if the action is valid
        if (!['APPROVED', 'REJECTED'].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Use APPROVED or REJECTED." });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { status: action },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: `User has been ${action.toLowerCase()} successfully.`,
            user: updatedUser
            });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};