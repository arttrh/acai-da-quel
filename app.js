const toggle=document.querySelector('.menu-toggle');
const header=document.querySelector('.site-header');
const nav=document.querySelector('#main-nav');
const navLinks=[...nav.querySelectorAll('a')];
function menuState(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');toggle.querySelector('span').textContent=open?'Fechar':'Menu'}
function setMenu(open){
  const animated=window.gsap&&matchMedia('(max-width:760px)').matches;
  menuState(open);
  if(!animated){header.classList.toggle('menu-open',open);return}
  gsap.killTweensOf([nav,...navLinks]);
  if(open){
    header.classList.add('menu-open');
    gsap.timeline()
      .fromTo(nav,{autoAlpha:0,y:-18,clipPath:'inset(0 0 100% 0 round 14px)'},{autoAlpha:1,y:0,clipPath:'inset(0 0 0% 0 round 14px)',duration:.62,ease:'power4.out'})
      .fromTo(navLinks,{opacity:0,x:-24},{opacity:1,x:0,duration:.55,stagger:.09,ease:'power3.out'},'-=.38');
  }else if(header.classList.contains('menu-open')){
    gsap.timeline({onComplete:()=>{header.classList.remove('menu-open');gsap.set([nav,...navLinks],{clearProps:'all'})}})
      .to(navLinks,{opacity:0,x:18,duration:.25,stagger:.045,ease:'power2.in'})
      .to(nav,{autoAlpha:0,y:-14,clipPath:'inset(0 0 100% 0 round 14px)',duration:.42,ease:'power3.inOut'},'-=.12');
  }
}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
document.querySelectorAll('#main-nav a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false)});

document.querySelectorAll('.rolling').forEach(link=>{
  const text=link.textContent.trim();link.setAttribute('aria-label',text);
  const win=document.createElement('span');win.className='rolling-window';win.setAttribute('aria-hidden','true');
  const first=document.createElement('span');first.textContent=text;
  const copy=document.createElement('span');copy.className='roll-copy';copy.textContent=text;
  win.append(first,copy);link.replaceChildren(win);
});

function motion(){
  if(!window.gsap)return;
  const hasScroll=Boolean(window.ScrollTrigger),hasSplit=Boolean(window.SplitText);
  const compact=matchMedia('(max-width:760px)').matches;
  if(hasScroll)gsap.registerPlugin(ScrollTrigger);
  if(hasSplit)gsap.registerPlugin(SplitText);

  document.querySelectorAll('.rolling-window').forEach(win=>{
    const link=win.parentElement,first=win.firstElementChild,copy=win.lastElementChild;
    let outgoing=[first],incoming=[copy];
    if(hasSplit){
      outgoing=SplitText.create(first,{type:'chars',aria:'none'}).chars;
      incoming=SplitText.create(copy,{type:'chars',aria:'none'}).chars;
    }
    const tl=gsap.timeline({paused:true,defaults:{duration:.62,ease:'power4.inOut'}})
      .to(outgoing,{yPercent:-115,stagger:hasSplit?.018:0},0)
      .to(incoming,{yPercent:-110,stagger:hasSplit?.018:0},0);
    link.addEventListener('pointerenter',()=>tl.play());
    link.addEventListener('pointerleave',()=>tl.reverse());
    link.addEventListener('focus',()=>tl.play());
    link.addEventListener('blur',()=>tl.reverse());
  });

  gsap.from('.nav-shell',{y:-32,opacity:0,duration:1.05,ease:'power4.out'});
  gsap.from('.hero-copy>.kicker,.hero-copy>.intro,.hero-actions,.opening',{y:30,opacity:0,duration:1,stagger:.13,delay:.38,ease:'power4.out'});
  gsap.from('.hero-gallery .shot',{opacity:0,scale:.82,duration:1.55,stagger:.24,delay:.25,ease:'expo.out',clearProps:'scale'});
  gsap.from('.berry-stamp,.scribble',{scale:.65,opacity:0,duration:1.1,stagger:.15,delay:.75,ease:'back.out(1.7)'});
  gsap.to('.berry-stamp',{rotation:17,y:-8,duration:3.8,yoyo:true,repeat:-1,ease:'sine.inOut'});

  document.querySelectorAll('.split-title').forEach((title,index)=>{
    const trigger=index===0?null:{trigger:title,start:'top 86%',toggleActions:'play none none reverse'};
    if(hasSplit){
      SplitText.create(title,{type:'words,chars',autoSplit:true,aria:'auto',wordsClass:'split-word',onSplit(self){
        return gsap.from(self.chars,{yPercent:120,opacity:0,rotation:2,duration:1.05,stagger:.014,ease:'power4.out',delay:index===0?.18:0,scrollTrigger:trigger});
      }});
    }else{
      gsap.from(title,{y:70,opacity:0,duration:1.15,ease:'power4.out',delay:index===0?.18:0,scrollTrigger:trigger});
    }
  });

  if(hasScroll){
    ScrollTrigger.config({limitCallbacks:true});
    gsap.to('.scroll-progress',{scaleX:1,ease:'none',scrollTrigger:{start:'top top',end:'max',scrub:.35}});
    ScrollTrigger.create({start:'55px top',onToggle:self=>header.classList.toggle('is-scrolled',self.isActive)});

    gsap.to('.shot-main',{y:compact?-28:-72,rotation:compact?-6:-4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.6}});
    gsap.to('.shot-side',{y:compact?24:58,rotation:compact?7:4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.6}});
    gsap.to('.hero-word',{x:-110,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.8}});

    gsap.from('.section-title>.kicker,.section-title>p:last-child',{y:38,opacity:0,duration:1,stagger:.12,ease:'power4.out',scrollTrigger:{trigger:'.section-title',start:'top 85%',toggleActions:'play none none reverse'}});
    gsap.from('.flavor-card',{autoAlpha:0,scale:.88,rotationX:9,transformOrigin:'50% 100%',duration:1.45,stagger:.2,ease:'expo.out',scrollTrigger:{trigger:'.flavor-grid',start:'top 84%',toggleActions:'play none none reverse'}});
    document.querySelectorAll('.flavor-card').forEach((card,index)=>{
      const image=card.querySelector('img'),copy=card.querySelector('div:last-child');
      if(image){
        gsap.from(image,{clipPath:'inset(100% 0% 0% 0%)',duration:1.35,ease:'power4.inOut',scrollTrigger:{trigger:card,start:'top 86%',toggleActions:'play none none reverse'}});
        gsap.fromTo(image,{yPercent:compact?-4:-9,scale:compact?1.09:1.15},{yPercent:compact?4:9,scale:1.07,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1.8}});
      }
      if(copy)gsap.from(copy.children,{y:32,opacity:0,duration:.9,stagger:.1,ease:'power4.out',scrollTrigger:{trigger:card,start:'top 72%',toggleActions:'play none none reverse'}});
      if(!compact)gsap.to(card,{y:index%2?-24:-38,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:2.2}});
    });

    gsap.from('.story-photo',{clipPath:'inset(20% 14% 20% 14% round 220px 220px 24px 24px)',scale:.9,duration:1.45,ease:'power4.out',scrollTrigger:{trigger:'.story',start:'top 76%',toggleActions:'play none none reverse'}});
    gsap.fromTo('.story-photo img',{yPercent:-7,scale:1.08},{yPercent:5,scale:1.03,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:1.7}});
    gsap.from('.story-copy>.kicker,.story-copy>p,.story-copy .btn',{y:42,opacity:0,duration:1,stagger:.14,ease:'power4.out',scrollTrigger:{trigger:'.story-copy',start:'top 78%',toggleActions:'play none none reverse'}});
    gsap.from('.visit-head>.kicker',{y:36,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:'.visit-head',start:'top 86%',toggleActions:'play none none reverse'}});
    gsap.from('.visit-grid article',{y:80,opacity:0,duration:1.15,stagger:.16,ease:'power4.out',scrollTrigger:{trigger:'.visit-grid',start:'top 86%',toggleActions:'play none none reverse'}});
    gsap.from('.final-cta>.kicker,.final-cta>.btn',{y:35,opacity:0,duration:1,stagger:.16,ease:'power4.out',scrollTrigger:{trigger:'.final-cta',start:'top 78%',toggleActions:'play none none reverse'}});
    gsap.to('.giant-mark',{x:-125,rotation:-4,ease:'none',scrollTrigger:{trigger:'.final-cta',start:'top bottom',end:'bottom top',scrub:1.8}});
  }

  document.querySelectorAll('.btn,.pill-cta').forEach(button=>{
    button.addEventListener('pointermove',event=>{
      const rect=button.getBoundingClientRect();
      gsap.to(button,{x:(event.clientX-rect.left-rect.width/2)*.14,y:(event.clientY-rect.top-rect.height/2)*.22,duration:.55,ease:'power3.out',overwrite:'auto'});
    });
    button.addEventListener('pointerleave',()=>gsap.to(button,{x:0,y:0,duration:.9,ease:'elastic.out(1,.3)',overwrite:'auto'}));
  });

  const chaseZone=document.querySelector('.visit');
  const cursorAcai=document.querySelector('.cursor-acai');
  if(chaseZone&&cursorAcai&&matchMedia('(pointer:fine)').matches){
    const followX=gsap.quickTo(cursorAcai,'x',{duration:.72,ease:'power3.out'});
    const followY=gsap.quickTo(cursorAcai,'y',{duration:.72,ease:'power3.out'});
    const rotateTo=gsap.quickTo(cursorAcai,'rotation',{duration:.45,ease:'power2.out'});
    let previousX=0;
    chaseZone.addEventListener('pointerenter',event=>{
      previousX=event.clientX;
      gsap.set(cursorAcai,{x:event.clientX+22,y:event.clientY+18,rotation:-7});
      gsap.to(cursorAcai,{autoAlpha:1,scale:1,duration:.5,ease:'back.out(1.8)'});
    });
    chaseZone.addEventListener('pointermove',event=>{
      const targetX=Math.min(event.clientX+22,innerWidth-132);
      const targetY=Math.min(event.clientY+18,innerHeight-148);
      followX(Math.max(8,targetX));followY(Math.max(8,targetY));
      rotateTo(gsap.utils.clamp(-13,13,(event.clientX-previousX)*.16));
      previousX=event.clientX;
    });
    chaseZone.addEventListener('pointerleave',()=>gsap.to(cursorAcai,{autoAlpha:0,scale:.72,rotation:12,duration:.38,ease:'power3.in'}));
    chaseZone.querySelectorAll('a').forEach(link=>{
      link.addEventListener('pointerenter',()=>gsap.to(cursorAcai,{scale:1.18,duration:.35,ease:'back.out(2)'}));
      link.addEventListener('pointerleave',()=>gsap.to(cursorAcai,{scale:1,duration:.45,ease:'elastic.out(1,.4)'}));
    });
  }

  if(hasScroll){
    Promise.all([...document.images].map(img=>img.decode?.().catch(()=>null))).then(()=>ScrollTrigger.refresh());
  }
}
if(document.fonts){document.fonts.ready.then(motion).catch(motion)}else{motion()}
