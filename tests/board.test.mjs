import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('root entrypoint exists and does not invent a dataset', async () => {
  const source = await readFile(new URL('../main.ts', import.meta.url), 'utf8');
  assert.match(source, /readFile\("board.json"/);
  assert.match(source, /rows.length < 100/);
  assert.match(source, /farmPlan/);
});
test('offline dashboard has a local data path', async () => {
  const source = await readFile(new URL('../dashboard/app.js', import.meta.url), 'utf8');
  assert.match(source, /TOKEN_RADAR_BOARD/);
  assert.doesNotMatch(source, /https?:\/\//);
});
test('no fake output files are committed', async () => {
  const {existsSync} = await import('node:fs');
  for (const f of ['board.json','dossier.json','screenshots/board.png']) {
    assert.equal(existsSync(new URL('../'+f, import.meta.url)),false, f+' should come from official data/browser');
  }
});
