const UNI={UAB:'Universitat Autònoma de Barcelona',UB:'Universitat de Barcelona',UdG:'Universitat de Girona',URV:'Universitat Rovira i Virgili',UPC:'Universitat Politècnica de Catalunya',UdL:'Universitat de Lleida',UPF:'Universitat Pompeu Fabra',UVic:'Universitat de Vic',"UVic-UCC":'Universitat de Vic - Universitat Central de Catalunya',UAO:'Universitat Abat Oliba CEU',UOC:'Universitat Oberta de Catalunya',UIC:'Universitat Internacional de Catalunya',URL:'Universitat Ramon Llull'};
const $=id=>document.getElementById(id);let D,state={max:50};
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const num=v=>{v=(v||'').trim().replace(',','.');return v===''?null:Number(v)};
const f=x=>x.toFixed(3).replace('.',',');
function nota(){const b=num($('batx').value),p=num($('pau').value),e=num($('esp').value)||0;let err='';
 if(b!==null&&!(b>=0&&b<=10))err='El batxillerat ha de ser entre 0 i 10.';
 if(p!==null&&!(p>=0&&p<=10))err='La fase general ha de ser entre 0 i 10.';
 if(e<0||e>4||isNaN(e))err='Els punts de la fase específica van de 0 a 4.';
 $('err').textContent=err;if(err)return null;
 if(b===null||p===null){$('acc').textContent='–';return null}
 const a=Math.round((0.6*b+0.4*p)*1000)/1000;$('acc').textContent=f(a);return Math.min(14,a+e)}
function render(){const g=nota();$('bn').textContent=g===null?'–':f(g);
 const q=norm($('q').value),u=$('uni').value,m=$('mun').value,o=$('ord').value,only=$('nomes').checked;
 let L=D.ofertes.filter(x=>(!q||norm(x.n).includes(q))&&(!u||x.u===u)&&(!m||x.m===m));
 const last=x=>{const ys=Object.keys(x.t).sort();return ys.length?x.t[ys[ys.length-1]]:null};
 const est=x=>{if(g===null)return null;const c=last(x);return g>=c?'ok':g>=c-0.5?'lim':'no'};
 if(only&&g!==null)L=L.filter(x=>est(x)==='ok');
 if(o==='d')L.sort((a,b)=>last(b)-last(a));else if(o==='a')L.sort((a,b)=>last(a)-last(b));
 $('res').textContent=L.length+' graus'+(g===null?'. Escriu les teves notes per veure si hi entraries.':'');
 const sh=L.slice(0,state.max);
 $('llista').innerHTML=sh.map(x=>{const ys=Object.keys(x.t).sort(),e=est(x),c=last(x);
  const txt={ok:'Hi hauries entrat amb aquesta nota',lim:'Al límit: et falten menys de 0,5 punts',no:'Et faltaria nota (és més alta que la teva)'}[e]||'';
  return `<article class="deg ${e||''}"><h3>${x.n.replace(/</g,'&lt;')}</h3><div class="meta">${UNI[x.u]||x.u} · ${x.m}</div>${e?`<div class="estat">${txt} (tall ${ys[ys.length-1]}: ${f(c)})</div>`:''}
  <div class="anys">${ys.map(y=>{const t=x.t[y],cl=g===null?'':(g>=t?'y':'n');return `<span class="${cl}">${y}: ${t<=5?'5,000 (sense tall)':f(t)} · ${x.p[y]} places</span>`}).join('')}</div></article>`}).join('')
  +(L.length>state.max?`<button class="mes" id="mes">Mostra'n més</button>`:'');
 const b=$('mes');if(b)b.onclick=()=>{state.max+=50;render()}}
fetch('data.json').then(r=>r.json()).then(d=>{D=d;
 const us=[...new Set(d.ofertes.map(x=>x.u))].sort(),ms=[...new Set(d.ofertes.map(x=>x.m))].sort((a,b)=>a.localeCompare(b,'ca'));
 $('uni').innerHTML+=us.map(x=>`<option value="${x}">${UNI[x]||x}</option>`).join('');$('mun').innerHTML+=ms.map(x=>`<option>${x}</option>`).join('');
 ['batx','pau','esp','q','uni','mun','ord','nomes'].forEach(i=>$(i).addEventListener('input',()=>{state.max=50;render()}));render()});
