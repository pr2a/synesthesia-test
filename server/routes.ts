import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestSessionSchema, insertTestResponseSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

// Test configuration data
const testConfig = {
  grapheme: {
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
      '#F1948A', '#C39BD3', '#7FB3D3', '#A8A8A8', '#FFB3BA', '#BAFFC9',
      '#BAE1FF', '#FFFFBA', '#FFD1DC', '#E0BBE4', '#957DAD', '#FEC89A'
    ]
  },
  number: {
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
      '#F1948A', '#C39BD3', '#7FB3D3', '#A8A8A8'
    ]
  },
  sound: {
    items: [
      { id: 'piano-c4', name: 'Piano Note C4' },
      { id: 'violin-a', name: 'Violin A' },
      { id: 'thunder', name: 'Thunder' },
      { id: 'rain', name: 'Rain' },
      { id: 'bell', name: 'Bell' },
      { id: 'guitar-chord', name: 'Guitar Chord' },
      { id: 'flute', name: 'Flute' },
      { id: 'drum-beat', name: 'Drum Beat' },
      { id: 'ocean-waves', name: 'Ocean Waves' },
      { id: 'bird-song', name: 'Bird Song' },
      { id: 'car-horn', name: 'Car Horn' },
      { id: 'wind', name: 'Wind' }
    ],
    colors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ]
  }
};

// Scoring algorithm functions
function calculateConsistencyScore(responses: any[]): number {
  if (responses.length < 2) return 0;
  
  // Group responses by stimulus
  const stimulusGroups: Record<string, string[]> = {};
  responses.forEach(response => {
    if (!stimulusGroups[response.stimulus]) {
      stimulusGroups[response.stimulus] = [];
    }
    stimulusGroups[response.stimulus].push(response.response.color || response.response);
  });
  
  // Calculate consistency for each stimulus
  let totalConsistency = 0;
  let stimulusCount = 0;
  
  Object.values(stimulusGroups).forEach(colors => {
    if (colors.length > 1) {
      // Calculate how many times the most common color appears
      const colorCounts: Record<string, number> = {};
      colors.forEach(color => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
      
      const maxCount = Math.max(...Object.values(colorCounts));
      const consistency = maxCount / colors.length;
      totalConsistency += consistency;
      stimulusCount++;
    }
  });
  
  return stimulusCount > 0 ? (totalConsistency / stimulusCount) * 100 : 0;
}

function calculateOverallScore(scores: Record<string, number>): number {
  const validScores = Object.values(scores).filter(score => score > 0);
  if (validScores.length === 0) return 0;
  return validScores.reduce((a, b) => a + b, 0) / validScores.length;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get test configuration
  app.get("/api/test-config", (req, res) => {
    res.json(testConfig);
  });

  // Create new test session
  app.post("/api/test-session", async (req, res) => {
    try {
      const sessionData = {
        sessionId: nanoid(),
        testType: req.body.testType || 'all',
        responses: {},
        scores: null,
        completedAt: null
      };
      
      const validatedData = insertTestSessionSchema.parse(sessionData);
      const session = await storage.createTestSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Failed to create test session:", error);
      res.status(400).json({ error: "Failed to create test session" });
    }
  });

  // Get test session
  app.get("/api/test-session/:sessionId", async (req, res) => {
    try {
      const session = await storage.getTestSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Failed to get test session:", error);
      res.status(500).json({ error: "Failed to get test session" });
    }
  });

  // Submit test response
  app.post("/api/test-response", async (req, res) => {
    try {
      const responseData = insertTestResponseSchema.parse(req.body);
      const response = await storage.createTestResponse(responseData);
      res.json(response);
    } catch (error) {
      console.error("Failed to save test response:", error);
      res.status(400).json({ error: "Failed to save test response" });
    }
  });

  // Complete test and calculate scores
  app.post("/api/test-session/:sessionId/complete", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getTestSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Get all responses for this session
      const responses = await storage.getTestResponses(sessionId);
      
      // Calculate scores for each test type
      const scores: Record<string, number> = {};
      
      const testTypes = ['grapheme', 'number', 'sound'];
      for (const testType of testTypes) {
        const testResponses = responses.filter(r => r.testType === testType);
        if (testResponses.length > 0) {
          scores[testType] = calculateConsistencyScore(testResponses);
        }
      }
      
      scores.overall = calculateOverallScore(scores);
      
      // Update session with scores and completion time
      const updatedSession = await storage.updateTestSession(sessionId, {
        scores,
        completedAt: new Date()
      });
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Failed to complete test:", error);
      res.status(500).json({ error: "Failed to complete test" });
    }
  });

  // Get test statistics
  app.get("/api/test-stats", async (req, res) => {
    try {
      const stats = await storage.getTestStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to get test stats:", error);
      res.status(500).json({ error: "Failed to get test stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
