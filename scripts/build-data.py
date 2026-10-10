import csv, json, sys, os
sys.path.insert(0,os.path.dirname(__file__))
from join import build
rows=list(csv.DictReader(open('data/notes-de-tall-origen.csv',encoding='utf-8')))
off={}
for r in rows:
    if r['Tipus d’estudi']!='Grau': continue
    k=r['Codi Oferta']
    o=off.setdefault(k,{'c':k,'n':r['Nom de l’Oferta'],'u':r['Sigles Universitat responsable'],'m':r['Municipi'],'t':{},'p':{}})
    o['t'][r['Any']]=float(r['Nota de tall']); o['p'][r['Any']]=int(r['Nombre de places'] or 0)
out=sorted(off.values(),key=lambda o:(o['n'].lower(),o['u']))
P=[{'vals':q['pond'],'name':q['nom'],'uni':q['uni']} for q in json.load(open('data/ponderacions-2027.json'))]
mat,miss=build(P,out)
mats=sorted({s for q in P for s in q['vals']})
for o in out:
    if o['c'] in mat: o['w']={mats.index(s):v for s,v in mat[o['c']][0]['vals'].items()}
json.dump({'font':'Dades obertes de Catalunya (notes de tall 1a assignació 2023-2026) i Canal Universitats (ponderacions 2027)','anys':sorted({a for o in out for a in o['t']}),'materies':mats,'ofertes':out},open('data.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(out),'ofertes;',len(mat),'amb ponderació;',len(miss),'sense')
