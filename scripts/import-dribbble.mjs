/** Restore the reviewed one-time Dribbble import without duplicating shots.
 * Run from the project: node scripts/import-dribbble.mjs
 * Media is served locally; this script is never called at runtime.
 */
import { readFile, writeFile, mkdir, stat, rename, rm } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'docs/dribbble-import.json'), 'utf8'));
const seen = new Set();
const jobs = new Map();
const assetPaths = new Map();

function asset(shotId, source) {
  const url = new URL(source);
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.dribbble.com') throw new Error(`Unexpected media URL: ${source}`);
  if (assetPaths.has(source)) return assetPaths.get(source);
  const basename = path.basename(url.pathname);
  if (!/^[a-zA-Z0-9._-]+\.(png|jpe?g|webp|gif|mp4)$/i.test(basename)) throw new Error(`Unexpected media file: ${source}`);
  const local = `/playground/dribbble/${shotId}/${basename}`;
  jobs.set(local, {source, destination:path.join(root, 'public', local)});
  assetPaths.set(source, local);
  return local;
}

const items = manifest.shots.map(shot => {
  if (!/^\d+$/.test(shot.id) || seen.has(shot.id)) throw new Error(`Duplicate or invalid shot ID: ${shot.id}`);
  seen.add(shot.id);
  if (!shot.media.length) throw new Error(`Shot ${shot.id} has no media`);
  return {
    id:`dribbble-${shot.id}`, title:shot.title, image:asset(shot.id,shot.cover),
    sourceUrl:shot.sourceUrl, publishedAt:shot.publishedAt, description:shot.description,
    media:shot.media.map((media,index) => {
      const alt = `${shot.title} — ${media.kind === 'video' ? 'video' : 'image'} ${index + 1}`;
      if (media.kind === 'video') return {kind:'video', src:asset(shot.id,media.src), poster:asset(shot.id,media.poster), alt};
      if (media.kind !== 'image') throw new Error(`Unexpected media kind: ${media.kind}`);
      return {kind:'image', src:asset(shot.id,media.src), alt};
    }),
  };
});

async function download({source,destination}) {
  try { if ((await stat(destination)).size > 0) return; } catch (error) { if(error.code !== 'ENOENT') throw error; }
  await mkdir(path.dirname(destination), {recursive:true});
  const temporary = `${destination}.download`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(source, {signal:AbortSignal.timeout(120000)});
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}: ${source}`);
      const expected = destination.endsWith('.mp4') ? 'video/' : 'image/';
      if (!response.headers.get('content-type')?.startsWith(expected)) throw new Error(`Unexpected media type: ${source}`);
      await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary));
      if (!(await stat(temporary)).size) throw new Error(`Empty download: ${source}`);
      await rename(temporary,destination);
      return;
    } catch(error) {
      await rm(temporary,{force:true});
      if(attempt === 2) throw error;
      await new Promise(resolve=>setTimeout(resolve,1000 * (attempt+1)));
    }
  }
}

const queue=[...jobs.values()];
let next=0;
await Promise.all(Array.from({length:4},async()=>{
  while(next < queue.length) {
    const index=next++;
    await download(queue[index]);
    console.log(`Media ${index+1}/${queue.length}: ${path.basename(queue[index].destination)}`);
  }
}));
await mkdir(path.join(root,'src/content'),{recursive:true});
const output=path.join(root,'src/content/playground-dribbble.json');
await writeFile(`${output}.tmp`,JSON.stringify(items,null,2)+'\n');
await rename(`${output}.tmp`,output);
console.log(`Imported ${items.length} shots, ${items.reduce((sum,item)=>sum+item.media.length,0)} gallery media, ${jobs.size} local files.`);
