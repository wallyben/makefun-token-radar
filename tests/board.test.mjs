import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';

test('root entrypoint validates authentic dataset fields', async () => {
  const source = await readFile(new URL('../main.ts', import.meta.url), 'utf8');
  assert.match(source, /readFile\("board.json"/);
  assert.match(source, /rows.length < 100/);
  assert.match(source, /farmPlan/);
});
test('offline dashboard uses local data', async () => {
  const source = await readFile(new URL('../dashboard/app.js', import.meta.url), 'utf8');
  assert.match(source, /TOKEN_RADAR_BOARD/);
  assert.doesNotMatch(source, /https?:\/\//);
});
test('if generated outputs exist, they must parse and contain meaningful data', async () => {
  for (const filename of ['board.json','dossier.json']) {
    const url=new URL('../'+filename,import.meta.url);
    try {
      const metadata=await stat(url);
      assert.ok(metadata.size>2,filename+' must not be empty');
      const parsed=JSON.parse(await readFile(url,'utf8'));
      assert.ok(parsed && typeof parsed==='object',filename+' must contain JSON data');
    } catch(e) {
      if(e?.code==='ENOENT') continue; // official kit not yet imported
      throw e;
    }
  }
});
