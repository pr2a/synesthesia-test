import { 
  testSessions, 
  testResponses, 
  type TestSession, 
  type InsertTestSession,
  type TestResponse,
  type InsertTestResponse
} from "@shared/schema";

export interface IStorage {
  // Test Sessions
  createTestSession(session: InsertTestSession): Promise<TestSession>;
  getTestSession(sessionId: string): Promise<TestSession | undefined>;
  updateTestSession(sessionId: string, updates: Partial<TestSession>): Promise<TestSession | undefined>;
  
  // Test Responses
  createTestResponse(response: InsertTestResponse): Promise<TestResponse>;
  getTestResponses(sessionId: string, testType?: string): Promise<TestResponse[]>;
  
  // Analytics
  getTestStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScores: Record<string, number>;
  }>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, TestSession>;
  private responses: TestResponse[];
  private currentSessionId: number;
  private currentResponseId: number;

  constructor() {
    this.sessions = new Map();
    this.responses = [];
    this.currentSessionId = 1;
    this.currentResponseId = 1;
  }

  async createTestSession(insertSession: InsertTestSession): Promise<TestSession> {
    const id = this.currentSessionId++;
    const session: TestSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.sessions.set(insertSession.sessionId, session);
    return session;
  }

  async getTestSession(sessionId: string): Promise<TestSession | undefined> {
    return this.sessions.get(sessionId);
  }

  async updateTestSession(sessionId: string, updates: Partial<TestSession>): Promise<TestSession | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async createTestResponse(insertResponse: InsertTestResponse): Promise<TestResponse> {
    const id = this.currentResponseId++;
    const response: TestResponse = {
      ...insertResponse,
      id,
      createdAt: new Date(),
    };
    this.responses.push(response);
    return response;
  }

  async getTestResponses(sessionId: string, testType?: string): Promise<TestResponse[]> {
    return this.responses.filter(response => {
      if (response.sessionId !== sessionId) return false;
      if (testType && response.testType !== testType) return false;
      return true;
    });
  }

  async getTestStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScores: Record<string, number>;
  }> {
    const totalSessions = this.sessions.size;
    const completedSessions = Array.from(this.sessions.values()).filter(s => s.completedAt).length;
    
    // Calculate average scores
    const scores = Array.from(this.sessions.values())
      .filter(s => s.scores)
      .map(s => s.scores as Record<string, number>);
    
    const averageScores: Record<string, number> = {};
    if (scores.length > 0) {
      const testTypes = ['grapheme', 'number', 'sound', 'overall'];
      testTypes.forEach(type => {
        const typeScores = scores.map(s => s[type]).filter(Boolean);
        if (typeScores.length > 0) {
          averageScores[type] = typeScores.reduce((a, b) => a + b, 0) / typeScores.length;
        }
      });
    }

    return {
      totalSessions,
      completedSessions,
      averageScores,
    };
  }
}

export const storage = new MemStorage();
