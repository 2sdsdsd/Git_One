import React from 'react';
import {interpolate, Easing} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (t: number, a: number, b: number) => interpolate(t,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(0.22,1,0.36,1)});
export const frac = (n: number) => n - Math.floor(n);
export const hash = (n: number) => frac(Math.sin(n * 127.1 + 311.7) * 43758.5453);
export const pulse = (beat: number, rate = 1) => Math.exp(-frac(beat*rate)*5);
export const rad = (degrees: number) => degrees * Math.PI / 180;

export const Defs: React.FC = () => <defs>
  <filter id="cut" x="-30%" y="-30%" width="160%" height="170%" colorInterpolationFilters="sRGB">
    <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#040f24" floodOpacity=".32"/>
  </filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="15"/></filter>
  <pattern id="grain" patternUnits="userSpaceOnUse" width="89" height="79">
    {Array.from({length: 28},(_,i)=><React.Fragment key={i}><path d={`M${hash(i)*89} ${hash(i+100)*79}l${2+hash(i+40)*5} ${hash(i+32)*2}`} stroke="#fff8dd" strokeWidth=".7" opacity=".28"/><circle cx={hash(i+800)*89} cy={hash(i+30)*79} r={hash(i+400)*.9+.3} fill="#060f1c" opacity=".17"/></React.Fragment>)}
  </pattern>
  <radialGradient id="moonGlow"><stop stopColor="#ffeab3" stopOpacity=".33"/><stop offset="1" stopColor="#ffeab3" stopOpacity="0"/></radialGradient>
  <radialGradient id="lampGlow"><stop stopColor="#fff0a7" stopOpacity=".8"/><stop offset=".3" stopColor="#ffd778" stopOpacity=".35"/><stop offset="1" stopColor="#ffd778" stopOpacity="0"/></radialGradient>
  <linearGradient id="skyNight" x2=".2" y2="1"><stop stopColor="#101d38"/><stop offset="1" stopColor="#326378"/></linearGradient>
  <linearGradient id="skyPink" x2=".1" y2="1"><stop stopColor="#8d617d"/><stop offset=".5" stopColor="#d79a9a"/><stop offset="1" stopColor="#f2c5aa"/></linearGradient>
  <linearGradient id="skyGold" x2=".1" y2="1"><stop stopColor="#21303f"/><stop offset=".6" stopColor="#81655b"/><stop offset="1" stopColor="#e6aa75"/></linearGradient>
  <clipPath id="film"><rect x="30" y="30" width="1860" height="1020" rx="8"/></clipPath>
</defs>;

export const Paper: React.FC<{d: string; fill: string; stroke?: string; opacity?: number; transform?: string; shadow?: boolean}> = ({d,fill,stroke,opacity=1,transform,shadow=true}) => <g transform={transform} opacity={opacity}>
  <path d={d} fill={fill} fillRule="evenodd" filter={shadow?'url(#cut)':undefined} stroke={stroke || '#fff0d5'} strokeOpacity={stroke?1:.12} strokeWidth="1.8" strokeLinejoin="round"/>
  <path d={d} fill="url(#grain)" fillRule="evenodd" opacity=".45" pointerEvents="none"/>
</g>;

export const Moon: React.FC<{x: number; y: number; r: number; opacity?: number; glow?: number}> = ({x,y,r,opacity=1,glow=1}) => <g opacity={opacity}>
  <circle cx={x} cy={y} r={r*1.8} fill="url(#moonGlow)" opacity={glow}/>
  {[1.075,1.025,1,.95].map((k,i)=><circle key={i} cx={x+(i-2)*3} cy={y+i*2} r={r*k} fill={['#617277','#b7baa2','#f3dbac','#f5e7c6'][i]} filter="url(#cut)"/>)}
  <circle cx={x} cy={y+6} r={r*.95} fill="url(#grain)" opacity=".7"/>
  {[[.24,-.3,.16],[-.38,.07,.22],[.12,.42,.13],[-.19,-.47,.06]].map(([dx,dy,rr],i)=><circle key={i} cx={x+dx*r} cy={y+dy*r} r={rr*r} fill="#d1bf98" opacity=".16"/>)}
</g>;

export const Spark: React.FC<{x: number; y: number; r?: number; opacity?: number; color?: string}> = ({x,y,r=6,opacity=1,color='#f6e3b4'}) => <path d={`M${x} ${y-r} Q${x+r*.15} ${y-r*.12} ${x+r} ${y} Q${x+r*.15} ${y+r*.12} ${x} ${y+r} Q${x-r*.15} ${y+r*.12} ${x-r} ${y} Q${x-r*.15} ${y-r*.12} ${x} ${y-r}`} fill={color} opacity={opacity}/>;
export const Stars: React.FC<{t: number; beat: number; count?: number; bottom?: number; twinkle?: boolean}> = ({t,beat,count=55,bottom=650,twinkle=true}) => <g>
  {Array.from({length:count},(_,i)=>{const x=80+hash(i+44)*1760;const y=65+hash(i+180)*bottom; const a=twinkle?.25+.7*pulse(beat+hash(i)*2,2):.7;return i%5===0?<Spark key={i} x={x} y={y} r={4+hash(i+78)*6} opacity={a}/>:<circle key={i} cx={x+Math.sin(t*.07+i)*4} cy={y} r={1+hash(i+94)*1.5} fill="#f4e7c6" opacity={a}/>;})}
</g>;

export const wavePath = (y: number, amp: number, phase: number, frequency=1) => {
  const step=160; const pts=Array.from({length:15},(_,i)=>({x:-160+i*step,y:y+Math.sin(i*.68*frequency+phase)*amp+Math.cos(i*.24+phase*.7)*amp*.45}));
  let d=`M-200 1250 L${pts[0].x} ${pts[0].y}`;
  for(let i=1;i<pts.length;i++){const p=pts[i-1],q=pts[i];d+=` C${p.x+step*.38} ${p.y} ${q.x-step*.38} ${q.y} ${q.x} ${q.y}`;}
  return d+' L2200 1250 Z';
};
const ocean=['#24445b','#315d73','#3c7585','#5795a0','#73b0b2','#91c5bf'];
export const Waves: React.FC<{t: number; beat: number; base?: number; gap?: number; colors?: string[]; reveal?: boolean; lower?: number; count?: number; amp?: number}> = ({t,beat,base=640,gap=63,colors=ocean,reveal=false,lower=0,count=6,amp=37}) => <g>
  {Array.from({length:count},(_,i)=>{const rise=reveal?ease(beat,i,i+.85):1;const y=base+i*gap+(1-rise)*550+lower;const d=wavePath(y,amp+i*3,t*(.12+i*.025)+i*.8);return <React.Fragment key={i}><Paper d={d} fill={colors[i%colors.length]}/><path d={d.split(' L2200')[0].replace('M-200 1250 L','M')} fill="none" stroke="#e0eedb" strokeWidth="2.4" opacity=".26"/></React.Fragment>;})}
</g>;

export const Lantern: React.FC<{x?: number; y?: number; scale?: number; light?: number; floating?: boolean}> = ({x=0,y=0,scale=1,light=1,floating=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <circle r={floating?85:105} fill="url(#lampGlow)" opacity={light}/>
  <Paper d={floating?'M-24 -43 Q0 -50 24 -43 L19 27 Q0 36 -19 27 Z':'M-21 -27 Q0 -36 21 -27 L17 26 Q0 33 -17 26 Z'} fill="#edb568"/>
  <path d={floating?'M-17 -37 Q0 -41 17 -37 L13 23 Q0 28 -13 23 Z':'M-14 -21 Q0 -28 14 -21 L11 21 Q0 26 -11 21 Z'} fill="#ffe8ac" opacity={.45+.45*light}/>
  <path d="M0 -24 L0 25 M-20 -25 L20 -25 M-17 27 L17 27" stroke="#a76b48" strokeWidth="2" fill="none" opacity=".5"/>
  {!floating&&<path d="M-11 -29 Q-14 -62 0 -62 Q14 -62 11 -29" fill="none" stroke="#e7c17e" strokeWidth="3"/>}
  <path d="M0 20 Q-9 4 0 -4 Q9 7 0 20" fill="#fff3c2"/>
</g>;

export const Boy: React.FC<{x?: number; y?: number; scale?: number; lantern?: boolean; light?: number; seated?: boolean}> = ({x=0,y=0,scale=1,lantern=true,light=1,seated=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Paper d={seated?'M-28 -30 L20 -30 L35 25 L60 29 L57 42 L10 40 L-18 12 L-18 55 L-33 55 Z':'M-29 -29 L28 -29 L25 47 L10 95 L-3 95 L0 45 L-11 45 L-15 95 L-29 95 L-29 39 Z'} fill="#203b50"/>
  <Paper d="M-26 -38 Q-30 -69 -4 -75 Q22 -71 29 -43 L46 -9 L75 -3 L72 10 L30 8 L7 -11 L-15 5 L-46 18 L-53 6 L-29 -12 Z" fill="#b45e54"/>
  <path d="M-19 -37 L-1 14 L13 -34 M-5 -23 L23 -28" stroke="#ebc2a2" strokeOpacity=".5" strokeWidth="3" fill="none"/>
  <Paper d="M-23 -95 Q-24 -123 -1 -128 Q23 -124 26 -105 L37 -93 L28 -88 Q28 -67 8 -63 Q-14 -65 -18 -83 Z" fill="#e9ba8b"/>
  <Paper d="M-24 -92 Q-35 -121 -16 -135 Q4 -145 24 -131 L33 -116 L17 -112 L11 -120 L-8 -105 L-16 -88 Z" fill="#263b49"/>
  <path d="M23 -99 L27 -99" stroke="#57433a" strokeWidth="3" strokeLinecap="round"/>
  {lantern&&<Lantern x={72} y={49} scale={.85} light={light}/>}
</g>;

export const Girl: React.FC<{x?: number; y?: number; scale?: number; wave?: number; seated?: boolean; silhouette?: boolean}> = ({x=0,y=0,scale=1,wave=0,seated=false,silhouette=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Paper d={seated?'M-21 -29 L19 -29 L34 35 L67 36 L68 49 L8 48 L-16 20 Z':'M-19 -40 L19 -40 L46 65 Q0 79 -43 65 Z'} fill={silhouette?'#b2646c':'#dbc0a0'}/>
  {!seated&&<path d="M-20 69 L-17 101 L-28 102 L-30 97 L-29 66 M19 69 L24 98 L14 102 L12 68" fill={silhouette?'#b2646c':'#374959'}/>}
  <Paper d="M-21 -40 Q-33 -65 -12 -77 L13 -77 Q28 -71 27 -39 L19 -13 L-20 -15 Z" fill={silhouette?'#b2646c':'#789b9a'}/>
  <g transform={`translate(22 -59) rotate(${-wave*30})`}><path d="M0 0 L25 -26 L22 -59 L33 -62 L39 -25 L13 13 Z" fill={silhouette?'#b2646c':'#789b9a'} filter="url(#cut)"/><path d="M22 -59 L19 -74 L23 -77 L27 -67 L30 -79 L34 -78 L36 -66 L40 -69 L42 -65 L33 -53 Z" fill={silhouette?'#b2646c':'#edbd93'}/></g>
  <Paper d="M-25 -112 Q-21 -138 5 -133 Q28 -130 25 -98 Q21 -70 2 -68 Q-18 -77 -25 -112 Z" fill={silhouette?'#b2646c':'#eac19b'}/>
  <Paper d="M-27 -97 Q-38 -134 -8 -147 Q25 -154 38 -127 Q40 -107 26 -88 L19 -92 L18 -121 Q-2 -115 -17 -129 L-20 -91 L-4 -64 L-30 -49 L-44 -64 Q-23 -78 -27 -97 Z" fill={silhouette?'#b2646c':'#2b3c48'}/>
  <path d="M8 -145 L15 -132 L31 -142 L25 -151 Z" fill="#d69b85"/>
</g>;

export const Boat: React.FC<{x: number; y: number; scale?: number; angle?: number; light?: number; couple?: boolean; boy?: boolean}> = ({x,y,scale=1,angle=0,light=1,couple=false,boy=true}) => <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
  <ellipse cx="0" cy="85" rx="175" ry="15" fill="#061d30" opacity=".18"/>
  {boy&&<Boy x={couple?-47:0} y={-46} scale={.74} light={light} seated={couple}/>}
  {couple&&<Girl x={45} y={-42} scale={.72} seated/>}
  <Paper d="M-155 -10 L0 -66 L154 -11 L117 66 L-108 66 Z" fill="#e9d9b3"/>
  <Paper d="M-155 -10 L0 21 L154 -11 L117 66 L-108 66 Z" fill="#f5e7c9"/>
  <Paper d="M-155 -10 L-26 33 L0 21 L-108 66 Z" fill="#cfb996"/>
  <Paper d="M154 -11 L41 34 L0 21 L117 66 Z" fill="#decaab"/>
  <path d="M-109 65 L0 21 L116 65 M0 21 L0 -65" stroke="#9b8d79" strokeWidth="2" opacity=".45"/>
  {boy&&<Lantern x={couple?6:53} y={-7} scale={.63} light={light}/>}
</g>;

export const Cloud: React.FC<{x: number; y: number; scale?: number; color?: string; opacity?: number}> = ({x,y,scale=1,color='#253d53',opacity=1}) => <Paper transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} fill={color} d="M-235 34 Q-270 -12 -213 -36 Q-198 -98 -131 -77 Q-104 -153 -31 -107 Q21 -139 60 -86 Q133 -124 158 -62 Q243 -52 240 11 Q243 45 189 52 L-187 57 Z"/>;

export const Whale: React.FC<{x: number; y: number; scale?: number; angle?: number}> = ({x,y,scale=1,angle=-18}) => <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
  <Paper d="M-258 3 Q-190 -135 -7 -122 Q149 -131 236 -20 L305 -38 L322 -98 L371 -88 L346 -20 L397 28 L350 51 L293 9 L232 22 Q98 135 -72 93 Q-212 69 -258 3 Z" fill="#233c56"/>
  <Paper d="M-253 10 Q-116 16 14 56 Q141 78 235 0 Q114 145 -59 94 Q-194 79 -253 10 Z" fill="#b9cfca"/>
  <Paper d="M-3 27 Q28 109 105 155 Q133 148 99 93 L49 15 Z" fill="#3a5e74"/>
  <circle cx="-174" cy="-27" r="8" fill="#f5e1af"/><circle cx="-173" cy="-27" r="3.5" fill="#1b314a"/>
  <path d="M-224 2 Q-189 29 -144 26 M-150 43 Q-101 64 -56 63 M-152 55 Q-102 76 -57 76" fill="none" stroke="#537f8a" strokeWidth="3"/>
  <path d="M-83 -127 Q-80 -169 -60 -185 M-83 -127 Q-121 -162 -139 -163 M-83 -127 Q-75 -149 -35 -154" stroke="#c3e0d6" strokeWidth="5" fill="none"/>
</g>;

export const Pier: React.FC<{x?: number; y?: number; scale?: number; fill?: string}> = ({x=0,y=0,scale=1,fill='#6f5360'}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Paper d="M-60 0 L1020 0 L990 65 L-70 65 Z" fill={fill}/>
  <path d="M55 60 L69 284 L109 284 L97 62 M435 60 L445 280 L488 280 L478 62 M825 60 L838 264 L877 264 L868 62" fill={fill} filter="url(#cut)"/>
  {Array.from({length:13},(_,i)=><path key={i} d={`M${i*80} 3 L${i*80-7} 56`} stroke="#e2b895" opacity=".27" strokeWidth="2"/>)}
  <path d="M45 -115 L45 0 M365 -115 L365 0 M685 -115 L685 0 M1005 -115 L1005 0 M45 -92 L1005 -92 M45 -50 L1005 -50" stroke={fill} strokeWidth="13" fill="none"/>
</g>;

export const Reeds: React.FC<{x:number;y:number;scale?:number;color?:string;t?:number}> = ({x,y,scale=1,color='#153f51',t=0}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  {Array.from({length:9},(_,i)=><path key={i} d={`M${i*18} 120 Q${i*18-25+Math.sin(t*.3+i)*6} ${20-i*5} ${i*18-50} ${-80+hash(i)*95} Q${i*18+3} ${-18} ${i*18+8} 120 Z`} fill={color} filter="url(#cut)"/>)}
</g>;
