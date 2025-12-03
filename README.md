# ☁️ Context-Aware Weather Voice Agent

A full-stack, voice-activated AI assistant that provides real-time weather updates and forecasts. Unlike standard weather apps, this agent features **Context Awareness**, allowing it to "remember" the city you are talking about during a conversation (e.g., asking "What about tomorrow?" immediately after checking a city's weather).

## 🚀 Features

* **🎙️ Voice Interaction:** Uses the browser's Web Speech API for seamless voice-to-text communication.
* **🧠 Context Retention:** Maintains session memory to understand follow-up questions without repeating the location.
* **⚡ Real-Time Data:** Fetches live weather and forecast data using the OpenWeatherMap API.
* **🔌 LiveKit Integration:** Utilizes LiveKit for scalable real-time room management and connection stability.
* **🛡️ Secure Architecture:** Uses backend environment variables to protect API keys.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript, Web Speech API
* **Backend:** Node.js, Express.js
* **APIs:** OpenWeatherMap API, LiveKit Server SDK
* **NLP Logic:** Custom Regular Expression (Regex) pattern matching for intent detection.

---

## ⚙️ Prerequisites

Before running the project, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v14 or higher)
* An [OpenWeatherMap](https://openweathermap.org/) API Key (Free tier)
* A [LiveKit](https://livekit.io/) Cloud Project (for WebSocket URL and Keys)

---

## 📥 Installation & Setup

### 1. Clone the Repository

git clone [https://github.com/Antaryami-044/Weather-Voice-Agent.git]
cd weather-voice-agent


### 2. Install Dependencies

npm install

### 3. Configure Environment Variables
Create a file named .env in the root directory (same level as server.js) and add your API keys:

OPENWEATHER_API_KEY=your_openweather_key_here
LIVEKIT_API_KEY=your_livekit_key_here
LIVEKIT_API_SECRET=your_livekit_secret_here

### 4. Generate Access Token

Since LiveKit requires a secure token to connect, you need to generate one locally using the included script. This token allows your local frontend to connect to the cloud server.

node generateToken.js

Action: Copy the long token string printed in the terminal.

### 5. Update Frontend Configuration
Open the file public/script.js and paste your generated token and LiveKit URL:

JavaScript

// public/script.js

// 1. Paste the token you generated in the terminal inside the quotes
const MANUAL_TOKEN = "eyJhbGciOiJIUzI1NiJ9..."; 

// 2. Paste your LiveKit WebSocket URL (from LiveKit Dashboard)
const LIVEKIT_URL = "wss://your-project.livekit.cloud";

▶️ Usage
Start the Server:

npm start
You should see: Server running at http://localhost:3000

Open the App: Open your browser (Google Chrome is recommended for best Voice Support) and navigate to: http://localhost:3000

Interact:

Click "Join LiveKit Room" to establish the connection.

Click "Start Listening" and speak naturally.

Try these commands:

"What is the weather in Mumbai?"

"What about tomorrow?" (Tests context awareness)

"Is it raining in London?"

📂 Project Structure

weather-voice-agent/
│
├── public/                 # Client-side files
│   ├── index.html          # Main User Interface
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic (Voice recognition & API calls)
│
├── agent.js                # Core NLP & Context Decision Logic
├── weatherService.js       # OpenWeatherMap API integration module
├── server.js               # Express Server Entry Point
├── generateToken.js        # Script to generate secure LiveKit tokens
├── .env                    # API Keys (Protected - Not uploaded to GitHub)
└── package.json            # Project dependencies and scripts
🐛 Troubleshooting
Error: "Connection Failed"

Check public/script.js. Ensure your LIVEKIT_URL is correct and has no typos.

Ensure your MANUAL_TOKEN is pasted correctly inside the quotes.

Error: "401 Unauthorized"

Your LiveKit token may have expired (tokens last 24 hours by default). Run node generateToken.js again to get a fresh one and update script.js.

Agent says "I couldn't find weather for..."

Speak clearly.

Ensure your .env file has the correct OPENWEATHER_API_KEY.