'use client'
import {useState} from 'react'

const initial=['SECURITY CAMERA','MESSENGER APP','WIFI NETWORK','SOCIAL MEDIA','PHONE GALLERY','VAULT SYSTEM','SATELLITE FEED','SECRET DATABASE']
export default function Admin(){
 const [items,setItems]=useState(initial.map(name=>({name,enabled:true})))
 const [name,setName]=useState('Somesh Koli')
 const [email,setEmail]=useState('someshkoli442288@gmail.com')
 const [saved,setSaved]=useState(false)
 const toggle=(name:string)=>setItems(x=>x.map(i=>i.name===name?{...i,enabled:!i.enabled}:i))
 return <main className="admin"><div className="adminWrap">
  <nav className="adminNav"><strong className="brand">CYBERNEX ADMIN</strong><a className="btn secondary" href="/">VIEW SITE</a></nav>
  <div className="adminGrid">
   <section className="panel"><h2>FEATURE CONTROL</h2><p>Turn website simulation modules on/off. Disabled modules can be restored anytime.</p>{items.map(i=><div className="switchRow" key={i.name}><span>{i.name}</span><input className="switch" type="checkbox" checked={i.enabled} onChange={()=>toggle(i.name)}/></div>)}</section>
   <section className="panel"><h2>DEVELOPER INFORMATION</h2><div className="field"><label>NAME</label><input value={name} onChange={e=>setName(e.target.value)}/></div><div className="field"><label>EMAIL</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field"><label>INSTAGRAM 1</label><input defaultValue="@offx.somesh"/></div><div className="field"><label>INSTAGRAM 2</label><input defaultValue="@developer.somesh"/></div><button className="btn" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1800)}}>{saved?'SAVED ✓':'SAVE CHANGES'}</button></section>
   <section className="panel"><h2>BRANDING</h2><p>Logo management controls are reserved here for the upcoming Supabase Storage integration.</p><div className="field"><label>CYBERNEX MAIN LOGO</label><input type="file" accept="image/*"/></div><div className="field"><label>DEVELOPER LOGO</label><input type="file" accept="image/*"/></div></section>
   <section className="panel"><h2>ADMIN STATUS</h2><p>Modules enabled: {items.filter(i=>i.enabled).length}/{items.length}</p><p>Developer: {name} · {email}</p><p>Mode: SAFE SIMULATION</p></section>
  </div>
 </div></main>
}
