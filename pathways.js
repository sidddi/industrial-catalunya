/* Orientació editorial. Les matèries d'admissió són de lliure elecció. */
const PATH_SUBJECTS={tec:[6,11,21,24,25,22],sci:[2,3,11,13,21,24,22],soc:[10,12,14,21,22],hum:[12,14,16,17,19,20],art:[0,1,4,5,7,8,9,14,15,18,23,26],general:[3,10,12,21,22]};
function subjectVisible(i){const b=$('branch').value;return !b||$('all-subjects').checked||PATH_SUBJECTS[b]?.includes(i);}
function renderSubjectGuide(){const b=$('branch').value;$('subject-guide').textContent=b&&!$('all-subjects').checked?'Mostrem primer les matèries afins al teu itinerari. Les matèries ja triades es conserven; pots veure-les totes.':'Pots triar qualsevol matèria ponderada. Inclou també la matèria de modalitat de la fase general si pondera per al grau.';}
function pathMatches(x){const b=$('branch').value;return !b||b==='general'||$('all-paths').checked||familiesFor(x).some(f=>f.branches.includes(b));}
function locationMatches(x){const p=$('province').value;return !p||x.m.split('/').some(m=>D.provincies[m]===p);}
function infoCard(x){const i=x.info||{},c=i.cost;let cost='Import no verificat: consulta el centre';
 if(c){cost=c.label;}
 const tariff=i.tarifa==='publica'?'Tarifa pública':i.tarifa==='privada'?'Tarifa privada / pròpia':'Tarifa pendent de verificar';
 const components=(i.fonts_components||[]).map((url,k)=>`<a href="${esc(url)}" target="_blank" rel="noopener">Component ${k+1}</a>`).join(' · ');const link=i.url?`<a href="${esc(i.url)}" target="_blank" rel="noopener">Fitxa oficial del grau</a>`:'';
 const description=i.descripcio||'Descripció breu pendent de verificar. Consulta la fitxa oficial per conèixer els continguts del grau.';
 const careers=i.ambits||i.sortides||'Sortides pendents de verificar. Consulta la fitxa oficial; algunes professions requereixen un màster o altres requisits.';
 return `<div class="degree-facts"><span class="tariff ${i.tarifa||'unknown'}">${tariff}</span><strong class="cost">${esc(cost)}</strong></div>${i.centre?`<p class="small centre">${esc(i.centre)} · ${esc(i.adscripcio||'')}</p>`:''}${c?`<p class="small cost-note">${esc(c.note)} <a href="${esc(c.url)}" target="_blank" rel="noopener">Font del preu</a></p>`:'<p class="small cost-note">No assignem el preu públic als centres de tarifa pròpia.</p>'}<div class="degree-about"><p><strong>Què hi estudiaràs?</strong> ${esc(description)}</p><p><strong>Sortides professionals</strong> ${esc(careers)}</p><p class="small">${link}${i.descripcio||i.ambits||i.sortides?' · Extracte de la fitxa oficial (10/10/2026)':''}${i.combinat?' · Orientació dels graus components; consulta el pla combinat '+components:''}</p></div>`;
}
