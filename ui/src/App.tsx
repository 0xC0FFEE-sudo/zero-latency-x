import React, { useEffect, useState } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type SentimentTick = { symbol: string; ts: number; sentiment: number; };
type Order = { symbol: string; side: string; qty: number; };

const App: React.FC = () => {
  const [sentiments, setSentiments] = useState<SentimentTick[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [symbol, setSymbol] = useState('');
  const [qty, setQty] = useState('');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');

  useEffect(() => {
    const es = new EventSource('/events');
    es.addEventListener('sentiment', (e: MessageEvent) => {
      const data: SentimentTick = JSON.parse(e.data);
      setSentiments(prev => [...prev, data]);
    });
    es.addEventListener('order', (e: MessageEvent) => {
      const data: Order = JSON.parse(e.data);
      setOrders(prev => [data, ...prev]);
    });
    return () => { es.close(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, qty: parseFloat(qty), side }),
      });
      const result = await res.json();
      alert(JSON.stringify(result));
    } catch (err) { console.error(err); alert('Trade error'); }
  };

  const chartData = {
    labels: sentiments.map(s => new Date(s.ts * 1000).toLocaleTimeString()),
    datasets: [{
      label: 'Sentiment',
      data: sentiments.map(s => s.sentiment),
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }],
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sentiment Over Time</h2>
      <Line data={chartData} />
      <h2>Live Orders</h2>
      <ul>{orders.map((o, i) => <li key={i}>{o.symbol} - {o.side} - {o.qty}</li>)}</ul>
      <h2>Submit Trade</h2>
      <form onSubmit={handleSubmit}>
        <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Symbol" />
        <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty" />
        <select value={side} onChange={e => setSide(e.target.value as 'BUY'|'SELL')}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default App;
