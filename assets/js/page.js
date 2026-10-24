/* Preserved section navigation and heading alignment from the supplied draft. */

/* Revision 109: viewport-aligned section navigation on Home and EV Analysis. */
(function(){
 document.addEventListener('keydown',function(event){
   if(!['PageDown','PageUp'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
   if(document.querySelector('dialog[open]'))return;
   const active=document.activeElement;
   if(active&&(/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)||active.isContentEditable))return;
   const page=document.querySelector('.page.active');
   if(!page||!['home','ev-analysis'].includes(page.id))return;
   const children=Array.from(page.children).filter(el=>el.matches('section,div.section,div.ev-story'));
   if(!children.length)return;
   const y=window.scrollY;
   const tops=children.map(el=>el.getBoundingClientRect().top+y);
   const eps=8;
   let index;
   if(event.key==='PageDown')index=tops.findIndex(t=>t>y+eps);
   else {index=-1;for(let i=tops.length-1;i>=0;i--){if(tops[i]<y-eps){index=i;break;}}}
   if(index<0)return;
   event.preventDefault();
   window.scrollTo({top:tops[index],behavior:'instant'});
 });
})();


(function(){
  function alignWhyDfc(){
    var inner=document.querySelector('#home .why-dfc-section .why-dfc-inner');
    var heading=document.querySelector('#home .why-dfc-section .why-dfc-card h3');
    if(!inner||!heading)return;
    var inset=Math.max(0,heading.getBoundingClientRect().left-inner.getBoundingClientRect().left);
    inner.style.setProperty('--why-dfc-heading-inset',inset.toFixed(2)+'px');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',alignWhyDfc);
  else alignWhyDfc();
  window.addEventListener('resize',alignWhyDfc,{passive:true});
})();

