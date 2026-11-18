import fs from 'node:fs';
import path from 'node:path';
import {root} from './common.mjs';

const url='https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=001J5QJL1pRQYB&format=json&nobase64=1';
const response=await fetch(url,{headers:{Referer:'https://y.qq.com/'},signal:AbortSignal.timeout(20000)});
if(!response.ok)throw new Error(`Lyrics request: HTTP ${response.status}`);
const data=await response.json();
if(!data.lyric)throw new Error('The music service returned no lyric timing.');
const lyric=data.lyric.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&apos;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&');
fs.mkdirSync(path.join(root,'.cache'),{recursive:true});
fs.writeFileSync(path.join(root,'.cache/source-lyrics.lrc'),lyric);
console.log(lyric);
