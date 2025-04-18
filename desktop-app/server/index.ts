import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import Binance from 'binance-api-node';
import fs from 'fs';
import path from 'path';

// Load or initialize settings
const cfgPath = path.join(__dirname, 'settings.json');
let settings: any ={};
if (fs.existsSync(cfgPath)) settings = JSON.parse(fs.readFileSync(cfgPath,'utf-8')); 

// Instantiate clients
let binanceClient: any;
let openaiClient: any;

function initClients() {
  if (settings.binanceKey && settings.binanceSecret) {
    binanceClient = Binance({ apiKey: settings.binanceKey, apiSecret: settings.binanceSecret });
  }
  if (settings.llmProvider === 'openai' && settings.llmKey) {
    openaiClient = new OpenAI({ apiKey: settings.llmKey });
  }
}
initClients();

const app = express();
app.use(cors());
app.use(express.json());

// Save settings
app.post('/api/settings', (req,res) => {
  settings = req.body;
  fs.writeFileSync(cfgPath, JSON.stringify(settings, null, 2));
  initClients();
  res.json({ status: 'ok' });
});
app.get('/api/settings', (req,res) => res.json(settings));

// Submit trade via Binance
app.post('/api/trade', async (req,res) => {
  const { symbol, qty, side } = req.body;
  if (!binanceClient) return res.status(500).json({ error: 'Binance client not configured' });
  try {
    const order = await binanceClient.order({ symbol, side, quantity: qty });
    res.json(order);
  } catch(e) { res.status(500).json({ error: e.toString() }); }
});

// SSE for ticks, sentiment & orders
app.get('/events', (req,res) => {
  res.setHeader('Content-Type','text/event-stream');
  res.setHeader('Cache-Control','no-cache');

  let lastPrice: number;
  setInterval(async () => {
    if (!binanceClient) return;
    try {
      const ticker = await binanceClient.prices({ symbol: settings.symbol || 'BTCUSDT' });
      const price = parseFloat(ticker[ settings.symbol || 'BTCUSDT' ]);
      const sentiment = lastPrice ? (price - lastPrice)/lastPrice : 0;
      lastPrice = price;
      res.write(`event: sentiment\ndata: ${JSON.stringify({ symbol: settings.symbol||'BTCUSDT', ts: Date.now()/1000, sentiment })}\n\n`);
      // auto trade based on sentiment strategy
      if (settings.autoTrade) {
        const side = sentiment>0? 'BUY':'SELL';
        const trade = await binanceClient.order({ symbol: settings.symbol, side, quantity: settings.qty });
        res.write(`event: order\ndata: ${JSON.stringify(trade) }\n\n`);
      }
    } catch(e){}
  }, 1000);

  req.on('close', ()=> res.end());
});

const port = settings.port||4000;
app.listen(port, ()=> console.log(`Server running on port ${port}`));
