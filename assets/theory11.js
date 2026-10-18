/* Quantum Atlas v11: plain-English hardware theory + small interactive widgets (shared by Hardware and Practical Knowledge). Quantura Technologies */
(function(){const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const css=(v,d)=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||d;
/* ---------- SVG diagrams ---------- */
const SVG_JJ=`<svg class="dg11" viewBox="0 0 520 220" role="img" aria-label="A transmon: two capacitor pads joined by a Josephson junction, and its uneven energy ladder">
<rect x="20" y="40" width="120" height="140" rx="14" class="pad"/><rect x="200" y="40" width="120" height="140" rx="14" class="pad"/>
<path d="M140 110h24M176 110h24" class="wire"/><rect x="160" y="94" width="20" height="32" class="jj"/><path d="M160 94l20 32M180 94l-20 32" class="wire"/>
<text x="80" y="200" class="lbl">pad</text><text x="260" y="200" class="lbl">pad</text><text x="170" y="84" class="lbl">junction</text>
<path d="M350 196h110M350 140h110M350 92h110M350 54h110" class="lev"/><text x="468" y="202" class="lbl s">|0⟩</text><text x="468" y="146" class="lbl s">|1⟩</text><text x="468" y="98" class="lbl s">|2⟩</text>
<path d="M372 192v-48" class="arr a"/><path d="M412 136v-40" class="arr b"/><text x="352" y="172" class="lbl t">5.0 GHz</text><text x="420" y="122" class="lbl t">4.7 GHz</text></svg>`;
const SVG_CP=`<svg class="dg11" viewBox="0 0 520 150" role="img" aria-label="Cooper pairs pass through the thin insulating layer of a Josephson junction">
<rect x="20" y="30" width="200" height="90" rx="10" class="sc"/><rect x="236" y="30" width="18" height="90" class="ox"/><rect x="270" y="30" width="230" height="90" rx="10" class="sc"/>
<g class="cp"><circle cx="90" cy="64" r="9"/><circle cx="110" cy="64" r="9"/><circle cx="150" cy="96" r="9"/><circle cx="170" cy="96" r="9"/><circle cx="330" cy="70" r="9"/><circle cx="350" cy="70" r="9"/></g>
<path d="M190 75 Q245 40 300 75" class="arr a"/><text x="120" y="142" class="lbl">aluminium</text><text x="245" y="20" class="lbl">oxide, ~2 nm</text><text x="385" y="142" class="lbl">aluminium</text></svg>`;
/* ---------- widgets ---------- */
function cold(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Temperature</span><input type="range" min="0" max="100" value="100" aria-label="Fridge temperature"></label>
<div class="w11o"><div><small>Temperature</small><b class="tv"></b></div><div><small>Chance a 5 GHz qubit is already "1" by itself</small><b class="pv"></b></div><div><small>Aluminium wiring</small><b class="sv"></b></div></div>
<div class="tb11"><i class="pb"></i></div></div>`;
 const r=$('input',el),f=()=>{const v=+r.value/100,T=Math.pow(10,Math.log10(300)*(1-v)+Math.log10(.01)*v),x=0.24/T,p=1/(1+Math.exp(x));
  $('.tv',el).textContent=T>=1?T.toFixed(T>=10?0:1)+' K':(T*1000).toFixed(0)+' mK';$('.pv',el).textContent=p<1e-4?'almost 0%':(p*100).toFixed(p<.01?3:1)+'%';$('.sv',el).textContent=T<1.2?'superconducting':'normal metal';$('.sv',el).className='sv '+(T<1.2?'ok':'no');$('.pb',el).style.width=(p*200).toFixed(1)+'%'};r.oninput=f;r.value=80;f()}
function decay(el){el.innerHTML=`<div class="w11"><div class="w11g"><label class="rg"><span>T1</span><input type="range" class="t1" min="10" max="500" value="150" aria-label="T1 in microseconds"><b class="t1v"></b></label>
<label class="rg"><span>T2</span><input type="range" class="t2" min="5" max="1000" value="120" aria-label="T2 in microseconds"><b class="t2v"></b></label></div>
<canvas width="900" height="320" aria-label="Graph of energy decay (T1) and phase decay (T2) over time"></canvas>
<div class="lg11"><span class="l1">Chance it is still 1 (energy, T1)</span><span class="l2">Phase memory (T2)</span></div>
<p class="w11n"></p></div>`;
 const cv=$('canvas',el),x=cv.getContext('2d'),a=$('.t1',el),b=$('.t2',el);
 const f=()=>{let T1=+a.value,T2=+b.value;if(T2>2*T1){T2=2*T1;b.value=T2}$('.t1v',el).textContent=T1+' µs';$('.t2v',el).textContent=T2+' µs';
  const W=900,H=320,P=40,tm=Math.max(4*T1,4*T2,200),A=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),M=css('--mut','#94a9cc'),L=css('--line2','rgba(120,160,255,.3)');x.clearRect(0,0,W,H);
  x.strokeStyle=L;x.lineWidth=1;for(let i=0;i<=4;i++){const yy=P+(H-2*P)*i/4;x.beginPath();x.moveTo(P,yy);x.lineTo(W-10,yy);x.stroke()}
  x.fillStyle=M;x.font='600 22px Inter,sans-serif';x.fillText('0 µs',P,H-8);x.textAlign='right';x.fillText(Math.round(tm)+' µs',W-10,H-8);x.textAlign='left';
  const plot=(fn,c,w)=>{x.strokeStyle=c;x.lineWidth=w;x.beginPath();for(let i=0;i<=600;i++){const t=tm*i/600,v=fn(t),X=P+(W-P-10)*i/600,Yp=P+(H-2*P)*(1-v);i?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke()};
  plot(t=>.5+.5*Math.exp(-t/T2)*Math.cos(2*Math.PI*t/(tm/9)),Y,2);plot(t=>Math.exp(-t/T1),A,5);
  const g=Math.round(T2/0.05);$('.w11n',el).innerHTML=`With T2 = <b>${T2} µs</b> and 50 ns gates, about <b>${g.toLocaleString('en')}</b> gates fit before the phase is mostly lost. T2 can never be more than 2 × T1.`};
 a.oninput=f;b.oninput=f;f();new MutationObserver(f).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-skin']})}
function fid(el){el.innerHTML=`<div class="w11"><div class="w11g"><label class="rg"><span>Error per gate</span><input type="range" class="e" min="0" max="100" value="50" aria-label="Error per gate"><b class="ev"></b></label>
<label class="rg"><span>Number of gates</span><input type="range" class="n" min="1" max="100" value="40" aria-label="Number of gates"><b class="nv"></b></label></div>
<div class="tb11 big"><i class="pb"></i><b class="pv"></b></div><p class="w11n"></p></div>`;
 const e=$('.e',el),n=$('.n',el),f=()=>{const er=Math.pow(10,-4+2.3*(+e.value/100)),N=Math.round(Math.pow(10,4*(+n.value/100))),p=Math.pow(1-er,N);
  $('.ev',el).textContent=(er*100).toFixed(er<.001?3:2)+'%';$('.nv',el).textContent=N.toLocaleString('en');$('.pb',el).style.width=(p*100).toFixed(1)+'%';$('.pv',el).textContent=(p*100).toFixed(p<.01?2:0)+'% chance of no error';
  $('.w11n',el).innerHTML=p>.5?'Good enough to run as is.':p>.05?'Noisy. Error mitigation can still rescue an average answer.':'The answer is mostly noise. This is why error correction is needed.'};e.oninput=f;n.oninput=f;f()}
function rabi(el){el.innerHTML=`<div class="w11"><div class="w11g"><label class="rg"><span>Pulse length</span><input type="range" class="pl" min="0" max="100" value="40" aria-label="Pulse length in nanoseconds"><b class="plv"></b></label>
<label class="rg"><span>Strength</span><input type="range" class="pa" min="0" max="100" value="100" aria-label="Pulse strength"><b class="pav"></b></label>
<label class="rg"><span>Off-tune</span><input type="range" class="pd" min="0" max="30" value="0" aria-label="Pulse frequency error in MHz"><b class="pdv"></b></label></div>
<div class="two11"><canvas class="cr" width="560" height="300" aria-label="Chance of 1 against pulse length"></canvas><canvas class="cp" width="360" height="300" aria-label="Shape of the microwave pulse"></canvas></div>
<div class="w11o"><div><small>Turn of the arrow</small><b class="av"></b></div><div><small>Chance of reading 1</small><b class="p1"></b></div><div><small>This pulse is</small><b class="gv"></b></div></div></div>`;
 const L=$('.pl',el),A=$('.pa',el),D=$('.pd',el),cr=$('.cr',el).getContext('2d'),cp=$('.cp',el).getContext('2d');
 const f=()=>{const t=+L.value,O=12.5*(+A.value/100),d=+D.value,Og=Math.hypot(O,d),P=tt=>Og?O*O/(Og*Og)*Math.sin(Math.PI*Og*tt/1000)**2:0,th=2*Math.PI*O*t/1000;
  $('.plv',el).textContent=t+' ns';$('.pav',el).textContent=A.value+'%';$('.pdv',el).textContent=d+' MHz';$('.av',el).textContent=Math.round(th*180/Math.PI)+'°';const p1=P(t);$('.p1',el).textContent=Math.round(p1*100)+'%';
  const deg=(th*180/Math.PI)%360;$('.gv',el).textContent=d>3?'off-target (wrong frequency)':Math.abs(deg-180)<12?'an X gate (half turn)':Math.abs(deg-90)<10?'a √X gate (quarter turn)':deg<8?'almost nothing':'a partial turn';
  const B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),M=css('--mut','#94a9cc'),Ln=css('--line2','rgba(120,160,255,.3)');
  cr.clearRect(0,0,560,300);cr.strokeStyle=Ln;cr.lineWidth=1;[40,150,260].forEach(y=>{cr.beginPath();cr.moveTo(40,y);cr.lineTo(550,y);cr.stroke()});cr.fillStyle=M;cr.font='600 16px Inter,sans-serif';cr.fillText('1',22,46);cr.fillText('0',22,266);cr.fillText('0 ns',40,292);cr.textAlign='right';cr.fillText('100 ns',550,292);cr.textAlign='left';
  cr.strokeStyle=B;cr.lineWidth=4;cr.beginPath();for(let i=0;i<=300;i++){const tt=i/3,X=40+510*i/300,Yp=260-220*P(tt);i?cr.lineTo(X,Yp):cr.moveTo(X,Yp)}cr.stroke();const mx=40+510*t/100,my=260-220*p1;cr.fillStyle=Y;cr.beginPath();cr.arc(mx,my,9,0,6.3);cr.fill();
  cp.clearRect(0,0,360,300);cp.strokeStyle=Ln;cp.beginPath();cp.moveTo(10,150);cp.lineTo(350,150);cp.stroke();const a=+A.value/100;cp.strokeStyle=Y;cp.lineWidth=2.5;cp.beginPath();for(let i=0;i<=340;i++){const u=i/340,env=t?Math.exp(-(((u-.5)/.18)**2)):0,v=a*env*Math.sin(u*2*Math.PI*Math.max(3,t/2.2));const X=10+i,Yp=150-110*v;i?cp.lineTo(X,Yp):cp.moveTo(X,Yp)}cp.stroke();cp.fillStyle=M;cp.font='600 15px Inter,sans-serif';cp.fillText('pulse shape',14,286)};
 [L,A,D].forEach(r=>r.oninput=f);f()}
function erfc(x){const t=1/(1+.5*Math.abs(x)),y=t*Math.exp(-x*x-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));return x>=0?y:2-y}
function iq(el){el.innerHTML=`<div class="w11"><div class="w11g"><label class="rg"><span>Listen time</span><input type="range" class="rt" min="1" max="40" value="8" aria-label="Readout time"><b class="rtv"></b></label></div>
<div class="two11"><canvas class="ci" width="520" height="420" aria-label="Readout results on the IQ plane: one cloud for 0, one for 1"></canvas><div><div class="w11o one"><div><small>Readout accuracy</small><b class="fv"></b></div><div><small>1s that decayed to 0 while listening</small><b class="dv"></b></div></div>
<div class="btns"><button type="button" class="pri nshot">New 400 shots</button></div><div class="lg11"><span class="l1">Qubit made in 0</span><span class="l2">Qubit made in 1</span></div></div></div></div>`;
 const R=$('.rt',el),x=$('.ci',el).getContext('2d');let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},gs=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(2*Math.PI*rnd());
 const f=()=>{const t=+R.value*.05,sg=34/Math.sqrt(t/.4),T1=60,pd=1-Math.exp(-t/T1/2),fid=1-.5*(erfc(70/(sg*Math.SQRT2))+pd);$('.rtv',el).textContent=t.toFixed(2)+' µs';$('.fv',el).textContent=(fid*100).toFixed(1)+'%';$('.dv',el).textContent=(pd*100).toFixed(1)+'%';
  const B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),M=css('--mut','#94a9cc'),Ln=css('--line2','rgba(120,160,255,.3)');x.clearRect(0,0,520,420);x.strokeStyle=Ln;x.lineWidth=1;x.beginPath();x.moveTo(20,210);x.lineTo(500,210);x.moveTo(260,20);x.lineTo(260,400);x.stroke();
  x.setLineDash([8,6]);x.strokeStyle=M;x.lineWidth=2;x.beginPath();x.moveTo(260,20);x.lineTo(260,400);x.stroke();x.setLineDash([]);x.fillStyle=M;x.font='700 15px Inter,sans-serif';x.fillText('read as 0',40,40);x.textAlign='right';x.fillText('read as 1',490,40);x.textAlign='left';x.fillText('I',505,206);x.fillText('Q',266,32);
  const s0=seed;for(let k=0;k<400;k++){const one=k%2===1;let cx=one?330:190;if(one&&rnd()<pd*2)cx=190+140*rnd();const px=cx+gs()*sg,py=210+gs()*sg;x.fillStyle=one?Y:B;x.globalAlpha=.75;x.beginPath();x.arc(px,py,3.2,0,6.3);x.fill()}x.globalAlpha=1;seed=s0};
 R.oninput=f;$('.nshot',el).onclick=()=>{seed=Math.floor(Math.random()*1e6)+1;f()};f()}
/* ---------- hardware "How it works" dialog ---------- */
const TABS=[['Qubits',`<h4>A qubit made from a circuit</h4><p>A <b>transmon</b> is the most common superconducting qubit (used by IBM and Google). It is a small electric circuit printed on a chip: two metal pads (a capacitor) joined by a <b>Josephson junction</b>.</p>${SVG_CP}
<p>A Josephson junction is two layers of superconducting aluminium with an insulating layer only about 2 nanometres thick in between. Pairs of electrons (<b>Cooper pairs</b>) pass through this layer by quantum tunnelling, with no resistance.</p>${SVG_JJ}
<p>Charge sloshes between the pads like water between two tanks, so the circuit has <b>energy levels</b>, just like an atom. The lowest is |0⟩ and the next is |1⟩.</p>
<p>A plain capacitor and coil would have evenly spaced levels, so a pulse meant for 0→1 would also push 1→2. The junction makes the spacing <b>uneven</b> (about 200 to 300 MHz difference). Now a 5.0 GHz pulse only moves the qubit between 0 and 1.</p>
<div class="kf"><b>Key numbers</b><span>Qubit frequency: 4 to 8 GHz</span><span>Single-qubit gate: 20 to 50 ns</span><span>Two-qubit gate: about 50 to 500 ns</span><span>Readout: about 0.5 to 2 µs</span></div>`],
['Why so cold',`<h4>Two reasons to be at 10 mK</h4><p><b>1. Superconductivity.</b> Aluminium only becomes a superconductor below about 1.2 K. Only then can current flow with no loss, so the circuit can hold a quantum state.</p>
<p><b>2. Heat noise.</b> Heat is random jiggling energy. At temperature T, the typical energy of that jiggling is k×T. A 5 GHz qubit has an energy step equal to the heat energy at about 0.24 K. If the fridge is warmer than that, heat alone flips the qubit to 1 at random.</p>
<div data-w="cold"></div><p>At 10 mK, heat is about 24 times too weak to flip the qubit, so the qubit starts reliably in |0⟩.</p>
<h4>How the fridge gets there</h4><p>A <b>pulse tube cooler</b> uses helium gas compressed and expanded again and again to reach about 50 K and 4 K. Below that, a <b>dilution unit</b> takes over. It uses a mix of two kinds of helium, helium-3 and helium-4. When helium-3 atoms cross from a helium-3 rich layer into a helium-4 rich layer in the mixing chamber, they absorb heat, like sweat cooling your skin as it evaporates. The still pumps helium-3 away so the process keeps going.</p>
<p>Cooling down from room temperature takes about 1 to 2 days.</p>`],
['Control and readout',`<h4>Talking to a qubit with microwaves</h4><p><b>Control (XY) lines</b> carry microwave pulses at the qubit frequency. The pulse length and strength set how far the qubit's arrow turns: an X gate is a half-turn, a √X gate is a quarter-turn. The pulse's phase sets the direction of the turn.</p>
<p><b>Flux (Z) lines</b> carry small currents that make a magnetic field through a loop in the qubit, which tunes its frequency. Many chips use this to switch couplers on and off for two-qubit gates.</p>
<p><b>Readout</b> uses a resonator next to each qubit. Its ringing frequency shifts by a small amount (about 1 MHz) depending on whether the qubit is 0 or 1. A weak tone is sent in and the echo is measured. This is called <b>dispersive readout</b>.</p>
<h4>Why the input lines lose so much signal</h4><p>The room-temperature cable carries heat noise at 300 K. The attenuators reduce both the signal and that noise by about a million times. The pulse starts strong, so it still arrives with enough power, but the noise from the room is gone.</p>
<h4>Why the output needs amplifiers</h4><p>The readout echo has very little power, less than a millionth of a billionth of a watt. A <b>TWPA</b> amplifies it at 10 mK with almost no added noise. Then a <b>HEMT</b> amplifier at 4 K makes it strong enough to travel to room temperature. Circulators make sure amplifier noise cannot travel back down to the qubit.</p>
<div class="btns"><button type="button" class="pri play11">〰 Show the signal path in 3D</button></div>`],
['Decoherence',`<h4>Why qubits forget</h4><p><b>Decoherence</b> is the qubit slowly leaking its quantum information into its surroundings. Two numbers describe it:</p>
<p><b>T1 (energy lifetime).</b> A qubit in |1⟩ gives its energy away and falls to |0⟩. T1 is the time for this to happen to about 63% of qubits. Causes: defects in the chip's surface (tiny "two-level systems"), stray microwaves, radiation from cosmic rays and radioactivity.</p>
<p><b>T2 (phase lifetime).</b> A qubit in superposition also slowly loses track of its phase, the direction its arrow points around the sphere. Small, random changes in its frequency cause this, for example from magnetic flux noise. T2 includes T1 losses too, so T2 can be at most 2 × T1.</p>
<div data-w="decay"></div>
<p>Today's best transmons have T1 and T2 of about 100 to 500 µs, with a few research devices reaching about 1 ms. A useful rule: the number of gates you can do is roughly T2 divided by the gate time.</p>`]];
function mount(el,o){if(!el||el._m)return;el._m=1;const tb=$('.thtabs',el),bd=$('.thbody',el);
 tb.innerHTML=TABS.map((t,i)=>`<button type="button" role="tab" aria-selected="${i?'false':'true'}" data-i="${i}">${t[0]}</button>`).join('');
 const show=i=>{$$('button',tb).forEach(b=>b.setAttribute('aria-selected',b.dataset.i==i?'true':'false'));bd.innerHTML=TABS[i][1]+'<p class="typ11">ⓘ Numbers here are typical ranges for current superconducting (transmon) machines in dilution refrigerators. Exact temperatures, T1/T2 times, gate speeds and layouts vary by device, vendor and architecture.</p>';bd.scrollTop=0;$$('[data-w]',bd).forEach(w=>W[w.dataset.w](w));const p=$('.play11',bd);if(p)p.onclick=()=>o&&o.play&&o.play()};
 tb.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b)show(+b.dataset.i)});show(0)}
const W={cold,decay,fid,rabi,iq};
window.QA11T={mount,cold,decay,fid,rabi,iq,SVG_JJ,SVG_CP};
document.addEventListener('DOMContentLoaded',init);if(document.readyState!=='loading')init();
function init(){if(init.d)return;init.d=1;{const mk=w=>{if(!w._d&&W[w.dataset.w]){w._d=1;W[w.dataset.w](w)}},L=$$('#real [data-w]');if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);mk(e.target)}}),{rootMargin:'400px 0px'});L.forEach(w=>io.observe(w))}else L.forEach(mk)}$$('#real [data-svg]').forEach(s=>s.innerHTML=s.dataset.svg==='jj'?SVG_JJ:SVG_CP);
 const hb=$('#real .gohw');if(hb)hb.onclick=()=>window.QA10?window.QA10.go('hw'):(location.hash='#hardware')}
})();
