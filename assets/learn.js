/* Quantum Atlas learning checks, path order, and account sync. Quantura Technologies */
(function(){
const PATHS={
  beginner:['qubits','gates','hw','algo','crypto','nisq'],
  student:['found','qubits','gates','info','algo','qec','cx'],
  coder:['qubits','gates','programming','algo','nisq','qec']
};
const SYNC_KEYS=['qa-read','qa-quiz','qa-tasks','qa-road','qa5-path','qa5-game','qa10-sim-saved','qa5-settings'];
const TASKS={
  gates:{
    title:'Hands-on: build a Bell state',
    text:'In the simulator, put H on qubit 0 and then CNOT from qubit 0 to qubit 1, or load the Bell example. |00⟩ and |11⟩ should each be about 50%.',
    preset:'bell',
    check:bellCheck
  },
  algo:{
    title:'Hands-on: Grover on 4 items',
    text:'Load the Grover example, or build that circuit yourself, then check. |11⟩ should be almost certain.',
    preset:'grover',
    check:groverCheck
  },
  programming:{
    title:'Hands-on: one Hadamard',
    text:'Use 1 qubit and place H on it, or load the example. The chances of 0 and 1 should each be about 50%.',
    preset:'coin',
    check:coinCheck
  }
};
let applying=false, email=null, pushTimer=0;

function readJSON(key, d){try{const v=localStorage.getItem(key);return v==null?d:JSON.parse(v)}catch(e){return d}}
function quizState(){return readJSON('qa-quiz',{})}
function taskState(){return readJSON('qa-tasks',{})}
function pathIds(){const k=readJSON('qa5-path',null);return k&&PATHS[k]?PATHS[k]:null}
function chapterTitle(id){const h=document.querySelector('#'+CSS.escape(id)+' .sechead h2');return h?h.textContent.split(':')[0]:id}
function probs(){
  const sim=window.QA10SIM;
  if(!sim||typeof sim.simulate!=='function')return null;
  const r=sim.simulate();
  return {n:sim.state.n,P:Array.from(r.P)};
}
function near(p,want){return Math.abs(p-want)<0.08}
function bellCheck(){
  const s=probs();
  if(!s||s.n!==2)return {ok:false,msg:'Use 2 qubits.'};
  const [p00,p01,p10,p11]=s.P;
  if(near(p00,.5)&&near(p11,.5)&&p01<0.02&&p10<0.02)return {ok:true,msg:'Bell state confirmed. Only |00⟩ and |11⟩, about half the time each.'};
  return {ok:false,msg:'Not a Bell state yet. |00⟩ and |11⟩ should each be about 50%, and the other results should be 0.'};
}
function groverCheck(){
  const s=probs();
  if(!s||s.n!==2)return {ok:false,msg:'Use 2 qubits.'};
  if(s.P[3]>0.9)return {ok:true,msg:'Grover found |11⟩.'};
  return {ok:false,msg:'|11⟩ is not the clear result yet. Load the Grover example and check again.'};
}
function coinCheck(){
  const s=probs();
  if(!s||s.n!==1)return {ok:false,msg:'Use 1 qubit.'};
  if(near(s.P[0],.5)&&near(s.P[1],.5))return {ok:true,msg:'Hadamard confirmed: about 50% for 0 and 50% for 1.'};
  return {ok:false,msg:'Place H on the single qubit so 0 and 1 are each about 50%.'};
}
function quizPassed(id){
  const sec=document.getElementById(id);
  if(!sec)return false;
  const qs=[...sec.querySelectorAll('.quiz .q')];
  if(!qs.length)return false;
  const st=quizState()[id]||{};
  return qs.every(w=>!!st[w.dataset.i]);
}
function taskPassed(id){return !TASKS[id]||!!taskState()[id]}
function isDone(id){return quizPassed(id)&&taskPassed(id)}
function blockingChapter(id){
  const list=pathIds();
  if(!list)return null;
  const i=list.indexOf(id);
  if(i<0)return null;
  for(let j=0;j<i;j++)if(!isDone(list[j]))return list[j];
  return null;
}
function isReached(id){return !blockingChapter(id)}
function notify(){document.dispatchEvent(new Event('qa:progress'))}
function paintQuiz(sec){
  const st=quizState()[sec.id]||{};
  sec.querySelectorAll('.quiz .q').forEach(w=>{
    if(!st[w.dataset.i])return;
    w.classList.add('done');
    w.querySelectorAll('.opts button').forEach(b=>{if(b.dataset.ok)b.classList.add('ok')});
  });
}
function ensureTask(sec){
  const task=TASKS[sec.id];
  if(!task||sec.querySelector('.taskbox'))return;
  const box=document.createElement('div');
  box.className='taskbox';
  box.innerHTML=`<h4>${task.title}</h4><p>${task.text}</p><div class="btnrow"><button type="button" class="loadp">Load the example</button><button type="button" class="checkp pri">Check my circuit</button></div><p class="taskmsg" aria-live="polite"></p>`;
  const quiz=sec.querySelector('.quiz');
  (quiz||sec).insertAdjacentElement('afterend',box);
  const load=box.querySelector('.loadp');
  if(!task.preset)load.hidden=true;
  else load.onclick=()=>{if(window.QA10SIM&&QA10SIM.preset)QA10SIM.preset(task.preset);location.hash='#sim'};
  box.querySelector('.checkp').onclick=()=>{
    const msg=box.querySelector('.taskmsg');
    if(!isReached(sec.id)){msg.textContent='Finish the earlier chapter on your path first.';return}
    const res=task.check();
    msg.textContent=res.msg;
    if(!res.ok)return;
    const t=taskState();t[sec.id]=true;localStorage.setItem('qa-tasks',JSON.stringify(t));
    if(window.QA5&&QA5.addXP)QA5.addXP(20,'circuit');
    refresh();
  };
  if(taskState()[sec.id])box.querySelector('.taskmsg').textContent='Passed.';
}
function refresh(chaps){
  if(!chaps||!chaps.length)chaps=[...document.querySelectorAll('#content > section.sec')].filter(s=>document.querySelector('#chap a[href="#'+s.id+'"]'));
  const before=localStorage.getItem('qa-read')||'{}';
  const R={};
  chaps.forEach(sec=>{
    ensureTask(sec);
    paintQuiz(sec);
    const done=isDone(sec.id);
    if(done)R[sec.id]=true;
    const reached=isReached(sec.id);
    sec.classList.toggle('unreached',!reached);
    const quiz=sec.querySelector('.quiz');
    if(quiz)quiz.classList.toggle('locked',!reached);
    let banner=sec.querySelector('.gatebanner');
    if(!reached){
      const back=blockingChapter(sec.id);
      if(!banner){banner=document.createElement('p');banner.className='gatebanner';const head=sec.querySelector('.sechead');head.insertAdjacentElement('afterend',banner)}
      banner.innerHTML=`This chapter comes later on your path. Pass the check in <a href="#${back}">${chapterTitle(back)}</a> first.`;
    }else if(banner)banner.remove();
    const status=sec.querySelector('.donebtn');
    if(status){
      status.classList.toggle('on',done);
      status.textContent=done?'✓ Chapter complete':(!quizPassed(sec.id)?'Pass every quiz question to finish this chapter':'Pass the hands-on check to finish this chapter');
    }
    const link=document.querySelector('#chap a[href="#'+sec.id+'"]');
    if(link){link.classList.toggle('read',done);link.classList.toggle('locked',!reached)}
    if(done&&window.QA5&&QA5.awardChapter)QA5.awardChapter(sec.id);
  });
  const next=JSON.stringify(R);
  const pb=document.getElementById('progbar');
  if(pb)pb.textContent='Your progress: '+Object.keys(R).length+' of '+chaps.length+' chapters done';
  if(next!==before){localStorage.setItem('qa-read',next);localStorage.setItem('qa-local-at',new Date().toISOString())}
  if(window.QA5&&QA5.drawMap)QA5.drawMap();
  return R;
}
function onAnswer(id,qi,ok,question,correct){
  const all=quizState();
  const st=all[id]||{};
  if(ok)st[String(qi)]=true;else delete st[String(qi)];
  all[id]=st;
  localStorage.setItem('qa-quiz',JSON.stringify(all));
  localStorage.setItem('qa-local-at',new Date().toISOString());
  if(!ok&&window.QA5&&QA5.addMistake)QA5.addMistake(id,question,correct);
  refresh();
  notify();
}
function resetAnswer(id,qi){
  const all=quizState();
  const st=all[id]||{};
  delete st[String(qi)];
  all[id]=st;
  localStorage.setItem('qa-quiz',JSON.stringify(all));
  localStorage.setItem('qa-local-at',new Date().toISOString());
  refresh();
  notify();
}

function snapshot(){
  const data={};
  SYNC_KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!=null)data[k]=v});
  return data;
}
async function api(path,opts){
  const r=await fetch(path,Object.assign({credentials:'same-origin',headers:{'Content-Type':'application/json'}},opts||{}));
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||('Request failed ('+r.status+')'));
  return j;
}
async function push(){
  if(!email||applying)return;
  const saved=await api('/api/progress',{method:'PUT',body:JSON.stringify({data:snapshot()})});
  if(saved.updated_at)localStorage.setItem('qa-sync-at',saved.updated_at);
}
function schedulePush(){
  if(!email||applying)return;
  clearTimeout(pushTimer);
  pushTimer=setTimeout(()=>{push().catch(()=>{})},800);
}
function applyRemote(data,stamp){
  applying=true;
  SYNC_KEYS.forEach(k=>{if(data[k]!=null)localStorage.setItem(k,data[k]);else localStorage.removeItem(k)});
  localStorage.setItem('qa-sync-at',stamp||'');
  localStorage.setItem('qa-local-at',stamp||'');
  applying=false;
  location.reload();
}
async function sync(){
  const me=await api('/api/auth/me');
  email=me.email||null;
  paintAuth();
  if(!email)return;
  const remote=await api('/api/progress');
  const remoteStamp=remote.updated_at||'';
  const syncAt=localStorage.getItem('qa-sync-at')||'';
  const localAt=localStorage.getItem('qa-local-at')||'';
  const remoteHas=remote.data&&Object.keys(remote.data).length;
  if(remoteHas&&remoteStamp>syncAt&&remoteStamp>localAt){applyRemote(remote.data,remoteStamp);return}
  await push();
}
function closeAcctMenu(){
  const menu=document.getElementById('authMenu');
  const btn=document.getElementById('authBtn');
  if(menu){
    menu.hidden=true;menu._armed=0;
    const out=menu.querySelector('.out');
    const warn=menu.querySelector('.warn');
    if(out){out.classList.remove('hot');out.textContent='Sign out'}
    if(warn)warn.textContent='';
  }
  if(btn)btn.setAttribute('aria-expanded','false');
}
async function signOut(){
  try{await api('/api/auth/logout',{method:'POST',body:'{}'})}catch(e){}
  email=null;paintAuth();closeAcctMenu();
  const dlg=document.getElementById('authDlg');
  if(!dlg)return;
  dlg.querySelector('.who').textContent='';
  dlg.querySelector('.out').hidden=true;
  dlg.querySelector('.msg').textContent='Signed out on this browser. The progress on this device is still here.';
  if(dlg._disarm)dlg._disarm();
}
function paintAuth(){
  document.documentElement.classList.toggle('acct-in',!!email);
  const home=document.getElementById('authHome');
  if(home)home.textContent=email?'Account':'Sign in';
  const btn=document.getElementById('authBtn');
  if(btn){
    btn.classList.toggle('in',!!email);
    btn.setAttribute('aria-label',email?'Account menu':'Sign in');
    btn.title=email?'Account':'Sign in';
  }
  const who=document.querySelector('#authMenu .who');
  if(who){who.textContent=email||'';who.hidden=!email}
  const item=document.querySelector('#authMenu .out');
  if(item)item.hidden=!email;
}
function authDialog(){
  let dlg=document.getElementById('authDlg');
  if(dlg)return dlg;
  dlg=document.createElement('div');
  dlg.id='authDlg';
  dlg.innerHTML=`<div class="card" role="dialog" aria-labelledby="authTitle"><h2 id="authTitle">Save progress to your email</h2><p>We email you a 6-digit code. There is no password. Your lessons stay on this device until you sign in, then they follow this email.</p><div class="who"></div><label for="authEmail">Email</label><input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com"><button type="button" class="otp">Get email OTP</button><label for="authCode">Code</label><input id="authCode" inputmode="numeric" autocomplete="one-time-code" placeholder="6-digit code"><p class="msg" aria-live="polite"></p><div class="row"><button type="button" class="pri verify">Sign in</button><button type="button" class="close">Close</button></div><p class="warn" aria-live="polite"></p><button type="button" class="out">Sign out</button></div>`;
  document.body.appendChild(dlg);
  const msg=dlg.querySelector('.msg');
  const warn=dlg.querySelector('.warn');
  const out=dlg.querySelector('.out');
  let armed=0;
  const disarm=()=>{armed=0;out.classList.remove('hot');out.textContent='Sign out';warn.textContent=''};
  const close=()=>{dlg.classList.remove('on');disarm()};
  dlg.querySelector('.close').onclick=close;
  dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
  dlg.querySelector('.otp').onclick=async()=>{
    msg.textContent='Sending…';
    try{
      const sent=await api('/api/auth/request',{method:'POST',body:JSON.stringify({email:dlg.querySelector('#authEmail').value})});
      msg.textContent=sent.devCode?('Development code: '+sent.devCode):'Check your email for the code. It expires in 10 minutes.';
    }catch(e){msg.textContent=e.message}
  };
  dlg.querySelector('.verify').onclick=async()=>{
    msg.textContent='Checking…';
    try{
      const verified=await api('/api/auth/verify',{method:'POST',body:JSON.stringify({email:dlg.querySelector('#authEmail').value,code:dlg.querySelector('#authCode').value})});
      email=verified.email;paintAuth();out.hidden=false;msg.textContent='Signed in. Syncing progress…';
      await sync();
      close();
    }catch(e){msg.textContent=e.message}
  };
  dlg._disarm=disarm;
  out.onclick=async()=>{
    if(!armed){
      armed=1;out.classList.add('hot');out.textContent='Confirm sign out';
      warn.textContent='Sign out of this browser? Lessons stay on this device and stop syncing until you sign in again.';
      return;
    }
    await signOut();
  };
  return dlg;
}
function openAuth(){
  closeAcctMenu();
  const dlg=authDialog();
  dlg._disarm();
  dlg.querySelector('.who').textContent=email?('Signed in as '+email):'';
  dlg.querySelector('.out').hidden=!email;
  dlg.classList.add('on');
  dlg.querySelector('#authEmail').focus();
}
function mountAuthButtons(){
  if(document.getElementById('authBtn'))return;
  const bar=document.querySelector('.topbar');
  if(bar){
    const wrap=document.createElement('div');
    wrap.className='acct';
    wrap.innerHTML='<button type="button" class="iconbtn" id="authBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="authMenu" aria-label="Sign in"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="8" r="3.25" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.2 19.4a6.8 6.8 0 0 1 13.6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><div class="pmenu" id="authMenu" role="menu" hidden><p class="who" hidden></p><button type="button" class="set" role="menuitem">Settings</button><button type="button" class="out" role="menuitem" hidden>Sign out</button><p class="warn" aria-live="polite"></p></div>';
    bar.appendChild(wrap);
    const btn=wrap.querySelector('#authBtn');
    const menu=wrap.querySelector('#authMenu');
    const out=menu.querySelector('.out');
    const warn=menu.querySelector('.warn');
    btn.onclick=e=>{
      e.stopPropagation();
      if(!email){openAuth();return}
      if(menu.hidden){menu.hidden=false;btn.setAttribute('aria-expanded','true')}
      else closeAcctMenu();
    };
    menu.querySelector('.set').onclick=()=>{closeAcctMenu();const g=document.querySelector('.topbar .gear');if(g)g.click()};
    out.onclick=async()=>{
      if(!menu._armed){
        menu._armed=1;out.classList.add('hot');out.textContent='Confirm sign out';
        warn.textContent='Sign out of this browser? Lessons stay on this device and stop syncing until you sign in again.';
        return;
      }
      await signOut();
    };
    document.addEventListener('click',e=>{if(!wrap.contains(e.target))closeAcctMenu()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAcctMenu()});
  }
  const foot=document.querySelector('#home10 .hfoot');
  if(foot){const b=document.createElement('button');b.type='button';b.id='authHome';b.className='hset';b.textContent='Sign in';b.onclick=openAuth;foot.appendChild(b)}
  paintAuth();
  sync().catch(()=>{});
}

window.QALearn={isReached,isDone,onAnswer,resetAnswer,refresh,TASKS};
document.addEventListener('qa:progress',()=>{if(applying)return;localStorage.setItem('qa-local-at',new Date().toISOString());if(window.QA_BUILT)refresh();schedulePush()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountAuthButtons);
else mountAuthButtons();
})();
