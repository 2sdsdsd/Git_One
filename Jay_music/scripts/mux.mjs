import path from 'node:path';
import fs from 'node:fs';
import {root,timeline,run,ffmpeg} from './common.mjs';

export function mux(name='waiting-for-you',duration=timeline().duration){
  run(process.env.MV_PYTHON || 'D:/Anaconda/python.exe',['-B','-X','utf8','scripts/mix_audio.py']);
  const output=path.join(root,`out/${name}.mp4`);
  ffmpeg(['-y','-v','warning','-i',path.join(root,`out/${name}-silent.mp4`),'-i',path.join(root,'public/audio/mixed.wav'),
    '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','44100',
    '-t',String(duration),'-movflags','+faststart',output]);
  fs.writeFileSync(path.join(root,'out/render-status.json'),JSON.stringify({stage:'complete',output,duration}));
  console.log(`Finished: ${output}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.join(root,'scripts/mux.mjs'))mux();
