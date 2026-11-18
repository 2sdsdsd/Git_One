import fs from 'node:fs';
import path from 'node:path';
import {root} from './common.mjs';
const tl=JSON.parse(fs.readFileSync(path.join(root,'src/lyric-timeline.json'),'utf8'));
const sr=44100;
const audio=new Float32Array(Math.ceil(tl.duration*sr));
let seed=79067;
const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
function event(start,length,kind,volume){
  let low=0;
  const offset=Math.round(start*sr);
  for(let i=0;i<length*sr&&offset+i<audio.length;i++){
    const t=i/sr,p=t/length,r=noise();low=low*.95+r*.05;
    let value=0;
    if(kind==='step')value=(r*.12+low*2)*Math.exp(-t*26)*Math.min(1,t*100);
    if(kind==='paper')value=(r-low)*.4*Math.sin(p*Math.PI)**2;
    if(kind==='key')value=(Math.sin(t*2*Math.PI*1568)+.4*Math.sin(t*2*Math.PI*2093))*Math.exp(-t*18)*Math.min(1,t*150);
    if(kind==='door')value=low*2.5*Math.sin(p*Math.PI)**2;
    if(kind==='bell')value=(Math.sin(t*2*Math.PI*740)+.45*Math.sin(t*2*Math.PI*1482)+.25*Math.sin(t*2*Math.PI*2233))*Math.exp(-t*3)*Math.min(1,t*70);
    if(kind==='pan')value=low*Math.sin(p*Math.PI)**2;
    audio[offset+i]+=value*volume;
  }
}
for(const cue of tl.cues){
  if(['alley','moving','encounter','headphones','walkingAway'].includes(cue.key)){
    for(let t=cue.start+.1;t<Math.min(cue.end, cue.start+7);t+=60/tl.bpm)event(t,.16,'step',.04);
  }
  if(cue.key==='moving'){event(cue.start+.9,.24,'key',.025);event(cue.start+1.6,.7,'door',.032);}
  if(cue.key==='cooking')event(cue.start+.3,Math.min(3,cue.end-cue.start-.3),'pan',.03);
  if(['writing','letterClose','reading','packing'].includes(cue.key))event(cue.start+.8,.65,'paper',.04);
  if(cue.key==='bell')event(cue.start+.1,1.8,'bell',.035);
}
const wav=Buffer.alloc(44+audio.length*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);
wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(audio.length*2,40);
for(let i=0;i<audio.length;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,audio[i]))*32767),44+i*2);
fs.writeFileSync(path.join(root,'public/audio/lyric-sfx.wav'),wav);
console.log('Generated footsteps, keys, paper, cooking and school bell effects.');
