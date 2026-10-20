      // ---------- 铅笔排线着色器 ----------
      const VS = `#include <common>
#include <clipping_planes_pars_vertex>
attribute float aBuild;uniform float uProg;varying float vT,vWY;attribute vec3 aCol;varying vec3 vCol;
varying vec3 vN;
void main(){vN=normalize(mat3(modelMatrix)*normal);vCol=aCol;float t=clamp((uProg-aBuild)/.035,0.,1.);vT=t;vec3 p=position;float e=1.-t;p.y+=e*e*7.;
vec4 wp=modelMatrix*vec4(p,1.0);vWY=wp.y;vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`;
      const FS = `#include <common>
#include <clipping_planes_pars_fragment>
uniform float uOpacity;uniform vec3 uLight,uInk,uPaper;uniform float uTone,uBoil,uDPR,uOpen,uGrow,uIsGrow,uHang,uIsHang,uWash,uWashY;varying vec3 vN,vCol;varying float vT,vWY;
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
float hl(vec2 c,float a,float sp,float w){vec2 d=vec2(cos(a),sin(a));float t=dot(c,vec2(-d.y,d.x))/sp;t+=(vn(c*.035+uBoil*7.13)-.5)*.9;
  float seg=vn(vec2(dot(c,d)*.07,floor(t)*3.1)+uBoil*1.7);float f=abs(fract(t)-.5)*2.;return (1.-smoothstep(w,w+.25,f))*smoothstep(.12,.34,seg);}
void main(){
#include <clipping_planes_fragment>
  if(vT<=0.||h21(floor(gl_FragCoord.xy))>vT*1.4||(uIsGrow>.5&&vWY>uGrow)||(uIsHang>.5&&vWY<uHang))discard;
  vec3 n=normalize(vN);bool back=!gl_FrontFacing;if(back)n=-n;
  float dif=max(dot(n,uLight),0.);float lum=.2+.6*dif+.2*(n.y*.5+.5)-uTone;
  vec2 c=gl_FragCoord.xy/uDPR;float ink=0.;
  ink=max(ink,hl(c,.8,6.,.18)*(1.-smoothstep(.72,.88,lum))*.5);
  ink=max(ink,hl(c,-.55,5.,.18)*(1.-smoothstep(.48,.64,lum))*.6);
  ink=max(ink,hl(c,.12,4.,.2)*(1.-smoothstep(.28,.42,lum))*.7);
  ink*=1.-.62*uWash;
  if(back&&uOpen<.5)ink=max(ink,max(hl(c,.785,2.8,.3),hl(c,-.785,2.8,.3))*.85);
  vec3 base=uPaper+(vn(c*.7)-.5)*.045;
  if(uWash>.001){float wy=uWashY+(vn(c*.03+3.1)-.5)*5.;float d=uWash*(1.-smoothstep(wy-2.,wy+.5,vWY));
    float bloom=.86+.14*vn(c*.009+7.7);d*=bloom;
    float front=(1.-smoothstep(0.,1.6,abs(vWY-wy)))*step(uWashY,500.);
    vec3 wc=vCol*mix(.76,1.05,lum)*(1.-.22*front)*(.985+.03*vn(c*1.3));if(back&&uOpen<.5)wc*=.85;
    base=mix(base,wc,clamp(d,0.,1.)*.74);}
  vec3 col=mix(base,uInk,ink);gl_FragColor=vec4(col,uOpacity);}`;
      function hatchMat(tone, { open = 0, red = false, noclip = false, hang = false } = {}) {
        return new THREE.ShaderMaterial({
          vertexShader: VS, fragmentShader: FS, side: THREE.DoubleSide, clipping: true,
          clippingPlanes: noclip ? null : [clip], polygonOffset: true, polygonOffsetFactor: 1.5, polygonOffsetUnits: 2,
          uniforms: { uWash: U.wash, uWashY: U.washY, uHang: U.hang, uIsHang: { value: hang ? 1 : 0 }, uLight: U.light, uInk: hang ? U.shinCol : red ? U.red : U.ink, uPaper: U.paper, uTone: { value: tone }, uBoil: U.boil, uDPR: U.dpr, uOpen: { value: open }, uProg: U.prog, uGrow: U.grow, uIsGrow: { value: red && !hang ? 1 : 0 } }
        });
      }
      const LVS = `#include <common>
#include <clipping_planes_pars_vertex>
uniform float uSeed,uAmp,uBoil,uProg,uOver;attribute float aBuild;attribute vec3 aOther;varying float vFade;varying float vT,vWY;
float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){vec3 p=position;vec3 q=p*1.37+uSeed+uBoil*3.1;vec3 dd=position-aOther;float ll=length(dd);if(ll>1e-4)p+=dd/ll*min(uOver,ll*.22)*(.3+h(q+5.3));p+=(vec3(h(q),h(q+11.3),h(q+27.1))-.5)*uAmp;float t=clamp((uProg-aBuild)/.035,0.,1.);vT=t;float e=1.-t;p.y+=e*e*7.;vWY=p.y;
vec4 mvPosition=modelViewMatrix*vec4(p,1.0);vFade=clamp(105./max(1.,-mvPosition.z),.3,1.);mvPosition.xyz*=.9988;gl_Position=projectionMatrix*mvPosition;
#include <clipping_planes_vertex>
}`;
      const LFS = `#include <common>
#include <clipping_planes_pars_fragment>
uniform float uOpacity;uniform vec3 uInk;uniform float uAlpha,uGrow,uIsGrow,uHang,uIsHang,uLineK,uWash,uWL,uWashY;varying float vFade;varying float vT,vWY;
void main(){
#include <clipping_planes_fragment>
if(vT<=0.||(uIsGrow>.5&&vWY>uGrow)||(uIsHang>.5&&vWY<uHang))discard;
gl_FragColor=vec4(uInk,uOpacity*uAlpha*vT*vFade*mix(uLineK,uWash*smoothstep(-2.,2.,uWashY-vWY),uWL));}`;
      function lineMat(seed, alpha, amp, { red = false, noclip = false, over = 0, hang = false, wl = false } = {}) {
        return new THREE.ShaderMaterial({
          vertexShader: LVS, fragmentShader: LFS, transparent: true, depthWrite: false, clipping: true,
          clippingPlanes: noclip ? null : [clip], uniforms: { uLineK: U.lineK, uWash: U.wash, uWashY: U.washY, uWL: { value: wl ? 1 : 0 }, uOver: { value: over }, uSeed: { value: seed }, uAmp: { value: amp }, uBoil: U.boil, uInk: hang ? U.shinCol : red ? U.red : U.ink, uAlpha: { value: alpha }, uProg: U.prog, uGrow: U.grow, uIsGrow: { value: red && !hang ? 1 : 0 }, uHang: U.hang, uIsHang: { value: hang ? 1 : 0 } }
        });
      }

      // ---------- 石材形制組立 ----------
      // 世界坐标：X=跨度方向（南北），Z=桥宽方向，Y=高程（起拱线为 0）
      let G, L, recs, PART='terrain'; const ZERO = { b: 0 };
      let FACE = new THREE.Matrix4();
      // 中国设色：青灰砂石为主，朱砂用于匠人放线（朱笔）
      const C = h => new THREE.Color(h);
      const QINGSHI = C('#a5aaa6'), QINGSHI2 = C('#b6bab5'), QINGSHI3 = C('#8d9491');
      const BAI = C('#eee9db'), ZHU = C('#b13a2c'), SHIQING = C('#4d7b9e'), SHILV = C('#5c8f72');
      const ZHESHI = C('#a2663a'), JIN = C('#c9a13b'), MO = C('#3a3f41'), SHUI = C('#6f9a9a');
      let PAINT = QINGSHI, KE = false;
      const V = (x, y, z) => new THREE.Vector3(x, y, z);
      function resetBuild() { G = { arch: [], stone: [], panel: [], deck: [], ground: [], water: [] }; L = { arch: [], ink: [], red: [], grid: [], cons: [], water: [] }; recs = []; FACE = new THREE.Matrix4(); PAINT = QINGSHI; KE = false; }
      let RECK = null, RJIT = .05;
      // 施工顺序记录：k 小者先施工。显式给 k 时可精确控制，否则按高度
      function mkRec(minY, grp, k) { const r = { part:PART, k: k !== undefined ? k + Math.random() * RJIT : minY + (grp === 'deck' ? 1.2 : 0) + Math.random() * .5, b: 0 }; recs.push(r); return r; }
      function place(geo, grp, edge = true, set = 'ink', k) {
        geo.applyMatrix4(FACE); geo.userData.col = PAINT; geo.userData.k = KE; geo.computeBoundingBox(); const rec = mkRec(geo.boundingBox.min.y, grp, k); geo.userData.rec = rec; G[grp].push(geo);
        if (edge) L[set].push({ a: new THREE.EdgesGeometry(geo, 24).attributes.position.array, rec });
      }
      function box(grp, x, y, z, sx, sy, sz, edge = true, k) { const g = new THREE.BoxGeometry(sx, sy, sz); g.translate(x, y, z); place(g, grp, edge, 'ink', k); }
      function beam(grp, a, b, w, h, edge = true, k) {
        const d = b.clone().sub(a), len = d.length(); const g = new THREE.BoxGeometry(w, h, len);
        const m = new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(.5), new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), d.normalize()), V(1, 1, 1)); g.applyMatrix4(m); place(g, grp, edge, 'ink', k);
      }
      function lines(set, pts, closed = false, k) { const out = [], p = pts.map(q => q.clone().applyMatrix4(FACE)); for (let i = 0; i < p.length - (closed ? 0 : 1); i++) { const A = p[i], B = p[(i + 1) % p.length]; out.push(A.x, A.y, A.z, B.x, B.y, B.z); } const rec = ['ink','arch'].includes(set) ? mkRec(Math.min(...p.map(q => q.y)), 'line', k) : { b:0, part:PART }; L[set].push({ a: new Float32Array(out), rec }); }
      function seg(set, a, b, k) { lines(set, [a, b], false, k); }
      // 参数曲面：fn(u,v) -> Vector3
      function surf(grp, fn, nu, nv, k, set) {
        const P = [], I = []; for (let j = 0; j <= nv; j++)for (let i = 0; i <= nu; i++) { const p = fn(i / nu, j / nv); P.push(p.x, p.y, p.z); }
        for (let j = 0; j < nv; j++)for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; I.push(a, c, b, b, c, d); }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); place(g, grp, false, set || 'ink', k);
      }
      const rotY = k => new THREE.Matrix4().makeRotationY(k * Math.PI / 2);

      function merge(list) {
        const ng = list.map(g => ({ g: g.index ? g.toNonIndexed() : g, b: g.userData.rec.b, c: g.userData.col || QINGSHI, k: g.userData.k })); let n = 0; ng.forEach(({ g }) => n += g.attributes.position.count);
        const P = new Float32Array(n * 3), N = new Float32Array(n * 3), B = new Float32Array(n), K = new Float32Array(n * 3); let o = 0; for (const { g, b, c: col, k } of ng) {
          const c = g.attributes.position.count, pa = g.attributes.position.array; P.set(pa, o * 3); N.set(g.attributes.normal.array, o * 3); B.fill(b, o, o + c); for (let i = o; i < o + c; i++) { K[i * 3] = col.r; K[i * 3 + 1] = col.g; K[i * 3 + 2] = col.b; }
          if (k) {
            const ar = []; for (let t = 0; t < c / 3; t++) {
              const j = t * 9, ax = pa[j + 3] - pa[j], ay = pa[j + 4] - pa[j + 1], az = pa[j + 5] - pa[j + 2], bx = pa[j + 6] - pa[j], by = pa[j + 7] - pa[j + 1], bz = pa[j + 8] - pa[j + 2];
              ar.push(Math.hypot(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx));
            } const mn = Math.min(...ar), mx = Math.max(...ar);
            if (mx / mn > 2.2) ar.forEach((a, t) => { if (a <= mn * 1.05) for (let v = 0; v < 3; v++) { const i = o + t * 3 + v; K[i * 3] = JIN.r; K[i * 3 + 1] = JIN.g; K[i * 3 + 2] = JIN.b; } });
          } o += c;
        }
        const r = new THREE.BufferGeometry(); r.setAttribute('position', new THREE.BufferAttribute(P, 3)); r.setAttribute('normal', new THREE.BufferAttribute(N, 3)); r.setAttribute('aBuild', new THREE.BufferAttribute(B, 1)); r.setAttribute('aCol', new THREE.BufferAttribute(K, 3)); return r;
      }
      function mergeL(list) {
        let n = 0; list.forEach(({ a }) => n += a.length); const P = new Float32Array(n), B = new Float32Array(n / 3); let o = 0; for (const { a, rec } of list) { P.set(a, o); B.fill(rec.b, o / 3, (o + a.length) / 3); o += a.length; }
        const O = new Float32Array(n); for (let i = 0; i < n; i += 6) { O[i] = P[i + 3]; O[i + 1] = P[i + 4]; O[i + 2] = P[i + 5]; O[i + 3] = P[i]; O[i + 4] = P[i + 1]; O[i + 5] = P[i + 2]; }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('aBuild', new THREE.BufferAttribute(B, 1)); g.setAttribute('aOther', new THREE.BufferAttribute(O, 3)); return g;
      }
      function finalize() {
        const group=new THREE.Group(), parts={};
        for(const part of new Set(recs.map(r=>r.part).concat(Object.values(L).flat().map(l=>l.rec.part)))) {
          if(!part)continue;
          const node=new THREE.Group();node.name=part;
          const uniforms={progress:{value:1},opacity:{value:1}};
          parts[part]={node,uniforms,meshes:[]};group.add(node);
          const add=(obj)=>{obj.material.uniforms.uProg=uniforms.progress;obj.material.uniforms.uOpacity=uniforms.opacity;obj.material.transparent=true;node.add(obj);parts[part].meshes.push(obj);};
          for(const [name,list] of Object.entries(G)) {
            const chosen=list.filter(g=>g.userData.rec.part===part);if(!chosen.length)continue;
            chosen.forEach(g=>g.userData.rec.b=0);
            add(new THREE.Mesh(merge(chosen),hatchMat(name==='ground'?-.14:name==='deck'?-.02:0,{open:['ground','water','deck'].includes(name)?1:0})));
          }
          for(const [name,list] of Object.entries(L)) {
            const chosen=list.filter(l=>l.rec.part===part);if(!chosen.length)continue;
            chosen.forEach(l=>l.rec.b=0);
            const red=name==='red', alpha=name==='cons'?.17:name==='grid'?.11:name==='water'?.26:.61;
            add(new THREE.LineSegments(mergeL(chosen),lineMat(red?2.2:1.3,alpha,name==='arch'?.017:.035,{red,noclip:['red','grid','cons','water'].includes(name),over:red?.12:0})));
          }
        }
        return {group,parts,KEYS:[]};
      }
      // 带洞网格：逐格判定中心点，挖去小拱开孔
      function patchGrid(grp, fn, nu, nv, keep, k, set) {
        const P = [], I = []; let n = 0;
        for (let j = 0; j < nv; j++)for (let i = 0; i < nu; i++) {
          const p00 = fn(i / nu, j / nv), p10 = fn((i + 1) / nu, j / nv), p01 = fn(i / nu, (j + 1) / nv), p11 = fn((i + 1) / nu, (j + 1) / nv);
          const cx = (p00.x + p10.x + p01.x + p11.x) / 4, cy = (p00.y + p10.y + p01.y + p11.y) / 4;
          if (keep && !keep(cx, cy)) continue;
          const b = n; P.push(p00.x, p00.y, p00.z, p10.x, p10.y, p10.z, p01.x, p01.y, p01.z, p11.x, p11.y, p11.z);
          I.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); n += 4;
        }
        if (!n) return;
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); place(g, grp, false, set || 'ink', k);
      }

      // ================= 赵州桥（安济桥） =================
      // 单位：米；Y=0 为主拱起拱线。事实/模型台账见同目录参考文档.md。
      // F2/F4/F5/F6（G1 官方）：净跨37.02、拱矢7.23、28道、宽9/9.6、小拱3.81/2.85。
      // F9（待核转引）：厚1.02；F8（口径冲突）：50.82仅示意建模范围。
      // F10（示意）：局部高度、分缝、构件连接/装饰、地形；F11：动画为组装示意。
      function buildAnji() {
        resetBuild();PART='terrain';
        RJIT = .03;
        const SPAN = 37.02, RISE = 7.23, NRIB = 28; // F2/F4: G1
        const THICK = 1.02; // F9：未独立核对原书的参考值
        const HALF = SPAN / 2, R = (HALF * HALF + RISE * RISE) / (2 * RISE), CY = RISE - R, TH = Math.asin(HALF / R);
        const TOTAL = 50.82, TX = TOTAL / 2; // F8：示意范围，非定论桥长
        const HW0 = 4.5, HW1 = 4.8;             // 拱顶 9m / 拱脚 9.6m 之半宽
        const DECK = 8.72, DROP = 1.50, DECKT = .34, CAMB = .05; // F10：几何示意

        const Wh = x => HW0 + (HW1 - HW0) * Math.min(1, Math.abs(x) / HALF);
        const eTop = x => CY + Math.sqrt(Math.max(0, (R + THICK) * (R + THICK) - x * x));
        const deckY = x => DECK - DROP * Math.pow(Math.min(1, Math.abs(x) / TX), 2);
        const AY = (a, r) => CY + r * Math.cos(a);
        const AXa = (a, r) => r * Math.sin(a);

        // ---------- 河床与两岸：F10 视觉示意，非实测地形 ----------
        PART='terrain';PAINT = ZHESHI;
        surf('ground', (u, v) => V(-46 + u * 92, -4.62, -13 + v * 26), 22, 3, -8.5);
        PART='water';PAINT = SHUI;
        surf('water', (u, v) => V(-21 + u * 42, -3.55, -13 + v * 26), 26, 3, -8.3, 'water');
        for (let x = -20; x < 20; x += 1.6) { const p = []; for (let v = -12; v <= 12; v += 3.4) p.push(V(x, -3.55, v)); lines('water', p, false, -8.3); }
        PART='terrain';
        for (const sgn of [-1, 1]) {
          PAINT = C('#ab9270');
          surf('ground', (u, v) => V(sgn * (TX + u * 16), 7.2 - u * 5.6, -7 + v * 14), 12, 2, -8.0);
          for (const zs of [-1, 1]) surf('ground', (u, v) => { const y0 = 7.2 - u * 5.6; return V(sgn * (TX + u * 16), y0 + v * (-4.62 - y0), zs * 7); }, 12, 2, -8.0);
          surf('ground', (u, v) => V(sgn * (TX + 16), 1.6 + v * (-6.22), -7 + u * 14), 2, 2, -8.0);
          for (let y = -4; y < 6.8; y += .9) { const p = []; for (let z = -6.6; z <= 6.6; z += 1.8) p.push(V(sgn * (TX + Math.max(0, (7.2 - y) / 5.6) * 16), y, z)); lines('ink', p, false, -8.0); }
        }

        // ---------- 主拱 28 道拱券（纵向并列砌筑） ----------
        for (let i = 0; i < NRIB; i++) {
          PART='rib-'+i;
          const k = -3 + i * .08, v0 = i / NRIB, v1 = (i + 1) / NRIB;
          const rib = r => (u, v) => { const a = -TH + u * 2 * TH, x = AXa(a, r), y = AY(a, r); return V(x, y, (v0 + (v1 - v0) * v - .5) * 2 * Wh(x)); };
          PAINT = i % 2 ? QINGSHI : QINGSHI2;
          surf('arch', rib(R), 48, 1, k);
          surf('arch', rib(R + THICK), 48, 1, k);
          // 券道边界显式绘出；隔离观察时仍可看清28道沿桥宽排列。
          for (const v of [v0, v1]) for (const r of [R,R+THICK]) {
            const pts=[];for(let j=0;j<=48;j++){const a=-TH+j/48*2*TH,x=AXa(a,r);pts.push(V(x,AY(a,r),(v-.5)*2*Wh(x)));}
            lines('arch',pts,false,k);
          }
          for(const edgeV of [v0,v1]) {
            surf('arch',(u,v)=>{const a=-TH+u*TH*2,r=R+v*THICK,x=AXa(a,r);return V(x,AY(a,r),(edgeV-.5)*2*Wh(x));},48,1,k);
            for(let j=0;j<=45;j++){const a=-TH+j/45*TH*2,x0=AXa(a,R),x1=AXa(a,R+THICK);seg('arch',V(x0,AY(a,R),(edgeV-.5)*2*Wh(x0)),V(x1,AY(a,R+THICK),(edgeV-.5)*2*Wh(x1)),k);}
          }
          for(const a of [-TH,TH]) surf('arch',(u,v)=>{const r=R+u*THICK,x=AXa(a,r);return V(x,AY(a,r),(v0+(v1-v0)*v-.5)*2*Wh(x));},1,1,k);
        }
        // 拱券立面（环带）— 券石长 70~109cm，故约 0.9m 一道竖缝
        PART='arch-detail';
        const kFace = -3.05;
        for (const sgn of [-1, 1]) surf('arch', (u, v) => { const a = -TH + u * 2 * TH, r = R + v * THICK; const x = AXa(a, r), y = AY(a, r); return V(x, y, sgn * Wh(x)); }, 48, 1, kFace);
        const NJ = 45;
        for (const sgn of [-1, 1]) for (let j = 0; j <= NJ; j++) {
          const a = -TH + j / NJ * 2 * TH, x0 = AXa(a, R), y0 = AY(a, R), x1 = AXa(a, R + THICK), y1 = AY(a, R + THICK);
          seg('arch', V(x0, y0, sgn * Wh(x0)), V(x1, y1, sgn * Wh(x1)), kFace);
        }
        // 腰铁（拱石之间以腰铁栓牢）
        for (const sgn of [-1, 1]) for (let j = 2; j < NJ; j += 4) {
          const a = -TH + j / NJ * 2 * TH, rm = R + THICK * .5, x = AXa(a, rm), y = AY(a, rm);
          FACE = new THREE.Matrix4().makeRotationZ(-a).setPosition(x, y, sgn * (Wh(x) + .02));
          PAINT = MO; box('panel', 0, 0, 0, .32, .19, .07, true, kFace + .02);
          FACE = new THREE.Matrix4();
        }
        // 护拱石（拱背石层，厚约 0.5m）
        PART='cover';PAINT = QINGSHI3;
        surf('stone', (u, v) => { const a = -TH + u * 2 * TH, r = R + THICK + .25; const x = AXa(a, r), y = AY(a, r); return V(x, y, (v - .5) * 2 * Wh(x)); }, 40, 1, -1.5);
        for (const sgn of [-1, 1]) surf('stone', (u, v) => { const a = -TH + u * 2 * TH, r = R + THICK + v * .5; const x = AXa(a, r), y = AY(a, r); return V(x, y, sgn * Wh(x)); }, 40, 1, -1.5);
        // 主拱背 5 道铸铁拉杆
        PAINT = MO;
        for (const a of [-.38, -.19, 0, .19, .38]) {
          const r = R + THICK + .55, x = AXa(a, r), y = AY(a, r);
          beam('panel', V(x, y, -Wh(x)), V(x, y, Wh(x)), .18, .16, false, -1.35);
        }

        // ---------- 敞肩小拱 ×4 ----------
        const SMALL = [];
        function smallArch(cx, span, ringT, k) {
          PART='small-'+SMALL.length;
          const half = span / 2;
          const ys = Math.max(eTop(cx - half), eTop(cx + half)) + .06;
          const f = Math.min(half, Math.max(.5, deckY(cx) - .15 - ys - ringT));
          const Rs = (half * half + f * f) / (2 * f), Cys = ys + f - Rs, aM = Math.asin(half / Rs);
          const arc = r => (u, v) => { const a = -aM + u * 2 * aM, x = cx + AXa(a, r), y = Cys + r * Math.cos(a); return V(x, y, (v - .5) * 2 * Wh(x)); };
          PAINT = QINGSHI; surf('stone', arc(Rs), 18, 1, k); surf('stone', arc(Rs + ringT), 18, 1, k);
          PAINT = QINGSHI2;
          for (const sgn of [-1, 1]) surf('stone', (u, v) => { const a = -aM + u * 2 * aM, r = Rs + v * ringT; const x = cx + AXa(a, r), y = Cys + r * Math.cos(a); return V(x, y, sgn * Wh(x)); }, 18, 1, k + .02);
          const NJs = Math.max(8, Math.round(Rs * 2 * aM / .85));
          for (const sgn of [-1, 1]) for (let j = 0; j <= NJs; j++) {
            const a = -aM + j / NJs * 2 * aM, x0 = cx + AXa(a, Rs), y0 = Cys + Rs * Math.cos(a), x1 = cx + AXa(a, Rs + ringT), y1 = Cys + (Rs + ringT) * Math.cos(a);
            seg('ink', V(x0, y0, sgn * Wh(x0)), V(x1, y1, sgn * Wh(x1)), k + .02);
          }
          SMALL.push({ cx, half, ys, Rs, Cys });
          return { cx, span, ys, f, Rs, aM, Cys };
        }
        const S1 = smallArch(10.60, 2.85, .42, -.62);
        const S2 = smallArch(15.90, 3.81, .50, -.58);
        const S3 = smallArch(-10.60, 2.85, .42, -.62);
        const S4 = smallArch(-15.90, 3.81, .50, -.58);
        const insideSmall = (x, y) => {
          for (const S of SMALL) { const d = x - S.cx; if (Math.abs(d) <= S.half && y <= S.Cys + Math.sqrt(Math.max(0, S.Rs * S.Rs - d * d))) return true; }
          return false;
        };

        // ---------- 桥堍（桥台）与拱上填肚 ----------
        const wallBot = x => Math.max(eTop(x), -6.9);
        function wallFace(x0, x1, k) {
          for (const sgn of [-1, 1]) {
            patchGrid('stone', (u, v) => { const x = x0 + (x1 - x0) * u; const y0 = wallBot(x), y1 = deckY(x) - DECKT; return V(x, y0 + (y1 - y0) * v, sgn * Wh(x)); }, 56, 22,
              (cx, cy) => cy > wallBot(cx) - .05 && !insideSmall(cx, cy), k);
            // 砌石层缝
            for (let y = -6; y < 9; y += .62) {
              const pts = [];
              for (let x = x0; x <= x1; x += .5) {
                const ok = y > wallBot(x) + .12 && y < deckY(x) - DECKT - .08 && !insideSmall(x, y);
                if (ok) pts.push(V(x, y, sgn * (Wh(x) + .015))); else { if (pts.length > 1) lines('ink', pts, false, k); pts.length = 0; }
              }
              if (pts.length > 1) lines('ink', pts, false, k);
            }
          }
        }
        PART='abutments';wallFace(-TX, -HALF, -3.62); wallFace(HALF, TX, -3.62);   // 桥堍先天，拱券即架于其上
        PART='fill';wallFace(-HALF, HALF, -.42);                             // 拱上填肚
        // 勾石（长 1.8m 者咬合拱券）
        for (const sgn of [-1, 1]) for (const x of [-16.4, -12.2, 12.2, 16.4]) {
          PAINT = QINGSHI3; box('stone', x, (wallBot(x) + deckY(x)) / 2, sgn * (Wh(x) + .05), .9, 1.8, .18, true, -.38);
        }

        // ---------- 桥面：中道行车，左右二道行人 ----------
        PART='deck';const kDeck = -.2;
        const lanes = [[-1, -.5, QINGSHI2], [-.5, .5, QINGSHI3], [.5, 1, QINGSHI2]];
        for (const [u0, u1, col] of lanes) {
          PAINT = col;
          surf('deck', (u, v) => { const x = -TX + u * TOTAL, z = Wh(x) * (u0 + (u1 - u0) * v); return V(x, deckY(x) + CAMB * (1 - Math.pow(z / Wh(x), 2)), z); }, 110, 2, kDeck);
        }
        for (let x = -TX + .6; x < TX - .6; x += 1.15) { const p = []; for (let v = -1; v <= 1.001; v += .12) p.push(V(x, deckY(x) + CAMB * (1 - v * v) + .004, v * Wh(x))); lines('ink', p, false, kDeck); }
        for (const v of [-.5, .5]) { const p = []; for (let i = 0; i <= 90; i++) { const x = -TX + i / 90 * TOTAL; p.push(V(x, deckY(x) + CAMB * .75 + .004, v * Wh(x))); } lines('ink', p, false, kDeck); }
        // 桥面底板（洞顶）：封住拱上填肚与桥堍的上方，剖切或自下仰望时不再透空
        PAINT = QINGSHI3;
        surf('deck', (u, v) => { const x = -TX + u * TOTAL; return V(x, deckY(x) - DECKT, Wh(x) * (v * 2 - 1)); }, 110, 2, kDeck - .05);
        // 桥面石侧面（补 0.34m 厚的铺装边缘）
        for (const sgn of [-1, 1]) surf('deck', (u, v) => { const x = -TX + u * TOTAL; return V(x, deckY(x) - v * DECKT, sgn * Wh(x)); }, 110, 1, kDeck - .02);

        // ---------- 地栿 · 栏板（龙兽浮雕）· 望柱（石狮首） ----------
        PART='railing';const NP = 20, SP = TOTAL / NP, kBase = 0, kPanel = .1, kPost = .2, kLion = .3;
        for (let i = 0; i <= NP; i++) {
          const x = -TX + i * SP;
          for (const sgn of [-1, 1]) {
            const z = sgn * (Wh(x) - .21), yb = deckY(x) + CAMB * .6;
            PAINT = QINGSHI2; box('panel', x, yb + .60, z, .30, 1.16, .30, true, kPost);
            PAINT = QINGSHI; const sg = new THREE.SphereGeometry(.17, 14, 10); sg.scale(1.05, 1, .85); sg.translate(x, yb + 1.34, z); place(sg, 'panel', true, 'ink', kLion);
            const mz = new THREE.BoxGeometry(.13, .11, .18); mz.translate(x, yb + 1.29, z + sgn * .17); place(mz, 'panel', true, 'ink', kLion);
            for (const e of [-1, 1]) { const er = new THREE.ConeGeometry(.05, .13, 6); er.translate(x + e * .11, yb + 1.48, z); place(er, 'panel', true, 'ink', kLion); }
          }
        }
        for (let i = 0; i < NP; i++) {
          const x0 = -TX + i * SP + .20, x1 = -TX + (i + 1) * SP - .20;
          for (const sgn of [-1, 1]) {
            const NSEG = 6;
            for (let s = 0; s < NSEG; s++) {
              const xa = x0 + (x1 - x0) * s / NSEG, xb = x0 + (x1 - x0) * (s + 1) / NSEG, xm = (xa + xb) / 2;
              PAINT = QINGSHI2;
              box('panel', xm, deckY(xm) + CAMB * .6 + .58, sgn * (Wh(xm) - .24), xb - xa + .02, .76, .14, true, kPanel);
              PAINT = QINGSHI3;
              box('panel', xm, deckY(xm) + CAMB * .6 + .11, sgn * (Wh(xm) - .20), xb - xa + .02, .22, .24, true, kBase);
            }
            // 蟠龙浮雕（墨线）
            const p = []; for (let j = 0; j <= 30; j++) {
              const t = j / 30, x = x0 + (x1 - x0) * t;
              p.push(V(x, deckY(x) + CAMB * .6 + .58 + Math.sin(t * Math.PI * 3.4) * .19 + Math.sin(t * Math.PI * 1.2) * .05, sgn * (Wh(x) - .315)));
            }
            lines('ink', p, false, kPanel);
            for (let j = 2; j <= 28; j += 3) { const q = p[j]; lines('ink', [V(q.x - .05, q.y - .06, q.z), V(q.x + .05, q.y + .06, q.z)], false, kPanel); }
            const hp = []; for (let j = 0; j <= 8; j++) { const t = j / 8; hp.push(V(x1 - .1 - t * .3, deckY(x1) + CAMB * .6 + .58 + Math.sin(t * 3) * .1, sgn * (Wh(x1) - .315))); }
            lines('ink', hp, false, kPanel);
          }
        }

        // ---------- 锁口石：拱顶龙头与莲花 ----------
        PART='arch-detail';const kLock = .42;
        for (const sgn of [-1, 1]) {
          PAINT = QINGSHI2; box('stone', 0, CY + R + THICK / 2, sgn * (Wh(0) + .03), .95, THICK, .30, true, kLock);
          const y = CY + R + THICK * .5, z = sgn * (Wh(0) + .18);
          PAINT = QINGSHI;
          const hd = new THREE.SphereGeometry(.33, 16, 12); hd.scale(1.15, .85, .72); hd.translate(0, y, z + sgn * .12); place(hd, 'panel', true, 'ink', kLock);
          const sn = new THREE.BoxGeometry(.30, .25, .44); sn.translate(0, y - .07, z + sgn * .42); place(sn, 'panel', true, 'ink', kLock);
          for (const s of [-1, 1]) { const hn = new THREE.ConeGeometry(.055, .30, 6); hn.rotateX(sgn * .55); hn.translate(s * .17, y + .26, z + sgn * .12); place(hn, 'panel', true, 'ink', kLock); }
          lines('ink', [V(-.62, y - .02, sgn * (Wh(0) + .02)), V(.62, y - .02, sgn * (Wh(0) + .02))], false, kLock);
          const lp = []; for (let j = 0; j <= 14; j++) { const t = j / 14; lp.push(V(-.72 + t * 1.44, y - .40 + Math.sin(t * Math.PI * 5) * .07, sgn * (Wh(0) + .02))); }
          lines('ink', lp, false, kLock);
        }

        PART='guides';
        // ---------- 朱笔放线（朱砂作図線）----------
        FACE = new THREE.Matrix4();
        lines('red', [V(-TX, 0, 0), V(TX, 0, 0)], false, -7.6);
        for (let x = -TX; x <= TX; x += 5) seg('red', V(x, -.35, 0), V(x, .35, 0), -7.6);
        for (const x of [-HALF, HALF, 0]) seg('red', V(x, -2.0, 0), V(x, RISE + 2.6, 0), -7.6);
        for (const z of [-HW1, HW1]) lines('red', [V(-TX, 0, z), V(TX, 0, z)], false, -7.6);
        lines('cons', [V(-TX, 0, -HW1), V(TX, 0, -HW1), V(TX, 0, HW1), V(-TX, 0, HW1)], true, -7.4);
        lines('cons', [V(-TX, RISE, -12), V(TX, RISE, -12), V(TX, RISE, 12), V(-TX, RISE, 12)], true, -7.4);
        for (const x of [-TX, TX]) for (const z of [-HW1, HW1]) seg('cons', V(x, -7, z), V(x, 12, z), -7.4);
        { const p = []; for (let j = 0; j <= 96; j++) { const a = Math.PI * j / 96; p.push(V(Math.cos(a) * R, CY + Math.sin(a) * R, 0)); } lines('red', p, false, -7.5); }
        { const p = []; for (let j = 0; j <= 96; j++) { const a = Math.PI * j / 96; p.push(V(Math.cos(a) * (R + THICK), CY + Math.sin(a) * (R + THICK), 0)); } lines('red', p, false, -7.5); }
        for (let x = -44; x <= 44; x += 2) { lines('grid', [V(x, 0, -HW1), V(x, 0, HW1)], false, -7.8); seg('grid', V(-44, 0, x / 4), V(44, 0, x / 4), -7.8); }

        const f = finalize();
        return {
          group: f.group, parts:f.parts, KEYS: f.KEYS, topY: DECK, SH_B: 0, SH_T: 0,
          PMAX: 1.12, BUILD_S: 30,geometry:{SPAN,RISE,NRIB,R,CY,TH,SMALL,Wh,eTop,deckY},
          big: '安濟橋', name: '赵州桥',
          dd: ['安济桥 立体石构図', '单孔敞肩圆弧石拱　28道拱券纵向并列', '铅笔排线 · 中国传统设色'],
          clipN: V(0, 0, -1), clipMax: 6.2,
          HOME: { th: .28, ph: 1.255, dist: 66 }, sect: { th: .020, ph: 1.180, dist: 62 },
          tgt: (p, c) => V(0, 2.4 + 2.0 * Math.min(1, p * 1.1), 0),
          notes: [
            ['净跨 37.02 m', V(0, -2.4, HW1 + .5)],
            ['拱矢 7.23 m', V(HALF - 1.2, RISE * .52, HW1 + .5)],
            ['主拱券 28 道，纵向并列砌筑', V(-5.5, eTop(-5.5) + .6, HW0 + .4)],
            ['敞肩小拱 净跨 3.81 m', V(15.9, 5.0, HW1 + .5), true],
            ['敞肩小拱 跨度 2.85 m', V(10.6, 7.3, HW1 + .5), true],
            ['桥面宽 9 m（拱脚 9.6 m）', V(-2.6, DECK + 1.0, -1.8)],
          ],
          stage: (p, gy) => { const h = gy - 5; if (p >= 1.06) return '收尾'; if (p >= 1.0) return '铺面 · 安栏'; if (p >= .74) return '护拱 · 填肚'; if (p >= .17) return '砌券'; if (p >= .05) return '架券'; return '筑基'; }
        };
      }


