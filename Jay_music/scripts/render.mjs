import fs from 'node:fs';
import path from 'node:path';
import {renderMedia} from '@remotion/renderer';
import {root,setup,timeline} from './common.mjs';
import {mux} from './mux.mjs';

const context=await setup();
const tl=timeline();
const range=process.argv[2]==='--preview'? [0,Math.min(tl.durationInFrames-1,599)]:undefined;
const name=range?'preview':'waiting-for-you';
const video=path.join(root,`out/${name}-silent.mp4`);
const output=path.join(root,`out/${name}.mp4`);
const statusFile=path.join(root,'out/render-status.json');
let last=0;
try{
  await renderMedia({...context,codec:'h264',outputLocation:video,crf:19,
    muted:true,imageFormat:'jpeg',jpegQuality:90,pixelFormat:'yuv420p',
    concurrency:Number(process.env.MV_CONCURRENCY || 4),frameRange:range,logLevel:'error',
    onProgress(progress){if(Date.now()-last<4000)return;last=Date.now();
      fs.writeFileSync(statusFile,JSON.stringify({stage:'rendering',...progress}));
      console.log(`Video: ${(progress.progress*100).toFixed(1)}% (${progress.renderedFrames} frames)`);
    }});
}finally{await context.puppeteerInstance.close({silent:true});}
const duration=range?(range[1]+1)/tl.fps:tl.duration;
fs.writeFileSync(statusFile,JSON.stringify({stage:'mixing',duration}));
mux(name,duration);
