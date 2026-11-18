import path from 'node:path';
import fs from 'node:fs';
import {renderStill} from '@remotion/renderer';
import {root,setup} from './common.mjs';
const tl=JSON.parse(fs.readFileSync(path.join(root,'src/lyric-timeline.json'),'utf8'));
const context=await setup('LyricsMV');
const folder=path.join(root,'out/lyrics-stills');fs.mkdirSync(folder,{recursive:true});
const cues=process.argv[2]?tl.cues.filter(c=>process.argv.slice(2).includes(c.key)):tl.cues;
try{
  for(const cue of cues){
    const frame=Math.round(cue.startFrame+(cue.endFrame-cue.startFrame)*.58);
    await renderStill({...context,frame,output:path.join(folder,`${String(cue.id).padStart(2,'0')}-${cue.key}.png`),imageFormat:'png',logLevel:'error'});
    console.log(`Rendered ${cue.label} (${(frame/tl.fps).toFixed(2)}s)`);
  }
}finally{await context.puppeteerInstance.close({silent:true});}
