/* Manual image gallery. No timer or automatic slide changes. */
(() => {
  const root=document.querySelector('[data-ev-gallery]');
  const images=window.PANGNOSTICS_EV_GALLERY;
  if(!root || !Array.isArray(images) || images.length!==2 ||
    images.some(item=>!item || typeof item.src!=='string' || !item.src || typeof item.alt!=='string' || !item.alt))return;
  const stage=root.querySelector('.ev-gallery-stage');
  const positions=root.querySelector('.ev-gallery-positions');
  const status=root.querySelector('.ev-gallery-status');
  const slides=[],buttons=[];
  let current=0;
  const show=(index,announce=true)=>{
    current=(index+images.length)%images.length;
    slides.forEach((slide,i)=>{slide.hidden=i!==current;buttons[i].setAttribute('aria-pressed',String(i===current));});
    if(announce)status.textContent=`Image ${current+1} of ${images.length}: ${images[current].alt}`;
  };
  images.forEach((item,i)=>{
    const slide=document.createElement('div');
    slide.className='ev-gallery-slide';
    slide.id=`ev-overview-slide-${i+1}`;
    slide.setAttribute('role','group');
    slide.setAttribute('aria-roledescription','slide');
    slide.setAttribute('aria-label',`${i+1} of ${images.length}`);
    const image=document.createElement('img');
    image.src=item.src;image.alt=item.alt;image.decoding='async';
    const link=document.createElement('a');
    link.className='ev-gallery-image-link';link.href=item.src;link.target='_blank';link.rel='noopener';
    link.setAttribute('aria-label','Open larger image in a new tab: '+item.alt);
    link.append(image);slide.append(link);stage.append(slide);slides.push(slide);
    const button=document.createElement('button');
    button.type='button';button.className='ev-gallery-position';
    button.setAttribute('aria-label',`Show image ${i+1}: ${item.alt}`);
    button.setAttribute('aria-controls',slide.id);
    const dot=document.createElement('span');dot.setAttribute('aria-hidden','true');button.append(dot);
    button.addEventListener('click',()=>show(i));
    positions.append(button);buttons.push(button);
  });
  root.querySelector('[data-ev-prev]').addEventListener('click',()=>show(current-1));
  root.querySelector('[data-ev-next]').addEventListener('click',()=>show(current+1));
  root.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
    const target={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:images.length-1}[event.key];
    if(target===undefined)return;
    event.preventDefault();show(target);
  });
  show(0,false);
  root.hidden=false;
})();
