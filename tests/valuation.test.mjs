import test from 'node:test';
import assert from 'node:assert/strict';
import {numberOrNull, money, estimateByPeers, classifyEligibility} from '../lib/valuation.mjs';

test('parses monetary inputs without accepting invalid data',()=>{
  assert.equal(numberOrNull('$1.25B'),1_250_000_000);
  assert.equal(numberOrNull('2,500,000'),2_500_000);
  assert.equal(numberOrNull('unknown'),null);
  assert.equal(numberOrNull(-1),null);
  assert.equal(numberOrNull('Infinity'),null);
});
test('formats values consistently',()=>{
  assert.equal(money(1_250_000_000),'$1.25B');
  assert.equal(money(null),'N/A');
});
test('median peer valuation is deterministic and robust to outliers',()=>{
  const result=estimateByPeers({tvl:10_000_000,peers:[
    {fdv:100_000_000,tvl:20_000_000},
    {fdv:180_000_000,tvl:30_000_000},
    {fdv:10_000_000_000,tvl:10_000_000}
  ]});
  assert.equal(result.value,60_000_000);
  assert.equal(result.peersUsed,3);
});
test('missing peer evidence never produces invented valuations',()=>{
  assert.equal(estimateByPeers({tvl:5_000_000,peers:[]}).value,null);
  assert.equal(estimateByPeers({tvl:0,peers:[{fdv:10,tvl:10}]}).value,null);
});
test('eligibility is tri-state, not a guess',()=>{
  assert.equal(classifyEligibility({hasToken:false}).eligible,true);
  assert.equal(classifyEligibility({hasToken:true}).eligible,false);
  assert.equal(classifyEligibility({hasToken:false,isWrapped:true}).eligible,false);
  assert.equal(classifyEligibility({}).eligible,null);
});
