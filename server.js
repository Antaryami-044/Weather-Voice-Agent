require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { processUserMessage } = require('./agent'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    console.log("User said:", message);

    try {
        const reply = await processUserMessage(message);
        console.log("Agent replied:", reply);
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting to the weather service." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});