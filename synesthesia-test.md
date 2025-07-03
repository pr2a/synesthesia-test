# SynesthTest - Synesthesia Testing Platform

## Overview

SynesthTest is a comprehensive web application designed to test for various types of synesthesia through interactive assessments. The platform provides research-based tests for grapheme-color synesthesia (letters/numbers triggering colors), chromesthesia (sounds triggering colors), and other sensory cross-connections. Users can take individual tests or comprehensive assessments, receive detailed scoring analysis, and get personalized recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA (Single Page Application) mode
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state, local React state for UI state
- **Audio**: Web Audio API for sound generation and playback in synesthesia tests

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with interface for database persistence
- **API Design**: RESTful API with JSON responses

### Build System
- **Frontend Build**: Vite with React plugin for fast development and optimized production builds
- **Backend Build**: esbuild for server bundle optimization
- **Development**: Hot module replacement (HMR) via Vite middleware
- **Production**: Static file serving with Express

## Key Components

### Test Engine
- **Grapheme Test**: Letter and number color association testing with consistency scoring
- **Number Test**: Numerical digit color perception assessment  
- **Sound Test**: Audio-visual synesthesia testing with Web Audio API synthesis
- **Scoring Algorithm**: Consistency-based scoring with statistical analysis of color-stimulus associations

### Data Models
- **Test Sessions**: Unique session tracking with test type, responses, and calculated scores
- **Test Responses**: Individual stimulus-response pairs with timing data for analysis
- **Scoring System**: Multi-dimensional scoring including consistency, confidence levels, and interpretations

### Audio System
- **Sound Generation**: Procedural audio synthesis using Web Audio API
- **Sound Library**: Predefined sound types (tones, natural sounds, musical instruments)
- **Playback Management**: Controlled audio playback with proper cleanup and error handling

### UI Components
- **Test Interfaces**: Specialized components for each test type with progress tracking
- **Color Picker**: Multi-mode color selection supporting single and multiple color responses
- **Results Display**: Comprehensive results visualization with scoring interpretation
- **Educational Content**: Information about synesthesia types and research background

## Data Flow

1. **Test Initiation**: User selects test type → creates session → receives test configuration
2. **Test Execution**: Stimulus presentation → user response collection → real-time progress tracking
3. **Response Processing**: Individual responses stored → timing data recorded → session state updated
4. **Scoring**: Completed responses analyzed → consistency scores calculated → interpretations generated
5. **Results**: Final scores computed → detailed analysis provided → recommendations generated

## External Dependencies

### Frontend Dependencies
- **Radix UI**: Accessible component primitives for dialog, select, accordion, etc.
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **Class Variance Authority**: Utility for component variant management
- **Date-fns**: Date manipulation utilities

### Backend Dependencies
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL database provider
- **Nanoid**: Unique ID generation for sessions
- **Zod**: Runtime type validation and schema definition

### Development Dependencies
- **TypeScript**: Static type checking across frontend and backend
- **Vite**: Fast development server with HMR
- **ESBuild**: Production bundle optimization
- **PostCSS & Autoprefixer**: CSS processing pipeline

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Hot Reloading**: Both frontend and backend code changes trigger automatic reloads
- **Database**: Development database connection via DATABASE_URL environment variable

### Production Build
- **Frontend**: Static asset generation via Vite build to `dist/public`
- **Backend**: Server bundle creation via esbuild to `dist/index.js`
- **Asset Serving**: Express serves static files in production mode
- **Environment**: Production configuration via NODE_ENV environment variable

### Database Management
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Drizzle Kit manages database schema changes
- **Connection**: PostgreSQL connection via Neon Database with connection pooling

## Changelog
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.