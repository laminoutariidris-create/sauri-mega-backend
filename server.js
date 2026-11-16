const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const BASE_URL = 'https://api.nellobytesystems.com/v1';
const USER_ID = process.env.NELLOBYTE_USER_ID;
const API_KEY = process.env.NELLOBYTE_API_KEY;
function headers() {
  return {
    'Authorization': `Bearer ${API_KEY}`,
    'X-User-ID': USER_ID,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
}
function newRequestId() {
  return 'SAURI-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
app.get('/api/balance', async (req, res) => {
  try {
    const r = await fetch(`${BASE_URL}/v1/wallet`, { headers: headers() });
    const data = await r.json();
    res.json(data);
  } catch (e) { res.status(500).json({ error: 'Balance failed', detail: e.message }); }
});
app.post('/api/buy-data', async (req, res) => {
  const { network, planCode, phone } = req.body;
  try {
    const r = await fetch(`${BASE_URL}/v1/data`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ requestId: newRequestId(), network, plan: planCode, phone })
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: 'Data failed', detail: e.message }); }
});
app.post('/api/buy-airtime', async (req, res) => {
  const { network, amount, phone } = req.body;
  try {
    const r = await fetch(`${BASE_URL}/v1/airtime`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ requestId: newRequestId(), network, amount: Number(amount), phone })
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: 'Airtime failed', detail: e.message }); }
});
app.get('/', (req, res) => res.json({ status: 'Sauri Mega Backend is LIVE' }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on ' + PORT));
