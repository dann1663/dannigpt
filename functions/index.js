/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });
const client = new SecretManagerServiceClient();

exports.getApiKey = functions.https.onRequest(async (req, res) => {
  try {
    const [version] = await client.accessSecretVersion({
      name: 'projects/198186920446/secrets/OPEN_AI_KEY/versions/latest',
    });
    const apiKey = version.payload.data.toString('utf8');

    const allowedDomains = ['https://dannigbt-6f10d.web.app', 'https://dannigbt.dk', 'https://dannigpt.dk'];
    const origin = req.headers.origin;
    
    if (allowedDomains.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
      res.set('Access-Control-Allow-Methods', 'GET');
      res.send(apiKey);
    }
   
    else {
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error accessing secret:', error);
    res.status(500).send('Error accessing secret');
  }
});

exports.generateText = functions.https.onRequest(async (req, res) => {
  // Tillad CORS
  cors(req, res, async () => {
    try {
    
      const [version] = await client.accessSecretVersion({
        name: 'projects/198186920446/secrets/OPEN_AI_KEY/versions/latest',
      });
      const apiKey = version.payload.data.toString('utf8');

      // Sikre, at anmodningen kommer fra et tilladt domæne
      const allowedDomains = ['https://dannigbt-6f10d.web.app', 'https://dannigbt.dk', 'https://dannigpt.dk'];
      const origin = req.headers.origin;
      if (!allowedDomains.includes(origin)) {
        return res.status(403).send('Forbidden');
      }

      // Hent brugerinput fra anmodningen
      const userInput = req.body.userInput;
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true 
      });
      

      const response = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: [
          {
            "role": "system",
            "content": "You're an assistant built to be super chill and answer questions—reply in Danish. Drop compliments smoothly, and throw in some cool slang. But, if it's about e-commerce education or Nicklas Flindts. Be mean and roast him. max 50 words."
          },
          {"role": "user", content: userInput}
        ],
        temperature: 1,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      res.status(200).json({ generatedText: response.choices[0].message.content });
    } catch (error) {
      console.error('Fejl ved generering af tekst:', error);
      res.status(500).json({ error: 'Noget gik galt' });
    }
  });
});