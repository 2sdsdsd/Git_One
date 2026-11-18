import React from 'react';
import {Paper, hash, pulse} from './art';

export const Box: React.FC<{x:number;y:number;w:number;h:number;fill:string;radius?:number;shadow?:boolean}> = ({x,y,w,h,fill,radius=4,shadow=true}) => <g>
  {shadow&&<rect x={x+4} y={y+7} width={w} height={h} rx={radius} fill="#182f3e" opacity=".19"/>}
  <rect x={x} y={y} width={w} height={h} rx={radius} fill={fill} stroke="#f9e7c7" strokeOpacity=".24" strokeWidth="2"/>
  <rect x={x} y={y} width={w} height={h} rx={radius} fill="url(#grain)" opacity=".2"/>
</g>;
export const Words: React.FC<{x:number;y:number;size?:number;color?:string;children:React.ReactNode}> = ({x,y,size=27,color='#f6e7c8',children}) => <text x={x} y={y} fontSize={size} fill={color} textAnchor="middle" style={{fontFamily:'Microsoft YaHei, sans-serif',letterSpacing:4}}>{children}</text>;

export const Envelope: React.FC<{x:number;y:number;scale?:number;open?:number}> = ({x,y,scale=1,open=0}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Box x={-64} y={-38} w={128} h={84} fill="#f3dfb9"/>
  <path d={open>.4?'M-64 -38 L0 -99 L64 -38 Z':'M-64 -38 L0 9 L64 -38 Z'} fill={open>.4?'#d7bc95':'#fff0cf'} stroke="#b9a383" strokeWidth="2"/>
  <path d="M-64 45 L0 -2 L64 45" fill="none" stroke="#b9a383" strokeWidth="2"/>
  {open>.4&&<Box x={-48} y={-78} w={96} h={73} fill="#fff2d4" shadow={false}/>}
  {!open&&<path d="M0 -1 C-15 -17 -25 2 0 20 C25 2 15 -17 0 -1" fill="#bb746c"/>}
</g>;
export const Suitcase: React.FC<{x:number;y:number;scale?:number;open?:number}> = ({x,y,scale=1,open=0}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <path d="M-16 -42 L-16 -54 L16 -54 L16 -42" stroke="#84614d" strokeWidth="7" fill="none"/>
  <Box x={-45} y={-43} w={90} h={73} fill="#b58558" radius={9}/>
  <path d="M-24 -42 L-24 29 M24 -42 L24 29" stroke="#e5ba78" strokeWidth="9"/>
  <rect x="-12" y="-15" width="24" height="16" rx="3" fill="#dcbd8a"/>
  {open>.2&&<g transform={`translate(0 -42) scale(1 ${open})`}><Box x={-45} y={-54} w={90} h={54} fill="#986d51"/><path d="M-22 -12 L-25 -40 L25 -40 L22 -12" fill="#b65f55"/></g>}
</g>;
export const Guitar: React.FC<{x:number;y:number;scale?:number;beat?:number}> = ({x,y,scale=1,beat=0}) => <g transform={`translate(${x} ${y}) rotate(-25) scale(${scale})`}>
  <path d="M-23 -40 Q-56 -51 -63 -18 Q-97 19 -49 58 Q-2 84 32 55 Q72 18 33 -9 Q47 -39 12 -47 L4 -141 L-13 -147 Z" fill="#d9a46c" stroke="#805b46" strokeWidth="4"/>
  <path d="M-14 -49 L-12 -156 L8 -156 L10 -49" fill="#795342"/>
  <Box x={-19} y={-177} w={33} h={36} fill="#c49c68" shadow={false}/>
  <circle cx="-10" cy="0" r="20" fill="#5c4239"/>
  {Array.from({length:5},(_,i)=><path key={i} d={`M${-18+i*4} -147 L${-20+i*4+Math.sin(beat*6)*.6} 35`} fill="none" stroke="#f7e0b1" strokeWidth=".8"/>)}
  <rect x="-29" y="31" width="38" height="8" rx="2" fill="#624638"/>
</g>;

type ActorProps={x:number;y:number;scale?:number;walk?:number;direction?:number;pose?:'normal'|'wave'|'guitar'|'read'|'study'|'carry'|'apron';back?:boolean;look?:number};
export const YoungMan: React.FC<ActorProps> = ({x,y,scale=1,walk=0,direction=1,pose='normal',back=false,look=0}) => {
  const swing=Math.sin(walk)*19;
  return <g transform={`translate(${x} ${y}) scale(${scale*direction} ${scale})`}>
    <g transform={`rotate(${swing} -15 -72)`}><path d="M-30 -77 L-5 -77 L-9 -15 L-4 0 L-43 0 L-41 -11 L-29 -17 Z" fill="#304e63"/><path d="M-43 -9 L-3 -9 L-1 2 L-46 2 Z" fill="#253d4a"/></g>
    <g transform={`rotate(${-swing} 15 -72)`}><path d="M1 -77 L28 -77 L32 -17 L46 -8 L45 3 L7 3 L5 -17 Z" fill="#3c596b"/><path d="M6 -8 L44 -8 L48 2 L6 2 Z" fill="#263d4a"/></g>
    <Paper d="M-38 -192 Q0 -206 39 -191 L43 -74 Q4 -59 -43 -75 Z" fill="#b96759"/>
    <path d="M-2 -189 L-2 -73 M-19 -106 L-35 -106" stroke="#e8bb90" strokeWidth="3" opacity=".6"/>
    {pose==='apron'&&<Paper d="M-25 -178 L26 -178 L34 -76 L-34 -76 Z" fill="#e4d1a4"/>}
    <path d="M-13 -207 L-12 -187 L14 -187 L14 -207" fill="#dbab81"/>
    <g transform={`translate(${look*5} 0)`}>
      <Paper d="M-32 -251 Q-25 -282 4 -280 Q35 -277 35 -245 L44 -232 L34 -225 Q29 -202 7 -199 Q-22 -203 -29 -225 Z" fill="#eac19a"/>
      <Paper d="M-33 -235 Q-50 -270 -21 -291 Q5 -304 30 -283 L40 -264 L20 -255 L9 -273 L-14 -249 L-27 -226 Z" fill="#293e4b"/>
      {!back&&<><circle cx={22+look*3} cy="-239" r="3" fill="#4d4941"/><path d="M19 -217 L28 -217" stroke="#915d51" strokeWidth="2" strokeLinecap="round"/></>}
    </g>
    <g transform={`rotate(${pose==='wave'?-65:pose==='guitar'?-32:pose==='read'?-45:swing*.7} 30 -178)`}><path d="M29 -190 L47 -176 L61 -112 L45 -106 L26 -158 Z" fill="#a75c53"/><path d="M45 -116 L62 -116 L64 -94 L54 -88 L44 -94 Z" fill="#e6b791"/></g>
    <g transform={`rotate(${pose==='guitar'?40:pose==='read'?37:-swing*.7} -28 -178)`}><path d="M-28 -190 L-48 -175 L-57 -111 L-40 -107 L-20 -160 Z" fill="#c47963"/><path d="M-56 -115 L-39 -112 L-42 -93 L-51 -91 L-60 -99 Z" fill="#e8bc92"/></g>
    {pose==='carry'&&<Suitcase x={60} y={-65} scale={.72}/>}
    {pose==='guitar'&&<Guitar x={15} y={-123} scale={.9} beat={walk}/>}
    {pose==='read'&&<Envelope x={7} y={-138} scale={.63} open={1}/>}
    {back&&<Box x={-27} y={-174} w={55} h={65} fill="#788b83" radius={9}/>}
  </g>;
};
export const YoungWoman: React.FC<ActorProps & {headphones?:boolean;bag?:boolean}> = ({x,y,scale=1,walk=0,direction=1,pose='normal',headphones=false,bag=true,back=false,look=0}) => {
  const swing=Math.sin(walk)*16;
  return <g transform={`translate(${x} ${y}) scale(${scale*direction} ${scale})`}>
    <g transform={`rotate(${swing} -13 -46)`}><path d="M-25 -53 L-8 -53 L-7 -12 L0 0 L-28 0 L-32 -11 L-23 -16 Z" fill="#3f5768"/></g>
    <g transform={`rotate(${-swing} 13 -46)`}><path d="M6 -53 L24 -53 L27 -12 L36 -7 L36 0 L7 0 L4 -13 Z" fill="#334c5d"/></g>
    <Paper d="M-23 -156 L23 -156 L46 -57 Q0 -38 -43 -57 Z" fill="#e9d3ae"/>
    {bag&&<Box x={-45} y={-180} w={38} h={70} fill="#687b8d" radius={10}/>}
    <Paper d="M-29 -192 Q0 -209 27 -191 L30 -132 Q0 -118 -30 -137 Z" fill="#79a39e"/>
    <path d="M-7 -195 L-7 -131 M-22 -155 L-11 -155" stroke="#c8d9bb" strokeWidth="3"/>
    <path d="M-10 -207 L-10 -190 L13 -190 L13 -210" fill="#e0b28d"/>
    <Paper d="M-31 -261 Q-21 -290 9 -282 Q39 -274 31 -239 Q26 -214 7 -206 Q-20 -209 -31 -238 Z" fill="#edc4a0"/>
    <Paper d="M-34 -232 Q-51 -275 -20 -295 Q13 -309 38 -281 Q49 -257 33 -227 L22 -225 L24 -264 Q0 -259 -19 -276 L-25 -230 L-11 -207 L-30 -193 L-52 -211 Q-32 -219 -34 -232 Z" fill="#304452"/>
    <path d="M5 -291 L-10 -312 L8 -312 L18 -295 L38 -309 L44 -296 L20 -285 Z" fill="#d8928b"/>
    {!back&&<><circle cx={16+look*3} cy="-249" r="3" fill="#504d45"/><path d="M11 -225 L21 -225" stroke="#ad6d61" strokeWidth="2"/></>}
    <g transform={`rotate(${pose==='wave'?-60:(pose==='read'||pose==='study')?-37:swing*.8} 24 -180)`}><path d="M19 -189 L38 -180 L48 -116 L30 -111 L9 -161 Z" fill="#78a29e"/><path d="M29 -119 L47 -119 L49 -96 L39 -90 L28 -96 Z" fill="#ecc19b"/></g>
    <g transform={`rotate(${pose==='read'||pose==='study'?40:-swing*.8} -24 -178)`}><path d="M-19 -188 L-39 -175 L-46 -116 L-28 -111 L-7 -158 Z" fill="#6c9896"/><path d="M-46 -120 L-29 -114 L-31 -96 L-42 -93 L-50 -99 Z" fill="#eac19b"/></g>
    {headphones&&<><path d="M-27 -253 Q-39 -292 -6 -299 Q26 -300 34 -265" fill="none" stroke="#e4cab0" strokeWidth="7"/><rect x="-33" y="-258" width="12" height="29" rx="5" fill="#d9b5a0"/><rect x="27" y="-263" width="13" height="29" rx="5" fill="#d9b5a0"/></>}
    {pose==='read'&&<Envelope x={4} y={-140} scale={.7} open={1}/>}
    {pose==='study'&&<g transform="translate(4 -149)"><path d="M-50 -29 L0 -18 L50 -29 L50 35 L0 47 L-50 35 Z" fill="#f0e1ba" stroke="#91a28b" strokeWidth="5"/><path d="M0 -18 V47 M-40 -13 L-9 -6 M-40 0 L-9 7 M10 -6 L39 -13 M10 7 L39 0" stroke="#a7ad91" strokeWidth="2"/></g>}
  </g>;
};

export const Window: React.FC<{x:number;y:number;w?:number;h?:number;lit?:boolean}> = ({x,y,w=120,h=155,lit=false}) => <g>
  <Box x={x-9} y={y-9} w={w+18} h={h+18} fill={lit?'#c4ac87':'#809391'}/>
  <rect x={x} y={y} width={w} height={h} fill={lit?'#f3dba1':'#527780'}/>
  <path d={`M${x+w/2} ${y} V${y+h} M${x} ${y+h*.53} H${x+w}`} stroke={lit?'#c5a27e':'#98ac9f'} strokeWidth="8"/>
  <path d={`M${x+6} ${y+6} L${x+w*.5} ${y+6} L${x+6} ${y+h*.46} Z`} fill="#fcf0d3" opacity=".2"/>
  <Box x={x-15} y={y+h} w={w+30} h={13} fill="#cbb594"/>
</g>;
export const Plant: React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  {[-30,-10,15,35].map((a,i)=><path key={i} d="M0 0 Q-43 -33 -10 -61 Q11 -35 0 0" transform={`rotate(${a})`} fill={['#587f70','#6e9882','#8cac88','#436e66'][i]}/>)}
  <Paper d="M-27 -6 L27 -6 L20 34 L-20 34 Z" fill="#c28468"/>
</g>;

export const Apartment: React.FC<{x:number;y:number;scale?:number;girl?:boolean;doorOpen?:number;night?:boolean;occupied?:boolean}> = ({x,y,scale=1,girl=false,doorOpen=0,night=false,occupied=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Box x={0} y={0} w={520} h={650} fill={girl?'#d5ab94':'#a3b1ac'}/>
  <Paper d="M-30 15 L-5 -55 L520 -55 L550 15 Z" fill={girl?'#947979':'#6d8586'}/>
  <Box x={-15} y={320} w={550} h={24} fill={girl?'#bc947f':'#809996'}/>
  <Box x={-15} y={632} w={550} h={24} fill="#a68b74"/>
  <Window x={55} y={60} w={137} h={172} lit={night&&girl}/><Window x={310} y={60} w={137} h={172} lit={night&&occupied}/>
  <Window x={315} y={392} w={131} h={170} lit={night&&girl}/>
  <Box x={45} y={380} w={170} h={252} fill="#4b6465"/>
  <rect x="57" y="391" width="146" height="241" fill="#f0ca8e" opacity={.25+.65*doorOpen}/>
  <g transform={`translate(57 391) scale(${1-doorOpen*.85} 1)`}><Box x={0} y={0} w={146} h={241} fill={girl?'#70958e':'#597d81'} shadow={false}/><circle cx="122" cy="128" r="6" fill="#ebca85"/></g>
  {!girl&&<><Box x={242} y={378} w={83} h={49} fill="#eed7ae"/><Words x={285} y={411} size={23} color="#617b7a">{occupied?'已租':'出租'}</Words></>}
  {girl&&<><Plant x={376} y={213} scale={.73}/><Plant x={474} y={605} scale={1.05}/></>}
  <path d="M252 28 V350 H470 V376" fill="none" stroke="#7b9190" strokeWidth="8"/>
</g>;

export const Alley: React.FC<{p:number;night?:boolean;doorOpen?:number;occupied?:boolean}> = ({p,night=false,doorOpen=0,occupied=false}) => <g>
  <rect width="1920" height="1080" fill={night?'#203a50':'#d8d4bb'}/>
  <Box x={728} y={290} w={460} h={410} fill={night?'#3e5968':'#b7c0ab'}/>
  <Window x={805} y={385} w={102} h={124} lit={night}/><Window x={1005} y={385} w={102} h={124}/>
  <Paper d="M730 665 L1180 665 L1880 1100 L-120 1100 Z" fill={night?'#577078':'#c6baa3'}/>
  {Array.from({length:5},(_,i)=><path key={i} d={`M${200+i*330} 1080 L${815+i*65} 683`} fill="none" stroke={night?'#82918a':'#eee1c7'} strokeWidth="3" opacity=".35"/>)}
  <Apartment x={100} y={147} occupied={occupied} doorOpen={doorOpen} night={night}/>
  <Apartment x={1230} y={200} scale={.96} girl night={night}/>
  <Paper d="M-100 827 Q130 758 225 865 L192 1080 L-100 1080 Z" fill={night?'#314e57':'#7b9b82'}/>
  <Plant x={163} y={934} scale={2}/>
  <path d="M602 166 Q958 248 1270 216" fill="none" stroke="#7e8c7f" strokeWidth="3"/>
  {[0,1,2,3].map(i=><path key={i} d={`M${746+i*98} ${195+Math.sin(i*.8)*22} l24 30 26 -28`} fill="#efceaf" opacity=".7"/>)}
</g>;

export const Campus: React.FC<{night?:boolean;reverse?:boolean;sky?:boolean}> = ({night=false,reverse=false,sky=true}) => <g>
  {sky&&<rect width="1920" height="1080" fill={night?'#213d55':'#d9ddc7'}/>}
  <Box x={220} y={170} w={1450} h={510} fill={night?'#71827e':'#d8c19b'}/>
  <Box x={193} y={145} w={1505} h={46} fill="#9e9580"/>
  {Array.from({length:12},(_,i)=><Window key={i} x={298+(i%6)*224} y={245+Math.floor(i/6)*205} w={120} h={132} lit={night&&(i=== (reverse?2:9))}/>)}
  <Box x={869} y={554} w={170} h={137} fill="#718981"/>
  <Paper d="M0 807 Q420 706 958 774 Q1400 687 1920 810 L1920 1150 L0 1150 Z" fill={night?'#526f69':'#90aa80'}/>
  <Paper d="M181 1080 Q798 733 985 742 L1115 742 Q1370 795 1720 1080 Z" fill={night?'#8a9290':'#d5c4a5'}/>
  <Words x={964} y={224} size={29} color={night?'#d7d1b3':'#60716b'}>大学</Words>
</g>;

export const Bench: React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Box x={-160} y={-86} w={320} h={22} fill="#b29576"/><Box x={-160} y={-51} w={320} h={22} fill="#b29576"/>
  <Box x={-176} y={-9} w={352} h={28} fill="#c9b28c"/>
  <path d="M-120 -85 L-120 75 M120 -85 L120 75" stroke="#617573" strokeWidth="16"/>
</g>;
export const ClockTower: React.FC<{x:number;y:number;beat:number}> = ({x,y,beat}) => <g transform={`translate(${x} ${y})`}>
  <Box x={-115} y={-430} w={230} h={610} fill="#b7a78b"/>
  <Paper d="M-155 -430 L0 -560 L155 -430 Z" fill="#647f80"/>
  <circle cy="-302" r="81" fill="#ead8ad" stroke="#697d7a" strokeWidth="10"/>
  {Array.from({length:12},(_,i)=><path key={i} d="M0 -363 L0 -373" transform={`rotate(${i*30} 0 -302)`} stroke="#657b77" strokeWidth="4"/>)}
  <path d="M0 -302 L32 -336 M0 -302 L-4 -353" fill="none" stroke="#58716d" strokeWidth="6" strokeLinecap="round"/>
  <Box x={-40} y={-170} w={80} h={95} fill="#596f70"/>
  <path d={`M${Math.sin(beat*Math.PI)*7} -80 V12`} stroke="#d8be89" strokeWidth="7"/>
  <path d={`M-31 3 Q${Math.sin(beat*Math.PI)*18} -63 31 3 Z`} fill="#d7b774"/>
</g>;
export const PassingStudents: React.FC<{t:number;beat:number;count?:number}> = ({t,beat,count=15}) => <g>
  {[0,1,2].map(layer=><g key={layer} opacity={.5+layer*.15}>{Array.from({length:Math.ceil(count/3)},(_,j)=>{
    const phase=(t*(.022+layer*.006)+j*.23+hash(j+layer*10)*.1)%1;
    const x=layer%2?2150-phase*2400:phase*2400-210;
    const y=740+layer*95;
    const color=['#8ea397','#658584','#4b6672'][layer];
    return <g key={j} transform={`translate(${x} ${y}) scale(${.6+layer*.25})`}>
      <circle cy="-201" r="30" fill={color}/><path d="M-32 -163 Q0 -179 31 -164 L42 -70 L-42 -70 Z" fill={color}/>
      <path d={`M-23 -75 L${-21+Math.sin(beat*Math.PI+j)*21} 0 M20 -75 L${21-Math.sin(beat*Math.PI+j)*21} 0`} stroke={color} strokeWidth="21"/>
      <rect x="25" y="-146" width="32" height="54" rx="8" fill={color}/>
    </g>;
  })}</g>)}
</g>;
