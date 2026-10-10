/* Agrupació editorial per paraules del nom del grau, no una classificació oficial.
   La modalitat de batxillerat ordena les famílies; mai no limita l'accés. */
const FAMILIES = [
 {id:'industrial', name:'Indústria, energia i transport', icon:'⚙', hint:'De les tecnologies industrials a l’automoció, l’energia i l’automatització.', re:/industrial|mecanic|mecatron|automocio|automatica|electrica|energia|materials|aero|naval|nautica|marines|maritim|satel.lit|ferroviar|textil/, branches:['tec']},
 {id:'digital', name:'Informàtica, dades i tecnologia', icon:'⌘', hint:'Informàtica, intel·ligència artificial, dades, telecomunicacions i videojocs.', re:/informat|dades|intel.ligencia artificial|ciberseguretat|telecom|telematica|sistemes tic|xarxes|videojocs|robotica|multimedia|informatica i serveis|ciutats intel/, branches:['tec']},
 {id:'science', name:'Ciències, natura i alimentació', icon:'◉', hint:'Biologia, física, química, matemàtiques, medi ambient i alimentació.', re:/biolog|biotec|bioquim|genetica|microbiolog|fisica|quimica|matemati|estadistica|ambient|geolog|mar\b|agro|agrari|agronom|forestal|natura|enologia|aliment|ciencies$|nanociencia|bioprocess/, branches:['sci','tec']},
 {id:'health', name:'Salut i benestar', icon:'♡', hint:'Medicina, infermeria, teràpies, nutrició i altres graus de salut.', re:/medicina|biomed|biomedi|inferm|fisioter|farmacia|nutricio|odontolog|podolog|optica|audiolog|logopedia|terapia|veterin|psicologia|humana/, branches:['sci']},
 {id:'business', name:'Empresa, economia i turisme', icon:'↗', hint:'Gestió d’empreses, economia, màrqueting, turisme i hoteleria.', re:/empres|negoci|econom|finances|comptabil|marqueting|turisme|hotel|gastronom|culinari|management|logistica/, branches:['soc']},
 {id:'society', name:'Dret, societat i política', icon:'◎', hint:'Dret, política, sociologia, relacions internacionals i seguretat.', re:/dret|criminolog|politic|sociolog|antropolog|relacions internacionals|relacions laborals|seguretat|estudis globals|genere|direccio publica|administracio publica|societat digital/, branches:['soc','hum']},
 {id:'education', name:'Educació i esport', icon:'✦', hint:'Educació infantil i primària, pedagogia, educació social i esport.', re:/educacio|pedagog|treball social|esport|fitnes/, branches:['soc','sci']},
 {id:'humanities', name:'Llengües, història i humanitats', icon:'¶', hint:'Llengües, traducció, literatura, història, filosofia i patrimoni.', re:/lleng|liter|filolog|traduc|lingu|angles|catala|espanyol|frances|arab|hebre|asia|xines|corea|antiguitat|historia|arqueolog|filosof|humanitats|cultura|patrimoni|documentacio/, branches:['hum','soc']},
 {id:'creative', name:'Art, disseny i comunicació', icon:'◈', hint:'Disseny, arts, cinema, música, comunicació i publicitat.', re:/disseny|belles arts|arts |art digital|animacio|cinema|music|comunicacio|audiovisual|mitjans|periodisme|publicitat|moda|restauracio.*culturals/, branches:['art']},
 {id:'architecture', name:'Arquitectura i territori', icon:'⌂', hint:'Arquitectura, edificació, enginyeria civil, paisatge i geografia.', re:/arquitect|edificacio|civil|paisatg|geografia|geoinform|geomat|territor/, branches:['tec','art']},
 {id:'open', name:'Estudis oberts i altres camins', icon:'↔', hint:'Programes oberts i graus que combinen àmbits diferents.', re:/grau obert/, branches:[]}
];
function familiesFor(x) {const n=norm(x.n);const f=FAMILIES.filter(f=>f.id!=='open'&&f.re.test(n));return f.length?f:[FAMILIES.at(-1)];}
function isCombined(x){return /simultane|agrupacio|\s\/\s/.test(norm(x.n));}
function canExplore(x){return x.t['2026']!==undefined;}
function renderExplore(a){
 const branch=$('branch').value, selected=$('family').value, u=$('uni').value,m=$('mun').value;
 const valid=a!==null&&a>=5; const all=D.ofertes.filter(x=>canExplore(x)&&locationMatches(x)&&pathMatches(x)&&(!u||x.u===u)&&(!m||x.m.split('/').includes(m)));
 const gradeFilter=$('explore-fit').checked;const fits=gradeFilter&&valid?all.filter(x=>{const r=admissio(a,x);return r&&r.n>=x.t['2026']}):all;
 const groups=FAMILIES.filter(f=>!selected||f.id===selected).map(f=>({...f,items:fits.filter(x=>familiesFor(x).includes(f))}));
 groups.sort((a,b)=>Number(b.branches.includes(branch))-Number(a.branches.includes(branch)));
 $('res').textContent=valid?`${fits.length} opcions de grau i centre amb nota suficient segons el tall de 2026. Un grau pot aparèixer en més d’una família.`:'Posa la teva nota d’accés per descobrir opcions. Si tens notes de matèries específiques, afegeix-les: poden obrir més portes.';
 if(gradeFilter&&!valid){$('llista').innerHTML=`<div class="empty"><span class="empty-icon">↗</span><h3>On et pot portar la teva nota?</h3><p>Posa les notes per activar aquest filtre, o descobreix els graus sense nota.</p><p class="small">La branca de batxillerat només ordena els àmbits. No tanca cap porta.</p><button type="button" class="family-more" id="without-grade">Veure més opcions sense nota</button></div>`;$('without-grade').onclick=()=>{$('explore-fit').checked=false;render()};return;}
 if(!fits.length){$('llista').innerHTML='<div class="empty"><h3>No hi ha coincidències amb aquests filtres</h3><p>Prova un altre municipi o afegeix les notes de la fase específica. No canviïs les notes per encaixar-hi: el resultat és orientatiu.</p></div>';return;}
 const visible=groups.filter(g=>g.items.length);
 if(!visible.length){$('res').textContent='Cap opció en aquesta família amb aquests filtres.';$('llista').innerHTML='<div class="empty"><h3>No hi ha coincidències en aquesta família</h3><p>Tria totes les famílies, un altre municipi o afegeix les notes de la fase específica.</p></div>';return;}
 const count=new Set(visible.flatMap(g=>g.items.map(x=>x.c))).size;
 $('res').textContent=`${count} opcions de grau i centre${gradeFilter?' amb nota suficient':' per descobrir'}. Notes de tall de 2026; no són una garantia d’admissió.`;
 $('llista').innerHTML=`<div class="explore-summary"><strong>No cal que sàpigues el nom del grau.</strong><span>Obre una família i descobreix què hi ha. Descobreix què estudiaràs, les sortides i el cost. Si poses les notes, les comparem amb el tall de 2026. No garantim plaça ni comprovem altres requisits, com les PAP o les vies d’accés específiques.</span></div>`+visible.map((g,k)=>{
  g.items.sort((x,y)=>Number(isCombined(y))-Number(isCombined(x))||x.n.localeCompare(y.n,'ca')||x.m.localeCompare(y.m,'ca'));
  const related=branch&&g.branches.includes(branch);
  return `<details class="family-group" ${k===0||selected?'open':''}><summary><span class="family-icon" aria-hidden="true">${g.icon}</span><span class="family-heading"><strong>${g.name}</strong><span>${g.items.length} opcions${related?' · Afí al teu batxillerat':''}</span></span><span class="chevron" aria-hidden="true">⌄</span></summary><div class="family-body"><p class="family-hint">${g.hint}</p><div class="family-degrees">${g.items.map((x,i)=>`<div ${i>=4?'hidden':''} class="explore-degree">${degreeCard(x,a).replace(/ id="grau-[^"]+"/,'')}</div>`).join('')}</div>${g.items.length>4?`<button class="family-more" type="button">Veure les ${g.items.length} opcions</button>`:''}</div></details>`;
 }).join('');
 $('llista').querySelectorAll('.family-more').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('.explore-degree').forEach(e=>e.hidden=false);b.remove();});
    }
