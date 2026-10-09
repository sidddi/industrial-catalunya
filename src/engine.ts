export type Coefficient = 0 | 0.1 | 0.2 | null;
export type Subject = {id:string; grade:number; coefficient:Coefficient};
const milli=(n:number)=>Math.round(n*1000);
export function parseGrade(raw:string):number|null {
 if(!/^\d{1,2}([.,]\d{1,3})?$/.test(raw.trim())) return null;
 const n=Number(raw.trim().replace(',','.')); return Number.isFinite(n)&&n>=0&&n<=10?n:null;
}
export function validGrade(n:number):boolean {return Number.isFinite(n)&&n>=0&&n<=10&&Math.abs(n*1000-Math.round(n*1000))<1e-7;}
export function calculateBase(b:number,f:number):number|null {
 if(!validGrade(b)||!validGrade(f)||f<4)return null;
 const value=Math.floor((milli(b)*6+milli(f)*4+5)/10)/1000;
 return value>=5?value:null;
}
export function admission(base:number,subjects:Subject[]):{score:number;parts:Subject[];contributions:number[]}|null {
 if(!validGrade(base)||base<5||new Set(subjects.map(s=>s.id)).size!==subjects.length) return null;
 if(subjects.some(s=>!validGrade(s.grade)||![0,0.1,0.2].includes(s.coefficient as number)))return null;
 const ordered=subjects.filter(s=>s.grade>=5&&s.coefficient!==0).sort((a,b)=>milli(b.grade)*(b.coefficient!*10)-milli(a.grade)*(a.coefficient!*10)).slice(0,2);
 const units=milli(base)*10+ordered.reduce((n,s)=>n+milli(s.grade)*(s.coefficient!*10),0);
 return {score:Math.floor((units+5)/10)/1000,parts:ordered,contributions:ordered.map(s=>milli(s.grade)*(s.coefficient!*10)/10000)};
}
export function margin(score:number,cutoff:number):number {return (milli(score)-milli(cutoff))/1000;}
