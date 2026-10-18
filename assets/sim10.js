/* Quantum Atlas v10: in-browser quantum circuit simulator (state vector, up to 6 qubits). Quantura Technologies */
(function(){const mount=document.getElementById('sim10');if(!mount)return;
const $=(s,r=mount)=>r.querySelector(s),$$=(s,r=mount)=>[...r.querySelectorAll(s)];
const COLS=12,MAXQ=6,KEY='qa10-sim-draft',SAVE='qa10-sim-saved';
const ONE=['H','X','Y','Z','S','T','M'],TWO=['CNOT','CZ','SWAP'];
const TIP={H:'Hadamard: makes an equal mix of 0 and 1',X:'X (NOT): flips 0 and 1',Y:'Y: flip plus a phase',Z:'Z: flips the phase of 1',S:'S: quarter-turn phase',T:'T: eighth-turn phase',M:'Measure: read the qubit (0 or 1)',CNOT:'CNOT: flips the target if the control is 1',CZ:'CZ: flips the phase if both are 1',SWAP:'SWAP: swaps two qubits','⌫':'Eraser: tap a gate to remove it'};
let n=3,C=[],sel='H',pending=null,hist=[],shots=null,shotN=1024;
const blank=()=>Array.from({length:COLS},()=>[]);C=blank();
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&d.n&&Array.isArray(d.c)){n=Math.min(MAXQ,Math.max(1,d.n));C=d.c.slice(0,COLS);while(C.length<COLS)C.push([])}}catch(e){}
mount.innerHTML=`<div class="simcard">
<div class="srow"><label for="sim-n">Qubits</label><select id="sim-n">${[1,2,3,4,5,6].map(k=>`<option value="${k}">${k}</option>`).join('')}</select>
<label for="sim-pre" style="margin-left:8px">Example</label><select id="sim-pre"><option value="">Choose an example…</option><option value="bell">Bell state (2 qubits)</option><option value="ghz">GHZ state (3 qubits)</option><option value="sup">Equal superposition (3 qubits)</option><option value="deutsch">Deutsch algorithm</option><option value="grover">Grover search (2 qubits)</option></select></div>
<div class="spal" role="toolbar" aria-label="Gates">${[...ONE.slice(0,6),...TWO,'M','⌫'].map(g=>`<button type="button" data-g="${g}" class="${TWO.includes(g)?'two':''}" title="${TIP[g]}" aria-label="${TIP[g]}">${g}</button>`).join('')}</div>
<div class="shint" aria-live="polite"></div>
<div class="scirc"><div class="sgrid" role="grid" aria-label="Circuit"></div></div>
<div class="sbtns"><button type="button" class="run pri">▶ Run <span class="sn">1024</span> shots</button><select class="shots" aria-label="Number of shots"><option value="100">100 shots</option><option value="1024" selected>1024 shots</option><option value="4096">4096 shots</option></select><button type="button" class="undo">↶ Undo</button><button type="button" class="clr">Clear</button><button type="button" class="save">💾 Save</button><button type="button" class="load">📂 Load saved</button><button type="button" class="code">&lt;/&gt; Qiskit code</button></div>
<div class="smsg"></div>
<div class="sres"><div class="sbox"><h4>State and probabilities</h4><div class="ampwrap"></div></div><div class="sbox"><h4>Measurement results</h4><div class="histw"><p style="color:var(--mut);margin:0">Press Run to measure the circuit many times.</p></div></div></div>
<pre class="qcode" hidden></pre></div>`;
const grid=$('.sgrid'),hint=$('.shint'),msg=$('.smsg');
/* ---------- simulation ---------- */
const R2=Math.SQRT1_2;
const MAT={H:[[R2,0],[R2,0],[R2,0],[-R2,0]],X:[[0,0],[1,0],[1,0],[0,0]],Y:[[0,0],[0,-1],[0,1],[0,0]],Z:[[1,0],[0,0],[0,0],[-1,0]],S:[[1,0],[0,0],[0,0],[0,1]],T:[[1,0],[0,0],[0,0],[R2,R2]]};
function ap1(s,q,m){const N=s.re.length,b=1<<q,[a,bb,c,d]=m;for(let i=0;i<N;i++){if(i&b)continue;const j=i|b,xr=s.re[i],xi=s.im[i],yr=s.re[j],yi=s.im[j];
 s.re[i]=a[0]*xr-a[1]*xi+bb[0]*yr-bb[1]*yi;s.im[i]=a[0]*xi+a[1]*xr+bb[0]*yi+bb[1]*yr;s.re[j]=c[0]*xr-c[1]*xi+d[0]*yr-d[1]*yi;s.im[j]=c[0]*xi+c[1]*xr+d[0]*yi+d[1]*yr}}
function sw(s,i,j){let t=s.re[i];s.re[i]=s.re[j];s.re[j]=t;t=s.im[i];s.im[i]=s.im[j];s.im[j]=t}
function ap2(s,op){const N=s.re.length,[a,b]=op.q,A=1<<a,B=1<<b;
 if(op.g==='CNOT'){for(let i=0;i<N;i++)if((i&A)&&!(i&B))sw(s,i,i|B)}
 else if(op.g==='CZ'){for(let i=0;i<N;i++)if((i&A)&&(i&B)){s.re[i]=-s.re[i];s.im[i]=-s.im[i]}}
 else if(op.g==='SWAP'){for(let i=0;i<N;i++)if((i&A)&&!(i&B))sw(s,i,(i&~A)|B)}}
function simulate(){const N=1<<n;let br=[{p:1,re:new Float64Array(N),im:new Float64Array(N)}];br[0].re[0]=1;let measured=false;
 for(const col of C)for(const op of col){if(op.g==='M'){measured=true;const q=op.q[0],b=1<<q,nb=[];for(const s of br){let p1=0;for(let i=0;i<N;i++)if(i&b)p1+=s.re[i]**2+s.im[i]**2;
    [[0,1-p1],[1,p1]].forEach(([r,p])=>{if(p<1e-12)return;const t={p:s.p*p,re:new Float64Array(N),im:new Float64Array(N)},k=1/Math.sqrt(p);for(let i=0;i<N;i++)if(!!(i&b)===!!r){t.re[i]=s.re[i]*k;t.im[i]=s.im[i]*k}nb.push(t)})}br=nb}
  else for(const s of br){if(MAT[op.g])ap1(s,op.q[0],MAT[op.g]);else ap2(s,op)}}
 const P=new Float64Array(N);for(const s of br)for(let i=0;i<N;i++)P[i]+=s.p*(s.re[i]**2+s.im[i]**2);
 return {P,pure:br.length===1?br[0]:null,measured}}
const bin=i=>i.toString(2).padStart(n,'0');
const fmt=(r,i)=>{const z=v=>Math.abs(v)<5e-4?0:v;r=z(r);i=z(i);if(!i)return r.toFixed(3);if(!r)return i.toFixed(3)+'i';return r.toFixed(3)+(i<0?' − ':' + ')+Math.abs(i).toFixed(3)+'i'};
/* ---------- circuit editing ---------- */
const span=op=>[Math.min(...op.q),Math.max(...op.q)];
const opAt=(q,c)=>C[c].find(op=>{const [a,b]=span(op);return q>=a&&q<=b});
function snap(){hist.push(JSON.stringify({n,C}));if(hist.length>60)hist.shift()}
function place(c,op){const [a,b]=span(op);C[c]=C[c].filter(o=>{const [x,y]=span(o);return y<a||x>b});C[c].push(op)}
function change(){shots=null;try{localStorage.setItem(KEY,JSON.stringify({n,C}))}catch(e){}render()}
function cellTap(q,c){$('#sim-pre').value='';
 if(pending){if(pending.c===c&&pending.q!==q){snap();place(c,{g:pending.g,q:[pending.q,q]});pending=null;change();return}if(pending.c===c&&pending.q===q){pending=null;render();return}}
 const cur=opAt(q,c);
 if(sel==='⌫'){if(cur){snap();C[c]=C[c].filter(o=>o!==cur);change()}return}
 if(cur&&cur.g===sel&&(ONE.includes(sel)||cur.q.includes(q))){snap();C[c]=C[c].filter(o=>o!==cur);pending=null;change();return}
 if(TWO.includes(sel)){if(n<2){say('You need at least 2 qubits for '+sel+'.');return}pending={g:sel,q,c};render();return}
 snap();place(c,{g:sel,q:[q]});pending=null;change()}
function say(t){msg.innerHTML=t;msg.classList.toggle('on',!!t)}
/* ---------- render ---------- */
function render(){$('#sim-n').value=n;grid.style.gridTemplateColumns=`max-content repeat(${COLS},max-content)`;let h='';
 for(let q=0;q<n;q++){h+=`<div class="sq">q${q} |0⟩</div>`;for(let c=0;c<COLS;c++)h+=`<div class="sc${pending&&pending.c===c?' pick':''}" data-q="${q}" data-c="${c}" role="gridcell" aria-label="qubit ${q}, step ${c+1}"></div>`}
 grid.innerHTML=h;
 C.forEach((col,c)=>col.forEach(op=>{const cell=q=>grid.querySelector(`.sc[data-q="${q}"][data-c="${c}"]`);if(op.q.some(q=>q>=n))return;
  if(op.q.length===1){const e=cell(op.q[0]);e.innerHTML=`<span class="gb${op.g==='M'?' m':''}">${op.g==='M'?'⏱':op.g}</span>`;e.title=TIP[op.g];return}
  const [a,b]=op.q;if(op.g==='CNOT'){cell(a).innerHTML='<span class="dot"></span>';cell(b).innerHTML='<span class="tg">+</span>'}else if(op.g==='CZ'){cell(a).innerHTML='<span class="dot"></span>';cell(b).innerHTML='<span class="dot"></span>'}else{cell(a).innerHTML='<span class="sw">✕</span>';cell(b).innerHTML='<span class="sw">✕</span>'}
  const lo=cell(Math.min(a,b)),hi=cell(Math.max(a,b)),v=document.createElement('i');v.className='vl';lo.appendChild(v);v._hi=hi;v._lo=lo}));
 requestAnimationFrame(()=>$$('.vl').forEach(v=>{v.style.top='50%';v.style.height=(v._hi.offsetTop-v._lo.offsetTop)+'px'}));
 if(pending)hint.innerHTML=`<b>${pending.g}:</b> now tap a second qubit in the highlighted column${pending.g==='CNOT'?' (the target ⊕)':''}. Tap the same cell to cancel.`;
 else hint.innerHTML=`Selected: <b>${sel}</b>. ${TIP[sel]}. Tap a cell to place it, or drag the gate onto the circuit.`;
 $$('.spal button').forEach(b=>b.classList.toggle('sel',b.dataset.g===sel));
 const r=simulate();drawAmps(r);drawHist();$('.undo').disabled=!hist.length;
 if(!$('.qcode').hidden)$('.qcode').textContent=qiskit()}
let showAll=false;
function drawAmps({P,pure,measured}){const N=1<<n,rows=[];for(let i=0;i<N;i++){if(!showAll&&N>16&&P[i]<1e-9)continue;rows.push(i)}
 let h=`<table class="amp"><thead><tr><th>State</th>${pure?'<th>Amplitude</th>':''}<th>Chance</th><th style="width:40%"></th></tr></thead><tbody>`;
 rows.forEach(i=>{const p=P[i];h+=`<tr><td class="mono">|${bin(i)}⟩</td>${pure?`<td class="mono">${fmt(pure.re[i],pure.im[i])}</td>`:''}<td>${(p*100).toFixed(1)}%</td><td><div class="pbar" style="width:${(p*100).toFixed(2)}%"></div></td></tr>`});
 h+='</tbody></table>';if(N>16)h+=`<button type="button" class="sall" style="margin-top:8px">${showAll?'Hide zero rows':'Show all '+N+' states'}</button>`;
 h+=`<p style="margin:8px 0 0;font-size:.85rem;color:var(--mut)">States are written |q${n-1}…q0⟩ (q0 on the right, like Qiskit).${measured?' A measurement happens inside the circuit, so the qubits are now in a random mix and single amplitudes are not shown.':''}</p>`;
 $('.ampwrap').innerHTML=h;const sa=$('.sall');if(sa)sa.onclick=()=>{showAll=!showAll;render()}}
function drawHist(){const w=$('.histw');if(!shots){w.innerHTML='<p style="color:var(--mut);margin:0">Press Run to measure the circuit many times.</p>';return}
 const keys=Object.keys(shots).map(Number).sort((a,b)=>a-b),mx=Math.max(...keys.map(k=>shots[k]));
 w.innerHTML=`<div class="hist">${keys.map(k=>`<div class="hb" title="|${bin(k)}⟩: ${shots[k]}"><small>${shots[k]}</small><i style="height:${(shots[k]/mx*80).toFixed(1)}%"></i><b>${bin(k)}</b></div>`).join('')}</div><p style="margin:8px 0 0;font-size:.85rem;color:var(--mut)">${shotN} runs. Each run measures every qubit at the end. The counts are close to the chances, but not exact: that is real quantum randomness.</p>`}
function runShots(){const {P}=simulate(),N=P.length,cdf=new Float64Array(N);let a=0;for(let i=0;i<N;i++){a+=P[i];cdf[i]=a}shots={};for(let k=0;k<shotN;k++){const r=Math.random()*a;let lo=0,hi=N-1;while(lo<hi){const m=(lo+hi)>>1;if(cdf[m]<r)lo=m+1;else hi=m}shots[lo]=(shots[lo]||0)+1}drawHist()}
function qiskit(){const hasM=C.some(col=>col.some(o=>o.g==='M'));let s=`# pip install qiskit qiskit-aer\nfrom qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\nqc = QuantumCircuit(${n}${hasM?', '+n:''})\n`;
 C.forEach(col=>col.forEach(o=>{if(o.q.some(q=>q>=n))return;const f={H:'h',X:'x',Y:'y',Z:'z',S:'s',T:'t',CNOT:'cx',CZ:'cz',SWAP:'swap'}[o.g];if(o.g==='M')s+=`qc.measure(${o.q[0]}, ${o.q[0]})\n`;else s+=`qc.${f}(${o.q.join(', ')})\n`}));
 if(!hasM)s+='qc.measure_all()\n';s+=`\ncounts = AerSimulator().run(qc, shots=${shotN}).result().get_counts()\nprint(counts)\n`;return s}
/* ---------- presets ---------- */
const PRE={coin:[1,[[['H',0]]],'One H gate. You get 0 or 1 about half the time each.'],bell:[2,[[['H',0]],[['CNOT',0,1]]],'Bell state: H then CNOT. You only ever see 00 or 11, each about half the time. The two qubits are <b>entangled</b>.'],
 ghz:[3,[[['H',0]],[['CNOT',0,1]],[['CNOT',1,2]]],'GHZ state: three entangled qubits. You see 000 or 111, never a mix.'],
 sup:[3,[[['H',0],['H',1],['H',2]]],'Three H gates give all 8 results with the same chance (12.5% each). This is superposition, but no entanglement.'],
 deutsch:[2,[[['X',1]],[['H',0],['H',1]],[['CNOT',0,1]],[['H',0]],[['M',0]]],'Deutsch algorithm: the CNOT is the "black box" function f(x) = x. Look at q0 (the right-hand bit): it is always 1, which means the function is <b>balanced</b>. One run is enough. A normal computer needs two.'],
 grover:[2,[[['H',0],['H',1]],[['CZ',0,1]],[['H',0],['H',1]],[['X',0],['X',1]],[['CZ',0,1]],[['X',0],['X',1]],[['H',0],['H',1]]],'Grover search on 4 items: the first CZ marks the answer |11⟩, the rest (the "diffuser") boosts it. After one round the answer has a 100% chance.']};
function preset(k){const p=PRE[k];if(!p)return;snap();n=p[0];C=blank();p[1].forEach((col,c)=>col.forEach(([g,...q])=>place(c,{g,q})));pending=null;change();say('💡 '+p[2]);runShots()}
/* ---------- events ---------- */
grid.addEventListener('click',e=>{const c=e.target.closest('.sc');if(c)cellTap(+c.dataset.q,+c.dataset.c)});
const pal=$('.spal');pal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sel=b.dataset.g;pending=null;render()});
let drag=null,ghost=null;
pal.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;drag={g:b.dataset.g,x:e.clientX,y:e.clientY,moved:false};try{b.releasePointerCapture(e.pointerId)}catch(_){}});
addEventListener('pointermove',e=>{if(!drag)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){drag.moved=true;ghost=document.createElement('div');ghost.className='ghost10';ghost.textContent=drag.g;mount.appendChild(ghost)}
 if(drag.moved){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';$$('.sc.hov').forEach(c=>c.classList.remove('hov'));const t=document.elementFromPoint(e.clientX,e.clientY),c=t&&t.closest&&t.closest('.sc');if(c&&grid.contains(c))c.classList.add('hov')}},{passive:true});
addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;if(!d.moved)return;ghost&&ghost.remove();ghost=null;$$('.sc.hov').forEach(c=>c.classList.remove('hov'));const t=document.elementFromPoint(e.clientX,e.clientY),c=t&&t.closest&&t.closest('.sc');sel=d.g;pending=null;if(c&&grid.contains(c))cellTap(+c.dataset.q,+c.dataset.c);else render()});
addEventListener('pointercancel',()=>{if(drag){drag=null;ghost&&ghost.remove();ghost=null}});
$('#sim-n').onchange=e=>{snap();n=+e.target.value;C=C.map(col=>col.filter(o=>o.q.every(q=>q<n)));pending=null;say('');change()};
$('#sim-pre').onchange=e=>preset(e.target.value);
$('.run').onclick=runShots;
$('.shots').onchange=e=>{shotN=+e.target.value;$('.sn').textContent=shotN;shots=null;drawHist();if(!$('.qcode').hidden)$('.qcode').textContent=qiskit()};
$('.undo').onclick=()=>{const s=hist.pop();if(!s)return;const o=JSON.parse(s);n=o.n;C=o.C;pending=null;change()};
$('.clr').onclick=()=>{snap();C=blank();pending=null;say('');$('#sim-pre').value='';change()};
$('.save').onclick=()=>{try{localStorage.setItem(SAVE,JSON.stringify({n,C}));document.dispatchEvent(new Event('qa:progress'));say('✅ Circuit saved on this device. Press "Load saved" to bring it back any time.')}catch(e){say('❌ Could not save: storage is blocked.')}};
$('.load').onclick=()=>{let o=null;try{o=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}if(!o){say('No saved circuit yet. Build one and press Save.');return}snap();n=o.n;C=o.C;while(C.length<COLS)C.push([]);pending=null;change();say('📂 Saved circuit loaded.')};
$('.code').onclick=()=>{const p=$('.qcode');p.hidden=!p.hidden;p.textContent=qiskit();$('.code').textContent=p.hidden?'</> Qiskit code':'Hide code';if(!p.hidden&&navigator.clipboard)navigator.clipboard.writeText(p.textContent).then(()=>say('📋 Qiskit code copied. Paste it into Python to run the same circuit.'),()=>{})};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pending){pending=null;render()}});
window.QA10SIM={get state(){return {n,C,shots}},simulate,preset,place:(c,g,...q)=>{place(c,{g,q});change()}};
render();})();
