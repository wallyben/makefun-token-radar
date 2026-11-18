import {existsSync, writeFileSync} from 'node:fs';
const paths={
  source: 'main.ts',
  vendor: 'vendor/makefun-board.ts',
  snapshot: 'board.json',
  dossier: 'dossier.json',
  boardScreenshot: 'screenshots/board.png',
  detailScreenshot: 'screenshots/detail.png',
  filterScreenshot: 'screenshots/filtered.png',
  provenance: 'provenance/verified.json'
};
const files=Object.fromEntries(Object.entries(paths).map(([key,path])=>[key,{path,present:existsSync(path)}]));
const required=Object.keys(files);
const report={
  generatedAt:new Date().toISOString(),
  files,
  status:required.every(k=>files[k].present)?'FILES_PRESENT_NOT_ELIGIBILITY_VERIFIED':'BLOCKED',
  note:'Presence is not proof of authenticity or eligibility. Run the official checker.'
};
writeFileSync('readiness.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
