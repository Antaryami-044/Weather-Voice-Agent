const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const createToken = async () => {
  // Ensure these are in your .env file
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.log("Error: LIVEKIT_API_KEY and LIVEKIT_API_SECRET are missing in .env");
    return;
  }

  const roomName = 'weather-room';
  const participantName = 'manual-user';

  // Create the token
  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: participantName,
    ttl: 24 * 60 * 60, // Token valid for 24 hours 
  });

  at.addGrant({ roomJoin: true, room: roomName });

  const token = await at.toJwt();

  console.log('\n==================================================');
  console.log('COPY THE TOKEN BELOW AND PASTE INTO public/script.js');
  console.log('==================================================\n');
  console.log(token);
  console.log('\n==================================================\n');
};

createToken();