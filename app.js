const UNI={UAB:'Universitat Autònoma de Barcelona',UB:'Universitat de Barcelona',UdG:'Universitat de Girona',URV:'Universitat Rovira i Virgili',UPC:'Universitat Politècnica de Catalunya',UdL:'Universitat de Lleida',UPF:'Universitat Pompeu Fabra',UVic:'Universitat de Vic',"UVic-UCC":'Universitat de Vic - Universitat Central de Catalunya',UAO:'Universitat Abat Oliba CEU',UOC:'Universitat Oberta de Catalunya',UIC:'Universitat Internacional de Catalunya',URL:'Universitat Ramon Llull'};
const $=id=>document.getElementById(id);let D,state={mode:'explore',method:'calc',max:50,mats:[{i:'',g:''}]};
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const num=v=>{v=(v||'').trim().replace(',','.');return v===''?null:Number(v)};
const f=x=>x.toFixed(3).replace('.',',');const f1=x=>String(x).replace('.',',');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
function acces(){const b=num($('batx').value),p=num($('pau').value),direct=num($('access-direct').value);let err='';
 const valid=x=>x!==null&&Number.isFinite(x)&&x>=0&&x<=10;
 if(state.method==='direct'){if(direct!==null&&!valid(direct))err='La nota d’accés ha de ser entre 0 i 10.';}
 else {if(b!==null&&!valid(b))err='El batxillerat ha de ser entre 0 i 10.';if(p!==null&&!valid(p))err='La fase general ha de ser entre 0 i 10.';if(valid(p)&&p<4)err='Cal una fase general de 4 o més per superar les PAU.';}
 for(const m of state.mats){const g=num(m.g);if(m.g!==''&&!valid(g))err='Les notes de la fase específica van de 0 a 10.';}
 let a=state.method==='direct'?direct:(valid(b)&&valid(p)?Math.round((0.6*b+0.4*p)*1000)/1000:null);
 if(a!==null&&a<5)err='Cal una nota d’accés de 5 o més per superar aquesta via d’accés.';
 $('err').textContent=err;if(err)a=null;$('acc').textContent=a===null?'–':f(a);return a;}
function drawMats(){$('mats').innerHTML=state.mats.map((m,k)=>`<div class="mrow"><label>Matèria<select data-k="${k}" data-f="i"><option value="">Tria...</option>${D.materies.map((x,i)=>({x,i})).filter(({i})=>subjectVisible(i)||String(i)===String(m.i)).map(({x,i})=>`<option value="${i}"${String(i)===String(m.i)?' selected':''}>${esc(x)}</option>`).join('')}</select></label><label>Nota<input data-k="${k}" data-f="g" inputmode="decimal" placeholder="0-10" value="${esc(m.g)}"></label><button type="button" data-d="${k}" aria-label="Treu la matèria">×</button></div>`).join('');
 $('mats').querySelectorAll('[data-f]').forEach(e=>e.addEventListener('input',()=>{state.mats[+e.dataset.k][e.dataset.f]=e.value;render()}));
 $('mats').querySelectorAll('[data-d]').forEach(e=>e.onclick=()=>{state.mats.splice(+e.dataset.d,1);if(!state.mats.length)state.mats.push({i:'',g:''});drawMats();render()})}
// Nota d'admissió d'un grau: accés + a*M1 + b*M2 (dues millors matèries ponderades, notes >= 5)
function admissio(a,o){if(a===null||!o.w||o.revisio)return null;let extra=0,usades=[];
 if(o.w){const c=[];for(const m of state.mats){const g=num(m.g);if(m.i===''||g===null||g<5)continue;const w=o.w[m.i];if(w){const old=c.find(z=>z.i===m.i);if(!old)c.push({i:m.i,g,w,v:g*w});else if(g>old.g)Object.assign(old,{g,v:g*w});}}
  c.sort((x,y)=>y.v-x.v);const t=c.slice(0,2);extra=t.reduce((s,x)=>s+x.v,0);usades=t}
 return{n:Math.min(14,Math.round((a+extra)*1000)/1000),extra,usades}}
function degreeCard(x,a){const ys=Object.keys(x.t).sort(),c=x.t[ys.at(-1)],r=admissio(a,x),e=!r?null:r.n>=c?'ok':r.n>=c-0.5?'lim':'no';
  const txt={ok:'Hi hauries entrat amb aquesta nota',lim:'Al límit: et falten menys de 0,5 punts',no:'Et faltaria nota'}[e]||'';
  const revisio=x.revisio; const successor=revisio&&revisio.successor?D.ofertes.find(z=>z.c===revisio.successor):null;
  const avís=revisio?`<div class="adm"><strong>${revisio.estat==='no_verificat'?'Ponderació 2027 no verificada':'Oferta històrica'}</strong><br>${esc(revisio.nota)} ${revisio.fonts.map((url,i)=>`<a href="${esc(url)}" target="_blank" rel="noopener">Font oficial${revisio.fonts.length>1?' '+(i+1):''}</a>`).join(' · ')}${successor?`<br>Oferta actual: <a href="#grau-${successor.c}" data-successor="${successor.c}">${esc(successor.n)}</a>`:''}</div>`:(!x.w?'<div class="adm">Ponderació 2027 no verificada. No es pot calcular la nota d’admissió ni indicar si hi hauries entrat.</div>':'');
  const adm=r?`<div class="adm">La teva nota d'admissió per a aquest grau: <strong>${f(r.n)}</strong> <span class="sp">${x.w?(r.usades.length?'(accés '+f(a)+' + '+r.usades.map(z=>f1(z.w)+'×'+f1(z.g)+' '+esc(D.materies[z.i])).join(' + ')+')':'(només nota d\'accés: no hi ha cap matèria ponderada amb 5 o més)'):'(ponderació no verificada)'}</span>${x.q===2?'<br><span class="sp">Ponderació assignada per equivalència de nom (el grau ha canviat de nom o d\'adscripció al PDF): comprova-la al <a href="https://universitats.gencat.cat/ca/preinscripcions/ponderacions/" target="_blank" rel="noopener">Canal Universitats</a>.</span>':''}</div>`:'';
  return `<article id="grau-${x.c}" class="deg ${e||''}"><h3>${esc(x.n)}</h3><div class="meta">${esc(UNI[x.u]||x.u)} · ${esc(x.m)}</div>${infoCard(x)}${e?`<div class="estat">${txt} (tall ${ys[ys.length-1]}: ${f(c)})</div>`:''}${adm}${avís}
  <div class="anys">${ys.map(y=>{const t=x.t[y],cl=r?(r.n>=t?'y':'n'):'';return `<span class="${cl}">${y}: ${t<=5?'5,000 (sense tall)':f(t)} · ${x.p[y]} places</span>`}).join('')}</div></article>`;}
function render(){const a=acces();$('bn').textContent=a===null?'–':f(a);
 if(state.mode==='explore'){renderExplore(a);return;}
 const q=norm($('q').value),u=$('uni').value,m=$('mun').value,o=$('ord').value,only=$('nomes').checked;
 let L=D.ofertes.filter(x=>locationMatches(x)&&pathMatches(x)&&(!q||norm(x.n).includes(q))&&(!u||x.u===u)&&(!m||x.m.split('/').includes(m)));
 const last=x=>{const ys=Object.keys(x.t).sort();return x.t[ys[ys.length-1]]};
 const R=new Map(L.map(x=>[x,admissio(a,x)]));
 const est=x=>{const r=R.get(x);if(!r)return null;const c=last(x);return r.n>=c?'ok':r.n>=c-0.5?'lim':'no'};
 if(only&&a!==null)L=L.filter(x=>est(x)==='ok');
 if(o==='d')L.sort((x,y)=>last(y)-last(x));else if(o==='a')L.sort((x,y)=>last(x)-last(y));
 $('res').textContent=L.length+' graus'+(a===null?'. Escriu les teves notes per veure si hi entraries.':'');
 $('llista').innerHTML=L.slice(0,state.max).map(x=>degreeCard(x,a)).join('')
  +(L.length>state.max?`<button class="mes" id="mes">Mostra'n més</button>`:'');
 $('llista').querySelectorAll('[data-successor]').forEach(el=>el.onclick=ev=>{ev.preventDefault();const target=D.ofertes.find(z=>z.c===el.dataset.successor);$('q').value=target.n;$('uni').value=target.u;$('mun').value='';$('nomes').checked=false;state.max=50;render();$('llista').scrollIntoView({behavior:'smooth'});});
 const b=$('mes');if(b)b.onclick=()=>{state.max+=50;render()}}
fetch('data.json').then(r=>r.json()).then(d=>{D=d;discoveryInit();
 const us=[...new Set(d.ofertes.map(x=>x.u))].sort(),ms=[...new Set(d.ofertes.flatMap(x=>x.m.split('/')))].sort((a,b)=>a.localeCompare(b,'ca'));
 $('uni').innerHTML+=us.map(x=>`<option value="${x}">${UNI[x]||x}</option>`).join('');$('mun').innerHTML+=ms.map(x=>`<option>${x}</option>`).join('');
 ['batx','pau','access-direct','branch','all-paths','province','explore-fit','family','q','uni','mun','ord','nomes'].forEach(i=>$(i).addEventListener('input',()=>{state.max=50;render()}));

 $('branch').addEventListener('input',()=>{drawMats();renderSubjectGuide();});$('all-subjects').addEventListener('input',()=>{drawMats();renderSubjectGuide();});
 const mode=which=>{state.mode=which;document.body.dataset.mode=which;$('grade-panel').open=which==='search';$('mode-search').setAttribute('aria-pressed',which==='search');$('mode-explore').setAttribute('aria-pressed',which==='explore');$('search-controls').hidden=which!=='search';$('explore-controls').hidden=which!=='explore';$('only-control').hidden=which!=='search';$('sort-control').hidden=which!=='search';$('explore-grade-control').hidden=which!=='explore';render();};
 $('mode-search').onclick=()=>mode('search');$('mode-explore').onclick=()=>mode('explore');
 document.querySelectorAll('[name="grade-method"]').forEach(el=>el.onchange=()=>{state.method=el.value;$('direct-grade').hidden=el.value!=='direct';$('calc-grade').hidden=el.value!=='calc';render();});
 $('addm').onclick=()=>{state.mats.push({i:'',g:''});drawMats()};drawMats();renderSubjectGuide();mode('explore')}).catch(()=>{$('res').textContent='Impossible carregar les dades. Torna a carregar la pàgina.';});
