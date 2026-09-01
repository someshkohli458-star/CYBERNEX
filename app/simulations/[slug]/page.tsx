'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

type Module = {
  title: string
  icon: string
  description: string
  mode: string
}

const modules: Record<string, Module> = {
  surveillance: { title: 'HEADQUARTER SURVEILLANCE', icon: '🛰️', description: 'Map and CCTV awareness simulator with virtual locations only.', mode: 'VISUAL MONITORING' },
  console: { title: 'PROGRAM CONSOLE', icon: '⌨️', description: 'Interactive command-line training environment. Commands stay inside this sandbox.', mode: 'CLI TRAINING' },
  remote: { title: 'REMOTE CONNECTION', icon: '🔗', description: 'Learn the steps of a secure connection handshake using a simulated network.', mode: 'NETWORK TRAINING' },
  ads: { title: 'ADVERTISEMENT HUB', icon: '📣', description: 'Build a harmless mock digital campaign and preview its delivery metrics.', mode: 'MEDIA SIMULATION' },
  nuclear: { title: 'NUCLEAR PLANT', icon: '☢️', description: 'Industrial safety simulator with fictional reactor controls and alarms.', mode: 'OT SAFETY' },
  password: { title: 'PASSWORD CRACKER', icon: '🔐', description: 'Password-security awareness lab that measures strength; it never cracks real credentials.', mode: 'SECURITY AWARENESS' },
  miner: { title: 'BITCOIN MINER', icon: '₿', description: 'Simulated mining dashboard for learning about hash rate, shares and power.', mode: 'COMPUTE SIMULATION' },
  interpol: { title: 'INTERPOL DATABASE', icon: '🕵️', description: 'Fictional OSINT training database containing sample records only.', mode: 'OSINT TRAINING' },
}

const fakeRecords = [
  ['NX-1042', 'Alex Morgan', 'SIMULATED', 'LOW'],
  ['NX-2198', 'Jordan Reed', 'SIMULATED', 'MEDIUM'],
  ['NX-3307', 'Taylor Brooks', 'SIMULATED', 'LOW'],
  ['NX-4471', 'Morgan Lee', 'SIMULATED', 'HIGH'],
]

function strength(value: string) {
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[A-Z]/.test(value)) score++
  if (/[a-z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  return Math.min(score, 6)
}

export default function SimulationPage() {
  const params = useParams<{ slug: string }>()
  const slug = String(params?.slug ?? '')
  const module = modules[slug] ?? modules.console
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [log, setLog] = useState<string[]>(['[SYSTEM] CYBERNEX sandbox ready.', '[SAFETY] No real targets or credentials are used.'])
  const [command, setCommand] = useState('help')
  const [password, setPassword] = useState('')
  const [temp, setTemp] = useState(487)
  const [power, setPower] = useState(78)
  const [hashrate, setHashrate] = useState(128.4)
  const [query, setQuery] = useState('')
  const [campaign, setCampaign] = useState('CYBERNEX SAFE LAB')

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          window.clearInterval(timer)
          setRunning(false)
          return 100
        }
        return p + 5
      })
    }, 140)
    return () => window.clearInterval(timer)
  }, [running])

  const strengthScore = strength(password)
  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return fakeRecords
    return fakeRecords.filter(row => row.join(' ').toLowerCase().includes(q))
  }, [query])

  function runCommand() {
    const cmd = command.trim().toLowerCase()
    const outputs: Record<string, string> = {
      help: 'help | system | network | scan | clear | exit',
      system: 'CYBERNEX SAFE SIMULATION • VIRTUAL HOST • FIREWALL ACTIVE',
      network: 'VIRTUAL NETWORK: 10.0.0.0/24 • NO EXTERNAL TRAFFIC',
      scan: 'SIMULATED SCAN COMPLETE • 0 REAL HOSTS TOUCHED • 0 THREATS',
      exit: 'Session closed. Use the Back button to leave the module.',
      clear: '__CLEAR__',
    }
    const result = outputs[cmd] ?? `Unknown command: ${cmd}. Type help.`
    if (result === '__CLEAR__') setLog([])
    else setLog(lines => [...lines.slice(-7), `cybernex> ${cmd}`, result])
  }

  function startProgress(label: string) {
    setProgress(0)
    setRunning(true)
    setLog(lines => [...lines.slice(-7), `[RUN] ${label} started.`])
  }

  return (
    <main className="simPage">
      <style>{`
        .simPage{min-height:100vh;background:radial-gradient(circle at 50% 0%,#123019 0,#061009 28%,#020403 78%);color:#d9ffe0;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;padding:22px}
        .simPage:before{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,255,80,.035) 0,rgba(0,255,80,.035) 1px,transparent 1px,transparent 4px)}
        .simShell{width:min(1100px,100%);margin:auto;position:relative;z-index:1}
        .simTop{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:16px}
        .simTop a,.simTop button{color:#4cff65;background:#06110a;border:1px solid #17632d;border-radius:7px;padding:9px 12px;font-size:10px;text-decoration:none}
        .simTitle{border:1px solid #176b30;background:#041009;border-radius:10px;padding:18px;box-shadow:0 0 35px rgba(0,255,70,.08)}
        .simTitle small{color:#51a85d;letter-spacing:2px}.simTitle h1{margin:6px 0;color:#36ff56;font-size:clamp(28px,6vw,54px);letter-spacing:3px}.simTitle p{color:#82a888;font-size:11px;max-width:760px;line-height:1.6}.simBadge{display:inline-block;color:#051008;background:#2dff50;padding:5px 8px;border-radius:4px;font-weight:900;font-size:9px}
        .simGrid{display:grid;grid-template-columns:1.6fr .9fr;gap:14px;margin-top:14px}.simPanel{background:#030805;border:1px solid #145a29;border-radius:9px;overflow:hidden}.simPanel h2{margin:0;padding:10px 13px;border-bottom:1px solid #123f1e;color:#3cff59;font-size:11px;letter-spacing:2px}.simBody{padding:14px}
        .terminal{min-height:280px;background:#010302;border:1px solid #103d1b;border-radius:7px;padding:14px;color:#38ff58;font-size:10px;line-height:1.7;white-space:pre-wrap}.terminalInput{display:flex;gap:8px;margin-top:9px}.terminalInput input,.field{flex:1;background:#020604;border:1px solid #185d2a;color:#caffd0;border-radius:6px;padding:9px;font-size:10px;outline:none}.terminalInput button,.simButton{background:#23f447;color:#021006;border:0;border-radius:6px;padding:9px 13px;font-weight:900;font-size:9px}
        .progress{height:12px;background:#07150a;border:1px solid #145b29;border-radius:99px;overflow:hidden}.progress span{display:block;height:100%;background:#28ff51;box-shadow:0 0 14px #28ff51;transition:.15s}.statGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.stat{border:1px solid #124a22;background:#061109;padding:12px;border-radius:7px}.stat b{display:block;color:#36ff56;font-size:17px}.stat small{color:#63966b;font-size:8px}
        .mapBox{height:300px;position:relative;border:1px solid #14582a;border-radius:7px;background:radial-gradient(ellipse,#10421b,#020704 70%);display:grid;place-items:center;color:#37ff56;font-size:11px}.node{position:absolute;color:#ffdb3b;text-shadow:0 0 10px #ffdb3b}.node:nth-child(2){left:20%;top:25%}.node:nth-child(3){right:23%;top:34%}.node:nth-child(4){left:47%;bottom:20%}.node:nth-child(5){right:14%;bottom:22%}
        .controlRow{display:grid;grid-template-columns:120px 1fr 55px;gap:10px;align-items:center;margin:11px 0;color:#76a37d;font-size:9px}.controlRow input{width:100%}.controlRow b{color:#38ff58;text-align:right}.range{accent-color:#28ff51}
        .warning{padding:10px;border:1px solid #7a5c16;background:#171204;color:#ffda45;border-radius:6px;font-size:9px;line-height:1.5}.danger{background:#ffdb3b;color:#171000;border:0;border-radius:6px;padding:9px 12px;font-weight:900;font-size:9px}.success{color:#39ff59;font-size:10px}
        .record{display:grid;grid-template-columns:90px 1fr 100px;gap:8px;align-items:center;padding:10px;border-bottom:1px solid #0e3017;font-size:9px}.record b{color:#d6ffdc}.record small{color:#5d8f65}.record strong{color:#39ff59;text-align:right}
        .preview{border:1px solid #155b29;border-radius:7px;padding:18px;background:linear-gradient(135deg,#0a2811,#020704);margin-top:10px}.preview b{display:block;color:#3cff59;font-size:18px}.preview p{color:#9dbda1;font-size:10px}.preview em{color:#ffdc40;font-style:normal;font-size:8px}
        .safe{margin-top:14px;border:1px solid #155d2a;border-radius:8px;padding:12px;color:#76a57d;font-size:9px;line-height:1.6}.safe b{color:#3cff59}
        @media(max-width:800px){.simPage{padding:12px}.simGrid{grid-template-columns:1fr}.simTop{align-items:stretch}.simTop a,.simTop button{font-size:9px}.controlRow{grid-template-columns:95px 1fr 45px}.record{grid-template-columns:72px 1fr 70px}.terminal{min-height:240px}}
      `}</style>

      <div className="simShell">
        <div className="simTop">
          <Link href="/">← CYBERNEX HOME</Link>
          <span className="simBadge">SAFE SANDBOX • NO REAL TARGETS</span>
        </div>

        <section className="simTitle">
          <small>{module.icon} {module.mode}</small>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </section>

        <div className="simGrid">
          <section className="simPanel">
            <h2>INTERACTIVE MODULE</h2>
            <div className="simBody">
              {slug === 'surveillance' && <>
                <div className="mapBox">VIRTUAL WORLD MAP<span className="node">●</span><span className="node">●</span><span className="node">●</span><span className="node">●</span></div>
                <button className="simButton" style={{marginTop:10}} onClick={() => startProgress('SURVEILLANCE SWEEP')}>{running ? `SCANNING ${progress}%` : 'SCAN VIRTUAL AREA'}</button>
                {running && <div className="progress" style={{marginTop:10}}><span style={{width:`${progress}%`}}/></div>}
              </>}

              {slug === 'console' && <>
                <div className="terminal">{log.join('\n')}</div>
                <div className="terminalInput"><input value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === 'Enter' && runCommand()} aria-label="Sandbox command"/><button onClick={runCommand}>RUN</button></div>
              </>}

              {slug === 'remote' && <>
                <div className="statGrid"><div className="stat"><b>VIRTUAL</b><small>NETWORK TYPE</small></div><div className="stat"><b>10.0.0.24</b><small>SANDBOX HOST</small></div><div className="stat"><b>TLS</b><small>HANDSHAKE</small></div><div className="stat"><b>{progress}%</b><small>CONNECTION</small></div></div>
                <button className="simButton" style={{marginTop:12}} onClick={() => startProgress('SECURE HANDSHAKE')}>{running ? 'HANDSHAKE IN PROGRESS' : 'CONNECT VIRTUAL HOST'}</button>
                <div className="progress" style={{marginTop:10}}><span style={{width:`${progress}%`}}/></div>
              </>}

              {slug === 'ads' && <>
                <input className="field" value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="Campaign name"/>
                <div className="controlRow"><span>Audience</span><input className="range" type="range" min="10" max="100" defaultValue="64"/><b>64%</b></div>
                <div className="controlRow"><span>Budget</span><input className="range" type="range" min="1" max="100" defaultValue="35"/><b>₹35</b></div>
                <div className="preview"><em>SIMULATED AD PREVIEW</em><b>{campaign || 'CYBERNEX SAFE LAB'}</b><p>Explore a fictional cybersecurity learning experience.</p></div>
              </>}

              {slug === 'nuclear' && <>
                <div className="warning">FICTIONAL CONTROL SYSTEM. Values below are generated for safety training and do not connect to any industrial equipment.</div>
                <div className="controlRow"><span>Reactor Temp</span><input className="range" type="range" min="250" max="650" value={temp} onChange={e => setTemp(Number(e.target.value))}/><b>{temp}°C</b></div>
                <div className="controlRow"><span>Power Output</span><input className="range" type="range" min="0" max="100" value={power} onChange={e => setPower(Number(e.target.value))}/><b>{power}%</b></div>
                <div className="statGrid"><div className="stat"><b>{temp < 520 ? 'STABLE' : 'ALERT'}</b><small>REACTOR STATUS</small></div><div className="stat"><b>{power}%</b><small>POWER</small></div></div>
                <button className="danger" style={{marginTop:12}} onClick={() => {setPower(0);setTemp(300);setLog(lines => [...lines, '[SAFETY] Fictional emergency stop activated.'])}}>EMERGENCY STOP</button>
              </>}

              {slug === 'password' && <>
                <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Type a sample password"/>
                <div className="stat" style={{marginTop:12}}><b>{['VERY WEAK','WEAK','FAIR','GOOD','STRONG','VERY STRONG','VERY STRONG'][strengthScore]}</b><small>SECURITY SCORE {strengthScore}/6</small></div>
                <div className="progress" style={{marginTop:10}}><span style={{width:`${(strengthScore/6)*100}%`}}/></div>
                <p className="success" style={{marginTop:12}}>Tip: use a unique passphrase, a password manager and MFA. This lab never attempts to crack the value.</p>
              </>}

              {slug === 'miner' && <>
                <div className="statGrid"><div className="stat"><b>{hashrate.toFixed(1)} TH/s</b><small>SIMULATED HASH RATE</small></div><div className="stat"><b>{(hashrate*0.018).toFixed(2)}</b><small>VIRTUAL SHARES/MIN</small></div><div className="stat"><b>{running ? 'RUNNING' : 'IDLE'}</b><small>ENGINE</small></div><div className="stat"><b>SAFE</b><small>REAL CPU USAGE</small></div></div>
                <div className="chart" style={{padding:'18px 0',color:'#2cff51',fontSize:28}}>▁▂▃▂▅▃▆▅▇▆▉</div>
                <button className="simButton" onClick={() => {setRunning(!running);setHashrate(v => running ? 128.4 : 256.8)}}>{running ? 'STOP SIMULATION' : 'START MINER SIMULATION'}</button>
              </>}

              {slug === 'interpol' && <>
                <input className="field" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sample record..."/>
                <div style={{marginTop:10,border:'1px solid #123f1e',borderRadius:7,overflow:'hidden'}}>{filteredRecords.map(row => <div className="record" key={row[0]}><b>{row[0]}</b><div><b>{row[1]}</b><small>{row[2]}</small></div><strong>RISK {row[3]}</strong></div>)}</div>
              </>}
            </div>
          </section>

          <aside className="simPanel">
            <h2>MODULE STATUS</h2>
            <div className="simBody">
              <div className="statGrid">
                <div className="stat"><b>ONLINE</b><small>SIMULATOR</small></div>
                <div className="stat"><b>LOCAL</b><small>ENVIRONMENT</small></div>
                <div className="stat"><b>0</b><small>REAL TARGETS</small></div>
                <div className="stat"><b>0</b><small>REAL CREDENTIALS</small></div>
              </div>
              <div className="safe"><b>SAFETY MODE</b><br/>This module is an educational simulation. It does not access cameras, accounts, devices, networks, databases or external targets.</div>
              <div className="safe"><b>WHAT YOU LEARN</b><br/>Security concepts, system thinking, monitoring, defensive controls and responsible experimentation.</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
