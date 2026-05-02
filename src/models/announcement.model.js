import mongoose from "mongoose";
const announcementSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const announcementModel = mongoose.model("Announcement", announcementSchema);