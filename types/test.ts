export interface TestConfig {
  grapheme: {
    items: string[];
    colors: string[];
  };
  number: {
    items: string[];
    colors: string[];
  };
  sound: {
    items: Array<{
      id: string;
      name: string;
      audioUrl?: string;
    }>;
    colors: string[];
  };
}

export interface TestResponse {
  stimulus: string;
  response: string | string[]; // Single color for grapheme/number, multiple for sound
  responseTime: number;
  timestamp: number;
}

export interface TestSession {
  id: number;
  sessionId: string;
  testType: string;
  responses: Record<string, any>;
  scores?: {
    grapheme?: number;
    number?: number;
    sound?: number;
    overall?: number;
  };
  completedAt?: Date;
  createdAt: Date;
}

export type TestType = 'grapheme' | 'number' | 'sound';

export interface TestState {
  currentTest: TestType | null;
  currentQuestionIndex: number;
  responses: Record<string, TestResponse>;
  sessionId: string | null;
  isComplete: boolean;
  startTime: number;
}
