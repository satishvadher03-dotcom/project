import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import {
  verifyPassportDocument,
  predictProcessingTime,
  checkVisaEligibility,
  generateAutomatedStatusDispatch,
} from './src/server/aiRouter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// AI Endpoints
app.post('/api/ai/verify-document', async (req, res) => {
  try {
    const result = await verifyPassportDocument(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Verification failed' });
  }
});

app.post('/api/ai/predict-time', async (req, res) => {
  try {
    const result = await predictProcessingTime(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Prediction failed' });
  }
});

app.post('/api/ai/check-eligibility', async (req, res) => {
  try {
    const result = await checkVisaEligibility(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Eligibility check failed' });
  }
});

app.post('/api/ai/generate-status-update', async (req, res) => {
  try {
    const result = await generateAutomatedStatusDispatch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Status dispatch failed' });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AuraVisa production server listening on port ${port}`);
});
