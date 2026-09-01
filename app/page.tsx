'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Feature = {
  id: string
  feature_key: string
  name: string
  description: string
  icon: string
  category: string
  route: string | null
  enabled: boolean
  sort_order: number
}

type Developer = {
  name: string
  bio: string
  instagram_primary: string | null
  instagram_secondary: string | null
  email: string | null
  tagline: string
}

type Branding = { official_logo_url: string | null; developer_logo_url: string | null }

const fallback: Feature[] = [
  ['security-camera','HEADQUARTER SURVEILLANCE','Global map and CCTV surveillance simulation','🛰️','simulation','/simulations/surveillance',true,1],
  ['messenger-app','PROGRAM CONSOLE','Safe command-line diagnostics console','⌨️','simulation','/simulations/console',true,2],
  ['wifi-network','REMOTE CONNECTION','Network connection training simulator','🔗','simulation','/simulations/remote',true,3],
  ['social-media','ADVERTISEMENT HUB','Harmless digital advertising simulation','📣','simulation','/simulations/ads',true,4],
  ['phone-gallery','NUCLEAR PLANT','Industrial control-room safety simulation','☢️','simulation','/simulations/nuclear',true,5],
  ['vault-system','PASSWORD CRACKER','Password-security awareness simulation','🔐','simulation','/simulations/password',true,6],
  ['satellite-feed','BITCOIN MINER','Simulated cryptocurrency mining dashboard','₿','simulation','/simulations/miner',true,7],
  ['secret-database','INTERPOL DATABASE','Clearance and OSINT training database','🕵️','simulation','/simulations/interpol',true,8],
].map(([feature_key,name,description,icon,category,route,enabled,sort_order]) => ({
  id: feature_key as string, feature_key: feature_key as string, name: name as string,
  description: description as string, icon: icon as string, category: category as string,
  route: route as string, enabled: enabled as boolean, sort_order: sort_order as number,
}))

const featured = [
  { name: 'MATRIX RAIN', icon: '▦', action: 'OPEN MATRIX' },
  { name: 'CRACKED SCREEN', icon: '◈', action: 'OPEN SCREEN' },
  { name: 'WINDOWS XP DESKTOP', icon: '▣', action: 'LAUNCH DESKTOP' },
]

export default function Home() {
  const [features, setFeatures] = useState<Feature[]>(fallback)
  const [developer, setDeveloper] = useState<Developer>({
    name: 'Somesh Koli', bio: 'Cybersecurity learner & developer',
    instagram_primary: '@offx.somesh', instagram_secondary: '@developer.somesh',
    email: 'someshkoli442288@gmail.com', tagline: 'DIGITAL SIMULATION • PRANK HUB • CYBER EXPERIENCES',
  })
  const [branding, setBranding] = useState<Branding>({ official_logo_url: null, developer_logo_url: null })
  const [active, setActive] = useState<Feature | null>(null)
  const [desktop, setDesktop] = useState(false)
  const [toolHub, setToolHub] = useState(false)

  useEffect(() => {
    async function load() {
      if (!supabase) return
      const [{ data: featureRows }, { data: developerRow }, { data: brandingRow }] = await Promise.all([
        supabase.from('site_features').select('*').eq('enabled', true).order('sort_order', { ascending: true }),
        supabase.from('developer_profile').select('name,bio,instagram_primary,instagram_secondary,email,tagline').eq('id', true).maybeSingle(),
        supabase.from('branding_settings').select('official_logo_url,developer_logo_url').eq('id', true).maybeSingle(),
      ])
      if (featureRows?.length) setFeatures(featureRows as Feature[])
      if (developerRow) setDeveloper(d => ({ ...d, ...developerRow }))
      if (brandingRow) setBranding(b => ({ ...b, ...brandingRow }))
    }
    load()
  }, [])

  const status = useMemo(() => [
    ['SERVER', 'ONLINE'], ['FIREWALL', 'ACTIVE'], ['SIMULATOR', 'READY'], ['USERS', '12,483'], ['SAFETY', 'ENABLED'],
  ], [])

  return <main className="cyberHome">
    <header className="cyberNav">
      <div className="logoLockup">
        {branding.official_logo_url ? <img src={branding.official_logo_url} alt="CYBERNEX" /> : <span className="logoGlyph">☠</span>}
        <div><strong>CYBERNEX</strong><small>DIGITAL SIMULATION • PRANK HUB • CYBER EXPERIENCES</small></div>
      </div>
      <nav><a className="active" href="#home">Home</a><a href="#tools">Tools</a><button onClick={() => setDesktop(true)}>Desktop</button><a href="#about">About</a><a href="#contact">Contact</a><button className="searchBtn" onClick={() => setToolHub(true)}>⌕</button></nav>
      <div className="navUser"><span>{branding.developer_logo_url ? <img src={branding.developer_logo_url} alt="Developer" /> : '◉'}</span><div><b>{developer.name}</b><small>Online</small></div></div>
    </header>

    <section id="home" className="cyberHero">
      <div className="heroGlow left"></div><div className="heroGlow right"></div>
      <div className="heroCopy">
        <span className="tinyBadge">[ CYBERNΞTO ]</span>
        <h1>CYBERNEX</h1>
        <p>ENTER THE DIGITAL SIMULATION</p>
        <div className="heroActions"><button className="neonBtn" onClick={() => setToolHub(true)}>LAUNCH TOOLS</button><button className="outlineBtn" onClick={() => setDesktop(true)}>OPEN DESKTOP</button></div>
      </div>
      <div className="heroOrb">◉<span>GLOBAL<br/>SIMULATION</span></div>
    </section>

    <section className="statsBar">
      <div><b>18+</b><span>TOOLS</span></div><div><b>100%</b><span>SAFE</span></div><div><b>▣</b><span>ALL DEVICES</span></div><div><b>♧</b><span>FREE ACCESS</span></div>
    </section>

    <div className="mainGrid">
      <div className="mainColumn">
        <section id="tools" className="toolPanel">
          <div className="panelTitle"><span>CORE TERMINAL TOOLS</span><small>SIMULATION ONLY</small></div>
          <div className="toolGrid">{features.map(f => f.route ? <Link className="toolCard" href={f.route} key={f.id}><div className="toolIcon">{f.icon}</div><strong>{f.name}</strong><span>→</span></Link> : <button className="toolCard" key={f.id} onClick={() => setActive(f)}><div className="toolIcon">{f.icon}</div><strong>{f.name}</strong><span>→</span></button>)}</div>
        </section>

        <section className="toolPanel featuredPanel">
          <div className="panelTitle"><span>FEATURED</span><small>EXPERIMENTAL</small></div>
          <div className="featuredGrid">{featured.map(item => <button className="featuredCard" key={item.name} onClick={() => setDesktop(true)}><div className="featureArt">{item.icon}</div><strong>{item.name}</strong><span>{item.action}</span></button>)}</div>
        </section>
      </div>

      <aside className="sideColumn">
        <section className="toolPanel statusPanel"><div className="panelTitle"><span>SYSTEM STATUS</span></div>{status.map(([label,value]) => <div className="statusRow" key={label}><span>◉ {label}</span><b>{value}</b></div>)}</section>
        <section id="about" className="safePanel"><b>“IT'S JUST A SIMULATION.”</b><span>Real hacking is illegal.</span><button onClick={() => setActive(features[0] ?? null)}>LEARN MORE</button></section>
      </aside>
    </div>

    <section className="windowShowcase">
      <div className="fakeWindow browser"><header>🌐 Welcome to CYBERNEX! <i>− □ ×</i></header><div className="fakeToolbar">File &nbsp; Edit &nbsp; View &nbsp; Favorites &nbsp; Tools &nbsp; Help</div><div className="desktopIcons">{['Hacker','Screenshot','Virus','FBI Lock','iOS','Windows XP','Windows 7','Windows 10','Prank 4 Pets','BIOS','3D Pipes','Matrix Rain','TV Noise','Cracked Screen','Jurassic Park'].map(x => <span key={x}>▣<small>{x}</small></span>)}</div></div>
      <div className="fakeWindow console"><header>CYBERNEX - Program Console <i>− □ ×</i></header><pre>{`CYBERNEX Console v2.0.1\n\nInitializing modules... [OK]\nLoading system... [OK]\nConnecting to virtual network... [OK]\nRunning diagnostics... [OK]\n\ncybernex> help\n\nAvailable commands:\nsystem    - Show system info\nnetwork   - Network simulation\nscan      - Run fake scan\nclear     - Clear console\nexit      - Close console\n\ncybernex> scan\nScanning... [SIMULATION] 94%\nNo real threats. (Simulation Mode)\ncybernex> _`}</pre></div>
      <div className="fakeWindow map"><header>CYBERNEX - Headquarter Surveillance <i>− □ ×</i></header><div className="fakeMap">WORLD VIEW<br/><span>●</span><span>●</span><span>●</span><span>●</span><small>Tracking... (Simulation)</small></div></div>
      <div className="fakeWindow nuclear"><header>Nuclear Plant Control <i>− □ ×</i></header><div className="metric"><b>487°C</b><small>REACTOR TEMP</small><b>12.4 bar</b><small>PRESSURE</small><strong>78%</strong><small>POWER</small></div><Link className="fakeAction" href="/simulations/nuclear">OPEN CONTROL</Link></div>
      <div className="fakeWindow miner"><header>Bitcoin Miner <i>− □ ×</i></header><div className="hash">128.4 TH/s</div><div className="chart">▁▂▃▂▅▃▆▅▇▆▉</div><Link className="fakeAction" href="/simulations/miner">OPEN MINER</Link></div>
      <div className="fakeWindow interpol"><header>Interpol Database <i>− □ ×</i></header><div className="personCard"><span>◉</span><div><b>John Doe</b><small>Alias: Unknown<br/>Status: Clear<br/>Country: Simulated<br/>Risk: Low</small></div><strong>INTERPOL</strong></div><Link className="fakeAction" href="/simulations/interpol">OPEN DATABASE</Link></div>
    </section>

    <section id="contact" className="bottomBar"><div>🛡️ <b>100% Safe</b><span>Simulation Only</span></div><div>📱 <b>Mobile + Desktop</b><span>Works Everywhere</span></div><div>🎮 <b>Interactive</b><span>Safe sandbox</span></div><div className="devMini">Developed by <b>{developer.name}</b> · {developer.instagram_primary}</div></section>

    <footer className="cyberFooter"><span>© 2026 CYBERNEX — DIGITAL SIMULATION LAB</span><div><Link href="/profile">Profile</Link><Link href="/settings">Settings</Link><Link href="/developer">Developer</Link><Link href="/admin">Admin</Link></div></footer>

    {active && <div className="modalBackdrop" onClick={() => setActive(null)}><div className="simulationModal" onClick={e => e.stopPropagation()}><div className="fakeWindow modalWindow"><header>{active.icon} CYBERNEX - {active.name}<i onClick={() => setActive(null)}>×</i></header><div className="modalBody"><div className="lockBig">{active.icon}</div><h2>{active.name}</h2><p>{active.description}</p><div className="terminal">{`> MODULE: ${active.name}\n> ENVIRONMENT: SANDBOX\n> REAL DEVICE ACCESS: DISABLED\n> CREDENTIALS: NOT COLLECTED\n> STATUS: READY\n\nThis is a controlled educational simulation.\nNo real-world target is contacted.`}</div>{active.route ? <Link className="neonBtn" href={active.route}>START SIMULATION</Link> : <button className="neonBtn" onClick={() => setActive(null)}>CLOSE</button>}</div></div></div></div>}
    {toolHub && <div className="modalBackdrop" onClick={() => setToolHub(false)}><div className="toolHubModal" onClick={e => e.stopPropagation()}><div className="fakeWindow modalWindow"><header>CYBERNEX - Tool Hub <i onClick={() => setToolHub(false)}>×</i></header><div className="hubGrid">{features.map(f => f.route ? <Link className="hubItem" key={f.id} href={f.route} onClick={() => setToolHub(false)}><span>{f.icon}</span><b>{f.name}</b></Link> : <button key={f.id} onClick={() => {setToolHub(false);setActive(f)}}><span>{f.icon}</span><b>{f.name}</b></button>)}</div></div></div></div>}
    {desktop && <div className="desktopOverlay"><div className="desktopTop">CYBERNEX DESKTOP <span>◉ ONLINE</span><button onClick={() => setDesktop(false)}>EXIT DESKTOP ×</button></div><div className="desktopCanvas"><div className="desktopConsole"><b>CYBERNEX TERMINAL</b><pre>{`root@cybernex:~$ system\nSYSTEM      CYBERNEX\nMODE        SAFE SIMULATION\nFIREWALL    ACTIVE\nNETWORK     VIRTUAL\nSTATUS      READY\n\nroot@cybernex:~$ _`}</pre></div><div className="desktopShortcut" onClick={() => setToolHub(true)}>☠<b>Tool Hub</b></div><Link className="desktopShortcut" href="/simulations/surveillance" onClick={() => setDesktop(false)}>▣<b>Surveillance</b></Link><Link className="desktopShortcut" href="/simulations/password" onClick={() => setDesktop(false)}>🔐<b>Password Lab</b></Link></div><div className="desktopDock"><button onClick={() => setToolHub(true)}>🚀 Tools</button><button onClick={() => setDesktop(false)}>▣ Desktop</button><Link href="/simulations/console" onClick={() => setDesktop(false)}>⌨ Console</Link><button>◉ Privacy</button></div></div>}
  </main>
}
