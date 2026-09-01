'use client'

import {useEffect,useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function Developer(){
 const [profile,setProfile]=useState({name:'Somesh Koli',bio:'CYBERNEX developer & UI creator.',avatar_url:'',instagram_primary:'@offx.somesh',instagram_secondary:'@developer.somesh',email:'someshkoli442288@gmail.com',tagline:'CYBERSECURITY // UI // SIMULATION'})
 useEffect(()=>{async function load(){if(!supabase)return;const {data}=await supabase.from('developer_profile').select('name,bio,avatar_url,instagram_primary,instagram_secondary,email,tagline').eq('id',true).maybeSingle();if(data)setProfile(p=>({...p,...data,avatar_url:data.avatar_url||''}))}load()},[])
 const insta=(value:string)=>value.replace(/^@/,'')
 return <main className="admin"><div className="adminWrap"><nav className="adminNav"><strong className="brand">CYBERNEX</strong><a className="btn secondary" href="/">HOME</a></nav><section className="panel" style={{marginTop:18,textAlign:'center'}}>{profile.avatar_url?<img src={profile.avatar_url} alt={profile.name} style={{width:88,height:88,borderRadius:'50%',objectFit:'cover',border:'2px solid #34ff55'}}/>:<div style={{fontSize:48}}>◉</div>}<h1 style={{color:'#34ff55',letterSpacing:4}}>DEVELOPER</h1><h2 style={{color:'#d9ffe0'}}>{profile.name}</h2><p>{profile.bio}</p><p style={{opacity:.65}}>{profile.tagline}</p><div className="buttons" style={{justifyContent:'center',marginTop:18}}><a className="btn" href={`https://instagram.com/${insta(profile.instagram_primary||'')}`} target="_blank" rel="noreferrer">{profile.instagram_primary||'INSTAGRAM'}</a><a className="btn" href={`https://instagram.com/${insta(profile.instagram_secondary||'')}`} target="_blank" rel="noreferrer">{profile.instagram_secondary||'INSTAGRAM'}</a>{profile.email&&<a className="btn secondary" href={`mailto:${profile.email}`}>EMAIL</a>}</div></section></div></main>
}
