/* Preserved EV card animation and enlargement from the supplied draft. */

/* Compute viewport-center origins for the three EV cards and replay on entry. */
(function(){
 const evPage=document.getElementById('ev-analysis');
 if(!evPage)return;
 const cards=Array.from(evPage.querySelectorAll('.ev-stage'));
 function updateEVAnimation(){
   evPage.classList.remove('ev-animation-ready');
   if(!evPage.classList.contains('active'))return;
   if(matchMedia('(max-width:850px), (prefers-reduced-motion:reduce)').matches)return;
   cards.forEach(card=>{
     const r=card.getBoundingClientRect();
     const nav=document.querySelector('.top');
     const navBottom=nav ? nav.getBoundingClientRect().bottom : 0;
     const usableTop=Math.max(0,navBottom)+20;
     const usableHeight=Math.max(240,innerHeight-usableTop-20);
     const scale=Math.min(1.58,(innerWidth-80)/r.width,usableHeight/r.height);
     const centerY=usableTop+usableHeight/2;
     card.style.setProperty('--ev-safe-scale',String(scale));
     card.style.setProperty('--ev-shift-x',(innerWidth/2-(r.left+r.width/2))+'px');
     card.style.setProperty('--ev-shift-y',(centerY-(r.top+r.height/2))+'px');
   });
   void evPage.offsetWidth;
   evPage.classList.add('ev-animation-ready');
 }
 window.addEventListener('hashchange',()=>requestAnimationFrame(updateEVAnimation));
 window.addEventListener('resize',()=>{if(evPage.classList.contains('active'))requestAnimationFrame(updateEVAnimation)});
 requestAnimationFrame(updateEVAnimation);
})();


/* Enlarged view matches the original centered 1.58x spotlight presentation. */
(function(){
 const page=document.getElementById('ev-analysis');
 if(!page)return;
 const cards=[...page.querySelectorAll('.ev-story-grid .ev-stage')];
 const backdrop=document.createElement('dialog');
 backdrop.id='ev-enlarge-backdrop';
 backdrop.hidden=true;
 backdrop.setAttribute('aria-modal','true');
 backdrop.setAttribute('aria-label','Enlarged EV analysis card');
 backdrop.innerHTML='<div class="ev-expanded-holder"><button type="button" class="ev-expanded-close" aria-label="Close enlarged view">×</button></div>';
 document.body.appendChild(backdrop);
 const holder=backdrop.querySelector('.ev-expanded-holder');
 const close=backdrop.querySelector('.ev-expanded-close');
 let lastFocus=null;
 function dismiss(){
   if(backdrop.hidden)return;
   backdrop.close();
   backdrop.hidden=true;
   const expanded=holder.querySelector('.ev-expanded-card');
   if(expanded)expanded.remove();
   if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});
 }
 function enlarge(card){
   if(!page.classList.contains('active') || matchMedia('(max-width:767px)').matches)return;
   if(!page.classList.contains('ev-sequence-complete')&&!matchMedia('(max-width:850px), (prefers-reduced-motion:reduce)').matches)return;
   lastFocus=card.querySelector('.ev-enlarge-button');
   const old=holder.querySelector('.ev-expanded-card');if(old)old.remove();
   const copy=card.cloneNode(true);
   // Keep SVG definitions local to the clone without duplicate document IDs.
   const ids=[...copy.querySelectorAll('[id]')];
   ids.forEach(el=>{const old=el.id;el.id='expanded-'+old;copy.querySelectorAll('*').forEach(node=>{for(const attr of [...node.attributes]){if(attr.value.includes('url(#'+old+')'))node.setAttribute(attr.name,attr.value.replaceAll('url(#'+old+')','url(#expanded-'+old+')'));}});});
   copy.classList.add('ev-expanded-card');
   copy.classList.remove('ev-stage-one','ev-stage-two','ev-stage-three');
   copy.removeAttribute('style');
   holder.appendChild(copy);
   backdrop.hidden=false;
   backdrop.showModal();
   close.focus({preventScroll:true});
 }
 cards.forEach(card=>{
   card.addEventListener('click',e=>{
     if(e.target.closest('a'))return;
     enlarge(card);
   });
   const button=card.querySelector('.ev-enlarge-button');
   button.addEventListener('click',e=>{e.stopPropagation();enlarge(card)});
 });
 cards[2].addEventListener('animationend',e=>{
   if(e.animationName==='evSequentialSpotlight')page.classList.add('ev-sequence-complete');
 });
 function sync(){
   dismiss();
   page.classList.remove('ev-sequence-complete');
   if(matchMedia('(max-width:850px), (prefers-reduced-motion:reduce)').matches)page.classList.add('ev-sequence-complete');
 }
 window.addEventListener('hashchange',sync);
 window.addEventListener('resize',()=>{if(!backdrop.hidden)dismiss()});
 backdrop.addEventListener('click',e=>{if(e.target===backdrop)dismiss()});
 close.addEventListener('click',dismiss);
 backdrop.addEventListener('cancel',e=>{e.preventDefault();dismiss()});
 // Cycle Tab within the modal, including the publication link when present.
 backdrop.addEventListener('keydown',e=>{
   if(e.key!=='Tab')return;
   const targets=[...backdrop.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')].filter(el=>el.getClientRects().length);
   const first=targets[0],last=targets[targets.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 });
 if(matchMedia('(max-width:850px), (prefers-reduced-motion:reduce)').matches)page.classList.add('ev-sequence-complete');
})();

