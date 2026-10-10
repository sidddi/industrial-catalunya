import csv, json, collections
rows=list(csv.DictReader(open('data/notes-de-tall-origen.csv',encoding='utf-8')))
off={}
for r in rows:
    if r['Tipus d’estudi']!='Grau': continue
    k=r['Codi Oferta']
    o=off.setdefault(k,{'c':k,'n':r['Nom de l’Oferta'],'u':r['Sigles Universitat responsable'],'m':r['Municipi'],'t':{},'p':{}})
    o['t'][r['Any']]=float(r['Nota de tall']); o['p'][r['Any']]=int(r['Nombre de places'] or 0)
out=sorted(off.values(),key=lambda o:(o['n'].lower(),o['u']))
json.dump({'font':'Dades obertes de Catalunya (Generalitat de Catalunya): Notes de tall d’accés als estudis universitaris, 1a assignació, convocatòries de juny 2023-2026','anys':sorted({a for o in out for a in o['t']}),'ofertes':out},open('data.json','w',encoding='utf-8'),ensure_ascii=False,separators=(',',':'))
print(len(out))
