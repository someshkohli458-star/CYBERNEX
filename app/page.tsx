'use client'

import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'

type Feature={id:string;feature_key:string;name:string;description:string;icon:string;category:string;route:string|null;enabled:boolean;sort_order:number}
type Developer={name:string;bio:string;instagram_primary:string|null;instagram_secondary:string|null;email:string|null;tagline:string}
type Branding={official_logo_url:string|null;developer_logo_url:string|null}

const fallback:Feature[]=[
 ['security-camera','SECURITY CAMERA','Simulated camera investigation lab','📹','simulation','/simulations/camera',true,1],
 ['messenger-app','MESSENGER APP','Fake conversation analysis simulator','💬','simulation','/simulations/messenger',true,2],
 ['wifi-network','WIFI NETWORK','Wireless security learning lab','📶','simulation','/simulations/wifi',true,3],
 ['social-media','SOCIAL MEDIA','2FA security awareness demo','📸','simulation','/simulations/social',true,4],
 ['phone-gallery','PHONE GALLERY','Privacy and metadata simulator','🖼️','simulation','/simulations/gallery',true,5],
 ['vault-system','VAULT SYSTEM','Access-control training simulator','🏛️','simulation','/simulations/vault',true,6],
 ['satellite-feed','SATELLITE FEED','Signal-analysis simulation','🛰️','simulation','/simulations/satellite',true,7],
 ['secret-database','SECRET DATABASE','Clearance and OSINT training lab','🕵️','simulation','/simulations/database',true,8],
].map(([feature_key,name,description,icon,category,route,enabled,sort_order])=>({id:feature_key as string,feature_key:feature_key as string,name:name as string,description:description as string,icon:icon as string,category:category as string,route:route as string,enabled:enabled as boolean,sort_order:sort_order as number}))

export default function Home(){
 const [features,setFeatures]=useState<Feature[]>(fallback)
 const [developer,setDeveloper]=useState<Developer>({name:'Somesh Koli',bio:'Cybersecurity learner & developer',instagram_primary:'@offx.somesh',instagram_secondary:'@developer.somesh',email:'someshkoli442288@gmail.com',tagline:'CYBERSECURITY // UI // SIMULATION'})
 const [branding,setBranding]=useState<Branding>({official_logo_url:null,developer_logo_url:null})
 const [active,setActive]=useState<Feature|null>(null)

 useEffect(()=>{
  async function load(){
   if(!supabase)return
   const [{data:featureRows},{data:developerRow},{data:brandingRow}]=await Promise.all([
    supabase.from('site_features').select('*').eq('enabled',true).order('sort_order',{ascending:true}),
    supabase.from('developer_profile').select('name,bio,instagram_primary,instagram_secondary,email,tagline').eq('id',true).maybeSingle(),
    supabase.from('branding_settings').select('official_logo_url,developer_logo_url').eq('id',true).maybeSingle(),
   ])
   if(featureRows?.length)setFeatures(featureRows as Feature[])
   if(developerRow)setDeveloper(d=>({...d,...developerRow}))
   if(brandingRow)setBranding(b=>({...b,...brandingRow}))
  }
  load()
 },[])

 return <main className="shell">
  <header className="topbar"><div className="brand" style={{display:'flex',alignItems:'center',gap:10}}>{branding.official_logo_url&&<img src={branding.official_logo_url} alt="CYBERNEX" style={{width:32,height:32,objectFit:'contain'}}/>}<span>CYBERNEX</span></div><div className="status">● SYSTEM READY // v1.0.0</div></header>
  <div className="container">
   <section className="hero"><div className="eyebrow">[ SELECT YOUR SIMULATION ]</div><h1>CYBER TERMINAL</h1><p>Explore cinematic, controlled cybersecurity simulations designed for learning, demos and harmless pranks. No real device, account, camera or network is accessed.</p></section>
   <div className="section-title">AVAILABLE MODULES // {features.length}</div>
   <section className="grid">{features.map(f=><button className="card" key={f.id} onClick={()=>setActive(f)}><div className="icon">{f.icon}</div><div><h3>{f.name}</h3><p>{f.description}</p></div><span className="tag">SIM</span></button>)}</section>
   <section className="panel"><h2>LEVEL UP YOUR OPERATOR PROFILE</h2><p>Track simulated activity, explore modules and customize the interface. All activity stays inside the CYBERNEX experience.</p><div className="buttons"><a className="btn" href="/profile">PROFILE</a><a className="btn secondary" href="/settings">SETTINGS</a><a className="btn secondary" href="/developer">DEVELOPER</a><a className="btn secondary" href="/admin">ADMIN PANEL</a></div></section>
   <footer className="footer"><span>CYBERNEX // EDUCATION + SIMULATION</span><span>{developer.name} · {developer.tagline}</span></footer>
  </div>
  {active&&<div className="modalBackdrop" onClick={()=>setActive(null)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="section-title">{active.name}</div><div className="terminal">{`> CYBERNEX SIMULATION INITIALIZED\n> Module: ${active.name}\n> Environment: SANDBOX\n> Real-world access: DISABLED\n> Status: READY\n\nThis module is a visual/educational simulation only.`}</div><div className="buttons" style={{marginTop:14}}><button className="btn" onClick={()=>setActive(null)}>CLOSE</button></div></div></div>}
 </main>
}
