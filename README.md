# TAN - The Ability Network

A NestJS application for data synchronization and API management.

## Features

- Data synchronization with external APIs
- Database sync cron jobs
- Hasura integration
- Data transformation services

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm start
```

The application will start on port 3741.

## Scripts

- `npm start` - Start the application
- `npm run start:dev` - Start in development mode with auto-reload
- `npm run build` - Build the application

## Project Structure

- `src/` - Main application code
- `src/services/` - Service modules for API integration and data processing
- `utils/` - Utility functions and generators