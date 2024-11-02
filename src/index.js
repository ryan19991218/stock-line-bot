const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
require('dotenv').config();

const app = express();

// LINE SDK configuration
const config = {
  channelAccessToken: process.env.channelAccessToken,
  channelSecret: process.env.channelSecret
};

const client = new Client(config);

// Middleware for LINE webhook
app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Error handling event:", err);
      res.status(500).end();
    });
});

// Event handler function
async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    try {
      // Reply with the received message text
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
      });
    } catch (error) {
      console.error("Error replying to message:", error);
    }
  } else {
    // Ignore non-text or unsupported message types
    return Promise.resolve(null);
  }
}

app.listen(3000, () => {
  console.log('伺服器服務運行在 http://localhost:3000');
});
