# Extreu les ponderacions oficials (gencat, PDF Ponderacions 2027) a data/ponderacions.json
import pymupdf, re, json, sys
pdf=sys.argv[1] if len(sys.argv)>1 else 'data/ponderacions-2027.pdf'
d=pymupdf.open(pdf)
res={};cols_all=set()
CANON=None
for pi,p in enumerate(d):
    w=p.get_text('words')
    hdr=[x for x in w if x[1]<240 and x[0]>340 and x[1]>60]
    xs=sorted({round(x[0]) for x in hdr})
    groups=[]
    for x in xs:
        if groups and x-groups[-1][-1]<11: groups[-1].append(x)
        else: groups.append([x])
    cols=[]
    for g in groups:
        ws=[h for h in hdr if round(h[0]) in g]
        # llegeix de baix a dalt: ordena per y1 descendent dins cada subcolumna
        sub={}
        for h in ws: sub.setdefault(round(h[0]),[]).append(h)
        parts=[]
        for sx in sorted(sub):
            parts+= [h[4] for h in sorted(sub[sx],key=lambda h:-h[3])]
        # una sola columna visual pot tenir diverses subcolumnes (text a dues línies)
        cols.append((min(g),' '.join(parts)))
    if not cols: continue
    import collections
    vs=set()
    for dr in p.get_drawings():
        for it in dr['items']:
            if it[0]=='l' and abs(it[1].x-it[2].x)<0.5 and abs(it[1].y-it[2].y)>100 and it[1].x>340: vs.add(round(it[1].x,1))
    for dr in p.get_drawings():
        r=dr['rect']
        if r.height>150 and r.width<3 and r.x0>340: vs.add(round(r.x0,1))
    bnd=sorted(vs)
    if CANON is None and pi==1: CANON=[n for _,n in cols]
    if CANON is None:
        # la primera pàgina té l'encapçalament amb lletres separades: fem servir els noms de la pàgina 2
        d2=d[1];w2=d2.get_text('words');h2=[x for x in w2 if x[1]<240 and x[0]>340 and x[1]>60]
        xs2=sorted({round(x[0]) for x in h2});g2=[]
        for x in xs2:
            if g2 and x-g2[-1][-1]<11: g2[-1].append(x)
            else: g2.append([x])
        CANON=[]
        for g in g2:
            sub={}
            for h in [h for h in h2 if round(h[0]) in g]: sub.setdefault(round(h[0]),[]).append(h)
            parts=[]
            for sx in sorted(sub): parts+=[h[4] for h in sorted(sub[sx],key=lambda h:-h[3])]
            CANON.append(' '.join(parts))
    if len(bnd)-1!=len(CANON): print('COLS MISMATCH',pi,len(bnd)-1,len(CANON),file=sys.stderr); continue
    cols=[(0,n) for n in CANON]
    body=[x for x in w if x[1]>=240]
    codes=[x for x in body if x[0]<35 and re.fullmatch(r'\d{5}',x[4])]
    if not codes: continue
    cy=[(c[1]+c[3])/2 for c in codes]
    rowsd=[{'code':c[4],'name':[],'uni':'','vals':{}} for c in codes]
    for x in body:
        yc=(x[1]+x[3])/2
        i=min(range(len(cy)),key=lambda j:abs(cy[j]-yc))
        if x[0]<35: continue
        if x[0]<296 and abs(cy[i]-yc)<22: rowsd[i]['name'].append((yc,x[0],x[4]))
        elif 296<=x[0]<350 and abs(cy[i]-yc)<6: rowsd[i]['uni']=x[4]
        elif x[0]>=350 and re.fullmatch(r'0,[12]',x[4]) and abs(cy[i]-yc)<6:
            xc=(x[0]+x[2])/2
            k=[b for b in range(len(bnd)-1) if bnd[b]<=xc<bnd[b+1]]
            if len(k)==1: rowsd[i]['vals'][cols[k[0]][1]]=float(x[4].replace(',','.'))
            else: print('SENSE COLUMNA',pi,x,file=sys.stderr)
    for r in rowsd:
        nm=' '.join(t for _,_,t in sorted(r['name'],key=lambda a:(round(a[0]/4),a[1])))
        r['name']=re.sub(r'\s+',' ',nm).strip()
    res[pi]={'cols':cols,'rows':rowsd}
json.dump(res,open('/tmp/pond_raw.json','w'),ensure_ascii=False)
print(len(res),sum(len(v['rows']) for v in res.values()))
rows=[q for v in res.values() for q in v['rows']]
json.dump([{'codi':q['code'],'nom':q['name'],'uni':q['uni'],'pond':q['vals']} for q in rows],open('data/ponderacions-2027.json','w'),ensure_ascii=False,indent=0)
