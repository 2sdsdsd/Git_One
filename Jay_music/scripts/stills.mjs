import path from 'node:path';
import fs from 'node:fs';
import {renderStill} from '@remotion/renderer';
import {root,setup,timeline} from './common.mjs';

const context=await setup();
const tl=timeline();
const folder=path.join(root,'out/stills');fs.mkdirSync(folder,{recursive:true});
const selected=process.argv[2] ? [Number(process.argv[2])] : tl.shots.map((s,i)=>i===3
  ? s.startFrame+Math.round((Math.round((s.end-s.start)*.34*tl.bpm/60)*60/tl.bpm+2.75)*tl.fps)
  : Math.round(s.startFrame+(s.endFrame-s.startFrame)*.5));
try{
  for(let i=0;i<selected.length;i++){
    const frame=selected[i];
    const name=process.argv[2]?`frame-${frame}`:`shot-${String(i+1).padStart(2,'0')}`;
    await renderStill({...context,frame,output:path.join(folder,`${name}.png`),imageFormat:'png',logLevel:'error'});
    console.log(`Rendered ${name} at ${(frame/tl.fps).toFixed(2)}s`);
  }
}finally{await context.puppeteerInstance.close({silent:true});}
