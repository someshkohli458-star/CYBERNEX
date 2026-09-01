'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Mode = 'login' | 'signup'

export default function AuthPanel({ initialMode = 'login' }: { initialMode?: Mode }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/')
    })
  }, [router])

  function switchMode(next: Mode) {
    setMode(next)
    setMessage('')
    setError('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) {
      setError('Supabase is not configured.')
      return
    }
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setBusy(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const redirectTo = `${window.location.origin}/login`
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      })
      if (authError) {
        setError(authError.message)
      } else if (data.session) {
        router.replace('/')
      } else {
        setMessage('ACCOUNT CREATED. CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT, THEN LOGIN.')
      }
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
      } else if (data.session) {
        router.replace('/')
      }
    }
    setBusy(false)
  }

  async function resetPassword() {
    if (!supabase || !email) {
      setError('Enter your email first.')
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setBusy(false)
    if (resetError) setError(resetError.message)
    else setMessage('PASSWORD RESET EMAIL SENT. CHECK YOUR INBOX.')
  }

  return (
    <main className="authPage">
      <div className="authScanlines" />
      <section className="authShell">
        <Link href="/" className="authBack">← BACK TO CYBERNEX</Link>
        <div className="authHeader">
          <div className="authLogo">☠</div>
          <span className="authEyebrow">[ SECURE IDENTITY TERMINAL ]</span>
          <h1>CYBERNEX</h1>
          <p>{mode === 'login' ? 'AUTHENTICATE OPERATOR' : 'REGISTER NEW OPERATOR'}</p>
        </div>

        <div className="authTabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>LOGIN</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>SIGN UP</button>
        </div>

        <form className="authForm" onSubmit={submit}>
          <label>EMAIL<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="operator@example.com" autoComplete="email" required /></label>
          <label>PASSWORD<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
          {mode === 'signup' && <label>CONFIRM PASSWORD<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password" required /></label>}
          <button className="authSubmit" disabled={busy}>{busy ? 'PROCESSING...' : mode === 'login' ? 'ENTER SYSTEM →' : 'CREATE ACCOUNT →'}</button>
        </form>

        {mode === 'login' && <button className="resetBtn" onClick={resetPassword} disabled={busy}>FORGOT PASSWORD?</button>}
        {error && <div className="authMessage error">[ ERROR ] {error}</div>}
        {message && <div className="authMessage success">[ SYSTEM ] {message}</div>}

        <div className="authStatus"><span>● AUTH SERVICE ONLINE</span><span>● RLS PROTECTED</span><span>● SAFE MODE</span></div>
        <p className="authNote">Your password is handled by Supabase Auth. CYBERNEX does not store passwords in its application tables.</p>
      </section>
      <style jsx>{`
        .authPage{min-height:100vh;background:radial-gradient(circle at 50% 20%,#123b1b 0,#061109 34%,#010302 78%);color:#d9ffe0;display:grid;place-items:center;padding:24px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;position:relative;overflow:hidden}
        .authPage:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,255,80,.035) 0,rgba(0,255,80,.035) 1px,transparent 1px,transparent 4px);pointer-events:none}
        .authShell{width:min(480px,100%);border:1px solid #1b7430;background:rgba(2,9,4,.94);border-radius:14px;padding:22px;box-shadow:0 0 70px rgba(0,255,70,.13),inset 0 0 45px rgba(0,255,70,.025);position:relative;z-index:1}
        .authBack{font-size:9px;color:#6da576;letter-spacing:1px}.authBack:hover{color:#39ff58}
        .authHeader{text-align:center;padding:22px 0 16px}.authLogo{width:64px;height:64px;margin:0 auto 12px;border:2px solid #35ff55;border-radius:50%;display:grid;place-items:center;color:#35ff55;font-size:31px;box-shadow:0 0 25px rgba(0,255,70,.2)}
        .authEyebrow{font-size:8px;color:#48bb5b;letter-spacing:2px}.authHeader h1{margin:6px 0;color:#35ff55;font-size:42px;letter-spacing:7px;text-shadow:0 0 18px rgba(0,255,70,.25)}.authHeader p{margin:0;color:#ffdc40;font-size:9px;letter-spacing:3px}
        .authTabs{display:grid;grid-template-columns:1fr 1fr;border:1px solid #164f25;border-radius:8px;padding:3px;background:#030b05}.authTabs button{border:0;background:transparent;color:#638b69;padding:10px;border-radius:6px;font-size:10px;font-weight:800}.authTabs button.active{background:#123b1a;color:#39ff58;box-shadow:inset 0 0 15px rgba(0,255,70,.08)}
        .authForm{display:grid;gap:13px;margin-top:18px}.authForm label{font-size:8px;color:#68a570;letter-spacing:1px}.authForm input{display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #155a28;border-radius:7px;background:#010603;color:#d9ffe0;outline:none}.authForm input:focus{border-color:#35ff55;box-shadow:0 0 12px rgba(0,255,70,.1)}.authSubmit{border:1px solid #6bff80;background:#20f548;color:#021006;padding:12px;border-radius:7px;font-weight:900;font-size:10px;margin-top:3px}.authSubmit:disabled{opacity:.55;cursor:not-allowed}
        .resetBtn{display:block;margin:13px auto 0;background:none;border:0;color:#6da576;font-size:8px}.resetBtn:hover{color:#39ff58}.authMessage{margin-top:13px;padding:11px;border-radius:7px;font-size:8px;line-height:1.5}.authMessage.error{border:1px solid #71302c;background:#1b0908;color:#ff9b93}.authMessage.success{border:1px solid #1c6b2d;background:#06170a;color:#5aff72}
        .authStatus{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:18px;padding-top:13px;border-top:1px solid #103b1b;color:#45a653;font-size:7px}.authNote{text-align:center;color:#507258;font-size:7px;line-height:1.6;margin:15px 8px 0}
        @media(max-width:520px){.authPage{padding:12px}.authShell{padding:17px}.authHeader h1{font-size:34px}.authStatus{gap:7px}}
      `}</style>
    </main>
  )
}
