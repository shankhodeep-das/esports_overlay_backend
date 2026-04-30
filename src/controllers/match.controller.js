import { Match } from '../models/match.model.js';
import mongoose from "mongoose"
import crypto from 'crypto';

export const createMatch = async (req, res) => {
    try {
        const { matchTitle, mapNames, sheetId, matchCount, teamCount } = req.body;

        const finalTeamCount = teamCount || 12;

        if(finalTeamCount>25){
            return res.status(400).json({
                message:`Are you joking with me ??? ${finalTeamCount} this much players !!!`
            })
        }

        // 1. Generate a shared Editor PIN for the series
        const sharedPin = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 2. Generate a Shared Series ID if it's a series
        const seriesId = `SERIES-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const createdMatches = [];

        // 3. Loop to create matches (if matchCount is 1, it runs once)
        for (let i = 0; i < matchCount; i++) {
            const newMatch = new Match({
                matchTitle: matchCount > 1 ? `${matchTitle} - Game ${i + 1}` : matchTitle,
                matchNumber: i + 1,
                mapName: Array.isArray(mapNames) ? mapNames[i] : mapNames,
                matchId: matchCount > 1 ? `${seriesId}-G${i + 1}` : `M${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
                editorPin: sharedPin,
                sheetId: sheetId,
                status: 'UPCOMING',
                // Initialize empty slots (e.g., 20 slots)
                teams: Array.from({ length: finalTeamCount }, (_, index) => ({
                    slotNumber: index + 1,
                    teamName: "TBD"
                }))
            });

            const savedMatch = await newMatch.save();
            createdMatches.push(savedMatch);
        }

        res.status(201).json({
            success: true,
            message: `${matchCount} matches created successfully.`,
            sharedPin: sharedPin,
            matches: createdMatches
        });

    } catch (error) {
        console.error("Match Creation Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match.findById(id);

        if (!match) {
            return res.status(404).json({ success: false, message: "Match not found" });
        }

        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTeamStats = async (req, res) => {
    try {
        const { matchId, slotNumber, kills, isEliminated, teamName } = req.body;
        console.log("Data received from Sheet:", req.body);
        const numericKills = kills === '' ? 0 : Number(kills);
        const boolEliminated = isEliminated === true || isEliminated === "true";
        const updatedMatch = await Match.findOneAndUpdate(
            { _id: matchId, "teams.slotNumber": Number(slotNumber) },
            { 
                $set: { 
                    "teams.$.kills": numericKills,
                    "teams.$.isEliminated": boolEliminated,
                    "teams.$.teamName": teamName 
                } 
            },
            { new: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ success: false, message: "Match or Slot not found" });
        }

        res.status(200).json({ success: true, message: "Stats Updated!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};