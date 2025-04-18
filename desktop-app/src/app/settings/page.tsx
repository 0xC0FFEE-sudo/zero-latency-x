'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface Settings {
  binanceKey: string
  binanceSecret: string
  llmProvider: string
  llmKey: string
  symbol: string
  qty: number
  autoTrade: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    binanceKey: '',
    binanceSecret: '',
    llmProvider: '',
    llmKey: '',
    symbol: '',
    qty: 0,
    autoTrade: false,
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setSettings(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value }))
  }

  const handleSave = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    alert('Settings saved')
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="space-y-2">
        <label htmlFor="binanceKey">Binance API Key</label>
        <Input id="binanceKey" value={settings.binanceKey} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <label htmlFor="binanceSecret">Binance API Secret</label>
        <Input id="binanceSecret" value={settings.binanceSecret} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <label htmlFor="llmProvider">LLM Provider</label>
        <Select value={settings.llmProvider} onValueChange={v => setSettings(prev => ({ ...prev, llmProvider: v }))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {settings.llmProvider && (
        <div className="space-y-2">
          <label htmlFor="llmKey">LLM API Key</label>
          <Input id="llmKey" value={settings.llmKey} onChange={handleChange} />
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="symbol">Trading Symbol</label>
        <Input id="symbol" value={settings.symbol} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <label htmlFor="qty">Trade Quantity</label>
        <Input id="qty" type="number" value={settings.qty} onChange={handleChange} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="autoTrade" checked={settings.autoTrade} onCheckedChange={checked => setSettings(prev => ({ ...prev, autoTrade: checked }))} />
        <label htmlFor="autoTrade">Auto Trade</label>
      </div>
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  )
}
