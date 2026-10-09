"""Read local official PDFs and emit review-only candidates. Never writes public data.
Requires Python 3 + PyMuPDF (pip install pymupdf). Coordinates are derived from headers.
Download via --download to refresh originals using the recorded exact source URLs.
"""
import json,pathlib,argparse,urllib.request,hashlib
import pymupdf as fitz
root=pathlib.Path(__file__).resolve().parents[1]
args=argparse.ArgumentParser();args.add_argument('--download',action='store_true');opt=args.parse_args()
manifest=json.loads((root/'sources/manifest.json').read_text());programs=json.loads((root/'data/programs.json').read_text());out=[]
for source in manifest:
 file=root/'sources'/source['file']
 if opt.download: urllib.request.urlretrieve(source['url'],file)
 d=fitz.open(file)
 for program in programs:
  code=program['officialCode'];matches=[]
  for i,p in enumerate(d):
   ws=p.get_text('words');cw=next((w for w in ws if w[4]==code),None)
   if cw is None:continue
   row={'programId':code,'sourceUrl':source['url'],'page':i+1,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}
   if 'Ponderacions' in source['file']:
    for subject,label in [('math','Matemàtiques'),('physics','Física')]:
     heads=[w for w in ws if w[4]==label and w[1]<240];h=min(heads,key=lambda w:w[0]);cx=(h[0]+h[2])/2
     vals=[w for w in ws if abs(w[1]-cw[1])<3 and w[4] in ['0,1','0,2'] and abs((w[0]+w[2])/2-cx)<7]
     if len(vals)!=1:raise ValueError((code,subject,'ambiguous column'))
     row[subject]=float(vals[0][4].replace(',','.'))
   else:
    vals=sorted([w for w in ws if abs(w[1]-cw[1])<3 and ',' in w[4] and w[4].replace(',','').isdigit()],key=lambda w:w[0]);row['cutoff']=float(vals[0][4].replace(',','.'))
   matches.append(row)
  if len(matches)!=1:raise ValueError((code,source['file'],'ambiguous or missing row'))
  out.extend(matches)
(root/'data/import-candidates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print('Review candidates: data/import-candidates.json. No public dataset changed.')
for row in out:print(row['programId'],row['page'],{k:v for k,v in row.items() if k in ['math','physics','cutoff']})
