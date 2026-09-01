'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const modules = [
  ['surveillance','🛰️','HEADQUARTER SURVEILLANCE','Visual monitoring simulator'],
  ['console','⌨️','PROGRAM CONSOLE','Sandbox command-line training'],
  ['remote','🔗','REMOTE CONNECTION','Secure handshake simulator'],
  ['ads','📣','ADVERTISEMENT HUB','Mock campaign builder'],
  ['nuclear','☢️','NUCLEAR PLANT','Industrial safety simulator'],
  ['password','🔐','PASSWORD CRACKER','Password strength awareness lab'],
  ['miner','₿','BITCOIN MINER','Simulated mining dashboard'],
  ['interpol','🕵️','INTERPOL DATABASE','Fictional OSINT training records'],
] as const

export default function SimulationsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const filtered = useMemo(() => modules.filter(([, , title, desc]) => {
    const text = `${title} ${desc}`.toLowerCase()
    return !query || text.includes(query.toLowerCase())
  }), [query])

  return (
    <main className="featureCenter">
      <style>{`
        .featureCenter{min-height:100vh;background:#020504;color:#d8ffdf;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;padding:20px}
        .featureCenter:before{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(50,255,90,.035) 0,rgba(50,255,90,.035) 1px,transparent 1px,transparent 4px)}
        .fcWrap{max-width:1100px;margin:auto;position:relative;z-index:1}.fcTop{display:flex;justify-content:space-between;align-items:center;gap:12px}.fcTop a{color:#38ff58;text-decoration:none;border:1px solid #155c29;background:#061109;padding:9px 12px;border-radius:6px;font-size:10px}.fcTitle{margin:18px 0;padding:22px;border:1px solid #17622d;border-radius:10px;background:linear-gradient(135deg,#06150a,#020503);box-shadow:0 0 40px rgba(40,255,80,.08)}.fcTitle small{color:#52a85e;letter-spacing:2px}.fcTitle h1{font-size:clamp(30px,7vw,58px);margin:8px 0;color:#35ff57;letter-spacing:3px}.fcTitle p{color:#739b7a;font-size:10px;line-height:1.7}.fcControls{display:flex;gap:8px;margin-bottom:12px}.fcControls input,.fcControls select{flex:1;background:#030805;color:#caffd0;border:1px solid #155b29;border-radius:6px;padding:11px;font-size:10px}.fcGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.fcCard{display:flex;align-items:center;gap:13px;text-decoration:none;color:#d8ffdf;background:#030806;border:1px solid #145627;border-radius:9px;padding:15px;transition:.2s}.fcCard:hover{transform:translateY(-2px);border-color:#35ff57;box-shadow:0 0 24px rgba(40,255,80,.13)}.fcIcon{width:52px;height:52px;display:grid;place-items:center;border:1px solid #19622e;border-radius:7px;background:#06130a;font-size:24px}.fcCard b{display:block;color:#3cff59;font-size:11px;letter-spacing:1px}.fcCard small{display:block;color:#6d9573;font-size:9px;margin-top:6px}.fcArrow{margin-left:auto;color:#35ff57}.fcSafe{margin-top:14px;padding:12px;border:1px solid #145627;border-radius:7px;color:#6e9874;font-size:9px;line-height:1.6}.fcSafe b{color:#3cff59}@media(max-width:700px){.featureCenter{padding:12px}.fcGrid{grid-template-columns:1fr}.fcControls{flex-direction:column}.fcCard{padding:13px}}
      `}</style>
      <div className="fcWrap">
        <div className="fcTop"><Link href="/">← CYBERNEX HOME</Link><span style={{color:'#35ff57',fontSize:9}}>● ALL SYSTEMS ONLINE</span></div>
        <section className="fcTitle"><small>[ CYBERNEX FEATURE CENTER ]</small><h1>SIMULATION HUB</h1><p>All core CYBERNEX modules in one place. Every module is a controlled educational simulation with no real targets, credentials or external device access.</p></section>
        <div className="fcControls"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search features..."/><select value={category} onChange={e => setCategory(e.target.value)}><option>ALL</option><option>SIMULATION</option></select></div>
        <div className="fcGrid">{filtered.map(([slug,icon,title,desc]) => <Link className="fcCard" href={`/simulations/${slug}`} key={slug}><div className="fcIcon">{icon}</div><div><b>{title}</b><small>{desc}</small></div><span className="fcArrow">→</span></Link>)}</div>
        <div className="fcSafe"><b>SAFETY MODE:</b> simulations only. No camera access, account access, credential cracking, network interception, database intrusion or real-world target connection.</div>
      </div>
    </main>
  )
}
