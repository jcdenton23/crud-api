# CRUD API

## Description

This is a CRUD API built with Node.js and TypeScript. 

## Prerequisites

- **Node.js** (version 22.x.x, 22.9.0 or higher recommended)
- **npm**

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jcdenton23/crud-api.git

2. **Navigate to the project directory:**:
   ```bash
   cd crud-api
   
3. **Install dependencies:**:
   ```bash
   npm install

3. **Create a .env file with necessary environment variables**:
   ```bash
   PORT=4000
   
   
## Scripts

1. **Start Development Server: Uses Nodemon to watch for changes in src/server.ts and restart the server automatically.**
   ```bash
    npm run start:dev

2. Start Multi-Process Mode: Runs src/cluster.ts with Nodemon for clustering purposes.
   ```bash
   npm run start:multi
   
3. Build the Application: Compiles TypeScript files to JavaScript in the dist folder.
   ```bash
   npm run build

4. Start Production Server: Builds the project and starts the compiled JavaScript server in the dist directory.
   ```bash
   npm run start:prod

5. Run Tests: Runs Jest tests matching files with .test.ts in their name.
   ```bash
   npm run tests

6. Format Code: Uses Prettier to format TypeScript files.
   ```bash
   npm run format


