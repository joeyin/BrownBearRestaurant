# Fake KFC

**Team Members:** Jesse, Chi-wei

## Prerequisites

Make sure you have the following installed:

• Node.js (v14.x or above)

• MongoDB (locally or a cloud instance like MongoDB Atlas)

• npm (comes with Node.js)

## Setup
1. Install the required packages:

```
npm install
```

2. Configure the `.env` file in the root directory.

- The default values connect to our MongoDB cluster.
- PORT means which port your server will running.

```
MONGODB_URI="mongodb+srv://jesse:wzx_1999112@cluster0.5gm0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test"
PORT="8080"
```

## Running the App
1. Seed the database with initial data (optional):
```
node seedData.js
```

2. Start the server:
```
npm run dev
```

3. The server will run at http://localhost:8080.

## Project Structure
```
project/
│
├── models/                 # Models for the application (e.g., Song models)
├── public/                 # Static files (CSS, images, etc.)
├── routes/                 # Route handlers for the app (song management, playlist, etc.)
├── views/                  # EJS templates for rendering the web pages
├── server.js               # Main server file for the Express application
├── seedData.js             # Script to seed the initial data into the database
├── isAuthenticated.js      # Middleware for user authentication
├── isAuthenticatedAdmin.js # Middleware for admin authentication
├── .env                    # Environment variables (database, API keys, etc.)
├── .gitignore              # Files to ignore in version control
├── package.json            # Dependencies and scripts
└──package-lock.json       # Version lock for dependencies
```