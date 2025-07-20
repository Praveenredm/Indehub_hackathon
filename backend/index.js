const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Debugging logs
console.log('✅ Twilio SID:', accountSid ? 'Loaded' : 'Missing');
console.log('✅ Twilio Auth Token:', authToken ? 'Loaded' : 'Missing');
console.log('✅ Twilio Phone Number:', twilioPhoneNumber ? 'Loaded' : 'Missing');

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('❌ Missing Twilio configuration in .env');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

app.post('/send-alert', async (req, res) => {
  try {
    const { to, message, location } = req.body;

    if (!to || !message || !location) {
      return res.status(400).json({ error: 'Missing required fields: to, message, location' });
    }

    console.log(`📡 Sending SOS to ${to}`);
    console.log(`Message: ${message}`);
    console.log(`Location: ${location}`);

    const sms = await client.messages.create({
      body: `${message}\nLocation: ${location}`,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`✅ SMS sent: ${sms.sid}`);

    const call = await client.calls.create({
      to: to,
      from: twilioPhoneNumber,
      url: `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(message)}`,
    });

    console.log(`✅ Call initiated: ${call.sid}`);

    res.json({ smsSid: sms.sid, callSid: call.sid });

  } catch (error) {
    console.error('❌ Error during send-alert:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚨 SOS Alert Service running on http://localhost:${PORT}`);
});
