/* Quantum Atlas v10: main menu + view router (home / hardware / learn). Quantura Technologies */
(function(){const H=document.documentElement,$=(s,r=document)=>r.querySelector(s);
const home=$('#home10');if(!home)return;
const viewFromHash=()=>{const h=location.hash;if(!h||h==='#'||h==='#home')return'home';if(h==='#hardware')return'hw';return'site'};
let cur=null;
function show(v){if(v===cur)return;const prev=cur;cur=v;H.classList.remove('v-home','v-hw','v-site');H.classList.add('v-'+v);
 if(v==='hw'){window.QA10HW&&window.QA10HW.open()}else if(prev==='hw'){window.QA10HW&&window.QA10HW.close()}
 if(v==='home'){startBg();document.body.classList.remove('drawer','searchopen')}else stopBg();
 if(v==='site'&&prev&&prev!=='site'){const t=$('.topbar #home10btn');}
 window.dispatchEvent(new CustomEvent('qa10view',{detail:v}))}
function go(v){const url=v==='home'?'#home':v==='hw'?'#hardware':(/^#(home|hardware)?$/.test(location.hash)?'#learn':location.hash||'#learn');
 if(location.hash!==url||!history.state||history.state.v!==v)history.pushState({v},'',url);show(v);
 if(v==='home')setTimeout(()=>{const b=$('#go-hw');b&&b.focus({preventScroll:true})},50)}
window.QA10={go,show,get view(){return cur}};
addEventListener('popstate',e=>show((e.state&&e.state.v)||viewFromHash()));
addEventListener('hashchange',()=>show(viewFromHash()));
$('#go-hw').addEventListener('click',()=>go('hw'));
$('#go-learn').addEventListener('click',()=>{go('site');if(!H.dataset.learnSeen){H.dataset.learnSeen=1}});
const sb=$('#home10 .hset');if(sb)sb.addEventListener('click',()=>{const g=$('.topbar .gear');g&&g.click()});
/* main-menu button in the top bar + drawer */
const mb=$('#menuBtn');if(mb){const b=document.createElement('button');b.type='button';b.className='iconbtn';b.id='home10btn';b.title='Main menu';b.setAttribute('aria-label','Back to the main menu');
 b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor"/></svg>';
 b.addEventListener('click',()=>go('home'));mb.insertAdjacentElement('afterend',b)}
document.querySelectorAll('a[data-home10]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const cb=$('#closeBtn');if(document.body.classList.contains('drawer')&&cb)cb.click();go(a.dataset.home10==='hw'?'hw':'home')}));
/* animated quantum background */
const cv=$('canvas.bg',home),x=cv.getContext('2d');let raf=0,W=0,Hh=0,pts=[],col={a:'#1e6bff',b:'#22d3ee'};
const readCol=()=>{const cs=getComputedStyle(H);col.a=cs.getPropertyValue('--a').trim()||'#1e6bff';col.b=cs.getPropertyValue('--b').trim()||'#22d3ee'};
new MutationObserver(readCol).observe(H,{attributes:true,attributeFilter:['data-theme','data-skin','class']});
const rm=()=>H.classList.contains('rm')||matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;Hh=innerHeight;cv.width=W*d;cv.height=Hh*d;x.setTransform(d,0,0,d,0,0);const n=Math.round(Math.min(120,W*Hh/12000));pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*Hh,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:1+Math.random()*1.8,p:Math.random()*6.28}))}
function frame(t){x.clearRect(0,0,W,Hh);const L=Math.min(150,W/7);
 // probability waves
 x.lineWidth=2;for(let k=0;k<3;k++){x.strokeStyle=k%2?col.a:col.b;x.globalAlpha=.16-k*.03;x.beginPath();for(let X=0;X<=W;X+=8){const Y=Hh*(.5+.16*k-.16)+Math.sin(X*.006+t*.0006*(k+1))*40*Math.cos(X*.002-t*.0003);X?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}
 x.globalAlpha=1;
 for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>Hh)p.vy*=-1}
 x.strokeStyle=col.b;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<L){x.globalAlpha=(1-d/L)*.35;x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
 x.fillStyle=col.b;for(const p of pts){x.globalAlpha=.55+.45*Math.sin(t*.002+p.p);x.beginPath();x.arc(p.x,p.y,p.r,0,6.3);x.fill()}x.globalAlpha=1;
 if(!rm()&&!document.hidden)raf=requestAnimationFrame(frame);else raf=0}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cur==='home'&&!raf&&!rm())raf=requestAnimationFrame(frame)});
function startBg(){readCol();size();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function stopBg(){cancelAnimationFrame(raf);raf=0}
addEventListener('resize',()=>{if(cur==='home'){size();if(rm())frame(0)}});
/* first view */
const v0=viewFromHash();history.replaceState({v:v0},'',location.href);show(v0);
})();
