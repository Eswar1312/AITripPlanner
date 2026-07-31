# Text2Trip — AI-Powered Trip Architect

> Describe your dream trip in natural language or pick your dates. Gemini builds a structured, interactive itinerary — **not a chatbot, a real trip planner**.

---

## Website Live Link

**[Talk2Trip](https://ai-trip-planner-six-murex.vercel.app/)**


## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Complete Deployment Guide](#complete-deployment-guide)
  - [Step 1: Check `.gitignore`](#step-1-check-gitignore)
  - [Step 2: Push to GitHub](#step-2-push-to-github)
  - [Step 3: Deploy Backend (Render.com)](#step-3-deploy-backend-rendercom)
  - [Step 4: Deploy Frontend (Vercel)](#step-4-deploy-frontend-vercel)
  - [Step 5: Post-Deployment CORS Setup](#step-5-post-deployment-cors-setup)
- [API Reference](#api-reference)
- [Error Handling & Resilience](#error-handling--resilience)

---

## 🌟 Overview

**Text2Trip** is a full-stack, production-ready AI trip planner. Users input their origin, destination, trip start & end dates, budget, and free-form preferences. The backend crafts a structured prompt for the **Google Gemini API**, returning a strictly validated **JSON itinerary**. The React frontend renders it into an interactive dashboard complete with date-specific day cards, season-tailored packing tips, budget breakdown charts, and PDF exports.

Key architectural highlights:
- **Not a chatbot**: Direct conversion from prompt → validated JSON schema → interactive dashboard.
- **API Key Security**: The Gemini API key remains strictly on the Node.js backend.
- **Dual-Layer Validation**: Strict Zod schemas validate AI output on both the server and client before rendering.
- **Budget Normalisation**: Guarantees that itemised budget breakdowns strictly equal `budget.total` across the UI and exported PDF.
- **Error Recovery**: Full React `ErrorBoundary` and backend error handling to prevent blank screens on API limits or rate issues.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Glassmorphism UI
- **Animations**: Framer Motion 12
- **Routing**: React Router DOM 7
- **Drag & Drop**: `@hello-pangea/dnd` 18
- **Charts**: Recharts 3
- **Validation**: Zod 4
- **PDF Export**: jsPDF 4
- **Notifications**: react-hot-toast 2

### Backend
- **Runtime**: Node.js 18+
- **Server**: Express.js 5
- **AI SDK**: `@google/generative-ai` 0.24 (Gemini API)
- **Validation**: Zod 4
- **CORS**: `cors` 2
- **Environment**: `dotenv` 17

---

## ✨ Key Features

1. **Date-Based Trip Architect**:
   - Start Date and End Date pickers automatically compute exact duration.
   - Every day card displays the exact calendar date (e.g. `DAY 1 • Mon, Aug 10, 2026`).

2. **Season & Weather Aware**:
   - Season-based clothing & gear packing suggestions (summer caps/cottonwear, winter gloves/sweaters).
   - Expected weather badge and activity-level rain backup ideas.

3. **Interactive Dashboard**:
   - Budget summary card with category bars.
   - Expense pie chart breakdown.
   - Drag-and-drop activity reordering within and across days.
   - Save trip to local storage & export cleanly styled PDF itineraries.

4. **Refine & Improve**:
   - Request trip modifications (e.g., "reduce budget", "more hidden gems", "family friendly") with instant AI refinement.

5. **Bulletproof Error Handling**:
   - React Error Boundary catches UI crashes and provides a "Back to Home Page" recovery route.
   - Server-side rate limit (`429`) detection with clear user feedback and retry mechanisms.

---

## 📁 Project Structure

```text
talk2trip/
├── .env.example              # Client environment template
├── .gitignore                # Ignored files (node_modules, dist, .env, etc.)
├── index.html                # HTML entry point
├── package.json              # Frontend dependencies & scripts
├── vite.config.js            # Vite configuration & API proxy
├── src/
│   ├── App.jsx               # Main React app & router with ErrorBoundary
│   ├── components/           # UI components (DayCard, BudgetCard, ErrorBoundary, etc.)
│   ├── context/              # React Context (TripContext, ThemeContext)
│   ├── hooks/                # Custom React hooks (useTrip, useSavedTrips)
│   ├── pages/                # Page components (Landing, Dashboard, ErrorPage)
│   ├── services/             # Axios API client
│   └── utils/                # Constants, date helpers, budget normalizer, PDF exporter
└── server/
    ├── .env.example          # Server environment template
    ├── index.js              # Express app entry point
    ├── package.json          # Backend dependencies & scripts
    ├── routes/               # API routes (/api/generate-trip, /api/refine-trip, /api/health)
    ├── services/             # Gemini API client integration
    └── utils/                # Server prompts & Zod validation schemas
```

---

## 🔑 Environment Variables

### Root Directory (`.env`)
```env
VITE_API_URL=/api
```

### Server Directory (`server/.env`)
```env
PORT=5001
GEMINI_API_KEY=your_actual_gemini_api_key_here
CLIENT_ORIGIN=http://localhost:5173
```

---

## ⚡ Running Locally

1. **Clone the repository and install dependencies**:
   ```bash
   # Install frontend dependencies
   npm install

   #Install Tailwind css
   npm install tailwindcss @tailwindcss/vite
   
   # Install backend dependencies
   cd server && npm install && cd ..

   
   ```

2. **Configure Environment Variables**:
   - Copy `server/.env.example` to `server/.env` and insert your Gemini API Key:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```

3. **Start Development Servers**:
   ```bash
   # Run frontend and backend concurrently
   npm run dev:all
   ```
   - Frontend will run on: `http://localhost:5173`
   - Backend API will run on: `http://localhost:5001`

---


## 🛡️ Error Handling & Resilience

- **API Rate Limits / Quotas**: Catch `429` status codes and present clear notifications without crashing the UI.
- **Malformed AI Outputs**: Dual Zod schema validation falls back gracefully to retry options.
- **Uncaught UI Errors**: React `ErrorBoundary` renders a glassmorphic fallback with a direct **"Back to Home Page"** button.

---

