'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
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
  avatar_url: string | null
  instagram_primary: string | null
  instagram_secondary: string | null
  email: string | null
  github_url: string | null
  website_url: string | null
  tagline: string
}

type Branding = {
  developer_logo_url: string | null
  official_logo_url: string | null
}

const fallbackFeatures: Feature[] = [
  ['security-camera','SECURITY CAMERA','Simulated camera investigation lab','📹','simulation','/simulations/camera',true,1],
  ['messenger-app','MESSENGER APP','Fake conversation analysis simulator','💬','simulation','/simulations/messenger',true,2],
  ['wifi-network','WIFI NETWORK','Wireless security learning lab','📶','simulation','/simulations/wifi',true,3],
  ['social-media','SOCIAL MEDIA','2FA security awareness demo','📸','simulation','/simulations/social',true,4],
  ['phone-gallery','PHONE GALLERY','Privacy and metadata simulator','🖼️','simulation','/simulations/gallery',true,5],
  ['vault-system','VAULT SYSTEM','Access-control training simulator','🏛️','simulation','/simulations/vault',true,6],
  ['satellite-feed','SATELLITE FEED','Signal-analysis simulation','🛰️','simulation','/simulations/satellite',true,7],
  ['secret-database','SECRET DATABASE','Clearance and OSINT training lab','🕵️','simulation','/simulations/database',true,8],
].map(([feature_key,name,description,icon,category,route,enabled,sort_order]) => ({id:feature_key as string,feature_key:feature_key as string,name:name as string,description:description as string,icon:icon as string,category:category as string,route:route as string,enabled:enabled as boolean,sort_order:sort_order as number}))

const defaultDeveloper: Developer = {
  name: 'Somesh Koli',
  bio: 'Cybersecurity learner & developer',
  avatar_url: null,
  instagram_primary: '@offx.somesh',
  instagram_secondary: '@developer.somesh',
  email: 'someshkoli442288@gmail.com',
  github_url: null,
  website_url: null,
  tagline: 'CYBERSECURITY // UI // SIMULATION',
}

const defaultBranding: Branding = { developer_logo_url: null, official_logo_url: null }

export default function Admin() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [features, setFeatures] = useState<Feature[]>(fallbackFeatures)
  const [developer, setDeveloper] = useState<Developer>(defaultDeveloper)
  const [branding, setBranding] = useState<Branding>(defaultBranding)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  const enabledCount = useMemo(() => features.filter(feature => feature.enabled).length, [features])

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) {
        setMessage('Supabase environment variables are missing.')
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!active) return
      setUserId(session?.user.id ?? null)
      setUserEmail(session?.user.email ?? '')

      if (session?.user.id) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
        if (active) setIsAdmin(profile?.role === 'admin')
      }

      const [{ data: featureRows }, { data: developerRow }, { data: brandingRow }] = await Promise.all([
        supabase.from('site_features').select('*').order('sort_order', { ascending: true }),
        supabase.from('developer_profile').select('*').eq('id', true).maybeSingle(),
        supabase.from('branding_settings').select('*').eq('id', true).maybeSingle(),
      ])
      if (!active) return
      if (featureRows?.length) setFeatures(featureRows as Feature[])
      if (developerRow) setDeveloper({ ...defaultDeveloper, ...developerRow })
      if (brandingRow) setBranding({ ...defaultBranding, ...brandingRow })
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setAuthLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email: userEmail, password })
    if (error) {
      setMessage(error.message)
      setAuthLoading(false)
      return
    }
    setUserId(data.user?.id ?? null)
    if (data.user?.id) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
      setIsAdmin(profile?.role === 'admin')
      setMessage(profile?.role === 'admin' ? 'ADMIN ACCESS GRANTED.' : 'Signed in, but this account is not an admin.')
    }
    setAuthLoading(false)
  }

  async function signOut() {
    await supabase?.auth.signOut()
    setUserId(null)
    setIsAdmin(false)
    setMessage('SIGNED OUT.')
  }

  function toggleFeature(id: string) {
    setFeatures(current => current.map(feature => feature.id === id ? { ...feature, enabled: !feature.enabled } : feature))
  }

  async function saveAll() {
    if (!supabase || !userId || !isAdmin) {
      setMessage('ADMIN AUTHENTICATION REQUIRED.')
      return
    }
    const client = supabase
    setSaved(false)
    setMessage('SYNCING WITH SUPABASE...')

    const featureResults = await Promise.all(features.map(feature =>
      client.from('site_features').update({ enabled: feature.enabled, sort_order: feature.sort_order, updated_at: new Date().toISOString() }).eq('id', feature.id)
    ))
    const featureError = featureResults.find(result => result.error)?.error

    const { error: developerError } = await client.from('developer_profile').upsert({
      id: true,
      name: developer.name,
      bio: developer.bio,
      avatar_url: developer.avatar_url,
      instagram_primary: developer.instagram_primary,
      instagram_secondary: developer.instagram_secondary,
      email: developer.email,
      github_url: developer.github_url,
      website_url: developer.website_url,
      tagline: developer.tagline,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })

    const { error: brandingError } = await client.from('branding_settings').upsert({
      id: true,
      developer_logo_url: branding.developer_logo_url,
      official_logo_url: branding.official_logo_url,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })

    if (featureError || developerError || brandingError) {
      setMessage(featureError?.message || developerError?.message || brandingError?.message || 'SAVE FAILED.')
      return
    }

    setSaved(true)
    setMessage('CONFIGURATION SAVED LIVE ✓')
    window.setTimeout(() => setSaved(false), 1800)
  }

  if (loading) return <main className="admin"><div className="adminWrap"><section className="panel"><h2>CYBERNEX ADMIN</h2><p>Loading control center...</p></section></div></main>

  return <main className="admin">
    <div className="adminWrap">
      <nav className="adminNav">
        <strong className="brand">CYBERNEX ADMIN</strong>
        <div className="buttons">
          <a className="btn secondary" href="/">VIEW SITE</a>
          {userId && <button className="btn secondary" onClick={signOut}>SIGN OUT</button>}
        </div>
      </nav>

      {!userId || !isAdmin ? <section className="panel adminAuth">
        <h2>ADMIN ACCESS</h2>
        <p>Sign in with a Supabase account whose <code>profiles.role</code> is <code>admin</code>. Regular users cannot change CYBERNEX configuration.</p>
        <form onSubmit={signIn}>
          <div className="field"><label>EMAIL</label><input type="email" value={userEmail} onChange={e=>setUserEmail(e.target.value)} required placeholder="admin@example.com" /></div>
          <div className="field"><label>PASSWORD</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" /></div>
          <button className="btn" disabled={authLoading}>{authLoading ? 'AUTHENTICATING...' : 'ENTER CONTROL CENTER'}</button>
        </form>
        {message && <div className="terminal" style={{marginTop:14}}>{message}</div>}
      </section> : <>
        <div className="adminGrid">
          <section className="panel">
            <h2>FEATURE CONTROL</h2>
            <p>Disable or restore any simulation module. Changes are persisted to Supabase.</p>
            {features.map(feature => <div className="switchRow" key={feature.id}>
              <span>{feature.name}<small style={{display:'block',opacity:.55}}>{feature.feature_key}</small></span>
              <input className="switch" type="checkbox" checked={feature.enabled} onChange={()=>toggleFeature(feature.id)} />
            </div>)}
          </section>

          <section className="panel">
            <h2>DEVELOPER INFORMATION</h2>
            <div className="field"><label>NAME</label><input value={developer.name} onChange={e=>setDeveloper({...developer,name:e.target.value})}/></div>
            <div className="field"><label>BIO</label><input value={developer.bio} onChange={e=>setDeveloper({...developer,bio:e.target.value})}/></div>
            <div className="field"><label>TAGLINE</label><input value={developer.tagline} onChange={e=>setDeveloper({...developer,tagline:e.target.value})}/></div>
            <div className="field"><label>EMAIL</label><input type="email" value={developer.email ?? ''} onChange={e=>setDeveloper({...developer,email:e.target.value})}/></div>
            <div className="field"><label>INSTAGRAM 1</label><input value={developer.instagram_primary ?? ''} onChange={e=>setDeveloper({...developer,instagram_primary:e.target.value})}/></div>
            <div className="field"><label>INSTAGRAM 2</label><input value={developer.instagram_secondary ?? ''} onChange={e=>setDeveloper({...developer,instagram_secondary:e.target.value})}/></div>
            <div className="field"><label>GITHUB URL</label><input value={developer.github_url ?? ''} onChange={e=>setDeveloper({...developer,github_url:e.target.value})}/></div>
            <div className="field"><label>WEBSITE URL</label><input value={developer.website_url ?? ''} onChange={e=>setDeveloper({...developer,website_url:e.target.value})}/></div>
          </section>

          <section className="panel">
            <h2>BRANDING</h2>
            <p>Use hosted image URLs for now. This keeps the browser client simple and lets you swap branding instantly.</p>
            <div className="field"><label>CYBERNEX MAIN LOGO URL</label><input value={branding.official_logo_url ?? ''} onChange={e=>setBranding({...branding,official_logo_url:e.target.value})} placeholder="https://.../cybernex-logo.png"/></div>
            <div className="field"><label>DEVELOPER LOGO URL</label><input value={branding.developer_logo_url ?? ''} onChange={e=>setBranding({...branding,developer_logo_url:e.target.value})} placeholder="https://.../developer-logo.png"/></div>
            {branding.official_logo_url && <img src={branding.official_logo_url} alt="CYBERNEX logo preview" style={{width:72,height:72,objectFit:'contain',border:'1px solid rgba(0,255,180,.25)',borderRadius:12}}/>}
          </section>

          <section className="panel">
            <h2>ADMIN STATUS</h2>
            <p>Modules enabled: {enabledCount}/{features.length}</p>
            <p>Signed in: {userEmail}</p>
            <p>Role: ADMIN</p>
            <p>Mode: SAFE SIMULATION</p>
            <div className="terminal" style={{marginTop:14}}>DATABASE: CONNECTED
{`\nRLS: ENFORCED\nFEATURE CONTROL: LIVE\nBRANDING: LIVE\nDEVELOPER PROFILE: LIVE`}</div>
            <button className="btn" style={{marginTop:14}} onClick={saveAll}>{saved ? 'SAVED ✓' : 'SAVE ALL CONFIG'}</button>
            {message && <p style={{marginTop:10}}>{message}</p>}
          </section>
        </div>
      </>}
    </div>
  </main>
}
