import { userModel } from '../models/authorisiedUser.model.js';
import { Match } from "../models/match.model.js";
import os from 'os';



export const getStats = async (req, res) => {
  try {
    // Count total documents in your User collection
    const userCount = await userModel.countDocuments();
    const matchCount = await Match.countDocuments();
    
    res.status(200).json({
      success: true,
      totalMembers: userCount,
      totalMatches: matchCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const latency = async (req, res) => {
    res.status(200).send("pong");       // yea sirf latency check karne ka lia banaya gaya ha bas...
}



export const getServerLoad = (req, res) => {
  // Calculate Memory Usage
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  // Convert to percentage
  const memoryLoad = Math.round((usedMemory / totalMemory) * 100);

  // Get CPU Average (Load Average for the last 1 minute)
  // This returns an array [1min, 5min, 15min]. 1.0 means 100% of 1 core.
  const loadAvg = os.loadavg()[0]; 
  const cpuLoad = Math.min(Math.round(loadAvg * 100), 100);

  res.json({
    success: true,
    serverLoad: memoryLoad, // You can choose to show Memory or CPU
    region: "Oregon, US" // You can hardcode this or use env variables
  });
};