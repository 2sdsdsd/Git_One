import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import timeline from './timeline.json';
import {Boat, Boy, Girl, Cloud, Defs, Lantern, Moon, Paper, Pier, Reeds, Spark, Stars, Waves, Whale, clamp, ease, frac, hash, pulse, wavePath} from './art';

type SceneProps = {t: number; p: number; beat: number; localBeat: number; length: number};
const drift = (t: number, amplitude = 9) => Math.sin(t*.63)*amplitude;
const Camera: React.FC<{zoom?: number; x?: number; y?: number; children: React.ReactNode}> = ({zoom=1,x=0,y=0,children}) => <g transform={`translate(${960+x} ${540+y}) scale(${zoom}) translate(-960 -540)`}>{children}</g>;
const Sky: React.FC<{fill?: string}> = ({fill='url(#skyNight)'}) => <rect x="-1000" y="-1000" width="4000" height="3000" fill={fill}/>;
const Dust: React.FC<{t: number; count?: number; color?: string}> = ({t,count=28,color='#e8d6b4'}) => <g>{Array.from({length:count},(_,i)=><circle key={i} cx={80+hash(i+92)*1760+Math.sin(t*.12+i)*16} cy={80+frac(hash(i+620)-t*.002)*900} r={1+hash(i+382)*2} fill={color} opacity={.14+hash(i+661)*.18}/>)}</g>;

const Launch: React.FC<SceneProps> = ({t,p,beat,localBeat}) => {
  const arrive=ease(localBeat,6,8);
  const x=530+p*510;
  return <Camera zoom={1+p*.08} y={p*-18}>
    <Sky/><Stars t={t} beat={beat} bottom={540}/>
    <Moon x={620} y={302} r={205}/>
    <Cloud x={1500-t*2} y={235} scale={.78} color="#3e6070" opacity={.65}/>
    <Cloud x={1580+t*1.2} y={430} scale={1.25} opacity={.65}/>
    <g opacity={.22}>{Array.from({length:10},(_,i)=><path key={i} d={`M${530-i*14} ${550+i*24} Q620 ${540+i*24} ${710+i*14} ${550+i*24}`} fill="none" stroke="#e9d7b0" strokeWidth={5+i*.8}/>)}</g>
    <Waves t={t} beat={localBeat} base={670} gap={39} reveal count={3}/>
    <Boat x={x} y={685+(1-arrive)*360+drift(t,11)} scale={.87} angle={drift(t,3)} light={.6+.4*pulse(beat)}/>
    <Waves t={t+4} beat={localBeat-3} base={827} gap={75} reveal count={3} colors={['#5997a0','#78b2b1','#a4c8bd']}/>
    <Reeds x={-25} y={950} scale={1.3} t={t}/>
    <Dust t={t}/>
  </Camera>;
};

const Lonely: React.FC<SceneProps> = ({t,p,beat}) => <Camera zoom={1.12-p*.17} y={p*-25}>
  <Sky fill="#101c34"/><Stars t={t} beat={beat} count={90} bottom={720}/>
  <Moon x={1440} y={260} r={150} glow={.3}/>
  <Cloud x={1160+ease(p,0,.42)*330} y={240} scale={1.6} color="#1a2b43"/>
  <Cloud x={650+t*3} y={390} scale={1.4} color="#23364f"/>
  <Cloud x={190-p*100} y={590} scale={2.1} color="#182b42" opacity={.65}/>
  <Waves t={t*.8} beat={beat} base={760} gap={43} count={3} amp={19} colors={['#1a354d','#24455d','#2b5266']}/>
  <Boat x={970+p*90} y={790+drift(t,5)} scale={.29} angle={drift(t,2)} light={.18+.82*pulse(beat)}/>
  <ellipse cx={992+p*90} cy={850} rx={11+7*pulse(beat)} ry={3} fill="#ffce76" opacity={.23+.22*pulse(beat)}/>
  <Waves t={t+20} beat={beat} base={919} gap={65} count={3} amp={24} colors={['#2a5369','#315c70','#38687b']}/>
  <Dust t={t} count={14}/>
</Camera>;

const Thinking: React.FC<SceneProps> = ({t,p,beat,localBeat}) => {
  const grow=ease(localBeat,0,6);
  const scale=.35+.65*grow+Math.floor(localBeat)*.006;
  return <Camera zoom={1+p*.075} x={-p*25}>
    <Sky/><rect x="0" y="0" width="1920" height="1080" fill="url(#skyPink)" opacity={ease(p,0,.75)*.88}/>
    <Stars t={t} beat={beat} count={22} bottom={500}/>
    <Cloud x={260-t*2} y={340} color="#715f75" scale={1.4} opacity={.4}/>
    <Waves t={t} beat={beat} base={890} gap={57} count={4} colors={['#465f75','#648592','#88a7aa','#b6c5b8']}/>
    <Boy x={530} y={828+drift(t,5)} scale={2.35} light={.8+.2*pulse(beat)}/>
    <Paper d="M55 1020 L450 868 L925 999 L827 1190 L215 1190 Z" fill="#f0dabc"/>
    {[0,1,2].map(i=><circle key={i} cx={655+i*90} cy={440-i*46+drift(t+i,3)} r={12+i*9} fill="#f1d1b7" opacity={grow*.7} filter="url(#cut)"/>)}
    <g transform={`translate(1190 358) scale(${scale})`} opacity={grow}>
      <Paper d="M-268 5 Q-301 -182 -124 -221 Q-17 -282 126 -203 Q290 -168 278 10 Q322 143 156 183 Q45 247 -105 183 Q-283 164 -268 5 Z" fill="#f1d4b8"/>
      <Paper d="M-245 4 Q-268 -161 -109 -196 Q-15 -244 118 -183 Q261 -149 252 9 Q283 125 147 158 Q32 214 -96 163 Q-253 138 -245 4 Z" fill="#cf9697"/>
      <Moon x={110} y={-85} r={48} glow={.2}/>
      <Girl x={-20} y={67} scale={1.13} silhouette wave={.35+.25*Math.sin(t*1.3)}/>
      <Paper d="M-236 110 Q-154 60 -65 141 Q48 88 248 124 L225 172 Q0 228 -218 155 Z" fill="#be7b89"/>
      {[0,1,2,3,4].map(i=><Spark key={i} x={-176+hash(i+9)*330} y={-156+hash(i+22)*210} r={7+3*pulse(beat+i)} opacity={.6}/>) }
    </g>
    <Dust t={t} color="#ffe1bb"/>
  </Camera>;
};

const Brave: React.FC<SceneProps> = ({t,p,beat,length}) => {
  const heroBeat=Math.round((length*.34)*timeline.bpm/60);
  const hit=heroBeat*60/timeline.bpm;
  const jump=clamp((t-hit)/5.5);
  const arc=Math.sin(jump*Math.PI);
  const climbing=ease(t,0,hit+2);
  return <Camera zoom={1+p*.055} x={drift(t,3)} y={-12*pulse(beat)*ease(t,hit,hit+.2)*(1-ease(t,hit+3,hit+4))}>
    <Sky fill="#21364c"/><Stars t={t} beat={beat} count={48}/>
    <Moon x={1475} y={245} r={165} opacity={.2+.8*ease(t,hit,hit+2)}/>
    <Cloud x={1515+ease(t,hit,hit+4)*470} y={260} scale={1.1}/>
    <Waves t={t} beat={beat} base={830} gap={57} count={3} amp={60} colors={['#34536b','#416f83','#5f9aa5']}/>
    <g transform={`translate(0 ${70*(1-climbing)})`}>
      <Paper d="M-120 1010 Q90 1000 371 887 Q703 757 910 449 Q1107 172 1338 367 Q1488 499 1305 662 Q1344 469 1197 455 Q1106 459 1160 561 Q1277 796 1720 955 L2050 1140 Z" fill="#35667e"/>
      <Paper d="M-120 1080 Q424 1054 826 620 Q1019 364 1220 361 Q1390 360 1328 546 Q1350 398 1227 394 Q1117 387 1009 538 Q865 891 1920 1050 L1920 1200 Z" fill="#6aa5b0"/>
      <path d="M260 983 Q662 870 968 468 Q1143 280 1297 397" fill="none" stroke="#d4e4d6" strokeWidth="12" strokeLinecap="round"/>
      <Boat x={440+climbing*610+p*80} y={864-climbing*455+drift(t,8)} angle={-29+climbing*12} scale={.8} light={1}/>
    </g>
    {jump>0&&jump<1&&<Whale x={620+480*jump} y={1080-arc*640} scale={1.32} angle={-34+jump*61}/>}
    {Array.from({length:24},(_,i)=>{const a=hash(i+12)*Math.PI;const age=clamp((t-hit-hash(i)*.6)/3);return <Paper key={i} opacity={Math.sin(age*Math.PI)*.75} fill="#d0e5d8" d="M0 -14 Q12 3 0 12 Q-12 3 0 -14 Z" transform={`translate(${870+Math.cos(a)*age*500} ${910-Math.sin(a)*age*520+age*age*240}) rotate(${age*120}) scale(${.4+hash(i+7)*.8})`}/>;})}
    <Waves t={t+15} beat={beat} base={993} gap={55} count={2} amp={48} colors={['#87bdb8','#b4d4c3']}/>
  </Camera>;
};

const Walker: React.FC<{x:number;y:number;scale:number;color:string;phase:number;variant:number}> = ({x,y,scale,color,phase,variant}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <Paper d="M-25 -85 Q-31 -111 -2 -117 Q25 -113 22 -90 L29 -77 L20 -66 L-13 -65 Z" fill={color}/>
  {variant%3===0&&<path d="M-34 -102 L33 -102 L20 -122 L-18 -124 Z" fill={color}/>} 
  <Paper d="M-21 -59 Q0 -73 22 -54 L36 11 L-33 11 Z" fill={color}/>
  <g transform={`rotate(${Math.sin(phase)*22} 0 8)`}><path d="M-20 8 L-7 8 L-5 79 L-26 83 L-30 74 L-18 66 Z" fill={color}/></g>
  <g transform={`rotate(${-Math.sin(phase)*22} 0 8)`}><path d="M4 8 L18 8 L27 75 L10 82 L4 74 L11 67 Z" fill={color}/></g>
  <path d={`M20 -48 L${44+Math.sin(phase)*12} -3 L37 4 L12 -35 Z`} fill={color}/>
  {variant%2===0&&<Paper d="M29 -2 L61 -2 L64 29 L28 28 Z" fill={color}/>} 
</g>;

const Passing: React.FC<SceneProps> = ({t,p,beat}) => <Camera zoom={1+p*.035} x={p*-40}>
  <Sky fill="url(#skyPink)"/><Moon x={340} y={295} r={126} glow={.45}/>
  <Cloud x={1030-t*1.6} y={267} scale={1.2} color="#b27e8a"/>
  <Cloud x={1670-t*2.3} y={417} scale={.7} color="#d8a39c"/>
  <Paper d="M0 652 L73 652 L73 562 L193 562 L193 615 L258 615 L258 492 L344 492 L344 632 L448 632 L448 594 L531 594 L531 678 L1920 678 L1920 1080 L0 1080 Z" fill="#a17b86"/>
  <Waves t={t} beat={beat} base={732} gap={67} count={4} amp={18} colors={['#9b959b','#a5adb0','#c2c8bd','#dbcfc2']}/>
  <g transform="translate(70 710) skewY(-3)"><Pier scale={1.8} fill="#8b6471"/></g>
  {[0,1,2].map(layer=><g key={layer} opacity={.58+layer*.18}>{Array.from({length:5},(_,j)=>{
    const k=Math.floor(t/(10+layer*3));
    const travel=frac(t/(10+layer*3)+j/5);
    const x=layer%2?2100-travel*2350:travel*2350-220;
    return <Walker key={j} x={x} y={700+layer*131} scale={.82+layer*.44} color={['#987282','#614e65','#364052'][layer]} phase={beat*Math.PI+j} variant={j+k+layer}/>;
  })}</g>)}
  <Girl x={1390-p*180} y={690} scale={.76} wave={0}/>
  <Reeds x={1680} y={982} color="#7d6571" t={t} scale={1.1}/>
  <Dust t={t} color="#ffedce"/>
</Camera>;

const Leaving: React.FC<SceneProps> = ({t,p,beat,length}) => {
  const releaseBeat=Math.round(length*.16*timeline.bpm/60);
  const release=releaseBeat*60/timeline.bpm;
  const part=ease(t,release,release+2)*.25+ease(t,release,length)*.75;
  return <Camera zoom={1.04-p*.07}>
    <Sky fill="url(#skyPink)"/><Moon x={958} y={246} r={123}/>
    <Cloud x={320-t*1.8} y={300} color="#9c7a8e" scale={.8}/>
    <Paper d="M-60 736 Q500 664 920 735 Q1440 651 1980 741 L1980 1180 L-60 1180 Z" fill="#7e8d9a"/>
    <Waves t={t} beat={beat} base={805} gap={57} count={4} colors={['#5d758a','#7897a4','#9ab8b9','#c6ccc0']}/>
    <g transform={`translate(${part*370} ${part*28})`}>
      <Pier x={1110} y={700} scale={1.2} fill="#806275"/>
      <Girl x={1260} y={570+drift(t,1.5)} scale={1.26-part*.25} wave={.5+.45*Math.sin(beat*Math.PI)}/>
      <Reeds x={1670} y={681} color="#8a7986" t={t}/>
    </g>
    <g transform={`translate(${-part*490} ${part*52})`}>
      <Boat x={860} y={749+drift(t,8)} scale={.96-part*.18} angle={drift(t,3)} light={.9}/>
      <Paper d="M-170 985 Q70 894 253 998 Q382 906 573 1061 L880 1280 L-170 1280 Z" fill="#35566e"/>
      <Reeds x={70} y={939} scale={1.6} t={t}/>
    </g>
    <path d={`M${930-part*490} 688 Q980 585 ${1250+part*370} 556`} stroke="#f5d0b3" strokeWidth="2" strokeDasharray="5 16" fill="none" opacity={.55*(1-ease(part,.2,.75))}/>
    <Dust t={t}/>
  </Camera>;
};

const Gratitude: React.FC<SceneProps> = ({t,p,beat,localBeat}) => <Camera zoom={1+p*.1} y={p*180}>
  <Sky fill="url(#skyGold)"/><Stars t={t} beat={beat} count={75} bottom={850}/>
  <Moon x={1530} y={170-p*70} r={99} glow={.6}/>
  {[0,1,2].map(layer=><React.Fragment key={layer}>
    <Paper d={wavePath(940+layer*92,24,t*.06+layer*2)} fill={['#655c64','#4a4e5b','#303f51'][layer]}/>
    {Array.from({length:Math.ceil((timeline.shots[6].end-timeline.shots[6].start)*timeline.bpm/30)+4},(_,i)=>{
      if(i%3!==layer)return null;
      const age=localBeat*2-i;
      if(age<0||age>44)return null;
      const x=130+hash(i+150)*1660+Math.sin(t*.3+i)*18;
      const y=1060-age*(28+layer*4);
      return <g key={i} opacity={ease(age,0,1)*(1-ease(age,39,44))}><Lantern x={x} y={y} scale={.44+layer*.19+hash(i+28)*.16} light={.85+.15*pulse(beat)} floating/></g>;
    })}
  </React.Fragment>)}
  <Dust t={t} count={45} color="#ffd998"/>
</Camera>;

const Eye: React.FC<{t:number;beat:number;zoom:number}> = ({t,beat,zoom}) => <Camera zoom={zoom} x={-(zoom-1)*130} y={(zoom-1)*42}>
  <Sky fill="#ba9190"/>
  <Paper d="M-120 600 Q540 -57 1090 160 Q1510 308 2080 660 Q1520 1090 901 962 Q380 930 -120 600 Z" fill="#e4b798"/>
  <Paper d="M-95 608 Q570 180 1070 302 Q1510 390 1990 650 Q1450 969 920 842 Q352 858 -95 608 Z" fill="#543f51"/>
  <Paper d="M-49 621 Q563 260 1088 347 Q1450 450 1950 651 Q1430 849 904 795 Q383 812 -49 621 Z" fill="#f0ddc2"/>
  <circle cx="1090" cy="575" r="245" fill="#5d898e" filter="url(#cut)"/>
  <circle cx="1090" cy="575" r="208" fill="#38566c"/>
  <circle cx="1090" cy="575" r="170" fill="#1d334d"/>
  <circle cx="1090" cy="575" r="245" fill="url(#grain)"/>
  {Array.from({length:30},(_,i)=><path key={i} d="M0 -177 L7 -223" transform={`translate(1090 575) rotate(${i*12+Math.sin(t*.1)*3})`} stroke="#c2c2ab" strokeWidth="3" opacity=".32"/>)}
  <Moon x={1123} y={541} r={112} glow={.7}/>
  <circle cx="1013" cy="461" r="32" fill="#fff4d8" opacity={.7+.1*pulse(beat)}/>
  <path d="M86 550 Q540 199 1070 294 Q1510 380 1830 606 M166 474 L120 411 M258 409 L214 343 M362 355 L328 278 M482 315 L462 228" stroke="#423444" strokeWidth="17" fill="none" strokeLinecap="round"/>
</Camera>;

const Together: React.FC<SceneProps> = ({t,p,beat,length}) => {
  const portal=ease(t,length*.29,length*.48);
  const push=1+ease(t,length*.1,length*.42)*2.4;
  return <>
    <Eye t={t} beat={beat} zoom={push}/>
    <g opacity={portal}>
      <Sky fill="#23384d"/><Stars t={t} beat={beat} count={65} bottom={820}/>
      <Camera zoom={1.12-p*.13}>
        <Moon x={966} y={475} r={328} glow={.45}/>
        <g opacity=".18" stroke="#f4ddb2" strokeWidth="2" fill="none">{[378,420,466].map(r=><circle key={r} cx="966" cy="475" r={r}/>)}</g>
        <Cloud x={390-t*1.8} y={595} scale={1.3} color="#536b7a"/>
        <Cloud x={1570+t*.8} y={688} scale={1.1} color="#748691"/>
        <Waves t={t} beat={beat} base={818} gap={54} count={3} amp={22} colors={['#436d7e','#63929e','#8cb6b2']}/>
        <Boat x={972+drift(t,10)} y={795+drift(t,6)} scale={1.16} angle={drift(t,2)} couple light={1}/>
        <Waves t={t+15} beat={beat} base={961} gap={53} count={2} amp={25} colors={['#9ec4ba','#cad6bf']}/>
        <Dust t={t} count={25}/>
      </Camera>
    </g>
  </>;
};

const Farewell: React.FC<SceneProps> = ({t,p,beat,length}) => {
  const travel=clamp(p/.88);
  const departure=travel*travel*(3-2*travel);
  const endingBeat=6-(length-t)*timeline.bpm/60;
  return <Camera zoom={1-p*.045}>
    <Sky fill="#172c43"/><Stars t={t} beat={beat} count={44} bottom={710}/>
    <Moon x={960} y={392} r={224} glow={1}/>
    <Paper d="M-80 -40 L2000 -40 L2000 1140 L-80 1140 Z M214 1110 Q250 170 960 85 Q1670 170 1716 1110 Z" fill="#10273b"/>
    <path d="M278 1110 Q302 232 960 148 Q1618 232 1642 1110" fill="none" stroke="#426071" strokeWidth="18"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(0 ${ease(endingBeat,i,i+.8)*550})`}><Waves t={t+i*4} beat={beat} base={705+i*62} gap={30} count={1} colors={['#385f75','#568797','#83b4b3'].slice(i)}/></g>)}
    <Boat x={750+departure*210} y={837-departure*436+drift(t,3)*(1-departure)} scale={.88*(1-departure)+.015} angle={drift(t,2)*(1-departure)} couple light={1}/>
    {[3,4,5].map(i=><g key={i} transform={`translate(0 ${ease(endingBeat,i,i+.8)*550})`}><Waves t={t+i*4} beat={beat} base={890+(i-3)*69} gap={30} count={1} colors={['#a1c6bd','#c3d5c0','#e1debf'].slice(i-3)}/></g>)}
    <Dust t={t} count={18}/>
  </Camera>;
};

const scenes=[Launch,Lonely,Thinking,Brave,Passing,Leaving,Gratitude,Together,Farewell];

export const PaperMV: React.FC = () => {
  const frame=useCurrentFrame();
  const seconds=frame/timeline.fps;
  const index=Math.max(0,timeline.shots.findIndex(s=>frame>=s.startFrame&&frame<s.endFrame));
  const shot=timeline.shots[index];
  const t=(frame-shot.startFrame)/timeline.fps;
  const length=(shot.endFrame-shot.startFrame)/timeline.fps;
  const p=clamp(t/length);
  const beat=(seconds-timeline.beatOffset)*timeline.bpm/60;
  const localBeat=t*timeline.bpm/60;
  const Scene=scenes[index];
  const fadeIn=index===0?ease(seconds,0,1.1):1;
  const fadeOut=1-ease(seconds,timeline.duration-1.7,timeline.duration);
  const labelAlpha=ease(t,.3,1.5)*(1-ease(t,Math.min(7,length-2),Math.min(9,length)));
  return <AbsoluteFill style={{background:'#112439'}}>
    {timeline.hasBgm&&<Audio src={staticFile(timeline.bgmFile)} volume={.92}/>}
    <Audio src={staticFile('audio/sfx.wav')} volume={.7}/>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{display:'block'}}>
      <Defs/>
      <g opacity={fadeIn*fadeOut} clipPath="url(#film)">
        <Scene t={t} p={p} beat={beat} localBeat={localBeat} length={length}/>
        <rect width="1920" height="1080" fill="url(#grain)" opacity=".18" pointerEvents="none"/>
        {index===0&&<g opacity={ease(seconds,1,2)*(1-ease(seconds,12,15))} fill="#fff0cf" style={{fontFamily:'Microsoft YaHei, sans-serif'}}>
          <text x="1270" y="605" fontSize="64" letterSpacing="14">等你下课</text>
          <text x="1280" y="651" fontSize="19" letterSpacing="5" opacity=".65">月光，会替我找到你。</text>
        </g>}
        <g opacity={labelAlpha*.8} fill="#f5e7cb" style={{fontFamily:'Microsoft YaHei, sans-serif'}}>
          <text x="104" y="122" fontSize="17" letterSpacing="5">{String(index+1).padStart(2,'0')} / {shot.name}</text>
        </g>
      </g>
      <rect x="18" y="18" width="1884" height="1044" rx="10" fill="none" stroke="#e5d3b5" strokeWidth="24"/>
      <rect x="32" y="32" width="1856" height="1016" rx="5" fill="none" stroke="#ffe8c3" strokeWidth="2" opacity=".3"/>
    </svg>
  </AbsoluteFill>;
};
