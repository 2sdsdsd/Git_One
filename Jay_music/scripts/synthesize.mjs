import fs from 'node:fs';
import path from 'node:path';
import {root,timeline} from './common.mjs';

const tl=timeline();
const sr=44100;
const audio=new Float32Array(Math.ceil(tl.duration*sr));
let seed=47021;
const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
function event(start,length,kind,volume=.05){
  const at=Math.round(start*sr);
  let low=0;
  for(let i=0;i<Math.floor(length*sr)&&at+i<audio.length;i++){
    if(at+i<0)continue;
    const t=i/sr, p=t/length;
    const noise=rand();low=low*.965+noise*.035;
    let value=0;
    if(kind==='water')value=(low*3+noise*.035)*Math.sin(Math.PI*p)**2;
    if(kind==='paper')value=(noise-low)*.4*Math.sin(Math.PI*p)**2;
    if(kind==='wind')value=low*3*Math.sin(Math.PI*p)**2;
    if(kind==='bell')value=(Math.sin(2*Math.PI*880*t)+.35*Math.sin(2*Math.PI*1320*t))*Math.exp(-t*5)*Math.min(1,t*100);
    audio[at+i]+=value*volume;
  }
}
const [launch,,thought,brave,,leaving,thanks,eye,ending]=tl.shots;
for(let i=0;i<6;i++)event(launch.start+i*60/tl.bpm,.45,'paper',.065);
event(launch.start+6*60/tl.bpm,1.2,'water',.08);
event(thought.start+.6,.7,'bell',.035);
const hit=Math.round((brave.end-brave.start)*.34*tl.bpm/60)*60/tl.bpm;
event(brave.start+hit-1,3.8,'wind',.09);
event(brave.start+hit,2.4,'water',.16);
event(brave.start+hit+5,2,'water',.1);
const release=Math.round((leaving.end-leaving.start)*.16*tl.bpm/60)*60/tl.bpm;
event(leaving.start+release,.8,'paper',.09);
for(let b=thanks.start;b<thanks.end;b+=4*60/tl.bpm)event(b+.12,.7,'bell',.018);
event(eye.start+(eye.end-eye.start)*.31,2.5,'wind',.05);
for(let i=0;i<6;i++)event(ending.end-(6-i)*60/tl.bpm,.4,'paper',.045);
// A very quiet continuous sea bed connects the nine spaces.
let low=0;
for(let i=0;i<audio.length;i++){
  low=low*.994+rand()*.006;
  const t=i/sr;
  const envelope=Math.min(1,t/2)*Math.min(1,(tl.duration-t)/2);
  audio[i]+=low*.038*(.6+.4*Math.sin(t*.24))*envelope;
}
const wav=Buffer.alloc(44+audio.length*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);wav.write('fmt ',12);wav.writeUInt32LE(16,16);
wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sr,24);wav.writeUInt32LE(sr*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36);wav.writeUInt32LE(audio.length*2,40);
for(let i=0;i<audio.length;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,audio[i]))*32767),44+i*2);
fs.mkdirSync(path.join(root,'public/audio'),{recursive:true});
fs.writeFileSync(path.join(root,'public/audio/sfx.wav'),wav);
console.log(`Generated sea, paper, whale splash and lantern tones: ${tl.duration.toFixed(3)}s.`);
