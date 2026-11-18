import {readFileSync,writeFileSync} from 'node:fs';
const tasks=JSON.parse(readFileSync('automation/tasks.json','utf8'));
const now=Date.now();
const ordered=tasks.filter(t=>t.status!=='done').map(t=>({...t,priorityScore:t.priority*100+(t.deadline?Math.max(0,100-Math.floor((Date.parse(t.deadline)-now)/86400000)):0)})).sort((a,b)=>b.priorityScore-a.priorityScore);
const result={generatedAt:new Date().toISOString(),next:ordered[0]??null,queue:ordered};
writeFileSync('automation/queue-report.json',JSON.stringify(result,null,2)+'\n');
console.log('Next priority:',result.next?.id??'none');
for(const t of ordered) console.log(t.id,t.priorityScore,t.status,t.title);
