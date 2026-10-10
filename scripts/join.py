import json,re,unicodedata,collections,difflib
def nz(s):
    s=unicodedata.normalize('NFD',s.lower());s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9]+',' ',s)).strip()
def uni(u):
    return {'UVic':'UVic-UCC'}.get(u,u)
def keys(n):
    n0=nz(n); n1=nz(re.sub(r'\([^)]*\)','',n)); n1=re.sub(r'\b(semipresencial|docencia en angles|simultaneitat)\b','',n1).strip()
    parts=sorted(nz(re.sub(r'\([^)]*\)','',p)) for p in n.split(' / '))
    return [n0,n1,' | '.join(parts)]
def build(P,D):
    idx=[collections.defaultdict(list) for _ in range(3)]
    for q in P:
        for i,k in enumerate(keys(q['name'])):
            for u in q['uni'].split('/'): idx[i][(uni(u),k)].append(q)
    out={};miss=[]
    for o in D:
        for i,k in enumerate(keys(o['n'])):
            m=idx[i].get((uni(o['u']),k))
            if m:
                vs={json.dumps(x['vals'],sort_keys=True) for x in m}
                out[o['c']]=(m[0],i,len(vs)); break
        else: miss.append(o)
    return out,miss
if __name__=='__main__':
    r=json.load(open('/tmp/pond_raw.json'));P=[q for v in r.values() for q in v['rows']]
    D=json.load(open('data.json'))['ofertes']
    out,miss=build(P,D)
    print(len(D),len(out),len(miss),collections.Counter(v[1] for v in out.values()),sum(1 for v in out.values() if v[2]>1))
    for o in miss:print(o['u'],'|',o['n'][:80],'|',o['m'])
