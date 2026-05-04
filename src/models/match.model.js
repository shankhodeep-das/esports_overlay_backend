import mongoose from 'mongoose';

// Individual Team Stats for THIS specific match
const teamMatchStatsSchema = new mongoose.Schema({
    slotNumber: { type: Number, required: true },
    teamName: { type: String, default: "TBD" }, 
    kills: { type: Number, default: 0 },
    placement: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    aliveCount: { type: Number, default: 4, min: 0, max: 4 },
    teamBg: { type: String, default: "" }
});

const matchSchema = new mongoose.Schema({
    matchTitle: { type: String, required: true }, 
    matchNumber: { type: Number, default: 1 },    
    mapName: { type: String, required: true },
    matchId: { type: String, unique: true, required: true },
    editorPin: { type: String, required: true },
    sheetId: { type: String, required: true },
    
    // The teams for this specific match
    teams: [teamMatchStatsSchema],

    status: { 
        type: String, 
        enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], 
        default: 'UPCOMING' 
    }
}, { timestamps: true });

export const Match = mongoose.model('Match', matchSchema);