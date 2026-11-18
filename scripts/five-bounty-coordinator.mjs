import {readFileSync,writeFileSync} from 'node:fs';
const bounties=JSON.parse(readFileSync(new URL('../automation/bounties.json',import.meta.url),'utf8'));
const now=new Date();
const results=bounties.map(b=>{
 const remainingMs=Date.parse(b.deadline)-now.getTime();
 const remainingHours=Math.max(0,Math.round(remainingMs/3600000*10)/10);
 const expired=remainingMs<=0;
 const urgency=expired?0:remainingHours<24?100:remainingHours<72?70:remainingHours<168?40:10;
 return {...b,remainingHours,expired,score:expired?0:b.priority*10+urgency,stage:'NOT_VERIFIED',nextAction:expired?'Archive; do not submit':'Verify official kit and repository; implement deliverable'};
}).sort((a,b)=>b.score-a.score);
const report={generatedAt:now.toISOString(),warning:'This is deterministic monitoring, not unattended AI coding. Competition details require official verification.',bounties:results};
writeFileSync('automation/five-bounty-report.json',JSON.stringify(report,null,2)+'\n');
const lines=['# Five-bounty operating report','', 'Generated '+report.generatedAt,'','| Bounty | Hours left | Score | Status |','|---|---:|---:|---|',...results.map(b=>`| [${b.title}](${b.url}) | ${b.expired?'ENDED':b.remainingHours} | ${b.score} | ${b.stage} |`),'','## Next steps',...results.filter(b=>!b.expired).map(b=>`- **${b.id}**: ${b.nextAction}`),'','Do not treat this report as evidence of valid agent transcripts, submission, or competition acceptance.'];
writeFileSync('automation/STATUS.md',lines.join('\n')+'\n');
console.log(lines.join('\n'));
