/* Zhao Zhou Bridge: evidence-led story, shared model and reversible camera timeline. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');
  const mapData=/* MAP_DATA */;
  const chapters=[
    {name:'地理',index:'第一章 · 沿图寻桥',title:'桥，先从一条河说起。',copy:'赵州桥在河北省石家庄市赵县，横跨洨河。先从地图找到它，再到河岸边，看一座桥要连接怎样的空间。',metrics:[['赵县','','河北省 · 石家庄市'],['洨河','','赵州桥所跨河流']],source:'地点据赵县人民政府；现代行政区轮廓用于定位，不表示隋代边界。',next:'走到河边 →',duration:15},
    {name:'跨河',index:'第二章 · 先有跨越',title:'两岸之间，缺一条路。',copy:'站在河边，桥的任务变得直观：让两岸连续通行。跨越空间、河道开敞与两端支承，都是理解一座桥时要先看的条件。',metrics:[['连接','','两岸的通行需求'],['开敞','','桥下的河道空间']],source:'河岸、河床和水位为教学示意。隋代具体道路、渡口与建桥委托，现有材料未能直接证实。',next:'比较桥型 →',duration:11},
    {name:'选型',index:'第三章 · 结构的选择',title:'同样跨河，可以怎样搭？',copy:'梁直接跨越，以弯曲承受荷载；多孔拱把跨度分成几段，增加河中支点；单孔拱让一个大孔跨过河道，把荷载传向两端。试着切换，观察支承位置。',metrics:[['支点','','放在河中，还是两岸'],['传力','','梁与拱，各有路径']],source:'桥型为同一跨越范围的概念对照，参照 PBS NOVA。这里解释现存结构，未还原李春的历史选型过程。',next:'开始建主拱 →',duration:13},
    {name:'主拱',index:'第四章 · 一弧跨河',title:'先把这一道大拱，搭起来。',copy:'赵州桥主拱的净跨为37.02米，拱矢为7.23米。它是一段平缓圆弧。沿桥宽把28道拱券依次并排，主拱才成为我们眼前的整体。',metrics:[['37.02','m','主拱净跨'],['7.23','m','主拱拱矢']],source:'净跨、拱矢、28道拱券据赵县人民政府。逐道显现是模型分解顺序，不是隋代施工记录。',next:'看桥肩留空 →',duration:17},
    {name:'敞肩',index:'第五章 · 肩上留空',title:'桥肩，不必全部填满。',copy:'在主拱两端的桥肩，各有两孔小拱。让四孔逐一成形，再沿桥侧掠过孔口：敞开的桥肩，让桥体结构与河道空间彼此可见。',metrics:[['3.81','m','靠桥堍两孔 · 净跨'],['2.85','m','近桥中两孔 · 跨度']],source:'孔数与跨度据赵县人民政府；ASCE说明敞肩在洪水时可提供部分过水空间。小拱高度和位置含示意。',next:'跟随传力路径 →',duration:15},
    {name:'传力',index:'第六章 · 从桥面到两岸',title:'人走在上面，力去往哪里？',copy:'补上拱上结构、桥面和栏杆。桥面荷载经小拱传到主拱，再由主拱传向两端支承。循着朱色路径，向下看懂桥面与拱之间的联系。',metrics:[['桥面 → 小拱','','上部荷载向下传递'],['主拱 → 两端','','沿拱走向支承']],source:'小拱将桥面荷载传给主拱，参照ASCE。箭线为路径示意，透明观察不表示应力大小或实际分配比例。',next:'穿入拱腹 →',duration:17},
    {name:'穿行',index:'第七章 · 横向穿行',title:'一孔大拱，二十八道券。',copy:'从桥侧看，主拱是一道弧；沿桥宽看，它由28道券并列。暂时移开上部结构、拉开券道间距，镜头从拱腹下方穿行，看清一道券怎样重复成整体。',metrics:[['28','道','沿桥宽并列的主拱券'],['9','m','桥面宽 · 拱脚附近9.6 m']],source:'券道数和桥宽据赵县人民政府。分解间距被放大；逐石拼缝与连接细节不作测绘复原。',next:'回看完整桥梁 →',duration:17},
    {name:'整桥',index:'第八章 · 合而为桥',title:'再看整桥，每一块都有缘由。',copy:'地图让我们找到河流；主拱跨过河道，小拱在桥肩留空，28道券沿宽度并排。回到完整桥形，把每一块的位置、作用和联系重新看在一起。',metrics:[['单孔敞肩','','圆弧石拱桥'],['隋','','开皇后期至大业初年']],source:'结构与年代据赵县人民政府；结构作用参照ASCE。可自由旋转、剖切，或重新选择章节观察。',next:'从地图重新启程 ↺',duration:12}
  ];
  const state={chapter:0,p:0,running:false,continuous:false,free:false,reduce:reduceQuery.matches,type:'single',water:0,spread:.45,cut:0,notes:true,wash:true,auto:false};
  let viewer=null,dirty=true,visited=new Set([0]),lastFrame=performance.now(),uiKey='',mapWashClock=0,mapLastKey='',mapRegionKey='';
  const mc=$('mapCanvas'),mctx=mc.getContext('2d'),stage=$('stage');
  const paths={provinces:mapData.provinces.map(f=>({...f,path:new Path2D(f.d)})),cities:mapData.cities.map(f=>({...f,path:new Path2D(f.d)})),city:new Path2D(mapData.city),county:new Path2D(mapData.county)};
  const project=([lon,lat])=>[40+(lon-73)*Math.cos(35*Math.PI/180)*7.4,40+(Math.log(Math.tan(Math.PI/4+54*Math.PI/360))-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360)))*180/Math.PI*7.4];
  const bridgePoint=project(mapData.bridge);
  const pigment=document.createElement('canvas');pigment.width=220;pigment.height=150;
  const pigmentCtx=pigment.getContext('2d'),noise=new Float32Array(220*150),rgb=h=>{const n=parseInt(h.trim().slice(1),16);return[n>>16,(n>>8)&255,n&255];};
  const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
  function vn(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);return(hash(ix,iy)*(1-fx)+hash(ix+1,iy)*fx)*(1-fy)+(hash(ix,iy+1)*(1-fx)+hash(ix+1,iy+1)*fx)*fy;}
  for(let y=0;y<150;y++)for(let x=0;x<220;x++)noise[y*220+x]=vn(x*.071,y*.071)*.7+vn(x*.43,y*.43)*.3;
  let css=null;
  function readTheme(){const c=getComputedStyle(document.documentElement);css={paper:c.getPropertyValue('--paper').trim(),ink:c.getPropertyValue('--ink').trim(),red:c.getPropertyValue('--red').trim(),qing:c.getPropertyValue('--qing').trim(),muted:c.getPropertyValue('--muted').trim()};dirty=true;mapLastKey='';viewer?.theme();}
  function mapView(){const r=stage.getBoundingClientRect(),aspect=r.width/r.height;const views=[[228,265,Math.max(430,465*aspect)],[305,200,Math.max(51,72*aspect)],[291.3,211.2,Math.max(15,16*aspect)],[293.6,214.5,Math.max(4.2,4.2*aspect)]];const q=state.p*3,i=Math.min(2,Math.floor(q)),t=smooth(q-i),a=views[i],b=views[i+1];return{cx:a[0]+(b[0]-a[0])*t,cy:a[1]+(b[1]-a[1])*t,width:Math.exp(Math.log(a[2])*(1-t)+Math.log(b[2])*t),level:Math.round(q),q};}
  function drawMap(now){
    if(state.chapter!==0)return;
    const r=stage.getBoundingClientRect(),w=r.width,h=r.height,dpr=Math.min(devicePixelRatio||1,1.75);
    if(mc.width!==Math.round(w*dpr)||mc.height!==Math.round(h*dpr)){mc.width=Math.round(w*dpr);mc.height=Math.round(h*dpr);mapLastKey='';}
    const {cx,cy,width,level,q}=mapView(),scale=w/width,tx=w*.5-cx*scale,ty=h*.5-cy*scale;
    const region=q>2.3?'county':q>1.35?'city':'province';if(region!==mapRegionKey){mapRegionKey=region;mapWashClock=0;}
    const wash=state.reduce?1:clamp(.33+mapWashClock/2.8),key=[w,h,state.p.toFixed(4),wash.toFixed(3),state.wash].join('|');if(key===mapLastKey)return;mapLastKey=key;
    $('stageCaption').textContent=state.p<.23?'从中国地图，找到河北赵县。':state.p<.58?'河北省 · 石家庄市':state.p<.9?'石家庄市 · 赵县':'洨河上，赵州桥在这里。';
    mctx.setTransform(dpr,0,0,dpr,0,0);mctx.fillStyle=css.paper;mctx.fillRect(0,0,w,h);
    mctx.save();mctx.translate(tx,ty);mctx.scale(scale,scale);mctx.lineWidth=.7/scale;
    for(const f of paths.provinces){mctx.globalAlpha=.16;mctx.fillStyle=css.ink;mctx.strokeStyle=css.ink;mctx.fill(f.path,'evenodd');mctx.globalAlpha=.35;mctx.stroke(f.path);}
    if(q>.6){mctx.globalAlpha=clamp(q-.6);for(const f of paths.cities){mctx.strokeStyle=css.ink;mctx.lineWidth=.65/scale;mctx.stroke(f.path);}}
    mctx.globalAlpha=1;
    const highlight=q>2.3?paths.county:q>1.35?paths.city:paths.provinces.find(f=>f.code===130000).path;
    // Like the stone wash: value-noise disturbs a soft pigment front and leaves a darker bloom edge.
    mctx.save();mctx.clip(highlight,'evenodd');
    if(state.wash){const image=pigmentCtx.createImageData(220,150),col=rgb(css.qing),bx=(bridgePoint[0]*scale+tx)/w*220,by=(bridgePoint[1]*scale+ty)/h*150;
      for(let y=0;y<150;y++)for(let x=0;x<220;x++){const i=y*220+x,d=Math.hypot((x-bx)/220,(y-by)/150),edge=wash*1.45-d+(noise[i]-.5)*.22,k=4*i,bloom=.82+.18*noise[i];image.data[k]=col[0]*bloom;image.data[k+1]=col[1]*bloom;image.data[k+2]=col[2]*bloom;image.data[k+3]=Math.round(smooth(edge*9)*(.28+.2*noise[i])*255);}
      pigmentCtx.putImageData(image,0,0);mctx.setTransform(dpr,0,0,dpr,0,0);mctx.drawImage(pigment,0,0,w,h);
    }
    mctx.restore();mctx.globalAlpha=.9;mctx.strokeStyle=css.qing;mctx.lineWidth=1/scale;mctx.stroke(highlight);
    if(q>2.1){mctx.globalAlpha=.3;mctx.lineWidth=.7/scale;mctx.stroke(paths.county);}mctx.restore();mctx.globalAlpha=1;
    const x=bridgePoint[0]*scale+tx,y=bridgePoint[1]*scale+ty;
    mctx.strokeStyle=css.red;mctx.fillStyle=css.red;mctx.lineWidth=.9;mctx.beginPath();mctx.arc(x,y,4,0,Math.PI*2);mctx.fill();mctx.globalAlpha=.3;mctx.beginPath();mctx.arc(x,y,10,0,Math.PI*2);mctx.stroke();mctx.globalAlpha=1;
    const label=q<.7?'河北 · 赵州桥':q<2.2?'赵县 · 赵州桥':'赵州桥 · 洨河',tw=mctx.measureText(label).width;
    mctx.font='12px "Songti SC","SimSun",serif';const lx=clamp(x+22,9,w-150),ly=clamp(y-17,90,h-90);
    mctx.strokeStyle=css.red;mctx.beginPath();mctx.moveTo(x+8,y-3);mctx.lineTo(lx-4,ly+5);mctx.stroke();mctx.fillStyle=css.paper;mctx.fillRect(lx-4,ly-10,142,20);mctx.fillStyle=css.red;mctx.fillText(label,lx,ly+4);
    mctx.font='10px "Songti SC","SimSun",serif';mctx.fillStyle=css.muted;
    const crumbs=['中国','河北','石家庄','赵县'];let bx=12;for(let i=0;i<4;i++){mctx.globalAlpha=i<=level?1:.4;mctx.fillStyle=i===level?css.red:css.muted;mctx.fillText(crumbs[i],bx,58);bx+=mctx.measureText(crumbs[i]).width+19;if(i<3){mctx.fillStyle=css.muted;mctx.fillText('›',bx-12,58);}}
    mctx.globalAlpha=.55;mctx.strokeStyle=css.ink;mctx.beginPath();mctx.moveTo(w-29,80);mctx.lineTo(w-29,105);mctx.moveTo(w-33,86);mctx.lineTo(w-29,80);mctx.lineTo(w-25,86);mctx.stroke();mctx.font='9px Georgia,serif';mctx.fillStyle=css.ink;mctx.fillText('N',w-32,72);mctx.globalAlpha=1;
  }
  function setMetrics(items){$('lessonMetrics').replaceChildren(...items.map(([value,unit,label])=>{const div=document.createElement('div'),strong=document.createElement('strong'),i=document.createElement('i'),span=document.createElement('span');strong.textContent=value;if(value.length>6)strong.style.fontSize='17px';i.textContent=unit;strong.append(i);span.textContent=label;div.append(strong,span);return div;}));}
  function rangeActivity(id,label,min,max,value,unit,onInput){const row=document.createElement('div'),labelEl=document.createElement('label'),wrap=document.createElement('div'),input=document.createElement('input'),out=document.createElement('output');labelEl.htmlFor=id;labelEl.textContent=label;wrap.className='range-row';input.id=id;input.type='range';input.min=min;input.max=max;input.step='1';input.value=value;out.htmlFor=id;out.textContent=value+unit;input.style.setProperty('--p',(value-min)/(max-min));input.oninput=()=>{const n=+input.value;out.textContent=n+unit;input.style.setProperty('--p',(n-min)/(max-min));onInput(n);dirty=true;};wrap.append(input,out);row.append(labelEl,wrap);return row;}
  function choices(items,selected,cb){const wrap=document.createElement('div');wrap.className='choices';for(const [key,text]of items){const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.choice=key;b.setAttribute('aria-pressed',String(key===selected));b.onclick=()=>{for(const child of wrap.children)child.setAttribute('aria-pressed',String(child===b));cb(key);dirty=true;};wrap.append(b);}return wrap;}
  function renderActivity(){const a=$('activity');a.replaceChildren();switch(state.chapter){
    case 0:a.append(choices([['0','中国'],['1','河北'],['2','石家庄'],['3','赵县']],String(Math.round(state.p*3)),key=>scrub(+key/3)));break;
    case 1:a.append(rangeActivity('waterLevel','抬高水位，观察跨越空间（示意）',0,100,state.water,state.water?'%':'%',n=>{takeControl(false);state.water=n;}));break;
    case 2:a.append(choices([['beam','梁'],['multi','多孔拱'],['single','单孔拱']],state.type,key=>{takeControl(false);state.type=key;}));break;
    case 3:a.append(rangeActivity('ribCount','沿桥宽，逐道添入主拱券',0,28,Math.round(state.p*28),' 道',n=>scrub(n/28)));break;
    case 4:a.append(rangeActivity('smallCount','四个小拱，逐孔显现',0,4,Math.floor(state.p*4+1e-6),' 孔',n=>scrub(n/4)));break;
    case 5:a.append(choices([['path','看传力路径'],['still','停下观察']],state.free?'still':'path',key=>{if(key==='path'){scrub(.82);}else takeControl();}));break;
    case 6:a.append(rangeActivity('ribSpread','拉开券道间距（放大示意）',0,100,Math.round(state.spread*100),'%',n=>{takeControl(false);state.spread=n/100;}));break;
    case 7:a.append(choices([['whole','整桥'],['section','剖切']],state.cut?'section':'whole',key=>{takeControl();setCut(key==='section'?100:0);}));break;
  }}
  function syncUI(){
    const c=chapters[state.chapter],key=state.chapter+'|'+state.running+'|'+state.free+'|'+state.p.toFixed(3);
    if(key===uiKey)return;uiKey=key;
    const progress=Math.round(state.p*100);$('prog').value=Math.round(state.p*1000);$('prog').style.setProperty('--p',state.p);$('prog').setAttribute('aria-valuetext',`${c.name}，本段${progress}%`);$('rdProg').textContent=progress+'%';
    $('bPlay').textContent=state.running?'Ⅱ 暂停导览':state.chapter===0&&state.p===0?'▶ 开始导览':state.chapter===7&&state.p===1?'↺ 再看一遍':'▶ 继续导览';$('bPlay').setAttribute('aria-pressed',String(state.running));$('bPrev').disabled=state.chapter===0;
    $('sceneMode').textContent=state.free?'自由观察':state.running?(state.continuous?'连续导览':'重看本段'):state.chapter===7&&state.p===1?'自由观察':'已暂停';
    for(const b of document.querySelectorAll('[data-chapter]')){const i=+b.dataset.chapter;b.toggleAttribute('aria-current',i===state.chapter);if(i===state.chapter)b.setAttribute('aria-current','step');b.style.setProperty('--chapter-p',i===state.chapter?state.p:visited.has(i)?1:0);}
    if(state.chapter===0){for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(+b.dataset.choice===Math.round(state.p*3)));}
    if(state.chapter===3||state.chapter===4){const input=$(state.chapter===3?'ribCount':'smallCount');if(input){const n=state.chapter===3?Math.ceil(state.p*28-.0001):Math.floor(state.p*4+1e-6);input.value=n;input.style.setProperty('--p',state.p);input.nextElementSibling.textContent=n+(state.chapter===3?' 道':' 孔');}}
  }
  function updateChapter(){const c=chapters[state.chapter];$('chapterCount').textContent=String(state.chapter+1).padStart(2,'0')+' / 08';$('lessonIndex').textContent=c.index;$('lessonTitle').textContent=c.title;$('lessonCopy').textContent=c.copy;$('lessonSource').textContent=c.source;$('bNext').textContent=c.next;setMetrics(c.metrics);stage.classList.toggle('map-mode',state.chapter===0);$('sceneId').textContent=String(state.chapter+1).padStart(2,'0')+' / '+c.name+' · '+(state.chapter===0?'现代位置图':'结构教学模型');$('viewTip').textContent=state.chapter===0?'现代行政区轮廓 · 非隋代地图；点击层级或拖动本段进度。':'拖动即接管镜头 · 滚轮 / 双指缩放 · 方向键旋转';renderActivity();uiKey='';dirty=true;syncUI();}
  function enter(chapter,p=0,run=false,chain=false){state.chapter=clamp(chapter,0,7);state.p=clamp(p);state.running=run;state.continuous=chain;state.free=false;state.auto=false;state.cut=0;visited.add(state.chapter);mapWashClock=0;mapLastKey='';viewer?.beginTransition();viewer?.stopOrbit();setCut(0);updateChapter();}
  function scrub(p){state.running=false;state.continuous=false;state.free=false;state.p=clamp(p);if(state.chapter===0){mapWashClock=0;mapLastKey='';}viewer?.cancelTransition();dirty=true;uiKey='';syncUI();}
  function takeControl(free=true){state.running=false;state.continuous=false;state.free=free;viewer?.cancelTransition();if(free)viewer?.adoptCamera();dirty=true;uiKey='';syncUI();}
  function setCut(n){state.cut=clamp(n,0,100);$('cut').value=state.cut;$('cut').style.setProperty('--p',state.cut/100);$('rdCut').textContent=state.cut?'切入 '+Math.round(state.cut)+'%':'未剖切';if(state.chapter===7)for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(b.dataset.choice===(state.cut?'section':'whole')));dirty=true;}
  $('bSources').onclick=()=>{takeControl(false);$('sourcesDialog').showModal();};$('bCloseSources').onclick=()=>$('sourcesDialog').close();
  $('bPlay').onclick=()=>{if(state.running){takeControl(false);return;}if(state.chapter===7&&state.p===1){visited=new Set();enter(0,0,true,true);return;}state.running=true;state.continuous=true;state.free=false;state.auto=false;viewer?.beginTransition();viewer?.stopOrbit();if(state.p===1){if(state.chapter<7)enter(state.chapter+1,0,true,true);else enter(0,0,true,true);}dirty=true;uiKey='';syncUI();};
  $('bReplay').onclick=()=>enter(state.chapter,0,true,false);$('bNext').onclick=()=>enter(state.chapter===7?0:state.chapter+1,0,true,false);$('bPrev').onclick=()=>enter(state.chapter-1,1,false,false);$('bReset').onclick=()=>enter(7,1,false,false);
  document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>enter(+b.dataset.chapter,0,true,false));
  $('prog').oninput=()=>scrub($('prog').value/1000);$('cut').oninput=()=>{const n=+$('cut').value;if(state.chapter<3)enter(7,1);takeControl();setCut(n);};
  $('bWash').onclick=()=>{state.wash=!state.wash;$('bWash').setAttribute('aria-pressed',String(state.wash));$('bWash').textContent=state.wash?'褪去设色':'施加设色';viewer?.startWash();mapWashClock=0;mapLastKey='';dirty=true;};
  $('bNote').onclick=()=>{state.notes=!state.notes;$('bNote').setAttribute('aria-pressed',String(state.notes));dirty=true;};
  $('bAuto').onclick=()=>{if(state.chapter===0)enter(7,1);takeControl();state.auto=!state.auto;$('bAuto').setAttribute('aria-pressed',String(state.auto));dirty=true;};
  reduceQuery.addEventListener('change',()=>{state.reduce=reduceQuery.matches;viewer?.cancelTransition();dirty=true;});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',readTheme);
  new ResizeObserver(()=>{dirty=true;mapLastKey='';viewer?.resize();}).observe(stage);
  const fallback=error=>{console.error('赵州桥模型初始化失败',error);$('modelStatus').hidden=false;$('modelStatus').textContent='3D模型暂时无法显示。地图与八段讲解仍可阅读；请使用支持WebGL的浏览器打开。';};
  readTheme();updateChapter();

  (async()=>{
    // Both MIT modules are embedded; blob URLs resolve their single internal module dependency offline.
    const coreURL=URL.createObjectURL(new Blob([$('threeCore').content.textContent],{type:'text/javascript'}));
    const renderURL=URL.createObjectURL(new Blob([$('threeRenderer').content.textContent.replaceAll('./three.core.js',coreURL)],{type:'text/javascript'}));
    const THREE=await import(renderURL);URL.revokeObjectURL(renderURL);URL.revokeObjectURL(coreURL);THREE.ColorManagement.enabled=false;
    const cv=$('gl'),ov=$('ov'),octx=ov.getContext('2d'),DPR=Math.min(devicePixelRatio||1,1.75);
    const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:false});renderer.setPixelRatio(DPR);renderer.localClippingEnabled=true;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.07,2000),clip=new THREE.Plane(new THREE.Vector3(0,0,-1),140);
    const U={paper:{value:new THREE.Color()},ink:{value:new THREE.Color()},red:{value:new THREE.Color()},boil:{value:0},dpr:{value:DPR},prog:{value:1},grow:{value:999},wash:{value:1},washY:{value:999},lineK:{value:.45},hang:{value:999},shinCol:{value:new THREE.Color()},light:{value:new THREE.Vector3(.55,.78,.3).normalize()}};
    function theme(){U.paper.value.set(css.paper);U.ink.value.set(css.ink);U.red.value.set(css.red);renderer.setClearColor(U.paper.value);}
    theme();
/* ENGINE_GEOMETRY */
    const model=buildAnji();scene.add(model.group);
    const g=model.geometry;
    // Match the original model's teaching scale; the concept alternatives do not claim historical designs.
    function concept(type){resetBuild();PART='concept';PAINT=QINGSHI2;const width=7.5;
      for(const x of [-19.6,19.6])box('stone',x,1.5,0,2.1,11,width,true,0);
      if(type==='beam')box('stone',0,7.7,0,39,1.5,width,true,0);
      else{const n=type==='multi'?3:1,span=37.02/n,half=span/2,rise=type==='multi'?4.5:7.23,R=(half*half+rise*rise)/(2*rise),cy=rise-R,theta=Math.asin(half/R),base=type==='multi'?2.5:0;
        for(let i=0;i<n;i++){const cx=-18.51+half+i*span;for(const rad of [R,R+.85])surf('arch',(u,v)=>{const a=-theta+u*theta*2;return V(cx+rad*Math.sin(a),base+cy+rad*Math.cos(a),(v-.5)*width);},36,1,0);for(const z of [-width/2,width/2])surf('arch',(u,v)=>{const a=-theta+u*theta*2,r=R+v*.85;return V(cx+r*Math.sin(a),base+cy+r*Math.cos(a),z);},36,1,0);for(const z of [-width/2,width/2]){const p=[];for(let j=0;j<=36;j++){const a=-theta+j/36*theta*2;p.push(V(cx+R*Math.sin(a),base+cy+R*Math.cos(a),z));}lines('arch',p,false,0);}}
        if(n>1)for(const x of [-18.51+span,-18.51+2*span])box('stone',x,-1,0,1.5,7,width,true,0);
        box('deck',0,8.2,0,39,.5,width,true,0);
      }const c=finalize();scene.add(c.group);c.group.visible=false;return c;
    }
    const concepts={beam:concept('beam'),multi:concept('multi'),single:concept('single')};
    const flowGroup=new THREE.Group();scene.add(flowGroup);
    const flowMaterial=new THREE.LineBasicMaterial({color:css.red,transparent:true,opacity:.75,depthTest:false}),flowCurves=[];
    for(const side of [-1,1]){
      const points=[V(side*10.6,8.8,side*5.1),V(side*10.6,7.9,side*5.1),V(side*12,6.7,side*5.1)];
      for(let j=0;j<=24;j++){const x=12+(18.51-12)*j/24;points.push(V(side*x,g.eTop(x)+.12,side*5.1));}points.push(V(side*21,-.7,side*5.1));
      const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');flowCurves.push(curve);const geom=new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));const line=new THREE.Line(geom,flowMaterial);line.renderOrder=25;flowGroup.add(line);
    }
    const arrows=[];for(let i=0;i<6;i++){const a=new THREE.ArrowHelper(V(0,-1,0),V(0,0,0),1.25,css.red,.5,.24);a.traverse(c=>{if(c.material){c.material.depthTest=false;c.material.transparent=true;c.material.opacity=.9;}});flowGroup.add(a);arrows.push(a);}
    let W=1,H=1,target=V(0,3,0),orbit={th:.2,ph:1.3,dist:75},transition=null,washTime=1,waterValue=0,last3DKey='',pointerMode=false;
    const curve=pts=>new THREE.CatmullRomCurve3(pts.map(p=>V(...p)),false,'centripetal');
    const cameraPaths=[
      [[[28,16,78],[22,16,72]],[[0,3,0],[0,3,0]]],
      [[[0,-1,38],[0,1,25],[16,7,32],[26,13,48]],[[0,-2,0],[0,1,0],[0,3,0],[0,3,0]]],
      [[[-12,13,76],[9,10,70],[0,6,72],[0,10,76]],[[0,3,0],[0,3,0],[0,3,0],[0,3,0]]],
      [[[-23,4,29],[-13,14,24],[2,19,35],[27,15,62]],[[-16,1,0],[-9,6,0],[0,6,0],[0,3,0]]],
      // Skim the shoulder openings from outside, keeping their relation to the main arch visible.
      [[[29,18,68],[24,14,42],[18,10,29],[10,9,25],[2,9,29],[-9,13,40],[-19,17,55],[-28,19,70]],[[0,4,0],[14,6,0],[15.9,5,0],[10.6,6.5,0],[10.6,6,0],[0,4,0],[0,4,0],[0,4,0]]],
      // Follow the load path from outside the side elevation so the arch and its annotations stay visible.
      [[[29,23,68],[16,17,52],[10.6,14,45],[14,13,46],[20,11,55],[28,15,78]],[[0,5,0],[10.6,8.8,5.1],[12,6.7,5.1],[15,3.5,5.1],[18.5,1.5,5.1],[0,3,0]]],
      // Offset the passage from the optical axis so the underside stays visible without an abrupt turn.
      [[[25,18,59],[8,8.4,16],[6,5,6],[6,5,-6],[29,19,-58]],[[0,4,0],[2,6.4,0],[0,6.4,0],[0,6.4,0],[0,4,0]]],
      [[[29,19,-58],[33,22,56],[20,21,79],[12,22,87]],[[0,4,0],[0,4,0],[0,4,0],[0,4,0]]]
    ].map(([pos,aim])=>({pos:curve(pos),aim:curve(aim)}));
    function pose(){const p=state.reduce?1:smooth(state.p),path=cameraPaths[state.chapter];return{pos:path.pos.getPoint(p),aim:path.aim.getPoint(p)};}
    function adoptCamera(){const delta=camera.position.clone().sub(target);orbit={dist:delta.length(),ph:Math.acos(clamp(delta.y/delta.length(),-1,1)),th:Math.atan2(delta.x,delta.z)};transition=null;}
    function resize(){const r=stage.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);renderer.setSize(W,H,false);ov.width=Math.round(W*DPR);ov.height=Math.round(H*DPR);camera.aspect=W/H;camera.fov=clamp(36+Math.max(0,1.28-W/H)*27,36,58);camera.updateProjectionMatrix();dirty=true;}
    function reveal(name,p=1,opacity=1){const part=model.parts[name];if(!part)return;part.node.visible=p>0&&opacity>.002;part.uniforms.progress.value=clamp(p)*.035;part.uniforms.opacity.value=opacity;for(const obj of part.meshes){const transparent=!obj.isMesh||opacity<.999;if(obj.material.transparent!==transparent){obj.material.transparent=transparent;obj.material.needsUpdate=true;}obj.material.depthWrite=obj.isMesh&&!transparent;}}
    function setModel(){
      const c=state.chapter,p=state.p;model.group.visible=c>0;
      for(const name of Object.keys(model.parts))reveal(name,0);
      if(c>0){reveal('terrain');reveal('water',1,.62);reveal('abutments',c>=3?1:0);}
      for(let i=0;i<28;i++){const part=model.parts['rib-'+i];if(!part)continue;const n=c===3?clamp(p*28-i):c>3?1:0;reveal('rib-'+i,n);part.node.position.z=c===6?(i-13.5)*state.spread*.24:0;}
      if(c>=4)for(let i=0;i<4;i++)reveal('small-'+i,c===4?clamp(p*4-i):1);
      if(c===5){reveal('fill',clamp(p*4),p>.27&&p<.83?.25:1);reveal('cover',clamp((p-.08)*4),p>.27&&p<.83?.25:1);reveal('deck',clamp((p-.23)*4),p>.27&&p<.83?.32:1);reveal('railing',clamp((p-.42)*4),p>.27&&p<.83?.38:1);reveal('arch-detail',clamp((p-.5)*3));}
      if(c===6){for(const name of ['terrain','water','abutments','small-0','small-1','small-2','small-3'])reveal(name,name==='terrain'||name==='water'?1:0,name==='terrain'||name==='water'?.22:1);}
      if(c===7)for(const name of ['fill','cover','deck','railing','arch-detail'])reveal(name,1);
      for(const [type,concept]of Object.entries(concepts)){concept.group.visible=c===2&&state.type===type;for(const part of Object.values(concept.parts)){part.uniforms.progress.value=1;part.uniforms.opacity.value=1;}}
      flowGroup.visible=c===5&&p>.35;
      clip.constant=state.cut?6.2-state.cut/100*6.2:140;
      const waterPart=model.parts.water;if(waterPart)waterPart.node.position.y=(c===1?state.water:0)/100*10;
      if(c===6&&state.running&&!state.free){state.spread=.2+.65*Math.sin(Math.PI*p);const input=$('ribSpread');if(input){input.value=Math.round(state.spread*100);input.style.setProperty('--p',state.spread);input.nextElementSibling.textContent=Math.round(state.spread*100)+'%';}}
      let caption='';
      if(c===0)caption=state.p<.23?'从中国地图，找到河北赵县。':state.p<.58?'河北省 · 石家庄市':state.p<.9?'石家庄市 · 赵县':'洨河上，赵州桥在这里。';
      if(c===1)caption='先看两岸，再看跨越。河岸与水位为示意。';
      if(c===2)caption=state.type==='beam'?'梁：直接跨越，以弯曲传力。':state.type==='multi'?'多孔拱：分段跨越，河中增加支点。':'单孔拱：一个大孔，荷载传向两端。';
      if(c===3)caption=`主拱券 ${Math.ceil(p*28-.0001)} / 28 道 · 按模型分解次序显现`;
      if(c===4)caption=`敞肩小拱 ${Math.floor(p*4+1e-6)} / 4 孔 · 每侧两孔`;
      if(c===5)caption=p>.27&&p<.83?'透视观察 · 朱线表示荷载传递路径':'桥面 → 小拱 → 主拱 → 两端支承';
      if(c===6)caption='沿桥宽穿行 · 券道展开间距为放大示意';
      if(c===7)caption=state.p===1?'主拱跨河，桥肩留空，二十八道券合而成桥。':'恢复完整桥形，回到两岸之间。';
      if($('stageCaption').textContent!==caption)$('stageCaption').textContent=caption;
    }
    function overlay(){
      octx.setTransform(DPR,0,0,DPR,0,0);octx.clearRect(0,0,W,H);if(!state.notes||state.chapter<3)return;
      if(state.running&&state.p>.14&&state.p<.85&&state.chapter!==3)return;
      const items=state.chapter===3?model.notes.filter(([s])=>s.startsWith('净跨')||s.startsWith('拱矢')):state.chapter===4?model.notes.filter(([s])=>s.startsWith('敞肩')):state.chapter===5?(state.p<.35?[]:[['桥面荷载',V(10.6,8.8,5.1)],['小拱 → 主拱',V(12,6.7,5.1)],['传向两端支承',V(19,-.2,5.1)]]):state.chapter===6?model.notes.filter(([s])=>s.includes('28')):model.notes.filter(([s])=>!s.startsWith('敞肩'));
      octx.font=`${W<500?9:10}px "Songti SC","SimSun",serif`;octx.textBaseline='middle';const placed=[];
      for(const [text,point]of items){const q=point.clone().project(camera);if(q.z>1||q.z< -1||Math.abs(q.x)>.93||Math.abs(q.y)>.78)continue;const x=(q.x*.5+.5)*W,y=(-q.y*.5+.5)*H,tw=octx.measureText(text).width;let tx=clamp(x+(x>W/2?22:-tw-22),9,W-tw-9),ty=clamp(y-27,66,H-95);for(let j=0;j<8&&placed.some(r=>tx<r.x+r.w+8&&tx+tw>r.x-8&&Math.abs(ty-r.y)<21);j++)ty+=j%2?-(j+1)*11:(j+1)*11;if(ty<62||ty>H-90)continue;placed.push({x:tx,y:ty,w:tw});octx.strokeStyle=css.red;octx.fillStyle=css.red;octx.lineWidth=.7;octx.beginPath();octx.arc(x,y,1.6,0,Math.PI*2);octx.fill();octx.beginPath();octx.moveTo(x,y);octx.lineTo(clamp(x,tx,tx+tw),ty+7);octx.stroke();octx.globalAlpha=.94;octx.fillStyle=css.paper;octx.fillRect(tx-4,ty-8,tw+8,16);octx.globalAlpha=1;octx.fillStyle=css.ink;octx.fillText(text,tx,ty);}
    }
    const pointers=new Map();let panMode=false,pinch=null;
    function stopOrbit(){state.auto=false;$('bAuto').setAttribute('aria-pressed','false');}
    cv.addEventListener('contextmenu',e=>e.preventDefault());
    cv.addEventListener('pointerdown',e=>{if(state.chapter===0)return;e.preventDefault();takeControl();stopOrbit();pointerMode=true;panMode=e.button===1||e.button===2||e.shiftKey;pointers.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}});
    cv.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId),dx=e.clientX-old[0],dy=e.clientY-old[1];pointers.set(e.pointerId,[e.clientX,e.clientY]);
      if(pointers.size===1){if(panMode){const s=orbit.dist*.52/H,m=camera.matrixWorld.elements;target.x+=(-dx*m[0]+dy*m[4])*s;target.y+=(-dx*m[1]+dy*m[5])*s;target.z+=(-dx*m[2]+dy*m[6])*s;}else{orbit.th-=dx*.006;orbit.ph=clamp(orbit.ph-dy*.005,.13,1.7);}}
      else if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch&&d>3)orbit.dist=clamp(orbit.dist*pinch/d,3,220);pinch=d;}dirty=true;
    });
    const up=e=>{pointers.delete(e.pointerId);pinch=null;pointerMode=pointers.size>0;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('lostpointercapture',up);
    cv.addEventListener('wheel',e=>{e.preventDefault();takeControl();stopOrbit();orbit.dist=clamp(orbit.dist*(1+Math.sign(e.deltaY)*.075),3,220);dirty=true;},{passive:false});
    cv.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','_','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){enter(7,1);return;}takeControl();stopOrbit();if(e.key==='ArrowLeft')orbit.th-=.1;if(e.key==='ArrowRight')orbit.th+=.1;if(e.key==='ArrowUp')orbit.ph=clamp(orbit.ph-.08,.13,1.7);if(e.key==='ArrowDown')orbit.ph=clamp(orbit.ph+.08,.13,1.7);if(['+','='].includes(e.key))orbit.dist=clamp(orbit.dist*.9,3,220);if(['-','_'].includes(e.key))orbit.dist=clamp(orbit.dist/ .9,3,220);dirty=true;});
    viewer={
      theme,resize,adoptCamera,stopOrbit,
      beginTransition(){if(!state.reduce)transition={pos:camera.position.clone(),aim:target.clone(),time:0};else transition=null;dirty=true;},
      cancelTransition(){transition=null;},startWash(){washTime=0;},
      render(now,dt){
        if(state.chapter===0){if(dirty)octx.clearRect(0,0,ov.width,ov.height);return;}
        const needs=dirty||state.running||state.auto||transition||washTime<1||flowGroup.visible;if(!needs)return;
        setModel();
        if(state.free){if(state.auto&&!pointerMode)orbit.th+=dt*.12;camera.position.set(target.x+orbit.dist*Math.sin(orbit.ph)*Math.sin(orbit.th),target.y+orbit.dist*Math.cos(orbit.ph),target.z+orbit.dist*Math.sin(orbit.ph)*Math.cos(orbit.th));}
        else{const next=pose();if(transition){transition.time+=dt;const a=smooth(transition.time/1.3);camera.position.lerpVectors(transition.pos,next.pos,a);target.lerpVectors(transition.aim,next.aim,a);if(a===1)transition=null;}else{camera.position.copy(next.pos);target.copy(next.aim);}}
        camera.lookAt(target);camera.updateMatrixWorld();
        washTime=state.reduce?1:Math.min(1,washTime+dt/2.4);U.wash.value=state.wash?1:0;U.lineK.value=state.wash?.45:1;U.washY.value=!state.wash||washTime===1?999:-6.9+washTime*25;
        if(state.chapter===7&&state.running&&!state.reduce)U.washY.value=state.p>.8?999:-6.9+state.p*27;
        flowMaterial.color.set(css.red);arrows.forEach((a,i)=>{const curve=flowCurves[i%2],t=(i/6+(state.running?state.p: .75))%1;a.position.copy(curve.getPoint(t));a.setDirection(curve.getTangent(t).normalize());a.setColor(css.red);});
        renderer.render(scene,camera);overlay();dirty=false;
      },
      inspect(){const coords=Object.values(model.parts).flatMap(part=>part.meshes.filter(o=>o.isMesh).map(o=>o.geometry.attributes.position));return{parts:Object.keys(model.parts),ribs:Object.keys(model.parts).filter(n=>n.startsWith('rib-')).length,smallArches:Object.keys(model.parts).filter(n=>n.startsWith('small-')).length,visible:Object.keys(model.parts).filter(n=>model.parts[n].node.visible),camera:camera.position.toArray(),target:target.toArray(),clip:clip.constant,concept:Object.entries(concepts).find(([,c])=>c.group.visible)?.[0]??null,notesDrawn:state.notes,finite:coords.every(a=>Array.from(a.array).every(Number.isFinite)),geometry:{span:g.SPAN,rise:g.RISE,radius:g.R},drawCalls:renderer.info.render.calls};}
    };
    resize();setModel();const first=pose();camera.position.copy(first.pos);target.copy(first.aim);camera.lookAt(target);$('modelStatus').hidden=true;dirty=true;
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();state.running=false;$('modelStatus').hidden=false;$('modelStatus').textContent='图形上下文已暂停，请重新打开页面；章节文字与来源仍可阅读。';});
  })().catch(fallback);
  window.bridgeApp={getState:()=>({...state,ready:!!viewer}),inspect:()=>viewer?.inspect()};
  function frame(now){const dt=Math.min(.06,(now-lastFrame)/1000);lastFrame=now;if(!document.hidden){
    if(state.chapter===0)mapWashClock+=dt;
    if(state.running&&!$('sourcesDialog').open){state.p=Math.min(1,state.p+dt/(state.reduce?5:chapters[state.chapter].duration));dirty=true;if(state.p===1){if(state.continuous&&state.chapter<7)enter(state.chapter+1,0,true,true);else{state.running=false;state.continuous=false;if(state.chapter===7){state.free=true;viewer?.adoptCamera();}}}}
    drawMap(now);viewer?.render(now,dt);syncUI();
  }requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();
