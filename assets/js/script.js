
(function(){

/* ── Hire intent modal ── */
const hireModal    = document.getElementById('hire-modal');
const hireForm     = document.getElementById('hire-form');
const hireConfirm  = document.getElementById('hire-confirm');
const hireClose    = hireModal.querySelector('.hire-modal-close');
const hireBackdrop = hireModal.querySelector('.hire-modal-backdrop');
const btnCall      = document.querySelector('.btn-call');

function openHireModal() {
  hireForm.reset();
  hireForm.classList.remove('hidden-state');
  hireConfirm.classList.remove('visible', 'shown');
  const headline = hireModal.querySelector('.hire-form-headline');
  headline.style.display = '';
  const wrap = hireModal.querySelector('.hire-form-wrap');
  wrap.classList.remove('fading');
  wrap.style.opacity = '';
  wrap.style.transform = '';
  hireModal.setAttribute('aria-hidden', 'false');
  hireModal.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  hireModal.querySelector('input').focus();
}
function closeHireModal() {
  hireModal.setAttribute('aria-hidden', 'true');
  hireModal.classList.remove('open');
  document.documentElement.style.overflow = '';
}

btnCall.addEventListener('click', openHireModal);
hireClose.addEventListener('click', closeHireModal);
hireBackdrop.addEventListener('click', closeHireModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hireModal.classList.contains('open')) closeHireModal();
});

hireForm.addEventListener('submit', e => {
  e.preventDefault();
  const wrap = hireModal.querySelector('.hire-form-wrap');
  // Fade the whole form area out
  wrap.classList.add('fading');
  setTimeout(() => {
    hireForm.classList.add('hidden-state');
    hireModal.querySelector('.hire-form-headline').style.display = 'none';
    hireConfirm.classList.add('visible');
    // Force reflow so transition fires
    void hireConfirm.offsetWidth;
    hireConfirm.classList.add('shown');
    wrap.classList.remove('fading');
    wrap.style.opacity = '1';
    wrap.style.transform = 'none';
  }, 260);
});

/* ── Header: peek on scroll up, auto-hide after 2.5s ── */
const siteHeader = document.getElementById('site-header');
let hdrLastY = window.scrollY;
let hdrHideTimer = null;

function hdrScheduleHide() {
  clearTimeout(hdrHideTimer);
  hdrHideTimer = setTimeout(() => {
    siteHeader.classList.add('header-hidden');
  }, 2500);
}

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    siteHeader.classList.remove('header-hidden');
    clearTimeout(hdrHideTimer);
  } else if (y > hdrLastY && y > 60) {
    siteHeader.classList.add('header-hidden');
    clearTimeout(hdrHideTimer);
  } else if (y < hdrLastY) {
    siteHeader.classList.remove('header-hidden');
    hdrScheduleHide();
  }
  hdrLastY = y;
}, { passive: true });

/* ── Social proof section ── */
const socialInner = document.querySelector('.social-inner');
if (socialInner) {
  const socialObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) socialInner.classList.add('show');
      else socialInner.classList.remove('show');
    });
  }, { threshold: 0.3 });
  socialObs.observe(document.getElementById('s_social'));
}

/* ── Testimonials ── */
const testiCards = document.querySelectorAll('.testi-card');
if (testiCards.length) {
  const testiObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        testiCards.forEach((c, i) => setTimeout(() => c.classList.add('show'), i * 80));
      } else {
        testiCards.forEach(c => c.classList.remove('show'));
      }
    });
  }, { threshold: 0.2 });
  testiObs.observe(document.getElementById('s_testi'));
}

/* ── Ticker ── */
(function() {
  const track = document.getElementById('tickerTrack');
  const seed  = document.getElementById('tickerSet');
  if (!track || !seed) return;

  // Clone sets until track is >3× viewport wide (max 20 clones as safety)
  function fillTrack() {
    let i = 0;
    while (track.offsetWidth < window.innerWidth * 3 && i < 20) {
      const clone = seed.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      i++;
    }
  }

  fillTrack();
  // Re-fill after images load and expand the logos
  window.addEventListener('load', fillTrack);

  const SPEED = 0.6; // px per frame
  let x = 0;

  function tickerRaf() {
    x -= SPEED;
    // When we've scrolled a full set width, reset by one set to loop seamlessly
    const setW = seed.offsetWidth;
    if (setW > 0 && x <= -setW) {
      x += setW;
    }
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(tickerRaf);
  }
  requestAnimationFrame(tickerRaf);
})();

/* ── Real lemon illustration assets ── */
const LEMON_IMGS = [
  "assets/images/lemon_0.png",
  "assets/images/lemon_1.png",
  "assets/images/lemon_2.png",
  "assets/images/lemon_3.png",
  "assets/images/lemon_4.png"
];

/* ── Lemon image builder ── */
function makeLemonSVG(size, shapeIdx, fillIdx) {
  const idx = (shapeIdx + fillIdx) % LEMON_IMGS.length;
  return '<img src="' + LEMON_IMGS[idx] + '" style="width:' + size + 'px;height:auto;display:block;" />';
}

/* ═══════════════════════════════════
   HELPERS
═══════════════════════════════════ */
const rnd=(a,b)=>a+Math.random()*(b-a);
const rndInt=(a,b)=>Math.floor(rnd(a,b+1));
const $ = id=>document.getElementById(id);
const nudgeMap={
  'up':{x:0,y:-5},'down':{x:0,y:5},
  'up-left':{x:-4,y:-4},'up-right':{x:4,y:-4},
  'down-left':{x:-4,y:4},'right':{x:5,y:0},
};

/* ═══════════════════════════════════
   S1 — cards + lemons
═══════════════════════════════════ */
const s1=$('s1');
const cards=Array.from(s1.querySelectorAll('.card'));
const s1lemons=Array.from(s1.querySelectorAll('.s1-lemon'));

cards.forEach((c,i)=>{
  const bx=parseFloat(c.dataset.bx),by=parseFloat(c.dataset.by),rot=parseFloat(c.dataset.rot);
  Object.assign(c.style,{left:'50%',top:'50%',marginLeft:'-112px',marginTop:'-92px',
    opacity:'0',transform:`translate(${bx}px,${by}px) rotate(${rot}deg) scale(0.25)`});
  c._bx=bx;c._by=by;c._rot=rot;c._mx=0;c._my=0;c._hovering=false;c._glow=0;
  c._nudge=nudgeMap[c.dataset.nudge]||{x:0,y:0};c._wp=parseFloat(c.dataset.wp)||0;
  setTimeout(()=>{
    c.style.transition='transform .8s cubic-bezier(.34,1.48,.64,1),opacity .45s ease';
    c.style.opacity='1';
    c.style.transform=`translate(${bx}px,${by}px) rotate(${rot}deg) scale(1)`;
    setTimeout(()=>{c.style.transition='none'},860);
  },80+i*130);
  c.addEventListener('mouseenter',()=>{c._hovering=true;c.style.zIndex=20});
  c.addEventListener('mouseleave',()=>{c._hovering=false;c.style.zIndex=10});
});

s1lemons.forEach(l=>{
  Object.assign(l.style,{left:'50%',top:'50%',marginLeft:'-34px',marginTop:'-34px'});
  l._bx=parseFloat(l.dataset.bx);l._by=parseFloat(l.dataset.by);l._phase=parseFloat(l.dataset.phase);
});

/* ═══════════════════════════════════
   S2 — living lemon ecosystem
═══════════════════════════════════ */
const s2=$('s2');
let s2active=false;

/* Pool of potential lemon "slots" spread across right ~55% of the screen.
   Each slot has a fixed position, size, shape, blur, rotation.
   Lemons fade in/out over time to create the living breathing effect. */

/* Generate a diverse set of slots — spread across FULL screen width.
   Left side (rx < 48) gets heavier blur to feel behind the text layer.
   Right side stays sharper. Text lives at left:8%, max-width 400px so
   lemons below rx~52 need to be blurry/not overlapping text zone. */
const SLOTS=[];

// Full-screen positions: left edge lemons are blurry background,
// Text block lives at left:8%, max-width:400px (~42% of screen).
// Lemons only go in rx >= 48 to avoid clashing with text.
// A few at rx 48-54 get soft blur so they feel behind the text edge.
const basePositions=[
  // soft edge — just past text, slightly blurred
  [49,20], [51,65], [53,88],
  // mid field
  [60,10], [64,50], [62,82],
  // right field
  [74,25], [78,62], [72,88],
  // far right — sharp foreground
  [86,15], [90,45], [84,78], [94,30], [92,72], [96,55],
];

basePositions.forEach(([rx,ry])=>{
  const sz=rndInt(58,128);
  const sh=rndInt(0,7);
  const fi=rndInt(0,5);
  const rot=rnd(-38,38);
  // blur: slots just past text edge get slight blur, rest are sharp-ish
  let blur=0;
  if(rx<52)       blur=rnd(3,6);
  else if(rx<58)  blur=rnd(0.5,2);
  else            blur=0;
  // magnetic: edge ones barely move, right ones react well
  const magStr = rx<55 ? rnd(3,7) : rnd(10,22);
  SLOTS.push({rx,ry,sz,sh,fi,rot,blur,phase:rnd(0,Math.PI*2),magStr});
});

/* Build DOM elements */
SLOTS.forEach(slot=>{
  const el=document.createElement('div');
  el.className='s2-lemon';
  el.style.left=slot.rx+'%';
  el.style.top=slot.ry+'%';
  if(slot.blur>0.3) el.style.filter=`blur(${slot.blur.toFixed(1)}px)`;
  el.innerHTML=makeLemonSVG(slot.sz,slot.sh,slot.fi);
  s2.appendChild(el);
  slot.el=el;
  slot.alive=false;
  slot.pmx=0;slot.pmy=0;
  slot.nextChange=0;
  slot.lifespan=rnd(5000,16000);  // how long it stays visible
  slot.deathspan=rnd(2500,8000);  // how long it stays hidden
});

/* ── Scheduler ──
   Key rule: a lemon only fades OUT once a replacement has already started
   fading IN — so visible count never drops below TARGET. We do this by
   pairing: when a slot wants to die, first wake a dormant one, THEN schedule
   the death slightly after the new one's fade-in begins (CSS transition 1.4s). */
const TARGET=7; // steady-state visible count
let visibleCount=0;

function wakeOne(excludeSlot, now){
  const dormant=SLOTS.filter(s=>!s.alive && s!==excludeSlot);
  if(!dormant.length) return false;
  // pick randomly from dormant
  const pick=dormant[Math.floor(Math.random()*dormant.length)];
  pick.el.classList.add('alive');
  pick.alive=true;
  visibleCount++;
  pick.nextChange=now+pick.lifespan+rnd(0,2000);
  return true;
}

function schedulerTick(now){
  if(!s2active) return;

  SLOTS.forEach(slot=>{
    if(now < slot.nextChange) return;
    if(slot.alive){
      // Before fading this one out, wake a replacement first
      wakeOne(slot, now);
      // Delay actual fade-out by 600ms so replacement starts appearing first
      setTimeout(()=>{
        slot.el.classList.remove('alive');
        slot.alive=false;
        visibleCount=Math.max(0,visibleCount-1);
        // schedule re-entry
        slot.nextChange=performance.now()+slot.deathspan;
      }, 600);
      // block this slot from re-triggering immediately
      slot.nextChange=now+slot.deathspan+600+rnd(0,1000);
    } else {
      // dormant slot — only wake if we're below target
      if(visibleCount<TARGET){
        slot.el.classList.add('alive');
        slot.alive=true;
        visibleCount++;
        slot.nextChange=now+slot.lifespan+rnd(0,2000);
      } else {
        slot.nextChange=now+rnd(1500,4000);
      }
    }
  });
}

/* Staggered initial reveal */
function s2Enter(){
  visibleCount=0;
  SLOTS.forEach(s=>{s.alive=false;s.el.classList.remove('alive');s.pmx=0;s.pmy=0;});

  // Wake TARGET lemons staggered over ~3s
  const pool=[...SLOTS].sort(()=>Math.random()-.5);
  let woken=0;
  pool.forEach((slot,i)=>{
    if(woken>=TARGET) return;
    woken++;
    const delay=i*240+rnd(0,180);
    setTimeout(()=>{
      slot.el.classList.add('alive');
      slot.alive=true;
      visibleCount++;
      slot.nextChange=performance.now()+slot.lifespan+rnd(0,3000);
    }, delay);
  });

  setTimeout(()=>{ if($('s2lbl')) $('s2lbl').classList.add('show'); },200);
  setTimeout(()=>$('s2txt').classList.add('show'),320);
}

function s2Exit(){
  SLOTS.forEach(slot=>{
    slot.el.classList.remove('alive');
    slot.el.style.transform='';
    slot.alive=false;
    slot.pmx=0;slot.pmy=0;
    slot.nextChange=0;
  });
  visibleCount=0;
  if($('s2lbl')) $('s2lbl').classList.remove('show');
  $('s2txt').classList.remove('show');
}

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !s2active){s2active=true;s2Enter();}
    if(!e.isIntersecting && s2active){s2active=false;s2Exit();}
  });
},{threshold:0.35});
io.observe(s2);

/* ═══════════════════════════════════
   MOUSE
═══════════════════════════════════ */
let s1mx=-9999,s1my=-9999,s2mx=-9999,s2my=-9999;
s1.addEventListener('mousemove',e=>{const r=s1.getBoundingClientRect();s1mx=e.clientX-r.left;s1my=e.clientY-r.top});
s1.addEventListener('mouseleave',()=>{s1mx=-9999;s1my=-9999});
s2.addEventListener('mousemove',e=>{const r=s2.getBoundingClientRect();s2mx=e.clientX-r.left;s2my=e.clientY-r.top});
s2.addEventListener('mouseleave',()=>{s2mx=-9999;s2my=-9999});

/* ═══════════════════════════════════
   RAF LOOP
═══════════════════════════════════ */
function animate(t){
  schedulerTick(t);

  /* S1 lemons bob */
  const W=s1.offsetWidth,H=s1.offsetHeight,cx=W/2,cy=H/2;
  s1lemons.forEach(l=>{
    const bob=Math.sin(t*.0014+l._phase)*9;
    const sway=Math.cos(t*.0009+l._phase)*3.5;
    l.style.transform=`translate(${l._bx+sway}px,${l._by+bob}px)`;
  });

  /* S1 cards: idle wobble + magnetic + hover */
  cards.forEach(c=>{
    const cardCX=cx+c._bx,cardCY=cy+c._by;
    const dx=s1mx-cardCX,dy=s1my-cardCY;
    const dist=Math.sqrt(dx*dx+dy*dy),magR=230;
    const idleX=Math.sin(t*.0008+c._wp)*4;
    const idleY=Math.cos(t*.0011+c._wp*1.3)*5;
    const idleRot=Math.sin(t*.0007+c._wp*.8)*.8;
    if(c._hovering){
      const rect=c.getBoundingClientRect(),sr=s1.getBoundingClientRect();
      const lx=s1mx-(rect.left-sr.left+rect.width/2);
      const ly=s1my-(rect.top-sr.top+rect.height/2);
      c._mx+=(lx*.22+c._nudge.x*6-c._mx)*.13;
      c._my+=(ly*.22+c._nudge.y*6-c._my)*.13;
      c._glow+=(1-c._glow)*.1;
    } else if(s1mx>-9000&&dist<magR&&dist>0){
      const force=(1-dist/magR)*22;
      c._mx+=((dx/dist)*force-c._mx)*.11;
      c._my+=((dy/dist)*force-c._my)*.11;
      c._glow+=(0-c._glow)*.1;
    } else {
      c._mx+=(idleX-c._mx)*.04;
      c._my+=(idleY-c._my)*.04;
      c._glow+=(0-c._glow)*.1;
    }
    const scale=c._hovering?1.06:1;
    const g=c._glow;
    const totalRot=c._rot+(c._hovering?0:idleRot);
    c.style.boxShadow=g>.02?`0 0 0 1.5px rgba(31,72,243,${(g*.8).toFixed(2)}),0 8px 32px rgba(31,72,243,${(g*.15).toFixed(2)})`:'';
    c.style.transform=`translate(${c._bx+c._mx}px,${c._by+c._my}px) rotate(${totalRot}deg) scale(${scale})`;
  });

  /* S2 lemons: float + magnetic (only alive ones) */
  if(s2active){
    const s2R=s2.getBoundingClientRect();
    SLOTS.forEach(slot=>{
      if(!slot.alive) return;
      const bob=Math.sin(t*.0013+slot.phase)*8;
      const sway=Math.cos(t*.0009+slot.phase*1.1)*4;
      let pmx=0,pmy=0;
      if(s2mx>-9000){
        const rect=slot.el.getBoundingClientRect();
        const lcx=rect.left-s2R.left+rect.width/2;
        const lcy=rect.top-s2R.top+rect.height/2;
        const dx=s2mx-lcx,dy=s2my-lcy;
        const dist=Math.sqrt(dx*dx+dy*dy),magR=160;
        if(dist<magR&&dist>0){
          const force=(1-dist/magR)*slot.magStr;
          pmx=(dx/dist)*force; pmy=(dy/dist)*force;
        }
      }
      slot.pmx+=(pmx-slot.pmx)*.09;
      slot.pmy+=(pmy-slot.pmy)*.09;
      slot.el.style.transform=`translate(${sway+slot.pmx}px,${bob+slot.pmy}px) rotate(${slot.rot}deg)`;
    });
  }

  hiwTick(t);
  s3Tick(t);
  s4Tick(t);
  footerTick(t);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);


/* ── S_HIW: how it works ── */
const hiwEl  = document.getElementById('s_hiw');
const hiwTxt = document.getElementById('hiwtxt');
const hiwH2  = hiwTxt.querySelector('h2');
const hiwH2Original = hiwH2.innerHTML;
let hiwOn = false;
let hiwMx = -9999, hiwMy = -9999;
let hiwDragging = null, hiwDragOffX = 0, hiwDragOffY = 0;
let peachesDropped = 0, lemonsDropped = 0;
let hiwFlashTimer = null;
let hintDismissed = false;
let hintLabelEl = null;
let hintShowTimer = null;

const LEMON_MSGS = [
  'one lemon<br>down.',
  'two<br>sorted.',
  'getting<br><span class="hiw-peach">warmer.</span>',
  'almost<br><span class="hiw-peach">there.</span>',
  'all lemons<br><span class="hiw-peach">gone.</span>',
];
const LEMON_COLORS    = ['#F5C518','#FFD700','#F0E464','#D4A820'];
const PEACH_COLORS    = ['#E8836A','#F5A278','#FFB085','#E87050','#F0C89A'];
const CONFETTI_COLORS = ['#E8836A','#F5C518','#1F48F3','#FFB085','#FFD700','#ffffff','#F5A278','#6B8FF5'];

/* Particle burst — CSS-transition driven for zero RAF overhead */
function spawnParticles(cx, cy, colors, count, spread) {
  for (let i = 0; i < count; i++) {
    const el   = document.createElement('div');
    const size = rnd(count > 25 ? 5 : 4, count > 25 ? 13 : 9);
    el.style.cssText = [
      'position:absolute',
      `left:${cx}px`, `top:${cy}px`,
      `width:${size}px`, `height:${size}px`,
      'border-radius:50%',
      `background:${colors[rndInt(0, colors.length-1)]}`,
      'pointer-events:none', 'z-index:200', 'opacity:1',
      'transform:translate(-50%,-50%)',
      `transition:transform ${rnd(0.5,0.95).toFixed(2)}s cubic-bezier(.22,1,.36,1),` +
        `opacity ${rnd(0.35,0.65).toFixed(2)}s ease ${rnd(0.05,0.22).toFixed(2)}s`,
      'will-change:transform,opacity'
    ].join(';');
    hiwEl.appendChild(el);
    void el.offsetWidth; // force reflow so transition fires
    const angle = (i / count) * Math.PI * 2 + rnd(-0.5, 0.5);
    const dist  = rnd(spread * 0.35, spread);
    el.style.transform = `translate(calc(-50% + ${(Math.cos(angle)*dist).toFixed(1)}px),calc(-50% + ${(Math.sin(angle)*dist).toFixed(1)}px))`;
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 1200);
  }
}

/* Flash heading text then restore; peach text always wins */
function hiwFlashText(html, duration) {
  if (peachesDropped > 0) return;
  if (hiwFlashTimer) clearTimeout(hiwFlashTimer);
  hiwH2.style.transition = 'opacity 0.18s ease';
  hiwH2.style.opacity = '0';
  setTimeout(() => { hiwH2.innerHTML = html; hiwH2.style.opacity = '1'; }, 180);
  hiwFlashTimer = setTimeout(() => {
    hiwH2.style.opacity = '0';
    setTimeout(() => {
      hiwH2.innerHTML = hiwH2Original;
      hiwH2.style.opacity = '1';
      hiwFlashTimer = null;
    }, 180);
  }, duration + 180);
}

/* Permanently change heading text */
function hiwSetText(html) {
  if (hiwFlashTimer) { clearTimeout(hiwFlashTimer); hiwFlashTimer = null; }
  hiwH2.style.transition = 'opacity 0.25s ease';
  hiwH2.style.opacity = '0';
  setTimeout(() => { hiwH2.innerHTML = html; hiwH2.style.opacity = '1'; }, 250);
}

/* Centre of the text block in section coords */
function hiwTextCentre() {
  const sR = hiwEl.getBoundingClientRect();
  const tR = hiwTxt.getBoundingClientRect();
  return { x: tR.left - sR.left + tR.width/2, y: tR.top - sR.top + tR.height/2 };
}

const HIWITEMS = [
  // lemons
  { type:'lemon', ai:0, rx:9,  ry:14, sz:68, rot:-15, phase:0.0 },
  { type:'lemon', ai:1, rx:82, ry:9,  sz:60, rot:12,  phase:1.2 },
  { type:'lemon', ai:2, rx:77, ry:64, sz:65, rot:22,  phase:2.1 },
  { type:'lemon', ai:3, rx:44, ry:82, sz:72, rot:-8,  phase:0.7, hint:true },
  { type:'lemon', ai:4, rx:21, ry:74, sz:66, rot:-12, phase:1.9 },
  // peaches
  { type:'peach', ai:5, rx:26, ry:15, sz:54, rot:0,   phase:0.5 },
  { type:'peach', ai:6, rx:70, ry:28, sz:52, rot:0,   phase:1.6 },
];

HIWITEMS.forEach(item => {
  const el = document.createElement('div');
  el.className = 'hiw-item';
  el.style.left = item.rx + '%';
  el.style.top  = item.ry + '%';
  el.style.transform = 'rotate(' + item.rot + 'deg)';
  const src = item.type === 'lemon'
    ? LEMON_IMGS[item.ai % LEMON_IMGS.length]
    : 'assets/images/asset_' + item.ai + '.png';
  el.innerHTML = '<img src="' + src + '" style="width:' + item.sz + 'px;height:auto;display:block;" />';
  item.el = el; item.pmx = 0; item.pmy = 0;
  item.dropped = false; item.homing = false; item.homeStart = 0;

  if (item.type === 'lemon' || item.type === 'peach') {
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'grab';
    el.addEventListener('mousedown', e => {
      if (hiwDragging || item.dropped || !hiwOn) return;
      const sR = hiwEl.getBoundingClientRect();
      const elR = el.getBoundingClientRect();
      hiwDragging = item;
      hiwDragOffX = (e.clientX - sR.left) - (elR.left - sR.left + elR.width  / 2);
      hiwDragOffY = (e.clientY - sR.top)  - (elR.top  - sR.top  + elR.height / 2);
      el.style.cursor = 'grabbing';
      el.style.zIndex = '50';
      el.style.transition = 'none';
      hiwTxt.classList.add('hiw-droppable');
      if (item.hint && hintLabelEl && !hintDismissed) {
        hintLabelEl.textContent = 'drop me in the middle';
        hintLabelEl.classList.add('grabbed');
      }
      e.preventDefault();
    });
  }
  hiwEl.appendChild(el);
  if (item.hint) {
    hintLabelEl = document.createElement('div');
    hintLabelEl.className = 'hiw-hint-label';
    hintLabelEl.textContent = 'drag me';
    el.appendChild(hintLabelEl);
  }
});

function hiwAbsorb(item) {
  const sR   = hiwEl.getBoundingClientRect();
  const txtR = hiwTxt.getBoundingClientRect();
  const tcX  = txtR.left - sR.left + txtR.width  / 2;
  const tcY  = txtR.top  - sR.top  + txtR.height / 2;
  const natL = (item.rx / 100) * sR.width;
  const natT = (item.ry / 100) * sR.height;

  item.dropped = true;
  item.el.classList.remove('hiw-peach-glow');
  item.el.style.pointerEvents = 'none';
  item.el.style.zIndex = '30';
  item.el.style.transition = 'transform 0.45s cubic-bezier(.22,1,.36,1), opacity 0.35s ease 0.1s';
  item.el.style.transform  = `translate(${tcX - natL - item.sz/2}px,${tcY - natT - item.sz/2}px) scale(0)`;
  item.el.style.opacity    = '0';

  hiwTxt.classList.add('hiw-bump');
  setTimeout(() => hiwTxt.classList.remove('hiw-bump'), 400);

  if (item.type === 'lemon') {
    lemonsDropped++;
    spawnParticles(tcX, tcY, LEMON_COLORS, 10, 85);
    hiwFlashText(LEMON_MSGS[Math.min(lemonsDropped - 1, LEMON_MSGS.length - 1)], 1400);
  }

  if (item.type === 'peach') {
    peachesDropped++;

    if (peachesDropped === 1) {
      spawnParticles(tcX, tcY, PEACH_COLORS, 24, 130);
      hiwSetText('one peach<br><span class="hiw-peach">found.</span>');
      // Activate the remaining peach: glow + drift toward centre
      const other = HIWITEMS.find(i => i.type === 'peach' && !i.dropped);
      if (other) {
        other.homing = true;
        other.homeStart = performance.now();
        other.el.classList.add('hiw-peach-glow');
      }
    }

    if (peachesDropped === 2) {
      // Big confetti shower
      spawnParticles(tcX, tcY, CONFETTI_COLORS, 60, 270);
      const sw = sR.width, sh = sR.height;
      [150, 300, 480].forEach(delay => {
        setTimeout(() => {
          spawnParticles(rnd(sw*0.12, sw*0.88), rnd(sh*0.12, sh*0.78), CONFETTI_COLORS, 22, 115);
        }, delay);
      });
      hiwSetText('<span class="hiw-peach">both<br>yours.</span>');
      setTimeout(() => document.getElementById('s3').scrollIntoView({ behavior:'smooth' }), 1300);
    }
  }
}

document.addEventListener('mousemove', e => {
  if (!hiwDragging) return;
  const sR = hiwEl.getBoundingClientRect();
  hiwMx = e.clientX - sR.left;
  hiwMy = e.clientY - sR.top;
});

document.addEventListener('mouseup', e => {
  if (!hiwDragging) return;
  const item = hiwDragging;
  hiwDragging = null;
  item.el.style.cursor = 'grab';
  item.el.style.zIndex = '';
  hiwTxt.classList.remove('hiw-droppable');
  if (item.hint && hintLabelEl && !hintDismissed) {
    hintDismissed = true;
    hintLabelEl.classList.remove('visible', 'grabbed');
  }

  const sR   = hiwEl.getBoundingClientRect();
  const txtR = hiwTxt.getBoundingClientRect();
  const mx   = e.clientX - sR.left;
  const my   = e.clientY - sR.top;
  const itemCX = mx - hiwDragOffX;
  const itemCY = my - hiwDragOffY;
  const inZone = itemCX >= txtR.left - sR.left && itemCX <= txtR.right  - sR.left
              && itemCY >= txtR.top  - sR.top  && itemCY <= txtR.bottom - sR.top;

  if (inZone) {
    hiwAbsorb(item);
  } else {
    // Seed pmx/pmy at the drag-release offset so the lerp springs back smoothly
    const natCX = (item.rx/100)*sR.width  + item.sz/2;
    const natCY = (item.ry/100)*sR.height + item.sz/2;
    item.pmx = itemCX - natCX;
    item.pmy = itemCY - natCY;
  }
});

hiwEl.addEventListener('mousemove', e => {
  const r = hiwEl.getBoundingClientRect();
  hiwMx = e.clientX - r.left; hiwMy = e.clientY - r.top;
});
hiwEl.addEventListener('mouseleave', () => {
  if (!hiwDragging) { hiwMx = -9999; hiwMy = -9999; }
});

function hiwResetItems() {
  HIWITEMS.forEach(item => {
    item.el.classList.remove('show', 'hiw-peach-glow');
    item.el.style.transform  = 'rotate(' + item.rot + 'deg)';
    item.el.style.opacity    = '';
    item.el.style.transition = '';
    item.el.style.zIndex     = '';
    if (item.type === 'lemon' || item.type === 'peach') item.el.style.pointerEvents = 'auto';
    item.dropped = false; item.homing = false; item.homeStart = 0;
    item.pmx = 0; item.pmy = 0;
  });
  if (hintLabelEl) {
    hintLabelEl.textContent = 'drag me';
    hintLabelEl.classList.remove('visible', 'grabbed');
  }
  hintDismissed = false;
}

function hiwEnter() {
  hiwOn = true;
  peachesDropped = 0; lemonsDropped = 0;
  hiwDragging = null;
  if (hiwFlashTimer) { clearTimeout(hiwFlashTimer); hiwFlashTimer = null; }
  hiwH2.innerHTML = hiwH2Original;
  hiwH2.style.opacity = '1';
  hiwH2.style.transition = '';
  hiwTxt.classList.remove('show', 'hiw-droppable', 'hiw-bump');
  hiwResetItems();
  const shuffled = [...HIWITEMS].sort(() => Math.random() - .5);
  shuffled.forEach((item, i) => {
    setTimeout(() => { if (hiwOn) item.el.classList.add('show'); }, i * 110 + 80);
  });
  setTimeout(() => { if (hiwOn) hiwTxt.classList.add('show'); }, 380);
  hintShowTimer = setTimeout(() => {
    if (hiwOn && !hintDismissed && hintLabelEl) hintLabelEl.classList.add('visible');
  }, 1800);
}

function hiwExit() {
  hiwOn = false;
  peachesDropped = 0; lemonsDropped = 0;
  hiwDragging = null;
  clearTimeout(hintShowTimer);
  if (hintLabelEl) hintLabelEl.classList.remove('visible', 'grabbed');
  if (hiwFlashTimer) { clearTimeout(hiwFlashTimer); hiwFlashTimer = null; }
  hiwH2.innerHTML = hiwH2Original;
  hiwH2.style.opacity = '1';
  hiwH2.style.transition = '';
  hiwTxt.classList.remove('show', 'hiw-droppable', 'hiw-bump');
  hiwResetItems();
}

const hiwObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !hiwOn) hiwEnter();
    if (!e.isIntersecting && hiwOn) hiwExit();
  });
}, { threshold: 0.3 });
hiwObs.observe(hiwEl);

function hiwTick(t) {
  if (!hiwOn) return;
  const hR = hiwEl.getBoundingClientRect();
  HIWITEMS.forEach(item => {
    if (item.dropped) return;

    if (item === hiwDragging) {
      const natL = (item.rx/100) * hR.width;
      const natT = (item.ry/100) * hR.height;
      const tx = (hiwMx - hiwDragOffX) - natL - item.sz/2;
      const ty = (hiwMy - hiwDragOffY) - natT - item.sz/2;
      item.el.style.transform = `translate(${tx}px,${ty}px) rotate(${item.rot}deg) scale(1.1)`;
      return;
    }
    if (!item.el.classList.contains('show')) return;

    const bob  = Math.sin(t * .0013 + item.phase) * 8;
    const sway = Math.cos(t * .0009 + item.phase * 1.1) * 3.5;
    let pmx = 0, pmy = 0;

    if (hiwMx > -9000) {
      const rect = item.el.getBoundingClientRect();
      const lcx  = rect.left - hR.left + rect.width  / 2;
      const lcy  = rect.top  - hR.top  + rect.height / 2;
      const dx = hiwMx - lcx, dy = hiwMy - lcy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 150 && dist > 0) {
        const force = (1 - dist/150) * 18;
        pmx = (dx/dist)*force; pmy = (dy/dist)*force;
      }
    }

    // Hint lemon: beckon slowly toward centre and back
    if (item.hint && !hintDismissed && !item.homing) {
      const natCX = (item.rx/100)*hR.width  + item.sz/2;
      const natCY = (item.ry/100)*hR.height + item.sz/2;
      const ddx = hR.width/2 - natCX, ddy = hR.height/2 - natCY;
      const dd = Math.sqrt(ddx*ddx + ddy*ddy) || 1;
      const nudge = Math.sin(t * 0.00065 + item.phase) * 20;
      pmx += (ddx/dd) * nudge;
      pmy += (ddy/dd) * nudge;
    }

    // Gentle drift toward centre once homing is active (capped at 72px over 4s)
    if (item.homing) {
      const elapsed = Math.min(t - item.homeStart, 4000);
      const drift   = elapsed * 0.018;
      const homeCX  = hR.width  / 2, homeCY = hR.height / 2;
      const natCX   = (item.rx/100)*hR.width  + item.sz/2;
      const natCY   = (item.ry/100)*hR.height + item.sz/2;
      const ddx = homeCX - natCX, ddy = homeCY - natCY;
      const dd  = Math.sqrt(ddx*ddx + ddy*ddy) || 1;
      pmx += (ddx/dd) * drift;
      pmy += (ddy/dd) * drift;
    }

    item.pmx += (pmx - item.pmx) * .09;
    item.pmy += (pmy - item.pmy) * .09;
    item.el.style.transform = `translate(${sway+item.pmx}px,${bob+item.pmy}px) rotate(${item.rot}deg)`;
  });
}

/* ── S3: peach + text ── */
const s3el  = document.getElementById('s4');
const s3Txt = document.getElementById('s3-text');
const s3Pch = document.getElementById('s3-peach');
const s3Glow = document.getElementById('s3-glow');
let s3on = false, s3peachSettled = false;
let s3peachBaseY = 0; // set after rise animation

function s3Enter() {
  s3on = true;
  s3peachSettled = false;

  // Reset
  s3Txt.classList.remove('show');
  s3Pch.classList.remove('show');
  s3Glow.classList.remove('show');
  s3Pch.style.transition = 'none';
  s3Glow.style.transition = 'none';
  s3Pch.style.transform = 'translateX(-50%) translateY(160px)';
  s3Pch.style.opacity = '0';

  // 1. Peach rises up with glow
  setTimeout(() => {
    if (!s3on) return;
    s3Pch.style.transition = 'transform 1.3s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease';
    s3Glow.style.transition = 'opacity 1.8s ease 0.2s';
    s3Pch.style.transform = 'translateX(-50%) translateY(-20px)';
    s3Pch.style.opacity = '1';
    s3Pch.classList.add('show');
    s3Glow.classList.add('show');
  }, 300);

  // 2. Text fades in after peach has risen
  setTimeout(() => {
    if (!s3on) return;
    s3Txt.classList.add('show');
  }, 1400);

  // 3. Switch to floating RAF control
  setTimeout(() => {
    if (!s3on) return;
    s3Pch.style.transition = 'none';
    s3peachSettled = true;
  }, 1700);
}

function s3Exit() {
  s3on = false;
  s3peachSettled = false;
  s3Txt.classList.remove('show');
  s3Pch.classList.remove('show');
  s3Glow.classList.remove('show');
}

const s3obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !s3on) s3Enter();
    if (!e.isIntersecting && s3on) s3Exit();
  });
}, { threshold: 0.3 });
s3obs.observe(s3el);

function s3Tick(t) {
  if (!s3on || !s3peachSettled) return;
  const bob = Math.sin(t * 0.0014) * 9;
  s3Pch.style.transform = `translateX(-50%) translateY(${-20 + bob}px)`;
  // glow pulses slightly with the bob
  const glowScale = 1 + Math.sin(t * 0.0014) * 0.04;
  s3Glow.style.transform = `translate(-50%, -50%) scale(${glowScale})`;
}

/* ── S4: final fold ── */
const s4el   = document.getElementById('s3');
const s4Lbl  = document.getElementById('s4lbl');
const s4Txt  = document.getElementById('s4txt');
const s4Wrap = document.getElementById('s4-peach-wrap');
const s4Cta  = document.getElementById('s4cta');
let s4on = false, s4settled = false;
let s4ctaMx = 0, s4ctaMy = 0;

function s4Enter() {
  s4on = true; s4settled = false;
  if (s4Lbl) s4Lbl.classList.remove('show');
  s4Txt.classList.remove('show');
  s4Wrap.classList.remove('show');
  s4Wrap.style.transition = 'none';
  s4Wrap.style.transform = 'translateY(calc(-50% + 60px))';
  s4Wrap.style.opacity = '0';

  setTimeout(() => {
    if (!s4on) return;
    if (s4Lbl) s4Lbl.classList.add('show');
  }, 150);

  setTimeout(() => {
    if (!s4on) return;
    s4Wrap.style.transition = 'transform 1.1s cubic-bezier(.22,1,.36,1), opacity .7s ease';
    s4Wrap.style.transform = 'translateY(-50%)';
    s4Wrap.style.opacity = '1';
    s4Wrap.classList.add('show');
  }, 200);

  setTimeout(() => {
    if (!s4on) return;
    s4Txt.classList.add('show');
  }, 500);

  setTimeout(() => {
    if (!s4on) return;
    s4Wrap.style.transition = 'none';
    s4settled = true;
  }, 1400);
}

function s4Exit() {
  s4on = false; s4settled = false;
  if (s4Lbl) s4Lbl.classList.remove('show');
  s4Txt.classList.remove('show');
  s4Wrap.classList.remove('show');
}

const s4obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !s4on) s4Enter();
    if (!e.isIntersecting && s4on) s4Exit();
  });
}, { threshold: 0.3 });
s4obs.observe(s4el);

/* CTA magnetic effect */
s4el.addEventListener('mousemove', e => {
  if (!s4Cta) return;
  const r = s4Cta.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const magR = 120;
  if (dist < magR) {
    const force = (1 - dist/magR) * 18;
    s4ctaMx += ((dx/dist)*force - s4ctaMx) * 0.18;
    s4ctaMy += ((dy/dist)*force - s4ctaMy) * 0.18;
  } else {
    s4ctaMx += (0 - s4ctaMx) * 0.12;
    s4ctaMy += (0 - s4ctaMy) * 0.12;
  }
  s4Cta.style.transform = `translate(${s4ctaMx}px, ${s4ctaMy}px)`;
});
s4el.addEventListener('mouseleave', () => {
  s4ctaMx = 0; s4ctaMy = 0;
  if (s4Cta) s4Cta.style.transform = 'translate(0,0)';
});

function s4Tick(t) {
  if (!s4on || !s4settled) return;
  const bob = Math.sin(t * 0.0013) * 10;
  const sway = Math.cos(t * 0.0009) * 4;
  s4Wrap.style.transform = `translateY(calc(-50% + ${bob}px)) translateX(${sway}px)`;
}

/* ═══════════════════════════════════
   FOOTER FLOATING FRUITS
═══════════════════════════════════ */
const FOOTER_FRUITS = [
  { type:'lemon', ai:0, rx:5,  ry:12, sz:28, rot:-18, phase:0.0 },
  { type:'lemon', ai:2, rx:88, ry:8,  sz:24, rot:14,  phase:1.4 },
  { type:'lemon', ai:1, rx:92, ry:72, sz:30, rot:-8,  phase:2.2 },
  { type:'lemon', ai:3, rx:7,  ry:80, sz:26, rot:20,  phase:0.8 },
  { type:'lemon', ai:4, rx:50, ry:6,  sz:22, rot:-12, phase:1.9 },
  { type:'lemon', ai:0, rx:14, ry:48, sz:20, rot:10,  phase:3.1 },
  { type:'peach', ai:5, rx:82, ry:38, sz:34, rot:0,   phase:0.6 },
  { type:'peach', ai:6, rx:22, ry:28, sz:32, rot:0,   phase:2.5 },
  { type:'peach', ai:5, rx:72, ry:88, sz:36, rot:0,   phase:1.1 },
  { type:'lemon', ai:2, rx:60, ry:92, sz:24, rot:-6,  phase:3.7 },
];

const footerEl = document.getElementById('site-footer');
let footerOn = false;
const footerItems = [];

(function buildFooterFruits() {
  FOOTER_FRUITS.forEach((cfg, i) => {
    const el = document.createElement('div');
    el.className = 'footer-fruit';
    el.style.cssText = `left:${cfg.rx}%;top:${cfg.ry}%;`;

    let inner;
    if (cfg.type === 'lemon') {
      const idx = cfg.ai % LEMON_IMGS.length;
      inner = `<img src="${LEMON_IMGS[idx]}" style="width:${cfg.sz}px;height:auto;display:block;transform:rotate(${cfg.rot}deg);" />`;
    } else {
      const src = cfg.ai === 6 ? 'assets/images/asset_6.png' : 'assets/images/asset_5.png';
      inner = `<img src="${src}" style="width:${cfg.sz}px;height:auto;display:block;" />`;
    }
    el.innerHTML = inner;
    footerEl.appendChild(el);
    footerItems.push({ el, cfg, natX: 0, natY: 0 });
  });
})();

function footerEnter() {
  footerOn = true;
  footerItems.forEach(item => item.el.classList.add('show'));
}
function footerExit() {
  footerOn = false;
  footerItems.forEach(item => item.el.classList.remove('show'));
}

const footerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !footerOn) footerEnter();
    if (!e.isIntersecting && footerOn) footerExit();
  });
}, { threshold: 0.15 });
footerObs.observe(footerEl);

function footerTick(t) {
  if (!footerOn) return;
  footerItems.forEach((item, i) => {
    const bob  = Math.sin(t * 0.00085 + item.cfg.phase) * 7;
    const sway = Math.cos(t * 0.00062 + item.cfg.phase * 0.7) * 5;
    item.el.style.transform = `translate(${sway}px, ${bob}px)`;
  });
}

})();
