import fs from 'node:fs';
import path from 'node:path';
import {root,run} from './common.mjs';

const source=process.argv[2] || fs.readdirSync(root).find(n=>n.endsWith('.mp3'));
if(!source)throw new Error('Place the source MP3 in the project or pass its full path.');
const resolved=path.resolve(root,source);
const probe=fs.statSync(resolved);
if(!probe.isFile() || probe.size<1000)throw new Error('The audio file is empty.');
fs.mkdirSync(path.join(root,'public/audio'),{recursive:true});
fs.copyFileSync(resolved,path.join(root,'public/audio/bgm.mp3'));
if(path.dirname(resolved)!==root)throw new Error('Copy the source audio into the project root before analysis.');
run(process.env.MV_PYTHON || 'D:/Anaconda/python.exe',['-B','-X','utf8','scripts/analyze_audio.py']);
console.log('BGM copied and timing updated.');
