# AI Chat Application

A full-stack AI Chat Platform that supports real-time communication, file upload (e.g., PDF, Excel), document summarization using OpenAI, user/admin roles, and MongoDB storage. Built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

# Client

cd client && npm install

# Server

cd ../server && npm install

## Features

-   Real-time chat with AI & Admin
-   Upload and download files (PDF, Excel, etc.)
-   Analyze PDFs using OpenAI and display summaries
-   Chat history stored in MongoDB
-   User and Admin authentication
-   Download files uploaded in chat
-   Deployed on Render (backend) and Netlify/Vercel (frontend)

---

## Tech Stack

### Frontend

-   React.js
-   Tailwind CSS
-   Axios
-   MobX (optional)
-   JWT Auth (via cookies/localStorage)

### Backend

-   Node.js + Express
-   MongoDB with Mongoose
-   OpenAI API (for document summary)
-   JWT Authentication
-   Multer for file uploads

---

## Project

### Frontend Setup

#### API Base URL

The backend is deployed on [Render](https://render.com). Use the following URL as your base API endpoint:

REACT_APP_API_URL=https://aichatbackend-jait.onrender.com

nclude in frontent .env file

### Backend (`/server`)

PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret

```

```
