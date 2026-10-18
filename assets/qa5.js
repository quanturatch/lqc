/* Quantum Atlas v5 enhancements (Quantura Technologies) */
function startQA5(){
(function(){
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
const store={get(k,d){try{const v=localStorage.getItem('qa5-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('qa5-'+k,JSON.stringify(v));document.dispatchEvent(new Event('qa:progress'))}catch(e){}}};
window.QA5={$,$$,store};
const chaps=$$('#content > section.sec');window.QA5.chaps=chaps;
/* ---- A: chapter meta ---- */
const LVL={found:1,qubits:1,gates:1,info:2,algo:2,qec:2,hw:1,nisq:2,cx:3,crypto:2,programming:1,adv:3};
const PRE={qubits:['found'],gates:['qubits'],info:['gates'],algo:['gates'],qec:['gates'],hw:['qubits'],nisq:['gates','qec'],cx:['algo'],crypto:['info'],programming:['gates'],adv:['qec','algo']};
const title=id=>{const h=$('#'+id+' .sechead h2');return h?h.textContent.split(':')[0]:id};
chaps.forEach((sec,i)=>{const words=(sec.textContent||'').split(/\s+/).length,mins=Math.max(5,Math.round(words/200/5)*5);
 const lv=LVL[sec.id]||2,lvn=['','Beginner','Intermediate','Advanced'][lv];
 const meta=document.createElement('div');meta.className='chmeta';meta.innerHTML=`<span>⏱ About ${mins} min</span><span class="lvl${lv}">${'●'.repeat(lv)}${'○'.repeat(3-lv)} ${lvn}</span><span>🧩 ${$$('details.topic',sec).length} topics</span>`;
 const intro=$('.intro',sec)||$('.sechead',sec);intro.insertAdjacentElement('afterend',meta);
 if(PRE[sec.id]){const p=document.createElement('p');p.className='prereq';p.innerHTML='Before this: '+PRE[sec.id].map(x=>`<a href="#${x}">${title(x)}</a>`).join(', ');meta.insertAdjacentElement('afterend',p)}
 if(['hw','nisq','adv'].includes(sec.id)){const a=document.createElement('div');a.className='asof';a.textContent='📅 Snapshot as of 2026: hardware numbers and records change fast.';meta.insertAdjacentElement('afterend',a)}
 const nx=chaps[i+1];const card=document.createElement('a');card.className='nextcard';
 if(nx){card.href='#'+nx.id;card.innerHTML=`<span><small>Next chapter ${i+2} of ${chaps.length}</small><b>${title(nx.id)}</b></span><span class="arr">→</span>`}else{card.href='#history';card.innerHTML=`<span><small>You finished all chapters</small><b>Go deeper: history, careers and more</b></span><span class="arr">→</span>`}
 sec.appendChild(card)});
/* ---- A: predict then reveal ---- */
const PRED={
 slit:['Particles go through two slits one at a time, and nobody checks which slit. What pattern builds up on the screen?',['Two bright stripes','*Many stripes (an interference pattern)','A smooth blob'],'Each particle acts like a wave that goes through both slits. The two parts interfere, so you get many stripes. If you check the slit, the stripes vanish.'],
 bell:['Two qubits are in a Bell state. Alice measures hers and gets 0. What will Bob get?',['0 or 1, 50/50','*Always 0','Always 1'],'In the Bell state (|00⟩+|11⟩)/√2 the results always match. Alice alone sees random results, though.'],
 interf:['A qubit starts as |0⟩. You apply H, then H again. What do you measure?',['0 or 1, 50/50','*Always 0','Always 1'],'The second H undoes the first. The two paths to |1⟩ cancel out (destructive interference), so you always get 0.'],
 grover:['You search 4 items for 1 marked item. How many Grover rounds give the answer with certainty?',['*1','2','4'],'With N = 4, one round sends all the amplitude to the marked item. That is a special case: usually you need about (π/4)√N rounds.'],
 bitflip:['A logical 0 is stored as 000. One qubit flips by mistake. Can the code fix it?',['*Yes, by majority vote','No, the data is lost','Only if we measure the data directly'],'The code checks parities (do qubits 1 and 2 agree? 2 and 3?) without reading the data, finds the odd one out and flips it back.'],
 bb84:['A spy (Eve) measures the photons and sends copies on. What do Alice and Bob notice?',['Nothing at all','*About 25% errors in their kept key','The photons stop arriving'],'Eve guesses the wrong basis half the time, which scrambles the photon. That creates about 25% errors where Alice and Bob\'s bases matched.']};
const seen=store.get('pred',{});
Object.entries(PRED).forEach(([v,[q,opts,e]])=>{const el=$('#viz-'+v);if(!el)return;const box=document.createElement('div');box.className='pred';box.setAttribute('role','group');box.setAttribute('aria-label','Predict before you play');
 box.innerHTML=`<h5>🔮 Predict first</h5><div>${q}</div><div class="po"></div><div class="pe" aria-live="polite">${e}</div>`;
 const po=$('.po',box);const finish=()=>{box.classList.add('done');el.classList.remove('locked');seen[v]=1;store.set('pred',seen)};
 opts.forEach(o=>{const ok=o[0]==='*',b=document.createElement('button');b.type='button';b.textContent=ok?o.slice(1):o;b.onclick=()=>{if(box.classList.contains('done'))return;b.classList.add(ok?'ok':'no');$$('button',po).forEach((x,i)=>{if(opts[i]&&opts[i][0]==='*')x.classList.add('ok')});finish();window.QA5.addXP&&window.QA5.addXP(ok?10:3,ok?'prediction':'prediction-miss')};po.appendChild(b)});
 const sk=document.createElement('button');sk.type='button';sk.className='skip';sk.textContent='Skip';sk.onclick=finish;po.appendChild(sk);
 el.before(box);if(!seen[v])el.classList.add('locked');else box.classList.add('done')});
})();
/* ---- B ---- */
(function(){const {$,$$,store,chaps}=window.QA5;const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* intro screen: once per session, skippable, short */
let shown=false;try{shown=sessionStorage.getItem('qa5-intro')}catch(e){}
const _set=store.get('settings',{});if(!shown&&!navigator.webdriver&&_set.intro!==false){try{sessionStorage.setItem('qa5-intro','1')}catch(e){}const d=document.createElement('div');d.id='intro';d.setAttribute('role','dialog');d.setAttribute('aria-label','Welcome');d.innerHTML='<canvas></canvas><div class="ic"><h2>Quantum Atlas</h2><p>by Quantura Technologies</p><button type="button">Skip intro</button></div>';document.body.appendChild(d);
 const cv=$('canvas',d),x=cv.getContext('2d'),dpr=devicePixelRatio||1;cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;x.scale(dpr,dpr);const P=Array.from({length:RM?0:140},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,a:Math.random()*6.3,r:60+Math.random()*90}));const t0=performance.now();
 const close=()=>{d.classList.add('out');setTimeout(()=>d.remove(),550)};$('button',d).onclick=close;d.addEventListener('click',e=>{if(e.target===d||e.target===cv)close()});
 (function f(t){if(!d.isConnected)return;const k=Math.min(1,(t-t0)/1200),cx=innerWidth/2,cy=innerHeight/2-50;x.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.a+=.02;const tx=cx+Math.cos(p.a)*p.r*.6,ty=cy+Math.sin(p.a)*p.r*.25;const X=p.x+(tx-p.x)*k,Y=p.y+(ty-p.y)*k;x.fillStyle='rgba(34,211,238,'+(.3+.6*k)+')';x.beginPath();x.arc(X,Y,1.6,0,7);x.fill()});requestAnimationFrame(f)})(t0);
 setTimeout(close,RM?600:1500)}
/* hero tap to measure */
const mb=$('#measureBtn'),mo=$('#measureOut');if(mb){let n=[0,0];mb.onclick=()=>{const th=window.HERO_TH||1.1,p0=Math.cos(th/2)**2,r=Math.random()<p0?0:1;n[r]++;window.HERO_LOCK=r?Math.PI:0;mo.innerHTML=`Result: <b>|${r}⟩</b> (chance was ${Math.round((r?1-p0:p0)*100)}%)<br>Tally: 0 → ${n[0]} · 1 → ${n[1]}`;mb.textContent='Measure again';clearTimeout(mb._t);mb._t=setTimeout(()=>{window.HERO_LOCK=null},2200);window.QA5.addXP&&window.QA5.addXP(1,'measure')}}
/* choose your path */
const PATHS={beginner:['Curious beginner',['qubits','gates','hw','algo','crypto','nisq'],'Start with qubits and pictures. Skip the heavy maths at first and come back to Foundations later.'],student:['Student',['found','qubits','gates','info','algo','qec','cx'],'Go in order, with all the maths. Do every quiz.'],coder:['Coder',['qubits','gates','programming','algo','nisq','qec'],'Learn just enough theory, then jump to writing real quantum programs.']};
const pp=$('#pathpick');if(pp){pp.innerHTML='<h3>Choose your path</h3><div class="paths"></div><div id="pathOut" aria-live="polite"></div>';const box=$('.paths',pp),out=$('#pathOut');
 const show=k=>{const [n,list,why]=PATHS[k];$$('button',box).forEach(b=>b.classList.toggle('on',b.dataset.k===k));const t=id=>{const h=$('#'+id+' .sechead h2');return h?h.textContent.split(':')[0]:id};out.innerHTML=`<b>${n}:</b> ${why}<br>`+list.map((id,i)=>`${i+1}. <a href="#${id}">${t(id)}</a>`).join(' → ')+'<br><small>Later steps stay visible, and they open after you pass the check on the step before them.</small>';store.set('path',k);window.QA5.path=list;window.QA5.drawMap&&window.QA5.drawMap();window.QALearn&&QALearn.refresh()};
 Object.entries(PATHS).forEach(([k,[n]])=>{const b=document.createElement('button');b.type='button';b.dataset.k=k;b.textContent=n;b.onclick=()=>show(k);box.appendChild(b)});const sv=store.get('path',null);if(sv&&PATHS[sv])show(sv)}
/* learning map */
const map=document.createElement('section');map.className='sec';map.id='map';map.innerHTML='<div class="sechead"><div class="num">🗺️</div><div><small>Your route</small><h2>Learning map</h2></div></div><p class="intro">Each circle is a chapter. Lines show what to read first. Filled circles are done; the amber ring is a good next step.</p><div class="mapwrap"></div><div class="maplegend"></div>';
const ct=$('#content');ct.parentNode.insertBefore(map,ct);
const POS={found:[1,0],qubits:[1,1],gates:[1,2],hw:[0,2],info:[2,3],algo:[1,3],qec:[0,3],programming:[3,3],crypto:[2,4],cx:[1,4],nisq:[0,4],adv:[1,5]};
const PRE={qubits:['found'],gates:['qubits'],info:['gates'],algo:['gates'],qec:['gates'],hw:['qubits'],nisq:['gates','qec'],cx:['algo'],crypto:['info'],programming:['gates'],adv:['qec','algo']};
window.QA5.drawMap=()=>{let read={};try{read=JSON.parse(localStorage.getItem('qa-read')||'{}')}catch(e){}const W=640,H=600,X=c=>60+c*173,Y=r=>45+r*102;let next=null;const order=window.QA5.path||chaps.map(c=>c.id);for(const id of order)if(!read[id]){next=id;break}
 let g='';Object.entries(PRE).forEach(([k,ps])=>ps.forEach(p=>{if(POS[k]&&POS[p])g+=`<path class="edge" d="M${X(POS[p][0])} ${Y(POS[p][1])} C ${X(POS[p][0])} ${Y(POS[p][1])+50}, ${X(POS[k][0])} ${Y(POS[k][1])-50}, ${X(POS[k][0])} ${Y(POS[k][1])}"/>`}));
 chaps.forEach((c,i)=>{const p=POS[c.id];if(!p)return;const t=($('.sechead h2',c)||{}).textContent||c.id;const short=t.split(':')[0].replace('Quantum ','').slice(0,18);const reached=!window.QALearn||QALearn.isReached(c.id);g+=`<a class="node${read[c.id]?' done':''}${c.id===next?' next':''}${reached?'':' locked'}" href="#${c.id}" aria-label="Chapter ${i+1}: ${t}${read[c.id]?' (done)':''}${reached?'':' (not yet reached)'}"><circle cx="${X(p[0])}" cy="${Y(p[1])}" r="22"/><text x="${X(p[0])}" y="${Y(p[1])+5}" text-anchor="middle">${i+1}</text><text x="${X(p[0])}" y="${Y(p[1])+40}" text-anchor="middle" style="font-size:11px">${short}</text></a>`});
 $('.mapwrap',map).innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Learning map of chapters">${g}</svg>`;const n=Object.values(read).filter(Boolean).length;$('.maplegend',map).textContent=`${n} of ${chaps.length} chapters done.`+(next?' Suggested next: chapter '+(chaps.findIndex(c=>c.id===next)+1)+'.':' All done!')};
window.QA5.drawMap();document.addEventListener('click',e=>{if(e.target.closest('.donebtn'))setTimeout(window.QA5.drawMap,50)});
/* per-chapter accent + openers */
const ACC={found:'#22d3ee',qubits:'#38bdf8',gates:'#2dd4bf',info:'#60a5fa',algo:'#22d3ee',qec:'#5eead4',hw:'#fbbf24',nisq:'#34d399',cx:'#93c5fd',crypto:'#2dd4bf',programming:'#38bdf8',adv:'#fcd34d'};
const io=RM?null:new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
chaps.forEach(c=>{c.dataset.acc='';c.style.setProperty('--acc',ACC[c.id]||'#22d3ee');const h=$('.sechead',c);if(h&&io){h.classList.add('op');io.observe(h)}});
})();
/* ---- C: accessibility ---- */
(function(){const {$,$$}=window.QA5;
const sk=document.createElement('a');sk.className='skiplink';sk.href='#found';sk.textContent='Skip to the lessons';document.body.prepend(sk);
const ariaViz=v=>{if(v.dataset.aria)return;v.dataset.aria=1;const t=($('h3',v)||{}).textContent||'simulation',hint=($('.hint',v)||{}).textContent||'';v.setAttribute('role','region');v.setAttribute('aria-label','Simulation: '+t);
 $$('canvas',v).forEach((c,i)=>{c.setAttribute('role','img');c.setAttribute('aria-label',t+(i?' (view '+(i+1)+')':'')+'. '+hint.slice(0,180));
  if(c.classList.contains('drag')){c.tabIndex=0;c.setAttribute('aria-label',c.getAttribute('aria-label')+' Keyboard: focus and use arrow keys to drag.');
   c.addEventListener('keydown',e=>{const d={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];if(!d)return;e.preventDefault();const r=c.getBoundingClientRect();c._kx=c._kx??r.width/2;c._ky=c._ky??r.height/2;const fire=(type,x,y)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,clientX:r.left+x,clientY:r.top+y,pointerId:9,isPrimary:true,buttons:type==='pointerup'?0:1}));fire('pointerdown',c._kx,c._ky);c._kx=Math.max(0,Math.min(r.width,c._kx+d[0]));c._ky=Math.max(0,Math.min(r.height,c._ky+d[1]));fire('pointermove',c._kx,c._ky);fire('pointerup',c._kx,c._ky)})}})
 $$('input[type=range]',v).forEach(r=>{if(!r.getAttribute('aria-label')&&!(r.labels&&r.labels.length)){const l=r.previousElementSibling||r.parentElement;r.setAttribute('aria-label',(l&&l.textContent.trim().slice(0,40))||'slider')}})};$$('.viz[data-ready]').forEach(ariaViz);document.addEventListener('qa:viz',e=>ariaViz(e.detail));
$$('button').forEach(b=>{if(!b.textContent.trim()&&!b.getAttribute('aria-label'))b.setAttribute('aria-label',b.title||'button')});
})();
/* ---- D: game layer ---- */
(function(){const {$,$$,store,chaps}=window.QA5;
const today=()=>new Date().toISOString().slice(0,10);
let st=store.get('game',{xp:0,days:[],badges:[],srs:{},puz:{},mz:0});
const save=()=>store.set('game',st);
const toast=m=>{const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.remove(),300)},1800)};
const streak=()=>{const d=new Set(st.days);let n=0,t=new Date();for(;;){const k=t.toISOString().slice(0,10);if(d.has(k)){n++;t.setDate(t.getDate()-1)}else break}return n};
const readN=()=>{try{return Object.values(JSON.parse(localStorage.getItem('qa-read')||'{}')).filter(Boolean).length}catch(e){return 0}};
const BADGES=[['first','🎯 First answer',()=>st.xp>0],['ch3','📘 3 chapters done',()=>readN()>=3],['all','🏆 All chapters done',()=>readN()>=chaps.length],['streak3','🔥 3-day streak',()=>streak()>=3],['streak7','🔥 7-day streak',()=>streak()>=7],['xp500','⚡ 500 XP',()=>st.xp>=500],['puz','🧩 Puzzle solver',()=>Object.keys(st.puz).length>=1],['mz','🔦 Interferometer master',()=>st.mz>=4],['rev','🧠 10 reviews',()=>Object.values(st.srs).reduce((a,c)=>a+(c.n||0),0)+Object.values(st.miss||{}).reduce((a,c)=>a+(c.n||0),0)>=10],['fixed','🔁 Mistake reviewed',()=>Object.values(st.miss||{}).some(c=>(c.n||0)>0&&c.box>0)]];
function checkBadges(){BADGES.forEach(([k,n,f])=>{if(!st.badges.includes(k)&&f()){st.badges.push(k);toast('Badge earned: '+n)}});save();render()}
const PRACTICE=new Set(['quiz','review','puzzle','circuit','prediction','chapter']);
function addXP(n,why){st.xp+=n;if(PRACTICE.has(why)&&!st.days.includes(today()))st.days.push(today());save();checkBadges()}
window.QA5.addXP=addXP;
window.QA5.awardChapter=id=>{st.awarded=st.awarded||{};if(st.awarded[id])return;st.awarded[id]=1;addXP(50,'chapter')};
window.QA5.addMistake=(ch,q,a)=>{st.miss=st.miss||{};const id='m:'+ch+':'+q.slice(0,80);const cur=st.miss[id]||{q,a,box:0,n:0};cur.q=q;cur.a=a;const d=new Date();d.setDate(d.getDate()+1);cur.due=d.toISOString().slice(0,10);st.miss[id]=cur;save();window.QA5.render&&window.QA5.render()};
/* HUD */
const hud=document.createElement('a');hud.className='hud';hud.href='#me';hud.setAttribute('aria-label','Your XP and streak');const tb=$('.topbar');const tl=$('.toplinks',tb);(tl||tb.lastElementChild).insertAdjacentElement('beforebegin',hud);
/* A correct quiz answer counts as practice. A wrong answer is queued for the next day. */
document.addEventListener('click',e=>{const b=e.target.closest('.quiz .opts button');if(!b||b.classList.contains('retry'))return;const w=b.closest('.q');if(w&&!w.dataset.xp){w.dataset.xp=1;addXP(b.dataset.ok?10:2,b.dataset.ok?'quiz':'quiz-miss')}},true);
/* SRS cards */
const CARDS={found:[['What is a vector?','A list of numbers. A qubit state is a list of two complex numbers.'],['How do you get a probability from an amplitude?','Take its size and square it.']],
qubits:[['What is superposition?','A qubit in a mix of 0 and 1 until it is measured.'],['What happens when you measure a qubit?','You get 0 or 1 at random (by the amplitudes), and the qubit stays on that answer.'],['What is phase?','The "direction" of an amplitude. It is invisible to one measurement but changes interference.']],
gates:[['What does the H gate do to |0⟩?','Makes an equal mix (|0⟩+|1⟩)/√2.'],['What does CNOT do?','Flips the target qubit if the control qubit is 1.'],['How do you make a Bell state?','H on qubit 1, then CNOT from qubit 1 to qubit 2.']],
info:[['What does the no-cloning theorem say?','No machine can perfectly copy an unknown quantum state.'],['Can entanglement send messages faster than light?','No. Each side alone sees random results.']],
algo:[['How many rounds does Grover need for N items?','About (π/4)√N.'],['What does Shor\'s algorithm turn factoring into?','Finding the period of a repeating pattern.'],['Deutsch–Jozsa: how many oracle calls?','One.']],
qec:[['Why can\'t we just copy qubits for backup?','No-cloning. Instead, information is spread over many qubits.'],['What is a logical qubit?','One reliable qubit made from many physical qubits plus error correction.']],
hw:[['Name two ways to build qubits.','For example superconducting circuits and trapped ions (also neutral atoms, photons, spins).'],['Annealer vs gate-based?','Annealers only do optimisation; gate-based machines can run any quantum algorithm.']],
nisq:[['What does NISQ stand for?','Noisy Intermediate-Scale Quantum.']],cx:[['What is BQP?','Problems a quantum computer can solve efficiently with small error.']],
crypto:[['How does BB84 detect a spy?','Spying disturbs photons, causing errors (about 25%) Alice and Bob can spot.']],programming:[['Name a quantum programming library.','For example Qiskit or Cirq.']],adv:[['What does "below threshold" mean?','Physical errors are low enough that bigger codes give fewer logical errors.']]};
const IV=[0,1,3,7,16,35];
function dueCards(){let read={};try{read=JSON.parse(localStorage.getItem('qa-read')||'{}')}catch(e){}const out=[];Object.entries(CARDS).forEach(([ch,cs])=>{if(!read[ch])return;cs.forEach((c,i)=>{const k=ch+i,s=st.srs[k]||{box:0,due:''};if(!s.due||s.due<=today())out.push([k,c])})});Object.entries(st.miss||{}).forEach(([k,c])=>{if(!c.due||c.due<=today())out.push([k,[c.q,c.a]])});return out}
/* puzzles */
const PUZ=[['A qubit is in (|0⟩+|1⟩)/√2. You apply X. What are the chances now?',['*Still 50/50','Always 0','Always 1'],'X swaps the two amplitudes, but both are equal, so nothing changes.'],
['You measure |+⟩ in the 0/1 basis 100 times. About how many 1s?',['0','*50','100'],'|+⟩ has equal amplitudes, so about half the results are 1.'],
['Apply H twice to |1⟩. What do you get?',['*|1⟩','|0⟩','A 50/50 mix'],'H undoes itself: H·H = I.'],
['How many numbers (amplitudes) describe 10 qubits?',['10','20','*1024'],'n qubits need 2ⁿ amplitudes: 2¹⁰ = 1024.'],
['Bell state (|00⟩+|11⟩)/√2: Bob gets 1. What did Alice get?',['0','*1','Can\'t say'],'In this Bell state the results always match.'],
['Grover on 16 items: roughly how many rounds?',['1','*3','16'],'(π/4)√16 ≈ 3.1, so 3 rounds.'],
['Which gate is NOT its own inverse?',['X','H','*T'],'T is a 45° phase turn; you need 8 of them to get back (or T†).'],
['3-qubit bit-flip code: two qubits flip. What happens?',['It is fixed','*It is "fixed" to the wrong value','Nothing'],'Majority vote now picks the wrong value. This code only fixes one flip.'],
['Z gate on |0⟩ gives…',['*|0⟩','|1⟩','−|1⟩'],'Z leaves |0⟩ alone and puts a minus sign on |1⟩.'],
['Shor on 15 with a = 7: the period of 7ˣ mod 15 is…',['2','*4','15'],'7, 4, 13, 1, then it repeats: period 4.']];
const dayIdx=Math.floor(Date.now()/864e5)%PUZ.length;
/* section */
const me=document.createElement('section');me.className='sec';me.id='me';
me.innerHTML=`<div class="sechead"><div class="num">⚡</div><div><small>Practice</small><h2>Your progress and practice</h2></div></div>
<p class="intro">Earn XP for quizzes, predictions and puzzles. Come back daily for your streak. Review cards bring back ideas just before you forget them (this is called <b>spaced repetition</b>).</p>
<div class="mebox"><div class="mecard" id="stats5"></div>
<div class="mecard"><h3>🧠 Review cards</h3><div id="srs5"></div></div>
<div class="mecard"><h3>🧩 Puzzle of the day</h3><div id="puz5"></div></div>
<div class="mecard"><h3>🏅 Badges</h3><div class="badges" id="bad5"></div></div>
<div class="mecard"><h3>🎓 Certificate</h3><p>Finish all chapters, type your name, and download your Quantum Atlas certificate.</p><label for="cname" style="display:block;margin-bottom:6px">Your name</label><input id="cname" maxlength="40" placeholder="Your name" style="width:100%"><div class="btnrow"><button type="button" id="certBtn" class="pri2">Download certificate</button></div><div id="certMsg" aria-live="polite"></div></div></div>
<h3 style="margin-top:28px">🔦 Game: the beam-splitter puzzle (Mach–Zehnder)</h3><div class="mecard mz" id="mz5"></div>`;
const hist=$('#history');hist.parentNode.insertBefore(me,hist);
function render(){window.QA5.render=render;const s=streak();hud.innerHTML=`⚡ ${st.xp}<span class="lbl"> XP</span> · 🔥 ${s}<span class="lbl"> day${s===1?'':'s'}</span>`;
 $('#stats5').innerHTML=`<h3>📈 Stats</h3><div class="big3"><div><b>${st.xp}</b>XP</div><div><b>${s}</b>day streak</div><div><b>${readN()}/${chaps.length}</b>chapters</div><div><b>${st.badges.length}</b>badges</div></div>`;
 $('#bad5').innerHTML=BADGES.map(([k,n])=>`<span class="badge5${st.badges.includes(k)?' got':''}">${n}</span>`).join('');renderSRS()}
function waitingMistakes(){const t=today();return Object.values(st.miss||{}).filter(c=>c.due&&c.due>t).length}
function renderSRS(){const box=$('#srs5'),due=dueCards();if(!due.length){const w=waitingMistakes();box.innerHTML=w?`<p>${w} missed question${w>1?'s':''} come back tomorrow.</p>`:(readN()?'<p>✅ No cards due. Come back tomorrow.</p>':'<p>Pass a chapter quiz to unlock its review cards. Missed questions come back the next day.</p>');return}
 const [k,[q,a]]=due[0];box.innerHTML=`<p style="font-size:.85rem;color:var(--mut)">${due.length} card${due.length>1?'s':''} due</p><div class="srs"><div class="q">${q}</div><div class="a">${a}</div><div class="btnrow"><button type="button" class="show">Show answer</button></div></div>`;
 const c=$('.srs',box);$('.show',c).onclick=()=>{c.classList.add('flip');$('.btnrow',c).innerHTML='<button type="button" class="again">Again (tomorrow)</button><button type="button" class="got pri2">Got it</button>';
  const grade=ok=>{const bag=k.indexOf('m:')===0?'miss':'srs';const book=bag==='miss'?(st.miss=st.miss||{}):st.srs;const s=book[k]||{box:0,n:0,q,a};s.box=ok?Math.min(IV.length-1,s.box+1):0;s.n=(s.n||0)+1;const d=new Date();d.setDate(d.getDate()+(ok?IV[s.box]:1));s.due=d.toISOString().slice(0,10);book[k]=s;addXP(ok?5:2,'review')};
  $('.again',c).onclick=()=>grade(false);$('.got',c).onclick=()=>grade(true)}}
/* puzzle */
(()=>{const [q,o,e]=PUZ[dayIdx],box=$('#puz5');box.innerHTML=`<p>${q}</p><div class="btnrow"></div><p class="pe" style="display:none"></p>`;const row=$('.btnrow',box),pe=$('.pe',box);const done=st.puz[today()];
 o.forEach(t=>{const ok=t[0]==='*',b=document.createElement('button');b.type='button';b.textContent=ok?t.slice(1):t;b.onclick=()=>{$$('button',row).forEach(x=>x.disabled=true);b.style.borderColor=ok?'#34d399':'#f87171';pe.style.display='block';pe.textContent=(ok?'✅ Right! ':'❌ Not quite. ')+e;if(!st.puz[today()]){st.puz[today()]=ok?1:0;addXP(ok?20:5,ok?'puzzle':'puzzle-miss')}};row.appendChild(b)});
 if(done!=null){pe.style.display='block';pe.textContent='You already played today. '+e}})();
/* certificate */
$('#certBtn').onclick=()=>{const m=$('#certMsg'),n=($('#cname').value||'').trim();if(readN()<chaps.length){m.textContent=`Finish all chapters first (${readN()} of ${chaps.length} done).`;return}if(!n){m.textContent='Please type your name first.';return}
 const c=document.createElement('canvas');c.width=1600;c.height=1000;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,1600,1000);g.addColorStop(0,'#020611');g.addColorStop(1,'#0b2a5c');x.fillStyle=g;x.fillRect(0,0,1600,1000);x.strokeStyle='#22d3ee';x.lineWidth=6;x.strokeRect(40,40,1520,920);x.lineWidth=1.5;x.strokeStyle='rgba(34,211,238,.4)';x.strokeRect(62,62,1476,876);
 x.textAlign='center';x.fillStyle='#22d3ee';x.font='600 34px "Space Grotesk",sans-serif';x.fillText('QUANTUM ATLAS · CERTIFICATE OF COMPLETION',800,190);x.fillStyle='#cfe0fa';x.font='32px Inter,sans-serif';x.fillText('This certifies that',800,330);x.fillStyle='#ffffff';x.font='800 84px Unbounded,"Space Grotesk",sans-serif';x.fillText(n,800,450);
 x.fillStyle='#cfe0fa';x.font='32px Inter,sans-serif';x.fillText('completed all '+chaps.length+' chapters of Quantum Atlas,',800,560);x.fillText('a quantum computing course by Quantura Technologies.',800,610);x.fillStyle='#fcd34d';x.font='600 30px "Space Grotesk",sans-serif';x.fillText(st.xp+' XP · '+st.badges.length+' badges · '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),800,720);x.fillStyle='#94a9cc';x.font='24px Inter,sans-serif';x.fillText('Quantura Technologies',800,860);
 const a=document.createElement('a');a.download='quantum-atlas-certificate.png';a.href=c.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();m.textContent='🎉 Certificate downloaded!';addXP(25,'cert')};
/* Mach–Zehnder game */
(()=>{const box=$('#mz5');const LV=[['Level 1: send every photon to detector A.','A',[1,0]],['Level 2: now send every photon to detector B.','B',[0,1]],['Level 3: make it a fair 50/50 coin.','fair',[.5,.5]],['Level 4 (bomb test): block the upper path. Can detector B ever click now?','bomb',null]];
 let lv=Math.min(st.mz||0,3);
 box.innerHTML=`<p>A photon meets a <b>beam splitter</b> (a half-silvered mirror). It goes into a superposition of the upper and lower path. Mirrors bring the paths back to a second beam splitter, where they <b>interfere</b>. You can add a <b>phase shift</b> to the upper path or <b>block</b> it.</p>
 <p class="lv" aria-live="polite"></p>
 <svg viewBox="0 0 560 250" role="img" aria-label="Mach–Zehnder interferometer: source, two beam splitters, two mirrors, upper and lower paths, detectors A and B"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#22d3ee"/></marker></defs>
 <rect x="10" y="185" width="50" height="30" rx="6" fill="#06122a" stroke="#22d3ee"/><text x="35" y="205" fill="#cfe0fa" font-size="12" text-anchor="middle">laser</text>
 <path d="M60 200 H120" stroke="#22d3ee" stroke-width="3" marker-end="url(#ar)"/>
 <line x1="110" y1="215" x2="140" y2="185" stroke="#93c5fd" stroke-width="5"/><text x="125" y="235" fill="#9fb6d9" font-size="11" text-anchor="middle">BS1</text>
 <path class="up" d="M125 200 V50 H400" stroke="#22d3ee" stroke-width="3" fill="none"/><path d="M125 200 H400 V50" stroke="#22d3ee" stroke-width="3" fill="none"/>
 <line x1="110" y1="65" x2="140" y2="35" stroke="#cbd5e1" stroke-width="5"/><line x1="385" y1="215" x2="415" y2="185" stroke="#cbd5e1" stroke-width="5"/>
 <rect class="ph" x="230" y="38" width="34" height="24" rx="4" fill="#0e7490" stroke="#22d3ee"/><text class="pht" x="247" y="30" fill="#fcd34d" font-size="12" text-anchor="middle">φ</text>
 <rect class="blk" x="300" y="35" width="14" height="30" fill="#f87171" style="display:none"/>
 <line x1="385" y1="65" x2="415" y2="35" stroke="#93c5fd" stroke-width="5"/><text x="400" y="25" fill="#9fb6d9" font-size="11" text-anchor="middle">BS2</text>
 <path d="M400 50 H490" stroke="#22d3ee" stroke-width="3"/><path d="M400 50 V-0" stroke="#22d3ee" stroke-width="0"/>
 <circle cx="505" cy="50" r="18" fill="#06122a" stroke="#22d3ee" stroke-width="2"/><text x="505" y="55" fill="#e6f7ff" font-size="14" text-anchor="middle">A</text><text class="ca" x="505" y="92" fill="#fcd34d" font-size="13" text-anchor="middle"></text>
 <path d="M400 50 V120" stroke="#22d3ee" stroke-width="3"/><circle cx="400" cy="138" r="18" fill="#06122a" stroke="#22d3ee" stroke-width="2"/><text x="400" y="143" fill="#e6f7ff" font-size="14" text-anchor="middle">B</text><text class="cb" x="440" y="143" fill="#fcd34d" font-size="13"></text></svg>
 <div class="btnrow"><label>Phase shift on upper path <select class="phs"><option value="0">0°</option><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label><label><input type="checkbox" class="blkc" style="min-height:auto;width:22px;height:22px"> Block upper path</label></div>
 <div class="btnrow"><button type="button" class="fire pri2">Fire 100 photons</button><button type="button" class="nextlv">Next level</button></div><p class="res" aria-live="polite"></p>`;
 const sel=$('.phs',box),blk=$('.blkc',box);
 function probs(){const ph=+sel.value*Math.PI/180,b=blk.checked;const s=Math.SQRT1_2;
  // BS: transmit amplitude s, reflect i*s. After BS1: upper (reflected) i*s, lower (transmitted) s.
  let u=[0,s],l=[s,0];if(b)u=[0,0];const c=[Math.cos(ph),Math.sin(ph)];u=[u[0]*c[0]-u[1]*c[1],u[0]*c[1]+u[1]*c[0]];
  const mul=(a,z)=>[a[0]*z[0]-a[1]*z[1],a[0]*z[1]+a[1]*z[0]];const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
  // BS2: A gets upper transmitted + lower reflected; B gets upper reflected + lower transmitted
  const A=add(mul(u,[s,0]),mul(l,[0,s])),B=add(mul(u,[0,s]),mul(l,[s,0]));const pa=A[0]**2+A[1]**2,pb=B[0]**2+B[1]**2;return [pa,pb,b?.5:0]}
 const show=()=>{$('.lv',box).textContent=LV[lv][0];$('.blk',box).style.display=blk.checked?'':'none';$('.pht',box).textContent='φ = '+sel.value+'°';$('.ca',box).textContent='';$('.cb',box).textContent='';$('.res',box).textContent='';$('.nextlv',box).disabled=!(st.mz>lv)};
 sel.onchange=show;blk.onchange=show;
 $('.fire',box).onclick=()=>{const [pa,pb,pl]=probs();let a=0,b=0,lost=0;for(let i=0;i<100;i++){const r=Math.random();if(r<pl)lost++;else if(r<pl+pa)a++;else b++}
  $('.ca',box).textContent=a;$('.cb',box).textContent=b;let msg=`A: ${a}, B: ${b}`+(lost?`, absorbed by the block: ${lost}`:'')+'. ';
  const g=LV[lv];let win=false;if(g[1]==='A')win=pa>.999;else if(g[1]==='B')win=pb>.999;else if(g[1]==='fair')win=Math.abs(pa-.5)<.01&&!blk.checked;else win=blk.checked&&pb>.2;
  msg+=win?({A:'✅ Both paths add up at A and cancel at B: constructive and destructive interference.',B:'✅ A 180° shift flips the sign of one path, so now the paths cancel at A instead.',fair:'✅ A 90° shift leaves the paths half in step: 50/50.',bomb:'✅ With the block, there is no interference, so B can click. A click at B proves the block is there even though that photon never touched it! (Elitzur–Vaidman bomb test.)'}[g[1]]):'Not yet. Try another setting.';
  $('.res',box).textContent=msg;if(win&&st.mz<=lv){st.mz=lv+1;addXP(30,'mz')}$('.nextlv',box).disabled=!(st.mz>lv)||lv>=3};
 $('.nextlv',box).onclick=()=>{if(lv<3&&st.mz>lv){lv++;show()}};show()})();
render();if(!st.days.includes(today())&&st.xp>0){}
})();
/* ---- D: 3-qubit Quirk-style circuit ---- */
(function(){const {$,$$}=window.QA5;const host=$('#gates');if(!host)return;
const box=document.createElement('div');box.className='viz q3';box.id='viz-circuit3';box.setAttribute('role','region');box.setAttribute('aria-label','Simulation: 3-qubit circuit with live displays');
box.innerHTML=`<h3>3-qubit circuit with live displays</h3><p class="hint">Pick a gate, then tap a slot. Tap a filled slot to clear it. For CNOT, put ● (control) and ⊕ (target) in the same column. The right side shows each qubit's chance of 1, and the bottom shows all 8 amplitudes: circle size = chance, line = phase.</p>
<div class="pal3" role="toolbar" aria-label="Gate palette"></div><div class="wrap3"><div class="grid3"></div></div><div class="amps8" aria-live="polite"></div><div class="btnrow"><button type="button" class="pre ghz">Preset: GHZ state</button><button type="button" class="pre sup">Preset: H on all</button><button type="button" class="clr">Clear</button></div><p class="o mono"></p>`;
const anchor=$('#viz-circuit')||$$('.topic',host).pop();(anchor.closest('details')||anchor).insertAdjacentElement('afterend',box);
const G=['H','X','Y','Z','S','T','●','⊕'];let sel='H',C=8,grid=[[],[],[]];
const pal=$('.pal3',box);G.forEach(g=>{const b=document.createElement('button');b.type='button';b.textContent=g;b.setAttribute('aria-label',g==='●'?'CNOT control':g==='⊕'?'CNOT target':g+' gate');b.onclick=()=>{sel=g;$$('button',pal).forEach(x=>x.classList.toggle('sel',x===b))};pal.appendChild(b)});pal.firstChild.classList.add('sel');
const gr=$('.grid3',box);
const cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],ad=(a,b)=>[a[0]+b[0],a[1]+b[1]],r2=Math.SQRT1_2;
const M={H:[[[r2,0],[r2,0]],[[r2,0],[-r2,0]]],X:[[[0,0],[1,0]],[[1,0],[0,0]]],Y:[[[0,0],[0,-1]],[[0,1],[0,0]]],Z:[[[1,0],[0,0]],[[0,0],[-1,0]]],S:[[[1,0],[0,0]],[[0,0],[0,1]]],T:[[[1,0],[0,0]],[[0,0],[r2,r2]]]};
function sim(){let s=Array.from({length:8},(_,i)=>[i?0:1,0]);for(let c=0;c<C;c++){const ctl=[0,1,2].filter(q=>grid[q][c]==='●'),tg=[0,1,2].filter(q=>grid[q][c]==='⊕');
 if(ctl.length&&tg.length){const n=s.map(a=>a.slice());for(let i=0;i<8;i++){if(ctl.every(q=>i>>q&1)){let j=i;tg.forEach(q=>j^=1<<q);n[j]=s[i]}}s=n}
 for(let q=0;q<3;q++){const g=grid[q][c];if(!M[g])continue;const m=M[g],n=s.map(()=>[0,0]);for(let i=0;i<8;i++){const b=i>>q&1,i0=i&~(1<<q),i1=i|(1<<q);n[i]=ad(cm(m[b][0],s[i0]),cm(m[b][1],s[i1]))}s=n}}return s}
function render(){gr.innerHTML='';const s=sim(),P=s.map(a=>a[0]**2+a[1]**2);
 for(let q=2;q>=0;q--){const l=document.createElement('div');l.className='mono';l.textContent='q'+q+' |0⟩';gr.appendChild(l);
  for(let c=0;c<C;c++){const b=document.createElement('button');b.type='button';b.className='c3'+(grid[q][c]?' f':'');b.textContent=grid[q][c]||'';b.setAttribute('aria-label',`qubit ${q}, step ${c+1}: ${grid[q][c]||'empty'}`);b.onclick=()=>{grid[q][c]=grid[q][c]===sel?null:sel;render()};gr.appendChild(b)}
  const p1=P.reduce((a,p,i)=>a+(i>>q&1?p:0),0);const w=document.createElement('div');w.className='wd';w.innerHTML=`P(1) ${Math.round(p1*100)}%<i><span style="width:${p1*100}%"></span></i>`;gr.appendChild(w)}
 $('.amps8',box).innerHTML=s.map((a,i)=>{const p=P[i],r=4+20*Math.sqrt(p),ph=Math.atan2(a[1],a[0]);return `<div><svg viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="25" fill="none" stroke="rgba(34,211,238,.25)"/>${p>1e-9?`<circle cx="27" cy="27" r="${r}" fill="rgba(34,211,238,.35)" stroke="#22d3ee"/><line x1="27" y1="27" x2="${27+r*Math.cos(ph)}" y2="${27-r*Math.sin(ph)}" stroke="#fcd34d" stroke-width="2"/>`:''}</svg><span class="mono">|${(i>>2&1)}${(i>>1&1)}${i&1}⟩</span><br>${Math.round(p*100)}%</div>`}).join('');
 const ent=(()=>{for(let q=0;q<3;q++){let rho=[[0,0],[0,0]];/*check product via purity of reduced state*/let a=[0,0],b=[0,0],c=[0,0];for(let i=0;i<8;i++){if(i>>q&1)continue;const j=i|1<<q;a=ad(a,[s[i][0]**2+s[i][1]**2,0]);b=ad(b,[s[j][0]**2+s[j][1]**2,0]);c=ad(c,cm(s[i],[s[j][0],-s[j][1]]))}const pur=a[0]**2+b[0]**2+2*(c[0]**2+c[1]**2);if(pur<.999)return true}return false})();
 $('.o',box).textContent=ent?'🔗 Some qubits are entangled (a qubit\'s own state is no longer pure).':'No entanglement: each qubit has its own state.'}
$('.ghz',box).onclick=()=>{grid=[[],[],[]];grid[0][0]='H';grid[0][1]='●';grid[1][1]='⊕';grid[1][2]='●';grid[2][2]='⊕';render()};
$('.sup',box).onclick=()=>{grid=[['H'],['H'],['H']];render()};$('.clr',box).onclick=()=>{grid=[[],[],[]];render()};render()})();
/* ---- v6: glossary as a learning path ---- */
(function(){const gl=document.getElementById('gl'),q=document.getElementById('glq');if(!gl)return;
const ST=[['1. Bits and qubits','Start here: what a qubit is.',['Bit','Qubit','Ket','Superposition','Amplitude','Measurement','Shot']],
['2. Phase and pictures','What makes quantum different.',['Phase','Interference','Bloch sphere','Bra','Inner product']],
['3. Gates and circuits','How we change qubits.',['Gate','Unitary','Hadamard gate (H)','CNOT','Clifford gates','Outer product','Projector']],
['4. Many qubits','Joining qubits together.',['Tensor product','Entanglement','Bell state','No-cloning theorem','Density matrix']],
['5. Algorithms','Recipes that use interference.',['Quantum algorithm','Oracle','Ancilla','Grover\'s algorithm','Shor\'s algorithm','Quantum advantage','BQP']],
['6. Errors and noise','Why qubits are fragile.',['Noise','Decoherence','Coherence time','Fidelity','Quantum error correction','Syndrome','Stabiliser','Logical qubit','NISQ']],
['7. Hardware','What qubits are made of.',['Superconducting qubit','Josephson junction','Dilution refrigerator','Spin qubit','Trapped-ion qubit','Neutral-atom qubit','Photonic qubit','NV centre','Transpiler']],
['8. Advanced','For later.',['Hamiltonian','Expectation value','Topological qubit','Majorana zero mode','Anyon']]];
const items=[...gl.querySelectorAll(':scope > div')],by={};items.forEach(d=>{by[d.querySelector('b').textContent.trim()]=d});
const az=items.slice();
const tools=document.createElement('div');tools.className='gltools';tools.innerHTML='<button type="button" class="on" data-m="path">Learning path order</button><button type="button" data-m="az">A–Z order</button>';q.insertAdjacentElement('afterend',tools);
const path=()=>{gl.innerHTML='';const used=new Set();ST.forEach(([t,sub,ks])=>{const h=document.createElement('h4');h.className='stage';h.innerHTML=t+'<small>'+sub+'</small>';gl.appendChild(h);ks.forEach(k=>{if(by[k]){gl.appendChild(by[k]);used.add(k)}})});const rest=az.filter(d=>!used.has(d.querySelector('b').textContent.trim()));if(rest.length){const h=document.createElement('h4');h.className='stage';h.textContent='More terms';gl.appendChild(h);rest.forEach(d=>gl.appendChild(d))}};
const azv=()=>{gl.innerHTML='';az.forEach(d=>gl.appendChild(d))};
const filt=()=>{let cur=null,any=false;[...gl.children].forEach(e=>{if(e.tagName==='H4'){if(cur)cur.style.display=any?'':'none';cur=e;any=false}else if(e.style.display!=='none')any=true});if(cur)cur.style.display=any?'':'none'};
tools.onclick=e=>{const b=e.target.closest('button');if(!b)return;tools.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));b.dataset.m==='az'?azv():path();q.dispatchEvent(new Event('input'))};
q.addEventListener('input',()=>setTimeout(filt,0));path()})();
/* ---- v6: fabrication stepper ---- */
(function(){const f=document.getElementById('fab');if(!f)return;const box=f.querySelector('.fabsvg'),tx=f.querySelector('.fabtxt');let i=0,timer=null;
const S=['1. Clean the wafer (silicon or sapphire).','2. Deposit a thin film of Al, Nb or Ta (~100–200 nm).','3. Lithography: draw the pattern in resist, then etch away extra metal.','4. Josephson junction: Al, then a thin AlOx layer, then Al again (double-angle evaporation).','5. Dice the wafer into chips.','6. Package: wire-bond into a copper box (or flip-chip bump bond).','7. Mount in the dilution fridge at ~10 mK with microwave wiring.'];
function draw(){const k=i;let g='<svg viewBox="0 0 600 200" role="img" aria-label="Fabrication step '+(k+1)+' of 7: '+S[k]+'"><rect width="600" height="200" rx="12" fill="#020611"/>';
 if(k<=4){g+='<rect x="60" y="130" width="480" height="34" rx="4" fill="#475569"/><text x="300" y="152" fill="#e2e8f0" font-size="13" text-anchor="middle">silicon / sapphire wafer</text>';
  if(k===0)g+='<g fill="#a5f3fc" opacity=".8"><circle cx="120" cy="110" r="4"/><circle cx="220" cy="98" r="3"/><circle cx="330" cy="112" r="4"/><circle cx="450" cy="100" r="3"/></g><text x="300" y="60" fill="#67e8f9" font-size="15" text-anchor="middle">chemical clean: dust and oxide washed away</text>';
  if(k===1)g+='<rect x="60" y="118" width="480" height="12" fill="#22d3ee"/><text x="300" y="60" fill="#67e8f9" font-size="15" text-anchor="middle">metal atoms land as a thin film</text><g fill="#22d3ee">'+[...Array(14)].map((_,j)=>'<circle cx="'+(80+j*33)+'" cy="'+(80+(j%3)*10)+'" r="3"/>').join('')+'</g>';
  if(k===2)g+='<rect x="80" y="118" width="120" height="12" fill="#22d3ee"/><rect x="250" y="118" width="40" height="12" fill="#22d3ee"/><rect x="330" y="118" width="190" height="12" fill="#22d3ee"/><text x="300" y="60" fill="#67e8f9" font-size="15" text-anchor="middle">pattern: pads, wires, resonators</text>';
  if(k===3)g+='<rect x="80" y="118" width="170" height="12" fill="#22d3ee"/><rect x="350" y="118" width="170" height="12" fill="#22d3ee"/><rect x="240" y="104" width="70" height="10" fill="#22d3ee"/><rect x="250" y="114" width="70" height="4" fill="#f8fafc"/><rect x="260" y="118" width="100" height="10" fill="#22d3ee"/><text x="300" y="60" fill="#fcd34d" font-size="15" text-anchor="middle">Al / AlOx (white, ~1–2 nm) / Al</text>';
  if(k===4)g+='<g stroke="#fcd34d" stroke-width="2" stroke-dasharray="4 4"><line x1="180" y1="100" x2="180" y2="175"/><line x1="300" y1="100" x2="300" y2="175"/><line x1="420" y1="100" x2="420" y2="175"/></g><text x="300" y="60" fill="#67e8f9" font-size="15" text-anchor="middle">saw cuts the wafer into chips</text>'}
 else if(k===5)g+='<rect x="150" y="60" width="300" height="110" rx="8" fill="#92400e" opacity=".6" stroke="#fbbf24"/><text x="300" y="185" fill="#fcd34d" font-size="13" text-anchor="middle">copper box / circuit board</text><rect x="240" y="95" width="120" height="40" rx="4" fill="#475569"/><rect x="240" y="91" width="120" height="5" fill="#22d3ee"/><g stroke="#e2e8f0" fill="none" stroke-width="1.5"><path d="M245 95 Q215 70 185 95"/><path d="M355 95 Q385 70 415 95"/></g><text x="300" y="45" fill="#67e8f9" font-size="15" text-anchor="middle">tiny wire bonds connect chip to package</text>';
 else g+=[0,1,2,3].map(j=>'<rect x="200" y="'+(20+j*38)+'" width="200" height="8" rx="3" fill="'+['#64748b','#38bdf8','#22d3ee','#67e8f9'][j]+'"/><text x="410" y="'+(28+j*38)+'" fill="#b7c8e6" font-size="12">'+['~50 K','~4 K','~0.1 K','~10 mK'][j]+'</text>').join('')+'<line x1="300" y1="0" x2="300" y2="150" stroke="#fbbf24" stroke-width="2"/><rect x="270" y="150" width="60" height="30" rx="4" fill="#475569" stroke="#22d3ee"/><text x="190" y="170" fill="#fcd34d" font-size="12" text-anchor="end">microwave cables</text><text x="345" y="172" fill="#e6f2ff" font-size="12">chip</text>';
 box.innerHTML=g+'</svg>';tx.textContent=S[k];f.querySelector('.fprev').disabled=k===0;f.querySelector('.fnext').disabled=k===S.length-1}
f.querySelector('.fprev').onclick=()=>{if(i>0){i--;draw()}};f.querySelector('.fnext').onclick=()=>{if(i<S.length-1){i++;draw()}};
f.querySelector('.fplay').onclick=e=>{const b=e.currentTarget;if(timer){clearInterval(timer);timer=null;b.textContent='▶ Play';return}if(i>=S.length-1)i=0;draw();b.textContent='⏸ Pause';timer=setInterval(()=>{if(i<S.length-1){i++;draw()}else{clearInterval(timer);timer=null;b.textContent='▶ Play'}},1800)};draw()})();
if(window.QALearn)QALearn.refresh();
}
if(window.QA_BUILT)startQA5();else document.addEventListener('qa:built',startQA5,{once:true});
