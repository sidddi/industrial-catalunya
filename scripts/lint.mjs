import fs from 'node:fs';import assert from 'node:assert/strict';
for(const f of fs.readdirSync('src').filter(f=>f.endsWith('.ts'))){const s=fs.readFileSync('src/'+f,'utf8');assert(!s.includes('console.log'),'No logging notes');assert(!s.includes('localStorage'),'No storage');assert(!s.includes('eval('),'No eval');}
const app=fs.readFileSync('dist/app.js','utf8');for(const word of ['googlesyndication','google-analytics','doubleclick','fetch(','localStorage'])assert(!app.includes(word),word);console.log('Static safety checks passed (not a general-purpose style linter).');
