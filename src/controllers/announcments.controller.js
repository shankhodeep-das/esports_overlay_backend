import { announcementModel } from "../models/announcement.model.js";


export const announcement = async (req,res) => {
    try {
        // Only allow 'admin' or 'developer'
        const authorizedRoles = ['ADMIN', 'DEVELOPER'];
        
        if (!authorizedRoles.includes(req.body.senderRole)) {
            return res.status(403).json({ message: "Not authorized to broadcast." });
        }

        // Deactivate old messages so only the new one shows
        await announcementModel.updateMany({}, { active: false });

        const newMsg = new announcementModel({
            content: req.body.content,
            senderName: req.body.senderName,
            senderRole: req.body.senderRole,
            active: true
        });

        await newMsg.save();
        res.status(201).json(newMsg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const announcementRecieved = async (req, res) => {
    try {
        // Find the single latest active message
        const latestMsg = await announcementModel.findOne({ active: true }).sort({ createdAt: -1 });
        res.status(200).json(latestMsg);
    } catch (err) {
        res.status(500).json({ message: "Error fetching announcement" });
    }
}