/* Loads saved admin content (if the /api exists) and then starts the portfolio. */
(()=>{
  const P=window.PORTFOLIO,file=id=>'/api/file/'+id,lines=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean),parts=l=>l.split('|').map(x=>x.trim());
  const ready=new Promise(r=>document.readyState!=='loading'?r():addEventListener('DOMContentLoaded',r));
  const data=fetch('/api/data',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}));
  Promise.all([data,ready]).then(([d])=>{
    try{
      const c=d.content||{};
      ['role','location','intro','about','email'].forEach(k=>{if(c[k])P[k]=c[k]});
      if(c.skills)P.skills=c.skills.split(',').map(s=>s.trim()).filter(Boolean);
      P.links={...P.links};
      ['instagram','linkedin'].forEach(k=>{if(c[k])P.links[k]=c[k]});
      if(c.whatsapp)P.links.whatsapp='https://wa.me/'+c.whatsapp.replace(/\D/g,'');
      if(c.portraitId)P.portrait=file(c.portraitId);
      if(c.resumeId)P.resume=file(c.resumeId);
      if(c.education!==undefined)P.education=lines(c.education).map(l=>{const p=parts(l);return{school:p[0]||'',degree:p[1]||'',period:p[2]||''}});
      if(c.services!==undefined)P.services=lines(c.services).map(l=>{const p=parts(l);return{title:p[0]||'',detail:p[1]||''}});
      if(Array.isArray(d.items))P.projects=d.items.map(i=>({title:i.title,category:i.category||'Collection',description:i.description||'',stack:String(i.tags||'').split(',').map(s=>s.trim()).filter(Boolean),features:[],images:(i.images||[]).map(x=>file(x.id)),accent:P.accent}));
    }catch(e){}
    const s=document.createElement('script');s.src='app.js';document.body.append(s);
  });
})();
