import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import timeline from './lyric-timeline.json';
import {Defs, Moon, Paper, Spark, Stars, clamp, ease, hash, pulse} from './art';
import {Alley, Apartment, Bench, Box, Campus, ClockTower, Envelope, Guitar, PassingStudents, Plant, Suitcase, Window, Words, YoungMan, YoungWoman} from './StoryArt';

const smooth=(p:number)=>{const v=clamp(p);return v*v*(3-2*v);};
const mix=(a:number,b:number,p:number)=>a+(b-a)*smooth(p);
type SceneProps={p:number;t:number;beat:number;scene:string};
const Camera:React.FC<{z?:number;x?:number;y?:number;children:React.ReactNode}>=({z=1,x=0,y=0,children})=><g transform={`translate(${960+x} ${540+y}) scale(${z}) translate(-960 -540)`}>{children}</g>;
const Floor:React.FC<{night?:boolean}>=({night=false})=><Paper d="M0 764 L1920 764 L1920 1080 L0 1080 Z" fill={night?'#667574':'#cbbca3'}/>;
const Notes:React.FC<{x:number;y:number;t:number;count?:number}>=({x,y,t,count=5})=><g>{Array.from({length:count},(_,i)=>{
  const age=(t*.38+i*.24)%1;
  return <g key={i} transform={`translate(${x+age*100+i*22} ${y-age*190}) rotate(${-age*18})`} opacity={Math.sin(age*Math.PI)*.7} fill="#bf976b"><ellipse rx="9" ry="6"/><path d="M7 0 L7 -32 L26 -26 L26 6 L22 6 L22 -18 L11 -23 L11 0 Z"/></g>;
})}</g>;

const StreetScene:React.FC<SceneProps>=({p,t,beat,scene})=>{
  const moving=scene==='moving';
  const occupied=moving||scene==='encounter'||scene==='walkingAway'||scene==='outro';
  const night=scene==='walkingAway'||scene==='outro';
  return <Camera z={scene==='intro'?1+p*.05:1.03} x={scene==='moving'?140:scene==='walkingAway'?-100:0} y={scene==='moving'?35:0}>
    <Alley p={p} occupied={occupied} doorOpen={moving?ease(p,.3,.65):0} night={night}/>
    {scene==='intro'&&<>
      <Words x={920} y={184} size={61} color="#4d716f">等你下课</Words>
      <Words x={920} y={240} size={21} color="#73837a">把想说的话，留给你。</Words>
      <YoungWoman x={1470} y={865} scale={.65} walk={beat*2} direction={-1}/>
    </>}
    {scene==='alley'&&<>
      <YoungWoman x={mix(1370,1160,p)} y={mix(837,915,p)} scale={.8} walk={beat*Math.PI} direction={-1}/>
      <YoungMan x={mix(773,982,p)} y={969} scale={.87} walk={beat*Math.PI} pose="carry"/>
    </>}
    {moving&&<g opacity={1-ease(p,.88,1)}>
      <YoungMan x={mix(960,240,p)} y={mix(931,803,p)} scale={mix(.94,.65,p)} walk={beat*Math.PI} pose="carry" direction={-1}/>
      <g transform={`translate(${mix(946,251,p)} ${mix(794,709,p)})`}><circle r="10" fill="none" stroke="#e3bc77" strokeWidth="5"/><path d="M8 5 L27 20 L32 13 M19 14 L24 9" stroke="#e3bc77" strokeWidth="4" fill="none"/></g>
    </g>}
    {scene==='encounter'&&<>
      <YoungMan x={mix(430,1090,p)} y={951} scale={.9} walk={beat*Math.PI} direction={p>.6?-1:1}/>
      <YoungWoman x={mix(1460,490,p)} y={924} scale={.85} walk={beat*Math.PI} direction={-1}/>
      {p>.55&&<Spark x={1082} y={659} r={11} color="#d3af79" opacity={Math.sin(p*Math.PI)}/>}
    </>}
    {scene==='walkingAway'&&<>
      <YoungMan x={mix(690,957,p)} y={mix(1006,711,p)} scale={mix(1,.2,p)} walk={beat*Math.PI} pose="carry" back/>
      <g opacity=".85"><YoungWoman x={1587} y={500} scale={.42} pose="read" direction={-1}/></g>
    </>}
    {scene==='outro'&&<>
      <g opacity={1-ease(p,.1,.45)}><YoungMan x={981} y={700} scale={.19} walk={beat*Math.PI} back pose="carry"/></g>
      <Window x={1275} y={295} w={125} h={164} lit/>
      <Envelope x={1510} y={960} scale={1.05} open={1}/>
      <Stars t={t} beat={beat} bottom={100} count={12}/>
    </>}
  </Camera>;
};

const Memory:React.FC<SceneProps>=({p,t,beat,scene})=>{
  if(scene==='admission')return <Camera z={1+p*.03}>
    <rect width="1920" height="1080" fill="#e8d8bb"/>
    <Paper d="M960 85 L985 980 L955 1100 L933 0 Z" fill="#cbb99d"/>
    <g transform="translate(-115 150) scale(.7)"><Campus/></g>
    <g transform="translate(1030 150) scale(.65)"><Campus/></g>
    <Box x={610} y={390} w={275} h={350} fill="#efe6cc"/><Box x={1040} y={390} w={275} h={350} fill="#faf0d8"/>
    <Words x={748} y={458} size={25} color="#728778">录取通知</Words><Words x={1178} y={458} size={25} color="#8c7970">录取通知</Words>
    {[0,1,2,3].map(i=><path key={i} d={`M662 ${503+i*44} H830 M1090 ${503+i*44} H1260`} stroke="#b7b397" strokeWidth="9" opacity=".6"/>)}
    <YoungMan x={420} y={974} scale={1.05} pose="read" direction={1}/><YoungWoman x={1550} y={955} scale={1.02} pose="read" direction={-1}/>
    <Paper d="M738 753 L788 753 L772 780 L785 800 L741 796 L750 777 Z" fill="#a8937c"/>
  </Camera>;
  return <Camera z={1+p*.08} x={p*-35}>
    <rect width="1920" height="1080" fill="#e2d9bd"/><Floor/>
    <Box x={790} y={140} w={875} h={345} fill="#5f7c70"/><Words x={1215} y={222} size={43}>高中 · 三年</Words>
    <path d="M913 311 H1520 M975 370 H1448" stroke="#eee5c3" strokeWidth="6" opacity=".36"/>
    <Window x={80} y={164} w={464} h={397}/>
    <Plant x={395} y={577} scale={1.2}/>
    <YoungWoman x={1380} y={777} scale={.95} pose="study"/>
    <YoungMan x={557} y={969} scale={1.18} look={.7}/>
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${166+i*362} ${840+(i%2)*90})`}><Box x={-80} y={-90} w={242} h={39} fill="#bca680"/><path d="M-55 -51 L-55 47 M132 -51 L132 47" stroke="#8e8f7b" strokeWidth="13"/></g>)}
    <Envelope x={554} y={809} scale={.76}/>
  </Camera>;
};

const BreakfastWorld:React.FC<SceneProps>=({p,t,beat,scene})=>{
  if(scene==='cooking')return <Camera z={1.04+p*.03}>
    <rect width="1920" height="1080" fill="#cfceb2"/><Window x={1160} y={150} w={380} h={345}/>
    <Box x={120} y={205} w={623} h={85} fill="#809789"/><Words x={430} y={263} size={27}>今天，也想把早餐做好。</Words>
    <YoungMan x={929} y={894} scale={1.6} pose="apron"/>
    <Box x={60} y={765} w={1800} h={315} fill="#ba9b75"/>
    <Box x={47} y={741} w={1826} h={46} fill="#e4d1ac"/>
    <ellipse cx="691" cy="821" rx="228" ry="79" fill="#5b6462"/>
    <ellipse cx="691" cy="808" rx="198" ry="60" fill="#354e50"/>
    <path d="M863 833 L1080 868" stroke="#536769" strokeWidth="36" strokeLinecap="round"/>
    <ellipse cx="690" cy="803" rx={148*ease(p,.12,.52)} ry={44*ease(p,.12,.52)} fill="#efd79c"/>
    <ellipse cx="686" cy="799" rx={96*ease(p,.15,.5)} ry={27*ease(p,.15,.5)} fill="#e7b86d"/>
    <g transform={`translate(${mix(1080,812,p)} ${mix(685,760,p)}) rotate(${mix(-29,12,p)})`}>
      <path d="M10 -24 L103 -8 L101 40 L14 36 L-14 20 Z" fill="#e7b890"/>
      <path d="M98 -17 L157 -5 L157 53 L99 41 Z" fill="#a96054"/>
      <path d="M10 18 L-151 28" fill="none" stroke="#6e7d70" strokeWidth="13" strokeLinecap="round"/>
      <path d="M-184 6 L-133 6 L-133 45 L-184 45 Z" fill="#b2b9a1"/>
    </g>
    {[0,1,2].map(i=><path key={i} d={`M${628+i*59} 732 Q${611+i*59} 681 ${637+i*59} 644`} stroke="#f4e7c7" strokeWidth="5" fill="none" opacity={.3+.2*Math.sin(t*2+i)}/>)}
    <Paper d="M1363 789 L1598 789 L1634 1020 L1320 1020 Z" fill="#e9c99c"/>
    <path d="M1408 792 Q1407 729 1474 729 Q1548 729 1552 792" fill="none" stroke="#ae9371" strokeWidth="9"/>
    <g opacity={ease(p,.57,.83)}><ellipse cx="1480" cy="852" rx="85" ry="34" fill="#f0d49b"/><Paper d="M1389 860 L1481 819 L1568 860 L1479 893 Z" fill="#d9b776"/></g>
    <ellipse cx="285" cy="894" rx="76" ry="27" fill="#b5c2aa"/><ellipse cx="285" cy="879" rx="71" ry="26" fill="#eee0c0"/><path d="M291 850 L276 813" stroke="#ddbd90" strokeWidth="30" strokeLinecap="round"/>
  </Camera>;
  if(scene==='headphones')return <Camera z={1+p*.06}>
    <Campus/><PassingStudents t={t} beat={beat} count={6}/>
    <YoungWoman x={mix(1380,590,p)} y={936} scale={1.15} walk={beat*Math.PI} direction={-1} headphones/>
    <YoungMan x={mix(502,1050,p)} y={977} scale={1.16} walk={beat*Math.PI} direction={p>.6?-1:1}/>
    <g opacity={1-ease(p,.5,.9)}><Notes x={1260} y={626} t={t} count={3}/></g>
  </Camera>;
  return <Camera z={1+p*.035}>
    <rect width="1920" height="1080" fill="#d6dac4"/>
    <Box x={1180} y={100} w={650} h={652} fill="#cfc5a8"/>
    <Words x={1500} y={161} size={32} color="#637c73">学生宿舍</Words>
    {Array.from({length:6},(_,i)=><Window key={i} x={1230+(i%3)*190} y={212+Math.floor(i/3)*227} w={121} h={161}/>)}
    <Box x={100} y={270} w={868} h={551} fill="#cfad8e"/>
    <Box x={99} y={250} w={879} h={93} fill="#72958a"/><Words x={536} y={312} size={38}>巷口早餐</Words>
    <Paper d="M59 342 L1000 342 L1036 441 L18 441 Z" fill="#e7cfab"/>
    {Array.from({length:8},(_,i)=><path key={i} d={`M${60+i*120} 343 L${119+i*120} 343 L${133+i*120} 442 L${47+i*120} 442 Z`} fill="#c78170"/>) }
    <Box x={190} y={470} w={366} h={248} fill="#688580"/><Box x={610} y={463} w={232} h={342} fill="#768f86"/>
    <Floor/><YoungMan x={726} y={887} scale={.91} pose="apron"/>
    <Box x={158} y={785} w={766} h={154} fill="#c19f7b"/><Box x={145} y={771} w={792} h={37} fill="#ead7b2"/>
    <Box x={425} y={718} w={115} h={58} fill="#e4c49a"/><path d="M448 724 Q475 679 513 724" fill="none" stroke="#a68a6c" strokeWidth="6"/>
    <YoungWoman x={scene==='job'?1430:mix(1250,1960,p)} y={1000} scale={1.1} walk={beat*Math.PI} direction={1} headphones={scene==='breakfast'}/>
    {scene==='breakfast'&&<Words x={520} y={990} size={26} color="#f4e4c4">那份早餐，留在了柜台。</Words>}
    <Plant x={1020} y={827} scale={1.25}/>
  </Camera>;
};

const LetterDesk:React.FC<SceneProps>=({p,t,beat,scene})=>{
  const packed=scene==='interlude';
  return <Camera z={1+p*.035} x={scene==='letterClose'?130:0}>
    <rect width="1920" height="1080" fill="#826f65"/>
    <Box x={70} y={160} w={1770} h={846} fill="#bb9875"/>
    <path d="M160 165 V1000 M1660 165 V1000 M72 850 H1840" stroke="#d6b48a" strokeWidth="4" opacity=".45"/>
    <g transform="translate(140 190) rotate(-9)"><Box x={0} y={0} w={288} h={370} fill="#729187"/><Words x={147} y={155} size={39}>旧课本</Words><path d="M41 201 H247 M41 241 H247" stroke="#e5d0a8" strokeWidth="5"/></g>
    <g transform={`translate(716 271) rotate(${scene==='letterClose'?-3:4})`}>
      <Box x={0} y={0} w={583} h={665} fill="#f8e9c8"/>
      <Words x={136} y={107} size={32} color="#777965">给你：</Words>
      {Array.from({length:7},(_,i)=><path key={i} d={`M65 ${173+i*55} H${65+(390+hash(i)*48)*clamp((p*9-i)/2)}`} fill="none" stroke="#788071" strokeWidth="6" strokeLinecap="round" opacity=".8"/>)}
      <path d="M400 610 C385 589 373 605 400 630 C428 605 414 589 400 610" fill="#b8796c" opacity={ease(p,.6,.9)}/>
    </g>
    <g transform={`translate(${865+Math.min(1,p*2)*310} ${441+Math.floor(p*5)*49}) rotate(-33)`} opacity={packed?0:1-ease(p,.84,1)}>
      <path d="M-17 -23 L83 -13 L122 12 L78 62 L-16 44 Z" fill="#e8b88c"/>
      <path d="M-37 -29 L17 -24 L6 54 L-46 57 Z" fill="#af6358"/>
      <path d="M15 9 L-67 -74" stroke="#6d806f" strokeWidth="10"/><path d="M-68 -75 L-77 -89 L-82 -79 Z" fill="#564b41"/>
    </g>
    <Envelope x={1550} y={741} scale={2.3} open={packed?0:ease(p,.8,1)}/>
    <g transform="translate(1475 277)"><path d="M0 0 L68 0 L110 112 L-42 112 Z" fill="#e7c590"/><path d="M35 112 V233" stroke="#586e69" strokeWidth="13"/><ellipse cx="35" cy="244" rx="62" ry="13" fill="#6e7d6d"/><circle cx="33" cy="105" r="132" fill="url(#lampGlow)" opacity=".31"/></g>
    {packed&&<Guitar x={1459} y={405} scale={1.48}/>}
  </Camera>;
};

const FieldWorld:React.FC<SceneProps>=({p,t,beat,scene})=>{
  const reverse=scene==='fieldReverse';
  const close=scene==='classroomReverse';
  return <Camera z={close?1.25+p*.045:1+p*.025} x={close?-170:0} y={close?65:0}>
    <rect width="1920" height="1080" fill="#18384e"/><Stars t={t} beat={beat} count={54} bottom={435}/><Moon x={390} y={227} r={97} glow={.4}/>
    <g transform={reverse?'translate(-300 224) scale(.8)':'translate(0 150) scale(1 .74)'}><Campus night reverse={reverse||close} sky={false}/></g>
    <Paper d="M0 806 Q600 650 1920 810 L1920 1080 L0 1080 Z" fill="#749681"/>
    <Paper d="M-120 907 Q723 708 2000 901 L2000 965 Q550 800 -120 981 Z" fill="#b49380"/>
    <path d="M0 934 Q795 764 1920 925 M0 952 Q795 785 1920 947" fill="none" stroke="#e0cbb0" strokeWidth="3" opacity=".65"/>
    <g transform={`translate(${reverse?850:910} ${reverse?788:897}) rotate(-90)`}><YoungMan x={0} y={0} scale={reverse?.39:.82} pose="normal"/></g>
    {!reverse&&<Box x={635} y={864} w={85} h={61} fill="#72867b" radius={12}/>}
    {scene==='field'&&<g opacity=".85"><YoungWoman x={1100} y={577} scale={.23} pose="study"/></g>}
    {reverse&&<>
      <Box x={0} y={0} w={135} h={1080} fill="#bfa683"/><Box x={1600} y={0} w={320} h={1080} fill="#d4bea0"/>
      <Box x={40} y={59} w={1760} h={68} fill="#e6d0af"/><Box x={68} y={848} w={1791} h={78} fill="#e1c19a"/>
      <YoungWoman x={1610} y={953} scale={1.55} direction={-1} pose="study"/>
      <path d="M123 500 H1580" stroke="#d8c09d" strokeWidth="22"/>
    </>}
    {close&&<>
      <Plant x={187} y={1010} scale={2.7}/><Plant x={1505} y={1050} scale={3.8}/>
      <Window x={985} y={487} w={86} h={84} lit/><YoungWoman x={1027} y={566} scale={.23} pose="study"/>
    </>}
  </Camera>;
};

const Classroom:React.FC<SceneProps>=({p,t,beat})=><Camera z={1.02+p*.05} x={-p*50}>
  <rect width="1920" height="1080" fill="#d3c6a6"/><Floor night/>
  <Box x={76} y={116} w={739} h={651} fill="#9ba998"/><rect x="95" y="138" width="700" height="583" fill="#24455c"/>
  <Stars t={t} beat={beat} count={12} bottom={560}/>
  <Paper d="M99 588 Q422 449 792 605 L792 722 L99 722 Z" fill="#71917b"/>
  <g transform="translate(460 592) rotate(-90)"><YoungMan x={0} y={0} scale={.23}/></g>
  <path d="M460 127 V738 M90 466 H805" stroke="#bdc2a7" strokeWidth="17"/>
  <YoungWoman x={1345} y={938} scale={1.45} pose="study" direction={-1}/>
  <Box x={971} y={803} w={669} h={57} fill="#b59c79"/><path d="M1044 858 V1050 M1550 858 V1050" stroke="#818b79" strokeWidth="24"/>
  <Box x={1030} y={766} w={164} h={31} fill="#d1d6b8"/>
  <Box x={996} y={131} w={710} h={198} fill="#6c887a"/><Words x={1345} y={229} size={31}>晚自习</Words>
  <path d="M1077 274 H1607" stroke="#e8dcc0" strokeWidth="4" opacity=".45"/>
</Camera>;

const WaitingWorld:React.FC<SceneProps>=({p,t,beat,scene})=>{
  const imagined=scene==='mailbox';
  return <Camera z={1+p*.025}>
    <Campus night={scene==='waitingAgain'}/>
    <Bench x={730} y={900} scale={1.22}/>
    {!imagined&&<YoungMan x={649} y={919} scale={1.03} pose={scene==='hesitation'?'read':'normal'} direction={1}/>}
    {scene==='calendar'&&<>
      <g transform={`translate(1410 240) rotate(${Math.sin(t*.5)*2})`}><Box x={-164} y={-100} w={328} h={385} fill="#f0e0bd"/><Box x={-164} y={-100} w={328} h={88} fill="#b97869"/><Words x={0} y={-41} size={30}>等候的日子</Words><Words x={0} y={150} size={116} color="#758478">{String(1+Math.floor(p*25)).padStart(2,'0')}</Words></g>
      <rect width="1920" height="1080" fill="#749ca0" opacity={.18*(.5+.5*Math.sin(p*8*Math.PI))}/>
    </>}
    {scene==='hesitation'&&<>
      <YoungWoman x={1430} y={897} scale={.95} walk={beat*Math.PI} direction={-1}/>
      <YoungWoman x={1660} y={930} scale={.92} direction={-1}/>
      <g opacity={1-ease(p,.3,.85)}><Envelope x={716} y={775} scale={.85}/></g>
      <PassingStudents t={t} beat={beat} count={6}/>
    </>}
    {imagined&&<>
      <rect width="1920" height="1080" fill="#c6c3b5" opacity=".19"/>
      <Box x={1381} y={592} w={176} h={224} fill="#699086"/><Words x={1467} y={639} size={24}>信箱</Words><path d="M1407 669 H1534" stroke="#405f5f" strokeWidth="14"/>
      <YoungMan x={mix(1076,1205,p)} y={948} scale={1.08} pose="carry" direction={1}/>
      <Envelope x={mix(1098,1460,p)} y={mix(760,660,p)} scale={.8} open={0}/>
      <Words x={950} y={171} size={23} color="#5c7a70">他想：等你读到，也许我已经走远。</Words>
    </>}
    {scene==='waitingAgain'&&<>
      <Window x={1360} y={386} w={155} h={176} lit/>
      <YoungWoman x={1441} y={540} scale={.4} direction={-1}/>
      <Moon x={510} y={190} r={75} glow={.3}/>
    </>}
  </Camera>;
};

const SquareWorld:React.FC<SceneProps>=({p,t,beat,scene})=>{
  const playing=['guitar','unnoticed','distance','crowd','passing','turnback'].includes(scene);
  const unnoticed=scene==='unnoticed'||scene==='distance';
  const turnback=scene==='turnback';
  return <Camera z={scene==='guitar'?1.12:1+p*.035} x={scene==='distance'?p*80:0}>
    <rect width="1920" height="1080" fill="#d0d6be"/>
    <g transform="translate(-430 150) scale(.86 .75)"><Campus/></g>
    <ClockTower x={1510} y={628} beat={scene==='bell'?beat:0}/>
    <Paper d="M-100 898 Q400 701 2010 785 L2010 1100 L-100 1100 Z" fill="#c5b89e"/>
    <path d="M70 1080 L575 773 M1010 1080 L983 773 M1590 1080 L1290 773" stroke="#e8dec4" strokeWidth="3" opacity=".6"/>
    <Bench x={611} y={929} scale={1.04}/>
    {['bell','crowd','passing'].includes(scene)&&<PassingStudents t={t} beat={beat} count={scene==='crowd'?18:12}/>}
    <YoungMan x={633} y={956} scale={1.14} pose={playing?'guitar':'normal'} walk={playing?(turnback&&p>.42?0:beat*Math.PI):0}/>
    {playing&&!unnoticed&&!(turnback&&p>.42)&&<Notes x={741} y={733} t={t} count={5}/>}
    {unnoticed&&<>
      <YoungWoman x={mix(1130,1790,p)} y={918} scale={.94} walk={beat*Math.PI} direction={1} headphones/>
      <Notes x={743} y={752} t={t} count={3}/>
      <Paper d="M958 735 L972 739 L1002 838 L981 840 Z" fill="#8a9b8c" opacity={ease(p,.35,.7)*.6}/>
    </>}
    {scene==='crowd'&&<YoungWoman x={mix(1510,1040,p)} y={832} scale={.8} walk={beat*Math.PI} direction={-1}/>}
    {scene==='passing'&&<YoungWoman x={mix(1700,1010,p)} y={931} scale={1.03} walk={beat*Math.PI} direction={-1} headphones/>}
    {turnback&&<>
      <YoungWoman x={mix(1020,1110,Math.min(p,.4)*2.5)} y={913} scale={1.13} walk={p<.4?beat*Math.PI:0} direction={p>.36?-1:1} look={p>.36?.6:0}/>
      <g opacity={ease(p,.38,.65)}><Spark x={913} y={601} r={17} color="#e6b984"/></g>
    </>}
    {scene==='bell'&&<><path d="M1560 563 Q1650 608 1550 659 M1594 540 Q1727 605 1590 687" fill="none" stroke="#e6d3aa" strokeWidth="8" opacity={.2+.45*pulse(beat)}/><YoungWoman x={mix(1060,1300,p)} y={834} scale={.65} walk={beat*Math.PI}/></>}
    <Plant x={1800} y={993} scale={2.4}/>
  </Camera>;
};

const Packing:React.FC<SceneProps>=({p,t,beat})=><Camera z={1+p*.04}>
  <rect width="1920" height="1080" fill="#d3c3a4"/><Floor/>
  <Window x={1073} y={173} w={493} h={387} lit/>
  <Box x={150} y={220} w={670} h={293} fill="#aa9477"/><Box x={179} y={248} w={612} h={249} fill="#e1d5b5"/>
  <Words x={483} y={389} size={25} color="#7a8572">一间住过的公寓</Words>
  <YoungMan x={1050} y={961} scale={1.35} pose="carry" direction={-1}/>
  <Suitcase x={1293} y={946} scale={1.9} open={1-ease(p,.2,.7)}/>
  <Guitar x={1720} y={838} scale={1.37}/>
  <Box x={100} y={792} w={604} h={67} fill="#b69a76"/><path d="M161 858 V1080 M637 858 V1080" stroke="#8d8973" strokeWidth="26"/>
  <Envelope x={418} y={751} scale={1.32}/><Box x={154} y={729} w={119} h={43} fill="#7e9989"/>
  <Plant x={1547} y={587} scale={.9}/>
</Camera>;

const Reading:React.FC<SceneProps>=({p,t,beat})=><Camera z={1+p*.07}>
  <rect width="1920" height="1080" fill="#deceb0"/>
  <Box x={125} y={100} w={1090} h={632} fill="#9da598"/><rect x="148" y="126" width="1044" height="585" fill="#345365"/>
  <g transform="translate(-340 256) scale(.75)"><Alley p={p} occupied night/></g>
  <path d="M659 108 V736 M146 417 H1197" stroke="#ccc2a4" strokeWidth="23"/>
  <YoungWoman x={1410} y={977} scale={1.74} direction={-1} pose={p>.25?'read':'normal'} look={p>.6?-.4:0}/>
  <Box x={336} y={838} w={1030} h={73} fill="#b89a75"/><path d="M432 911 V1080 M1274 911 V1080" stroke="#8c8b74" strokeWidth="23"/>
  <Envelope x={813} y={792} scale={1.54} open={ease(p,.1,.45)}/>
  <Plant x={392} y={784} scale={1.33}/>
</Camera>;

const Scene:React.FC<SceneProps>=(props)=>{
  const k=props.scene;
  if(['intro','alley','moving','encounter','walkingAway','outro'].includes(k))return <StreetScene {...props}/>;
  if(['school','admission'].includes(k))return <Memory {...props}/>;
  if(['job','cooking','breakfast','headphones'].includes(k))return <BreakfastWorld {...props}/>;
  if(['writing','letterClose','interlude'].includes(k))return <LetterDesk {...props}/>;
  if(['field','fieldReverse','classroomReverse'].includes(k))return <FieldWorld {...props}/>;
  if(k==='classroom')return <Classroom {...props}/>;
  if(['calendar','hesitation','mailbox','waitingAgain'].includes(k))return <WaitingWorld {...props}/>;
  if(k==='packing')return <Packing {...props}/>;
  if(k==='reading')return <Reading {...props}/>;
  return <SquareWorld {...props}/>;
};

export const LyricsMV:React.FC=()=>{
  const frame=useCurrentFrame();
  const cue=timeline.cues.find(c=>frame>=c.startFrame&&frame<c.endFrame)||timeline.cues[timeline.cues.length-1];
  const chapter=timeline.chapters.find(c=>frame>=c.startFrame&&frame<c.endFrame)||timeline.chapters[8];
  const t=(frame-cue.startFrame)/timeline.fps;
  const length=(cue.endFrame-cue.startFrame)/timeline.fps;
  const p=clamp(t/length);
  const beat=(frame/timeline.fps-timeline.beatOffset)*timeline.bpm/60;
  const alpha=ease(frame/timeline.fps,0,1.2)*(1-ease(frame/timeline.fps,timeline.duration-2.3,timeline.duration));
  const titleAlpha=ease(t,.15,.55)*(1-ease(t,Math.min(3,length-.6),Math.min(4,length)));
  return <AbsoluteFill style={{background:'#243d4a'}}>
    <Audio src={staticFile(timeline.bgmFile)} volume={.92}/>
    <Audio src={staticFile('audio/lyric-sfx.wav')} volume={.55}/>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <Defs/>
      <g opacity={alpha} clipPath="url(#film)">
        <Scene scene={cue.key} p={p} t={t} beat={beat}/>
        <rect width="1920" height="1080" fill="url(#grain)" opacity=".13"/>
        {cue.key!=='intro'&&<g opacity={titleAlpha*.7}><Box x={64} y={57} w={400} h={69} fill="#e9dabb" radius={9}/><Words x={262} y={101} size={22} color="#5f776e">{String(chapter.id).padStart(2,'0')} · {cue.label}</Words></g>}
      </g>
      <rect x="18" y="18" width="1884" height="1044" rx="10" fill="none" stroke="#e6d5b5" strokeWidth="24"/>
      <rect x="32" y="32" width="1856" height="1016" rx="5" fill="none" stroke="#fff0ce" strokeWidth="2" opacity=".4"/>
    </svg>
  </AbsoluteFill>;
};
