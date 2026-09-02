import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured on the server.' }, { status: 500 })
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        input: [
          {
            role: 'system',
            content: 'You are CYBERNEX AI, a helpful assistant for a safe cybersecurity simulation website. Do not provide instructions that enable real-world unauthorized access, credential theft, malware, or evasion. Keep simulations educational and harmless.',
          },
          { role: 'user', content: message },
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'OpenAI request failed.' },
        { status: response.status },
      )
    }

    const output = Array.isArray(data?.output)
      ? data.output
          .flatMap((item: any) => Array.isArray(item?.content) ? item.content : [])
          .map((item: any) => item?.text)
          .filter(Boolean)
          .join('\n')
      : ''

    return NextResponse.json({ text: output || 'No response generated.' })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
