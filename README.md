<div align="center">
  <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="Frontend/public/filterd.png" alt="Filterd Logo" width="50" height="50" style="border-radius: 50%; object-fit: cover;" />
    <h1 style="margin: 0; display: inline-block;">Filterd 🎧</h1>
  </div>
  <p align="center">
    <b>An Agentic AI-powered Spotify playlist curator and smart music filtering agent.</b>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  </p>
</div>

---

## 🚀 About The Project

**Filterd** is a modern, high-performance web application designed to bridge the gap between natural language prompts and your Spotify music library. Instead of manually sorting through hundreds of tracks, users can authenticate securely via OAuth, sync their Liked Songs library, and let the AI agent intelligently curate tracks based on subjective vibes or parameters (e.g., *"High energy gym workouts"* or *"Late night drive"*).

---

## ✨ Key Features

*   **🔒 Secure Spotify Authentication**: OAuth2 integration with permission scoping and session management.
*   **🤖 Vibe Architect (AI Filter)**: Leverages generative AI to parse natural language prompts and filter user library metadata intelligently.
*   **🎯 Granular Track Selection**: Custom interactive UI overlays enabling users to cherry-pick specific tracks before exporting.
*   **⚡ Optimized Performance**: DOM pagination and lazy loading to manage heavy Spotify widget iframes smoothly.
*   **📱 Responsive & Modern UI**: Built with a strict "Spotify Dark Premium" aesthetic (`#121212`, `#1E1E1E`, `#1DB954`) and mobile-friendly overlays.
*   **🛡️ Production-Grade Feedback**: Custom Tailwind confirmation modals and toast notification systems replacing native browser alerts.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Lucide React Icons.
*   **Backend**: Python, FastAPI, Uvicorn.
*   **APIs & AI**: Spotify Web API, Google Gemini AI Model.

---

## ⚙️ Getting Started Locally

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   Node.js & npm installed.
*   Python 3.8+ installed.
*   A Spotify Developer Account with a registered App (Client ID & Client Secret).

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up your environment:
```bash
cd Backend/App
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt