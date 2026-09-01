'use client'
import {useState} from 'react'

const features=[
 ['📹','SECURITY CAMERA','Simulated camera investigation lab'],
 ['💬','MESSENGER APP','Fake conversation analysis simulator'],
 ['📶','WIFI NETWORK','Wireless security learning lab'],
 ['📸','SOCIAL MEDIA','2FA security awareness demo'],
 ['🖼️','PHONE GALLERY','Privacy and metadata simulator'],
 ['🏛️','VAULT SYSTEM','Access-control training simulator'],
 ['🛰️','SATELLITE FEED','Signal-analysis simulation'],
 ['🕵️','SECRET DATABASE','Clearance and OSINT training lab'],
]

export default function Home(){
 const [active,setActive]=useState<(typeof features)[number]|null>(null)
 return <main className="shell">
  <header className="topbar"><div className="brand">CYBERNEX</div><div className="status">● SYSTEM READY // v1.0.0</div></header>
  <div className="container">
   <section className="hero"><div className="eyebrow">[ SELECT YOUR SIMULATION ]</div><h1>CYBER TERMINAL</h1><p>Explore cinematic, controlled cybersecurity simulations designed for learning, demos and harmless pranks. No real device, account, camera or network is accessed.</p></section>
   <div className="section-title">AVAILABLE MODULES</div>
   <section className="grid">{features.map((f)=><button className="card" key={f[1]} onClick={()=>setActive(f)}><div className="icon">{f[0]}</div><div><h3>{f[1]}</h3><p>{f[2]}</p></div><span className="tag">SIM</span></button>)}</section>
   <section className="panel"><h2>LEVEL UP YOUR OPERATOR PROFILE</h2><p>Track simulated activity, explore modules and customize the interface. All activity stays inside the CYBERNEX experience.</p><div className="buttons"><a className="btn" href="/developer">DEVELOPER</a><a className="btn secondary" href="/admin">ADMIN PANEL</a></div></section>
   <footer className="footer"><span>CYBERNEX // EDUCATION + SIMULATION</span><span>Developed by Somesh Koli</span></footer>
  </div>
  {active&&<div className="modalBackdrop" onClick={()=>setActive(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="section-title">{active[1]}</div><div className="terminal">{`> CYBERNEX SIMULATION INITIALIZED\n> Module: ${active[1]}\n> Environment: SANDBOX\n> Real-world access: DISABLED\n> Status: READY\n\nThis module is a visual/educational simulation only.`}</div><div className="buttons" style={{marginTop:14}}><button className="btn" onClick={()=>setActive(null)}>CLOSE</button></div></div></div>}
 </main>
}
