import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const testSessions = pgTable("test_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  testType: text("test_type").notNull(), // 'grapheme', 'number', 'sound', 'all'
  responses: jsonb("responses").notNull(), // Store all test responses
  scores: jsonb("scores"), // Calculated consistency scores
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testResponses = pgTable("test_responses", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  testType: text("test_type").notNull(),
  stimulus: text("stimulus").notNull(), // The letter, number, or sound identifier
  response: jsonb("response").notNull(), // Color(s) selected
  responseTime: integer("response_time"), // Time taken to respond in ms
  attempt: integer("attempt").default(1), // For retest consistency
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestSessionSchema = createInsertSchema(testSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTestResponseSchema = createInsertSchema(testResponses).omit({
  id: true,
  createdAt: true,
});

export type TestSession = typeof testSessions.$inferSelect;
export type InsertTestSession = z.infer<typeof insertTestSessionSchema>;
export type TestResponse = typeof testResponses.$inferSelect;
export type InsertTestResponse = z.infer<typeof insertTestResponseSchema>;

// Test configuration schemas
export const testConfigSchema = z.object({
  grapheme: z.object({
    items: z.array(z.string()),
    colors: z.array(z.string()),
  }),
  number: z.object({
    items: z.array(z.string()),
    colors: z.array(z.string()),
  }),
  sound: z.object({
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      audioUrl: z.string().optional(),
    })),
    colors: z.array(z.string()),
  }),
});

export type TestConfig = z.infer<typeof testConfigSchema>;
