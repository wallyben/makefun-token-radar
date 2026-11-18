import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const bounties=JSON.parse(readFileSync(new URL('../automation/bounties.json',import.meta.url)));
test('exactly five unique targets',()=>{
 assert.equal(bounties.length,5);
 assert.equal(new Set(bounties.map(b=>b.id)).size,5);
});
test('each target has a bounded deadline, repository and source URL',()=>{
 for(const b of bounties){
  assert.match(b.url,/^https:\/\/make\.fun\/bounty\//);
  assert.match(b.repository,/^wallyben\/makefun-/);
  assert.ok(Number.isFinite(Date.parse(b.deadline)));
  assert.ok(b.priority>=1&&b.priority<=10);
 }
});
test('no credentials or automatic submissions configured',()=>{
 const script=readFileSync(new URL('../scripts/five-bounty-coordinator.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(script,/process\.env\.[A-Z_]*(KEY|TOKEN|SECRET)/);
 assert.doesNotMatch(script,/submitEntry\(/);
});
