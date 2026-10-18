/* Quantum Atlas v12: interactive 3D model of a superconducting quantum computer (dilution refrigerator).
   three.js is loaded on demand: local copy first, then CDN. No build step. Quantura Technologies */
(function(){const PARTS=window.QA10_PARTS||[],BY={};PARTS.forEach(p=>BY[p.id]=p);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let root=null,eng=null,booting=false,isOpen=false,pinned=null,hoverId=null,hideT=0;
const SRC=()=>{const l=[],ts=document.getElementById('three-src');if(ts){try{l.push(URL.createObjectURL(new Blob([ts.textContent],{type:'text/javascript'})))}catch(e){}}if(location.protocol!=='file:')l.push(new URL('assets/vendor/three.module.min.js',document.baseURI).href);l.push('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js','https://unpkg.com/three@0.160.0/build/three.module.min.js');return l};
async function loadThree(){let err;for(const u of SRC()){try{return await import(u)}catch(e){err=e}}throw err||new Error('three.js not found')}
const LABELS=[['plate300'],['plate50'],['plate4'],['plateStill'],['plateCP'],['plateMXC'],['pulseTube'],['stillLine'],['still'],['hex'],['mxc'],['coaxIn'],['atten'],['hemt'],['coaxOut'],['dcLines'],['circ'],['twpa'],['magShield'],['feed'],['chip','near'],['qubits','near'],['resonators','near'],['electronics'],['clamps'],['sensors'],['coldFinger','near'],['package','near'],['ovc','shell'],['shield50','shell'],['shield4','shell'],['shieldStill','shell']];
function shell(){root=document.createElement('div');root.id='hw10';root.setAttribute('role','region');root.setAttribute('aria-label','Hardware: 3D quantum computer');
 root.innerHTML=`<div class="stage"><canvas class="gl" tabindex="0" aria-label="3D model of a superconducting quantum computer"></canvas></div><div class="labels"></div>
<div class="hbar"><button type="button" class="back">← Main menu</button><h2><small>Hardware</small>Inside a quantum computer</h2></div>
<div class="tools" role="toolbar" aria-label="3D view tools">
<button type="button" data-t="parts" aria-pressed="false"><span class="ic">☰</span>Parts</button>
<button type="button" data-t="labels" aria-pressed="true"><span class="ic">🏷</span>Labels</button>
<button type="button" data-t="explode" aria-pressed="false"><span class="ic">↕</span>Explode</button>
<button type="button" data-t="stages" aria-pressed="false"><span class="ic">🌡</span>Stages</button>
<button type="button" data-t="signal" aria-pressed="false"><span class="ic">〰</span>Signal path</button>
<button type="button" data-t="flow" aria-pressed="false"><span class="ic">❄</span>Helium flow</button>
<button type="button" data-t="shields" aria-pressed="false"><span class="ic">◎</span>Shields</button>
<button type="button" data-t="chip" aria-pressed="false"><span class="ic">▦</span>Chip close-up</button>
<button type="button" data-t="rotate" aria-pressed="false"><span class="ic">⟳</span>Auto-rotate</button>
<button type="button" data-t="theory" aria-pressed="false"><span class="ic">📘</span>How it works</button>
<button type="button" data-t="reset"><span class="ic">⌖</span>Reset view</button></div>
<div class="dock11">
<section class="stg11" aria-label="Temperature stages"><header><b>Temperature stages</b><button type="button" class="x" aria-label="Close temperature stages">✕</button></header>
<div class="stgnow"><span class="sn">Top plate</span><span class="st">300 K</span></div>
<div class="therm" aria-hidden="true"><i></i><span>300 K</span><span>50 K</span><span>4 K</span><span>1 K</span><span>100 mK</span><span>10 mK</span></div>
<label class="rg"><span>Stage</span><input type="range" class="srange" min="0" max="5" step="1" value="0" aria-label="Temperature stage"></label>
<label class="rg"><span>Spacing</span><input type="range" class="xrange" min="0" max="100" step="1" value="0" aria-label="Spacing between stages"></label>
<p class="sdesc"></p></section>
<section class="sig11" aria-label="Signal path" aria-live="polite"><header><b>Signal path</b><span class="sstep"></span><button type="button" class="pp">Pause</button><button type="button" class="x" aria-label="Close signal path">✕</button></header>
<h4 class="stt"></h4><p class="stx"></p><div class="sbar"><i></i></div><div class="slg"><span class="li">Control pulse going down</span><span class="lo">Readout signal coming up</span></div></section>
<section class="flw11" aria-label="Helium flow"><header><b>Helium flow</b><button type="button" class="x" aria-label="Close helium flow">✕</button></header>
<div class="fwrap"><canvas class="mxcv" width="420" height="300" aria-label="Inside the mixing chamber: helium-3 atoms cross from the helium-3 rich layer into the helium-4 rich layer"></canvas>
<div class="ftx"><h4>Inside the mixing chamber</h4><p>Below about 0.87 K, a helium-3 and helium-4 mix splits into two layers, like oil on water. The top layer is almost pure helium-3. The bottom layer is helium-4 with about 6.6% helium-3.</p><p>Helium-3 atoms crossing down into the bottom layer take heat with them, a bit like sweat evaporating. This cools the mixing chamber, typically to 7–20 mK.</p>
<h4>The full loop</h4><ol class="fl11"><li><b>Still (~0.8 K):</b> heat and pumping boil mostly helium-3 out of the dilute mix (it evaporates far more easily than helium-4).</li><li><b>Room-temperature pumps</b> push the gas back into the fridge.</li><li><b>Condensing line:</b> the gas is cooled by the pulse tube at 4 K and turned back into liquid.</li><li><b>Heat exchangers:</b> the returning liquid is pre-cooled by the cold outgoing mix.</li><li><b>Mixing chamber:</b> helium-3 crosses the boundary and absorbs heat. Then the loop repeats.</li></ol>
<p class="typ11">Cooling power drops fast with temperature (about ∝ T²): typical fridges give roughly 10–20 µW at 20 mK and a few hundred µW at 100 mK. Values vary by model.</p></div></div>
<div class="slg"><span class="h3">Helium-3 going down (liquid)</span><span class="h4">Dilute mix going up</span><span class="hg">Helium-3 gas pumped out</span></div></section>
</div>
<section class="th11" role="dialog" aria-label="How a superconducting quantum computer works"><header><h3>How it works</h3><button type="button" class="x" aria-label="Close">✕</button></header><div class="thtabs" role="tablist"></div><div class="thbody"></div></section>
<aside class="info empty" aria-live="polite" aria-label="Part details"><header><div style="flex:1"><h3></h3><span class="tag"></span><span class="pin"></span></div><button type="button" class="x" aria-label="Close details">✕</button></header><div class="body"></div><div class="nav"><button type="button" class="prev" aria-label="Previous part">←</button><button type="button" class="foc">⌖ Zoom to part</button><button type="button" class="next" aria-label="Next part">→</button></div></aside>
<section class="plist" aria-label="All parts"><header><b>All parts (${PARTS.length})</b><button type="button" class="x" aria-label="Close parts list">✕</button></header><input type="search" placeholder="Find a part…" aria-label="Find a part" autocomplete="off" spellcheck="false"><ul></ul></section>
<section class="chip10" role="dialog" aria-label="Chip close-up"><header><h3>Chip close-up: 16 qubits</h3><button type="button" class="x" aria-label="Close chip close-up">✕</button></header>
<div class="cw"><div><canvas class="chipcv" width="560" height="560" aria-label="Qubit chip with 16 qubits"></canvas><p style="margin:6px 0 0;font-size:.85rem;color:var(--mut)">Crosses are transmon qubits; each has a Josephson junction (yellow). Blue bars are tunable couplers that switch two-qubit gates on and off. Each qubit has a meandered readout resonator next to a shared feedline, and a drive line for microwave pulses. Bond wires join the chip pads to the circuit board. Real layouts differ by vendor (square grid, heavy-hex, etc.). <button type="button" class="lblt" style="margin-left:6px">Hide labels</button></p></div>
<div class="qinfo"><h4 class="qn" style="margin:0;font-size:1.1rem">Qubit Q0</h4><canvas class="bloch" width="300" height="300" style="max-width:260px;margin:6px auto;background:transparent"></canvas><p class="qs"></p>
<div class="qb"><button type="button" data-g="X">X</button><button type="button" data-g="H">H</button><button type="button" data-g="Z">Z</button><button type="button" data-g="S">S</button><button type="button" data-g="M" class="pri">Measure</button><button type="button" data-g="R">Reset</button></div><div class="qres" aria-live="polite"></div>
<p>The arrow on the sphere shows the qubit's state. Top is |0⟩, bottom is |1⟩. Gates are microwave pulses that turn the arrow. Measuring gives 0 or 1 at random and the arrow jumps to that pole.</p></div></div></section>
<div class="loading10"><div><i></i>Loading 3D model…</div></div>
<div class="fallback"><div class="fb"><h3 style="margin-top:0">The 3D view could not start</h3><p class="why">It needs WebGL and, the first time, an internet connection to load the 3D engine.</p><div class="btns"><button type="button" class="retry pri">Try again</button></div><p style="margin-bottom:0">You can still read about every part:</p><div class="fbl"></div></div></div>`;
 document.body.appendChild(root);
 const info=$('.info',root),pl=$('.plist',root),ul=$('ul',pl),inp=$('input',pl);
 // parts list
 const drawList=()=>{const q=inp.value.trim().toLowerCase();let g='',h='';PARTS.forEach(p=>{if(q&&!(p.name+' '+p.g+' '+p.what).toLowerCase().includes(q))return;if(p.g!==g){g=p.g;h+=`<li class="g">${esc(g)}</li>`}h+=`<li><button type="button" data-id="${p.id}" class="${p.id===pinned?'on':''}">${esc(p.name)}<small>${esc(p.temp.split('(')[0].trim())}</small></button></li>`});ul.innerHTML=h||'<li style="padding:10px;color:var(--mut)">No part matches.</li>'};
 inp.addEventListener('input',drawList);drawList();root._drawList=drawList;
 ul.addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;select(b.dataset.id,true);if(innerWidth<820)togglePanel('parts',false)});
 $('.x',pl).onclick=()=>togglePanel('parts',false);
 $('.fbl',root).innerHTML=PARTS.map(p=>`<button type="button" data-id="${p.id}">${esc(p.name)}</button>`).join('');
 $('.fbl',root).addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)select(b.dataset.id,false)});
 $('.retry',root).onclick=()=>{root.classList.remove('nogl');boot()};
 $('.back',root).onclick=()=>window.QA10?window.QA10.go('home'):(location.hash='#home');
 $('.x',info).onclick=()=>{pinned=null;eng&&eng.glow();renderInfo(null);root._drawList()};
 $('.prev',info).onclick=()=>step(-1);$('.next',info).onclick=()=>step(1);$('.foc',info).onclick=()=>{const id=info.dataset.id;if(id&&eng)eng.focus(id)};
 $$('.tools button',root).forEach(b=>b.onclick=()=>tool(b.dataset.t,b));
 if(innerWidth<820)setPressed('labels',false),root.classList.add('nolabels');
 // chip panel
 $('.chip10 .x',root).onclick=()=>togglePanel('chip',false);
 chipUI();stagesUI();sigUI();$('.flw11 .x',root).onclick=()=>setFlow(false);window.QA11T&&window.QA11T.mount($('.th11',root),{play:()=>{togglePanel('theory',false);setSignal(true)}});$('.th11 .x',root).onclick=()=>togglePanel('theory',false);
 document.addEventListener('keydown',e=>{if(!isOpen||e.key!=='Escape')return;if($('.th11',root).classList.contains('on'))togglePanel('theory',false);else if($('.chip10',root).classList.contains('on'))togglePanel('chip',false);else if(pl.classList.contains('on'))togglePanel('parts',false);else if(pinned){$('.x',info).click()}});
}
function setPressed(t,on){const b=$(`.tools [data-t=${t}]`,root);if(b)b.setAttribute('aria-pressed',on?'true':'false')}
function togglePanel(t,on){if(t==='parts'){const pl=$('.plist',root);pl.classList.toggle('on',on);setPressed('parts',on);if(on){root._drawList();if(innerWidth>=820)setTimeout(()=>$('input',pl).focus(),30)}}
 if(t==='chip'){$('.chip10',root).classList.toggle('on',on);setPressed('chip',on);if(on){drawChip();drawBloch();togglePanel('theory',false)}}
 if(t==='theory'){$('.th11',root).classList.toggle('on',on);setPressed('theory',on);if(on&&$('.chip10',root).classList.contains('on'))togglePanel('chip',false)}
 if(t==='stages'){$('.stg11',root).classList.toggle('on',on);setPressed('stages',on);if(on){if(innerWidth<820)setSignal(false);stageTo(+$('.srange',root).value)}}}
function tool(t,b){if(eng&&eng.kick)setTimeout(()=>eng.kick(),0);const on=b.getAttribute('aria-pressed')!=='true';
 if(t==='parts')return togglePanel('parts',on);
 if(t==='labels'){setPressed(t,on);root.classList.toggle('nolabels',!on);return}
 if(t==='chip'){togglePanel('chip',on);if(on){eng&&eng.focus('chip');select('chip',false,true)}return}
 if(t==='reset'){eng&&eng.reset();return}
 if(t==='stages'||t==='theory')return togglePanel(t,on);
 if(t==='signal')return setSignal(on);
 if(t==='flow')return setFlow(on);
 if(!eng)return;setPressed(t,on);
 if(t==='explode'){eng.explode(on);$('.xrange',root).value=on?100:0}if(t==='shields')eng.shields(on);if(t==='rotate')eng.auto(on)}
function step(d){const id=$('.info',root).dataset.id;let i=PARTS.findIndex(p=>p.id===id);i=(i+d+PARTS.length)%PARTS.length;select(PARTS[i].id,true)}
function select(id,focus,noFocus){pinned=id;renderInfo(id,true);if(eng){if(/^(ovc|shield)/.test(id)&&!eng.shieldsOn){eng.shields(true);setPressed('shields',true)}eng.glow();if(focus&&!noFocus)eng.focus(id)}root._drawList&&root._drawList()}
function renderInfo(id,isPin){const info=$('.info',root);if(!id){info.classList.add('empty');info.dataset.id='';$$('.lb',root).forEach(l=>l.classList.remove('on'));return}
 const p=BY[id];if(!p)return;info.dataset.id=id;info.classList.remove('empty');$('h3',info).textContent=p.name;$('.tag',info).textContent='🌡 '+p.temp+(/K/.test(p.temp)&&!/room/i.test(p.temp)?' (typical)':'');$('.pin',info).textContent=isPin?'📌 pinned':'';
 $('.body',info).innerHTML=`<h4>What it is</h4><p>${esc(p.what)}</p><h4>What it does</h4><p>${esc(p.does)}</p><h4>Why it is needed</h4><p>${esc(p.why)}</p><div class="fact">💡 ${esc(p.fact)}</div><p class="typ11">ⓘ Typical values for a superconducting-qubit dilution refrigerator; real systems vary by device.</p>`;$('.body',info).scrollTop=0;
 $$('.lb',root).forEach(l=>l.classList.toggle('on',l.dataset.id===id))}
function onHover(id){if(id===hoverId)return;hoverId=id;clearTimeout(hideT);if(eng)eng.glow();
 if(id)renderInfo(id,id===pinned);else hideT=setTimeout(()=>renderInfo(pinned,!!pinned),500);root.querySelector('canvas.gl').style.cursor=id?'pointer':'grab'}
function onPick(id){if(id){select(id,false)}else if(pinned){/* tap on empty space keeps pin */}}
/* ---------- temperature stages panel ---------- */
const STG=[['plate300','Top plate','300 K','Room temperature. Cables, pumps and the pulse tube enter here.',0],['plate50','50 K plate','50 K','First pulse tube stage. Catches most of the heat coming down.',.2],['plate4','4 K plate','4 K','Second pulse tube stage. Holds the HEMT amplifiers and the first attenuators.',.4],['plateStill','Still plate','about 800 mK','Helium-3 evaporates from the still here. This is the start of the dilution cooling.',.6],['plateCP','Cold plate','about 100 mK','An extra quiet stage between the still and the mixing chamber. More attenuators sit here.',.8],['plateMXC','Mixing chamber plate','about 10 mK','The coldest plate. Helium-3 dissolving into helium-4 absorbs heat. The chip hangs just below.',1]];
function stageTo(i){const s=STG[i],p=$('.stg11',root);$('.sn',p).textContent=s[1];$('.st',p).textContent=s[2];$('.sdesc',p).textContent=s[3];$('.therm i',p).style.top=(s[4]*100)+'%';$$('.therm span',p).forEach((e,k)=>e.classList.toggle('on',k===i));select(s[0],true)}
function stagesUI(){const p=$('.stg11',root);$('.srange',p).oninput=e=>stageTo(+e.target.value);
 $('.xrange',p).oninput=e=>{const v=+e.target.value/100;if(eng){eng.explodeTo(v);setPressed('explode',v>.5)}};$('.x',p).onclick=()=>togglePanel('stages',false)}
/* ---------- signal path caption ---------- */
const SIG=[['electronics','1 · Make the pulse','Room-temperature electronics write a microwave pulse, about 5 GHz and 20 to 50 nanoseconds long. Its shape decides which gate the qubit gets.'],
['coaxIn','2 · Down the input line','The pulse travels down a thin steel or niobium-titanium coax. Thin, poor heat-conducting cable lets the signal through but very little heat.'],
['atten','3 · Attenuators','At 4 K, the cold plate and 10 mK, attenuators cut the power by about 60 dB in total (a million times). This also soaks up thermal noise from the warmer stages.'],
['filters','4 · Filters','Infrared and low-pass filters block stray light and high-frequency noise that could flip a qubit or break Cooper pairs.'],
['qubits','5 · The chip','The pulse reaches the qubit and turns its state. For readout, a weak tone bounces off the qubit\'s readout resonator, and the echo shifts slightly depending on 0 or 1.'],
['circ','6 · Circulators and isolators','The returning echo is sent one way only: up. Noise coming down from the amplifiers is steered into a cold resistor and never reaches the qubit.'],
['twpa','7 · TWPA','A quantum-limited amplifier boosts the signal about 100 times (20 dB) while adding almost no noise of its own.'],
['hemt','8 · HEMT at 4 K','A transistor amplifier boosts it again by about 10,000 times (40 dB). Now the signal is strong enough to travel up the warm cables.'],
['electronics','9 · Back to room temperature','The signal is mixed down, digitised and sorted into 0 or 1 in under a microsecond. Thousands of repeats (shots) give the final answer.']];
let sigOn=false,sigPause=false;
function setSignal(on){sigOn=on;setPressed('signal',on);$('.sig11',root).classList.toggle('on',on);if(on&&innerWidth<820&&$('.stg11',root).classList.contains('on'))togglePanel('stages',false);if(eng)eng.signal(on);if(!on){eng&&eng.sigPart(null)}}
function sigUI(){const p=$('.sig11',root);$('.x',p).onclick=()=>setSignal(false);$('.pp',p).onclick=e=>{sigPause=!sigPause;e.target.textContent=sigPause?'Play':'Pause';eng&&eng.sigPause(sigPause)}}
let sigLast=-1;function sigStep(k,u){const p=$('.sig11',root);$('.sbar i',p).style.width=(u*100).toFixed(1)+'%';if(k===sigLast)return;sigLast=k;const s=SIG[k];$('.stt',p).textContent=s[1];$('.stx',p).textContent=s[2];$('.sstep',p).textContent=(k+1)+' / '+SIG.length;eng&&eng.sigPart(s[0])}
/* ---------- helium flow + mixing chamber canvas ---------- */
let flowOn=false,mxRaf=0;const MXA=[];for(let i=0;i<46;i++)MXA.push({x:Math.random()*380+20,y:Math.random()*110+40,vy:0,top:true});for(let i=0;i<10;i++)MXA.push({x:Math.random()*380+20,y:170+Math.random()*110,top:false});
function setFlow(on){flowOn=on;setPressed('flow',on);$('.flw11',root).classList.toggle('on',on);if(on&&innerWidth<820){if(sigOn)setSignal(false);if($('.stg11',root).classList.contains('on'))togglePanel('stages',false)}if(eng)eng.flow(on);cancelAnimationFrame(mxRaf);if(on)mxRaf=requestAnimationFrame(mxDraw)}
function mxDraw(t){if(!flowOn||!isOpen)return;mxRaf=requestAnimationFrame(mxDraw);const cv=$('.mxcv',root),x=cv.getContext('2d'),W=420,H=300,B=155;x.clearRect(0,0,W,H);
 x.fillStyle='#16325a';x.fillRect(10,30,W-20,B-30);x.fillStyle='#2a1f52';x.fillRect(10,B,W-20,H-B-10);x.strokeStyle='#cfd8e3';x.lineWidth=4;x.strokeRect(10,30,W-20,H-40);
 x.strokeStyle='#9fe8ff';x.lineWidth=2;x.setLineDash([8,6]);x.beginPath();x.moveTo(10,B);x.lineTo(W-10,B);x.stroke();x.setLineDash([]);
 x.fillStyle='#e6f6ff';x.font='700 15px Inter,sans-serif';x.fillText('Helium-3 rich layer',22,52);x.fillText('Helium-4 rich layer (6.6% helium-3)',22,H-20);
 x.fillStyle='#cfd8e3';x.fillRect(W-70,0,28,30);x.fillRect(60,0,24,30);x.font='700 12px Inter,sans-serif';x.fillStyle='#9fb6c9';x.fillText('in',92,20);x.fillText('to still',W-130,20);
 MXA.forEach(a=>{if(a.top){a.x+=Math.sin(t*.002+a.y)*.4;if(Math.random()<.004){a.top=false;a.flash=1}}else{a.y+=.5;a.x+=(W-56-a.x)*.004;if(a.y>H-14){a.top=true;a.y=40+Math.random()*20;a.x=72+Math.random()*30}}
  if(!a.top&&a.y<B)a.y+=.8;const c=a.top?'#3fa9ff':'#c084fc';x.fillStyle=c;x.beginPath();x.arc(a.x,a.y,a.top?5:5.5,0,6.3);x.fill();
  if(a.flash>0){x.strokeStyle='rgba(251,191,36,'+a.flash+')';x.lineWidth=3;x.beginPath();x.arc(a.x,a.y,14*(1.6-a.flash),0,6.3);x.stroke();a.flash-=.02}});
 x.fillStyle='#fbbf24';x.font='800 13px Inter,sans-serif';x.fillText('heat taken in here',W-170,B-8)}
/* ---------- chip close-up (2D) ---------- */
const Q=[];for(let i=0;i<16;i++)Q.push({a:[1,0],b:[0,0]});let qSel=0;
function chipUI(){const cv=$('.chipcv',root);cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),x=((e.clientX-r.left)/r.width*560-CO)/CS,y=((e.clientY-r.top)/r.height*560-CO)/CS;let best=-1,bd=1e9;for(let i=0;i<16;i++){const [qx,qy]=qpos(i),d=Math.hypot(qx-x,qy-y);if(d<bd){bd=d;best=i}}if(bd<60){qSel=best;drawChip();drawBloch()}});
 $$('.chip10 .qb button',root).forEach(b=>b.onclick=()=>gate(b.dataset.g));const lt=$('.lblt',root);if(lt)lt.onclick=()=>{chipLbl=!chipLbl;lt.textContent=chipLbl?'Hide labels':'Show labels';drawChip()}}
const CS=.88,CO=34;const qpos=i=>[110+(i%4)*113,110+Math.floor(i/4)*113];
const cmul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],R2=Math.SQRT1_2;
function gate(g){const q=Q[qSel],a=q.a,b=q.b,res=$('.chip10 .qres',root);res.textContent='';
 if(g==='X'){q.a=b;q.b=a}else if(g==='Z'){q.b=[-b[0],-b[1]]}else if(g==='S'){q.b=cmul(b,[0,1])}else if(g==='H'){q.a=[(a[0]+b[0])*R2,(a[1]+b[1])*R2];q.b=[(a[0]-b[0])*R2,(a[1]-b[1])*R2]}
 else if(g==='R'){q.a=[1,0];q.b=[0,0]}else if(g==='M'){const p1=b[0]**2+b[1]**2,r=Math.random()<p1?1:0;q.a=r?[0,0]:[1,0];q.b=r?[1,0]:[0,0];res.textContent=`Result: ${r} (the chance of 1 was ${Math.round(p1*100)}%)`}
 drawChip();drawBloch()}
function css(v,d){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||d}
function drawChip(){const cv=$('.chipcv',root),x=cv.getContext('2d'),B=css('--b','#22d3ee'),A=css('--a','#1e6bff');x.clearRect(0,0,560,560);
 /* PCB / sample holder around the chip, with bond wires */
 x.fillStyle='#1d3b2a';x.fillRect(0,0,560,560);x.fillStyle='#c9a227';for(let k=0;k<12;k++){const t=CO+(40+k*41)*CS;[[t,8],[t,552],[8,t],[552,t]].forEach(([px,py])=>x.fillRect(px-6,py-6,12,12))}
 x.save();x.translate(CO,CO);x.scale(CS,CS);
 const g=x.createLinearGradient(0,0,560,560);g.addColorStop(0,'#0e2236');g.addColorStop(1,'#08131f');x.fillStyle=g;x.fillRect(0,0,560,560);
 x.strokeStyle='#5c7a94';x.lineWidth=3;x.strokeRect(14,14,532,532);// bond pads
 x.fillStyle='#b9c7d3';for(let k=0;k<12;k++){const t=40+k*41;[[t,22],[t,530],[22,t],[530,t]].forEach(([px,py])=>x.fillRect(px-7,py-5,14,10))}
 // readout resonators (meanders)
 x.strokeStyle='#5f86a6';x.lineWidth=4;for(let r=0;r<4;r++){const y=110+r*113-40;x.beginPath();x.moveTo(22,y);x.lineTo(538,y);x.stroke()}
 x.strokeStyle='#4a6a85';x.lineWidth=2;x.setLineDash([5,4]);for(let i=0;i<16;i++){const [qx,qy]=qpos(i);x.beginPath();x.moveTo(qx-30,qy+30);x.lineTo(qx-48,qy+48);x.stroke()}x.setLineDash([]);
 x.strokeStyle='#8fb0c8';x.lineWidth=2;for(let i=0;i<16;i++){const [qx,qy]=qpos(i);x.beginPath();let px=qx+22,py=qy-34;x.moveTo(px,py);for(let k=0;k<5;k++){px+=6;x.lineTo(px,py);py+=(k%2?-12:12);x.lineTo(px,py)}x.stroke()}
 // couplers
 x.lineWidth=6;x.strokeStyle=A;for(let i=0;i<16;i++){const [qx,qy]=qpos(i);if(i%4<3){x.beginPath();x.moveTo(qx+30,qy);x.lineTo(qx+83,qy);x.stroke()}if(i<12){x.beginPath();x.moveTo(qx,qy+30);x.lineTo(qx,qy+83);x.stroke()}}
 // qubits
 for(let i=0;i<16;i++){const [qx,qy]=qpos(i),q=Q[i],p1=q.b[0]**2+q.b[1]**2;const c=`rgb(${Math.round(34+217*p1)},${Math.round(211-20*p1)},${Math.round(238-202*p1)})`;
  x.save();x.translate(qx,qy);if(i===qSel){x.shadowColor=B;x.shadowBlur=24;x.strokeStyle='#fff';x.lineWidth=3;x.strokeRect(-36,-36,72,72)}x.fillStyle=c;x.fillRect(-28,-7,56,14);x.fillRect(-7,-28,14,56);x.fillStyle='#fbbf24';x.fillRect(-4,22,8,8);x.restore();
  x.fillStyle='#e6f6ff';x.font='700 15px Inter,sans-serif';x.textAlign='center';x.fillText('Q'+i,qx-28,qy+44)}
 x.restore();
 x.strokeStyle='rgba(235,225,200,.9)';x.lineWidth=1.4;for(let k=0;k<12;k++){const t=CO+(40+k*41)*CS,a=CO+22*CS,b=CO+530*CS;[[t,a,t,8],[t,b,t,552],[a,t,8,t],[b,t,552,t]].forEach(([x1,y1,x2,y2])=>{x.beginPath();x.moveTo(x1,y1);x.quadraticCurveTo((x1+x2)/2+(y1===y2?0:6),(y1+y2)/2+(y1===y2?-6:0),x2,y2);x.stroke()})}
 if(chipLbl){const C=(tx,ty,px,py,t)=>{x.strokeStyle='#fbbf24';x.lineWidth=1.5;x.beginPath();x.moveTo(px,py);x.lineTo(tx,ty);x.stroke();x.fillStyle='#fbbf24';x.beginPath();x.arc(px,py,3.5,0,6.3);x.fill();x.font='700 13px Inter,sans-serif';const w=x.measureText(t).width+12;x.fillStyle='rgba(6,14,24,.88)';x.fillRect(tx-(tx>280?w:0),ty-11,w,20);x.fillStyle='#ffe7a3';x.textAlign='left';x.fillText(t,tx-(tx>280?w:0)+6,ty+4)};
  const P=(qx,qy)=>[CO+qx*CS,CO+qy*CS];let [a,b]=P(110,110);C(a+60,b+28,a,b,'Transmon qubit (cross)');[a,b]=P(166,110);C(a+30,b-30,a,b,'Tunable coupler');[a,b]=P(300,70);C(a+40,b-26,a,b,'Readout feedline');[a,b]=P(373,300);C(a+40,b+44,a,b,'Readout resonator');[a,b]=P(110,136);C(a+40,b+40,a,b,'Josephson junction');[a,b]=P(68,264);C(a+10,b+60,a,b,'Drive line (XY)');C(300,38,CO+(40+6*41)*CS,14,'Bond wires to the PCB')}
 x.textAlign='left';x.fillStyle='#cfe3f2';x.font='600 12px Inter,sans-serif';x.fillStyle='rgba(6,14,24,.75)';x.fillRect(0,536,560,24);x.fillStyle='#cfe3f2';x.fillText('cyan = mostly |0⟩ · amber = mostly |1⟩ · tap a qubit, then a gate',12,552)}
let chipLbl=true;
function drawBloch(){const cv=$('.bloch',root),x=cv.getContext('2d'),B=css('--b','#22d3ee'),T=css('--txt','#eaf2ff'),M=css('--mut','#94a9cc');const q=Q[qSel];
 const ra=Math.hypot(...q.a),rb=Math.hypot(...q.b),th=2*Math.atan2(rb,ra),ph=(rb>1e-9&&ra>1e-9)?Math.atan2(q.b[1],q.b[0])-Math.atan2(q.a[1],q.a[0]):0;
 x.clearRect(0,0,300,300);const cx=150,cy=150,R=110,tilt=.35;x.strokeStyle=M;x.lineWidth=1.5;x.beginPath();x.arc(cx,cy,R,0,6.3);x.stroke();x.beginPath();x.ellipse(cx,cy,R,R*tilt,0,0,6.3);x.setLineDash([4,4]);x.stroke();x.setLineDash([]);
 x.beginPath();x.moveTo(cx,cy-R);x.lineTo(cx,cy+R);x.stroke();x.fillStyle=T;x.font='700 16px Inter,sans-serif';x.textAlign='center';x.fillText('|0⟩',cx,cy-R-8);x.fillText('|1⟩',cx,cy+R+20);
 const vx=Math.sin(th)*Math.cos(ph),vy=Math.sin(th)*Math.sin(ph),vz=Math.cos(th);const px=cx+R*(vx*.95+vy*.0),py=cy-R*vz+R*tilt*(vy);
 x.strokeStyle=B;x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(cx,cy);x.lineTo(px,py);x.stroke();x.fillStyle=B;x.beginPath();x.arc(px,py,8,0,6.3);x.fill();
 $('.chip10 .qn',root).textContent='Qubit Q'+qSel;const p0=ra*ra,p1=rb*rb;$('.chip10 .qs',root).innerHTML=`Chance of 0: <b>${Math.round(p0*100)}%</b> · Chance of 1: <b>${Math.round(p1*100)}%</b>${rb>1e-9&&ra>1e-9?` · phase ${Math.round(((ph*180/Math.PI)%360+360)%360)}°`:''}`}
/* ---------- 3D engine ---------- */
async function boot(){if(booting||eng)return;booting=true;const ld=$('.loading10',root);ld.style.display='grid';
 try{const c=document.createElement('canvas');if(!(c.getContext('webgl2')||c.getContext('webgl')))throw new Error('WebGL is turned off or not supported on this device.');
  const T=await loadThree();eng=build(T);ld.style.display='none';if(isOpen)eng.start();if(pinned)eng.glow()}
 catch(e){ld.style.display='none';root.classList.add('nogl');$('.why',root).textContent=(e&&e.message&&/WebGL/.test(e.message)?e.message+' ':'')+'It needs WebGL and, the first time, an internet connection to load the 3D engine.';console.warn('Quantum Atlas 3D:',e)}
 booting=false}
function build(T){const cv=$('canvas.gl',root),stage=$('.stage',root),lbBox=$('.labels',root);
 const ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'});ren.setPixelRatio(Math.min(devicePixelRatio||1,(innerWidth<820||matchMedia('(pointer:coarse)').matches)?1.5:2));ren.toneMapping=T.ACESFilmicToneMapping;ren.toneMappingExposure=1.2;
 const scene=new T.Scene(),cam=new T.PerspectiveCamera(42,1,.05,200);
 // environment for shiny metal
 const pm=new T.PMREMGenerator(ren),es=new T.Scene();es.add(new T.Mesh(new T.BoxGeometry(30,30,30),new T.MeshBasicMaterial({color:0x34465c,side:T.BackSide})));
 [[0,14,0,0xffffff,26,26],[14,4,6,0xbff2ff,8,16],[-14,2,-4,0xffffff,8,14],[0,-12,8,0x6f9fd8,22,14],[4,6,-14,0xfff1d6,14,10],[0,8,14,0xffffff,18,8],[-10,10,10,0xfff6e0,10,8],[0,-14,0,0xd8e8ff,24,24]].forEach(([x,y,z,c,w,h])=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:c,side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)});
 scene.environment=pm.fromScene(es,.04).texture;
 scene.add(new T.HemisphereLight(0xcfe8ff,0x0a1830,.75));const fill=new T.DirectionalLight(0xbfdcff,.7);fill.position.set(-8,-3,6);scene.add(fill);const top=new T.SpotLight(0xfff1d6,40,40,.6,.6);top.position.set(0,14,4);scene.add(top);const key=new T.DirectionalLight(0xffffff,1.6);key.position.set(6,10,8);scene.add(key);const rim=new T.PointLight(0x22d3ee,30,30);rim.position.set(-6,-2,5);scene.add(rim);
 /* --- registry --- */
 const parts={},pick=[];let proxyFor=null;
 const M=(id,o)=>{const m=new T.MeshStandardMaterial(Object.assign({metalness:.9,roughness:.32},o));(parts[id]=parts[id]||{meshes:[],mats:new Set()}).mats.add(m);return m};
 const reg=(id,mesh,sh)=>{mesh.userData.part=id;if(sh)mesh.userData.shell=1;(parts[id]=parts[id]||{meshes:[],mats:new Set()}).meshes.push(mesh);if(mesh.material)parts[id].mats.add(mesh.material);pick.push(mesh);return mesh};
 const GOLD={color:0xe8b54a,metalness:1,roughness:.3},COP={color:0xc8763e,metalness:1,roughness:.3},STEEL={color:0xb7c2cc,metalness:.9,roughness:.35},NBTI={color:0x8ea4bb,metalness:.85,roughness:.35};
 /* --- stages --- */
 const SY=[5.4,3.9,2.5,1.0,-.2,-1.5,-2.45],SR=[2.2,2.0,1.85,1.65,1.5,1.35,.6];let cy=SY.slice();const EX=1.6,Ye=SY.map(y=>SY[0]-(SY[0]-y)*EX);
 const G=SY.map(y=>{const g=new T.Group();g.position.y=y;scene.add(g);return g});
 const spans=[];// {o,a,b,oa,ob}
 const span=(o,a,b,oa=0,ob=0)=>{spans.push({o,a,b,oa,ob});scene.add(o);return o};
 const cyl=(r,mat,seg=16)=>{const g=new T.CylinderGeometry(r,r,1,seg,1);g.translate(0,.5,0);return new T.Mesh(g,mat)};// unit height 0..1
 const P=(r,deg)=>[r*Math.cos(deg*Math.PI/180),r*Math.sin(deg*Math.PI/180)];
 const ids=['plate300','plate50','plate4','plateStill','plateCP','plateMXC'];
 ids.forEach((id,i)=>{const th=i===0?.18:.12;const m=new T.Mesh(new T.CylinderGeometry(SR[i],SR[i],th,64),M(id,GOLD));G[i].add(reg(id,m));
  const rimM=new T.Mesh(new T.TorusGeometry(SR[i],.03,8,64),m.material);rimM.rotation.x=Math.PI/2;G[i].add(reg(id,rimM))});
 // support rods
 const rodM=M('rods',{color:0xc9a24a,metalness:.95,roughness:.35}),rodS=M('rods',STEEL);
 for(let i=0;i<5;i++){const r=Math.min(SR[i],SR[i+1])*.86;for(let k=0;k<4;k++){const [x,z]=P(r,45+k*90+(i%2)*12);const o=cyl(.04,i<2?rodS:rodM,10);o.position.set(x,0,z);reg('rods',o);span(o,i,i+1,-.06,.06)}}
 /* --- pulse tube --- */
 const ptM=M('pulseTube',STEEL),ptC=M('pulseTube',COP);{const [x,z]=P(1.15,-40);
  const head=new T.Mesh(new T.CylinderGeometry(.34,.34,.75,24),ptM);head.position.set(x,.09+.375,z);G[0].add(reg('pulseTube',head));
  const mot=new T.Mesh(new T.CylinderGeometry(.18,.22,.35,20),ptM);mot.position.set(x,.09+.75+.17,z);G[0].add(reg('pulseTube',mot));
  const t1=cyl(.15,ptM);t1.position.set(x,0,z);reg('pulseTube',t1);span(t1,0,1);const t1b=cyl(.07,ptM);t1b.position.set(x+.26,0,z+.1);reg('pulseTube',t1b);span(t1b,0,1);
  const f1=new T.Mesh(new T.CylinderGeometry(.32,.32,.14,24),ptC);f1.position.set(x,-.13,z);G[1].add(reg('pulseTube',f1));
  const t2=cyl(.1,ptM);t2.position.set(x,0,z);reg('pulseTube',t2);span(t2,1,2,-.2);const t2b=cyl(.05,ptM);t2b.position.set(x+.2,0,z+.08);reg('pulseTube',t2b);span(t2b,1,2,-.2);
  const f2=new T.Mesh(new T.CylinderGeometry(.24,.24,.14,24),ptC);f2.position.set(x,-.13,z);G[2].add(reg('pulseTube',f2))}
 /* --- still pumping line + still + mixture lines + heat exchangers + mixing chamber --- */
 const slM=M('stillLine',STEEL);{const [x,z]=P(1.0,-140);const o=cyl(.24,slM,24);o.position.set(x,0,z);reg('stillLine',o);span(o,3,0,.0,-.05);
  const up=new T.Mesh(new T.CylinderGeometry(.24,.24,.7,24),slM);up.position.set(x,.09+.35,z);G[0].add(reg('stillLine',up));
  const el=new T.Mesh(new T.TorusGeometry(.3,.24,12,24,Math.PI/2),slM);el.position.set(x-.3,.79,z);G[0].add(reg('stillLine',el));
  const out=new T.Mesh(new T.CylinderGeometry(.24,.24,1.4,24),slM);out.rotation.z=Math.PI/2;out.position.set(x-.3-.7,1.09,z);G[0].add(reg('stillLine',out));
  const stM=M('still',{color:0xd8dee6,metalness:.95,roughness:.25});const st=new T.Mesh(new T.CylinderGeometry(.34,.34,.42,28),stM);st.position.set(x,-.06-.21,z);G[3].add(reg('still',st));
  const stB=new T.Mesh(new T.SphereGeometry(.34,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),stM);stB.position.set(x,-.48,z);G[3].add(reg('still',stB))}
 const clM=M('condLine',COP);{const [x,z]=P(.72,-110);[[0,1],[1,2],[2,3],[3,4],[4,5]].forEach(([a,b])=>{const o=cyl(.035,clM,8);o.position.set(x,0,z);reg('condLine',o);span(o,a,b)});
  const imp=new T.Mesh(new T.CylinderGeometry(.07,.07,.22,12),clM);imp.position.set(x,-.2,z);G[2].add(reg('condLine',imp))}
 const hxM=M('hex',COP),hxS=M('hex',{color:0xe3e8ee,metalness:1,roughness:.2});{const [x,z]=P(.5,-120);
  const pts=[];for(let k=0;k<=200;k++){const t=k/200,a=t*Math.PI*2*9;pts.push(new T.Vector3(Math.cos(a)*.17,t,Math.sin(a)*.17))}
  const hel=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),400,.028,6),hxM);hel.position.set(x,0,z);reg('hex',hel);span(hel,4,3,.06,-.12);
  const stack=new T.Group();for(let k=0;k<4;k++){const b=new T.Mesh(new T.BoxGeometry(.32,.12,.32),hxS);b.position.y=.15+k*.22;stack.add(reg('hex',b))}
  const core=cyl(.05,hxM,8);stack.add(reg('hex',core));stack.position.set(x,0,z);span(stack,5,4,.06,-.06);
  const mxM=M('mxc',{color:0xd0d7df,metalness:1,roughness:.22});const mx=new T.Mesh(new T.CylinderGeometry(.36,.36,.34,28),mxM);mx.position.set(x,-.06-.17,z);G[5].add(reg('mxc',mx));
  const mxB=new T.Mesh(new T.CylinderGeometry(.36,.3,.08,28),mxM);mxB.position.set(x,-.44,z);G[5].add(reg('mxc',mxB))}
 /* --- feedthroughs on top --- */
 const fdM=M('feed',STEEL),fdG=M('feed',GOLD);for(let k=0;k<5;k++){const [x,z]=P(1.55,40+k*28);const b=new T.Mesh(new T.CylinderGeometry(.17,.17,.28,20),fdM);b.position.set(x,.09+.14,z);G[0].add(reg('feed',b));const c=new T.Mesh(new T.CylinderGeometry(.11,.11,.06,16),fdG);c.position.set(x,.09+.31,z);G[0].add(reg('feed',c))}
 /* --- wiring: input coax, attenuators, filters --- */
 const inS=M('coaxIn',{color:0xd5dce4,metalness:.95,roughness:.3}),inN=M('coaxIn',NBTI),atM=M('atten',{color:0xf0c04a,metalness:1,roughness:.22}),atR=M('atten',STEEL);
 const ang=[50,62,74,86,98,110,122,134];const curveSpan=(id,mat,r,x,z,x2,z2,a,b,oa,ob)=>{const pts=[];for(let k=0;k<=12;k++){const t=k/12,s=t*t*(3-2*t);pts.push(new T.Vector3((x-x2)*s,t,(z-z2)*s))}const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,r,6),mat);o.position.set(x2,0,z2);reg(id,o);span(o,a,b,oa,ob);return o};
 ang.forEach((d,j)=>{const [x,z]=P(1.0,d);[[0,1],[1,2],[2,3],[3,4],[4,5]].forEach(([a,b])=>{const o=cyl(.022,a<2?inS:inN,8);o.position.set(x,0,z);reg('coaxIn',o);span(o,a,b)});
  [2,3,4,5].forEach(i=>{const at=new T.Mesh(new T.CylinderGeometry(.055,.055,.16,14),atM);at.position.set(x,-.06-.12,z);G[i].add(reg('atten',at));const rg=new T.Mesh(new T.CylinderGeometry(.06,.06,.03,14),atR);rg.position.set(x,-.06-.03,z);G[i].add(reg('atten',rg))});
  if(j%2===0){const fM=M('filters',{color:0x1c2733,metalness:.6,roughness:.5});const f=new T.Mesh(new T.BoxGeometry(.13,.2,.13),fM);f.position.set(x,-.06-.42,z);G[5].add(reg('filters',f))}
  const [x2,z2]=P(.32,d);curveSpan('coaxIn',inN,.02,x,z,x2,z2,6,5,-.0,-.3)});
 /* --- DC / flux lines (twisted looms) --- */
 const dcM=M('dcLines',{color:0xb07a3e,metalness:.7,roughness:.45});[160,176].forEach(d=>{const [x,z]=P(1.05,d);const tw=[];for(let k=0;k<=160;k++){const t=k/160,a=t*Math.PI*2*14;tw.push(new T.Vector3(Math.cos(a)*.035,t,Math.sin(a)*.035))}
  [[0,1],[1,2],[2,3],[3,4],[4,5]].forEach(([a,b])=>{const g1=new T.TubeGeometry(new T.CatmullRomCurve3(tw),160,.02,5);const o=new T.Group();o.add(reg('dcLines',new T.Mesh(g1,dcM)));const o2=new T.Mesh(g1,dcM);o2.rotation.y=Math.PI;o.add(reg('dcLines',o2));o.position.set(x,0,z);span(o,a,b)});
  const [x2,z2]=P(.36,d);curveSpan('dcLines',dcM,.03,x,z,x2,z2,6,5,0,-.3)});
 /* --- output chain: circulators, TWPA, superconducting lines, HEMT --- */
 const ouN=M('coaxOut',{color:0x9fb8d0,metalness:.85,roughness:.3}),ouS=M('coaxOut',{color:0xd5dce4,metalness:.95,roughness:.3}),ciM=M('circ',{color:0xc2ccd6,metalness:.9,roughness:.3}),ciK=M('circ',{color:0x1b2430,metalness:.5,roughness:.5}),hmM=M('hemt',{color:0xe6c35a,metalness:1,roughness:.25}),hmK=M('hemt',{color:0x2a3542,metalness:.5,roughness:.5});
 [22,6,-10].forEach((d,j)=>{const [x,z]=P(1.0,d);[[0,1],[1,2]].forEach(([a,b])=>{const o=cyl(.03,ouS,8);o.position.set(x,0,z);reg('coaxOut',o);span(o,a,b)});
  [[2,3],[3,4],[4,5]].forEach(([a,b])=>{const fl=new T.Mesh((()=>{const g=new T.BoxGeometry(.11,1,.018);g.translate(0,.5,0);return g})(),ouN);fl.position.set(x,0,z);fl.lookAt(0,0,0);fl.rotation.set(0,Math.atan2(x,z)+Math.PI/2,0);reg('coaxOut',fl);span(fl,a,b)});
  const hb=new T.Mesh(new T.BoxGeometry(.22,.26,.16),hmM);hb.position.set(x,-.06-.18,z);hb.rotation.y=-d*Math.PI/180;G[2].add(reg('hemt',hb));const hc=new T.Mesh(new T.CylinderGeometry(.04,.04,.1,10),hmK);hc.position.set(x,-.06-.36,z);G[2].add(reg('hemt',hc));
  for(let k=0;k<2;k++){const c=new T.Mesh(new T.CylinderGeometry(.1,.1,.07,20),ciM);c.position.set(x,-.06-.1-k*.13,z);G[5].add(reg('circ',c));const mg=new T.Mesh(new T.CylinderGeometry(.06,.06,.075,16),ciK);mg.position.copy(c.position);mg.position.y+=.0;mg.scale.set(1,1.05,1);G[5].add(reg('circ',mg))}
  const [x2,z2]=P(.3,d);curveSpan('coaxOut',ouN,.022,x,z,x2,z2,6,5,0,-.38)});
 {const [x,z]=P(.95,-28);const tw=new T.Mesh(new T.BoxGeometry(.38,.1,.22),M('twpa',{color:0xd3a640,metalness:1,roughness:.25}));tw.position.set(x,-.06-.08,z);tw.rotation.y=.5;G[5].add(reg('twpa',tw));
  const lid=new T.Mesh(new T.BoxGeometry(.3,.02,.14),M('twpa',{color:0x223142,metalness:.4,roughness:.5}));lid.position.set(x,-.06-.14,z);lid.rotation.y=.5;G[5].add(reg('twpa',lid))}
 /* --- tail: magnetic shield, package, chip, qubits, resonators --- */
 const msM=new T.MeshStandardMaterial({color:0xa9bccf,metalness:.6,roughness:.35,transparent:true,opacity:.3,depthWrite:false,side:T.DoubleSide});parts.magShield={meshes:[],mats:new Set([msM])};
 const ms=new T.Mesh(new T.CylinderGeometry(.6,.6,1.6,40,1,true),msM);ms.position.y=-.8;G[6].add(reg('magShield',ms,1));const msb=new T.Mesh(new T.CircleGeometry(.6,40),msM);msb.rotation.x=Math.PI/2;msb.position.y=-1.6;G[6].add(reg('magShield',msb,1));
 const msTop=new T.Mesh(new T.TorusGeometry(.6,.035,8,40),M('magShield',{color:0x9fb0c2,metalness:.9,roughness:.3}));msTop.rotation.x=Math.PI/2;G[6].add(reg('magShield',msTop));
 const pkM=M('package',COP);const pk=new T.Mesh(new T.BoxGeometry(.56,.6,.2),pkM);pk.position.set(0,-.82,-.02);G[6].add(reg('package',pk));
 for(let k=0;k<6;k++){const c=new T.Mesh(new T.CylinderGeometry(.03,.03,.1,10),M('package',GOLD));c.position.set(-.2+k*.08,-.47,-.02);G[6].add(reg('package',c))}
 const chM=M('chip',{color:0x183247,metalness:.3,roughness:.25});const ch=new T.Mesh(new T.BoxGeometry(.38,.38,.02),chM);ch.position.set(0,-.82,.09);G[6].add(reg('chip',ch));
 const qM=M('qubits',{color:0x7fe9ff,metalness:.6,roughness:.2,emissive:0x0a4b5c,emissiveIntensity:1});qM.userData.base=0x0a4b5c;const rsM=M('resonators',{color:0xcdd9e3,metalness:.9,roughness:.25});
 parts.qubits={meshes:[],mats:new Set()};parts.resonators={meshes:[],mats:new Set()};let chipBuilt=false;
 function chipDetail(){if(chipBuilt)return;chipBuilt=true;for(let i=0;i<16;i++){const qx=-.12+(i%4)*.08,qy=-.82+.12-Math.floor(i/4)*.08;const a=new T.Mesh(new T.BoxGeometry(.044,.01,.006),qM),b=new T.Mesh(new T.BoxGeometry(.01,.044,.006),qM);a.position.set(qx,qy,.103);b.position.copy(a.position);G[6].add(reg('qubits',a),reg('qubits',b));
  for(let k=0;k<3;k++){const r=new T.Mesh(new T.BoxGeometry(.004,.022,.004),rsM);r.position.set(qx+.026+k*.007,qy+.016,.103);G[6].add(reg('resonators',r))}}
  ['qubits','resonators'].forEach(id=>proxyFor&&proxyFor(id));glow()}
 // short lines from package to shield top
 [-.15,-.05,.05,.15].forEach(x=>{const l=new T.Mesh(new T.CylinderGeometry(.012,.012,.47,6),inN);l.position.set(x,-.235,-.02);G[6].add(reg('coaxIn',l))});
/* --- v11 detail: bolts, thermal anchors, sensors, cold finger, electronics rack --- */
 {const bg=new T.CylinderGeometry(.035,.035,.05,8);ids.forEach((id,i)=>{const n=i===0?40:28,th=i===0?.18:.12,im=new T.InstancedMesh(bg,M(id,{color:0xcfd6de,metalness:1,roughness:.3}),n),o=new T.Object3D();for(let k=0;k<n;k++){const [x,z]=P(SR[i]-.09,k*360/n+4);o.position.set(x,th/2+.02,z);o.updateMatrix();im.setMatrixAt(k,o.matrix)}G[i].add(reg(id,im))});
  const hg=new T.CylinderGeometry(.075,.075,.005,14);ids.forEach((id,i)=>{if(i===0)return;const hm=new T.MeshStandardMaterial({color:0x2a1d0c,metalness:.4,roughness:.7}),n=10,im=new T.InstancedMesh(hg,hm,n),o=new T.Object3D();for(let k=0;k<n;k++){const [x,z]=P(SR[i]*.55,k*36+18);o.position.set(x,.062,z);o.updateMatrix();im.setMatrixAt(k,o.matrix)}im.userData.part=id;G[i].add(im)})}
 {const clM=M('clamps',COP),cg=new T.CylinderGeometry(.045,.045,.06,10);[1,2,3,4,5].forEach(i=>{ang.forEach(d=>{const [x,z]=P(1.0,d);const c=new T.Mesh(cg,clM);c.position.set(x,-.09,z);G[i].add(reg('clamps',c))});
  const [bx,bz]=P(1.0,86),bar=new T.Mesh(new T.BoxGeometry(.12,.05,1.3),clM);bar.position.set(bx-.02,-.1,bz);bar.rotation.y=-86*Math.PI/180+Math.PI/2;bar.rotation.y=Math.PI/2-86*Math.PI/180;G[i].add(reg('clamps',bar))})}
 {const sK=M('sensors',{color:0x15191f,metalness:.4,roughness:.6}),sG=M('sensors',GOLD),sR=M('sensors',{color:0xb33a2c,metalness:.5,roughness:.45});[1,2,3,4,5].forEach(i=>{const [x,z]=P(SR[i]*.78,205);const b=new T.Mesh(new T.BoxGeometry(.16,.08,.11),sK);b.position.set(x,.1,z);G[i].add(reg('sensors',b));const l=new T.Mesh(new T.BoxGeometry(.12,.015,.08),sG);l.position.set(x,.147,z);G[i].add(reg('sensors',l));
  if(i===3||i===5){const [hx,hz]=P(SR[i]*.78,222);const h=new T.Mesh(new T.CylinderGeometry(.05,.05,.07,12),sR);h.position.set(hx,.1,hz);G[i].add(reg('sensors',h))}})}
 {const cf=M('coldFinger',COP);[0,120,240].forEach(d=>{const [x,z]=P(.42,d+30);const r=cyl(.04,cf,12);r.position.set(x,0,z);reg('coldFinger',r);span(r,6,5,.02,-.06)});const mp=new T.Mesh(new T.CylinderGeometry(.56,.56,.05,40),cf);mp.position.y=.03;G[6].add(reg('coldFinger',mp));
  const rod=new T.Mesh(new T.CylinderGeometry(.05,.05,.42,12),cf);rod.position.set(0,-.25,-.15);G[6].add(reg('coldFinger',rod))}
 const RX=-3.25,RY=SY[0]-.6,RH=2.9;{const g=new T.Group();g.position.set(RX,RY,-.2);scene.add(g);const fr=M('electronics',{color:0x1d2633,metalness:.6,roughness:.45}),pn=M('electronics',{color:0x3a4757,metalness:.7,roughness:.35}),sc=new T.MeshBasicMaterial({color:0x22d3ee,toneMapped:false}),ld=new T.MeshBasicMaterial({color:0x34d399,toneMapped:false}),am=new T.MeshBasicMaterial({color:0xfbbf24,toneMapped:false});parts.electronics.mats.add(sc);
  const body=new T.Mesh(new T.BoxGeometry(.95,RH,.8),fr);body.position.y=RH/2;g.add(reg('electronics',body));
  for(let k=0;k<7;k++){const h=k===0?.42:.26,y=.2+k*.38;const u=new T.Mesh(new T.BoxGeometry(.84,h,.04),pn);u.position.set(0,y+h/2,.41);g.add(reg('electronics',u));
   const sm=new T.Mesh(new T.PlaneGeometry(.22,h*.5),k%3?am:sc);sm.position.set(-.24,y+h/2,.432);g.add(reg('electronics',sm));
   for(let j=0;j<4;j++){const d=new T.Mesh(new T.CircleGeometry(.018,8),j===k%4?ld:pn);d.position.set(.05+j*.08,y+h/2,.432);g.add(reg('electronics',d))}}
  const top=new T.Mesh(new T.BoxGeometry(1.0,.05,.85),pn);top.position.y=RH+.02;g.add(reg('electronics',top))}
 const CAB=[];{const cm=M('electronics',{color:0x2b3a4c,metalness:.3,roughness:.6});[[50,0x22d3ee],[22,0xfbbf24],[86,0],[110,0],[160,0]].forEach(([d,c],j)=>{const [x,z]=P(1.0,d);const top=RY+RH,pts=[new T.Vector3(RX+.3-j*.1,top+.04,-.2+.1*j),new T.Vector3(RX+.5,top+.55+j*.06,0),new T.Vector3(-.9,SY[0]+1.75+j*.05,.4),new T.Vector3(x,SY[0]+1.0,z),new T.Vector3(x,SY[0]+.3,z)];const cv=new T.CatmullRomCurve3(pts);CAB[d]=cv;
  const t=new T.Mesh(new T.TubeGeometry(cv,48,.03,6),cm);scene.add(reg('electronics',t));const cn=new T.Mesh(new T.CylinderGeometry(.06,.06,.22,12),M('feed',GOLD));cn.position.set(x,SY[0]+.2,z);scene.add(reg('feed',cn))})}
 /* --- radiation shields + vacuum can (hidden by default) --- */
 const shells=[['ovc',0,2.36,-2.05,0xb9c4cf,.16],['shield50',1,2.12,-1.9,0xd7e0e8,.14],['shield4',2,1.97,-1.8,0xe0e7ee,.14],['shieldStill',3,1.76,-1.7,0xe8eef3,.14]];let shieldsOn=false;
 shells.forEach(([id,a,r,ob,c,op])=>{const mat=new T.MeshStandardMaterial({color:c,metalness:.7,roughness:.3,transparent:true,opacity:op,depthWrite:false,side:T.DoubleSide});parts[id]={meshes:[],mats:new Set([mat])};
  const g=new T.Group();const w=new T.Mesh((()=>{const q=new T.CylinderGeometry(r,r,1,64,1,true);q.translate(0,.5,0);return q})(),mat);const bt=new T.Mesh(new T.CircleGeometry(r,64),mat);bt.rotation.x=-Math.PI/2;g.add(reg(id,w,1),reg(id,bt,1));g.visible=false;g.userData.shellGroup=1;span(g,6,a,ob,a===0?-.09:-.06)});
 /* --- spans update --- */
 function layout(){G.forEach((g,i)=>g.position.y=cy[i]);spans.forEach(s=>{const top=cy[s.b]+s.ob,bot=cy[s.a]+s.oa;const lo=Math.min(top,bot),hi=Math.max(top,bot);
   if(s.a<s.b){/* a above b */const t=cy[s.a]+s.oa,b=cy[s.b]+s.ob;s.o.position.y=b;s.o.scale.y=Math.max(.001,t-b)}else{const t=cy[s.b]+s.ob,b=cy[s.a]+s.oa;s.o.position.y=b;s.o.scale.y=Math.max(.001,t-b)}})}
 layout();
 /* --- glow --- */
 let sigPid=null;const ACC=new T.Color();function glow(){ACC.set(getComputedStyle(document.documentElement).getPropertyValue('--b').trim()||'#22d3ee');for(const id in parts){const on=id===hoverId?.75:id===pinned?.5:id===sigPid?.6:0;parts[id].mats.forEach(m=>{if(!m.emissive)return;if(on){m.emissive.copy(ACC);m.emissiveIntensity=on}else{m.emissive.setHex(m.userData.base||0);m.emissiveIntensity=m.userData.base?1:0}})}}
 /* --- camera controls --- */
 const tgt=new T.Vector3(0,1.2,0),gt=tgt.clone();let rad=15,grad=15,th=.5,gth=.5,phi=1.38,gphi=1.38,auto=false,lastUser=0;
 function fit(){const a=Math.max(.3,cam.aspect),vf=Math.tan(cam.fov*Math.PI/360),h=(SY[0]+2.5)-(cy[6]-2.2),w=7.4;const info=$('.info',root);return Math.max(h/2/vf,w/2/(vf*a))*1.08}
 function reset(){focusId=null;gt.set(-.6,((SY[0]+2.5)+(cy[6]-2.2))/2,0);grad=fit();gth=.5;gphi=1.38}
 const ptrs=new Map();let down=null,pinch=null;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});lastUser=performance.now();if(ptrs.size===1)down={x:e.clientX,y:e.clientY,t:performance.now(),moved:false,btn:e.button,shift:e.shiftKey};if(ptrs.size===2){const [p,q]=[...ptrs.values()];pinch={d:Math.hypot(p.x-q.x,p.y-q.y),mx:(p.x+q.x)/2,my:(p.y+q.y)/2};if(down)down.moved=true}});
 cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p){if(e.pointerType==='mouse')hoverAt(e);return}const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;lastUser=performance.now();
  if(ptrs.size===1&&down){if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)down.moved=true;if(down.btn===2||down.shift)pan(dx,dy);else{gth-=dx*.006;gphi=Math.min(Math.PI-.12,Math.max(.12,gphi-dy*.006))}}
  else if(ptrs.size===2&&pinch){const [a,b]=[...ptrs.values()],d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;grad=Math.min(45,Math.max(.6,grad*pinch.d/Math.max(d,1)));pan(mx-pinch.mx,my-pinch.my);pinch={d,mx,my}}});
 const up=e=>{if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(ptrs.size===0&&down){if(!down.moved&&performance.now()-down.t<600&&e.type==='pointerup'){const id=hit(e.clientX,e.clientY);onPick(id)}down=null}};
 let overCv=false,holdUntil=0;cv.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')overCv=true});cv.addEventListener('pointerleave',()=>{overCv=false});cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!ptrs.size)onHover(null)});cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('wheel',e=>{e.preventDefault();lastUser=performance.now();grad=Math.min(45,Math.max(.6,grad*Math.exp(e.deltaY*.0012)))},{passive:false});
 cv.addEventListener('keydown',e=>{const k=e.key;if(k==='ArrowLeft')gth+=.15;else if(k==='ArrowRight')gth-=.15;else if(k==='ArrowUp')gphi=Math.max(.12,gphi-.12);else if(k==='ArrowDown')gphi=Math.min(Math.PI-.12,gphi+.12);else if(k==='+'||k==='=')grad*=.85;else if(k==='-')grad/=.85;else return;e.preventDefault();lastUser=performance.now()});
 function pan(dx,dy){const s=rad*Math.tan(cam.fov*Math.PI/360)*2/Math.max(1,cv.clientHeight);const r=new T.Vector3().setFromMatrixColumn(cam.matrix,0),u=new T.Vector3().setFromMatrixColumn(cam.matrix,1);gt.addScaledVector(r,-dx*s).addScaledVector(u,dy*s)}
 const ray=new T.Raycaster(),nd=new T.Vector2();
 function hit(cx,cy2){const r=cv.getBoundingClientRect();nd.set((cx-r.left)/r.width*2-1,-((cy2-r.top)/r.height)*2+1);ray.setFromCamera(nd,cam);
  const vis=pick.filter(m=>{let o=m;while(o){if(!o.visible)return false;o=o.parent}return true});const hs=ray.intersectObjects(vis,false);if(!hs.length)return null;const solid=hs.find(h=>!h.object.userData.shell)||hs[0];const sm=hs.find(h=>!h.object.userData.shell&&TINY.has(h.object.userData.part)&&h.distance<=solid.distance+.15);return (sm||solid).object.userData.part}
 const TINY=new Set(['sensors','atten','filters','circ','twpa','hemt','qubits','resonators','clamps']);
 let hq=null;function hoverAt(e){hq=[e.clientX,e.clientY]}
 /* --- focus a part --- */
 const box=new T.Box3(),tmp=new T.Box3();function partBox(id){box.makeEmpty();(parts[id]?parts[id].meshes:[]).forEach(m=>{if(!m.geometry)return;m.updateWorldMatrix(true,false);if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();tmp.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);box.union(tmp)});return box}
 function focus(id){focusId=id;if(/^(qubits|resonators|chip)$/.test(id))chipDetail();const b=partBox(id);if(b.isEmpty())return;holdUntil=performance.now()+8000;const c=b.getCenter(new T.Vector3()),s=b.getSize(new T.Vector3());gt.copy(c);const big=Math.max(s.x,s.y,s.z);grad=Math.min(40,Math.max(id==='qubits'||id==='resonators'||id==='chip'?.9:1.6,big*2.1));if(/^(qubits|resonators|chip|package)$/.test(id)){gth=0;gphi=1.5}else if(id!=='electronics'&&Math.hypot(c.x,c.z)>.25&&big<3){const az=Math.atan2(c.x,c.z);let d=az-gth;d=Math.atan2(Math.sin(d),Math.cos(d));gth+=d;let k=0,bd=1e9;cy.forEach((y,i)=>{if(i<6&&Math.abs(y-c.y)<bd){bd=Math.abs(y-c.y);k=i}});gphi=c.y<cy[k]-.02?1.78:1.25}{const inf=$('.info',root);if(innerWidth<820&&inf&&!inf.classList.contains('empty')){gt.y-=2*grad*Math.tan(cam.fov*Math.PI/360)*.22}}lastUser=performance.now()}
 /* --- explode, shields, auto --- */
 let ex=0,gex=0;
 /* --- labels --- */
 const lbs=LABELS.filter(([id])=>parts[id]).map(([id,kind])=>{const b=document.createElement('button');b.type='button';b.className='lb';b.dataset.id=id;b.innerHTML=`<i></i><span>${esc(BY[id]?BY[id].name.replace(/ \(.*\)$/,''):id)}</span>`;b.setAttribute('aria-label',BY[id]?BY[id].name:id);
  b.onclick=()=>select(id,true);b.onmouseenter=()=>onHover(id);b.onmouseleave=()=>onHover(null);lbBox.appendChild(b);return {id,kind,b,v:new T.Vector3()}});
 const v3=new T.Vector3();function placeLabels(){const W=cv.clientWidth,Hh=cv.clientHeight;lbs.forEach(L=>{let show=true;if(L.kind==='shell'&&!shieldsOn)show=false;if(L.kind==='near'&&rad>3.2)show=false;if(L.kind!=='near'&&L.kind!=='shell'&&rad<1.4)show=false;
  if(show){const b=partBox(L.id);if(b.isEmpty())show=false;else if(L.id.startsWith('plate')||L.kind==='shell'){const c=b.getCenter(v3);L.v.set(b.max.x*.98,c.y,0)}else if(L.kind==='near'){b.getCenter(L.v);L.v.x=b.max.x}else b.getCenter(L.v);
   v3.copy(L.v).project(cam);if(v3.z>1||Math.abs(v3.x)>1.05||Math.abs(v3.y)>1.05)show=false;else L.b.style.transform=`translate(${((v3.x+1)/2*W-7).toFixed(1)}px,${((1-v3.y)/2*Hh-7).toFixed(1)}px)`}
  L.show=show;L.x=(v3.x+1)/2*W;L.y=(1-v3.y)/2*Hh});
  const noTxt=root.classList.contains('nolabels'),placed=[],ord=lbs.filter(L=>L.show).sort((a,b)=>(b.id===pinned||b.id===hoverId)-(a.id===pinned||a.id===hoverId));
  ord.forEach(L=>{const w=noTxt?18:(L.w>30?L.w:((L.w=L.b.offsetWidth)>30?L.w:130)),h=noTxt?18:24,r=[L.x-9,L.y-12,L.x-9+w,L.y+12];const clash=placed.some(p=>!(r[2]<p[0]||r[0]>p[2]||r[3]<p[1]||r[1]>p[3]));if(clash&&L.id!==pinned&&L.id!==hoverId)L.show=false;else placed.push(r)});
  lbs.forEach(L=>L.b.classList.toggle('hid',!L.show))}
 /* --- larger invisible hitboxes for small parts --- */
 {const HB=new T.MeshBasicMaterial({visible:false}),SMALL=['sensors','atten','filters','circ','twpa','hemt','feed','qubits','resonators','hex'];const bb=new T.Box3(),sz=new T.Vector3(),ce=new T.Vector3();
  proxyFor=id=>{if(!parts[id])return;parts[id].meshes.slice().forEach(m=>{if(!m.geometry||m.isInstancedMesh||m.geometry.type==='TubeGeometry')return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();bb.copy(m.geometry.boundingBox);bb.getSize(sz);bb.getCenter(ce);
   const mn=/^(qubits|resonators)$/.test(id)?.02:id==='sensors'?.13:.07,k=/^(coaxIn|coaxOut|dcLines|condLine)$/.test(id)?1:1.5;const b=new T.Mesh(new T.BoxGeometry(Math.max(sz.x*k,mn),Math.max(sz.y*k,/^(coax|dc|cond)/.test(id)?.001:mn),Math.max(sz.z*k,mn)),HB);b.position.copy(ce);b.userData.part=id;b.userData.proxy=1;m.add(b);pick.push(b)})};SMALL.forEach(proxyFor)}
 /* --- helium flow particles --- */
 const flw={on:false,t:0,grp:new T.Group()};flw.grp.visible=false;scene.add(flw.grp);
 const fM3=new T.MeshBasicMaterial({color:0x3fa9ff,toneMapped:false,depthTest:false}),fMd=new T.MeshBasicMaterial({color:0xc084fc,toneMapped:false,depthTest:false}),fMg=new T.MeshBasicMaterial({color:0xe6edf5,toneMapped:false,depthTest:false});
 const fDots=[];for(let k=0;k<60;k++){const m=new T.Mesh(new T.SphereGeometry(.055,10,8),fM3);m.renderOrder=10;flw.grp.add(m);fDots.push(m)}
 function flowPath(){const out=[],add=(x,y,z,c)=>out.push({v:new T.Vector3(x,y,z),c});const [cx,cz]=P(.72,-110),[hx,hz]=P(.5,-120),[sx,sz2]=P(1.0,-140);
  add(cx,cy[0]+.3,cz,'3');add(cx,cy[2]-.2,cz,'3');add(cx,cy[3],cz,'3');add(cx,cy[4],cz,'3');add(hx+.2,cy[4]-.1,hz,'3');add(hx+.17,cy[5]+.06,hz,'3');add(hx,cy[5]-.25,hz,'3');
  add(hx-.05,cy[5]-.35,hz,'d');add(hx-.17,cy[5]+.06,hz,'d');add(hx-.17,cy[4]-.06,hz,'d');add(hx,cy[3]-.5,hz,'d');add(sx,cy[3]-.4,sz2,'d');add(sx,cy[3]-.2,sz2,'g');add(sx,cy[0]+.8,sz2,'g');add(sx-.6,cy[0]+1.09,sz2,'g');add(sx-1.6,cy[0]+1.09,sz2,'g');return out}
 function flowFrame(dt){if(!flw.on)return;const pts=flowPath(),n=pts.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+pts[i].v.distanceTo(pts[i-1].v));const L=cum[n-1];flw.t=(flw.t+dt/18)%1;
  fDots.forEach((m,k)=>{const d=((flw.t+k/fDots.length)%1)*L;let i=1;while(i<n-1&&cum[i]<d)i++;const a=pts[i-1],b=pts[i],f=(d-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]);m.position.lerpVectors(a.v,b.v,f);m.material=b.c==='3'?fM3:b.c==='d'?fMd:fMg;m.scale.setScalar(b.c==='g'?1.4:1)})}
 /* --- signal path animation --- */
 const sig={on:false,pause:false,t:0,grp:new T.Group()};sig.grp.visible=false;scene.add(sig.grp);
 const sLine=new T.Mesh(new T.BufferGeometry(),new T.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:.5,depthTest:false,toneMapped:false}));sLine.renderOrder=9;sig.grp.add(sLine);let sKey='';
 const dIn=new T.MeshBasicMaterial({color:0x22d3ee,toneMapped:false,depthTest:false}),dOut=new T.MeshBasicMaterial({color:0xfbbf24,toneMapped:false,depthTest:false});const dots=[];for(let k=0;k<9;k++){const m=new T.Mesh(new T.SphereGeometry(.11-k*.008,16,12),dIn);m.renderOrder=10;sig.grp.add(m);dots.push(m)}
 const V=(x,y,z)=>new T.Vector3(x,y,z);
 function sigPath(){const out=[],add=(v,st,o)=>out.push({v,st,o:!!o});const [xi,zi]=P(1.0,50),[xi2,zi2]=P(.32,50),[xo,zo]=P(1.0,22),[xo2,zo2]=P(.3,22),[xt,zt]=P(.95,-28);
  CAB[50].getPoints(24).forEach(v=>add(v,0));add(V(xi,cy[0],zi),1);add(V(xi,cy[2]-.05,zi),1);add(V(xi,cy[2]-.2,zi),2);add(V(xi,cy[5]-.1,zi),2);add(V(xi,cy[5]-.42,zi),3);
  for(let k=1;k<=6;k++){const t=k/6,s2=t*t*(3-2*t);add(V(xi+(xi2-xi)*s2,cy[5]-.42+(cy[6]-cy[5]+.42)*t,zi+(zi2-zi)*s2),3)}add(V(xi2*.5,cy[6]-.5,.1),4);add(V(0,cy[6]-.75,.1),4);
  add(V(0,cy[6]-.75,.1),5,1);add(V(xo2,cy[6]-.4,zo2),5,1);for(let k=1;k<=6;k++){const t=k/6,s2=t*t*(3-2*t);add(V(xo2+(xo-xo2)*s2,cy[6]+(cy[5]-.3-cy[6])*t,zo2+(zo-zo2)*s2),5,1)}
  add(V(xo,cy[5]-.1,zo),5,1);add(V(xt,cy[5]-.14,zt),6,1);add(V(xo,cy[5]-.05,zo),6,1);add(V(xo,cy[2]-.3,zo),6,1);add(V(xo,cy[2]-.15,zo),7,1);add(V(xo,cy[0]+.1,zo),7,1);
  CAB[22].getPoints(24).reverse().forEach(v=>add(v,8,1));return out}
 const sPos=new T.Vector3();function sigFrame(dt){if(!sig.on)return;const pts=sigPath(),n=pts.length,cum=[0];for(let i=1;i<n;i++)cum.push(cum[i-1]+pts[i].v.distanceTo(pts[i-1].v));const L=cum[n-1];
  const key=cy.map(v=>v.toFixed(3)).join();if(key!==sKey){sKey=key;sLine.geometry.dispose();sLine.geometry=new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>p.v),false,'catmullrom',0),pts.length*3,.045,6)}if(!sig.pause)sig.t=(sig.t+dt/14)%1;
  const at=d=>{d=Math.max(0,Math.min(L,d));let i=1;while(i<n-1&&cum[i]<d)i++;const a=pts[i-1],b=pts[i],f=(d-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]);sPos.lerpVectors(a.v,b.v,f);return b};
  const head=sig.t*L;let hp=null;dots.forEach((m,k)=>{const p=at(head-k*.07);m.position.copy(sPos);m.material=p.o?dOut:dIn;m.visible=head-k*.07>0;if(!k)hp=p});sigStep(hp.st,sig.t)}
 /* --- loop --- */
 let focusId=null,raf=0,last=performance.now(),running=false,onScreen=true,dirty=3,frames=0,idleFrames=0;
 function kick(n){dirty=Math.max(dirty,n||2);if(running&&!raf&&onScreen&&!document.hidden){last=performance.now();raf=requestAnimationFrame(loop)}}
 /* level of detail: bolts, pads, clamps, sensors only near the camera */
 const DET=[];scene.traverse(o=>{if(o.isInstancedMesh)DET.push(o)});['clamps','sensors'].forEach(id=>parts[id]&&parts[id].meshes.forEach(m=>DET.push(m)));
 const wp=new T.Vector3();function lod(){const D=8.5;for(const o of DET){o.getWorldPosition(wp);const near=cam.position.distanceTo(wp)<D||rad<6||(o.userData.part&&o.userData.part===focusId)||(o.userData.part&&(o.userData.part===pinned||o.userData.part===hoverId));if(o.visible!==near){o.visible=near;dirty=Math.max(dirty,2)}}}
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{onScreen=es[es.length-1].isIntersecting;if(onScreen)kick(2);else if(raf){cancelAnimationFrame(raf);raf=0}}).observe(cv);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick(2)});
 ['pointerdown','pointermove','pointerup','wheel','keydown','pointerenter'].forEach(e=>cv.addEventListener(e,()=>kick(2),{passive:true}));addEventListener('resize',()=>kick(2));const ro=new ResizeObserver(()=>size());ro.observe(stage);
 function size(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
 function loop(t){raf=0;if(!running||document.hidden||!onScreen)return;const dt=Math.min(.12,(t-last)/1000);last=t;
  const busy=dirty>0||(auto&&!overCv&&t>holdUntil)||Math.abs(gex-ex)>1e-4||tgt.distanceToSquared(gt)>1e-9||Math.abs(grad-rad)>1e-4*rad||Math.abs(gth-th)>1e-5||Math.abs(gphi-phi)>1e-5||hq||sig.on||flw.on;
  if(!busy){lod();if(!(dirty>0)){idleFrames++;return}}if(dirty>0)dirty--;frames++;
  if(!chipBuilt&&rad<4.5)chipDetail();if(frames%6===1)lod();
  if(auto&&!overCv&&t>holdUntil&&t-lastUser>2500)gth+=dt*.25;const k=1-Math.pow(.0009,dt);
  if(Math.abs(gex-ex)>1e-4){ex+=(gex-ex)*Math.min(1,dt*4);if(Math.abs(gex-ex)<.002)ex=gex;const e=ex*ex*(3-2*ex);cy=SY.map((y,i)=>y+(Ye[i]-y)*e);layout()}
  tgt.lerp(gt,k);rad+=(grad-rad)*k;th+=(gth-th)*k;phi+=(gphi-phi)*k;
  cam.position.set(tgt.x+rad*Math.sin(phi)*Math.sin(th),tgt.y+rad*Math.cos(phi),tgt.z+rad*Math.sin(phi)*Math.cos(th));cam.lookAt(tgt);cam.updateMatrixWorld();
  if(hq){const id=hit(hq[0],hq[1]);hq=null;onHover(id)}
  sigFrame(dt);flowFrame(dt);ren.render(scene,cam);placeLabels();raf=requestAnimationFrame(loop)}
 size();reset();rad=grad*1.5;tgt.copy(gt);
 const API={kick(){},start(){cancelAnimationFrame(raf);raf=0;running=true;size();lod();kick(3)},stop(){running=false;cancelAnimationFrame(raf);raf=0},glow,focus,reset,
  explode(on){this.explodeTo(on?1:0)},explodeTo(v){gex=v;const yb=SY[6]+(Ye[6]-SY[6])*v*v*(3-2*v),h=(SY[0]+2.5)-(yb-2.2),m=((SY[0]+2.5)+(yb-2.2))/2;gt.set(-.6,m,0);const a=Math.max(.3,cam.aspect),vf=Math.tan(cam.fov*Math.PI/360);grad=Math.max(h/2/vf,3.7/(vf*a))*1.08},
  flow(on){flw.on=on;flw.grp.visible=on},signal(on){sig.on=on;sig.grp.visible=on;if(on){sig.t=0}},sigPause(p){sig.pause=p},sigPart(id){sigPid=id;glow()},
  shields(on){shieldsOn=on;this.shieldsOn=on;scene.traverse(o=>{if(o.userData.shellGroup)o.visible=on})},shieldsOn:false,auto(on){auto=on},
  _debug:{parts,cam,scene,hit,rimPt:(i)=>{const R=SR[i]*.97,a=Math.atan2(cam.position.x,cam.position.z)+.35,v=new T.Vector3(R*Math.sin(a),cy[i],R*Math.cos(a)).project(cam),r=cv.getBoundingClientRect();return [r.left+(v.x+1)/2*r.width,r.top+(1-v.y)/2*r.height]},projMesh:(id,i)=>{const m=parts[id].meshes[i||0];m.updateWorldMatrix(true,false);if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();const c=m.geometry.boundingBox.getCenter(new T.Vector3()).applyMatrix4(m.matrixWorld).project(cam),r=cv.getBoundingClientRect();return [r.left+(c.x+1)/2*r.width,r.top+(1-c.y)/2*r.height]},project:(id)=>{const b=partBox(id),c=b.getCenter(new T.Vector3()).project(cam),r=cv.getBoundingClientRect();return [r.left+(c.x+1)/2*r.width,r.top+(1-c.y)/2*r.height]}}};for(const k in API)if(typeof API[k]==='function'&&k!=='stop'&&k!=='start'){const f=API[k];API[k]=function(...a){const r=f.apply(this,a);kick(3);return r}}API._debug.chipDetail=chipDetail;API._debug.stats=()=>({frames,idleFrames,raf:!!raf,onScreen,chipBuilt,detVisible:DET.filter(o=>o.visible).length,det:DET.length});return API}
window.QA10HW={open(){if(!root)shell();isOpen=true;root.style.display='';if(eng)eng.start();else boot();setTimeout(()=>{const c=$('canvas.gl',root);c&&c.focus({preventScroll:true})},60)},
 close(){isOpen=false;if(eng)eng.stop()},get engine(){return eng},select:id=>select(id,true)};
})();
