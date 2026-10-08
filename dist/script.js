document.documentElement.classList.add('js');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-menu'),servicesButton=document.querySelector('.services-toggle'),servicesMenu=document.querySelector('#services-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Öppna meny')}
function closeServices(){servicesMenu.hidden=true;servicesButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Stäng meny':'Öppna meny');menu.hidden=!open;closeServices()});
servicesButton.addEventListener('click',()=>{const open=servicesButton.getAttribute('aria-expanded')!=='true';servicesButton.setAttribute('aria-expanded',String(open));servicesMenu.hidden=!open});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-disclosure'))closeServices()});document.addEventListener('focusin',event=>{if(!event.target.closest('.nav-disclosure'))closeServices()});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!menu.hidden){closeMenu();menuButton.focus()}if(!servicesMenu.hidden){closeServices();servicesButton.focus()}}});
// Progressive section reveals: all content stays readable without JavaScript.
const fan=document.querySelector('.fan-stage'),photos=[...document.querySelectorAll('.people-frame,.about-wide')];
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible','in-view');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal,.people-frame,.motion-sequence').forEach(el=>observer.observe(el))}else document.querySelectorAll('.reveal,.people-frame,.motion-sequence').forEach(el=>el.classList.add('visible','in-view'));
let ticking=false;
function updateMotion(){const scroll=window.scrollY;document.body.classList.toggle('scrolled',scroll>30);const total=document.documentElement.scrollHeight-window.innerHeight;document.documentElement.style.setProperty('--read-progress',total>0?String(Math.max(0,Math.min(1,scroll/total))):'0');if(!reduced.matches&&finePointer.matches){if(fan){fan.style.setProperty('--spread',Math.min(scroll/550,1).toFixed(3));fan.style.setProperty('--turn',`${Math.min(scroll/190,3)}deg`)}photos.forEach(photo=>{const rect=photo.getBoundingClientRect();if(rect.bottom<0||rect.top>window.innerHeight)return;photo.style.setProperty('--photo-shift',`${Math.max(-18,Math.min(18,(window.innerHeight/2-rect.top-rect.height/2)*.045))}px`)})}ticking=false}
function queueMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}window.addEventListener('scroll',queueMotion,{passive:true});window.addEventListener('resize',()=>{queueMotion();if(innerWidth>900)closeMenu()});updateMotion();
const poster=document.querySelector('.method-poster'),words=[...document.querySelectorAll('.method-words>span')];function setStep(index){words.forEach((word,i)=>word.classList.toggle('is-current',i===index));if(poster)poster.dataset.step=String(index)}setStep(0);
document.querySelectorAll('.method-list').forEach(list=>{const steps=[...list.querySelectorAll('details')];steps.forEach((step,index)=>step.addEventListener('toggle',()=>{if(step.open){steps.forEach(other=>{if(other!==step)other.open=false});if(poster)setStep(index)}}))});
document.querySelectorAll('.fan-card').forEach(card=>{let frame=0;card.addEventListener('pointermove',event=>{if(reduced.matches||!finePointer.matches)return;cancelAnimationFrame(frame);const x=event.clientX,y=event.clientY;frame=requestAnimationFrame(()=>{const box=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-((y-box.top)/box.height-.5)*7}deg`);card.style.setProperty('--tilt-y',`${((x-box.left)/box.width-.5)*9}deg`)})});card.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);card.style.removeProperty('--tilt-x');card.style.removeProperty('--tilt-y')})});
reduced.addEventListener('change',()=>{if(reduced.matches){photos.forEach(photo=>{photo.style.transform='none';photo.style.removeProperty('--photo-shift')});if(fan){fan.style.removeProperty('--spread');fan.style.removeProperty('--turn')}}else updateMotion()});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));document.querySelector('#year').textContent=new Date().getFullYear();

// Mark the current route without treating menu disclosure as navigation.
const currentPath=location.pathname.replace(/\/?$/,'/');document.querySelectorAll('header nav a,#mobile-menu a').forEach(link=>{if(new URL(link.href,location.href).pathname===currentPath)link.setAttribute('aria-current','page')});if(currentPath.startsWith('/tjanster/'))servicesButton.classList.add('is-current');window.addEventListener('pageshow',()=>{closeMenu();closeServices();queueMotion()});

// On touch screens, five full-size covers remain reachable by swipe or buttons.
const coverRail=document.querySelector('.fan'),coverControls=document.querySelector('.fan-controls');
if(coverRail&&coverControls){const covers=[...coverRail.querySelectorAll('.fan-card')],previous=coverControls.querySelector('.fan-prev'),next=coverControls.querySelector('.fan-next'),position=coverControls.querySelector('.fan-position');let active=0,pending=false;function updateCover(){const middle=coverRail.getBoundingClientRect().left+coverRail.clientWidth/2;let distance=Infinity;covers.forEach((card,index)=>{const rect=card.getBoundingClientRect(),delta=Math.abs(rect.left+rect.width/2-middle);if(delta<distance){distance=delta;active=index}});position.textContent=`${active+1} / ${covers.length}`;previous.disabled=active===0;next.disabled=active===covers.length-1;pending=false}function moveCover(offset){const target=covers[Math.max(0,Math.min(covers.length-1,active+offset))];coverRail.scrollTo({left:target.offsetLeft-(coverRail.clientWidth-target.offsetWidth)/2,behavior:reduced.matches?'instant':'smooth'})}previous.addEventListener('click',()=>moveCover(-1));next.addEventListener('click',()=>moveCover(1));coverRail.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateCover)}},{passive:true});window.addEventListener('resize',updateCover);updateCover()}

// Enter large visual groups once, without hiding content while scripts load.
if('IntersectionObserver' in window){
 const entrance=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  if(!reduced.matches&&entry.boundingClientRect.top>80){entry.target.classList.add('arriving');entry.target.addEventListener('animationend',()=>entry.target.classList.remove('arriving'),{once:true})}
  entrance.unobserve(entry.target);
 }),{threshold:.12});
 document.querySelectorAll('.service-panel,.partner-logos,.values>article,.rhythm-grid>article,.outcomes>article,.detail-step,.related-card,.contact-option,.page-cta,.belief-copy,.about-wide,.service-statement,.footer-invite').forEach(el=>{el.classList.add('motion-reveal');entrance.observe(el)})
}
// Animate native disclosure height, retaining native keyboard and ARIA semantics.
document.querySelectorAll('.method-list details').forEach(detail=>{
 const summary=detail.querySelector('summary');let running=null;
 summary.addEventListener('click',event=>{
  if(reduced.matches||typeof detail.animate!=='function')return;
  event.preventDefault();
  const start=detail.getBoundingClientRect().height;
  const opening=running?detail.dataset.expanding!=='true':!detail.open;
  if(running){running.cancel();running=null}
  detail.dataset.expanding=String(opening);
  detail.style.height='';detail.style.overflow='hidden';
  if(opening)detail.open=true;
  const end=opening?detail.getBoundingClientRect().height:summary.getBoundingClientRect().height;
  const animation=detail.animate([{height:`${start}px`},{height:`${end}px`}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});
  running=animation;
  animation.onfinish=()=>{if(running!==animation)return;detail.open=opening;detail.style.overflow='';delete detail.dataset.expanding;running=null};
  animation.oncancel=()=>{detail.style.overflow=''};
 });
 detail.addEventListener('toggle',()=>{
  if(!detail.open&&running){const stale=running;running=null;stale.cancel();detail.style.height='';detail.style.overflow='';delete detail.dataset.expanding}
 });
 reduced.addEventListener('change',()=>{if(reduced.matches&&running){running.finish()}});
});

// Dismiss floating navigation without blocking the clicked page control.
document.addEventListener('pointerdown',event=>{
 if(!menu.hidden&&!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
});
document.addEventListener('focusin',event=>{
 if(!menu.hidden&&!menu.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
});
// Avoid preserving a desktop menu when changing to the mobile layout.
matchMedia('(max-width:900px)').addEventListener('change',()=>{closeMenu();closeServices()});
