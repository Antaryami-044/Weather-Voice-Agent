
// ==========================================
// ⚙️ MANUAL CONFIGURATION (ACTION REQUIRED)
// ==========================================

// 1. PASTE YOUR TOKEN HERE (Keep the quotes "")
const MANUAL_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IndlYXRoZXItcm9vbSJ9LCJpc3MiOiJBUElMaWtwRHJmeDZON3EiLCJleHAiOjE3NjQ3NTM4MDQsIm5iZiI6MCwic3ViIjoibWFudWFsLXVzZXIifQ.uX7spmD46Z0apgvO5NFjyOXnAuaxQvxBizCjkCFAUp0";

// 2. PASTE YOUR LIVEKIT URL HERE (Keep the quotes "")
// Go to LiveKit Cloud Dashboard -> Copy "WebSocket URL"
const LIVEKIT_URL = "wss://weather-voice-agemt-6cp5lweh.livekit.cloud"; 

// ==========================================

// UI Elements
const joinBtn = document.getElementById('join-btn');
const lkStatus = document.getElementById('lk-status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const statusEl = document.getElementById('status');
const lastTextEl = document.getElementById('last-text');
const assistantEl = document.getElementById('assistant-speech');

let lkRoom = null;
let recognition = null;
const context = { lastCity: null };

function setStatus(msg) { statusEl.textContent = `Status: ${msg}`; }

// --- PART 1: LIVEKIT CONNECTION ---

joinBtn.onclick = async () => {
  lkStatus.textContent = 'Connecting...';
  lkStatus.style.color = '#666'; // Reset color

  // 1. Check if user forgot to update the URL or Token
  if (LIVEKIT_URL.includes("your-project-url")) {
    alert("STOP! You forgot to paste your LiveKit URL in script.js (Line 12).");
    lkStatus.textContent = 'Error: Default URL detected in code.';
    lkStatus.style.color = 'red';
    return;
  }

  if (MANUAL_TOKEN.includes("PASTE_YOUR")) {
    alert("STOP! You forgot to paste your Token in script.js (Line 8).");
    lkStatus.textContent = 'Error: Token missing.';
    lkStatus.style.color = 'red';
    return;
  }

  try {
    // 2. Connect to LiveKit
    // Note: LiveKitClient is the global object from the CDN import
    lkRoom = await LivekitClient.connect(LIVEKIT_URL, MANUAL_TOKEN);
    
    lkStatus.textContent = `✅ Connected to LiveKit!`;
    lkStatus.style.color = 'green';
    joinBtn.disabled = true;
    joinBtn.textContent = "Connected Active";
    joinBtn.style.backgroundColor = "#28a745"; // Green button

    // Optional: Publish Mic
    await lkRoom.localParticipant.enableCameraAndMicrophone(false, true);
    console.log("Microphone published.");

  } catch (err) {
    console.error("LiveKit Error:", err);
    lkStatus.textContent = 'Connection Failed. Open Console (F12) for details.';
    lkStatus.style.color = 'red';
  }
};

// --- PART 2: VOICE AGENT LOGIC (Global Weather) ---

function speak(text) {
  assistantEl.textContent = text;
  const u = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

async function queryWeather(text) {
  setStatus('Thinking...');
  try {
    const resp = await fetch('/api/chat', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }) 
    });
    
    const data = await resp.json();
    speak(data.reply);
    setStatus('Ready');
  } catch (err) {
    console.error(err);
    speak('Sorry, I cannot reach the server right now.');
    setStatus('Error');
  }
}

function initRecognition() {
  // Browser compatibility check
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice not supported in this browser. Please use Google Chrome.');
    return null;
  }
  const r = new SpeechRecognition();
  r.lang = 'en-US';
  r.continuous = false; 
  return r;
}

startBtn.onclick = () => {
  if (!recognition) recognition = initRecognition();
  if (!recognition) return;

  recognition.start();
  statusEl.textContent = "Listening...";
  startBtn.disabled = true;
  stopBtn.disabled = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    lastTextEl.textContent = text;
    queryWeather(text);
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    if (statusEl.textContent === "Listening...") setStatus("Idle");
  };
  
  recognition.onerror = (event) => {
    console.error("Speech Error:", event.error);
    setStatus("Microphone Error: " + event.error);
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
};

stopBtn.onclick = () => {
  if (recognition) recognition.stop();
};