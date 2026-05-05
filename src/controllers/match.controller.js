import { Match } from '../models/match.model.js';
import mongoose from "mongoose"
import crypto from 'crypto';

export const createMatch = async (req, res) => {
    try {
        const { matchTitle, mapNames, sheetId, matchCount, teamCount } = req.body;

        const finalMatchCount = Number(matchCount) || 1; 
        const finalTeamCount = Number(teamCount) || 12;

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
        for (let i = 0; i < finalMatchCount; i++) {
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
        res.status(500).json({ success: false, message: error.message, errorDetails: error });
    }
};

export const getAllUpcomingMatches = async (req, res) => {
    try {
        // Filter matches where status is strictly 'UPCOMING'
        // We also sort by 'createdAt' descending so the newest series appears first
        const matches = await Match.find({ status: 'UPCOMING' }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: matches.length,
            matches
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to retrieve upcoming matches" 
        });
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
    // MOVE LOG TO THE TOP - This must show up in your terminal
    console.log("--- INCOMING REQUEST ---");
    console.log("Body Content:", JSON.stringify(req.body, null, 2));

    try {
        const { matchId, slotNumber, kills, aliveCount, teamName, teamBg, teamLogo } = req.body;
        
        const numericKills = kills === '' ? 0 : Number(kills);

        // Change: Use only $set and remove runValidators temporarily to debug
        const updatedMatch = await Match.findOneAndUpdate(
            { _id: matchId, "teams.slotNumber": Number(slotNumber) },
            { 
                $set: { 
                    "teams.$.kills": numericKills,
                    "teams.$.aliveCount": Number(aliveCount),
                    "teams.$.teamName": teamName,
                    "teams.$.teamBg": teamBg,
                    "teams.$.teamLogo": teamLogo // Ensure this matches payload key exactly
                } 
            },
            { new: true, strict: false } // strict: false allows the field even if schema is 'stale'
        );

        if (!updatedMatch) {
            console.log("❌ Match or Slot not found for ID:", matchId);
            return res.status(404).json({ success: false, message: "Match or Slot not found" });
        }

        console.log("✅ Database Updated Successfully");
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ CRITICAL DB ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMatchForOverlay = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the match in the database
        const match = await Match.findById(id);

        if (!match) {
            return res.status(404).json({ 
                success: false, 
                message: "Match not found" 
            });
        }

        // Send the match data back to the overlay
        res.status(200).json(match);
    } catch (error) {
        console.error("Error fetching match:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching match data" 
        });
    }
};