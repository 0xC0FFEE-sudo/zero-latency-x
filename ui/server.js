const express = require('express');
const { Kafka } = require('kafkajs');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const kafkaBrokers = (process.env.KAFKA_BROKERS || 'kafka:9092').split(',');
const sentimentTopic = process.env.SENTIMENT_TOPIC || 'sentiment';
const ordersTopic = process.env.ORDERS_TOPIC || 'orders';
const execApiHost = process.env.EXECUTION_API_HOST || 'execution_api:8080';

const kafka = new Kafka({ brokers: kafkaBrokers });
const consumerSent = kafka.consumer({ groupId: 'ui-sentiment' });
const consumerOrders = kafka.consumer({ groupId: 'ui-orders' });

// SSE endpoint for sentiment and orders
app.get('/events', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  await consumerSent.connect();
  await consumerOrders.connect();
  await consumerSent.subscribe({ topic: sentimentTopic, fromBeginning: true });
  await consumerOrders.subscribe({ topic: ordersTopic, fromBeginning: true });

  consumerSent.run({
    eachMessage: async ({ message }) => {
      res.write(`event: sentiment\ndata: ${message.value.toString()}\n\n`);
    },
  });
  consumerOrders.run({
    eachMessage: async ({ message }) => {
      res.write(`event: order\ndata: ${message.value.toString()}\n\n`);
    },
  });

  req.on('close', async () => {
    await consumerSent.disconnect();
    await consumerOrders.disconnect();
  });
});

// Proxy trade submissions
app.use(express.json());
app.post('/api/trade', async (req, res) => {
  try {
    const response = await fetch(`http://${execApiHost}/sign_and_send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Serve React build
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`UI server listening at http://localhost:${port}`);
});
