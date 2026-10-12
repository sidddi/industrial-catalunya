/* FP: dades oficials separades dels càlculs universitaris. */
(()=>{
'use strict';
const el=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),normal=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let data=null,level='uni',limit=40;
const buttons=[...document.querySelectorAll('[data-study]')];
buttons.forEach(b=>b.onclick=()=>switchTo(b.dataset.study));
function switchTo(next){
 level=next;buttons.forEach(b=>b.setAttribute('aria-pressed',b.dataset.study===level));
 el('uni-content').hidden=level!=='uni';el('university-sources').hidden=level!=='uni';el('banner').hidden=level!=='uni';el('fp-content').hidden=level==='uni';
 if(level==='uni')return;
 el('fp-heading').textContent=level==='gs'?'Cicles de grau superior':'Cicles de grau mitjà';
 if(data){setup();return;}
 el('fp-results').textContent='Carregant els cicles...';
 fetch('fp-data.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(d.packed){const unpack=v=>v&&typeof v==='object'&&'s'in v?d.strings[v.s]:v;const rows=d.rows.map(r=>{const x={};d.keys.forEach((k,i)=>x[k]=unpack(r[i]));x.notes=Object.fromEntries(r[d.keys.length].map(p=>p.map(unpack)));return x;});d={ofertes:rows.slice(0,d.countCurrent),historiques:rows.slice(d.countCurrent),vies:d.vies};}data=d;setup()}).catch(()=>{el('fp-results').textContent='No s’han pogut carregar les dades. Torna a carregar la pàgina.'});
}
function setup(){
 const rows=[...data.ofertes,...data.historiques].filter(x=>x.nivell===level);
 const opts=(id,values,title)=>{el(id).innerHTML=`<option value="">${title}</option>`+[...new Set(values)].filter(Boolean).sort((a,b)=>a.localeCompare(b,'ca')).map(v=>`<option>${esc(v)}</option>`).join('');};
 opts('fp-family',rows.map(x=>x.familia),'Totes les famílies');opts('fp-town',rows.map(x=>x.municipi),'Tots els municipis');opts('fp-shift',rows.map(x=>x.torn),'Tots els torns');opts('fp-route',data.vies[level],'Tria la teva via per veure la nota');
 el('fp-history').checked=false;el('fp-q').value='';el('fp-province').value='';el('fp-error').textContent='';limit=40;render();
}
function filtered(){
 const q=normal(el('fp-q').value),family=el('fp-family').value,town=el('fp-town').value,prov=el('fp-province').value,shift=el('fp-shift').value;
 return [...data.ofertes,...(el('fp-history').checked?data.historiques:[])].filter(x=>x.nivell===level&&(!q||normal(x.nom+' '+x.centre+' '+x.municipi+' '+x.familia).includes(q))&&(!family||x.familia===family)&&(!town||x.municipi===town)&&(!prov||x.provincia===prov)&&(!shift||x.torn===shift)).sort((a,b)=>a.nom.localeCompare(b.nom,'ca')||a.municipi.localeCompare(b.municipi,'ca')||a.centre.localeCompare(b.centre,'ca'));
}
function card(x){
 const via=el('fp-route').value,raw=x.notes[via],note=raw==='(*)'?'Sense oferta de places en aquesta via el 2025/26':raw===undefined?'Nota no vinculada a aquesta oferta. Consulta la font oficial.':'Nota de tall 2025/26: '+raw.replace('.',',');
 const aero=/aero|avi[oò]|avions|helic[oò]pter/i.test(x.nom);
 const links=aero&&x.codiCentre==='08031836'?`<p class="small"><a href="https://insilla.net/cicles-grau-superior/2x3-manteniment-aeromecanic-davions/" target="_blank" rel="noopener">Itineraris aeronàutics de l’Illa dels Banyols</a>. Els itineraris conjunts poden durar tres cursos; comprova el cicle d’entrada i els requisits amb el centre.</p>`:'';
 return `<article class="deg fp-course"><span class="tariff">${x.vigent?'Oferta inicial 2026/27':'Referència històrica 2025/26'}</span><h3>${esc(x.nom)}</h3><p class="meta">${esc(x.centre)} · ${esc(x.municipi)} · ${esc(x.torn)}</p><p class="small">${esc(x.familia)}${x.titularitat?' · Centre '+esc(x.titularitat.toLowerCase()):''}${x.places!==undefined?' · '+x.places+' places de preinscripció a l’oferta inicial':''}</p>${via?`<p class="estat">${esc(note)}</p><p class="small">${esc(via)}</p>`:'<p class="small">Tria la via d’accés per consultar el tall. Un mateix centre pot tenir notes diferents segons la via.</p>'}<details><summary>Notes i fonts</summary>${Object.entries(x.notes).length?`<dl class="fp-notes">${Object.entries(x.notes).map(([v,n])=>`<div><dt>${esc(v)}</dt><dd>${n==='(*)'?'Sense oferta de places':esc(n.replace('.',','))}</dd></div>`).join('')}</dl>`:'<p class="small">No s’ha verificat una coincidència exacta amb el catàleg de tall. No assignem notes per semblança de nom.</p>'}<p class="small">${x.font?`<a href="${esc(x.font)}" target="_blank" rel="noopener">Notes oficials 2025/26</a> · `:''}${x.fontOferta?`<a href="${esc(x.fontOferta)}" target="_blank" rel="noopener">Oferta inicial oficial 2026/27</a> · `:''}Verificat el 12/10/2026. ${x.codi?esc(x.codi)+' · '+esc(x.codiCentre):''}</p>${links}</details></article>`;
}
function render(){
 if(!data)return;
 const rows=filtered();el('fp-selected-route').textContent=el('fp-route').value;el('fp-count').textContent=`${rows.length.toLocaleString('ca')} opcions de cicle, centre i torn. Mostrant ${Math.min(limit,rows.length)}.`;
 el('fp-results').innerHTML=rows.slice(0,limit).map(card).join('')||'<div class="empty"><h3>No hi ha coincidències</h3><p>Prova un altre nom o treu algun filtre. Aquesta cerca no inclou tota l’oferta privada.</p></div>';
 el('fp-more').hidden=rows.length<=limit;
 el('fp-efav').hidden=!(level==='gs'&&(/aero|avi|efav|vilanova/i.test(normal(el('fp-q').value))));
}
['fp-q','fp-family','fp-town','fp-province','fp-shift','fp-route','fp-history'].forEach(id=>el(id).addEventListener('input',()=>{limit=40;render()}));
 el('fp-more').onclick=()=>{limit+=40;render()};el('fp-reset').onclick=setup;
 document.querySelectorAll('[data-fp-aero]').forEach(b=>b.onclick=()=>{switchTo(b.dataset.fpAero);const run=()=>{if(data){el('fp-q').value='aero';render();el('fp-content').scrollIntoView({behavior:'smooth'});}else setTimeout(run,100)};run();});
})();
