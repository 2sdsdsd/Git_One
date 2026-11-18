import fs from 'node:fs';
import path from 'node:path';
import {renderMedia} from '@remotion/renderer';
import {root,setup,ffmpeg,run} from './common.mjs';
const tl=JSON.parse(fs.readFileSync(path.join(root,'src/lyric-timeline.json'),'utf8'));
const context=await setup('LyricsMV');
const preview=process.argv.includes('--preview');
const frameRange=preview?[0,Math.round(tl.cues.find(c=>c.key==='school').startFrame)-1]:undefined;
const duration=preview?(frameRange[1]+1)/tl.fps:tl.duration;
const name=preview?'lyrics-preview':'lyrics-story';
let last=0;
try{
  await renderMedia({...context,codec:'h264',outputLocation:path.join(root,`out/${name}-silent.mp4`),
    muted:true,crf:19,imageFormat:'jpeg',jpegQuality:90,pixelFormat:'yuv420p',
    concurrency:Number(process.env.MV_CONCURRENCY||4),frameRange,logLevel:'error',
    onProgress(p){if(Date.now()-last<5000)return;last=Date.now();
      fs.writeFileSync(path.join(root,'out/lyrics-render-status.json'),JSON.stringify({stage:'rendering',...p}));
      console.log(`${(p.progress*100).toFixed(1)}% / ${p.renderedFrames} frames`);
    }});
}finally{await context.puppeteerInstance.close({silent:true});}
run(process.env.MV_PYTHON||'D:/Anaconda/python.exe',['-B','-X','utf8','scripts/mix_audio.py','lyric-sfx.wav','lyric-mixed.wav']);
const output=path.join(root,`out/${name}.mp4`);
ffmpeg(['-y','-v','warning','-i',path.join(root,`out/${name}-silent.mp4`),'-i',path.join(root,'public/audio/lyric-mixed.wav'),
  '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-t',String(duration),'-movflags','+faststart',output]);
fs.writeFileSync(path.join(root,'out/lyrics-render-status.json'),JSON.stringify({stage:'complete',output,duration}));
console.log(`Finished: ${output}`);
