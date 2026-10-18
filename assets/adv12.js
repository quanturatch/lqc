/* Quantum Atlas v12: fault tolerance & advanced theory widgets (surface code, Clifford vs magic, Schmidt, POVM, MaxCut, distillation). Quantura Technologies */
(function(){const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const css=(v,d)=>getComputedStyle(document.documentElement).getPropertyValue(v).trim()||d;
/* ---------- distance-3 rotated surface code ---------- */
const ZS=[[0,1,3,4],[4,5,7,8],[3,6],[2,5]],XS=[[1,2,4,5],[3,4,6,7],[0,1],[7,8]],ZL=[0,1,2],XL=[0,3,6];
const syn=(e,S)=>S.map(st=>st.reduce((a,q)=>a^((e>>q)&1),0));const key=a=>a.join('');const pc=x=>{let c=0;while(x){c+=x&1;x>>=1}return c};
const table=S=>{const t={};for(let e=0;e<512;e++){const k=key(syn(e,S));if(!(k in t)||pc(e)<pc(t[k]))t[k]=e}return t};const TX=table(ZS),TZ=table(XS);
const odd=(r,L)=>L.reduce((a,q)=>a^((r>>q)&1),0);
function decode(ex,ez){const cx=TX[key(syn(ex,ZS))],cz=TZ[key(syn(ez,XS))];return {cx,cz,lx:odd(ex^cx,ZL),lz:odd(ez^cz,XL)}}
function surface(el){el.innerHTML=`<div class="w11"><div class="two11"><svg class="sc12" viewBox="0 0 320 320" role="img" aria-label="Distance-3 surface code: 9 data qubits and 8 checks"></svg>
<div><div class="w11o one"><div><small>Errors placed</small><b class="ne">none</b></div><div><small>Checks that light up (the syndrome)</small><b class="ns">none</b></div><div><small>Result</small><b class="rs">Place an error on a qubit</b></div></div>
<div class="btns"><button type="button" class="pri fix">Decode and fix</button><button type="button" class="clr">Clear</button></div>
<div class="lg11"><span class="l1">X check (catches Z errors)</span><span class="l2">Z check (catches X errors)</span></div></div></div>
<div class="mc12"><label class="rg"><span>Error chance</span><input type="range" class="pp" min="1" max="200" value="30" aria-label="Physical error chance per qubit"><b class="ppv"></b></label>
<div class="btns"><button type="button" class="run">Run 20,000 random rounds</button></div><div class="w11o"><div><small>One bare qubit fails</small><b class="pb1">–</b></div><div><small>Logical qubit fails</small><b class="pl1">–</b></div><div><small>Verdict</small><b class="vd">–</b></div></div></div></div>`;
 const svg=$('svg',el);let ex=0,ez=0,shown=null;const P=(r,c)=>[60+c*100,60+r*100];
 const draw=()=>{const sx=syn(ex,ZS),sz=syn(ez,XS),B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),T=css('--txt','#eaf2ff');let h='';
  const face=(i,j,typ,on)=>{const [x,y]=P(i,j);h+=`<rect x="${x}" y="${y}" width="100" height="100" class="f ${typ}${on?' on':''}"/>`};
  face(0,0,'z',sx[0]);face(1,1,'z',sx[1]);face(0,1,'x',sz[0]);face(1,0,'x',sz[1]);
  const half=(d,typ,on)=>{h+=`<path d="${d}" class="f ${typ}${on?' on':''}"/>`};
  half('M60 160 A50 50 0 0 0 60 260 Z','z',sx[2]);half('M260 60 A50 50 0 0 1 260 160 Z','z',sx[3]);half('M60 60 A50 50 0 0 1 160 60 Z','x',sz[2]);half('M160 260 A50 50 0 0 0 260 260 Z','x',sz[3]);
  for(let q=0;q<9;q++){const [x,y]=P(Math.floor(q/3),q%3),a=(ex>>q)&1,b=(ez>>q)&1,lab=a&&b?'Y':a?'X':b?'Z':'';h+=`<g class="dq" data-q="${q}" tabindex="0" role="button" aria-label="Data qubit ${q+1}${lab?', error '+lab:''}"><circle cx="${x}" cy="${y}" r="20" class="${lab?'err':''}"/><text x="${x}" y="${y+6}">${lab||q+1}</text></g>`}
  svg.innerHTML=h;const n=pc(ex|ez);$('.ne',el).textContent=n?n+' qubit'+(n>1?'s':''):'none';const lit=sx.reduce((a,b)=>a+b,0)+sz.reduce((a,b)=>a+b,0);$('.ns',el).textContent=lit?lit+' of 8':'none';
  if(!shown)$('.rs',el).textContent=n?'Errors placed. Press "Decode and fix".':'Place an error on a qubit';};
 svg.addEventListener('click',e=>{const g=e.target.closest('.dq');if(!g)return;const q=+g.dataset.q,a=(ex>>q)&1,b=(ez>>q)&1,s=(a?1:0)+(b?2:0),n=(s+1)%4;ex=(ex&~(1<<q))|((n&1)<<q);ez=(ez&~(1<<q))|((n>>1&1)<<q);shown=null;draw()});
 svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.closest('.dq')&&e.target.closest('.dq').dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
 $('.fix',el).onclick=()=>{if(!(ex|ez)){$('.rs',el).textContent='No errors to fix.';return}const d=decode(ex,ez);const ok=!d.lx&&!d.lz;shown=1;$('.rs',el).textContent=ok?'Fixed. The logical qubit is safe.':'The decoder was fooled: a logical '+(d.lx&&d.lz?'Y':d.lx?'X':'Z')+' error.';ex=0;ez=0;draw();};
 $('.clr',el).onclick=()=>{ex=ez=0;shown=null;draw()};
 const pp=$('.pp',el),upd=()=>$('.ppv',el).textContent=(+pp.value/10).toFixed(1)+'%';pp.oninput=upd;upd();
 $('.run',el).onclick=()=>{const p=+pp.value/1000,N=20000;let f=0;for(let k=0;k<N;k++){let a=0,b=0;for(let q=0;q<9;q++){if(Math.random()<p)a|=1<<q;if(Math.random()<p)b|=1<<q}const d=decode(a,b);if(d.lx||d.lz)f++}const pb=1-(1-p)*(1-p),pl=f/N;
  $('.pb1',el).textContent=(pb*100).toFixed(2)+'%';$('.pl1',el).textContent=(pl*100).toFixed(2)+'%';$('.vd',el).textContent=pl<pb?'Code helps':'Code makes it worse'};draw()}
/* ---------- Clifford vs magic (Gottesman–Knill) ---------- */
function clifford(el){el.innerHTML=`<div class="w11"><div class="two11"><canvas width="420" height="380" aria-label="The six stabilizer states as corners of an octahedron and the current qubit state"></canvas>
<div><div class="btns gb12">${['H','S','X','T'].map(g=>`<button type="button" data-g="${g}">${g}</button>`).join('')}<button type="button" data-g="R">Reset</button></div>
<div class="w11o one"><div><small>State</small><b class="st"></b></div><div><small>Gates used</small><b class="gu">none</b></div><div><small>Can a normal computer track this easily?</small><b class="cl"></b></div></div></div></div></div>`;
 let v=[0,0,1],seq=[];const cv=$('canvas',el),x=cv.getContext('2d');
 const G={H:([a,b,c])=>[c,-b,a],S:([a,b,c])=>[-b,a,c],X:([a,b,c])=>[a,-b,-c],T:([a,b,c])=>[(a-b)*Math.SQRT1_2,(a+b)*Math.SQRT1_2,c]};
 const NAMES={'0,0,1':'|0⟩','0,0,-1':'|1⟩','1,0,0':'|+⟩','-1,0,0':'|−⟩','0,1,0':'|+i⟩','0,-1,0':'|−i⟩'};
 const pr=([a,b,c])=>[210+150*(b-a*.55),190-150*(c-a*.3)];
 const draw=()=>{const B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),T=css('--txt','#eaf2ff'),M=css('--mut','#94a9cc');x.clearRect(0,0,420,380);
  const pts=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];x.strokeStyle=M;x.lineWidth=1.5;pts.forEach((p,i)=>pts.forEach((q,j)=>{if(j>i&&p.reduce((s,_,k)=>s+p[k]*q[k],0)===0){const [a,b]=pr(p),[c,d]=pr(q);x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}}));
  x.font='700 15px Inter,sans-serif';x.textAlign='center';pts.forEach(p=>{const [a,b]=pr(p);x.fillStyle=M;x.beginPath();x.arc(a,b,6,0,6.3);x.fill();x.fillStyle=T;x.fillText(NAMES[p.join()],a+(p[0]?-18:p[1]?22:0),b+(p[2]>0?-12:p[2]<0?24:20))});
  const [a,b]=pr(v),[o1,o2]=pr([0,0,0]);const stab=v.every(c=>Math.abs(Math.abs(c)-Math.round(Math.abs(c)))<1e-6);x.strokeStyle=stab?B:Y;x.lineWidth=5;x.lineCap='round';x.beginPath();x.moveTo(o1,o2);x.lineTo(a,b);x.stroke();x.fillStyle=stab?B:Y;x.beginPath();x.arc(a,b,10,0,6.3);x.fill();
  const k=v.map(c=>Math.round(c)).join();$('.st',el).textContent=stab?NAMES[k]+' (a stabilizer state, one of the 6 corners)':'a "magic" state, between the corners';$('.gu',el).textContent=seq.length?seq.join(' '):'none';
  $('.cl',el).textContent=stab?'Yes. With only H, S, X and CNOT, a laptop can follow even thousands of qubits.':'No. Each T-type step makes classical simulation harder.';$('.cl',el).className='cl '+(stab?'ok':'no')};
 $$('[data-g]',el).forEach(b=>b.onclick=()=>{const g=b.dataset.g;if(g==='R'){v=[0,0,1];seq=[]}else{v=G[g](v).map(c=>Math.abs(c)<1e-12?0:c);seq.push(g);if(seq.length>14)seq.shift()}draw()});draw()}
/* ---------- Schmidt decomposition ---------- */
function schmidt(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Mix angle θ</span><input type="range" min="0" max="90" value="30" aria-label="Angle theta"><b class="tv"></b></label>
<p class="eq12"></p><div class="bars12"><div><small>λ₁²</small><i class="b1"></i><b class="v1"></b></div><div><small>λ₂²</small><i class="b2"></i><b class="v2"></b></div><div><small>Entanglement (bits)</small><i class="b3"></i><b class="v3"></b></div><div><small>Purity of one half</small><i class="b4"></i><b class="v4"></b></div></div><p class="w11n"></p></div>`;
 const r=$('input',el),f=()=>{const t=+r.value*Math.PI/180,c=Math.cos(t),s=Math.sin(t),a=c*c,b=s*s,E=(a>1e-9?-a*Math.log2(a):0)+(b>1e-9?-b*Math.log2(b):0),pu=a*a+b*b;
  $('.tv',el).textContent=r.value+'°';$('.eq12',el).innerHTML=`|ψ⟩ = <b>${c.toFixed(3)}</b> |00⟩ + <b>${s.toFixed(3)}</b> |11⟩`;
  [['b1','v1',a,a.toFixed(3)],['b2','v2',b,b.toFixed(3)],['b3','v3',E,E.toFixed(3)],['b4','v4',pu,pu.toFixed(3)]].forEach(([bi,vi,w,t])=>{$('.'+bi,el).style.width=(w*100)+'%';$('.'+vi,el).textContent=t});
  $('.w11n',el).textContent=b<1e-9||a<1e-9?'Schmidt rank 1: a product state. Each half has its own definite state.':Math.abs(a-b)<1e-6?'Maximally entangled (a Bell state). Each half alone looks completely random.':'Schmidt rank 2: entangled. Each half alone is a mixed state.'};r.oninput=f;f()}
/* ---------- POVM: unambiguous discrimination of |0> vs |+> ---------- */
function povm(el){el.innerHTML=`<div class="w11"><div class="btns"><button type="button" class="pri s0">Send |0⟩ × 200</button><button type="button" class="s1">Send |+⟩ × 200</button></div>
<div class="tw2"><table><thead><tr><th>Sent</th><th>"It was |0⟩"</th><th>"It was |+⟩"</th><th>"Not sure"</th></tr></thead><tbody class="tb"></tbody></table></div><p class="w11n">The device never gives a wrong answer. The price is that it says "not sure" about 71% of the time (1/√2).</p></div>`;
 const tb=$('.tb',el),q=1-Math.SQRT1_2;const run=st=>{let a=0,b=0,u=0;for(let k=0;k<200;k++){const r=Math.random();if(r<q){st?b++:a++}else u++}tb.insertAdjacentHTML('afterbegin',`<tr><td>${st?'|+⟩':'|0⟩'}</td><td>${a}</td><td>${b}</td><td>${u}</td></tr>`);while(tb.children.length>5)tb.lastChild.remove()};
 $('.s0',el).onclick=()=>run(0);$('.s1',el).onclick=()=>run(1);run(0);run(1)}
/* ---------- MaxCut ---------- */
function maxcut(el){const N=[[160,30],[285,120],[240,265],[80,265],[35,120]],E=[[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[1,4]];
 el.innerHTML=`<div class="w11"><div class="two11"><svg class="mc" viewBox="0 0 320 300" role="img" aria-label="A 5-node graph. Each node is on side A or side B"></svg><div><div class="w11o one"><div><small>Edges cut</small><b class="cv"></b></div><div><small>Best possible</small><b class="bv"></b></div></div>
<div class="btns"><button type="button" class="pri best">Show a best cut</button><button type="button" class="rnd">Random split</button></div></div></div></div>`;
 let s=[0,0,0,0,0];const val=x=>E.filter(([a,b])=>x[a]!==x[b]).length;let best=0;for(let m=0;m<32;m++){const x=[0,1,2,3,4].map(i=>m>>i&1);best=Math.max(best,val(x))}
 const svg=$('svg',el),draw=()=>{let h='';E.forEach(([a,b])=>{const c=s[a]!==s[b];h+=`<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" class="${c?'cut':''}"/>`});
  N.forEach(([x,y],i)=>h+=`<g class="nd ${s[i]?'b':'a'}" data-i="${i}" tabindex="0" role="button" aria-label="Node ${i+1}, side ${s[i]?'B':'A'}"><circle cx="${x}" cy="${y}" r="24"/><text x="${x}" y="${y+6}">${s[i]?'B':'A'}</text></g>`);svg.innerHTML=h;$('.cv',el).textContent=val(s)+' of '+E.length;$('.bv',el).textContent=best+(val(s)===best?' (you found it)':'')};
 svg.addEventListener('click',e=>{const g=e.target.closest('.nd');if(g){s[+g.dataset.i]^=1;draw()}});svg.addEventListener('keydown',e=>{const g=e.target.closest('.nd');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();s[+g.dataset.i]^=1;draw()}});
 $('.best',el).onclick=()=>{for(let m=0;m<32;m++){const x=[0,1,2,3,4].map(i=>m>>i&1);if(val(x)===best){s=x;break}}draw()};$('.rnd',el).onclick=()=>{s=s.map(()=>Math.random()<.5?1:0);draw()};draw()}
/* ---------- 15-to-1 magic state distillation ---------- */
function distill(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Input error</span><input type="range" min="1" max="150" value="10" aria-label="Error of each noisy magic state"><b class="iv"></b></label>
<div class="tw2"><table><thead><tr><th>Rounds</th><th>Noisy states used</th><th>Error of the output</th></tr></thead><tbody class="tb"></tbody></table></div><p class="w11n"></p></div>`;
 const r=$('input',el),f=()=>{const p=+r.value/1000;$('.iv',el).textContent=(p*100).toFixed(1)+'%';let h='',q=p;for(let k=1;k<=3;k++){q=Math.min(.5,35*q*q*q);h+=`<tr><td>${k}</td><td>${Math.pow(15,k).toLocaleString('en')}</td><td>${q<1e-15?'below 10⁻¹⁵':q.toExponential(1)}</td></tr>`}$('.tb',el).innerHTML=h;
  $('.w11n',el).textContent=35*p*p<1?'Each round makes the error much smaller, at the cost of 15 times more input states.':'The inputs are too noisy: distillation makes things worse. Inputs must be better than about 17%.'};r.oninput=f;f()}
/* ---------- decoder backlog ---------- */
function backlog(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Decoder time per round</span><input type="range" class="dt" min="5" max="20" value="9" aria-label="Decoder time per syndrome round, relative to 1 microsecond rounds"><b class="dtv"></b></label>
<label class="rg"><span>Rounds between T gates</span><input type="range" class="gp" min="10" max="200" value="50" aria-label="Rounds between T gates"><b class="gpv"></b></label>
<canvas width="560" height="200" aria-label="Wall-clock time to reach each T gate"></canvas><div class="w11o"><div><small>Time to reach T gate 10</small><b class="t10">–</b></div><div><small>If the decoder kept up</small><b class="t0">–</b></div><div><small>Verdict</small><b class="vd">–</b></div></div></div>`;
 const cv=$('canvas',el),x=cv.getContext('2d'),dt=$('.dt',el),gp=$('.gp',el),fmt=u=>u<1e3?u.toFixed(0)+' µs':u<1e6?(u/1e3).toFixed(1)+' ms':(u/1e6).toFixed(2)+' s';
 const f=()=>{const r=+dt.value/10,g=+gp.value;$('.dtv',el).textContent=r.toFixed(1)+' µs';$('.gpv',el).textContent=g;let t=0;const T=[];for(let k=1;k<=10;k++){t=Math.max(t+g,r*(t+g));T.push(t)}
  const B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),M=css('--mut','#94a9cc');x.clearRect(0,0,560,200);const mx=Math.max(T[9],g*10),w=46;x.font='12px Inter,sans-serif';x.textAlign='center';
  T.forEach((v,i)=>{const h=Math.max(2,170*v/mx),h0=170*g*(i+1)/mx;x.fillStyle=r>1?Y:B;x.fillRect(20+i*54,180-h,w,h);x.strokeStyle=M;x.strokeRect(20+i*54,180-h0,w,h0);x.fillStyle=M;x.fillText('T'+(i+1),43+i*54,196)});
  $('.t10',el).textContent=fmt(T[9]);$('.t0',el).textContent=fmt(g*10);$('.vd',el).textContent=r<=1?'Decoder keeps up':'Backlog grows exponentially';$('.vd',el).className='vd '+(r<=1?'ok':'no')};dt.oninput=gp.oninput=f;f()}
/* ---------- surface vs qLDPC overhead ---------- */
function overhead(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Logical qubits</span><input type="range" class="k" min="1" max="100" value="1" aria-label="Number of logical qubits in multiples of 12"><b class="kv"></b></label>
<div class="btns dd"><button type="button" class="pri" data-d="12">Distance 12</button><button type="button" data-d="18">Distance 18</button></div>
<div class="cmp12"><div><span>Surface code</span><i class="bs"></i><b class="vs"></b></div><div><span class="nq"></span><i class="bq"></i><b class="vq"></b></div></div><p class="w11n"></p></div>`;
 let d=12;const k=$('.k',el),f=()=>{const L=12*+k.value,sc=L*(2*d*d-1),q=(L/12)*(d===12?288:576),m=Math.max(sc,q);$('.kv',el).textContent=L;
  $('.nq',el).textContent=d===12?'Gross code [[144,12,12]]':'Two-gross code [[288,12,18]]';$('.bs',el).style.width=(100*sc/m)+'%';$('.bq',el).style.width=(100*q/m)+'%';$('.vs',el).textContent=sc.toLocaleString('en')+' qubits';$('.vq',el).textContent=q.toLocaleString('en')+' qubits';
  $('.w11n',el).textContent='About '+(sc/q).toFixed(0)+'× fewer qubits for memory. Counts include check qubits (surface: 2d²−1 per logical qubit; bicycle codes: data plus an equal number of check qubits). Logic gates and magic-state factories cost extra in both. Bravyi et al. estimate nearly 3,000 surface-code qubits for the same protection as the 288-qubit gross code at 0.1% physical error, so the exact ratio depends on the error rates assumed.'};
 $$('[data-d]',el).forEach(b=>b.onclick=()=>{d=+b.dataset.d;$$('[data-d]',el).forEach(c=>c.classList.toggle('pri',c===b));f()});k.oninput=f;f()}
/* ---------- cat qubit bias ---------- */
function cat(el){el.innerHTML=`<div class="w11"><label class="rg"><span>Photons in the cat, |α|²</span><input type="range" min="0" max="110" value="40" aria-label="Mean photon number"><b class="av"></b></label>
<canvas width="560" height="150" aria-label="The two coherent states of a cat qubit in phase space"></canvas>
<div class="w11o"><div><small>Bit-flip time (relative)</small><b class="bt"></b></div><div><small>Phase-flip rate (relative)</small><b class="pt"></b></div><div><small>Noise bias</small><b class="nb"></b></div></div><p class="w11n">Model: bit flips fall about as e<sup>−2|α|²</sup>; phase flips grow about as |α|² (from photon loss). Real devices saturate; AWS and Alice &amp; Bob report bit-flip times from seconds to minutes.</p></div>`;
 const r=$('input',el),cv=$('canvas',el),x=cv.getContext('2d'),f=()=>{const n=+r.value/10,a=Math.sqrt(n),B=css('--b','#22d3ee'),Y=css('--y','#fbbf24'),M=css('--mut','#94a9cc');$('.av',el).textContent=n.toFixed(1);
  x.clearRect(0,0,560,150);x.strokeStyle=M;x.beginPath();x.moveTo(20,75);x.lineTo(540,75);x.moveTo(280,10);x.lineTo(280,140);x.stroke();
  [[-1,B],[1,Y]].forEach(([s,c])=>{const cx=280+s*a*70,g=x.createRadialGradient(cx,75,0,cx,75,32);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(cx,75,32,0,6.3);x.fill()});
  x.fillStyle=M;x.font='12px Inter,sans-serif';x.fillText('|−α⟩ = "1"',20,20);x.fillText('|+α⟩ = "0"',470,20);
  const bt=Math.exp(2*n),pr=Math.max(n,.1);$('.bt',el).textContent='× '+(bt<1e4?bt.toFixed(1):bt.toExponential(1));$('.pt',el).textContent='× '+n.toFixed(1);$('.nb',el).textContent=n<1?'none yet':'bit flips '+(bt*pr<1e4?(bt*pr).toFixed(0):(bt*pr).toExponential(1))+'× rarer than phase flips'};r.oninput=f;f()}
/* ---------- teleportation walkthrough (3-qubit state vector) ---------- */
function teleport(el){const STEPS=[['Start','Alice holds the unknown state |ψ⟩ on qubit 0. Qubits 1 (Alice) and 2 (Bob) start in |0⟩.'],['H on qubit 1','Puts qubit 1 into an equal superposition.'],['CNOT 1→2','Qubits 1 and 2 are now a Bell pair (|00⟩+|11⟩)/√2. Bob can walk away with qubit 2.'],['CNOT 0→1','Alice links |ψ⟩ to her half of the pair.'],['H on qubit 0','Now the 8 amplitudes split into 4 groups, one per pair of Alice\'s results. In each group Bob\'s qubit holds |ψ⟩ up to an X and/or Z.'],['Alice measures 0 and 1','Alice gets two random bits. Bob\'s qubit collapses to one of 4 versions of |ψ⟩. Nothing has reached Bob yet that tells him which.'],['Bob corrects','Alice phones Bob the 2 bits (a normal, slower-than-light message). Bob applies X if bit 1 is 1, then Z if bit 0 is 1. His qubit is now exactly |ψ⟩, and Alice\'s copy is gone (no cloning).']];
 el.innerHTML=`<div class="w11"><label class="rg"><span>State to send: θ</span><input type="range" class="th" min="0" max="180" value="60" aria-label="Polar angle theta of the state"><b class="thv"></b></label><label class="rg"><span>φ</span><input type="range" class="ph" min="0" max="359" value="45" aria-label="Phase angle phi of the state"><b class="phv"></b></label>
<svg class="tp12" viewBox="0 0 560 150" role="img" aria-label="Teleportation circuit"></svg>
<div class="btns"><button type="button" class="pv">◀ Back</button><button type="button" class="pri nx">Next step ▶</button><button type="button" class="rs">Restart</button></div>
<p class="w11n st"></p><div class="tw2"><table><thead><tr><th>Basis |q0 q1 q2⟩</th><th>Amplitude</th><th>Probability</th></tr></thead><tbody class="tb"></tbody></table></div>
<div class="w11o"><div><small>Alice's bits (q0, q1)</small><b class="mb">–</b></div><div><small>Bob's qubit</small><b class="bq">–</b></div><div><small>Fidelity with |ψ⟩</small><b class="fd">–</b></div></div></div>`;
 const C=(r,i=0)=>[r,i],add=(a,b)=>[a[0]+b[0],a[1]+b[1]],mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],sc=(a,k)=>[a[0]*k,a[1]*k],ab2=a=>a[0]*a[0]+a[1]*a[1];
 const bit=(i,q)=>(i>>(2-q))&1,flip=(i,q)=>i^(1<<(2-q));
 const H=(v,q)=>v.map((_,i)=>{const j=flip(i,q);return bit(i,q)?sc(add(v[j],sc(v[i],-1)),Math.SQRT1_2):sc(add(v[i],v[j]),Math.SQRT1_2)});
 const X=(v,q)=>v.map((_,i)=>v[flip(i,q)]),Z=(v,q)=>v.map((a,i)=>bit(i,q)?sc(a,-1):a),CX=(v,c,t)=>v.map((a,i)=>bit(i,c)?v[flip(i,t)]:a);
 let k=0,m=null;const th=$('.th',el),ph=$('.ph',el);
 const psi=()=>{const t=+th.value*Math.PI/180,f=+ph.value*Math.PI/180;return [C(Math.cos(t/2)),[Math.sin(t/2)*Math.cos(f),Math.sin(t/2)*Math.sin(f)]]};
 const stateAt=n=>{const [a,b]=psi();let v=Array.from({length:8},()=>C(0));v[0]=a;v[4]=b;if(n>=1)v=H(v,1);if(n>=2)v=CX(v,1,2);if(n>=3)v=CX(v,0,1);if(n>=4)v=H(v,0);
  if(n>=5){if(!m){const pr=[0,1,2,3].map(g=>ab2(v[g*2])+ab2(v[g*2+1]));let r=Math.random(),g=0;while(g<3&&r>pr[g]){r-=pr[g];g++}m=[g>>1,g&1]}const g=m[0]*2+m[1],n2=Math.sqrt(ab2(v[g*2])+ab2(v[g*2+1]));v=v.map((a,i)=>(i>>1)===g?sc(a,1/n2):C(0))}
  if(n>=6){if(m[1])v=X(v,2);if(m[0])v=Z(v,2)}return v};
 const fmt=a=>{const r=a[0].toFixed(3),i=Math.abs(a[1])<5e-4?'':(a[1]<0?' − ':' + ')+Math.abs(a[1]).toFixed(3)+'i';return Math.abs(a[0])<5e-4&&i?i.replace(' + ','').replace(' − ','−'):r+i};
 const svg=$('svg',el),draw=()=>{const v=stateAt(k);$('.thv',el).textContent=th.value+'°';$('.phv',el).textContent=ph.value+'°';$('.st',el).innerHTML='<b>Step '+k+' of 6: '+STEPS[k][0]+'.</b> '+STEPS[k][1];
  $('.tb',el).innerHTML=v.map((a,i)=>`<tr class="${ab2(a)<1e-9?'z':''}"><td>|${i.toString(2).padStart(3,'0')}⟩</td><td>${fmt(a)}</td><td><i style="width:${(ab2(a)*100).toFixed(1)}%"></i>${(ab2(a)*100).toFixed(1)}%</td></tr>`).join('');
  $('.mb',el).textContent=k>=5&&m?m[0]+', '+m[1]:'–';
  if(k>=5){const g=m[0]*2+m[1],b=[v[g*2],v[g*2+1]],[a0,a1]=psi(),ov=add(mul([a0[0],-a0[1]],b[0]),mul([a1[0],-a1[1]],b[1]));$('.bq',el).textContent=fmt(b[0])+' |0⟩ + ('+fmt(b[1])+') |1⟩';$('.fd',el).textContent=(ab2(ov)*100).toFixed(1)+'%'+(k===5&&ab2(ov)<.999?' (needs correction)':'')}else{$('.bq',el).textContent='entangled, no state of its own yet';$('.fd',el).textContent='–'}
  const G=[[1,1,'H'],[2,1,'●'],[2,2,'⊕'],[3,0,'●'],[3,1,'⊕'],[4,0,'H'],[5,0,'M'],[5,1,'M'],[6,2,'X/Z']];let h='';['|ψ⟩ q0','|0⟩ q1','|0⟩ q2'].forEach((t,q)=>{h+=`<text x="4" y="${34+q*42}" class="ql">${t}</text><line x1="62" y1="${30+q*42}" x2="548" y2="${30+q*42}"/>`});
  h+=`<line x1="${80+2*72}" y1="72" x2="${80+2*72}" y2="114" class="w"/><line x1="${80+3*72}" y1="30" x2="${80+3*72}" y2="72" class="w"/><path d="M${80+5*72} 40 V114 H${80+6*72-22}" class="cl"/>`;
  G.forEach(([s,q,t])=>{const x=80+s*72,y=30+q*42,on=s===k?' on':s<k?' dn':'';if(t==='●')h+=`<circle cx="${x}" cy="${y}" r="6" class="g${on}"/>`;else if(t==='⊕')h+=`<circle cx="${x}" cy="${y}" r="12" class="g o${on}"/><text x="${x}" y="${y+6}" class="gt">+</text>`;else h+=`<rect x="${x-18}" y="${y-15}" width="${t.length>1?44:36}" height="30" rx="6" class="g${on}"/><text x="${x+(t.length>1?4:0)}" y="${y+6}" class="gt">${t}</text>`});svg.innerHTML=h;
  $('.pv',el).disabled=k===0;$('.nx',el).disabled=k===6};
 $('.nx',el).onclick=()=>{if(k<6){k++;draw()}};$('.pv',el).onclick=()=>{if(k>0){k--;if(k<5)m=null;draw()}};$('.rs',el).onclick=()=>{k=0;m=null;draw()};th.oninput=ph.oninput=()=>{draw()};draw()}
const W={surface,clifford,schmidt,povm,maxcut,distill,backlog,overhead,cat,teleport};
const mk=w=>{if(!w._d&&W[w.dataset.w12]){w._d=1;W[w.dataset.w12](w)}};
function init(){const L=$$('[data-w12]');if(!('IntersectionObserver' in window)){L.forEach(mk);return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);mk(e.target)}}),{rootMargin:'400px 0px'});L.forEach(w=>io.observe(w))}
window.QA12init=()=>$$('[data-w12]').forEach(mk);
if(document.readyState!=='loading')init();else document.addEventListener('DOMContentLoaded',init);
window.QA12A=W;})();
