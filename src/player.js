/* Zhao Zhou Bridge: evidence-led story, shared model and reversible camera timeline. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
  const reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');
  const mapData=/* MAP_DATA */;
  const chapters=[
    {name:'地理',index:'第一章 · 沿图寻桥',title:'一座石桥，为什么长成这样？',copy:'一个平缓的大拱，肩上又开出四孔。先记住这个形状：接下来的20秒，我们从整桥回到地图，再落到洨河两岸，追问一座桥怎样连接这里。',metrics:[['一孔','','主拱跨过河道'],['四孔','','小拱留在桥肩']],source:'桥形据赵县人民政府；地景、河岸与镜头衔接为教学示意。',next:'走到河边 →',duration:20},
    {name:'跨河',index:'第二章 · 先有跨越',title:'两岸之间，缺一条路。',copy:'站在河边，桥的任务变得直观：让两岸连续通行。跨越空间、河道开敞与两端支承，都是理解一座桥时要先看的条件。',metrics:[['连接','','两岸的通行需求'],['开敞','','桥下的河道空间']],source:'河岸、河床和水位为教学示意。隋代具体道路、渡口与建桥委托，现有材料未能直接证实。',next:'比较桥型 →',duration:11},
    {name:'选型',index:'第三章 · 结构的选择',title:'同样跨河，可以怎样搭？',copy:'梁直接跨越，以弯曲承受荷载；多孔拱把跨度分成几段，增加河中支点；单孔拱让一个大孔跨过河道，把荷载传向两端。试着切换，观察支承位置。',metrics:[['支点','','放在河中，还是两岸'],['传力','','梁与拱，各有路径']],source:'桥型为同一跨越范围的概念对照，参照 PBS NOVA。这里解释现存结构，未还原李春的历史选型过程。',next:'开始建主拱 →',duration:13},
    {name:'主拱',index:'第四章 · 一弧跨河',title:'先把这一道大拱，搭起来。',copy:'赵州桥主拱的净跨为37.02米，拱矢为7.23米。它是一段平缓圆弧。沿桥宽把28道拱券依次并排，主拱才成为我们眼前的整体。',metrics:[['37.02','m','主拱净跨'],['7.23','m','主拱拱矢']],source:'净跨、拱矢、28道拱券据赵县人民政府。逐道显现是模型分解顺序，不是隋代施工记录。',next:'看桥肩留空 →',duration:17},
    {name:'敞肩',index:'第五章 · 肩上留空',title:'桥肩，不必全部填满。',copy:'在主拱两端的桥肩，各有两孔小拱。让四孔逐一成形，再沿桥侧掠过孔口：敞开的桥肩，让桥体结构与河道空间彼此可见。',metrics:[['3.81','m','靠桥堍两孔 · 净跨'],['2.85','m','近桥中两孔 · 跨度']],source:'孔数与跨度据赵县人民政府；ASCE说明敞肩在洪水时可提供部分过水空间。小拱高度和位置含示意。',next:'跟随传力路径 →',duration:15},
    {name:'传力',index:'第六章 · 从桥面到两岸',title:'人走在上面，力去往哪里？',copy:'补上拱上结构、桥面和栏杆。桥面荷载经小拱传到主拱，再由主拱传向两端支承。循着朱色路径，向下看懂桥面与拱之间的联系。',metrics:[['桥面 → 小拱','','上部荷载向下传递'],['主拱 → 两端','','沿拱走向支承']],source:'小拱将桥面荷载传给主拱，参照ASCE。箭线为路径示意，透明观察不表示应力大小或实际分配比例。',next:'穿入拱腹 →',duration:17},
    {name:'穿行',index:'第七章 · 横向穿行',title:'一孔大拱，二十八道券。',copy:'从桥侧看，主拱是一道弧；沿桥宽看，它由28道券并列。暂时移开上部结构、拉开券道间距，镜头从拱腹下方穿行，看清一道券怎样重复成整体。',metrics:[['28','道','沿桥宽并列的主拱券'],['9','m','桥面宽 · 拱脚附近9.6 m']],source:'券道数和桥宽据赵县人民政府。分解间距被放大；逐石拼缝与连接细节不作测绘复原。',next:'回看完整桥梁 →',duration:17},
    {name:'整桥',index:'第八章 · 合而为桥',title:'再看整桥，每一块都有缘由。',copy:'地图让我们找到河流；主拱跨过河道，小拱在桥肩留空，28道券沿宽度并排。回到完整桥形，把每一块的位置、作用和联系重新看在一起。',metrics:[['单孔敞肩','','圆弧石拱桥'],['隋','','开皇后期至大业初年']],source:'结构与年代据赵县人民政府；结构作用参照ASCE。可自由旋转、剖切，或重新选择章节观察。',next:'从地图重新启程 ↺',duration:12}
  ];
  const state={chapter:0,p:0,running:false,continuous:false,free:false,reduce:reduceQuery.matches,type:'beam',conceptManual:false,water:0,spread:.45,cut:0,notes:true,wash:true,auto:false};
  const ribAmount=p=>p<=.10?0:p<.32?clamp((p-.10)/.22):1+27*clamp((p-.32)/.62);
  const ribMoment=n=>n===0?0:n===28?1:.32+(n-1)/27*.62;
  const completedRibs=()=>state.chapter<3?0:state.chapter>3?28:Math.max(0,Math.floor(ribAmount(state.p)+1e-6));
  let viewer=null,dirty=true,visited=new Set([0]),lastFrame=performance.now(),uiKey='',mapWashClock=0,mapLastKey='',mapRegionKey='',grainSize='',openingCopyKey='';
  const mc=$('mapCanvas'),mctx=mc.getContext('2d'),stage=$('stage');
  const grain=$('grain'),gctx=grain?.getContext('2d');
  const paths={provinces:mapData.provinces.map(f=>({...f,path:new Path2D(f.d)})),cities:mapData.cities.map(f=>({...f,path:new Path2D(f.d)})),city:new Path2D(mapData.city),county:new Path2D(mapData.county)};
  const project=([lon,lat])=>[40+(lon-73)*Math.cos(35*Math.PI/180)*7.4,40+(Math.log(Math.tan(Math.PI/4+54*Math.PI/360))-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360)))*180/Math.PI*7.4];
  const bridgePoint=project(mapData.bridge);
  const pigment=document.createElement('canvas');pigment.width=220;pigment.height=150;
  const pigmentCtx=pigment.getContext('2d'),noise=new Float32Array(220*150),rgb=h=>{const n=parseInt(h.trim().slice(1),16);return[n>>16,(n>>8)&255,n&255];};
  const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
  function vn(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy);return(hash(ix,iy)*(1-fx)+hash(ix+1,iy)*fx)*(1-fy)+(hash(ix,iy+1)*(1-fx)+hash(ix+1,iy+1)*fx)*fy;}
  for(let y=0;y<150;y++)for(let x=0;x<220;x++)noise[y*220+x]=vn(x*.071,y*.071)*.7+vn(x*.43,y*.43)*.3;
  let css=null;
  function readTheme(){const c=getComputedStyle(document.documentElement);css={paper:c.getPropertyValue('--paper').trim(),ink:c.getPropertyValue('--ink').trim(),red:c.getPropertyValue('--red').trim(),qing:c.getPropertyValue('--qing').trim(),muted:c.getPropertyValue('--muted').trim()};dirty=true;mapLastKey='';viewer?.theme();drawGrain();}
  function colorRGB(value){
    if(value.trim().startsWith('#')){const h=value.trim().slice(1),s=h.length===3?h.split('').map(x=>x+x).join(''):h;return[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];}
    const m=value.match(/\d+(?:\.\d+)?/g);
    if(m&&m.length>=3)return m.slice(0,3).map(Number);
    const h=value.trim().replace('#','');if(!/^[0-9a-f]{3,8}$/i.test(h))return[50,56,58];
    const s=h.length===3?h.split('').map(x=>x+x).join(''):h;return[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];
  }
  function drawGrain(){
    if(!gctx||!grain)return;
    const w=Math.max(320,Math.min(920,Math.round(innerWidth*.72))),h=Math.max(220,Math.min(620,Math.round(innerHeight*.72))),key=`${w}x${h}|${css?.ink}|${css?.paper}`;
    if(key===grainSize)return;grainSize=key;grain.width=w;grain.height=h;
    const [r,g,b]=colorRGB(css?.ink||'#32383a');gctx.clearRect(0,0,w,h);gctx.fillStyle=css?.paper||'#f2ede0';gctx.fillRect(0,0,w,h);
    const image=gctx.createImageData(w,h),seed=(x,y)=>{const n=Math.sin(x*127.1+y*311.7+19.7)*43758.5453;return n-Math.floor(n);};
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const n=seed(x*.71,y*.71)*.65+seed(x*.09,y*.13)*.35,i=(y*w+x)*4,a=Math.round(12+n*65);image.data[i]=r;image.data[i+1]=g;image.data[i+2]=b;image.data[i+3]=a;}
    gctx.putImageData(image,0,0);gctx.save();gctx.strokeStyle=`rgba(${r},${g},${b},.13)`;gctx.lineWidth=.55;
    for(let i=0;i<Math.round(w*h/5200);i++){const x=seed(i,3)*w,y=seed(i,9)*h,len=3+seed(i,17)*12,sl=(seed(i,21)-.5)*2;gctx.beginPath();gctx.moveTo(x,y);gctx.lineTo(x+len,y+sl);gctx.stroke();}
    gctx.restore();
  }
  function openingAt(p=state.p){if(state.reduce)return{hero:p<.2?1:0,map:p>=.2&&p<.8?1:0,river:p>=.8?1:0,location:clamp((p-.20)/.54)};return{hero:1-smooth((p-.12)/.10),map:smooth((p-.12)/.10)*(1-smooth((p-.76)/.14)),river:smooth((p-.76)/.14),location:clamp((p-.20)/.54)};}
  function mapView(){const r=stage.getBoundingClientRect(),aspect=r.width/r.height;const views=[[228,265,Math.max(430,465*aspect)],[305,200,Math.max(51,72*aspect)],[291.3,211.2,Math.max(15,16*aspect)],[293.6,214.5,Math.max(4.2,4.2*aspect)]];const q=openingAt().location*3,i=Math.min(2,Math.floor(q)),t=smooth(q-i),a=views[i],b=views[i+1];return{cx:a[0]+(b[0]-a[0])*t,cy:a[1]+(b[1]-a[1])*t,width:Math.exp(Math.log(a[2])*(1-t)+Math.log(b[2])*t),level:Math.round(q),q};}
  function drawMap(now){
    if(state.chapter!==0)return;
    const r=stage.getBoundingClientRect(),w=r.width,h=r.height,dpr=Math.min(devicePixelRatio||1,1.75);
    if(mc.width!==Math.round(w*dpr)||mc.height!==Math.round(h*dpr)){mc.width=Math.round(w*dpr);mc.height=Math.round(h*dpr);mapLastKey='';}
    const {cx,cy,width,level,q}=mapView(),scale=w/width,tx=w*.5-cx*scale,ty=h*.5-cy*scale;
    const region=q>2.3?'county':q>1.35?'city':'province';if(region!==mapRegionKey){mapRegionKey=region;mapWashClock=0;}
    const wash=state.reduce?1:clamp(.33+mapWashClock/2.8),key=[w,h,state.p.toFixed(4),wash.toFixed(3),state.wash].join('|');if(key===mapLastKey)return;mapLastKey=key;
    mctx.setTransform(dpr,0,0,dpr,0,0);mctx.fillStyle=css.paper;mctx.fillRect(0,0,w,h);
    mctx.save();mctx.translate(tx,ty);mctx.scale(scale,scale);mctx.lineWidth=.7/scale;
    for(const f of paths.provinces){mctx.globalAlpha=.035;mctx.fillStyle=css.ink;mctx.strokeStyle=css.ink;mctx.fill(f.path,'evenodd');mctx.globalAlpha=.35;mctx.stroke(f.path);}
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
    const label=q<.7?'河北 · 赵州桥':q<2.2?'赵县 · 赵州桥':'赵州桥 · 洨河';
    mctx.font='12px "Songti SC","SimSun",serif';const lx=clamp(x+22,9,w-150),ly=clamp(y-17,90,h-90);
    mctx.strokeStyle=css.red;mctx.beginPath();mctx.moveTo(x+8,y-3);mctx.lineTo(lx-4,ly+5);mctx.stroke();mctx.fillStyle=css.paper;mctx.fillRect(lx-4,ly-10,142,20);mctx.fillStyle=css.red;mctx.fillText(label,lx,ly+4);
    mctx.font='10px "Songti SC","SimSun",serif';mctx.fillStyle=css.muted;
    const crumbs=['中国','河北','石家庄','赵县'];let bx=12;for(let i=0;i<4;i++){mctx.globalAlpha=i<=level?1:.4;mctx.fillStyle=i===level?css.red:css.muted;mctx.fillText(crumbs[i],bx,58);bx+=mctx.measureText(crumbs[i]).width+19;if(i<3){mctx.fillStyle=css.muted;mctx.fillText('›',bx-12,58);}}
    mctx.globalAlpha=.55;mctx.strokeStyle=css.ink;mctx.beginPath();mctx.moveTo(w-29,80);mctx.lineTo(w-29,105);mctx.moveTo(w-33,86);mctx.lineTo(w-29,80);mctx.lineTo(w-25,86);mctx.stroke();mctx.font='9px Georgia,serif';mctx.fillStyle=css.ink;mctx.fillText('N',w-32,72);mctx.globalAlpha=1;
  }
  function setMetrics(items){$('lessonMetrics').replaceChildren(...items.map(([value,unit,label])=>{const div=document.createElement('div'),strong=document.createElement('strong'),i=document.createElement('i'),span=document.createElement('span');strong.textContent=value;if(value.length>6)strong.style.fontSize='17px';i.textContent=unit;strong.append(i);span.textContent=label;div.append(strong,span);return div;}));}
  function syncConceptLabels(){const wrap=$('conceptLabels');if(!wrap)return;wrap.hidden=state.chapter!==2;for(const b of wrap.querySelectorAll('[data-concept]'))b.setAttribute('aria-pressed',String(b.dataset.concept===state.type));}
  function syncConceptCopy(){
    const data=state.type==='beam'?['梁，可以直接跨过。','先看两岸的支承。梁从一端搭到另一端，靠弯曲承受桥面荷载。长跨梁怎样选材料、做多厚，还需要具体设计；这张概念图不判断其可行性。',[['两岸','','梁的支承位置'],['弯曲','','梁承受荷载的方式']]]:state.type==='multi'?['把大跨，分成几段小跨。','在河中加入桥墩，每个拱只需跨过较小的一段。沿朱线观察：荷载顺着各段拱弧，传到桥墩和两岸。河中的支承也占用了河道空间。',[['河中支点','','把跨度分成几段'],['沿拱传递','','传向桥墩与两岸']]]:['一个大孔，把荷载交给两岸。','单孔拱让河中保持一个开敞的大孔，沿拱把荷载传向两端。这里以赵州桥的净跨37.02米、拱矢7.23米描出主拱，接着把它拆成一道道券。',[['37.02','m','赵州桥主拱净跨'],['7.23','m','赵州桥主拱拱矢']]];
    $('lessonTitle').textContent=data[0];$('lessonCopy').textContent=data[1];setMetrics(data[2]);
  }
  function selectConcept(key){state.running=false;state.continuous=false;state.free=false;state.conceptManual=true;state.type=key;viewer?.chooseConcept();syncConceptLabels();updateChapter();dirty=true;}
  function rangeActivity(id,label,min,max,value,unit,onInput){const row=document.createElement('div'),labelEl=document.createElement('label'),wrap=document.createElement('div'),input=document.createElement('input'),out=document.createElement('output');labelEl.htmlFor=id;labelEl.textContent=label;wrap.className='range-row';input.id=id;input.type='range';input.min=min;input.max=max;input.step='1';input.value=value;out.htmlFor=id;out.textContent=value+unit;input.style.setProperty('--p',(value-min)/(max-min));input.oninput=()=>{const n=+input.value;out.textContent=n+unit;input.style.setProperty('--p',(n-min)/(max-min));onInput(n);dirty=true;};wrap.append(input,out);row.append(labelEl,wrap);return row;}
  function choices(items,selected,cb){const wrap=document.createElement('div');wrap.className='choices';for(const [key,text]of items){const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.choice=key;b.setAttribute('aria-pressed',String(key===selected));b.onclick=()=>{for(const child of wrap.children)child.setAttribute('aria-pressed',String(child===b));cb(key);dirty=true;};wrap.append(b);}return wrap;}
  function renderActivity(){const a=$('activity');a.replaceChildren();switch(state.chapter){
    case 0:a.append(choices([['0','中国'],['1','河北'],['2','石家庄'],['3','赵县']],String(Math.round(openingAt().location*3)),key=>scrub(.22+ +key*.175)));break;
    case 1:a.append(rangeActivity('waterLevel','抬高水位，观察跨越空间（示意）',0,100,state.water,state.water?'%':'%',n=>{takeControl(false);state.water=n;}));break;
    case 2:a.append(choices([['beam','梁'],['multi','多孔拱'],['single','单孔拱']],state.type,selectConcept));break;
    case 3:a.append(rangeActivity('ribCount','沿桥宽，逐道添入主拱券',0,28,completedRibs(),' 道',n=>scrub(ribMoment(n))));break;
    case 4:a.append(rangeActivity('smallCount','四个小拱，逐孔显现',0,4,Math.floor(state.p*4+1e-6),' 孔',n=>scrub(n/4)));break;
    case 5:a.append(choices([['path','看传力路径'],['still','停下观察']],state.free?'still':'path',key=>{if(key==='path'){scrub(.82);}else takeControl();}));break;
    case 6:a.append(rangeActivity('ribSpread','拉开券道间距（放大示意）',0,100,Math.round(state.spread*100),'%',n=>{takeControl(false);state.spread=n/100;}));break;
    case 7:a.append(choices([['whole','整桥'],['section','剖切']],state.cut?'section':'whole',key=>{takeControl();setCut(key==='section'?100:0);}));break;
  }}
  function syncUI(){
    const c=chapters[state.chapter],key=state.chapter+'|'+state.type+'|'+state.running+'|'+state.free+'|'+state.p.toFixed(3);
    if(key===uiKey)return;uiKey=key;
    const progress=Math.round(state.p*100);$('prog').value=Math.round(state.p*1000);$('prog').style.setProperty('--p',state.p);$('prog').setAttribute('aria-valuetext',`${c.name}，本段${progress}%`);$('rdProg').textContent=progress+'%';
    $('bPlay').textContent=state.running?'Ⅱ 暂停导览':state.chapter===0&&state.p===0?'▶ 开始导览':state.chapter===7&&state.p===1?'↺ 再看一遍':'▶ 继续导览';$('bPlay').setAttribute('aria-pressed',String(state.running));$('bPrev').disabled=state.chapter===0;
    $('sceneMode').textContent=state.free?'自由观察':state.running?(state.continuous?'连续导览':'重看本段'):state.chapter===7&&state.p===1?'自由观察':'已暂停';
    for(const b of document.querySelectorAll('[data-chapter]')){const i=+b.dataset.chapter;b.toggleAttribute('aria-current',i===state.chapter);if(i===state.chapter)b.setAttribute('aria-current','step');b.style.setProperty('--chapter-p',i===state.chapter?state.p:visited.has(i)?1:0);}
    if(state.chapter===0){for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(+b.dataset.choice===Math.round(openingAt().location*3)));syncOpeningCopy();}
    if(state.chapter===2){syncConceptLabels();for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(b.dataset.choice===state.type));}
    if(state.chapter===3||state.chapter===4){const input=$(state.chapter===3?'ribCount':'smallCount');if(input){const n=state.chapter===3?completedRibs():Math.floor(state.p*4+1e-6);input.value=n;input.style.setProperty('--p',state.chapter===3?n/28:state.p);input.nextElementSibling.textContent=n+(state.chapter===3?' 道':' 孔');}}
  }
  function syncOpeningCopy(){
    const key=state.p<.2?'hero':state.p<.8?'map':'river';
    if(key===openingCopyKey)return;openingCopyKey=key;
    const data=key==='hero'?{title:'一座石桥，为什么长成这样？',copy:'一孔大拱越过河道，四孔小拱留在桥肩。为什么这样搭？先记住这座桥的形状，再回到它所在的地方。',metrics:[['一孔','','主拱跨过河道'],['四孔','','小拱留在桥肩']],source:'桥形据赵县人民政府；模型用于结构教学。'}:key==='map'?{title:'先找到它所在的地方。',copy:'从中国到河北，再到石家庄的赵县。朱色点标出桥址，石青沿行政区轮廓洇开：赵州桥，就在洨河上。',metrics:[['赵县','','河北省 · 石家庄市'],['洨河','','赵州桥所跨河流']],source:'地点据赵县人民政府；现代行政区轮廓用于定位，不表示隋代边界。'}:{title:'河在中间，路该怎样接上？',copy:'地图收起，视线落到两岸之间。先让桥暂时退场，看看要跨过的空间，再比较梁与拱怎样把两岸接起来。',metrics:[['连接','','两岸连续通行'],['跨越','','保留桥下空间']],source:'河岸、水位和高程为教学示意，不表示隋代地貌或实测河宽。'};
    $('lessonTitle').textContent=data.title;$('lessonCopy').textContent=data.copy;$('lessonSource').textContent=data.source;setMetrics(data.metrics);
  }
  function syncOpeningLayers(){const intro=state.chapter===0;stage.classList.toggle('map-mode',intro);stage.classList.toggle('intro-dynamic',intro);if(intro){const o=openingAt();stage.style.setProperty('--map-alpha',o.map.toFixed(4));stage.style.setProperty('--gl-alpha',Math.max(o.hero,o.river).toFixed(4));}else{stage.style.removeProperty('--map-alpha');stage.style.removeProperty('--gl-alpha');openingCopyKey='';}}
  function updateChapter(){const c=chapters[state.chapter];openingCopyKey='';$('chapterCount').textContent=String(state.chapter+1).padStart(2,'0')+' / 08';$('lessonIndex').textContent=c.index;$('lessonTitle').textContent=c.title;$('lessonCopy').textContent=c.copy;$('lessonSource').textContent=c.source;$('bNext').textContent=c.next;setMetrics(c.metrics);syncOpeningLayers();syncConceptLabels();$('sceneId').textContent=String(state.chapter+1).padStart(2,'0')+' / '+c.name+' · '+(state.chapter===0?'现代位置图':'结构教学模型');$('viewTip').textContent=state.chapter===0?'开场：整桥 → 地图 → 洨河河岸；位置图使用现代行政区轮廓。':'拖动即接管镜头 · 滚轮 / 双指缩放 · 方向键旋转';renderActivity();if(state.chapter===2)syncConceptCopy();uiKey='';dirty=true;syncUI();}
  function enter(chapter,p=0,run=false,chain=false){state.chapter=clamp(chapter,0,7);state.p=clamp(p);state.running=run;state.continuous=chain;state.free=false;state.auto=false;state.cut=0;if(state.chapter===2){state.type='beam';state.conceptManual=false;}visited.add(state.chapter);mapWashClock=0;mapLastKey='';viewer?.beginTransition();viewer?.stopOrbit();setCut(0);updateChapter();}
  function scrub(p){state.running=false;state.continuous=false;state.free=false;state.p=clamp(p);if(state.chapter===0){mapWashClock=0;mapLastKey='';}if(state.chapter===2){state.conceptManual=false;state.type=state.p<.25?'beam':state.p<.5?'multi':'single';syncConceptLabels();}viewer?.cancelTransition();dirty=true;uiKey='';syncUI();}
  function takeControl(free=true){state.running=false;state.continuous=false;state.free=free;viewer?.cancelTransition();if(free)viewer?.adoptCamera();dirty=true;uiKey='';syncUI();}
  function setCut(n){state.cut=clamp(n,0,100);$('cut').value=state.cut;$('cut').style.setProperty('--p',state.cut/100);$('rdCut').textContent=state.cut?'切入 '+Math.round(state.cut)+'%':'未剖切';if(state.chapter===7)for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(b.dataset.choice===(state.cut?'section':'whole')));dirty=true;}
  $('bSources').onclick=()=>{takeControl(false);$('sourcesDialog').showModal();};$('bCloseSources').onclick=()=>$('sourcesDialog').close();
  document.querySelectorAll('#conceptLabels [data-concept]').forEach(b=>b.onclick=()=>selectConcept(b.dataset.concept));
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
  readTheme();drawGrain();updateChapter();
  addEventListener('resize',()=>{grainSize='';drawGrain();});

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
    function concept(type){
      resetBuild();const width=7.5,n=type==='multi'?3:1,span=37.02/n,half=span/2,rise=type==='multi'?4.5:7.23,R=(half*half+rise*rise)/(2*rise),cy=(type==='multi'?2.5:0)+rise-R,theta=Math.asin(half/R);
      PART='concept-supports';PAINT=QINGSHI3;
      for(const x of [-19.6,19.6])box('stone',x,1.5,0,2.1,11,width,true,-.4);
      if(type==='multi')for(const x of [-18.51+span,-18.51+2*span])box('stone',x,-1,0,1.5,7,width,true,-.2);
      if(type==='beam'){
        PART='concept-body';PAINT=QINGSHI2;box('stone',0,7.7,0,39,1.5,width,true,.2);
      }else{
        PART='concept-arches';
        for(let i=0;i<n;i++){
          const cx=-18.51+half+i*span,nj=36;
          for(let j=0;j<nj;j++){
            const a0=-theta+j/nj*theta*2,a1=-theta+(j+1)/nj*theta*2;
            PAINT=(i+j)%3?QINGSHI:QINGSHI2;
            archStone(cx,cy,R,.85,a0,a1,-1,1,()=>width/2,-.1+(1-Math.abs((j+.5)/nj*2-1))*.18);
          }
        }
        PART='concept-deck';PAINT=QINGSHI2;box('deck',0,8.2,0,39,.5,width,true,.1);
      }
      // Cinnabar strokes show qualitative routes, never force magnitude.
      PART='concept-path';const z=width/2+.14;
      for(const x of (type==='multi'?[-19.6,-18.51+span,-18.51+2*span,19.6]:[-19.6,19.6])){
        const ring=[];for(let j=0;j<=24;j++)ring.push(V(x+1.8*Math.cos(j/24*Math.PI*2),-3.9,z+1.1*Math.sin(j/24*Math.PI*2)));lines('red',ring,true,0);
      }
      if(type==='beam')for(const side of [-1,1]){
        lines('red',[V(0,10,z),V(0,7.7,z),V(side*19.6,7.7,z),V(side*19.6,-3.7,z)],false,.1);
        lines('red',[V(side*19.6-1,-2.2,z),V(side*19.6,-3.7,z),V(side*19.6+1,-2.2,z)],false,.3);
      }else for(let i=0;i<n;i++)for(const side of [-1,1]){
        const cx=-18.51+half+i*span,p=[];
        p.push(V(cx,9.8,z));for(let j=0;j<=24;j++){const a=side*theta*j/24;p.push(V(cx+(R+.28)*Math.sin(a),cy+(R+.28)*Math.cos(a),z));}
        const end=p[p.length-1];p.push(V(end.x,-3.7,z));lines('red',p,false,.1);lines('red',[V(end.x-1,-2.2,z),V(end.x,-3.7,z),V(end.x+1,-2.2,z)],false,.3);
      }
      const c=finalize();for(const obj of c.parts['concept-path'].meshes){obj.material.uniforms.uIsGrow.value=0;obj.material.depthTest=false;}
      scene.add(c.group);c.group.visible=false;return c;
    }
    const concepts={beam:concept('beam'),multi:concept('multi'),single:concept('single')};
    const conceptOffset={beam:-22,multi:0,single:22};
    for(const [type,c] of Object.entries(concepts)){c.group.scale.setScalar(.42);c.group.position.x=conceptOffset[type];}
    const flowGroup=new THREE.Group();scene.add(flowGroup);
    const flowMaterial=new THREE.LineBasicMaterial({color:css.red,transparent:true,opacity:.75,depthTest:false}),flowCurves=[];
    for(const side of [-1,1]){
      const points=[V(side*10.6,8.8,side*5.1),V(side*10.6,7.9,side*5.1),V(side*12,6.7,side*5.1)];
      for(let j=0;j<=24;j++){const x=12+(18.51-12)*j/24;points.push(V(side*x,g.eTop(x)+.12,side*5.1));}points.push(V(side*21,-.7,side*5.1));
      const curve=new THREE.CatmullRomCurve3(points,false,'centripetal');flowCurves.push(curve);const geom=new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));const line=new THREE.Line(geom,flowMaterial);line.renderOrder=25;flowGroup.add(line);
    }
    const arrows=[];for(let i=0;i<6;i++){const a=new THREE.ArrowHelper(V(0,-1,0),V(0,0,0),1.25,css.red,.5,.24);a.traverse(c=>{if(c.material){c.material.depthTest=false;c.material.transparent=true;c.material.opacity=.9;}});flowGroup.add(a);arrows.push(a);}
    let W=1,H=1,target=V(0,3,0),orbit={th:.2,ph:1.3,dist:75},transition=null,washTime=1,lastBoil=-1,conceptBeat=1,selectedType='',pointerMode=false;
    const curve=pts=>new THREE.CatmullRomCurve3(pts.map(p=>V(...p)),false,'centripetal');
    const cameraPaths=[
      [[[12,20,86],[4,15,73],[0,-1,38]],[[0,3.5,0],[0,3,0],[0,-2,0]]],
      [[[0,6,68],[4,3.5,52],[16,7,47],[26,13,58]],[[0,-.8,0],[0,-.8,0],[0,2,0],[0,3,0]]],
      [[[0,15,92],[0,14,80],[0,11,68],[0,9,64]],[[0,3,0],[0,3,0],[0,3,0],[0,3,0]]],
      [[[-4,11,68],[-6,10,55],[0,16,59],[20,22,70],[3,24,76]],[[0,3,0],[-3,3,4.5],[0,4,2],[0,4,0],[0,3,0]]],
      // Skim the shoulder openings from outside, keeping their relation to the main arch visible.
      [[[29,18,68],[24,14,42],[18,10,29],[10,9,25],[2,9,29],[-9,13,40],[-19,17,55],[-28,19,70]],[[0,4,0],[14,6,0],[15.9,5,0],[10.6,6.5,0],[10.6,6,0],[0,4,0],[0,4,0],[0,4,0]]],
      // Follow the load path from outside the side elevation so the arch and its annotations stay visible.
      [[[29,23,68],[16,17,52],[10.6,14,45],[14,13,46],[20,11,55],[28,15,78]],[[0,5,0],[10.6,8.8,5.1],[12,6.7,5.1],[15,3.5,5.1],[18.5,1.5,5.1],[0,3,0]]],
      // Offset the passage from the optical axis so the underside stays visible without an abrupt turn.
      [[[25,18,59],[8,8.4,16],[6,5,6],[6,5,-6],[29,19,-58]],[[0,4,0],[2,6.4,0],[0,6.4,0],[0,6.4,0],[0,4,0]]],
      [[[29,19,-58],[33,22,56],[20,21,79],[12,22,87]],[[0,4,0],[0,4,0],[0,4,0],[0,4,0]]]
    ].map(([pos,aim])=>({pos:curve(pos),aim:curve(aim)}));
    function conceptMorph(){
      if(state.chapter!==2)return 0;
      // Autoplay uses the chapter timeline; a manual click gets the same camera
      // hand-off through conceptBeat, for all three selectable bridge types.
      return state.conceptManual?conceptBeat:smooth((state.p-.78)/.20);
    }
    function pose(){
      const c=state.chapter,p=state.reduce?(c===0?(state.p<.2?0:1):1):smooth(state.p),path=cameraPaths[c];
      let pos=path.pos.getPoint(p),aim=path.aim.getPoint(p);
      if(c===0){
        if(state.p<.22){const t=state.reduce?0:smooth(state.p/.22);pos=V(12,20,86).lerp(V(4,15,73),t);aim=V(0,3.5,0).lerp(V(0,3,0),t);}
        else{const t=state.reduce?1:smooth((state.p-.76)/.24);pos=V(12,18,72).lerp(V(0,6,68),t);aim=V(0,1,0).lerp(V(0,-.8,0),t);}
      }
      if(c===2){const m=conceptMorph();pos.z+=14*(1-m);aim.y=2+2*m;}
      // Maintain a readable full span on narrow screens; shoulder/passage shots keep their close framing.
      if(c===0||c===1||c===2||c===3||c===7){
        const width=c===2?72-18*conceptMorph():c===3?51:60;
        const minimum=width/(2*Math.tan(camera.fov*Math.PI/360)*camera.aspect),delta=pos.clone().sub(aim);
        if(delta.length()<minimum)pos=aim.clone().add(delta.setLength(minimum));
      }
      return{pos,aim};
    }
    function adoptCamera(){const delta=camera.position.clone().sub(target);orbit={dist:delta.length(),ph:Math.acos(clamp(delta.y/delta.length(),-1,1)),th:Math.atan2(delta.x,delta.z)};transition=null;}
    function resize(){const r=stage.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);renderer.setSize(W,H,false);ov.width=Math.round(W*DPR);ov.height=Math.round(H*DPR);camera.aspect=W/H;camera.fov=clamp(36+Math.max(0,1.28-W/H)*27,36,58);camera.updateProjectionMatrix();dirty=true;}
    function reveal(name,p=1,opacity=1){const part=model.parts[name];if(!part)return;part.node.visible=p>0&&opacity>.002;part.uniforms.progress.value=clamp(p);part.uniforms.opacity.value=opacity;part.uniforms.wash.value=smooth((p-.72)/.28);for(const obj of part.meshes){const transparent=!obj.isMesh||opacity<.999;if(obj.material.transparent!==transparent){obj.material.transparent=transparent;obj.material.needsUpdate=true;}obj.material.depthWrite=obj.isMesh&&!transparent;}}
    function setModel(){
      const c=state.chapter,p=state.p,opening=c===0?openingAt():null,introHero=!!opening?.hero,introRiver=!!opening?.river;
      model.group.visible=c>0||introHero||introRiver;
      for(const part of Object.values(model.parts)){part.node.visible=false;part.uniforms.progress.value=0;}
      if(c>0||introRiver){reveal('terrain',1,c===2?0:1);reveal('water',1,c===2?0:.62);reveal('abutments',c===3?clamp(p/.10):c>3?1:0);}
      for(let i=0;i<28;i++){const part=model.parts['rib-'+i];if(!part)continue;const n=c===3?clamp(ribAmount(p)-i):c>3?1:0;reveal('rib-'+i,n);part.node.position.z=c===6?(13.5-i)*state.spread*.24:0;}
      if(c>=4)for(let i=0;i<4;i++)reveal('small-'+i,c===4?clamp(p*4-i):1);
      if(c===5){reveal('fill',clamp(p*4),p>.27&&p<.83?.25:1);reveal('cover',clamp((p-.08)*4),p>.27&&p<.83?.25:1);reveal('deck',clamp((p-.23)*4),p>.27&&p<.83?.32:1);reveal('railing',clamp((p-.42)*4),p>.27&&p<.83?.38:1);reveal('arch-detail',clamp((p-.5)*3));}
      if(c===6){for(const name of ['terrain','water','abutments','small-0','small-1','small-2','small-3'])reveal(name,name==='terrain'||name==='water'?1:0,name==='terrain'||name==='water'?.22:1);}
      if(c===7)for(const name of ['fill','cover','deck','railing','arch-detail'])reveal(name,1);
      if(c===3)reveal('guides',clamp(p/.1),.6-.4*smooth((p-.35)/.6));
      if(c===4)reveal('guides',1,.17);
      if(c>=5)reveal('guides',1,.1);
      if(introHero){for(const name of Object.keys(model.parts))reveal(name,1);reveal('guides',0);}
      for(const [type,concept]of Object.entries(concepts)){
        const ghost=c===3&&p<.10&&type==='single',selected=type===state.type;
        concept.group.visible=c===2||ghost;
        const morph=ghost?1:conceptMorph();concept.group.scale.setScalar((selected||ghost)?.42+.58*morph:.42);concept.group.position.x=conceptOffset[type]*(1-morph);
        concept.group.renderOrder=selected?8:4;
        const build=selected?(state.conceptManual?conceptBeat:clamp(type==='beam'?p/.25:type==='multi'?(p-.25)/.25:(p-.5)/.28)):1;
        for(const [name,part] of Object.entries(concept.parts)){
          part.uniforms.progress.value=ghost?1:name==='concept-supports'?clamp(build/.18):name==='concept-arches'?clamp((build-.1)/.5):name==='concept-path'?clamp((build-.6)/.4):clamp((build-.3)/.35);
          part.uniforms.opacity.value=ghost?(name==='concept-arches'?.18*(1-p/.1):0):name==='concept-path'?(selected?.9:0):selected?1:.22*(1-morph);
          part.uniforms.wash.value=smooth((build-.45)/.55);
          for(const obj of part.meshes){obj.renderOrder=selected?8:4;obj.material.depthWrite=obj.isMesh&&selected;obj.material.transparent=true;if(!obj.isMesh&&name!=='concept-path')obj.material.uniforms.uInk=selected?U.red:U.ink;}
        }
      }
      flowGroup.visible=c===5&&p>.35;
      clip.constant=state.cut?6.2-state.cut/100*6.2:140;
      const waterPart=model.parts.water;if(waterPart)waterPart.node.position.y=(c===1?state.water:0)/100*10;
      if(c===6&&state.running&&!state.free){state.spread=.2+.65*Math.sin(Math.PI*p);const input=$('ribSpread');if(input){input.value=Math.round(state.spread*100);input.style.setProperty('--p',state.spread);input.nextElementSibling.textContent=Math.round(state.spread*100)+'%';}}
      let caption='';
      if(c===0){caption=p<.12?'一孔大拱，四孔小拱。为什么这样搭？':p<.22?'先记住桥形，再回到它所在的地方。':p<.35?'中国 → 河北':p<.57?'河北 · 石家庄':p<.80?'石家庄 · 赵县 · 洨河桥址':'河在中间，路该怎样接上？';$('sceneId').textContent='01 / 地理 · '+(p<.2?'桥形初见':p<.8?'现代位置图':'河岸空间示意');}
      if(c===1)caption='先看两岸，再看跨越。河岸与水位为示意。';
      if(c===2)caption=state.type==='beam'?'梁：直接跨越，以弯曲承受荷载。':state.type==='multi'?'多孔拱：河中增加支点，把大跨分小。':conceptMorph()>.3?'回到赵州桥 · 净跨 37.02 m，拱矢 7.23 m':'单孔拱：河中不立墩，沿拱传向两岸。';
      if(c===3)caption=p<.1?'桥台与朱笔定弧 · 组装示意':p<.32?'先看一道券：券石逐块合拢 · 组装示意':`已合拢 ${completedRibs()} / 28 道 · 沿桥宽并列`;
      if(c===4)caption=`敞肩小拱 ${Math.floor(p*4+1e-6)} / 4 孔 · 每侧两孔`;
      if(c===5)caption=p>.27&&p<.83?'透视观察 · 朱线表示荷载传递路径':'桥面 → 小拱 → 主拱 → 两端支承';
      if(c===6)caption='沿桥宽穿行 · 券道展开间距为放大示意';
      if(c===7)caption=state.p===1?'主拱跨河，桥肩留空，二十八道券合而成桥。':'恢复完整桥形，回到两岸之间。';
      if($('stageCaption').textContent!==caption)$('stageCaption').textContent=caption;
    }
    function drawDeco(){
      if(state.chapter!==3)return;
      const phase=state.p<.10?0:state.p<.32?1:2,words=['桥台 · 定弧','券石合拢','二十八道并列'];
      octx.font='9px "Songti SC","SimSun",serif';octx.textBaseline='middle';
      for(let i=0;i<3;i++){const x=13+i*89;octx.globalAlpha=i===phase?.85:.28;octx.strokeStyle=i===phase?css.red:css.ink;octx.fillStyle=i===phase?css.red:css.ink;octx.beginPath();octx.moveTo(x,54);octx.lineTo(x+68,54);octx.moveTo(x,51);octx.lineTo(x,57);octx.stroke();octx.fillText(words[i],x,67);}
      octx.globalAlpha=1;
      if(W>500){
        octx.save();octx.globalAlpha=.22;octx.strokeStyle=css.red;octx.lineWidth=.65;
        const x=W-48,y=69;octx.beginPath();octx.arc(x,y,19,-Math.PI*.85,Math.PI*.22);octx.moveTo(x-5,y);octx.lineTo(x+5,y);octx.moveTo(x,y-5);octx.lineTo(x,y+5);octx.stroke();octx.restore();
      }
      if(state.p<.32||!state.notes)return;
      const dimension=(a,b,text,offset)=>{
        a=a.project(camera);b=b.project(camera);
        if([a,b].some(q=>q.z>1||Math.abs(q.x)>.94||Math.abs(q.y)>.66))return;
        const ax=(a.x*.5+.5)*W,ay=(-a.y*.5+.5)*H,bx=(b.x*.5+.5)*W,by=(-b.y*.5+.5)*H;
        octx.save();octx.globalAlpha=.65;octx.strokeStyle=css.red;octx.lineWidth=.7;octx.beginPath();octx.moveTo(ax,ay);octx.lineTo(bx,by);
        for(const [x,y] of [[ax,ay],[bx,by]]){octx.moveTo(x-3,y-4);octx.lineTo(x+3,y+4);}octx.stroke();octx.globalAlpha=1;
        const tw=octx.measureText(text).width,x=clamp((ax+bx)/2+offset-tw/2,8,W-tw-8),y=clamp((ay+by)/2+(offset?0:14),86,H-100);
        octx.fillStyle=css.paper;octx.fillRect(x-4,y-8,tw+8,16);octx.fillStyle=css.red;octx.fillText(text,x,y);octx.restore();
      };
      dimension(V(-g.SPAN/2,-1.2,5.6),V(g.SPAN/2,-1.2,5.6),'净跨 37.02 m',0);
      dimension(V(0,0,5.6),V(0,g.RISE,5.6),'拱矢 7.23 m',W<420?44:53);
    }
    function overlay(){
      octx.setTransform(DPR,0,0,DPR,0,0);octx.clearRect(0,0,W,H);
      drawDeco();
      if(!state.notes||state.chapter<4)return;
      if(state.running&&state.p>.14&&state.p<.85&&state.chapter!==3)return;
      const items=state.chapter===4?model.notes.filter(([s])=>s.startsWith('敞肩')&&(s.includes('3.81')?state.p>=.5:state.p>=.25)):state.chapter===5?(state.p<.35?[]:[['桥面荷载',V(10.6,8.8,5.1)],['小拱 → 主拱',V(12,6.7,5.1)],['传向两端支承',V(19,-.2,5.1)]]):state.chapter===6?model.notes.filter(([s])=>s.includes('28')):model.notes.filter(([s])=>!s.startsWith('敞肩'));
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
      chooseConcept(){conceptBeat=state.reduce?1:0;viewer.beginTransition();},
      beginTransition(){selectedType='';if(!state.reduce)transition={pos:camera.position.clone(),aim:target.clone(),time:0};else transition=null;dirty=true;},
      cancelTransition(){transition=null;},startWash(){washTime=0;},
      render(now,dt){
        const boil=state.reduce?0:Math.floor(now/170)%64,needs=dirty||state.running||state.auto||transition||washTime<1||conceptBeat<1||flowGroup.visible||boil!==lastBoil;if(!needs)return;
        conceptBeat=state.reduce?1:Math.min(1,conceptBeat+dt/1.8);
        U.boil.value=boil;lastBoil=boil;
        const cp=state.chapter===3?clamp(state.p/.12):state.chapter>=4?1:0;
        U.grow.value=cp>=1?999:-6.9+Math.pow(Math.min(1,cp/.9),.7)*16;
        if(state.chapter===2&&selectedType!==state.type){selectedType=state.type;syncConceptCopy();}
        setModel();
        if(state.free){if(state.auto&&!pointerMode)orbit.th+=dt*.12;camera.position.set(target.x+orbit.dist*Math.sin(orbit.ph)*Math.sin(orbit.th),target.y+orbit.dist*Math.cos(orbit.ph),target.z+orbit.dist*Math.sin(orbit.ph)*Math.cos(orbit.th));}
        else{const next=pose();if(transition){transition.time+=dt;const a=smooth(transition.time/1.3);camera.position.lerpVectors(transition.pos,next.pos,a);target.lerpVectors(transition.aim,next.aim,a);if(a===1)transition=null;}else{camera.position.copy(next.pos);target.copy(next.aim);}}
        camera.lookAt(target);camera.updateMatrixWorld();
        washTime=state.reduce?1:Math.min(1,washTime+dt/3.2);U.wash.value=state.wash?1:0;U.lineK.value=state.wash?.45:1;U.washY.value=!state.wash||washTime===1?999:-6.9+washTime*25;
        if(state.chapter===7&&state.running&&!state.reduce)U.washY.value=state.p>.8?999:-6.9+state.p*27;
        flowMaterial.color.set(css.red);arrows.forEach((a,i)=>{const curve=flowCurves[i%2],t=(i/6+(state.running?state.p: .75))%1;a.position.copy(curve.getPoint(t));a.setDirection(curve.getTangent(t).normalize());a.setColor(css.red);});
        renderer.render(scene,camera);if(state.chapter===0){octx.setTransform(DPR,0,0,DPR,0,0);octx.clearRect(0,0,W,H);}else overlay();dirty=false;
      },
      inspect(){
        const coords=[model,...Object.values(concepts)].flatMap(m=>Object.values(m.parts).flatMap(part=>part.meshes.flatMap(o=>Object.values(o.geometry.attributes))));
        const conceptBuild=Object.fromEntries(Object.entries(concepts).map(([name,c])=>[name,{visible:c.group.visible,scale:c.group.scale.x,position:c.group.position.toArray(),parts:Object.fromEntries(Object.entries(c.parts).map(([n,part])=>[n,{progress:part.uniforms.progress.value,opacity:part.uniforms.opacity.value}]))}]));
        const build=Object.fromEntries(Object.entries(model.parts).map(([name,part])=>{
          const values=part.meshes[0].geometry.attributes.aBuild.array;
          return[name,{visible:part.node.visible,progress:part.uniforms.progress.value,opacity:part.uniforms.opacity.value,wash:part.uniforms.wash.value,min:values.reduce((a,b)=>Math.min(a,b),Infinity),max:values.reduce((a,b)=>Math.max(a,b),-Infinity)}];
        }));
        return{parts:Object.keys(model.parts),ribs:Object.keys(model.parts).filter(n=>n.startsWith('rib-')).length,smallArches:Object.keys(model.parts).filter(n=>n.startsWith('small-')).length,completedRibs:completedRibs(),visible:Object.keys(model.parts).filter(n=>model.parts[n].node.visible),build,camera:camera.position.toArray(),target:target.toArray(),clip:clip.constant,concept:state.chapter===2?state.type:null,conceptVisible:Object.keys(concepts).filter(k=>concepts[k].group.visible),conceptBuild,conceptMorph:conceptMorph(),opening:openingAt(),uniforms:{grow:U.grow.value,boil:U.boil.value,wash:U.wash.value,washY:U.washY.value},notesDrawn:state.notes,smallArchLabels:state.chapter===4&&state.notes?(state.p>=.5?2:state.p>=.25?1:0):0,finite:coords.every(a=>Array.from(a.array).every(Number.isFinite)),geometry:{span:g.SPAN,rise:g.RISE,radius:g.R},drawCalls:renderer.info.render.calls};
      }
    };
    resize();setModel();const first=pose();camera.position.copy(first.pos);target.copy(first.aim);camera.lookAt(target);$('modelStatus').hidden=true;dirty=true;
    cv.addEventListener('webglcontextlost',e=>{e.preventDefault();state.running=false;$('modelStatus').hidden=false;$('modelStatus').textContent='图形上下文已暂停，请重新打开页面；章节文字与来源仍可阅读。';});
  })().catch(fallback);
  window.bridgeApp={getState:()=>({...state,ready:!!viewer}),inspect:()=>viewer?.inspect()};
  function frame(now){const dt=Math.min(.06,(now-lastFrame)/1000);lastFrame=now;if(!document.hidden){
    if(state.chapter===0)mapWashClock+=dt;
    if(state.chapter===2&&state.running&&!state.conceptManual){const type=state.p<.25?'beam':state.p<.5?'multi':'single';if(type!==state.type){state.type=type;syncConceptLabels();for(const b of $('activity').querySelectorAll('[data-choice]'))b.setAttribute('aria-pressed',String(b.dataset.choice===type));dirty=true;}}
    if(state.running&&!$('sourcesDialog').open){state.p=Math.min(1,state.p+dt/(state.reduce?5:chapters[state.chapter].duration));dirty=true;if(state.p===1){if(state.continuous&&state.chapter<7)enter(state.chapter+1,0,true,true);else{state.running=false;state.continuous=false;if(state.chapter===7){state.free=true;viewer?.adoptCamera();}}}}
      syncOpeningLayers();drawMap(now);viewer?.render(now,dt);syncUI();
  }requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
})();
