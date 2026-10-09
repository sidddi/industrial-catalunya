export type Provenance={sourceId:string;sourceUrl:string;sourceTitle:string;verifiedAt:string;pageOrRow:string;status:string;sourceDate?:string};
export type Program={id:string;officialCode:string;slug:string;degreeName:string;university:string;centre:string;campus:string;city:string;routeType:string;officialProgramUrl:string;provenance:Provenance};
export type Cutoff={programId:string;admissionYear:number;academicYear:string;round:string;roundDate:string;accessRouteQuota:string;score:number;provenance:Provenance};
export type Weighting={programId:string;admissionYear:number;subjectId:string;coefficient:0|0.1|0.2|null;provenance:Provenance};
export function validateDataset(p:Program[],c:Cutoff[],w:Weighting[]):void {
 const unique=(keys:string[])=>{if(new Set(keys).size!==keys.length)throw Error('IDs duplicats');};
 unique(p.map(x=>x.id));unique(c.map(x=>`${x.programId}:${x.admissionYear}:${x.round}`));unique(w.map(x=>`${x.programId}:${x.admissionYear}:${x.subjectId}`));
 const ids=new Set(p.map(x=>x.id));
 for(const x of [...p,...c,...w])if(x.provenance.status==='verified'&&(!x.provenance.sourceUrl.startsWith('https://')||!x.provenance.verifiedAt||!x.provenance.pageOrRow))throw Error('Font absent');
 for(const x of c)if(!ids.has(x.programId)||!Number.isInteger(x.admissionYear)||x.score<5||x.score>14||!Number.isFinite(x.score))throw Error('Tall invàlid');
 for(const x of w)if(!ids.has(x.programId)||!Number.isInteger(x.admissionYear)||![0,0.1,0.2,null].includes(x.coefficient))throw Error('Ponderació invàlida');
}
