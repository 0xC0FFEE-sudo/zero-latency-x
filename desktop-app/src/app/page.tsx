'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type SentimentTick = { symbol: string; ts: number; sentiment: number }
type Order = { symbol: string; side: string; qty: number }

export default function Dashboard() {
  const [sentiments, setSentiments] = useState<SentimentTick[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [symbol, setSymbol] = useState('')
  const [qty, setQty] = useState('')
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')

  useEffect(() => {
    const es = new EventSource('/events')
    es.addEventListener('sentiment', (e: MessageEvent) => {
      const data: SentimentTick = JSON.parse(e.data)
      setSentiments(prev => [...prev, data])
    })
    es.addEventListener('order', (e: MessageEvent) => {
      const data: Order = JSON.parse(e.data)
      setOrders(prev => [data, ...prev])
    })
    return () => es.close()
  }, [])

  const chartData = {
    labels: sentiments.map(s => new Date(s.ts * 1000).toLocaleTimeString()),
    datasets: [
      {
        label: 'Sentiment',
        data: sentiments.map(s => s.sentiment),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  }

  return (
    <div className="p-8 space-y-8">
      <Tabs defaultValue="sentiment">
        <TabsList>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
        </TabsList>
        <TabsContent value="sentiment">
          <Card>
            <Line data={chartData} />
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card className="space-y-2">
            {orders.map((o, i) => (
              <div key={i} className="flex justify-between">
                <span>{o.symbol}</span>
                <span>{o.side}</span>
                <span>{o.qty}</span>
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="trade">
          <form onSubmit={async e => {
            e.preventDefault();
            await fetch('/api/trade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symbol, qty: parseFloat(qty), side }) });
          }} className="flex space-x-2">
            <Input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />
            <Input type="number" placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} />
            <Select value={side} onValueChange={v => setSide(v as 'BUY' | 'SELL')}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">BUY</SelectItem>
                <SelectItem value="SELL">SELL</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Submit</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
