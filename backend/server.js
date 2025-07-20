const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioNumber) {
  console.error('❌ Twilio environment variables are missing. Please check your .env file.');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

app.post('/send-alert', async (req, res) => {
  try {
    const { to, message, location } = req.body;

    if (!to || !message || !location) {
      return res.status(400).json({ error: 'Missing required fields: to, message, or location.' });
    }

    // Send SMS
    const sms = await client.messages.create({
      body: `${message}\nLocation: ${location}`,
      from: twilioNumber,
      to,
    });

    // Make Voice Call
    const call = await client.calls.create({
      to,
      from: twilioNumber,
      url: `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(message)}`,
    });

    res.json({ smsSid: sms.sid, callSid: call.sid });
  } catch (error) {
    console.error('❌ Error sending alert:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(5000, '0.0.0.0', () => {
  console.log("🚀 Server running on http://0.0.0.0:5000");
});

