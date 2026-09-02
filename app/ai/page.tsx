'use client'

import { FormEvent, useState } from 'react'

export default function AIPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function send(e: FormEvent) {
    e.preventDefault()
    if (!message.trim() || loading) return
    setLoading(true)
    setError('')
    setReply('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'AI request failed.')
      setReply(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#050608', color: '#e8fff5', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        <a href="/" style={{ color: '#65ffb7' }}>← CYBERNEX</a>
        <h1 style={{ marginTop: 32 }}>CYBERNEX AI</h1>
        <p style={{ opacity: 0.7 }}>AI assistant powered by OpenAI. Safe simulation mode.</p>
        <form onSubmit={send} style={{ marginTop: 28 }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask CYBERNEX AI something..."
            rows={6}
            style={{ width: '100%', padding: 16, background: '#0b1010', color: '#e8fff5', border: '1px solid #234', borderRadius: 12, resize: 'vertical' }}
          />
          <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '12px 20px', borderRadius: 10, cursor: 'pointer' }}>
            {loading ? 'THINKING...' : 'ASK AI'}
          </button>
        </form>
        {error && <p style={{ marginTop: 20, color: '#ff8f8f' }}>{error}</p>}
        {reply && (
          <section style={{ marginTop: 24, padding: 20, background: '#0b1010', border: '1px solid #234', borderRadius: 12, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {reply}
          </section>
        )}
      </div>
    </main>
  )
}
