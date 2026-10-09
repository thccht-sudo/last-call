(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const $={fps:60,player:{hp:100,speed:6.5,radius:.45},inputBuffer:8,combo:[{startup:5,active:3,recovery:11,damage:8,knock:1.2,stun:18,knockdown:!1},{startup:5,active:3,recovery:11,damage:10,knock:1.2,stun:18,knockdown:!1},{startup:9,active:4,recovery:20,damage:18,knock:5.5,stun:0,knockdown:!0}],lungeRange:4.5,strikeDistance:1.05,hitReach:1.5,maxLungeSpeed:.45,dodge:{frames:18,invulnFrom:1,invulnTo:13,distance:3.6},counter:{window:24,frames:26,damage:20,range:2.8,whiffFrames:24},hitstop:{light:4,heavy:8,counter:10,bottle:8},thug:{hp:46,speed:3.4,radius:.45,circleRadius:3.8,attackRange:1.35,windup:34,trackUntil:10,active:4,recovery:26,damage:12,cooldown:50,stun:18,unblockable:!1},heavy:{hp:70,speed:2.8,radius:.55,circleRadius:4.2,attackRange:1.5,windup:48,trackUntil:14,active:5,recovery:34,damage:26,cooldown:80,stun:14,unblockable:!0},thrower:{hp:30,speed:3.2,radius:.42,circleRadius:6.2,attackRange:8,windup:30,trackUntil:6,active:2,recovery:30,damage:10,cooldown:70,stun:22,unblockable:!1},grappler:{hp:60,speed:3.6,radius:.5,circleRadius:3.6,attackRange:1.3,windup:40,trackUntil:12,active:4,recovery:30,damage:5,cooldown:90,stun:30,unblockable:!0},boss:{hp:240,speed:3,radius:.62,circleRadius:4,attackRange:1.6,windup:26,trackUntil:8,active:4,recovery:18,damage:14,cooldown:60,stun:12,unblockable:!1},bossHaymaker:{windup:44,damage:28,recovery:40},bossEnrage:.5,cup:{speed:.2,hitRadius:.6,deflectRange:1.9,deflectSpeed:.34,deflectDamage:24},grab:{holdFrames:150,tick:30,escapePresses:6,throwDamage:10},slam:{speed:.09,damage:12,extraDown:30,bowlDamage:8},knockdownFrames:70,getupFrames:20,bottle:{speed:.3,damage:25,meleeDamage:30,pickup:1.3,throwRange:13,respawn:480},waves:[{maxAttackers:1,enemies:["thug","thug","thug"]},{maxAttackers:2,enemies:["thug","thrower","grappler","thug"]},{maxAttackers:2,enemies:["boss","heavy","thrower"]}],waveDelay:90,coop:{extraPerWave:1,reviveRange:1.3,reviveFrames:120,reviveHp:40,tagWindow:45,tagMultiplier:1.5}},ot={bounds:{minX:-9,maxX:9,minY:-6,maxY:4.2},facadeY:-6,curbY:2.6,door:{x:-6.6},playerStart:{x:0,y:.6},obstacles:[{x:-2.6,y:-4.4,w:1.9,h:1.5,kind:"table"},{x:.6,y:-4.4,w:1.9,h:1.5,kind:"table"},{x:3.8,y:-4.4,w:1.9,h:1.5,kind:"table"},{x:7,y:-4.4,w:1.9,h:1.5,kind:"table"},{x:-1.65,y:-2.6,w:5.7,h:.12,kind:"fence"},{x:6,y:-2.6,w:6,h:.12,kind:"fence"},{x:-4.5,y:-4.3,w:.12,h:3.4,kind:"fence"},{x:2,y:2.3,w:.3,h:.3,kind:"post"},{x:3.2,y:2.3,w:.2,h:.2,kind:"post"},{x:-5.5,y:2.2,w:1.2,h:.6,kind:"planter"}],nav:[{x:2.1,y:-2.6},{x:2.1,y:-1.6},{x:2.1,y:-3.1},{x:-5,y:-2.2},{x:-5.1,y:-5.4},{x:-3.9,y:-2},{x:-4,y:-3.1},{x:-1,y:-3.1},{x:5.4,y:-3.1},{x:8.5,y:-3.1}],bottleSpots:[{x:-5.15,y:2.2},{x:7,y:-4.4}],spawns:[{from:{x:-6.6,y:-5.6},to:{x:-6.6,y:-1.5}},{from:{x:-10,y:3.5},to:{x:-6.5,y:3.5}},{from:{x:10,y:3.7},to:{x:6.5,y:3.7}}]},Cc=.05;function Pc(n,e,t,i){const s=t.x-t.w/2-i,r=t.x+t.w/2+i,a=t.y-t.h/2-i,o=t.y+t.h/2+i;let l=0,c=1;const u=e.x-n.x,f=e.y-n.y;for(const[d,m]of[[-u,n.x-s],[u,r-n.x],[-f,n.y-a],[f,o-n.y]]){if(d===0){if(m<0)return!1;continue}const g=m/d;if(d<0){if(g>c)return!1;g>l&&(l=g)}else{if(g<l)return!1;g<c&&(c=g)}}return!0}function Ws(n,e,t=.35){return!ot.obstacles.some(i=>i.kind!=="post"&&Pc(n,e,i,t-Cc))}function Lc(n,e){if(Ws(n,e))return e;const t=[n,...ot.nav,e],i=t.length,s=i-1,r=new Array(i).fill(1/0),a=new Array(i).fill(-1),o=new Array(i).fill(!1);for(r[0]=0;;){let c=-1;for(let u=0;u<i;u++)!o[u]&&r[u]<1/0&&(c<0||r[u]<r[c])&&(c=u);if(c<0||c===s)break;o[c]=!0;for(let u=0;u<i;u++){if(o[u]||u===c)continue;const f=Math.hypot(t[u].x-t[c].x,t[u].y-t[c].y);r[c]+f<r[u]&&Ws(t[c],t[u])&&(r[u]=r[c]+f,a[u]=c)}}if(a[s]<0)return e;let l=s;for(;a[l]!==0;)l=a[l];return t[l]}function So(n,e){for(const t of ot.obstacles){const i=t.w/2,s=t.h/2,r=Math.max(t.x-i,Math.min(t.x+i,n.x)),a=Math.max(t.y-s,Math.min(t.y+s,n.y)),o=n.x-r,l=n.y-a,c=Math.hypot(o,l);if(c>=e)continue;if(c>1e-6){n.x=r+o/c*e,n.y=a+l/c*e;continue}const u=n.x-(t.x-i),f=t.x+i-n.x,d=n.y-(t.y-s),m=t.y+s-n.y,g=Math.min(u,f,d,m);g===u?n.x=t.x-i-e:g===f?n.x=t.x+i+e:g===d?n.y=t.y-s-e:n.y=t.y+s+e}}function Eo(n,e=0){return ot.obstacles.some(t=>Math.abs(n.x-t.x)<t.w/2+e&&Math.abs(n.y-t.y)<t.h/2+e)}const To={mx:0,my:0,attack:!1,counter:!1,dodge:!1,grab:!1},At=(n,e)=>({x:n.x-e.x,y:n.y-e.y}),Qt=n=>Math.hypot(n.x,n.y),Bt=(n,e)=>Qt(At(n,e)),Et=n=>{const e=Qt(n);return e>1e-6?{x:n.x/e,y:n.y/e}:{x:0,y:0}},Z1=(n,e)=>n.x*e.x+n.y*e.y;function F1(n){return n.rng=n.rng*1664525+1013904223>>>0,n.rng/4294967296}function bo(n,e){return{index:n,revive:0,pos:{...e},facing:{x:0,y:-1},hp:$.player.hp,state:"free",t:0,dur:0,combo:0,target:null,hasHit:!1,chain:!1,dodgeDir:{x:0,y:0},holding:null,smash:!1,escape:0,buffer:null}}function Ao(n){const e=n.players[0],t=bo(n.players.length,{x:e.pos.x+1.2,y:e.pos.y});return So(t.pos,$.player.radius),n.players.push(t),n.events.push({type:"joined",player:t.index}),t}function wo(n=1,e=1){const t={frame:0,hitstop:0,shake:0,players:[bo(0,ot.playerStart)],enemies:[],bottles:[],cups:[],wave:-1,waveTimer:30,result:"playing",events:[],rng:n>>>0||1,nextId:1};for(const i of ot.bottleSpots)t.bottles.push({id:t.nextId++,home:i,pos:{...i},vel:{x:0,y:0},state:"ground",t:0,holder:-1});for(;t.players.length<e;)Ao(t);return t.events=[],t}function Ro(n,e,t,i="spawn",s=t){const r=$[e],a={id:n.nextId++,kind:e,pos:{...t},facing:{x:0,y:1},vel:{x:0,y:0},hp:r.hp,maxHp:r.hp,state:i,t:0,dur:i==="spawn"?20:0,cooldown:30+Math.floor(F1(n)*60),angle:F1(n)*Math.PI*2,orbit:F1(n)<.5?-1:1,entry:{...s},focus:0,lastHitBy:-1,lastHitFrame:-999,unblockable:!1,string:0,enraged:!1,slammed:!1};return n.enemies.push(a),a}function Dc(n,e){n.wave=e,n.events.push({type:"wave",n:e});const t=Array.from({length:(n.players.length-1)*$.coop.extraPerWave},()=>"thug");[...$.waves[e].enemies,...t].forEach((i,s)=>{const r=ot.spawns[s%ot.spawns.length],a=Ro(n,i,r.from,"spawn",r.to);a.dur=20+s*25})}const j1=n=>n.state!=="dead",Ii=n=>j1(n)&&n.state!=="down"&&n.state!=="getup"&&n.state!=="spawn";function aa(n,e,t,i){let s=null,r=1/0;for(const a of n.enemies){if(!Ii(a))continue;const o=At(a.pos,e.pos),l=Qt(o);if(l>i)continue;const c=Z1(t,Et(o));if(c<-.1&&l>1.6)continue;const u=l-3*c;u<r&&(r=u,s=a)}return s}function Ic(n,e){return Math.hypot(n.mx,n.my)>.3?Et({x:n.mx,y:n.my}):e}function St(n,e,t){n.state=e,n.t=0,n.dur=t}function mt(n,e,t){n.state=e,n.t=0,n.dur=t}const Co=n=>n.state==="counter"||n.state==="down"||n.state==="dodge"&&n.t>=$.dodge.invulnFrom&&n.t<=$.dodge.invulnTo,kn=n=>n.state!=="down";function Xs(n){return n.state==="windup"?n.dur-n.t:n.state==="active"?0:null}function Po(n,e){const t=Xs(e);return t!==null&&t<=$.counter.window&&!e.unblockable&&e.kind!=="thrower"&&kn(n)&&n.state!=="grabbed"&&Bt(e.pos,n.pos)<=$.counter.range}function Lo(n,e){if(e.owner!==-1||!kn(n)||n.state==="grabbed")return!1;const t=At(n.pos,e.pos);return Qt(t)<=$.cup.deflectRange&&Z1(Et(t),Et(e.vel))>.3}function Uc(n){return n.kind==="boss"||n.unblockable&&(n.state==="windup"||n.state==="active")}function Nc(n,e){return e.state==="holding"?n.players.find(t=>t.index===e.focus&&t.state==="grabbed"):void 0}function Ui(n,e,t,i,s,r,a,o=-1,l=!1){o>=0&&e.lastHitBy>=0&&e.lastHitBy!==o&&n.frame-e.lastHitFrame<=$.coop.tagWindow&&(t=Math.round(t*$.coop.tagMultiplier),n.events.push({type:"tag",pos:{...e.pos}})),o>=0&&(e.lastHitBy=o,e.lastHitFrame=n.frame),e.hp-=t;const c=Et(At(e.pos,i)),u=Uc(e)&&!l,f=u?.3:1;e.vel={x:c.x*s*.06*f,y:c.y*s*.06*f},u||(e.facing={x:-c.x,y:-c.y});const d=Nc(n,e);if(d&&(St(d,"free",0),d.escape=0,n.events.push({type:"escaped",player:d.index})),e.hp<=0){e.hp=0,e.vel={x:c.x*.3,y:c.y*.3},mt(e,"dead",0),n.events.push({type:"ko",pos:{...e.pos},boss:e.kind==="boss"});return}e.kind==="boss"&&!e.enraged&&e.hp<=e.maxHp*$.bossEnrage&&Fc(n,e),!(u&&!d)&&(e.string=0,a?(e.slammed=!1,mt(e,"down",e.kind==="boss"?$.knockdownFrames-20:$.knockdownFrames)):mt(e,"stun",r||$[e.kind].stun))}function Fc(n,e){e.enraged=!0,n.events.push({type:"enrage",pos:{...e.pos}}),n.shake=.5;for(let t=0;t<2;t++){const i=ot.spawns[1+t],s=Ro(n,"thug",i.from,"spawn",i.to);s.dur=20+t*30}}function Oc(n,e,t,i){const s=Ic(i,e.facing);if(t==="dodge")return e.dodgeDir=s,e.facing=s,St(e,"dodge",$.dodge.frames),n.events.push({type:"dodge",by:e.index}),!0;if(t==="counter"){const o=n.cups.filter(u=>Lo(e,u)).sort((u,f)=>Bt(u.pos,e.pos)-Bt(f.pos,e.pos))[0];if(o){const u=n.enemies.find(d=>d.id===o.from&&Ii(d)),f=Et(u?At(u.pos,o.pos):{x:-o.vel.x,y:-o.vel.y});return o.vel={x:f.x*$.cup.deflectSpeed,y:f.y*$.cup.deflectSpeed},o.owner=e.index,e.facing=f,St(e,"counter",$.counter.frames-8),n.hitstop=$.hitstop.light,n.shake=.15,n.events.push({type:"deflect",pos:{...o.pos},by:e.index}),!0}let l=null;for(const u of n.enemies)Po(e,u)&&(!l||Bt(u.pos,e.pos)<Bt(l.pos,e.pos))&&(l=u);if(!l)return St(e,"whiff",$.counter.whiffFrames),n.events.push({type:"whiff",by:e.index}),!0;const c=Et(At(l.pos,e.pos));return e.facing=c,e.pos={x:l.pos.x-c.x*$.strikeDistance,y:l.pos.y-c.y*$.strikeDistance},St(e,"counter",$.counter.frames),Ui(n,l,$.counter.damage,e.pos,4,0,!0,e.index,!0),n.hitstop=$.hitstop.counter,n.shake=.35,n.events.push({type:"counter",pos:{...l.pos},by:e.index}),!0}if(t==="grab"){if(e.holding!==null){const l=n.bottles.find(f=>f.id===e.holding),c=aa(n,e,s,$.bottle.throwRange),u=c?Et(At(c.pos,e.pos)):s;return l.state="flying",l.pos={x:e.pos.x+u.x*.6,y:e.pos.y+u.y*.6},l.vel={x:u.x*$.bottle.speed,y:u.y*$.bottle.speed},l.holder=e.index,e.holding=null,e.facing=u,St(e,"attack",14),e.combo=0,e.target=null,e.hasHit=!0,e.smash=!1,!0}const o=n.bottles.find(l=>l.state==="ground"&&Bt(l.pos,e.pos)<=$.bottle.pickup);return o?(o.state="held",o.holder=e.index,e.holding=o.id,!0):!1}const r=aa(n,e,s,$.lungeRange);e.target=r?r.id:null,r?e.facing=Et(At(r.pos,e.pos)):e.facing=s,e.smash=e.holding!==null;const a=e.smash?$.combo[2]:$.combo[e.combo];return St(e,"attack",a.startup+a.active+a.recovery),e.hasHit=!1,e.chain=!1,!0}function Bc(n){if(n.state==="free")return!0;if(n.state==="attack"&&n.hasHit&&!n.smash){const e=$.combo[n.combo];return n.t>=e.startup+e.active}return n.state==="counter"?n.t>=n.dur-8:!1}function zc(n,e,t){e.t++;const i=t.counter?"counter":t.dodge?"dodge":t.attack?"attack":t.grab?"grab":null;if(e.state==="down"){const s=n.players.find(r=>r!==e&&kn(r)&&r.state!=="grabbed"&&Bt(r.pos,e.pos)<=$.coop.reviveRange);e.revive=s?e.revive+1:Math.max(0,e.revive-2),e.revive>=$.coop.reviveFrames&&(e.hp=$.coop.reviveHp,e.revive=0,St(e,"free",0),n.events.push({type:"revived",player:e.index}));return}if(e.state==="grabbed"){if(e.buffer=null,!n.enemies.some(s=>s.state==="holding"&&s.focus===e.index)){St(e,"free",0),e.escape=0;return}if(i&&e.escape++,e.escape>=$.grab.escapePresses){const s=n.enemies.find(r=>r.state==="holding"&&r.focus===e.index);if(s){mt(s,"stun",50);const r=Et(At(s.pos,e.pos));s.vel={x:r.x*.25,y:r.y*.25}}St(e,"free",0),e.escape=0,n.events.push({type:"escaped",player:e.index})}return}if(i?e.buffer={action:i,frames:$.inputBuffer}:e.buffer&&--e.buffer.frames<=0&&(e.buffer=null),e.buffer&&Bc(e)){const s=e.state,r=e.combo,a=e.hasHit,o=e.buffer.action;o==="attack"&&s==="attack"&&a?e.combo=(r+1)%$.combo.length:o==="attack"&&(e.combo=0),Oc(n,e,o,t)&&(e.buffer=null)}switch(e.state){case"free":{const s={x:t.mx,y:t.my},r=Math.min(1,Qt(s));if(r>.15){const a=Et(s);e.pos.x+=a.x*r*$.player.speed/$.fps,e.pos.y+=a.y*r*$.player.speed/$.fps,e.facing=a}break}case"attack":{const s=e.smash?$.combo[2]:$.combo[e.combo],r=n.enemies.find(a=>a.id===e.target&&Ii(a));if(e.t<=s.startup&&r){const a=At(r.pos,e.pos),l=Qt(a)-$.strikeDistance-($[r.kind].radius-.45);if(l>0){const c=Math.min(l,Math.max(l/Math.max(1,s.startup-e.t+1),0),$.maxLungeSpeed),u=Et(a);e.pos.x+=u.x*c,e.pos.y+=u.y*c}e.facing=Et(a)}if(!e.hasHit&&e.t>=s.startup&&e.t<s.startup+s.active){let a=!1;for(const o of n.enemies){if(!Ii(o))continue;const l=At(o.pos,e.pos),c=Qt(l);c>$.hitReach+$[o.kind].radius-.45||c>.4&&Z1(Et(l),e.facing)<.3||(e.smash?Ui(n,o,$.bottle.meleeDamage,e.pos,5,0,!0,e.index,!0):Ui(n,o,s.damage,e.pos,s.knock,s.stun,s.knockdown,e.index),a=!0)}if(a){e.hasHit=!0;const o=e.smash||s.knockdown;n.hitstop=o?$.hitstop.heavy:$.hitstop.light,n.shake=o?.3:.12,n.events.push({type:"hit",pos:{x:e.pos.x+e.facing.x,y:e.pos.y+e.facing.y},heavy:o,by:e.index}),e.smash&&oa(n,e)}}e.t>=e.dur&&(e.smash&&oa(n,e),St(e,"free",0),e.combo=0);break}case"dodge":{const s=$.dodge.distance/$.dodge.frames,r=1.6-e.t/$.dodge.frames*1.2;e.pos.x+=e.dodgeDir.x*s*r,e.pos.y+=e.dodgeDir.y*s*r,e.t>=e.dur&&St(e,"free",0);break}case"counter":case"whiff":case"hitstun":e.t>=e.dur&&(St(e,"free",0),e.combo=0);break}}function oa(n,e){const t=n.bottles.find(i=>i.id===e.holding);t&&(t.state="broken",t.t=0,t.pos={x:e.pos.x+e.facing.x,y:e.pos.y+e.facing.y},e.holding=null,e.smash=!1,n.events.push({type:"shatter",pos:{...t.pos}}))}function Do(n,e,t){if(e.holding===null)return;const i=n.bottles.find(s=>s.id===e.holding);i.state="ground",i.pos={x:e.pos.x-t.x*.8,y:e.pos.y-t.y*.8},e.holding=null}function V1(n,e,t,i,s,r){e.hp-=t;const a=Et(At(e.pos,i));if(e.pos.x+=a.x*r,e.pos.y+=a.y*r,Do(n,e,a),n.hitstop=s?$.hitstop.heavy:$.hitstop.light,n.shake=s?.35:.2,n.events.push({type:"playerHit",pos:{...e.pos},heavy:s,player:e.index}),e.hp>0)return!1;const o=n.enemies.find(l=>l.state==="holding"&&l.focus===e.index);return o&&mt(o,"recover",$[o.kind].recovery),e.hp=0,e.revive=0,e.escape=0,St(e,"down",0),n.events.push({type:"playerDown",player:e.index}),n.players.some(kn)||(n.result="lose"),!0}function kc(n,e,t){if(t.kind==="grappler"){Do(n,e,Et(At(e.pos,t.pos))),St(e,"grabbed",0),e.escape=0,mt(t,"holding",$.grab.holdFrames),e.pos={x:t.pos.x+t.facing.x*.8,y:t.pos.y+t.facing.y*.8},n.shake=.2,n.events.push({type:"grabbed",player:e.index});return}const s=t.kind==="boss"&&t.unblockable?$.bossHaymaker.damage:$[t.kind].damage;V1(n,e,s,t.pos,t.unblockable,.5)||(St(e,"hitstun",20),e.combo=0)}function Hc(n){const e=$[n.kind];let t=e.windup;n.unblockable=e.unblockable,n.kind==="boss"&&(n.unblockable=n.string===2,t=n.unblockable?$.bossHaymaker.windup:e.windup,n.enraged&&(t=Math.round(t*.8))),mt(n,"windup",t)}function Vc(n){return n.enemies.filter(e=>e.state==="approach"||e.state==="windup"||e.state==="active"||e.state==="holding").length}function ca(n,e){let t=null;for(const i of n.players)kn(i)&&(!t||Bt(i.pos,e)<Bt(t.pos,e))&&(t=i);return t}function Gc(n){const e=(n.wave>=0?$.waves[n.wave].maxAttackers:1)+(n.players.length-1);if(Vc(n)<e&&n.players.some(kn)){let t=null,i=1/0;for(const s of n.enemies){if(s.state!=="circle"||s.cooldown>0)continue;const r=ca(n,s.pos),a=Bt(s.pos,r.pos);a<i&&(t=s,i=a)}t&&mt(t,"approach",180)}for(const t of n.enemies){const i=$[t.kind];if(t.state!=="windup"&&t.state!=="active"&&t.state!=="holding"){const u=ca(n,t.pos);u&&(t.focus=u.index)}const s=n.players[t.focus];t.t++,t.cooldown>0&&t.cooldown--,t.pos.x+=t.vel.x,t.pos.y+=t.vel.y,t.vel.x*=.82,t.vel.y*=.82;const r=At(s.pos,t.pos),a=Qt(r),o=Et(r),l=(u,f)=>{const d=At(u,t.pos),m=Qt(d);if(m<.05)return;if(t.state!=="spawn"&&(m>.6||t.state==="circle")){const x=Lc(t.pos,u);if(x!==u){const p=At(x,t.pos),h=Qt(p);if(h>.05){const T=Math.min(h,f/$.fps);t.pos.x+=p.x/h*T,t.pos.y+=p.y/h*T;return}}}const g=Math.min(m,f/$.fps);t.pos.x+=d.x/m*g,t.pos.y+=d.y/m*g},c=i.speed*(t.enraged?1.25:1);switch(t.state){case"spawn":l(t.entry,c),t.t>=t.dur&&mt(t,"circle",0);break;case"circle":{t.angle+=t.orbit*.006;const u={x:s.pos.x+Math.cos(t.angle)*i.circleRadius,y:s.pos.y+Math.sin(t.angle)*i.circleRadius};l(u,c*.6),t.facing=o;break}case"approach":{if(t.facing=o,a<=i.attackRange&&(t.kind!=="thrower"||Ws(t.pos,s.pos,.15))&&kn(s)&&s.state!=="grabbed"){Hc(t);break}l(s.pos,c),t.t>=t.dur&&(mt(t,"circle",0),t.cooldown=i.cooldown,t.string=0);break}case"windup":t.dur-t.t>i.trackUntil&&(t.facing=o,t.kind!=="thrower"&&a>i.attackRange*.9&&l(s.pos,c*.5)),t.t>=t.dur&&mt(t,"active",i.active);break;case"active":if(t.t===1)if(t.kind==="thrower"){const u={x:t.pos.x+t.facing.x*.6,y:t.pos.y+t.facing.y*.6};n.cups.push({id:n.nextId++,pos:u,vel:{x:t.facing.x*$.cup.speed,y:t.facing.y*$.cup.speed},owner:-1,from:t.id}),n.events.push({type:"throw",pos:u})}else!Co(s)&&s.state!=="grabbed"&&a<=i.attackRange+.35&&Z1(t.facing,o)>.5&&kc(n,s,t);t.state==="active"&&t.t>=t.dur&&mt(t,"recover",t.kind==="boss"&&t.unblockable?$.bossHaymaker.recovery:i.recovery);break;case"holding":if(t.facing=o,s.state!=="grabbed"){mt(t,"recover",i.recovery);break}if(s.pos={x:t.pos.x+t.facing.x*.8,y:t.pos.y+t.facing.y*.8},t.t%$.grab.tick===0&&V1(n,s,i.damage,t.pos,!1,0))break;t.t>=t.dur&&(St(s,"hitstun",30),s.pos={x:t.pos.x+t.facing.x*2,y:t.pos.y+t.facing.y*2},V1(n,s,$.grab.throwDamage,t.pos,!0,0),mt(t,"recover",i.recovery));break;case"recover":if(t.t>=t.dur){if(t.kind==="boss"&&(t.string=(t.string+1)%3,t.string!==0)){mt(t,"approach",120);break}mt(t,"circle",0),t.cooldown=Math.round((i.cooldown+Math.floor(F1(n)*40))*(t.enraged?.6:1))}break;case"stun":t.t>=t.dur&&(mt(t,"circle",0),t.cooldown=Math.max(t.cooldown,20));break;case"down":t.t>=t.dur&&mt(t,"getup",$.getupFrames);break;case"getup":t.t>=t.dur&&(mt(t,"circle",0),t.cooldown=i.cooldown);break}}}function Io(n){const{minX:e,maxX:t,minY:i,maxY:s}=ot.bounds;return n.x<e||n.x>t||n.y<i||n.y>s||Eo(n,-.05)}function Wc(n){n.cups=n.cups.filter(e=>{if(e.pos.x+=e.vel.x,e.pos.y+=e.vel.y,e.owner===-1){const t=n.players.find(i=>!Co(i)&&Bt(i.pos,e.pos)<$.cup.hitRadius);if(t)return!V1(n,t,$.thrower.damage,e.pos,!1,.3)&&t.state!=="grabbed"&&(St(t,"hitstun",16),t.combo=0),n.events.push({type:"shatter",pos:{...e.pos}}),!1}else{const t=n.enemies.find(i=>Ii(i)&&Bt(i.pos,e.pos)<$.cup.hitRadius+.1);if(t)return Ui(n,t,$.cup.deflectDamage,{x:e.pos.x-e.vel.x*5,y:e.pos.y-e.vel.y*5},5,0,!0,e.owner,!0),n.hitstop=$.hitstop.bottle,n.shake=.25,n.events.push({type:"hit",pos:{...e.pos},heavy:!0,by:e.owner}),!1}return Io(e.pos)?(n.events.push({type:"shatter",pos:{...e.pos}}),!1):!0})}function Xc(n){for(const e of n.bottles)if(e.state==="flying"){e.pos.x+=e.vel.x,e.pos.y+=e.vel.y;const t=n.enemies.find(i=>j1(i)&&i.state!=="down"&&Bt(i.pos,e.pos)<.7);t&&(Ui(n,t,$.bottle.damage,{x:e.pos.x-e.vel.x*5,y:e.pos.y-e.vel.y*5},5,0,!0,e.holder,!0),n.hitstop=$.hitstop.bottle,n.shake=.25,n.events.push({type:"hit",pos:{...e.pos},heavy:!0,by:e.holder})),(t||Io(e.pos))&&(e.state="broken",e.t=0,n.events.push({type:"shatter",pos:{...e.pos}}))}else if(e.state==="broken")++e.t>=$.bottle.respawn&&(e.state="ground",e.pos={...e.home});else if(e.state==="held"){const t=n.players[e.holder];e.pos={x:t.pos.x,y:t.pos.y}}}function qc(n){const{minX:e,maxX:t,minY:i,maxY:s}=ot.bounds;for(const r of n.enemies){if(r.state!=="down"||r.slammed||Qt(r.vel)<$.slam.speed)continue;const a=$[r.kind].radius;if(Eo(r.pos,a*.6)||r.pos.x-a<e||r.pos.x+a>t||r.pos.y-a<i||r.pos.y+a>s){r.slammed=!0,r.vel={x:0,y:0},r.hp-=$.slam.damage,r.hp<=0?(r.hp=0,mt(r,"dead",0),n.events.push({type:"ko",pos:{...r.pos},boss:r.kind==="boss"})):r.dur+=$.slam.extraDown,n.hitstop=$.hitstop.heavy,n.shake=.4,n.events.push({type:"slam",pos:{...r.pos}});continue}for(const l of n.enemies)l===r||!Ii(l)||l.kind==="boss"||Bt(l.pos,r.pos)>$[l.kind].radius+a||(Ui(n,l,$.slam.bowlDamage,r.pos,4,0,!0,r.lastHitBy,!0),n.events.push({type:"hit",pos:{...l.pos},heavy:!0,by:r.lastHitBy}))}}function Yc(n){const e=[...n.players.filter(o=>kn(o)&&o.state!=="grabbed").map(o=>({pos:o.pos,r:$.player.radius,fixed:o.state==="counter"})),...n.enemies.filter(o=>j1(o)&&o.state!=="down").map(o=>({pos:o.pos,r:$[o.kind].radius,fixed:o.kind==="boss"}))];for(let o=0;o<e.length;o++)for(let l=o+1;l<e.length;l++){const c=e[o],u=e[l],f=At(u.pos,c.pos),d=Qt(f),m=c.r+u.r;if(d>=m||d<1e-6)continue;const g=(m-d)/2,x={x:f.x/d,y:f.y/d},p=c.fixed&&!u.fixed?0:u.fixed&&!c.fixed?2:1,h=2-p;c.pos.x-=x.x*g*p,c.pos.y-=x.y*g*p,u.pos.x+=x.x*g*h,u.pos.y+=x.y*g*h}const{minX:t,maxX:i,minY:s,maxY:r}=ot.bounds,a=[...n.players.map(o=>({pos:o.pos,r:$.player.radius})),...n.enemies.filter(o=>o.state!=="spawn"&&o.state!=="dead").map(o=>({pos:o.pos,r:$[o.kind].radius}))];for(const{pos:o,r:l}of a)So(o,l),o.x=Math.max(t+l,Math.min(i-l,o.x)),o.y=Math.max(s+l,Math.min(r-l,o.y))}function Kc(n,e){const t=Array.isArray(e)?e:[e],i=s=>t[s.index]??To;if(n.events=[],n.frame++,n.shake*=.85,n.hitstop>0){n.hitstop--;for(const s of n.players){const r=i(s),a=r.counter?"counter":r.dodge?"dodge":r.attack?"attack":r.grab?"grab":null;a&&s.state==="grabbed"?s.escape++:a&&(s.buffer={action:a,frames:$.inputBuffer})}return n}if(n.result!=="playing")return n;for(const s of n.players)zc(n,s,i(s));return Gc(n),Wc(n),Xc(n),qc(n),Yc(n),n.enemies.every(s=>!j1(s))&&(n.waveTimer>0?n.waveTimer--:n.wave+1<$.waves.length?(Dc(n,n.wave+1),n.waveTimer=$.waveDelay):n.result="win"),n}const Wi={attack:2,counter:3,dodge:0,grab:1,start:9},$c={kb1:{up:["KeyW"],down:["KeyS"],left:["KeyA"],right:["KeyD"],attack:["KeyJ"],counter:["KeyK"],dodge:["Space","KeyL"],grab:["KeyE"],start:["Enter"]},kb2:{up:["ArrowUp"],down:["ArrowDown"],left:["ArrowLeft"],right:["ArrowRight"],attack:["Numpad1","Comma"],counter:["Numpad2","Period"],dodge:["Numpad0","Slash"],grab:["Numpad3","Quote"],start:["NumpadEnter","Backslash"]}};class Zc{down=new Set;pressed=new Set;prevPad=new Map;slots=[];constructor(){addEventListener("keydown",e=>{e.repeat||this.pressed.add(e.code),this.down.add(e.code),(e.code==="Space"||e.code.startsWith("Arrow")||e.code==="Slash"||e.code==="Quote")&&e.preventDefault()}),addEventListener("keyup",e=>this.down.delete(e.code)),addEventListener("blur",()=>this.down.clear())}pads(){return[...navigator.getGamepads?.()??[]].filter(e=>!!e&&e.connected)}readKeys(e){const t=$c[e],i=o=>o.some(l=>this.down.has(l)),s=o=>o.some(l=>this.pressed.has(l)),r={mx:(i(t.right)?1:0)-(i(t.left)?1:0),my:(i(t.down)?1:0)-(i(t.up)?1:0),attack:s(t.attack),counter:s(t.counter),dodge:s(t.dodge),grab:s(t.grab)},a=s(t.start);return{input:r,start:a,any:a||r.attack||r.counter||r.dodge||r.grab}}readPad(e){const t=e.buttons.map(f=>f.pressed),i=this.prevPad.get(e.index)??[],s=f=>!!t[f]&&!i[f];let r=0,a=0;const[o,l]=[e.axes[0]??0,e.axes[1]??0];Math.hypot(o,l)>.18&&(r=o,a=l),t[12]&&(a=-1),t[13]&&(a=1),t[14]&&(r=-1),t[15]&&(r=1);const c={mx:r,my:a,attack:s(Wi.attack),counter:s(Wi.counter),dodge:s(Wi.dodge),grab:s(Wi.grab)},u=s(Wi.start);return{input:c,start:u,any:u||c.attack||c.counter||c.dodge||c.grab}}poll(){const e=new Map;e.set("kb1",this.readKeys("kb1")),e.set("kb2",this.readKeys("kb2"));for(const t of this.pads())e.set(`pad${t.index}`,this.readPad(t)),this.prevPad.set(t.index,t.buttons.map(i=>i.pressed));return this.pressed.clear(),e}joiner(e){for(const[t,i]of e)if(i.any&&!this.slots.includes(t))return t;return null}inputFor(e,t){const i=this.slots[e];return i&&t.get(i)?.input||To}startPressed(e){return this.slots.some(t=>e.get(t)?.start)}isPad(e){return this.slots[e]?.startsWith("pad")??!1}rumble(e,t,i,s){const r=this.slots[e];if(!r?.startsWith("pad"))return;this.pads().find(o=>`pad${o.index}`===r)?.vibrationActuator?.playEffect?.("dual-rumble",{duration:s,strongMagnitude:t,weakMagnitude:i}).catch(()=>{})}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Br="180",jc=0,la=1,Jc=2,Uo=1,Qc=2,Tn=3,Hn=0,zt=1,bn=2,On=0,Pi=1,ua=2,ha=3,fa=4,el=5,Qn=100,tl=101,nl=102,il=103,sl=104,rl=200,al=201,ol=202,cl=203,qs=204,Ys=205,ll=206,ul=207,hl=208,fl=209,dl=210,pl=211,ml=212,gl=213,_l=214,Ks=0,$s=1,Zs=2,Ni=3,js=4,Js=5,Qs=6,er=7,No=0,xl=1,vl=2,Bn=0,Ml=1,yl=2,Sl=3,Fo=4,El=5,Tl=6,bl=7,Oo=300,Fi=301,Oi=302,tr=303,nr=304,J1=306,G1=1e3,ii=1001,ir=1002,cn=1003,Al=1004,p1=1005,fn=1006,rs=1007,si=1008,gn=1009,Bo=1010,zo=1011,n1=1012,zr=1013,oi=1014,An=1015,o1=1016,kr=1017,Hr=1018,i1=1020,ko=35902,Ho=35899,Vo=1021,Go=1022,on=1023,s1=1026,r1=1027,Wo=1028,Vr=1029,Xo=1030,Gr=1031,Wr=1033,O1=33776,B1=33777,z1=33778,k1=33779,sr=35840,rr=35841,ar=35842,or=35843,cr=36196,lr=37492,ur=37496,hr=37808,fr=37809,dr=37810,pr=37811,mr=37812,gr=37813,_r=37814,xr=37815,vr=37816,Mr=37817,yr=37818,Sr=37819,Er=37820,Tr=37821,br=36492,Ar=36494,wr=36495,Rr=36283,Cr=36284,Pr=36285,Lr=36286,wl=3200,Rl=3201,qo=0,Cl=1,Un="",Ot="srgb",Bi="srgb-linear",W1="linear",Je="srgb",di=7680,da=519,Pl=512,Ll=513,Dl=514,Yo=515,Il=516,Ul=517,Nl=518,Fl=519,pa=35044,ma="300 es",dn=2e3,X1=2001;class Hi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],as=Math.PI/180,Dr=180/Math.PI;function c1(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]).toLowerCase()}function Ge(n,e,t){return Math.max(e,Math.min(t,n))}function Ol(n,e){return(n%e+e)%e}function os(n,e,t){return(1-t)*n+t*e}function Xi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ft(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Ye{constructor(e=0,t=0){Ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class l1{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3];const d=r[a+0],m=r[a+1],g=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=x;return}if(f!==x||l!==d||c!==m||u!==g){let p=1-o;const h=l*d+c*m+u*g+f*x,T=h>=0?1:-1,b=1-h*h;if(b>Number.EPSILON){const w=Math.sqrt(b),R=Math.atan2(w,h*T);p=Math.sin(p*R)/w,o=Math.sin(o*R)/w}const S=o*T;if(l=l*p+d*S,c=c*p+m*S,u=u*p+g*S,f=f*p+x*S,p===1-o){const w=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=w,c*=w,u*=w,f*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=r[a],d=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+u*f+l*m-c*d,e[t+1]=l*g+u*d+c*f-o*m,e[t+2]=c*g+u*m+o*d-l*f,e[t+3]=u*g-o*f-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(r/2),d=l(i/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*u*f+c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f-d*m*g;break;case"YXZ":this._x=d*u*f+c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f+d*m*g;break;case"ZXY":this._x=d*u*f-c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f-d*m*g;break;case"ZYX":this._x=d*u*f-c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f+d*m*g;break;case"YZX":this._x=d*u*f+c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f-d*m*g;break;case"XZY":this._x=d*u*f-c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],d=i+o+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ga.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ga.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return cs.copy(this).projectOnVector(e),this.sub(cs)}reflect(e){return this.sub(cs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const cs=new D,ga=new l1;class Oe{constructor(e,t,i,s,r,a,o,l,c){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],m=i[5],g=i[8],x=s[0],p=s[3],h=s[6],T=s[1],b=s[4],S=s[7],w=s[2],R=s[5],C=s[8];return r[0]=a*x+o*T+l*w,r[3]=a*p+o*b+l*R,r[6]=a*h+o*S+l*C,r[1]=c*x+u*T+f*w,r[4]=c*p+u*b+f*R,r[7]=c*h+u*S+f*C,r[2]=d*x+m*T+g*w,r[5]=d*p+m*b+g*R,r[8]=d*h+m*S+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,d=o*l-u*r,m=c*r-a*l,g=t*f+i*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=f*x,e[1]=(s*c-u*i)*x,e[2]=(o*i-s*a)*x,e[3]=d*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=m*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ls.makeScale(e,t)),this}rotate(e){return this.premultiply(ls.makeRotation(-e)),this}translate(e,t){return this.premultiply(ls.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ls=new Oe;function Ko(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function q1(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Bl(){const n=q1("canvas");return n.style.display="block",n}const _a={};function a1(n){n in _a||(_a[n]=!0,console.warn(n))}function zl(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const xa=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),va=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kl(){const n={enabled:!0,workingColorSpace:Bi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Je&&(s.r=wn(s.r),s.g=wn(s.g),s.b=wn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(s.r=Li(s.r),s.g=Li(s.g),s.b=Li(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Un?W1:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return a1("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return a1("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Bi]:{primaries:e,whitePoint:i,transfer:W1,toXYZ:xa,fromXYZ:va,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:e,whitePoint:i,transfer:Je,toXYZ:xa,fromXYZ:va,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}}),n}const $e=kl();function wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Li(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let pi;class Hl{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{pi===void 0&&(pi=q1("canvas")),pi.width=e.width,pi.height=e.height;const s=pi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=pi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=q1("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(wn(t[i]/255)*255):t[i]=wn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vl=0;class Xr{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vl++}),this.uuid=c1(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(us(s[a].image)):r.push(us(s[a]))}else r=us(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function us(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Hl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Gl=0;const hs=new D;class Ut extends Hi{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,i=ii,s=ii,r=fn,a=si,o=on,l=gn,c=Ut.DEFAULT_ANISOTROPY,u=Un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gl++}),this.uuid=c1(),this.name="",this.source=new Xr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(hs).x}get height(){return this.source.getSize(hs).y}get depth(){return this.source.getSize(hs).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Oo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case G1:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case ir:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case G1:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case ir:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=Oo;Ut.DEFAULT_ANISOTROPY=1;class Qe{constructor(e=0,t=0,i=0,s=1){Qe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],m=l[5],g=l[9],x=l[2],p=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,S=(m+1)/2,w=(h+1)/2,R=(u+d)/4,C=(f+x)/4,U=(g+p)/4;return b>S&&b>w?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=R/i,r=C/i):S>w?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=R/s,r=U/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=C/r,s=U/r),this.set(i,s,r,t),this}let T=Math.sqrt((p-g)*(p-g)+(f-x)*(f-x)+(d-u)*(d-u));return Math.abs(T)<.001&&(T=1),this.x=(p-g)/T,this.y=(f-x)/T,this.z=(d-u)/T,this.w=Math.acos((c+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this.w=Ge(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this.w=Ge(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wl extends Hi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Qe(0,0,e,t),this.scissorTest=!1,this.viewport=new Qe(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Ut(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:fn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Xr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends Wl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class $o extends Ut{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xl extends Ut{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class u1{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,tn):tn.fromBufferAttribute(r,a),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),m1.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),m1.copy(i.boundingBox)),m1.applyMatrix4(e.matrixWorld),this.union(m1)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qi),g1.subVectors(this.max,qi),mi.subVectors(e.a,qi),gi.subVectors(e.b,qi),_i.subVectors(e.c,qi),Rn.subVectors(gi,mi),Cn.subVectors(_i,gi),Xn.subVectors(mi,_i);let t=[0,-Rn.z,Rn.y,0,-Cn.z,Cn.y,0,-Xn.z,Xn.y,Rn.z,0,-Rn.x,Cn.z,0,-Cn.x,Xn.z,0,-Xn.x,-Rn.y,Rn.x,0,-Cn.y,Cn.x,0,-Xn.y,Xn.x,0];return!fs(t,mi,gi,_i,g1)||(t=[1,0,0,0,1,0,0,0,1],!fs(t,mi,gi,_i,g1))?!1:(_1.crossVectors(Rn,Cn),t=[_1.x,_1.y,_1.z],fs(t,mi,gi,_i,g1))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const vn=[new D,new D,new D,new D,new D,new D,new D,new D],tn=new D,m1=new u1,mi=new D,gi=new D,_i=new D,Rn=new D,Cn=new D,Xn=new D,qi=new D,g1=new D,_1=new D,qn=new D;function fs(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){qn.fromArray(n,r);const o=s.x*Math.abs(qn.x)+s.y*Math.abs(qn.y)+s.z*Math.abs(qn.z),l=e.dot(qn),c=t.dot(qn),u=i.dot(qn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const ql=new u1,Yi=new D,ds=new D;class qr{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ql.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Yi.subVectors(e,this.center);const t=Yi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Yi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ds.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Yi.copy(e.center).add(ds)),this.expandByPoint(Yi.copy(e.center).sub(ds))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Mn=new D,ps=new D,x1=new D,Pn=new D,ms=new D,v1=new D,gs=new D;class Yl{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mn.copy(this.origin).addScaledVector(this.direction,t),Mn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ps.copy(e).add(t).multiplyScalar(.5),x1.copy(t).sub(e).normalize(),Pn.copy(this.origin).sub(ps);const r=e.distanceTo(t)*.5,a=-this.direction.dot(x1),o=Pn.dot(this.direction),l=-Pn.dot(x1),c=Pn.lengthSq(),u=Math.abs(1-a*a);let f,d,m,g;if(u>0)if(f=a*l-o,d=a*o-l,g=r*u,f>=0)if(d>=-g)if(d<=g){const x=1/u;f*=x,d*=x,m=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ps).addScaledVector(x1,d),m}intersectSphere(e,t){Mn.subVectors(e.center,this.origin);const i=Mn.dot(this.direction),s=Mn.dot(Mn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Mn)!==null}intersectTriangle(e,t,i,s,r){ms.subVectors(t,e),v1.subVectors(i,e),gs.crossVectors(ms,v1);let a=this.direction.dot(gs),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pn.subVectors(this.origin,e);const l=o*this.direction.dot(v1.crossVectors(Pn,v1));if(l<0)return null;const c=o*this.direction.dot(ms.cross(Pn));if(c<0||l+c>a)return null;const u=-o*Pn.dot(gs);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,i,s,r,a,o,l,c,u,f,d,m,g,x,p){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,f,d,m,g,x,p)}set(e,t,i,s,r,a,o,l,c,u,f,d,m,g,x,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=m,h[7]=g,h[11]=x,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/xi.setFromMatrixColumn(e,0).length(),r=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*u,m=a*f,g=o*u,x=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+g*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,m=l*f,g=c*u,x=c*f;t[0]=d+x*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,m=l*f,g=c*u,x=c*f;t[0]=d-x*o,t[4]=-a*f,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,m=a*f,g=o*u,x=o*f;t[0]=l*u,t[4]=g*c-m,t[8]=d*c+x,t[1]=l*f,t[5]=x*c+d,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,g=o*l,x=o*c;t[0]=l*u,t[4]=x-d*f,t[8]=g*f+m,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*f+g,t[10]=d-x*f}else if(e.order==="XZY"){const d=a*l,m=a*c,g=o*l,x=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=d*f+x,t[5]=a*u,t[9]=m*f-g,t[2]=g*f-m,t[6]=o*u,t[10]=x*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Kl,e,$l)}lookAt(e,t,i){const s=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),Ln.crossVectors(i,Vt),Ln.lengthSq()===0&&(Math.abs(i.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),Ln.crossVectors(i,Vt)),Ln.normalize(),M1.crossVectors(Vt,Ln),s[0]=Ln.x,s[4]=M1.x,s[8]=Vt.x,s[1]=Ln.y,s[5]=M1.y,s[9]=Vt.y,s[2]=Ln.z,s[6]=M1.z,s[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],m=i[13],g=i[2],x=i[6],p=i[10],h=i[14],T=i[3],b=i[7],S=i[11],w=i[15],R=s[0],C=s[4],U=s[8],y=s[12],M=s[1],P=s[5],F=s[9],z=s[13],Y=s[2],X=s[6],W=s[10],j=s[14],V=s[3],ae=s[7],k=s[11],ce=s[15];return r[0]=a*R+o*M+l*Y+c*V,r[4]=a*C+o*P+l*X+c*ae,r[8]=a*U+o*F+l*W+c*k,r[12]=a*y+o*z+l*j+c*ce,r[1]=u*R+f*M+d*Y+m*V,r[5]=u*C+f*P+d*X+m*ae,r[9]=u*U+f*F+d*W+m*k,r[13]=u*y+f*z+d*j+m*ce,r[2]=g*R+x*M+p*Y+h*V,r[6]=g*C+x*P+p*X+h*ae,r[10]=g*U+x*F+p*W+h*k,r[14]=g*y+x*z+p*j+h*ce,r[3]=T*R+b*M+S*Y+w*V,r[7]=T*C+b*P+S*X+w*ae,r[11]=T*U+b*F+S*W+w*k,r[15]=T*y+b*z+S*j+w*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],m=e[14],g=e[3],x=e[7],p=e[11],h=e[15];return g*(+r*l*f-s*c*f-r*o*d+i*c*d+s*o*m-i*l*m)+x*(+t*l*m-t*c*d+r*a*d-s*a*m+s*c*u-r*l*u)+p*(+t*c*f-t*o*m-r*a*f+i*a*m+r*o*u-i*c*u)+h*(-s*o*u-t*l*f+t*o*d+s*a*f-i*a*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],m=e[11],g=e[12],x=e[13],p=e[14],h=e[15],T=f*p*c-x*d*c+x*l*m-o*p*m-f*l*h+o*d*h,b=g*d*c-u*p*c-g*l*m+a*p*m+u*l*h-a*d*h,S=u*x*c-g*f*c+g*o*m-a*x*m-u*o*h+a*f*h,w=g*f*l-u*x*l-g*o*d+a*x*d+u*o*p-a*f*p,R=t*T+i*b+s*S+r*w;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return e[0]=T*C,e[1]=(x*d*r-f*p*r-x*s*m+i*p*m+f*s*h-i*d*h)*C,e[2]=(o*p*r-x*l*r+x*s*c-i*p*c-o*s*h+i*l*h)*C,e[3]=(f*l*r-o*d*r-f*s*c+i*d*c+o*s*m-i*l*m)*C,e[4]=b*C,e[5]=(u*p*r-g*d*r+g*s*m-t*p*m-u*s*h+t*d*h)*C,e[6]=(g*l*r-a*p*r-g*s*c+t*p*c+a*s*h-t*l*h)*C,e[7]=(a*d*r-u*l*r+u*s*c-t*d*c-a*s*m+t*l*m)*C,e[8]=S*C,e[9]=(g*f*r-u*x*r-g*i*m+t*x*m+u*i*h-t*f*h)*C,e[10]=(a*x*r-g*o*r+g*i*c-t*x*c-a*i*h+t*o*h)*C,e[11]=(u*o*r-a*f*r-u*i*c+t*f*c+a*i*m-t*o*m)*C,e[12]=w*C,e[13]=(u*x*s-g*f*s+g*i*d-t*x*d-u*i*p+t*f*p)*C,e[14]=(g*o*s-a*x*s-g*i*l+t*x*l+a*i*p-t*o*p)*C,e[15]=(a*f*s-u*o*s+u*i*l-t*f*l-a*i*d+t*o*d)*C,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,d=r*c,m=r*u,g=r*f,x=a*u,p=a*f,h=o*f,T=l*c,b=l*u,S=l*f,w=i.x,R=i.y,C=i.z;return s[0]=(1-(x+h))*w,s[1]=(m+S)*w,s[2]=(g-b)*w,s[3]=0,s[4]=(m-S)*R,s[5]=(1-(d+h))*R,s[6]=(p+T)*R,s[7]=0,s[8]=(g+b)*C,s[9]=(p-T)*C,s[10]=(1-(d+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=xi.set(s[0],s[1],s[2]).length();const a=xi.set(s[4],s[5],s[6]).length(),o=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],nn.copy(this);const c=1/r,u=1/a,f=1/o;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=u,nn.elements[5]*=u,nn.elements[6]*=u,nn.elements[8]*=f,nn.elements[9]*=f,nn.elements[10]*=f,t.setFromRotationMatrix(nn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=dn,l=!1){const c=this.elements,u=2*r/(t-e),f=2*r/(i-s),d=(t+e)/(t-e),m=(i+s)/(i-s);let g,x;if(l)g=r/(a-r),x=a*r/(a-r);else if(o===dn)g=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===X1)g=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=dn,l=!1){const c=this.elements,u=2/(t-e),f=2/(i-s),d=-(t+e)/(t-e),m=-(i+s)/(i-s);let g,x;if(l)g=1/(a-r),x=a/(a-r);else if(o===dn)g=-2/(a-r),x=-(a+r)/(a-r);else if(o===X1)g=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const xi=new D,nn=new ct,Kl=new D(0,0,0),$l=new D(1,1,1),Ln=new D,M1=new D,Vt=new D,Ma=new ct,ya=new l1;class _n{constructor(e=0,t=0,i=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],d=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ge(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ma.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ma,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ya.setFromEuler(this),this.setFromQuaternion(ya,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class Zo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Zl=0;const Sa=new D,vi=new l1,yn=new ct,y1=new D,Ki=new D,jl=new D,Jl=new l1,Ea=new D(1,0,0),Ta=new D(0,1,0),ba=new D(0,0,1),Aa={type:"added"},Ql={type:"removed"},Mi={type:"childadded",child:null},_s={type:"childremoved",child:null};class wt extends Hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zl++}),this.uuid=c1(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new D,t=new _n,i=new l1,s=new D(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new Oe}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.multiply(vi),this}rotateOnWorldAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.premultiply(vi),this}rotateX(e){return this.rotateOnAxis(Ea,e)}rotateY(e){return this.rotateOnAxis(Ta,e)}rotateZ(e){return this.rotateOnAxis(ba,e)}translateOnAxis(e,t){return Sa.copy(e).applyQuaternion(this.quaternion),this.position.add(Sa.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ea,e)}translateY(e){return this.translateOnAxis(Ta,e)}translateZ(e){return this.translateOnAxis(ba,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?y1.copy(e):y1.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ki.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yn.lookAt(Ki,y1,this.up):yn.lookAt(y1,Ki,this.up),this.quaternion.setFromRotationMatrix(yn),s&&(yn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(yn),this.quaternion.premultiply(vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Aa),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ql),_s.child=e,this.dispatchEvent(_s),_s.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Aa),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,e,jl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ki,Jl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),d=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}wt.DEFAULT_UP=new D(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new D,Sn=new D,xs=new D,En=new D,yi=new D,Si=new D,wa=new D,vs=new D,Ms=new D,ys=new D,Ss=new Qe,Es=new Qe,Ts=new Qe;class an{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),sn.subVectors(e,t),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){sn.subVectors(s,t),Sn.subVectors(i,t),xs.subVectors(e,t);const a=sn.dot(sn),o=sn.dot(Sn),l=sn.dot(xs),c=Sn.dot(Sn),u=Sn.dot(xs),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,m=(c*l-o*u)*d,g=(a*u-o*l)*d;return r.set(1-m-g,g,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(a,En.y),l.addScaledVector(o,En.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Ss.setScalar(0),Es.setScalar(0),Ts.setScalar(0),Ss.fromBufferAttribute(e,t),Es.fromBufferAttribute(e,i),Ts.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ss,r.x),a.addScaledVector(Es,r.y),a.addScaledVector(Ts,r.z),a}static isFrontFacing(e,t,i,s){return sn.subVectors(i,t),Sn.subVectors(e,t),sn.cross(Sn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),sn.cross(Sn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return an.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return an.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return an.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return an.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return an.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;yi.subVectors(s,i),Si.subVectors(r,i),vs.subVectors(e,i);const l=yi.dot(vs),c=Si.dot(vs);if(l<=0&&c<=0)return t.copy(i);Ms.subVectors(e,s);const u=yi.dot(Ms),f=Si.dot(Ms);if(u>=0&&f<=u)return t.copy(s);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(yi,a);ys.subVectors(e,r);const m=yi.dot(ys),g=Si.dot(ys);if(g>=0&&m<=g)return t.copy(r);const x=m*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Si,o);const p=u*g-m*f;if(p<=0&&f-u>=0&&m-g>=0)return wa.subVectors(r,s),o=(f-u)/(f-u+(m-g)),t.copy(s).addScaledVector(wa,o);const h=1/(p+x+d);return a=x*h,o=d*h,t.copy(i).addScaledVector(yi,a).addScaledVector(Si,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const jo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},S1={h:0,s:0,l:0};function bs(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=$e.workingColorSpace){if(e=Ol(e,1),t=Ge(t,0,1),i=Ge(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=bs(a,r,e+1/3),this.g=bs(a,r,e),this.b=bs(a,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Ot){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){const i=jo[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wn(e.r),this.g=wn(e.g),this.b=wn(e.b),this}copyLinearToSRGB(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return $e.workingToColorSpace(Pt.copy(this),e),Math.round(Ge(Pt.r*255,0,255))*65536+Math.round(Ge(Pt.g*255,0,255))*256+Math.round(Ge(Pt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Pt.copy(this),t);const i=Pt.r,s=Pt.g,r=Pt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Pt.copy(this),t),e.r=Pt.r,e.g=Pt.g,e.b=Pt.b,e}getStyle(e=Ot){$e.workingToColorSpace(Pt.copy(this),e);const t=Pt.r,i=Pt.g,s=Pt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Dn),this.setHSL(Dn.h+e,Dn.s+t,Dn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Dn),e.getHSL(S1);const i=os(Dn.h,S1.h,t),s=os(Dn.s,S1.s,t),r=os(Dn.l,S1.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pt=new qe;qe.NAMES=jo;let e2=0;class h1 extends Hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:e2++}),this.uuid=c1(),this.name="",this.type="Material",this.blending=Pi,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qs,this.blendDst=Ys,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=da,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(i.blending=this.blending),this.side!==Hn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==qs&&(i.blendSrc=this.blendSrc),this.blendDst!==Ys&&(i.blendDst=this.blendDst),this.blendEquation!==Qn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==da&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(i.stencilFail=this.stencilFail),this.stencilZFail!==di&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Nn extends h1{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=No,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new D,E1=new Ye;let t2=0;class pn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:t2++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=pa,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)E1.fromBufferAttribute(this,t),E1.applyMatrix3(e),this.setXY(t,E1.x,E1.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),r=Ft(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==pa&&(e.usage=this.usage),e}}class Jo extends pn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Qo extends pn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ft extends pn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let n2=0;const Kt=new ct,As=new wt,Ei=new D,Gt=new u1,$i=new u1,yt=new D;class en extends Hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n2++}),this.uuid=c1(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ko(e)?Qo:Jo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Oe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,i){return Kt.makeTranslation(e,t,i),this.applyMatrix4(Kt),this}scale(e,t,i){return Kt.makeScale(e,t,i),this.applyMatrix4(Kt),this}lookAt(e){return As.lookAt(e),As.updateMatrix(),this.applyMatrix4(As.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ft(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new u1);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];$i.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Gt.min,$i.min),Gt.expandByPoint(yt),yt.addVectors(Gt.max,$i.max),Gt.expandByPoint(yt)):(Gt.expandByPoint($i.min),Gt.expandByPoint($i.max))}Gt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)yt.fromBufferAttribute(o,c),l&&(Ei.fromBufferAttribute(e,c),yt.add(Ei)),s=Math.max(s,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<i.count;U++)o[U]=new D,l[U]=new D;const c=new D,u=new D,f=new D,d=new Ye,m=new Ye,g=new Ye,x=new D,p=new D;function h(U,y,M){c.fromBufferAttribute(i,U),u.fromBufferAttribute(i,y),f.fromBufferAttribute(i,M),d.fromBufferAttribute(r,U),m.fromBufferAttribute(r,y),g.fromBufferAttribute(r,M),u.sub(c),f.sub(c),m.sub(d),g.sub(d);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(P),p.copy(f).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(P),o[U].add(x),o[y].add(x),o[M].add(x),l[U].add(p),l[y].add(p),l[M].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let U=0,y=T.length;U<y;++U){const M=T[U],P=M.start,F=M.count;for(let z=P,Y=P+F;z<Y;z+=3)h(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const b=new D,S=new D,w=new D,R=new D;function C(U){w.fromBufferAttribute(s,U),R.copy(w);const y=o[U];b.copy(y),b.sub(w.multiplyScalar(w.dot(y))).normalize(),S.crossVectors(R,y);const P=S.dot(l[U])<0?-1:1;a.setXYZW(U,b.x,b.y,b.z,P)}for(let U=0,y=T.length;U<y;++U){const M=T[U],P=M.start,F=M.count;for(let z=P,Y=P+F;z<Y;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new pn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,u=new D,f=new D;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),x=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u);let m=0,g=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*u;for(let h=0;h<u;h++)d[g++]=c[m++]}return new pn(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new en,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const d=c[u],m=e(d,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let d=0,m=f.length;d<m;d++)u.push(f[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ra=new ct,Yn=new Yl,T1=new qr,Ca=new D,b1=new D,A1=new D,w1=new D,ws=new D,R1=new D,Pa=new D,C1=new D;class He extends wt{constructor(e=new en,t=new Nn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){R1.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(ws.fromBufferAttribute(f,e),a?R1.addScaledVector(ws,u):R1.addScaledVector(ws.sub(t),u))}t.add(R1)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),T1.copy(i.boundingSphere),T1.applyMatrix4(r),Yn.copy(e.ray).recast(e.near),!(T1.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(T1,Ca)===null||Yn.origin.distanceToSquared(Ca)>(e.far-e.near)**2))&&(Ra.copy(r).invert(),Yn.copy(e.ray).applyMatrix4(Ra),!(i.boundingBox!==null&&Yn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Yn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){const p=d[g],h=a[p.materialIndex],T=Math.max(p.start,m.start),b=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,w=b;S<w;S+=3){const R=o.getX(S),C=o.getX(S+1),U=o.getX(S+2);s=P1(this,h,e,i,c,u,f,R,C,U),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=g,h=x;p<h;p+=3){const T=o.getX(p),b=o.getX(p+1),S=o.getX(p+2);s=P1(this,a,e,i,c,u,f,T,b,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){const p=d[g],h=a[p.materialIndex],T=Math.max(p.start,m.start),b=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let S=T,w=b;S<w;S+=3){const R=S,C=S+1,U=S+2;s=P1(this,h,e,i,c,u,f,R,C,U),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=g,h=x;p<h;p+=3){const T=p,b=p+1,S=p+2;s=P1(this,a,e,i,c,u,f,T,b,S),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function i2(n,e,t,i,s,r,a,o){let l;if(e.side===zt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Hn,o),l===null)return null;C1.copy(o),C1.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(C1);return c<t.near||c>t.far?null:{distance:c,point:C1.clone(),object:n}}function P1(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,b1),n.getVertexPosition(l,A1),n.getVertexPosition(c,w1);const u=i2(n,e,t,i,b1,A1,w1,Pa);if(u){const f=new D;an.getBarycoord(Pa,b1,A1,w1,f),s&&(u.uv=an.getInterpolatedAttribute(s,o,l,c,f,new Ye)),r&&(u.uv1=an.getInterpolatedAttribute(r,o,l,c,f,new Ye)),a&&(u.normal=an.getInterpolatedAttribute(a,o,l,c,f,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new D,materialIndex:0};an.getNormal(b1,A1,w1,d.normal),u.face=d,u.barycoord=f}return u}class mn extends en{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let d=0,m=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(f,2));function g(x,p,h,T,b,S,w,R,C,U,y){const M=S/C,P=w/U,F=S/2,z=w/2,Y=R/2,X=C+1,W=U+1;let j=0,V=0;const ae=new D;for(let k=0;k<W;k++){const ce=k*P-z;for(let pe=0;pe<X;pe++){const Ne=pe*M-F;ae[x]=Ne*T,ae[p]=ce*b,ae[h]=Y,c.push(ae.x,ae.y,ae.z),ae[x]=0,ae[p]=0,ae[h]=R>0?1:-1,u.push(ae.x,ae.y,ae.z),f.push(pe/C),f.push(1-k/U),j+=1}}for(let k=0;k<U;k++)for(let ce=0;ce<C;ce++){const pe=d+ce+X*k,Ne=d+ce+X*(k+1),Be=d+(ce+1)+X*(k+1),We=d+(ce+1)+X*k;l.push(pe,Ne,We),l.push(Ne,Be,We),V+=6}o.addGroup(m,V,y),m+=V,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Dt(n){const e={};for(let t=0;t<n.length;t++){const i=zi(n[t]);for(const s in i)e[s]=i[s]}return e}function s2(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ec(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const r2={clone:zi,merge:Dt};var a2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,o2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends h1{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=a2,this.fragmentShader=o2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=s2(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class tc extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new D,La=new Ye,Da=new Ye;class Xt extends tc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Dr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Dr*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,La,Da),t.subVectors(Da,La)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(as*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ti=-90,bi=1;class c2 extends wt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xt(Ti,bi,e,t);s.layers=this.layers,this.add(s);const r=new Xt(Ti,bi,e,t);r.layers=this.layers,this.add(r);const a=new Xt(Ti,bi,e,t);a.layers=this.layers,this.add(a);const o=new Xt(Ti,bi,e,t);o.layers=this.layers,this.add(o);const l=new Xt(Ti,bi,e,t);l.layers=this.layers,this.add(l);const c=new Xt(Ti,bi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===dn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===X1)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(f,d,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class nc extends Ut{constructor(e=[],t=Fi,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class l2 extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new nc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new mn(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:zt,blending:On});r.uniforms.tEquirect.value=t;const a=new He(s,r),o=t.minFilter;return t.minFilter===si&&(t.minFilter=fn),new c2(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class Fn extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const u2={type:"move"};class Rs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,i),h=this._getHandJoint(c,x);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(u2)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Fn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Yr{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new qe(e),this.near=t,this.far=i}clone(){return new Yr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class h2 extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Cs=new D,f2=new D,d2=new Oe;class jn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Cs.subVectors(i,t).cross(f2.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Cs),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||d2.getNormalMatrix(e),s=this.coplanarPoint(Cs).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Kn=new qr,p2=new Ye(.5,.5),L1=new D;class Kr{constructor(e=new jn,t=new jn,i=new jn,s=new jn,r=new jn,a=new jn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=dn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],d=r[6],m=r[7],g=r[8],x=r[9],p=r[10],h=r[11],T=r[12],b=r[13],S=r[14],w=r[15];if(s[0].setComponents(c-a,m-u,h-g,w-T).normalize(),s[1].setComponents(c+a,m+u,h+g,w+T).normalize(),s[2].setComponents(c+o,m+f,h+x,w+b).normalize(),s[3].setComponents(c-o,m-f,h-x,w-b).normalize(),i)s[4].setComponents(l,d,p,S).normalize(),s[5].setComponents(c-l,m-d,h-p,w-S).normalize();else if(s[4].setComponents(c-l,m-d,h-p,w-S).normalize(),t===dn)s[5].setComponents(c+l,m+d,h+p,w+S).normalize();else if(t===X1)s[5].setComponents(l,d,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Kn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Kn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Kn)}intersectsSprite(e){Kn.center.set(0,0,0);const t=p2.distanceTo(e.center);return Kn.radius=.7071067811865476+t,Kn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Kn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(L1.x=s.normal.x>0?e.max.x:e.min.x,L1.y=s.normal.y>0?e.max.y:e.min.y,L1.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(L1)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ic extends Ut{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class sc extends Ut{constructor(e,t,i=oi,s,r,a,o=cn,l=cn,c,u=s1,f=1){if(u!==s1&&u!==r1)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Xr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class rc extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class e1 extends en{constructor(e=1,t=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:s,heightSegments:r},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],u=t/2,f=Math.PI/2*e,d=t,m=2*f+d,g=i*2+r,x=s+1,p=new D,h=new D;for(let T=0;T<=g;T++){let b=0,S=0,w=0,R=0;if(T<=i){const y=T/i,M=y*Math.PI/2;S=-u-e*Math.cos(M),w=e*Math.sin(M),R=-e*Math.cos(M),b=y*f}else if(T<=i+r){const y=(T-i)/r;S=-u+y*t,w=e,R=0,b=f+y*d}else{const y=(T-i-r)/i,M=y*Math.PI/2;S=u+e*Math.sin(M),w=e*Math.cos(M),R=e*Math.sin(M),b=f+d+y*f}const C=Math.max(0,Math.min(1,b/m));let U=0;T===0?U=.5/s:T===g&&(U=-.5/s);for(let y=0;y<=s;y++){const M=y/s,P=M*Math.PI*2,F=Math.sin(P),z=Math.cos(P);h.x=-w*z,h.y=S,h.z=w*F,o.push(h.x,h.y,h.z),p.set(-w*z,R,w*F),p.normalize(),l.push(p.x,p.y,p.z),c.push(M+U,C)}if(T>0){const y=(T-1)*x;for(let M=0;M<s;M++){const P=y+M,F=y+M+1,z=T*x+M,Y=T*x+M+1;a.push(P,F,z),a.push(F,Y,z)}}}this.setIndex(a),this.setAttribute("position",new ft(o,3)),this.setAttribute("normal",new ft(l,3)),this.setAttribute("uv",new ft(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new e1(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class $r extends en{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new D,u=new Ye;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,d=3;f<=t;f++,d+=3){const m=i+f/t*s;c.x=e*Math.cos(m),c.y=e*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/e+1)/2,u.y=(a[d+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new ft(a,3)),this.setAttribute("normal",new ft(o,3)),this.setAttribute("uv",new ft(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $r(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ki extends en{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],f=[],d=[],m=[];let g=0;const x=[],p=i/2;let h=0;T(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new ft(f,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(m,2));function T(){const S=new D,w=new D;let R=0;const C=(t-e)/i;for(let U=0;U<=r;U++){const y=[],M=U/r,P=M*(t-e)+e;for(let F=0;F<=s;F++){const z=F/s,Y=z*l+o,X=Math.sin(Y),W=Math.cos(Y);w.x=P*X,w.y=-M*i+p,w.z=P*W,f.push(w.x,w.y,w.z),S.set(X,C,W).normalize(),d.push(S.x,S.y,S.z),m.push(z,1-M),y.push(g++)}x.push(y)}for(let U=0;U<s;U++)for(let y=0;y<r;y++){const M=x[y][U],P=x[y+1][U],F=x[y+1][U+1],z=x[y][U+1];(e>0||y!==0)&&(u.push(M,P,z),R+=3),(t>0||y!==r-1)&&(u.push(P,F,z),R+=3)}c.addGroup(h,R,0),h+=R}function b(S){const w=g,R=new Ye,C=new D;let U=0;const y=S===!0?e:t,M=S===!0?1:-1;for(let F=1;F<=s;F++)f.push(0,p*M,0),d.push(0,M,0),m.push(.5,.5),g++;const P=g;for(let F=0;F<=s;F++){const Y=F/s*l+o,X=Math.cos(Y),W=Math.sin(Y);C.x=y*W,C.y=p*M,C.z=y*X,f.push(C.x,C.y,C.z),d.push(0,M,0),R.x=X*.5+.5,R.y=W*.5*M+.5,m.push(R.x,R.y),g++}for(let F=0;F<s;F++){const z=w+F,Y=P+F;S===!0?u.push(Y,Y+1,z):u.push(Y+1,Y,z),U+=3}c.addGroup(h,U,S===!0?1:2),h+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zn extends en{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=e/o,d=t/l,m=[],g=[],x=[],p=[];for(let h=0;h<u;h++){const T=h*d-a;for(let b=0;b<c;b++){const S=b*f-r;g.push(S,-T,0),x.push(0,0,1),p.push(b/o),p.push(1-h/l)}}for(let h=0;h<l;h++)for(let T=0;T<o;T++){const b=T+c*h,S=T+c*(h+1),w=T+1+c*(h+1),R=T+1+c*h;m.push(b,S,R),m.push(S,w,R)}this.setIndex(m),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Zt extends en{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new D,d=new D,m=[],g=[],x=[],p=[];for(let h=0;h<=i;h++){const T=[],b=h/i;let S=0;h===0&&a===0?S=.5/t:h===i&&l===Math.PI&&(S=-.5/t);for(let w=0;w<=t;w++){const R=w/t;f.x=-e*Math.cos(s+R*r)*Math.sin(a+b*o),f.y=e*Math.cos(a+b*o),f.z=e*Math.sin(s+R*r)*Math.sin(a+b*o),g.push(f.x,f.y,f.z),d.copy(f).normalize(),x.push(d.x,d.y,d.z),p.push(R+S,1-b),T.push(c++)}u.push(T)}for(let h=0;h<i;h++)for(let T=0;T<t;T++){const b=u[h][T+1],S=u[h][T],w=u[h+1][T],R=u[h+1][T+1];(h!==0||a>0)&&m.push(b,S,R),(h!==i-1||l<Math.PI)&&m.push(S,w,R)}this.setIndex(m),this.setAttribute("position",new ft(g,3)),this.setAttribute("normal",new ft(x,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Q1 extends en{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new D,f=new D,d=new D;for(let m=0;m<=i;m++)for(let g=0;g<=s;g++){const x=g/s*r,p=m/i*Math.PI*2;f.x=(e+t*Math.cos(p))*Math.cos(x),f.y=(e+t*Math.cos(p))*Math.sin(x),f.z=t*Math.sin(p),o.push(f.x,f.y,f.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),d.subVectors(f,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let g=1;g<=s;g++){const x=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,h=(s+1)*(m-1)+g,T=(s+1)*m+g;a.push(x,p,T),a.push(p,h,T)}this.setIndex(a),this.setAttribute("position",new ft(o,3)),this.setAttribute("normal",new ft(l,3)),this.setAttribute("uv",new ft(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Q1(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ri extends h1{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qo,this.normalScale=new Ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class m2 extends h1{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=wl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class g2 extends h1{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zr extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class _2 extends Zr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ps=new ct,Ia=new D,Ua=new D;class ac{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ye(512,512),this.mapType=gn,this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kr,this._frameExtents=new Ye(1,1),this._viewportCount=1,this._viewports=[new Qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Ia.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ia),Ua.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ua),t.updateMatrixWorld(),Ps.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ps,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ps)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Na=new ct,Zi=new D,Ls=new D;class x2 extends ac{constructor(){super(new Xt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ye(4,2),this._viewportCount=6,this._viewports=[new Qe(2,1,1,1),new Qe(0,1,1,1),new Qe(3,1,1,1),new Qe(1,1,1,1),new Qe(3,0,1,1),new Qe(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,r=e.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),Zi.setFromMatrixPosition(e.matrixWorld),i.position.copy(Zi),Ls.copy(i.position),Ls.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ls),i.updateMatrixWorld(),s.makeTranslation(-Zi.x,-Zi.y,-Zi.z),Na.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Na,i.coordinateSystem,i.reversedDepth)}}class v2 extends Zr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new x2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class oc extends tc{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class M2 extends ac{constructor(){super(new oc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class y2 extends Zr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new M2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class S2 extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function Fa(n,e,t,i){const s=E2(i);switch(t){case Vo:return n*e;case Wo:return n*e/s.components*s.byteLength;case Vr:return n*e/s.components*s.byteLength;case Xo:return n*e*2/s.components*s.byteLength;case Gr:return n*e*2/s.components*s.byteLength;case Go:return n*e*3/s.components*s.byteLength;case on:return n*e*4/s.components*s.byteLength;case Wr:return n*e*4/s.components*s.byteLength;case O1:case B1:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case z1:case k1:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case rr:case or:return Math.max(n,16)*Math.max(e,8)/4;case sr:case ar:return Math.max(n,8)*Math.max(e,8)/2;case cr:case lr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ur:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case hr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case fr:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case dr:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case pr:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case mr:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case gr:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case _r:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case xr:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case vr:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Mr:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case yr:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Sr:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Er:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Tr:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case br:case Ar:case wr:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Rr:case Cr:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pr:case Lr:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function E2(n){switch(n){case gn:case Bo:return{byteLength:1,components:1};case n1:case zo:case o1:return{byteLength:2,components:1};case kr:case Hr:return{byteLength:2,components:4};case oi:case zr:case An:return{byteLength:4,components:1};case ko:case Ho:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Br}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Br);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cc(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function T2(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,u);else{f.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<f.length;m++){const g=f[d],x=f[m];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,f[d]=x)}f.length=d+1;for(let m=0,g=f.length;m<g;m++){const x=f[m];n.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var b2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,A2=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,w2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,R2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,C2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,P2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,L2=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,D2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,I2=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,U2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,N2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,F2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,O2=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,B2=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,z2=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,k2=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,H2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,V2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,G2=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,W2=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,X2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,q2=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Y2=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,K2=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$2=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Z2=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,j2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,J2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Q2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,e0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,t0="gl_FragColor = linearToOutputTexel( gl_FragColor );",n0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,i0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,r0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,o0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,c0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,l0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,u0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,h0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,f0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,d0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,p0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,m0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,g0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,_0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,x0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,M0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,S0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,E0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,T0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,b0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,A0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,w0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,R0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,L0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,D0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,U0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,N0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,F0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,O0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,B0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,z0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,H0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,G0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Y0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,K0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Z0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,j0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Q0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,e3=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,t3=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,n3=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,i3=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,s3=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,r3=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,a3=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,o3=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,c3=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,l3=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,u3=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,h3=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,f3=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,d3=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,p3=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,m3=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,g3=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_3=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,x3=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,v3=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,M3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,y3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,S3=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,E3=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const T3=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,b3=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A3=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,w3=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R3=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,C3=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,P3=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,L3=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,D3=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,I3=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,U3=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,N3=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F3=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,O3=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,B3=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,z3=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,k3=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,H3=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V3=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,G3=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,W3=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,X3=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,q3=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y3=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K3=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$3=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z3=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,j3=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J3=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Q3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,eu=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tu=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,nu=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:b2,alphahash_pars_fragment:A2,alphamap_fragment:w2,alphamap_pars_fragment:R2,alphatest_fragment:C2,alphatest_pars_fragment:P2,aomap_fragment:L2,aomap_pars_fragment:D2,batching_pars_vertex:I2,batching_vertex:U2,begin_vertex:N2,beginnormal_vertex:F2,bsdfs:O2,iridescence_fragment:B2,bumpmap_pars_fragment:z2,clipping_planes_fragment:k2,clipping_planes_pars_fragment:H2,clipping_planes_pars_vertex:V2,clipping_planes_vertex:G2,color_fragment:W2,color_pars_fragment:X2,color_pars_vertex:q2,color_vertex:Y2,common:K2,cube_uv_reflection_fragment:$2,defaultnormal_vertex:Z2,displacementmap_pars_vertex:j2,displacementmap_vertex:J2,emissivemap_fragment:Q2,emissivemap_pars_fragment:e0,colorspace_fragment:t0,colorspace_pars_fragment:n0,envmap_fragment:i0,envmap_common_pars_fragment:s0,envmap_pars_fragment:r0,envmap_pars_vertex:a0,envmap_physical_pars_fragment:_0,envmap_vertex:o0,fog_vertex:c0,fog_pars_vertex:l0,fog_fragment:u0,fog_pars_fragment:h0,gradientmap_pars_fragment:f0,lightmap_pars_fragment:d0,lights_lambert_fragment:p0,lights_lambert_pars_fragment:m0,lights_pars_begin:g0,lights_toon_fragment:x0,lights_toon_pars_fragment:v0,lights_phong_fragment:M0,lights_phong_pars_fragment:y0,lights_physical_fragment:S0,lights_physical_pars_fragment:E0,lights_fragment_begin:T0,lights_fragment_maps:b0,lights_fragment_end:A0,logdepthbuf_fragment:w0,logdepthbuf_pars_fragment:R0,logdepthbuf_pars_vertex:C0,logdepthbuf_vertex:P0,map_fragment:L0,map_pars_fragment:D0,map_particle_fragment:I0,map_particle_pars_fragment:U0,metalnessmap_fragment:N0,metalnessmap_pars_fragment:F0,morphinstance_vertex:O0,morphcolor_vertex:B0,morphnormal_vertex:z0,morphtarget_pars_vertex:k0,morphtarget_vertex:H0,normal_fragment_begin:V0,normal_fragment_maps:G0,normal_pars_fragment:W0,normal_pars_vertex:X0,normal_vertex:q0,normalmap_pars_fragment:Y0,clearcoat_normal_fragment_begin:K0,clearcoat_normal_fragment_maps:$0,clearcoat_pars_fragment:Z0,iridescence_pars_fragment:j0,opaque_fragment:J0,packing:Q0,premultiplied_alpha_fragment:e3,project_vertex:t3,dithering_fragment:n3,dithering_pars_fragment:i3,roughnessmap_fragment:s3,roughnessmap_pars_fragment:r3,shadowmap_pars_fragment:a3,shadowmap_pars_vertex:o3,shadowmap_vertex:c3,shadowmask_pars_fragment:l3,skinbase_vertex:u3,skinning_pars_vertex:h3,skinning_vertex:f3,skinnormal_vertex:d3,specularmap_fragment:p3,specularmap_pars_fragment:m3,tonemapping_fragment:g3,tonemapping_pars_fragment:_3,transmission_fragment:x3,transmission_pars_fragment:v3,uv_pars_fragment:M3,uv_pars_vertex:y3,uv_vertex:S3,worldpos_vertex:E3,background_vert:T3,background_frag:b3,backgroundCube_vert:A3,backgroundCube_frag:w3,cube_vert:R3,cube_frag:C3,depth_vert:P3,depth_frag:L3,distanceRGBA_vert:D3,distanceRGBA_frag:I3,equirect_vert:U3,equirect_frag:N3,linedashed_vert:F3,linedashed_frag:O3,meshbasic_vert:B3,meshbasic_frag:z3,meshlambert_vert:k3,meshlambert_frag:H3,meshmatcap_vert:V3,meshmatcap_frag:G3,meshnormal_vert:W3,meshnormal_frag:X3,meshphong_vert:q3,meshphong_frag:Y3,meshphysical_vert:K3,meshphysical_frag:$3,meshtoon_vert:Z3,meshtoon_frag:j3,points_vert:J3,points_frag:Q3,shadow_vert:eu,shadow_frag:tu,sprite_vert:nu,sprite_frag:iu},oe={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},hn={basic:{uniforms:Dt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:Dt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new qe(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:Dt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:Dt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:Dt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new qe(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:Dt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:Dt([oe.points,oe.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:Dt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:Dt([oe.common,oe.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:Dt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:Dt([oe.sprite,oe.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:Dt([oe.common,oe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:Dt([oe.lights,oe.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};hn.physical={uniforms:Dt([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const D1={r:0,b:0,g:0},$n=new _n,su=new ct;function ru(n,e,t,i,s,r,a){const o=new qe(0);let l=r===!0?0:1,c,u,f=null,d=0,m=null;function g(b){let S=b.isScene===!0?b.background:null;return S&&S.isTexture&&(S=(b.backgroundBlurriness>0?t:e).get(S)),S}function x(b){let S=!1;const w=g(b);w===null?h(o,l):w&&w.isColor&&(h(w,1),S=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(b,S){const w=g(S);w&&(w.isCubeTexture||w.mapping===J1)?(u===void 0&&(u=new He(new mn(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:zi(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,C,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),$n.copy(S.backgroundRotation),$n.x*=-1,$n.y*=-1,$n.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(su.makeRotationFromEuler($n)),u.material.toneMapped=$e.getTransfer(w.colorSpace)!==Je,(f!==w||d!==w.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,f=w,d=w.version,m=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new He(new zn(2,2),new Vn({name:"BackgroundMaterial",uniforms:zi(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=$e.getTransfer(w.colorSpace)!==Je,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(f!==w||d!==w.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,f=w,d=w.version,m=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function h(b,S){b.getRGB(D1,ec(n)),i.buffers.color.setClear(D1.r,D1.g,D1.b,S,a)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,S=1){o.set(b),l=S,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,h(o,l)},render:x,addToRenderList:p,dispose:T}}function au(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(M,P,F,z,Y){let X=!1;const W=f(z,F,P);r!==W&&(r=W,c(r.object)),X=m(M,z,F,Y),X&&g(M,z,F,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,S(M,P,F,z),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function f(M,P,F){const z=F.wireframe===!0;let Y=i[M.id];Y===void 0&&(Y={},i[M.id]=Y);let X=Y[P.id];X===void 0&&(X={},Y[P.id]=X);let W=X[z];return W===void 0&&(W=d(l()),X[z]=W),W}function d(M){const P=[],F=[],z=[];for(let Y=0;Y<t;Y++)P[Y]=0,F[Y]=0,z[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:z,object:M,attributes:{},index:null}}function m(M,P,F,z){const Y=r.attributes,X=P.attributes;let W=0;const j=F.getAttributes();for(const V in j)if(j[V].location>=0){const k=Y[V];let ce=X[V];if(ce===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),k===void 0||k.attribute!==ce||ce&&k.data!==ce.data)return!0;W++}return r.attributesNum!==W||r.index!==z}function g(M,P,F,z){const Y={},X=P.attributes;let W=0;const j=F.getAttributes();for(const V in j)if(j[V].location>=0){let k=X[V];k===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(k=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(k=M.instanceColor));const ce={};ce.attribute=k,k&&k.data&&(ce.data=k.data),Y[V]=ce,W++}r.attributes=Y,r.attributesNum=W,r.index=z}function x(){const M=r.newAttributes;for(let P=0,F=M.length;P<F;P++)M[P]=0}function p(M){h(M,0)}function h(M,P){const F=r.newAttributes,z=r.enabledAttributes,Y=r.attributeDivisors;F[M]=1,z[M]===0&&(n.enableVertexAttribArray(M),z[M]=1),Y[M]!==P&&(n.vertexAttribDivisor(M,P),Y[M]=P)}function T(){const M=r.newAttributes,P=r.enabledAttributes;for(let F=0,z=P.length;F<z;F++)P[F]!==M[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function b(M,P,F,z,Y,X,W){W===!0?n.vertexAttribIPointer(M,P,F,Y,X):n.vertexAttribPointer(M,P,F,z,Y,X)}function S(M,P,F,z){x();const Y=z.attributes,X=F.getAttributes(),W=P.defaultAttributeValues;for(const j in X){const V=X[j];if(V.location>=0){let ae=Y[j];if(ae===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor)),ae!==void 0){const k=ae.normalized,ce=ae.itemSize,pe=e.get(ae);if(pe===void 0)continue;const Ne=pe.buffer,Be=pe.type,We=pe.bytesPerElement,K=Be===n.INT||Be===n.UNSIGNED_INT||ae.gpuType===zr;if(ae.isInterleavedBufferAttribute){const J=ae.data,de=J.stride,De=ae.offset;if(J.isInstancedInterleavedBuffer){for(let be=0;be<V.locationSize;be++)h(V.location+be,J.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let be=0;be<V.locationSize;be++)p(V.location+be);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let be=0;be<V.locationSize;be++)b(V.location+be,ce/V.locationSize,Be,k,de*We,(De+ce/V.locationSize*be)*We,K)}else{if(ae.isInstancedBufferAttribute){for(let J=0;J<V.locationSize;J++)h(V.location+J,ae.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let J=0;J<V.locationSize;J++)p(V.location+J);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let J=0;J<V.locationSize;J++)b(V.location+J,ce/V.locationSize,Be,k,ce*We,ce/V.locationSize*J*We,K)}}else if(W!==void 0){const k=W[j];if(k!==void 0)switch(k.length){case 2:n.vertexAttrib2fv(V.location,k);break;case 3:n.vertexAttrib3fv(V.location,k);break;case 4:n.vertexAttrib4fv(V.location,k);break;default:n.vertexAttrib1fv(V.location,k)}}}}T()}function w(){U();for(const M in i){const P=i[M];for(const F in P){const z=P[F];for(const Y in z)u(z[Y].object),delete z[Y];delete P[F]}delete i[M]}}function R(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const F in P){const z=P[F];for(const Y in z)u(z[Y].object),delete z[Y];delete P[F]}delete i[M.id]}function C(M){for(const P in i){const F=i[P];if(F[M.id]===void 0)continue;const z=F[M.id];for(const Y in z)u(z[Y].object),delete z[Y];delete F[M.id]}}function U(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:U,resetDefaultState:y,dispose:w,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:p,disableUnusedAttributes:T}}function ou(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let m=0;for(let g=0;g<f;g++)m+=u[g];t.update(m,i,1)}function l(c,u,f,d){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,f);let g=0;for(let x=0;x<f;x++)g+=u[x]*d[x];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function cu(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==on&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const U=C===o1&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==gn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==An&&!U)}function l(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,R=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:T,maxVaryings:b,maxFragmentUniforms:S,vertexTextures:w,maxSamples:R}}function lu(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new jn,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||i!==0||s;return s=d,i=f.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,m){const g=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,h=n.get(f);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{const T=r?0:i,b=T*4;let S=h.clippingState||null;l.value=S,S=u(g,d,b,m);for(let w=0;w!==b;++w)S[w]=t[w];h.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,m,g){const x=f!==null?f.length:0;let p=null;if(x!==0){if(p=l.value,g!==!0||p===null){const h=m+x*4,T=d.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<h)&&(p=new Float32Array(h));for(let b=0,S=m;b!==x;++b,S+=4)a.copy(f[b]).applyMatrix4(T,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function uu(n){let e=new WeakMap;function t(a,o){return o===tr?a.mapping=Fi:o===nr&&(a.mapping=Oi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===tr||o===nr)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new l2(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Ri=4,Oa=[.125,.215,.35,.446,.526,.582],ei=20,Ds=new oc,Ba=new qe;let Is=null,Us=0,Ns=0,Fs=!1;const Jn=(1+Math.sqrt(5))/2,Ai=1/Jn,za=[new D(-Jn,Ai,0),new D(Jn,Ai,0),new D(-Ai,0,Jn),new D(Ai,0,Jn),new D(0,Jn,-Ai),new D(0,Jn,Ai),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],hu=new D;class ka{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=hu}=r;Is=this._renderer.getRenderTarget(),Us=this._renderer.getActiveCubeFace(),Ns=this._renderer.getActiveMipmapLevel(),Fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ga(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Va(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Is,Us,Ns),this._renderer.xr.enabled=Fs,e.scissorTest=!1,I1(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fi||e.mapping===Oi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Is=this._renderer.getRenderTarget(),Us=this._renderer.getActiveCubeFace(),Ns=this._renderer.getActiveMipmapLevel(),Fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:o1,format:on,colorSpace:Bi,depthBuffer:!1},s=Ha(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ha(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fu(r)),this._blurMaterial=du(r,e,t)}return s}_compileMaterial(e){const t=new He(this._lodPlanes[0],e);this._renderer.compile(t,Ds)}_sceneToCubeUV(e,t,i,s,r){const l=new Xt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,m=f.toneMapping;f.getClearColor(Ba),f.toneMapping=Bn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null));const x=new Nn({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1}),p=new He(new mn,x);let h=!1;const T=e.background;T?T.isColor&&(x.color.copy(T),e.background=null,h=!0):(x.color.copy(Ba),h=!0);for(let b=0;b<6;b++){const S=b%3;S===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):S===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));const w=this._cubeSize;I1(s,S*w,b>2?w:0,w,w),f.setRenderTarget(s),h&&f.render(p,l),f.render(e,l)}p.geometry.dispose(),p.material.dispose(),f.toneMapping=m,f.autoClear=d,e.background=T}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Fi||e.mapping===Oi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ga()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Va());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new He(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;I1(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Ds)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=za[(s-r-1)%za.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new He(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ei-1),x=r/g,p=isFinite(r)?1+Math.floor(u*x):ei;p>ei&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const h=[];let T=0;for(let C=0;C<ei;++C){const U=C/x,y=Math.exp(-U*U/2);h.push(y),C===0?T+=y:C<p&&(T+=2*y)}for(let C=0;C<h.length;C++)h[C]=h[C]/T;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=h,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-i;const S=this._sizeLods[s],w=3*S*(s>b-Ri?s-b+Ri:0),R=4*(this._cubeSize-S);I1(t,w,R,3*S,2*S),l.setRenderTarget(t),l.render(f,Ds)}}function fu(n){const e=[],t=[],i=[];let s=n;const r=n-Ri+1+Oa.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Ri?l=Oa[a-n+Ri-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,g=6,x=3,p=2,h=1,T=new Float32Array(x*g*m),b=new Float32Array(p*g*m),S=new Float32Array(h*g*m);for(let R=0;R<m;R++){const C=R%3*2/3-1,U=R>2?0:-1,y=[C,U,0,C+2/3,U,0,C+2/3,U+1,0,C,U,0,C+2/3,U+1,0,C,U+1,0];T.set(y,x*g*R),b.set(d,p*g*R);const M=[R,R,R,R,R,R];S.set(M,h*g*R)}const w=new en;w.setAttribute("position",new pn(T,x)),w.setAttribute("uv",new pn(b,p)),w.setAttribute("faceIndex",new pn(S,h)),e.push(w),s>Ri&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Ha(n,e,t){const i=new ci(n,e,t);return i.texture.mapping=J1,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function I1(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function du(n,e,t){const i=new Float32Array(ei),s=new D(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:jr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Va(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Ga(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function jr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function pu(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===tr||l===nr,u=l===Fi||l===Oi;if(c||u){let f=e.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new ka(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new ka(n)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function mu(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&a1("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function gu(n,e,t,i){const s={},r=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)e.update(d[m],n.ARRAY_BUFFER)}function c(f){const d=[],m=f.index,g=f.attributes.position;let x=0;if(m!==null){const T=m.array;x=m.version;for(let b=0,S=T.length;b<S;b+=3){const w=T[b+0],R=T[b+1],C=T[b+2];d.push(w,R,R,C,C,w)}}else if(g!==void 0){const T=g.array;x=g.version;for(let b=0,S=T.length/3-1;b<S;b+=3){const w=b+0,R=b+1,C=b+2;d.push(w,R,R,C,C,w)}}else return;const p=new(Ko(d)?Qo:Jo)(d,1);p.version=x;const h=r.get(f);h&&e.remove(h),r.set(f,p)}function u(f){const d=r.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function _u(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,m){n.drawElements(i,m,r,d*a),t.update(m,i,1)}function c(d,m,g){g!==0&&(n.drawElementsInstanced(i,m,r,d*a,g),t.update(m,i,g))}function u(d,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,d,0,g);let p=0;for(let h=0;h<g;h++)p+=m[h];t.update(p,i,1)}function f(d,m,g,x){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<d.length;h++)c(d[h]/a,m[h],x[h]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,d,0,x,0,g);let h=0;for(let T=0;T<g;T++)h+=m[T]*x[T];t.update(h,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function xu(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function vu(n,e,t){const i=new WeakMap,s=new Qe;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let M=function(){U.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var m=M;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],T=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let S=0;g===!0&&(S=1),x===!0&&(S=2),p===!0&&(S=3);let w=o.attributes.position.count*S,R=1;w>e.maxTextureSize&&(R=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const C=new Float32Array(w*R*4*f),U=new $o(C,w,R,f);U.type=An,U.needsUpdate=!0;const y=S*4;for(let P=0;P<f;P++){const F=h[P],z=T[P],Y=b[P],X=w*R*4*P;for(let W=0;W<F.count;W++){const j=W*y;g===!0&&(s.fromBufferAttribute(F,W),C[X+j+0]=s.x,C[X+j+1]=s.y,C[X+j+2]=s.z,C[X+j+3]=0),x===!0&&(s.fromBufferAttribute(z,W),C[X+j+4]=s.x,C[X+j+5]=s.y,C[X+j+6]=s.z,C[X+j+7]=0),p===!0&&(s.fromBufferAttribute(Y,W),C[X+j+8]=s.x,C[X+j+9]=s.y,C[X+j+10]=s.z,C[X+j+11]=Y.itemSize===4?s.w:1)}}d={count:f,texture:U,size:new Ye(w,R)},i.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const x=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Mu(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const lc=new Ut,Wa=new sc(1,1),uc=new $o,hc=new Xl,fc=new nc,Xa=[],qa=[],Ya=new Float32Array(16),Ka=new Float32Array(9),$a=new Float32Array(4);function Vi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Xa[s];if(r===void 0&&(r=new Float32Array(s),Xa[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function xt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function vt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function es(n,e){let t=qa[e];t===void 0&&(t=new Int32Array(e),qa[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function yu(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Su(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2fv(this.addr,e),vt(t,e)}}function Eu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;n.uniform3fv(this.addr,e),vt(t,e)}}function Tu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4fv(this.addr,e),vt(t,e)}}function bu(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;$a.set(i),n.uniformMatrix2fv(this.addr,!1,$a),vt(t,i)}}function Au(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;Ka.set(i),n.uniformMatrix3fv(this.addr,!1,Ka),vt(t,i)}}function wu(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),vt(t,e)}else{if(xt(t,i))return;Ya.set(i),n.uniformMatrix4fv(this.addr,!1,Ya),vt(t,i)}}function Ru(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Cu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2iv(this.addr,e),vt(t,e)}}function Pu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;n.uniform3iv(this.addr,e),vt(t,e)}}function Lu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4iv(this.addr,e),vt(t,e)}}function Du(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Iu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;n.uniform2uiv(this.addr,e),vt(t,e)}}function Uu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;n.uniform3uiv(this.addr,e),vt(t,e)}}function Nu(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;n.uniform4uiv(this.addr,e),vt(t,e)}}function Fu(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Wa.compareFunction=Yo,r=Wa):r=lc,t.setTexture2D(e||r,s)}function Ou(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||hc,s)}function Bu(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||fc,s)}function zu(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||uc,s)}function ku(n){switch(n){case 5126:return yu;case 35664:return Su;case 35665:return Eu;case 35666:return Tu;case 35674:return bu;case 35675:return Au;case 35676:return wu;case 5124:case 35670:return Ru;case 35667:case 35671:return Cu;case 35668:case 35672:return Pu;case 35669:case 35673:return Lu;case 5125:return Du;case 36294:return Iu;case 36295:return Uu;case 36296:return Nu;case 35678:case 36198:case 36298:case 36306:case 35682:return Fu;case 35679:case 36299:case 36307:return Ou;case 35680:case 36300:case 36308:case 36293:return Bu;case 36289:case 36303:case 36311:case 36292:return zu}}function Hu(n,e){n.uniform1fv(this.addr,e)}function Vu(n,e){const t=Vi(e,this.size,2);n.uniform2fv(this.addr,t)}function Gu(n,e){const t=Vi(e,this.size,3);n.uniform3fv(this.addr,t)}function Wu(n,e){const t=Vi(e,this.size,4);n.uniform4fv(this.addr,t)}function Xu(n,e){const t=Vi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function qu(n,e){const t=Vi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Yu(n,e){const t=Vi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ku(n,e){n.uniform1iv(this.addr,e)}function $u(n,e){n.uniform2iv(this.addr,e)}function Zu(n,e){n.uniform3iv(this.addr,e)}function ju(n,e){n.uniform4iv(this.addr,e)}function Ju(n,e){n.uniform1uiv(this.addr,e)}function Qu(n,e){n.uniform2uiv(this.addr,e)}function eh(n,e){n.uniform3uiv(this.addr,e)}function th(n,e){n.uniform4uiv(this.addr,e)}function nh(n,e,t){const i=this.cache,s=e.length,r=es(t,s);xt(i,r)||(n.uniform1iv(this.addr,r),vt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||lc,r[a])}function ih(n,e,t){const i=this.cache,s=e.length,r=es(t,s);xt(i,r)||(n.uniform1iv(this.addr,r),vt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||hc,r[a])}function sh(n,e,t){const i=this.cache,s=e.length,r=es(t,s);xt(i,r)||(n.uniform1iv(this.addr,r),vt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||fc,r[a])}function rh(n,e,t){const i=this.cache,s=e.length,r=es(t,s);xt(i,r)||(n.uniform1iv(this.addr,r),vt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||uc,r[a])}function ah(n){switch(n){case 5126:return Hu;case 35664:return Vu;case 35665:return Gu;case 35666:return Wu;case 35674:return Xu;case 35675:return qu;case 35676:return Yu;case 5124:case 35670:return Ku;case 35667:case 35671:return $u;case 35668:case 35672:return Zu;case 35669:case 35673:return ju;case 5125:return Ju;case 36294:return Qu;case 36295:return eh;case 36296:return th;case 35678:case 36198:case 36298:case 36306:case 35682:return nh;case 35679:case 36299:case 36307:return ih;case 35680:case 36300:case 36308:case 36293:return sh;case 36289:case 36303:case 36311:case 36292:return rh}}class oh{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ku(t.type)}}class ch{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ah(t.type)}}class lh{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Os=/(\w+)(\])?(\[|\.)?/g;function Za(n,e){n.seq.push(e),n.map[e.id]=e}function uh(n,e,t){const i=n.name,s=i.length;for(Os.lastIndex=0;;){const r=Os.exec(i),a=Os.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Za(t,c===void 0?new oh(o,n,e):new ch(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new lh(o),Za(t,f)),t=f}}}class H1{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);uh(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function ja(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const hh=37297;let fh=0;function dh(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Ja=new Oe;function ph(n){$e._getMatrix(Ja,$e.workingColorSpace,n);const e=`mat3( ${Ja.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case W1:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Qa(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+dh(n.getShaderSource(e),o)}else return r}function mh(n,e){const t=ph(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function gh(n,e){let t;switch(e){case Ml:t="Linear";break;case yl:t="Reinhard";break;case Sl:t="Cineon";break;case Fo:t="ACESFilmic";break;case Tl:t="AgX";break;case bl:t="Neutral";break;case El:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const U1=new D;function _h(){$e.getLuminanceCoefficients(U1);const n=U1.x.toFixed(4),e=U1.y.toFixed(4),t=U1.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xh(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ji).join(`
`)}function vh(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Mh(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ji(n){return n!==""}function eo(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function to(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const yh=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ir(n){return n.replace(yh,Eh)}const Sh=new Map;function Eh(n,e){let t=ke[e];if(t===void 0){const i=Sh.get(e);if(i!==void 0)t=ke[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ir(t)}const Th=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function no(n){return n.replace(Th,bh)}function bh(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function io(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ah(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Uo?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Qc?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Tn&&(e="SHADOWMAP_TYPE_VSM"),e}function wh(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Fi:case Oi:e="ENVMAP_TYPE_CUBE";break;case J1:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Rh(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Oi:e="ENVMAP_MODE_REFRACTION";break}return e}function Ch(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case No:e="ENVMAP_BLENDING_MULTIPLY";break;case xl:e="ENVMAP_BLENDING_MIX";break;case vl:e="ENVMAP_BLENDING_ADD";break}return e}function Ph(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Lh(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Ah(t),c=wh(t),u=Rh(t),f=Ch(t),d=Ph(t),m=xh(t),g=vh(r),x=s.createProgram();let p,h,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ji).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ji).join(`
`),h.length>0&&(h+=`
`)):(p=[io(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ji).join(`
`),h=[io(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?ke.tonemapping_pars_fragment:"",t.toneMapping!==Bn?gh("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,mh("linearToOutputTexel",t.outputColorSpace),_h(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ji).join(`
`)),a=Ir(a),a=eo(a,t),a=to(a,t),o=Ir(o),o=eo(o,t),o=to(o,t),a=no(a),o=no(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===ma?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ma?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const b=T+p+a,S=T+h+o,w=ja(s,s.VERTEX_SHADER,b),R=ja(s,s.FRAGMENT_SHADER,S);s.attachShader(x,w),s.attachShader(x,R),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(P){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(x)||"",z=s.getShaderInfoLog(w)||"",Y=s.getShaderInfoLog(R)||"",X=F.trim(),W=z.trim(),j=Y.trim();let V=!0,ae=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,w,R);else{const k=Qa(s,w,"vertex"),ce=Qa(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+k+`
`+ce)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(W===""||j==="")&&(ae=!1);ae&&(P.diagnostics={runnable:V,programLog:X,vertexShader:{log:W,prefix:p},fragmentShader:{log:j,prefix:h}})}s.deleteShader(w),s.deleteShader(R),U=new H1(s,x),y=Mh(s,x)}let U;this.getUniforms=function(){return U===void 0&&C(this),U};let y;this.getAttributes=function(){return y===void 0&&C(this),y};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,hh)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=fh++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=R,this}let Dh=0;class Ih{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Uh(e),t.set(e,i)),i}}class Uh{constructor(e){this.id=Dh++,this.code=e,this.usedTimes=0}}function Nh(n,e,t,i,s,r,a){const o=new Zo,l=new Ih,c=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function p(y,M,P,F,z){const Y=F.fog,X=z.geometry,W=y.isMeshStandardMaterial?F.environment:null,j=(y.isMeshStandardMaterial?t:e).get(y.envMap||W),V=j&&j.mapping===J1?j.image.height:null,ae=g[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const k=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ce=k!==void 0?k.length:0;let pe=0;X.morphAttributes.position!==void 0&&(pe=1),X.morphAttributes.normal!==void 0&&(pe=2),X.morphAttributes.color!==void 0&&(pe=3);let Ne,Be,We,K;if(ae){const Ze=hn[ae];Ne=Ze.vertexShader,Be=Ze.fragmentShader}else Ne=y.vertexShader,Be=y.fragmentShader,l.update(y),We=l.getVertexShaderID(y),K=l.getFragmentShaderID(y);const J=n.getRenderTarget(),de=n.state.buffers.depth.getReversed(),De=z.isInstancedMesh===!0,be=z.isBatchedMesh===!0,Xe=!!y.map,Rt=!!y.matcap,A=!!j,it=!!y.aoMap,Ue=!!y.lightMap,Pe=!!y.bumpMap,ve=!!y.normalMap,st=!!y.displacementMap,Me=!!y.emissiveMap,ze=!!y.metalnessMap,Mt=!!y.roughnessMap,dt=y.anisotropy>0,E=y.clearcoat>0,_=y.dispersion>0,O=y.iridescence>0,q=y.sheen>0,Q=y.transmission>0,G=dt&&!!y.anisotropyMap,Te=E&&!!y.clearcoatMap,se=E&&!!y.clearcoatNormalMap,ye=E&&!!y.clearcoatRoughnessMap,Se=O&&!!y.iridescenceMap,ne=O&&!!y.iridescenceThicknessMap,he=q&&!!y.sheenColorMap,Ce=q&&!!y.sheenRoughnessMap,Ee=!!y.specularMap,le=!!y.specularColorMap,Fe=!!y.specularIntensityMap,L=Q&&!!y.transmissionMap,ie=Q&&!!y.thicknessMap,re=!!y.gradientMap,ge=!!y.alphaMap,ee=y.alphaTest>0,Z=!!y.alphaHash,xe=!!y.extensions;let Ie=Bn;y.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Ie=n.toneMapping);const tt={shaderID:ae,shaderType:y.type,shaderName:y.name,vertexShader:Ne,fragmentShader:Be,defines:y.defines,customVertexShaderID:We,customFragmentShaderID:K,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:be,batchingColor:be&&z._colorsTexture!==null,instancing:De,instancingColor:De&&z.instanceColor!==null,instancingMorph:De&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Bi,alphaToCoverage:!!y.alphaToCoverage,map:Xe,matcap:Rt,envMap:A,envMapMode:A&&j.mapping,envMapCubeUVHeight:V,aoMap:it,lightMap:Ue,bumpMap:Pe,normalMap:ve,displacementMap:d&&st,emissiveMap:Me,normalMapObjectSpace:ve&&y.normalMapType===Cl,normalMapTangentSpace:ve&&y.normalMapType===qo,metalnessMap:ze,roughnessMap:Mt,anisotropy:dt,anisotropyMap:G,clearcoat:E,clearcoatMap:Te,clearcoatNormalMap:se,clearcoatRoughnessMap:ye,dispersion:_,iridescence:O,iridescenceMap:Se,iridescenceThicknessMap:ne,sheen:q,sheenColorMap:he,sheenRoughnessMap:Ce,specularMap:Ee,specularColorMap:le,specularIntensityMap:Fe,transmission:Q,transmissionMap:L,thicknessMap:ie,gradientMap:re,opaque:y.transparent===!1&&y.blending===Pi&&y.alphaToCoverage===!1,alphaMap:ge,alphaTest:ee,alphaHash:Z,combine:y.combine,mapUv:Xe&&x(y.map.channel),aoMapUv:it&&x(y.aoMap.channel),lightMapUv:Ue&&x(y.lightMap.channel),bumpMapUv:Pe&&x(y.bumpMap.channel),normalMapUv:ve&&x(y.normalMap.channel),displacementMapUv:st&&x(y.displacementMap.channel),emissiveMapUv:Me&&x(y.emissiveMap.channel),metalnessMapUv:ze&&x(y.metalnessMap.channel),roughnessMapUv:Mt&&x(y.roughnessMap.channel),anisotropyMapUv:G&&x(y.anisotropyMap.channel),clearcoatMapUv:Te&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:se&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:he&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&x(y.sheenRoughnessMap.channel),specularMapUv:Ee&&x(y.specularMap.channel),specularColorMapUv:le&&x(y.specularColorMap.channel),specularIntensityMapUv:Fe&&x(y.specularIntensityMap.channel),transmissionMapUv:L&&x(y.transmissionMap.channel),thicknessMapUv:ie&&x(y.thicknessMap.channel),alphaMapUv:ge&&x(y.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ve||dt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!X.attributes.uv&&(Xe||ge),fog:!!Y,useFog:y.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:de,skinning:z.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:pe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ie,decodeVideoTexture:Xe&&y.map.isVideoTexture===!0&&$e.getTransfer(y.map.colorSpace)===Je,decodeVideoTextureEmissive:Me&&y.emissiveMap.isVideoTexture===!0&&$e.getTransfer(y.emissiveMap.colorSpace)===Je,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===bn,flipSided:y.side===zt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:xe&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&y.extensions.multiDraw===!0||be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return tt.vertexUv1s=c.has(1),tt.vertexUv2s=c.has(2),tt.vertexUv3s=c.has(3),c.clear(),tt}function h(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const P in y.defines)M.push(P),M.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(T(M,y),b(M,y),M.push(n.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function T(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function b(y,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),y.push(o.mask)}function S(y){const M=g[y.type];let P;if(M){const F=hn[M];P=r2.clone(F.uniforms)}else P=y.uniforms;return P}function w(y,M){let P;for(let F=0,z=u.length;F<z;F++){const Y=u[F];if(Y.cacheKey===M){P=Y,++P.usedTimes;break}}return P===void 0&&(P=new Lh(n,M,y,r),u.push(P)),P}function R(y){if(--y.usedTimes===0){const M=u.indexOf(y);u[M]=u[u.length-1],u.pop(),y.destroy()}}function C(y){l.remove(y)}function U(){l.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:S,acquireProgram:w,releaseProgram:R,releaseShaderCache:C,programs:u,dispose:U}}function Fh(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Oh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function so(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ro(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,d,m,g,x,p){let h=n[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:m,groupOrder:g,renderOrder:f.renderOrder,z:x,group:p},n[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=m,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=x,h.group=p),e++,h}function o(f,d,m,g,x,p){const h=a(f,d,m,g,x,p);m.transmission>0?i.push(h):m.transparent===!0?s.push(h):t.push(h)}function l(f,d,m,g,x,p){const h=a(f,d,m,g,x,p);m.transmission>0?i.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function c(f,d){t.length>1&&t.sort(f||Oh),i.length>1&&i.sort(d||so),s.length>1&&s.sort(d||so)}function u(){for(let f=e,d=n.length;f<d;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function Bh(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new ro,n.set(i,[a])):s>=r.length?(a=new ro,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function zh(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new qe};break;case"SpotLight":t={position:new D,direction:new D,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function kh(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Hh=0;function Vh(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Gh(n){const e=new zh,t=kh(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const s=new D,r=new ct,a=new ct;function o(c){let u=0,f=0,d=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let m=0,g=0,x=0,p=0,h=0,T=0,b=0,S=0,w=0,R=0,C=0;c.sort(Vh);for(let y=0,M=c.length;y<M;y++){const P=c[y],F=P.color,z=P.intensity,Y=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=F.r*z,f+=F.g*z,d+=F.b*z;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],z);C++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,V=t.get(P);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,i.directionalShadow[m]=V,i.directionalShadowMap[m]=X,i.directionalShadowMatrix[m]=P.shadow.matrix,T++}i.directional[m]=W,m++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(F).multiplyScalar(z),W.distance=Y,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[x]=W;const j=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,j.updateMatrices(P),P.castShadow&&R++),i.spotLightMatrix[x]=j.matrix,P.castShadow){const V=t.get(P);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,i.spotShadow[x]=V,i.spotShadowMap[x]=X,S++}x++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(F).multiplyScalar(z),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[p]=W,p++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const j=P.shadow,V=t.get(P);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,V.shadowCameraNear=j.camera.near,V.shadowCameraFar=j.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=P.shadow.matrix,b++}i.point[g]=W,g++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(z),W.groundColor.copy(P.groundColor).multiplyScalar(z),i.hemi[h]=W,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const U=i.hash;(U.directionalLength!==m||U.pointLength!==g||U.spotLength!==x||U.rectAreaLength!==p||U.hemiLength!==h||U.numDirectionalShadows!==T||U.numPointShadows!==b||U.numSpotShadows!==S||U.numSpotMaps!==w||U.numLightProbes!==C)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=p,i.point.length=g,i.hemi.length=h,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=S+w-R,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=C,U.directionalLength=m,U.pointLength=g,U.spotLength=x,U.rectAreaLength=p,U.hemiLength=h,U.numDirectionalShadows=T,U.numPointShadows=b,U.numSpotShadows=S,U.numSpotMaps=w,U.numLightProbes=C,i.version=Hh++)}function l(c,u){let f=0,d=0,m=0,g=0,x=0;const p=u.matrixWorldInverse;for(let h=0,T=c.length;h<T;h++){const b=c[h];if(b.isDirectionalLight){const S=i.directional[f];S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),f++}else if(b.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(b.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),a.identity(),r.copy(b.matrixWorld),r.premultiply(p),a.extractRotation(r),S.halfWidth.set(b.width*.5,0,0),S.halfHeight.set(0,b.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){const S=i.hemi[x];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(p),x++}}}return{setup:o,setupView:l,state:i}}function ao(n){const e=new Gh(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Wh(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new ao(n),e.set(s,[o])):r>=a.length?(o=new ao(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Xh=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qh=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Yh(n,e,t){let i=new Kr;const s=new Ye,r=new Ye,a=new Qe,o=new m2({depthPacking:Rl}),l=new g2,c={},u=t.maxTextureSize,f={[Hn]:zt,[zt]:Hn,[bn]:bn},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:Xh,fragmentShader:qh}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new en;g.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new He(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Uo;let h=this.type;this.render=function(R,C,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const y=n.getRenderTarget(),M=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),F=n.state;F.setBlending(On),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=h!==Tn&&this.type===Tn,Y=h===Tn&&this.type!==Tn;for(let X=0,W=R.length;X<W;X++){const j=R[X],V=j.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ae=V.getFrameExtents();if(s.multiply(ae),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ae.x),s.x=r.x*ae.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ae.y),s.y=r.y*ae.y,V.mapSize.y=r.y)),V.map===null||z===!0||Y===!0){const ce=this.type!==Tn?{minFilter:cn,magFilter:cn}:{};V.map!==null&&V.map.dispose(),V.map=new ci(s.x,s.y,ce),V.map.texture.name=j.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const k=V.getViewportCount();for(let ce=0;ce<k;ce++){const pe=V.getViewport(ce);a.set(r.x*pe.x,r.y*pe.y,r.x*pe.z,r.y*pe.w),F.viewport(a),V.updateMatrices(j,ce),i=V.getFrustum(),S(C,U,V.camera,j,this.type)}V.isPointLightShadow!==!0&&this.type===Tn&&T(V,U),V.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(y,M,P)};function T(R,C){const U=e.update(x);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ci(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(C,null,U,d,x,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(C,null,U,m,x,null)}function b(R,C,U,y){let M=null;const P=U.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)M=P;else if(M=U.isPointLight===!0?l:o,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=M.uuid,z=C.uuid;let Y=c[F];Y===void 0&&(Y={},c[F]=Y);let X=Y[z];X===void 0&&(X=M.clone(),Y[z]=X,C.addEventListener("dispose",w)),M=X}if(M.visible=C.visible,M.wireframe=C.wireframe,y===Tn?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:f[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,U.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=U}return M}function S(R,C,U,y,M){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===Tn)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,R.matrixWorld);const z=e.update(R),Y=R.material;if(Array.isArray(Y)){const X=z.groups;for(let W=0,j=X.length;W<j;W++){const V=X[W],ae=Y[V.materialIndex];if(ae&&ae.visible){const k=b(R,ae,y,M);R.onBeforeShadow(n,R,C,U,z,k,V),n.renderBufferDirect(U,null,z,k,R,V),R.onAfterShadow(n,R,C,U,z,k,V)}}}else if(Y.visible){const X=b(R,Y,y,M);R.onBeforeShadow(n,R,C,U,z,X,null),n.renderBufferDirect(U,null,z,X,R,null),R.onAfterShadow(n,R,C,U,z,X,null)}}const F=R.children;for(let z=0,Y=F.length;z<Y;z++)S(F[z],C,U,y,M)}function w(R){R.target.removeEventListener("dispose",w);for(const U in c){const y=c[U],M=R.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const Kh={[Ks]:$s,[Zs]:Qs,[js]:er,[Ni]:Js,[$s]:Ks,[Qs]:Zs,[er]:js,[Js]:Ni};function $h(n,e){function t(){let L=!1;const ie=new Qe;let re=null;const ge=new Qe(0,0,0,0);return{setMask:function(ee){re!==ee&&!L&&(n.colorMask(ee,ee,ee,ee),re=ee)},setLocked:function(ee){L=ee},setClear:function(ee,Z,xe,Ie,tt){tt===!0&&(ee*=Ie,Z*=Ie,xe*=Ie),ie.set(ee,Z,xe,Ie),ge.equals(ie)===!1&&(n.clearColor(ee,Z,xe,Ie),ge.copy(ie))},reset:function(){L=!1,re=null,ge.set(-1,0,0,0)}}}function i(){let L=!1,ie=!1,re=null,ge=null,ee=null;return{setReversed:function(Z){if(ie!==Z){const xe=e.get("EXT_clip_control");Z?xe.clipControlEXT(xe.LOWER_LEFT_EXT,xe.ZERO_TO_ONE_EXT):xe.clipControlEXT(xe.LOWER_LEFT_EXT,xe.NEGATIVE_ONE_TO_ONE_EXT),ie=Z;const Ie=ee;ee=null,this.setClear(Ie)}},getReversed:function(){return ie},setTest:function(Z){Z?J(n.DEPTH_TEST):de(n.DEPTH_TEST)},setMask:function(Z){re!==Z&&!L&&(n.depthMask(Z),re=Z)},setFunc:function(Z){if(ie&&(Z=Kh[Z]),ge!==Z){switch(Z){case Ks:n.depthFunc(n.NEVER);break;case $s:n.depthFunc(n.ALWAYS);break;case Zs:n.depthFunc(n.LESS);break;case Ni:n.depthFunc(n.LEQUAL);break;case js:n.depthFunc(n.EQUAL);break;case Js:n.depthFunc(n.GEQUAL);break;case Qs:n.depthFunc(n.GREATER);break;case er:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ge=Z}},setLocked:function(Z){L=Z},setClear:function(Z){ee!==Z&&(ie&&(Z=1-Z),n.clearDepth(Z),ee=Z)},reset:function(){L=!1,re=null,ge=null,ee=null,ie=!1}}}function s(){let L=!1,ie=null,re=null,ge=null,ee=null,Z=null,xe=null,Ie=null,tt=null;return{setTest:function(Ze){L||(Ze?J(n.STENCIL_TEST):de(n.STENCIL_TEST))},setMask:function(Ze){ie!==Ze&&!L&&(n.stencilMask(Ze),ie=Ze)},setFunc:function(Ze,xn,ln){(re!==Ze||ge!==xn||ee!==ln)&&(n.stencilFunc(Ze,xn,ln),re=Ze,ge=xn,ee=ln)},setOp:function(Ze,xn,ln){(Z!==Ze||xe!==xn||Ie!==ln)&&(n.stencilOp(Ze,xn,ln),Z=Ze,xe=xn,Ie=ln)},setLocked:function(Ze){L=Ze},setClear:function(Ze){tt!==Ze&&(n.clearStencil(Ze),tt=Ze)},reset:function(){L=!1,ie=null,re=null,ge=null,ee=null,Z=null,xe=null,Ie=null,tt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},f={},d=new WeakMap,m=[],g=null,x=!1,p=null,h=null,T=null,b=null,S=null,w=null,R=null,C=new qe(0,0,0),U=0,y=!1,M=null,P=null,F=null,z=null,Y=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,j=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=j>=2);let ae=null,k={};const ce=n.getParameter(n.SCISSOR_BOX),pe=n.getParameter(n.VIEWPORT),Ne=new Qe().fromArray(ce),Be=new Qe().fromArray(pe);function We(L,ie,re,ge){const ee=new Uint8Array(4),Z=n.createTexture();n.bindTexture(L,Z),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let xe=0;xe<re;xe++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(ie,0,n.RGBA,1,1,ge,0,n.RGBA,n.UNSIGNED_BYTE,ee):n.texImage2D(ie+xe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ee);return Z}const K={};K[n.TEXTURE_2D]=We(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=We(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=We(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=We(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(n.DEPTH_TEST),a.setFunc(Ni),Pe(!1),ve(la),J(n.CULL_FACE),it(On);function J(L){u[L]!==!0&&(n.enable(L),u[L]=!0)}function de(L){u[L]!==!1&&(n.disable(L),u[L]=!1)}function De(L,ie){return f[L]!==ie?(n.bindFramebuffer(L,ie),f[L]=ie,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ie),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ie),!0):!1}function be(L,ie){let re=m,ge=!1;if(L){re=d.get(ie),re===void 0&&(re=[],d.set(ie,re));const ee=L.textures;if(re.length!==ee.length||re[0]!==n.COLOR_ATTACHMENT0){for(let Z=0,xe=ee.length;Z<xe;Z++)re[Z]=n.COLOR_ATTACHMENT0+Z;re.length=ee.length,ge=!0}}else re[0]!==n.BACK&&(re[0]=n.BACK,ge=!0);ge&&n.drawBuffers(re)}function Xe(L){return g!==L?(n.useProgram(L),g=L,!0):!1}const Rt={[Qn]:n.FUNC_ADD,[tl]:n.FUNC_SUBTRACT,[nl]:n.FUNC_REVERSE_SUBTRACT};Rt[il]=n.MIN,Rt[sl]=n.MAX;const A={[rl]:n.ZERO,[al]:n.ONE,[ol]:n.SRC_COLOR,[qs]:n.SRC_ALPHA,[dl]:n.SRC_ALPHA_SATURATE,[hl]:n.DST_COLOR,[ll]:n.DST_ALPHA,[cl]:n.ONE_MINUS_SRC_COLOR,[Ys]:n.ONE_MINUS_SRC_ALPHA,[fl]:n.ONE_MINUS_DST_COLOR,[ul]:n.ONE_MINUS_DST_ALPHA,[pl]:n.CONSTANT_COLOR,[ml]:n.ONE_MINUS_CONSTANT_COLOR,[gl]:n.CONSTANT_ALPHA,[_l]:n.ONE_MINUS_CONSTANT_ALPHA};function it(L,ie,re,ge,ee,Z,xe,Ie,tt,Ze){if(L===On){x===!0&&(de(n.BLEND),x=!1);return}if(x===!1&&(J(n.BLEND),x=!0),L!==el){if(L!==p||Ze!==y){if((h!==Qn||S!==Qn)&&(n.blendEquation(n.FUNC_ADD),h=Qn,S=Qn),Ze)switch(L){case Pi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ua:n.blendFunc(n.ONE,n.ONE);break;case ha:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case fa:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Pi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ua:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case ha:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fa:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}T=null,b=null,w=null,R=null,C.set(0,0,0),U=0,p=L,y=Ze}return}ee=ee||ie,Z=Z||re,xe=xe||ge,(ie!==h||ee!==S)&&(n.blendEquationSeparate(Rt[ie],Rt[ee]),h=ie,S=ee),(re!==T||ge!==b||Z!==w||xe!==R)&&(n.blendFuncSeparate(A[re],A[ge],A[Z],A[xe]),T=re,b=ge,w=Z,R=xe),(Ie.equals(C)===!1||tt!==U)&&(n.blendColor(Ie.r,Ie.g,Ie.b,tt),C.copy(Ie),U=tt),p=L,y=!1}function Ue(L,ie){L.side===bn?de(n.CULL_FACE):J(n.CULL_FACE);let re=L.side===zt;ie&&(re=!re),Pe(re),L.blending===Pi&&L.transparent===!1?it(On):it(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ge=L.stencilWrite;o.setTest(ge),ge&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Me(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(n.SAMPLE_ALPHA_TO_COVERAGE):de(n.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(L){M!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),M=L)}function ve(L){L!==jc?(J(n.CULL_FACE),L!==P&&(L===la?n.cullFace(n.BACK):L===Jc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):de(n.CULL_FACE),P=L}function st(L){L!==F&&(W&&n.lineWidth(L),F=L)}function Me(L,ie,re){L?(J(n.POLYGON_OFFSET_FILL),(z!==ie||Y!==re)&&(n.polygonOffset(ie,re),z=ie,Y=re)):de(n.POLYGON_OFFSET_FILL)}function ze(L){L?J(n.SCISSOR_TEST):de(n.SCISSOR_TEST)}function Mt(L){L===void 0&&(L=n.TEXTURE0+X-1),ae!==L&&(n.activeTexture(L),ae=L)}function dt(L,ie,re){re===void 0&&(ae===null?re=n.TEXTURE0+X-1:re=ae);let ge=k[re];ge===void 0&&(ge={type:void 0,texture:void 0},k[re]=ge),(ge.type!==L||ge.texture!==ie)&&(ae!==re&&(n.activeTexture(re),ae=re),n.bindTexture(L,ie||K[L]),ge.type=L,ge.texture=ie)}function E(){const L=k[ae];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function _(){try{n.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{n.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Q(){try{n.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function G(){try{n.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Te(){try{n.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function se(){try{n.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{n.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Se(){try{n.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ne(){try{n.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function he(L){Ne.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Ne.copy(L))}function Ce(L){Be.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Be.copy(L))}function Ee(L,ie){let re=c.get(ie);re===void 0&&(re=new WeakMap,c.set(ie,re));let ge=re.get(L);ge===void 0&&(ge=n.getUniformBlockIndex(ie,L.name),re.set(L,ge))}function le(L,ie){const ge=c.get(ie).get(L);l.get(ie)!==ge&&(n.uniformBlockBinding(ie,ge,L.__bindingPointIndex),l.set(ie,ge))}function Fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ae=null,k={},f={},d=new WeakMap,m=[],g=null,x=!1,p=null,h=null,T=null,b=null,S=null,w=null,R=null,C=new qe(0,0,0),U=0,y=!1,M=null,P=null,F=null,z=null,Y=null,Ne.set(0,0,n.canvas.width,n.canvas.height),Be.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:J,disable:de,bindFramebuffer:De,drawBuffers:be,useProgram:Xe,setBlending:it,setMaterial:Ue,setFlipSided:Pe,setCullFace:ve,setLineWidth:st,setPolygonOffset:Me,setScissorTest:ze,activeTexture:Mt,bindTexture:dt,unbindTexture:E,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:Se,texImage3D:ne,updateUBOMapping:Ee,uniformBlockBinding:le,texStorage2D:se,texStorage3D:ye,texSubImage2D:q,texSubImage3D:Q,compressedTexSubImage2D:G,compressedTexSubImage3D:Te,scissor:he,viewport:Ce,reset:Fe}}function Zh(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ye,u=new WeakMap;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,_){return m?new OffscreenCanvas(E,_):q1("canvas")}function x(E,_,O){let q=1;const Q=dt(E);if((Q.width>O||Q.height>O)&&(q=O/Math.max(Q.width,Q.height)),q<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const G=Math.floor(q*Q.width),Te=Math.floor(q*Q.height);f===void 0&&(f=g(G,Te));const se=_?g(G,Te):f;return se.width=G,se.height=Te,se.getContext("2d").drawImage(E,0,0,G,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+G+"x"+Te+")."),se}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),E;return E}function p(E){return E.generateMipmaps}function h(E){n.generateMipmap(E)}function T(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(E,_,O,q,Q=!1){if(E!==null){if(n[E]!==void 0)return n[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let G=_;if(_===n.RED&&(O===n.FLOAT&&(G=n.R32F),O===n.HALF_FLOAT&&(G=n.R16F),O===n.UNSIGNED_BYTE&&(G=n.R8)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(G=n.R8UI),O===n.UNSIGNED_SHORT&&(G=n.R16UI),O===n.UNSIGNED_INT&&(G=n.R32UI),O===n.BYTE&&(G=n.R8I),O===n.SHORT&&(G=n.R16I),O===n.INT&&(G=n.R32I)),_===n.RG&&(O===n.FLOAT&&(G=n.RG32F),O===n.HALF_FLOAT&&(G=n.RG16F),O===n.UNSIGNED_BYTE&&(G=n.RG8)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(G=n.RG8UI),O===n.UNSIGNED_SHORT&&(G=n.RG16UI),O===n.UNSIGNED_INT&&(G=n.RG32UI),O===n.BYTE&&(G=n.RG8I),O===n.SHORT&&(G=n.RG16I),O===n.INT&&(G=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(G=n.RGB8UI),O===n.UNSIGNED_SHORT&&(G=n.RGB16UI),O===n.UNSIGNED_INT&&(G=n.RGB32UI),O===n.BYTE&&(G=n.RGB8I),O===n.SHORT&&(G=n.RGB16I),O===n.INT&&(G=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(G=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(G=n.RGBA16UI),O===n.UNSIGNED_INT&&(G=n.RGBA32UI),O===n.BYTE&&(G=n.RGBA8I),O===n.SHORT&&(G=n.RGBA16I),O===n.INT&&(G=n.RGBA32I)),_===n.RGB&&(O===n.UNSIGNED_INT_5_9_9_9_REV&&(G=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(G=n.R11F_G11F_B10F)),_===n.RGBA){const Te=Q?W1:$e.getTransfer(q);O===n.FLOAT&&(G=n.RGBA32F),O===n.HALF_FLOAT&&(G=n.RGBA16F),O===n.UNSIGNED_BYTE&&(G=Te===Je?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(G=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(G=n.RGB5_A1)}return(G===n.R16F||G===n.R32F||G===n.RG16F||G===n.RG32F||G===n.RGBA16F||G===n.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function S(E,_){let O;return E?_===null||_===oi||_===i1?O=n.DEPTH24_STENCIL8:_===An?O=n.DEPTH32F_STENCIL8:_===n1&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===oi||_===i1?O=n.DEPTH_COMPONENT24:_===An?O=n.DEPTH_COMPONENT32F:_===n1&&(O=n.DEPTH_COMPONENT16),O}function w(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==cn&&E.minFilter!==fn?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function R(E){const _=E.target;_.removeEventListener("dispose",R),U(_),_.isVideoTexture&&u.delete(_)}function C(E){const _=E.target;_.removeEventListener("dispose",C),M(_)}function U(E){const _=i.get(E);if(_.__webglInit===void 0)return;const O=E.source,q=d.get(O);if(q){const Q=q[_.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&y(E),Object.keys(q).length===0&&d.delete(O)}i.remove(E)}function y(E){const _=i.get(E);n.deleteTexture(_.__webglTexture);const O=E.source,q=d.get(O);delete q[_.__cacheKey],a.memory.textures--}function M(E){const _=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let Q=0;Q<_.__webglFramebuffer[q].length;Q++)n.deleteFramebuffer(_.__webglFramebuffer[q][Q]);else n.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)n.deleteFramebuffer(_.__webglFramebuffer[q]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=E.textures;for(let q=0,Q=O.length;q<Q;q++){const G=i.get(O[q]);G.__webglTexture&&(n.deleteTexture(G.__webglTexture),a.memory.textures--),i.remove(O[q])}i.remove(E)}let P=0;function F(){P=0}function z(){const E=P;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),P+=1,E}function Y(E){const _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function X(E,_){const O=i.get(E);if(E.isVideoTexture&&ze(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&O.__version!==E.version){const q=E.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(O,E,_);return}}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function W(E,_){const O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){K(O,E,_);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function j(E,_){const O=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){K(O,E,_);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function V(E,_){const O=i.get(E);if(E.version>0&&O.__version!==E.version){J(O,E,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}const ae={[G1]:n.REPEAT,[ii]:n.CLAMP_TO_EDGE,[ir]:n.MIRRORED_REPEAT},k={[cn]:n.NEAREST,[Al]:n.NEAREST_MIPMAP_NEAREST,[p1]:n.NEAREST_MIPMAP_LINEAR,[fn]:n.LINEAR,[rs]:n.LINEAR_MIPMAP_NEAREST,[si]:n.LINEAR_MIPMAP_LINEAR},ce={[Pl]:n.NEVER,[Fl]:n.ALWAYS,[Ll]:n.LESS,[Yo]:n.LEQUAL,[Dl]:n.EQUAL,[Nl]:n.GEQUAL,[Il]:n.GREATER,[Ul]:n.NOTEQUAL};function pe(E,_){if(_.type===An&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===fn||_.magFilter===rs||_.magFilter===p1||_.magFilter===si||_.minFilter===fn||_.minFilter===rs||_.minFilter===p1||_.minFilter===si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,ae[_.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,ae[_.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,ae[_.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,k[_.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,k[_.minFilter]),_.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,ce[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===cn||_.minFilter!==p1&&_.minFilter!==si||_.type===An&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Ne(E,_){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",R));const q=_.source;let Q=d.get(q);Q===void 0&&(Q={},d.set(q,Q));const G=Y(_);if(G!==E.__cacheKey){Q[G]===void 0&&(Q[G]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Q[G].usedTimes++;const Te=Q[E.__cacheKey];Te!==void 0&&(Q[E.__cacheKey].usedTimes--,Te.usedTimes===0&&y(_)),E.__cacheKey=G,E.__webglTexture=Q[G].texture}return O}function Be(E,_,O){return Math.floor(Math.floor(E/O)/_)}function We(E,_,O,q){const G=E.updateRanges;if(G.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,q,_.data);else{G.sort((ne,he)=>ne.start-he.start);let Te=0;for(let ne=1;ne<G.length;ne++){const he=G[Te],Ce=G[ne],Ee=he.start+he.count,le=Be(Ce.start,_.width,4),Fe=Be(he.start,_.width,4);Ce.start<=Ee+1&&le===Fe&&Be(Ce.start+Ce.count-1,_.width,4)===le?he.count=Math.max(he.count,Ce.start+Ce.count-he.start):(++Te,G[Te]=Ce)}G.length=Te+1;const se=n.getParameter(n.UNPACK_ROW_LENGTH),ye=n.getParameter(n.UNPACK_SKIP_PIXELS),Se=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let ne=0,he=G.length;ne<he;ne++){const Ce=G[ne],Ee=Math.floor(Ce.start/4),le=Math.ceil(Ce.count/4),Fe=Ee%_.width,L=Math.floor(Ee/_.width),ie=le,re=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Fe),n.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,Fe,L,ie,re,O,q,_.data)}E.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,se),n.pixelStorei(n.UNPACK_SKIP_PIXELS,ye),n.pixelStorei(n.UNPACK_SKIP_ROWS,Se)}}function K(E,_,O){let q=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=n.TEXTURE_3D);const Q=Ne(E,_),G=_.source;t.bindTexture(q,E.__webglTexture,n.TEXTURE0+O);const Te=i.get(G);if(G.version!==Te.__version||Q===!0){t.activeTexture(n.TEXTURE0+O);const se=$e.getPrimaries($e.workingColorSpace),ye=_.colorSpace===Un?null:$e.getPrimaries(_.colorSpace),Se=_.colorSpace===Un||se===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);let ne=x(_.image,!1,s.maxTextureSize);ne=Mt(_,ne);const he=r.convert(_.format,_.colorSpace),Ce=r.convert(_.type);let Ee=b(_.internalFormat,he,Ce,_.colorSpace,_.isVideoTexture);pe(q,_);let le;const Fe=_.mipmaps,L=_.isVideoTexture!==!0,ie=Te.__version===void 0||Q===!0,re=G.dataReady,ge=w(_,ne);if(_.isDepthTexture)Ee=S(_.format===r1,_.type),ie&&(L?t.texStorage2D(n.TEXTURE_2D,1,Ee,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,Ee,ne.width,ne.height,0,he,Ce,null));else if(_.isDataTexture)if(Fe.length>0){L&&ie&&t.texStorage2D(n.TEXTURE_2D,ge,Ee,Fe[0].width,Fe[0].height);for(let ee=0,Z=Fe.length;ee<Z;ee++)le=Fe[ee],L?re&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,le.width,le.height,he,Ce,le.data):t.texImage2D(n.TEXTURE_2D,ee,Ee,le.width,le.height,0,he,Ce,le.data);_.generateMipmaps=!1}else L?(ie&&t.texStorage2D(n.TEXTURE_2D,ge,Ee,ne.width,ne.height),re&&We(_,ne,he,Ce)):t.texImage2D(n.TEXTURE_2D,0,Ee,ne.width,ne.height,0,he,Ce,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){L&&ie&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ge,Ee,Fe[0].width,Fe[0].height,ne.depth);for(let ee=0,Z=Fe.length;ee<Z;ee++)if(le=Fe[ee],_.format!==on)if(he!==null)if(L){if(re)if(_.layerUpdates.size>0){const xe=Fa(le.width,le.height,_.format,_.type);for(const Ie of _.layerUpdates){const tt=le.data.subarray(Ie*xe/le.data.BYTES_PER_ELEMENT,(Ie+1)*xe/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,Ie,le.width,le.height,1,he,tt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,le.width,le.height,ne.depth,he,le.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ee,Ee,le.width,le.height,ne.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?re&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,le.width,le.height,ne.depth,he,Ce,le.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ee,Ee,le.width,le.height,ne.depth,0,he,Ce,le.data)}else{L&&ie&&t.texStorage2D(n.TEXTURE_2D,ge,Ee,Fe[0].width,Fe[0].height);for(let ee=0,Z=Fe.length;ee<Z;ee++)le=Fe[ee],_.format!==on?he!==null?L?re&&t.compressedTexSubImage2D(n.TEXTURE_2D,ee,0,0,le.width,le.height,he,le.data):t.compressedTexImage2D(n.TEXTURE_2D,ee,Ee,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?re&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,le.width,le.height,he,Ce,le.data):t.texImage2D(n.TEXTURE_2D,ee,Ee,le.width,le.height,0,he,Ce,le.data)}else if(_.isDataArrayTexture)if(L){if(ie&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ge,Ee,ne.width,ne.height,ne.depth),re)if(_.layerUpdates.size>0){const ee=Fa(ne.width,ne.height,_.format,_.type);for(const Z of _.layerUpdates){const xe=ne.data.subarray(Z*ee/ne.data.BYTES_PER_ELEMENT,(Z+1)*ee/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Z,ne.width,ne.height,1,he,Ce,xe)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,he,Ce,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ee,ne.width,ne.height,ne.depth,0,he,Ce,ne.data);else if(_.isData3DTexture)L?(ie&&t.texStorage3D(n.TEXTURE_3D,ge,Ee,ne.width,ne.height,ne.depth),re&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,he,Ce,ne.data)):t.texImage3D(n.TEXTURE_3D,0,Ee,ne.width,ne.height,ne.depth,0,he,Ce,ne.data);else if(_.isFramebufferTexture){if(ie)if(L)t.texStorage2D(n.TEXTURE_2D,ge,Ee,ne.width,ne.height);else{let ee=ne.width,Z=ne.height;for(let xe=0;xe<ge;xe++)t.texImage2D(n.TEXTURE_2D,xe,Ee,ee,Z,0,he,Ce,null),ee>>=1,Z>>=1}}else if(Fe.length>0){if(L&&ie){const ee=dt(Fe[0]);t.texStorage2D(n.TEXTURE_2D,ge,Ee,ee.width,ee.height)}for(let ee=0,Z=Fe.length;ee<Z;ee++)le=Fe[ee],L?re&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,he,Ce,le):t.texImage2D(n.TEXTURE_2D,ee,Ee,he,Ce,le);_.generateMipmaps=!1}else if(L){if(ie){const ee=dt(ne);t.texStorage2D(n.TEXTURE_2D,ge,Ee,ee.width,ee.height)}re&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,he,Ce,ne)}else t.texImage2D(n.TEXTURE_2D,0,Ee,he,Ce,ne);p(_)&&h(q),Te.__version=G.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function J(E,_,O){if(_.image.length!==6)return;const q=Ne(E,_),Q=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+O);const G=i.get(Q);if(Q.version!==G.__version||q===!0){t.activeTexture(n.TEXTURE0+O);const Te=$e.getPrimaries($e.workingColorSpace),se=_.colorSpace===Un?null:$e.getPrimaries(_.colorSpace),ye=_.colorSpace===Un||Te===se?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Se=_.isCompressedTexture||_.image[0].isCompressedTexture,ne=_.image[0]&&_.image[0].isDataTexture,he=[];for(let Z=0;Z<6;Z++)!Se&&!ne?he[Z]=x(_.image[Z],!0,s.maxCubemapSize):he[Z]=ne?_.image[Z].image:_.image[Z],he[Z]=Mt(_,he[Z]);const Ce=he[0],Ee=r.convert(_.format,_.colorSpace),le=r.convert(_.type),Fe=b(_.internalFormat,Ee,le,_.colorSpace),L=_.isVideoTexture!==!0,ie=G.__version===void 0||q===!0,re=Q.dataReady;let ge=w(_,Ce);pe(n.TEXTURE_CUBE_MAP,_);let ee;if(Se){L&&ie&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,Fe,Ce.width,Ce.height);for(let Z=0;Z<6;Z++){ee=he[Z].mipmaps;for(let xe=0;xe<ee.length;xe++){const Ie=ee[xe];_.format!==on?Ee!==null?L?re&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe,0,0,Ie.width,Ie.height,Ee,Ie.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe,Fe,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe,0,0,Ie.width,Ie.height,Ee,le,Ie.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe,Fe,Ie.width,Ie.height,0,Ee,le,Ie.data)}}}else{if(ee=_.mipmaps,L&&ie){ee.length>0&&ge++;const Z=dt(he[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ge,Fe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ne){L?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,he[Z].width,he[Z].height,Ee,le,he[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Fe,he[Z].width,he[Z].height,0,Ee,le,he[Z].data);for(let xe=0;xe<ee.length;xe++){const tt=ee[xe].image[Z].image;L?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe+1,0,0,tt.width,tt.height,Ee,le,tt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe+1,Fe,tt.width,tt.height,0,Ee,le,tt.data)}}else{L?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ee,le,he[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Fe,Ee,le,he[Z]);for(let xe=0;xe<ee.length;xe++){const Ie=ee[xe];L?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe+1,0,0,Ee,le,Ie.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,xe+1,Fe,Ee,le,Ie.image[Z])}}}p(_)&&h(n.TEXTURE_CUBE_MAP),G.__version=Q.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function de(E,_,O,q,Q,G){const Te=r.convert(O.format,O.colorSpace),se=r.convert(O.type),ye=b(O.internalFormat,Te,se,O.colorSpace),Se=i.get(_),ne=i.get(O);if(ne.__renderTarget=_,!Se.__hasExternalTextures){const he=Math.max(1,_.width>>G),Ce=Math.max(1,_.height>>G);Q===n.TEXTURE_3D||Q===n.TEXTURE_2D_ARRAY?t.texImage3D(Q,G,ye,he,Ce,_.depth,0,Te,se,null):t.texImage2D(Q,G,ye,he,Ce,0,Te,se,null)}t.bindFramebuffer(n.FRAMEBUFFER,E),Me(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,Q,ne.__webglTexture,0,st(_)):(Q===n.TEXTURE_2D||Q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,Q,ne.__webglTexture,G),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(E,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,E),_.depthBuffer){const q=_.depthTexture,Q=q&&q.isDepthTexture?q.type:null,G=S(_.stencilBuffer,Q),Te=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=st(_);Me(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se,G,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,se,G,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,G,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,E)}else{const q=_.textures;for(let Q=0;Q<q.length;Q++){const G=q[Q],Te=r.convert(G.format,G.colorSpace),se=r.convert(G.type),ye=b(G.internalFormat,Te,se,G.colorSpace),Se=st(_);O&&Me(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Se,ye,_.width,_.height):Me(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Se,ye,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,ye,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function be(E,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=i.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),X(_.depthTexture,0);const Q=q.__webglTexture,G=st(_);if(_.depthTexture.format===s1)Me(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(_.depthTexture.format===r1)Me(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,G):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Xe(E){const _=i.get(E),O=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){const q=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){const Q=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",Q)};q.addEventListener("dispose",Q),_.__depthDisposeCallback=Q}_.__boundDepthTexture=q}if(E.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const q=E.texture.mipmaps;q&&q.length>0?be(_.__webglFramebuffer[0],E):be(_.__webglFramebuffer,E)}else if(O){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=n.createRenderbuffer(),De(_.__webglDepthbuffer[q],E,!1);else{const Q=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=_.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,G)}}else{const q=E.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),De(_.__webglDepthbuffer,E,!1);else{const Q=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,G=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,G),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,G)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Rt(E,_,O){const q=i.get(E);_!==void 0&&de(q.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Xe(E)}function A(E){const _=E.texture,O=i.get(E),q=i.get(_);E.addEventListener("dispose",C);const Q=E.textures,G=E.isWebGLCubeRenderTarget===!0,Te=Q.length>1;if(Te||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=_.version,a.memory.textures++),G){O.__webglFramebuffer=[];for(let se=0;se<6;se++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[se]=[];for(let ye=0;ye<_.mipmaps.length;ye++)O.__webglFramebuffer[se][ye]=n.createFramebuffer()}else O.__webglFramebuffer[se]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let se=0;se<_.mipmaps.length;se++)O.__webglFramebuffer[se]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(Te)for(let se=0,ye=Q.length;se<ye;se++){const Se=i.get(Q[se]);Se.__webglTexture===void 0&&(Se.__webglTexture=n.createTexture(),a.memory.textures++)}if(E.samples>0&&Me(E)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let se=0;se<Q.length;se++){const ye=Q[se];O.__webglColorRenderbuffer[se]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[se]);const Se=r.convert(ye.format,ye.colorSpace),ne=r.convert(ye.type),he=b(ye.internalFormat,Se,ne,ye.colorSpace,E.isXRRenderTarget===!0),Ce=st(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,he,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+se,n.RENDERBUFFER,O.__webglColorRenderbuffer[se])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),De(O.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(G){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),pe(n.TEXTURE_CUBE_MAP,_);for(let se=0;se<6;se++)if(_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)de(O.__webglFramebuffer[se][ye],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,ye);else de(O.__webglFramebuffer[se],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);p(_)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let se=0,ye=Q.length;se<ye;se++){const Se=Q[se],ne=i.get(Se);let he=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(he=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,ne.__webglTexture),pe(he,Se),de(O.__webglFramebuffer,E,Se,n.COLOR_ATTACHMENT0+se,he,0),p(Se)&&h(he)}t.unbindTexture()}else{let se=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(se=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(se,q.__webglTexture),pe(se,_),_.mipmaps&&_.mipmaps.length>0)for(let ye=0;ye<_.mipmaps.length;ye++)de(O.__webglFramebuffer[ye],E,_,n.COLOR_ATTACHMENT0,se,ye);else de(O.__webglFramebuffer,E,_,n.COLOR_ATTACHMENT0,se,0);p(_)&&h(se),t.unbindTexture()}E.depthBuffer&&Xe(E)}function it(E){const _=E.textures;for(let O=0,q=_.length;O<q;O++){const Q=_[O];if(p(Q)){const G=T(E),Te=i.get(Q).__webglTexture;t.bindTexture(G,Te),h(G),t.unbindTexture()}}}const Ue=[],Pe=[];function ve(E){if(E.samples>0){if(Me(E)===!1){const _=E.textures,O=E.width,q=E.height;let Q=n.COLOR_BUFFER_BIT;const G=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(E),se=_.length>1;if(se)for(let Se=0;Se<_.length;Se++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer);const ye=E.texture.mipmaps;ye&&ye.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Se=0;Se<_.length;Se++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Q|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Q|=n.STENCIL_BUFFER_BIT)),se){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const ne=i.get(_[Se]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ne,0)}n.blitFramebuffer(0,0,O,q,0,0,O,q,Q,n.NEAREST),l===!0&&(Ue.length=0,Pe.length=0,Ue.push(n.COLOR_ATTACHMENT0+Se),E.depthBuffer&&E.resolveDepthBuffer===!1&&(Ue.push(G),Pe.push(G),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Pe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ue))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),se)for(let Se=0;Se<_.length;Se++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const ne=i.get(_[Se]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Se,n.TEXTURE_2D,ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const _=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function st(E){return Math.min(s.maxSamples,E.samples)}function Me(E){const _=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function ze(E){const _=a.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function Mt(E,_){const O=E.colorSpace,q=E.format,Q=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==Bi&&O!==Un&&($e.getTransfer(O)===Je?(q!==on||Q!==gn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),_}function dt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=W,this.setTexture3D=j,this.setTextureCube=V,this.rebindTextures=Rt,this.setupRenderTarget=A,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=ve,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=de,this.useMultisampledRTT=Me}function jh(n,e){function t(i,s=Un){let r;const a=$e.getTransfer(s);if(i===gn)return n.UNSIGNED_BYTE;if(i===kr)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Hr)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ko)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ho)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bo)return n.BYTE;if(i===zo)return n.SHORT;if(i===n1)return n.UNSIGNED_SHORT;if(i===zr)return n.INT;if(i===oi)return n.UNSIGNED_INT;if(i===An)return n.FLOAT;if(i===o1)return n.HALF_FLOAT;if(i===Vo)return n.ALPHA;if(i===Go)return n.RGB;if(i===on)return n.RGBA;if(i===s1)return n.DEPTH_COMPONENT;if(i===r1)return n.DEPTH_STENCIL;if(i===Wo)return n.RED;if(i===Vr)return n.RED_INTEGER;if(i===Xo)return n.RG;if(i===Gr)return n.RG_INTEGER;if(i===Wr)return n.RGBA_INTEGER;if(i===O1||i===B1||i===z1||i===k1)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===O1)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===B1)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===z1)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===k1)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===O1)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===B1)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===z1)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===k1)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===sr||i===rr||i===ar||i===or)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===sr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ar)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===or)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===cr||i===lr||i===ur)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===cr||i===lr)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ur)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hr||i===fr||i===dr||i===pr||i===mr||i===gr||i===_r||i===xr||i===vr||i===Mr||i===yr||i===Sr||i===Er||i===Tr)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===hr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===fr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===dr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_r)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===xr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===vr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Mr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Er)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Tr)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===br||i===Ar||i===wr)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===br)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ar)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===wr)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Rr||i===Cr||i===Pr||i===Lr)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Rr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Cr)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Lr)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===i1?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Jh=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qh=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class ef{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new rc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vn({vertexShader:Jh,fragmentShader:Qh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new zn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tf extends Hi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,m=null,g=null;const x=typeof XRWebGLBinding<"u",p=new ef,h={},T=t.getContextAttributes();let b=null,S=null;const w=[],R=[],C=new Ye;let U=null;const y=new Xt;y.viewport=new Qe;const M=new Xt;M.viewport=new Qe;const P=[y,M],F=new S2;let z=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let J=w[K];return J===void 0&&(J=new Rs,w[K]=J),J.getTargetRaySpace()},this.getControllerGrip=function(K){let J=w[K];return J===void 0&&(J=new Rs,w[K]=J),J.getGripSpace()},this.getHand=function(K){let J=w[K];return J===void 0&&(J=new Rs,w[K]=J),J.getHandSpace()};function X(K){const J=R.indexOf(K.inputSource);if(J===-1)return;const de=w[J];de!==void 0&&(de.update(K.inputSource,K.frame,c||a),de.dispatchEvent({type:K.type,data:K.inputSource}))}function W(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",j);for(let K=0;K<w.length;K++){const J=R[K];J!==null&&(R[K]=null,w[K].disconnect(J))}z=null,Y=null,p.reset();for(const K in h)delete h[K];e.setRenderTarget(b),m=null,d=null,f=null,s=null,S=null,We.stop(),i.isPresenting=!1,e.setPixelRatio(U),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",W),s.addEventListener("inputsourceschange",j),T.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let de=null,De=null,be=null;T.depth&&(be=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=T.stencil?r1:s1,De=T.stencil?i1:oi);const Xe={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(Xe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new ci(d.textureWidth,d.textureHeight,{format:on,type:gn,depthTexture:new sc(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const de={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,de),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),S=new ci(m.framebufferWidth,m.framebufferHeight,{format:on,type:gn,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),We.setContext(s),We.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function j(K){for(let J=0;J<K.removed.length;J++){const de=K.removed[J],De=R.indexOf(de);De>=0&&(R[De]=null,w[De].disconnect(de))}for(let J=0;J<K.added.length;J++){const de=K.added[J];let De=R.indexOf(de);if(De===-1){for(let Xe=0;Xe<w.length;Xe++)if(Xe>=R.length){R.push(de),De=Xe;break}else if(R[Xe]===null){R[Xe]=de,De=Xe;break}if(De===-1)break}const be=w[De];be&&be.connect(de)}}const V=new D,ae=new D;function k(K,J,de){V.setFromMatrixPosition(J.matrixWorld),ae.setFromMatrixPosition(de.matrixWorld);const De=V.distanceTo(ae),be=J.projectionMatrix.elements,Xe=de.projectionMatrix.elements,Rt=be[14]/(be[10]-1),A=be[14]/(be[10]+1),it=(be[9]+1)/be[5],Ue=(be[9]-1)/be[5],Pe=(be[8]-1)/be[0],ve=(Xe[8]+1)/Xe[0],st=Rt*Pe,Me=Rt*ve,ze=De/(-Pe+ve),Mt=ze*-Pe;if(J.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Mt),K.translateZ(ze),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),be[10]===-1)K.projectionMatrix.copy(J.projectionMatrix),K.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const dt=Rt+ze,E=A+ze,_=st-Mt,O=Me+(De-Mt),q=it*A/E*dt,Q=Ue*A/E*dt;K.projectionMatrix.makePerspective(_,O,q,Q,dt,E),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ce(K,J){J===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(J.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let J=K.near,de=K.far;p.texture!==null&&(p.depthNear>0&&(J=p.depthNear),p.depthFar>0&&(de=p.depthFar)),F.near=M.near=y.near=J,F.far=M.far=y.far=de,(z!==F.near||Y!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,Y=F.far),F.layers.mask=K.layers.mask|6,y.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const De=K.parent,be=F.cameras;ce(F,De);for(let Xe=0;Xe<be.length;Xe++)ce(be[Xe],De);be.length===2?k(F,y,M):F.projectionMatrix.copy(y.projectionMatrix),pe(K,F,De)};function pe(K,J,de){de===null?K.matrix.copy(J.matrixWorld):(K.matrix.copy(de.matrixWorld),K.matrix.invert(),K.matrix.multiply(J.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(J.projectionMatrix),K.projectionMatrixInverse.copy(J.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Dr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function(K){return h[K]};let Ne=null;function Be(K,J){if(u=J.getViewerPose(c||a),g=J,u!==null){const de=u.views;m!==null&&(e.setRenderTargetFramebuffer(S,m.framebuffer),e.setRenderTarget(S));let De=!1;de.length!==F.cameras.length&&(F.cameras.length=0,De=!0);for(let A=0;A<de.length;A++){const it=de[A];let Ue=null;if(m!==null)Ue=m.getViewport(it);else{const ve=f.getViewSubImage(d,it);Ue=ve.viewport,A===0&&(e.setRenderTargetTextures(S,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(S))}let Pe=P[A];Pe===void 0&&(Pe=new Xt,Pe.layers.enable(A),Pe.viewport=new Qe,P[A]=Pe),Pe.matrix.fromArray(it.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(it.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(Ue.x,Ue.y,Ue.width,Ue.height),A===0&&(F.matrix.copy(Pe.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),De===!0&&F.cameras.push(Pe)}const be=s.enabledFeatures;if(be&&be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=i.getBinding();const A=f.getDepthInformation(de[0]);A&&A.isValid&&A.texture&&p.init(A,s.renderState)}if(be&&be.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let A=0;A<de.length;A++){const it=de[A].camera;if(it){let Ue=h[it];Ue||(Ue=new rc,h[it]=Ue);const Pe=f.getCameraImage(it);Ue.sourceTexture=Pe}}}}for(let de=0;de<w.length;de++){const De=R[de],be=w[de];De!==null&&be!==void 0&&be.update(De,J,c||a)}Ne&&Ne(K,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),g=null}const We=new cc;We.setAnimationLoop(Be),this.setAnimationLoop=function(K){Ne=K},this.dispose=function(){}}}const Zn=new _n,nf=new ct;function sf(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function i(p,h){h.color.getRGB(p.fogColor.value,ec(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function s(p,h,T,b,S){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),f(p,h)):h.isMeshPhongMaterial?(r(p,h),u(p,h)):h.isMeshStandardMaterial?(r(p,h),d(p,h),h.isMeshPhysicalMaterial&&m(p,h,S)):h.isMeshMatcapMaterial?(r(p,h),g(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),x(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?l(p,h,T,b):h.isSpriteMaterial?c(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===zt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===zt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const T=e.get(h),b=T.envMap,S=T.envMapRotation;b&&(p.envMap.value=b,Zn.copy(S),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),p.envMapRotation.value.setFromMatrix4(nf.makeRotationFromEuler(Zn)),p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function l(p,h,T,b){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*T,p.scale.value=b*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function c(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function f(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function d(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,T){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===zt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function x(p,h){const T=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function rf(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,b){const S=b.program;i.uniformBlockBinding(T,S)}function c(T,b){let S=s[T.id];S===void 0&&(g(T),S=u(T),s[T.id]=S,T.addEventListener("dispose",p));const w=b.program;i.updateUBOMapping(T,w);const R=e.render.frame;r[T.id]!==R&&(d(T),r[T.id]=R)}function u(T){const b=f();T.__bindingPointIndex=b;const S=n.createBuffer(),w=T.__size,R=T.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,w,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,S),S}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const b=s[T.id],S=T.uniforms,w=T.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let R=0,C=S.length;R<C;R++){const U=Array.isArray(S[R])?S[R]:[S[R]];for(let y=0,M=U.length;y<M;y++){const P=U[y];if(m(P,R,y,w)===!0){const F=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let Y=0;for(let X=0;X<z.length;X++){const W=z[X],j=x(W);typeof W=="number"||typeof W=="boolean"?(P.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,F+Y,P.__data)):W.isMatrix3?(P.__data[0]=W.elements[0],P.__data[1]=W.elements[1],P.__data[2]=W.elements[2],P.__data[3]=0,P.__data[4]=W.elements[3],P.__data[5]=W.elements[4],P.__data[6]=W.elements[5],P.__data[7]=0,P.__data[8]=W.elements[6],P.__data[9]=W.elements[7],P.__data[10]=W.elements[8],P.__data[11]=0):(W.toArray(P.__data,Y),Y+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(T,b,S,w){const R=T.value,C=b+"_"+S;if(w[C]===void 0)return typeof R=="number"||typeof R=="boolean"?w[C]=R:w[C]=R.clone(),!0;{const U=w[C];if(typeof R=="number"||typeof R=="boolean"){if(U!==R)return w[C]=R,!0}else if(U.equals(R)===!1)return U.copy(R),!0}return!1}function g(T){const b=T.uniforms;let S=0;const w=16;for(let C=0,U=b.length;C<U;C++){const y=Array.isArray(b[C])?b[C]:[b[C]];for(let M=0,P=y.length;M<P;M++){const F=y[M],z=Array.isArray(F.value)?F.value:[F.value];for(let Y=0,X=z.length;Y<X;Y++){const W=z[Y],j=x(W),V=S%w,ae=V%j.boundary,k=V+ae;S+=ae,k!==0&&w-k<j.storage&&(S+=w-k),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=S,S+=j.storage}}}const R=S%w;return R>0&&(S+=w-R),T.__size=S,T.__cache={},this}function x(T){const b={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(b.boundary=4,b.storage=4):T.isVector2?(b.boundary=8,b.storage=8):T.isVector3||T.isColor?(b.boundary=16,b.storage=12):T.isVector4?(b.boundary=16,b.storage=16):T.isMatrix3?(b.boundary=48,b.storage=48):T.isMatrix4?(b.boundary=64,b.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),b}function p(T){const b=T.target;b.removeEventListener("dispose",p);const S=a.indexOf(b.__bindingPointIndex);a.splice(S,1),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function h(){for(const T in s)n.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:l,update:c,dispose:h}}class af{constructor(e={}){const{canvas:t=Bl(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),x=new Int32Array(4);let p=null,h=null;const T=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let w=!1;this._outputColorSpace=Ot;let R=0,C=0,U=null,y=-1,M=null;const P=new Qe,F=new Qe;let z=null;const Y=new qe(0);let X=0,W=t.width,j=t.height,V=1,ae=null,k=null;const ce=new Qe(0,0,W,j),pe=new Qe(0,0,W,j);let Ne=!1;const Be=new Kr;let We=!1,K=!1;const J=new ct,de=new D,De=new Qe,be={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xe=!1;function Rt(){return U===null?V:1}let A=i;function it(v,I){return t.getContext(v,I)}try{const v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Br}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",ee,!1),A===null){const I="webgl2";if(A=it(I,v),A===null)throw it(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw console.error("THREE.WebGLRenderer: "+v.message),v}let Ue,Pe,ve,st,Me,ze,Mt,dt,E,_,O,q,Q,G,Te,se,ye,Se,ne,he,Ce,Ee,le,Fe;function L(){Ue=new mu(A),Ue.init(),Ee=new jh(A,Ue),Pe=new cu(A,Ue,e,Ee),ve=new $h(A,Ue),Pe.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),st=new xu(A),Me=new Fh,ze=new Zh(A,Ue,ve,Me,Pe,Ee,st),Mt=new uu(S),dt=new pu(S),E=new T2(A),le=new au(A,E),_=new gu(A,E,st,le),O=new Mu(A,_,E,st),ne=new vu(A,Pe,ze),se=new lu(Me),q=new Nh(S,Mt,dt,Ue,Pe,le,se),Q=new sf(S,Me),G=new Bh,Te=new Wh(Ue),Se=new ru(S,Mt,dt,ve,O,m,l),ye=new Yh(S,O,Pe),Fe=new rf(A,st,Pe,ve),he=new ou(A,Ue,st),Ce=new _u(A,Ue,st),st.programs=q.programs,S.capabilities=Pe,S.extensions=Ue,S.properties=Me,S.renderLists=G,S.shadowMap=ye,S.state=ve,S.info=st}L();const ie=new tf(S,A);this.xr=ie,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const v=Ue.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ue.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(v){v!==void 0&&(V=v,this.setSize(W,j,!1))},this.getSize=function(v){return v.set(W,j)},this.setSize=function(v,I,B=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=v,j=I,t.width=Math.floor(v*V),t.height=Math.floor(I*V),B===!0&&(t.style.width=v+"px",t.style.height=I+"px"),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(W*V,j*V).floor()},this.setDrawingBufferSize=function(v,I,B){W=v,j=I,V=B,t.width=Math.floor(v*B),t.height=Math.floor(I*B),this.setViewport(0,0,v,I)},this.getCurrentViewport=function(v){return v.copy(P)},this.getViewport=function(v){return v.copy(ce)},this.setViewport=function(v,I,B,H){v.isVector4?ce.set(v.x,v.y,v.z,v.w):ce.set(v,I,B,H),ve.viewport(P.copy(ce).multiplyScalar(V).round())},this.getScissor=function(v){return v.copy(pe)},this.setScissor=function(v,I,B,H){v.isVector4?pe.set(v.x,v.y,v.z,v.w):pe.set(v,I,B,H),ve.scissor(F.copy(pe).multiplyScalar(V).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(v){ve.setScissorTest(Ne=v)},this.setOpaqueSort=function(v){ae=v},this.setTransparentSort=function(v){k=v},this.getClearColor=function(v){return v.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor(...arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,B=!0){let H=0;if(v){let N=!1;if(U!==null){const te=U.texture.format;N=te===Wr||te===Gr||te===Vr}if(N){const te=U.texture.type,ue=te===gn||te===oi||te===n1||te===i1||te===kr||te===Hr,_e=Se.getClearColor(),me=Se.getClearAlpha(),Re=_e.r,Le=_e.g,Ae=_e.b;ue?(g[0]=Re,g[1]=Le,g[2]=Ae,g[3]=me,A.clearBufferuiv(A.COLOR,0,g)):(x[0]=Re,x[1]=Le,x[2]=Ae,x[3]=me,A.clearBufferiv(A.COLOR,0,x))}else H|=A.COLOR_BUFFER_BIT}I&&(H|=A.DEPTH_BUFFER_BIT),B&&(H|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",ee,!1),Se.dispose(),G.dispose(),Te.dispose(),Me.dispose(),Mt.dispose(),dt.dispose(),O.dispose(),le.dispose(),Fe.dispose(),q.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",ln),ie.removeEventListener("sessionend",ea),Gn.stop()};function re(v){v.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const v=st.autoReset,I=ye.enabled,B=ye.autoUpdate,H=ye.needsUpdate,N=ye.type;L(),st.autoReset=v,ye.enabled=I,ye.autoUpdate=B,ye.needsUpdate=H,ye.type=N}function ee(v){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Z(v){const I=v.target;I.removeEventListener("dispose",Z),xe(I)}function xe(v){Ie(v),Me.remove(v)}function Ie(v){const I=Me.get(v).programs;I!==void 0&&(I.forEach(function(B){q.releaseProgram(B)}),v.isShaderMaterial&&q.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,B,H,N,te){I===null&&(I=be);const ue=N.isMesh&&N.matrixWorld.determinant()<0,_e=Ec(v,I,B,H,N);ve.setMaterial(H,ue);let me=B.index,Re=1;if(H.wireframe===!0){if(me=_.getWireframeAttribute(B),me===void 0)return;Re=2}const Le=B.drawRange,Ae=B.attributes.position;let Ve=Le.start*Re,je=(Le.start+Le.count)*Re;te!==null&&(Ve=Math.max(Ve,te.start*Re),je=Math.min(je,(te.start+te.count)*Re)),me!==null?(Ve=Math.max(Ve,0),je=Math.min(je,me.count)):Ae!=null&&(Ve=Math.max(Ve,0),je=Math.min(je,Ae.count));const lt=je-Ve;if(lt<0||lt===1/0)return;le.setup(N,H,_e,B,me);let nt,et=he;if(me!==null&&(nt=E.get(me),et=Ce,et.setIndex(nt)),N.isMesh)H.wireframe===!0?(ve.setLineWidth(H.wireframeLinewidth*Rt()),et.setMode(A.LINES)):et.setMode(A.TRIANGLES);else if(N.isLine){let we=H.linewidth;we===void 0&&(we=1),ve.setLineWidth(we*Rt()),N.isLineSegments?et.setMode(A.LINES):N.isLineLoop?et.setMode(A.LINE_LOOP):et.setMode(A.LINE_STRIP)}else N.isPoints?et.setMode(A.POINTS):N.isSprite&&et.setMode(A.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)a1("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ue.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const we=N._multiDrawStarts,rt=N._multiDrawCounts,Ke=N._multiDrawCount,kt=me?E.get(me).bytesPerElement:1,fi=Me.get(H).currentProgram.getUniforms();for(let Ht=0;Ht<Ke;Ht++)fi.setValue(A,"_gl_DrawID",Ht),et.render(we[Ht]/kt,rt[Ht])}else if(N.isInstancedMesh)et.renderInstances(Ve,lt,N.count);else if(B.isInstancedBufferGeometry){const we=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,rt=Math.min(B.instanceCount,we);et.renderInstances(Ve,lt,rt)}else et.render(Ve,lt)};function tt(v,I,B){v.transparent===!0&&v.side===bn&&v.forceSinglePass===!1?(v.side=zt,v.needsUpdate=!0,d1(v,I,B),v.side=Hn,v.needsUpdate=!0,d1(v,I,B),v.side=bn):d1(v,I,B)}this.compile=function(v,I,B=null){B===null&&(B=v),h=Te.get(B),h.init(I),b.push(h),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(h.pushLight(N),N.castShadow&&h.pushShadow(N))}),v!==B&&v.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(h.pushLight(N),N.castShadow&&h.pushShadow(N))}),h.setupLights();const H=new Set;return v.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const te=N.material;if(te)if(Array.isArray(te))for(let ue=0;ue<te.length;ue++){const _e=te[ue];tt(_e,B,N),H.add(_e)}else tt(te,B,N),H.add(te)}),h=b.pop(),H},this.compileAsync=function(v,I,B=null){const H=this.compile(v,I,B);return new Promise(N=>{function te(){if(H.forEach(function(ue){Me.get(ue).currentProgram.isReady()&&H.delete(ue)}),H.size===0){N(v);return}setTimeout(te,10)}Ue.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let Ze=null;function xn(v){Ze&&Ze(v)}function ln(){Gn.stop()}function ea(){Gn.start()}const Gn=new cc;Gn.setAnimationLoop(xn),typeof self<"u"&&Gn.setContext(self),this.setAnimationLoop=function(v){Ze=v,ie.setAnimationLoop(v),v===null?Gn.stop():Gn.start()},ie.addEventListener("sessionstart",ln),ie.addEventListener("sessionend",ea),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(I),I=ie.getCamera()),v.isScene===!0&&v.onBeforeRender(S,v,I,U),h=Te.get(v,b.length),h.init(I),b.push(h),J.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Be.setFromProjectionMatrix(J,dn,I.reversedDepth),K=this.localClippingEnabled,We=se.init(this.clippingPlanes,K),p=G.get(v,T.length),p.init(),T.push(p),ie.enabled===!0&&ie.isPresenting===!0){const te=S.xr.getDepthSensingMesh();te!==null&&is(te,I,-1/0,S.sortObjects)}is(v,I,0,S.sortObjects),p.finish(),S.sortObjects===!0&&p.sort(ae,k),Xe=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,Xe&&Se.addToRenderList(p,v),this.info.render.frame++,We===!0&&se.beginShadows();const B=h.state.shadowsArray;ye.render(B,v,I),We===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=p.opaque,N=p.transmissive;if(h.setupLights(),I.isArrayCamera){const te=I.cameras;if(N.length>0)for(let ue=0,_e=te.length;ue<_e;ue++){const me=te[ue];na(H,N,v,me)}Xe&&Se.render(v);for(let ue=0,_e=te.length;ue<_e;ue++){const me=te[ue];ta(p,v,me,me.viewport)}}else N.length>0&&na(H,N,v,I),Xe&&Se.render(v),ta(p,v,I);U!==null&&C===0&&(ze.updateMultisampleRenderTarget(U),ze.updateRenderTargetMipmap(U)),v.isScene===!0&&v.onAfterRender(S,v,I),le.resetDefaultState(),y=-1,M=null,b.pop(),b.length>0?(h=b[b.length-1],We===!0&&se.setGlobalState(S.clippingPlanes,h.state.camera)):h=null,T.pop(),T.length>0?p=T[T.length-1]:p=null};function is(v,I,B,H){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)B=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)h.pushLight(v),v.castShadow&&h.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Be.intersectsSprite(v)){H&&De.setFromMatrixPosition(v.matrixWorld).applyMatrix4(J);const ue=O.update(v),_e=v.material;_e.visible&&p.push(v,ue,_e,B,De.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Be.intersectsObject(v))){const ue=O.update(v),_e=v.material;if(H&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),De.copy(v.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),De.copy(ue.boundingSphere.center)),De.applyMatrix4(v.matrixWorld).applyMatrix4(J)),Array.isArray(_e)){const me=ue.groups;for(let Re=0,Le=me.length;Re<Le;Re++){const Ae=me[Re],Ve=_e[Ae.materialIndex];Ve&&Ve.visible&&p.push(v,ue,Ve,B,De.z,Ae)}}else _e.visible&&p.push(v,ue,_e,B,De.z,null)}}const te=v.children;for(let ue=0,_e=te.length;ue<_e;ue++)is(te[ue],I,B,H)}function ta(v,I,B,H){const N=v.opaque,te=v.transmissive,ue=v.transparent;h.setupLightsView(B),We===!0&&se.setGlobalState(S.clippingPlanes,B),H&&ve.viewport(P.copy(H)),N.length>0&&f1(N,I,B),te.length>0&&f1(te,I,B),ue.length>0&&f1(ue,I,B),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function na(v,I,B,H){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[H.id]===void 0&&(h.state.transmissionRenderTarget[H.id]=new ci(1,1,{generateMipmaps:!0,type:Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float")?o1:gn,minFilter:si,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const te=h.state.transmissionRenderTarget[H.id],ue=H.viewport||P;te.setSize(ue.z*S.transmissionResolutionScale,ue.w*S.transmissionResolutionScale);const _e=S.getRenderTarget(),me=S.getActiveCubeFace(),Re=S.getActiveMipmapLevel();S.setRenderTarget(te),S.getClearColor(Y),X=S.getClearAlpha(),X<1&&S.setClearColor(16777215,.5),S.clear(),Xe&&Se.render(B);const Le=S.toneMapping;S.toneMapping=Bn;const Ae=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),h.setupLightsView(H),We===!0&&se.setGlobalState(S.clippingPlanes,H),f1(v,B,H),ze.updateMultisampleRenderTarget(te),ze.updateRenderTargetMipmap(te),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let je=0,lt=I.length;je<lt;je++){const nt=I[je],et=nt.object,we=nt.geometry,rt=nt.material,Ke=nt.group;if(rt.side===bn&&et.layers.test(H.layers)){const kt=rt.side;rt.side=zt,rt.needsUpdate=!0,ia(et,B,H,we,rt,Ke),rt.side=kt,rt.needsUpdate=!0,Ve=!0}}Ve===!0&&(ze.updateMultisampleRenderTarget(te),ze.updateRenderTargetMipmap(te))}S.setRenderTarget(_e,me,Re),S.setClearColor(Y,X),Ae!==void 0&&(H.viewport=Ae),S.toneMapping=Le}function f1(v,I,B){const H=I.isScene===!0?I.overrideMaterial:null;for(let N=0,te=v.length;N<te;N++){const ue=v[N],_e=ue.object,me=ue.geometry,Re=ue.group;let Le=ue.material;Le.allowOverride===!0&&H!==null&&(Le=H),_e.layers.test(B.layers)&&ia(_e,I,B,me,Le,Re)}}function ia(v,I,B,H,N,te){v.onBeforeRender(S,I,B,H,N,te),v.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),N.onBeforeRender(S,I,B,H,v,te),N.transparent===!0&&N.side===bn&&N.forceSinglePass===!1?(N.side=zt,N.needsUpdate=!0,S.renderBufferDirect(B,I,H,N,v,te),N.side=Hn,N.needsUpdate=!0,S.renderBufferDirect(B,I,H,N,v,te),N.side=bn):S.renderBufferDirect(B,I,H,N,v,te),v.onAfterRender(S,I,B,H,N,te)}function d1(v,I,B){I.isScene!==!0&&(I=be);const H=Me.get(v),N=h.state.lights,te=h.state.shadowsArray,ue=N.state.version,_e=q.getParameters(v,N.state,te,I,B),me=q.getProgramCacheKey(_e);let Re=H.programs;H.environment=v.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(v.isMeshStandardMaterial?dt:Mt).get(v.envMap||H.environment),H.envMapRotation=H.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,Re===void 0&&(v.addEventListener("dispose",Z),Re=new Map,H.programs=Re);let Le=Re.get(me);if(Le!==void 0){if(H.currentProgram===Le&&H.lightsStateVersion===ue)return ra(v,_e),Le}else _e.uniforms=q.getUniforms(v),v.onBeforeCompile(_e,S),Le=q.acquireProgram(_e,me),Re.set(me,Le),H.uniforms=_e.uniforms;const Ae=H.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Ae.clippingPlanes=se.uniform),ra(v,_e),H.needsLights=bc(v),H.lightsStateVersion=ue,H.needsLights&&(Ae.ambientLightColor.value=N.state.ambient,Ae.lightProbe.value=N.state.probe,Ae.directionalLights.value=N.state.directional,Ae.directionalLightShadows.value=N.state.directionalShadow,Ae.spotLights.value=N.state.spot,Ae.spotLightShadows.value=N.state.spotShadow,Ae.rectAreaLights.value=N.state.rectArea,Ae.ltc_1.value=N.state.rectAreaLTC1,Ae.ltc_2.value=N.state.rectAreaLTC2,Ae.pointLights.value=N.state.point,Ae.pointLightShadows.value=N.state.pointShadow,Ae.hemisphereLights.value=N.state.hemi,Ae.directionalShadowMap.value=N.state.directionalShadowMap,Ae.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ae.spotShadowMap.value=N.state.spotShadowMap,Ae.spotLightMatrix.value=N.state.spotLightMatrix,Ae.spotLightMap.value=N.state.spotLightMap,Ae.pointShadowMap.value=N.state.pointShadowMap,Ae.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Le,H.uniformsList=null,Le}function sa(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=H1.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function ra(v,I){const B=Me.get(v);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Ec(v,I,B,H,N){I.isScene!==!0&&(I=be),ze.resetTextureUnits();const te=I.fog,ue=H.isMeshStandardMaterial?I.environment:null,_e=U===null?S.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Bi,me=(H.isMeshStandardMaterial?dt:Mt).get(H.envMap||ue),Re=H.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Le=!!B.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ae=!!B.morphAttributes.position,Ve=!!B.morphAttributes.normal,je=!!B.morphAttributes.color;let lt=Bn;H.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(lt=S.toneMapping);const nt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,et=nt!==void 0?nt.length:0,we=Me.get(H),rt=h.state.lights;if(We===!0&&(K===!0||v!==M)){const Lt=v===M&&H.id===y;se.setState(H,v,Lt)}let Ke=!1;H.version===we.__version?(we.needsLights&&we.lightsStateVersion!==rt.state.version||we.outputColorSpace!==_e||N.isBatchedMesh&&we.batching===!1||!N.isBatchedMesh&&we.batching===!0||N.isBatchedMesh&&we.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&we.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&we.instancing===!1||!N.isInstancedMesh&&we.instancing===!0||N.isSkinnedMesh&&we.skinning===!1||!N.isSkinnedMesh&&we.skinning===!0||N.isInstancedMesh&&we.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&we.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&we.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&we.instancingMorph===!1&&N.morphTexture!==null||we.envMap!==me||H.fog===!0&&we.fog!==te||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==se.numPlanes||we.numIntersection!==se.numIntersection)||we.vertexAlphas!==Re||we.vertexTangents!==Le||we.morphTargets!==Ae||we.morphNormals!==Ve||we.morphColors!==je||we.toneMapping!==lt||we.morphTargetsCount!==et)&&(Ke=!0):(Ke=!0,we.__version=H.version);let kt=we.currentProgram;Ke===!0&&(kt=d1(H,I,N));let fi=!1,Ht=!1,Gi=!1;const at=kt.getUniforms(),qt=we.uniforms;if(ve.useProgram(kt.program)&&(fi=!0,Ht=!0,Gi=!0),H.id!==y&&(y=H.id,Ht=!0),fi||M!==v){ve.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),at.setValue(A,"projectionMatrix",v.projectionMatrix),at.setValue(A,"viewMatrix",v.matrixWorldInverse);const Nt=at.map.cameraPosition;Nt!==void 0&&Nt.setValue(A,de.setFromMatrixPosition(v.matrixWorld)),Pe.logarithmicDepthBuffer&&at.setValue(A,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&at.setValue(A,"isOrthographic",v.isOrthographicCamera===!0),M!==v&&(M=v,Ht=!0,Gi=!0)}if(N.isSkinnedMesh){at.setOptional(A,N,"bindMatrix"),at.setOptional(A,N,"bindMatrixInverse");const Lt=N.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),at.setValue(A,"boneTexture",Lt.boneTexture,ze))}N.isBatchedMesh&&(at.setOptional(A,N,"batchingTexture"),at.setValue(A,"batchingTexture",N._matricesTexture,ze),at.setOptional(A,N,"batchingIdTexture"),at.setValue(A,"batchingIdTexture",N._indirectTexture,ze),at.setOptional(A,N,"batchingColorTexture"),N._colorsTexture!==null&&at.setValue(A,"batchingColorTexture",N._colorsTexture,ze));const Yt=B.morphAttributes;if((Yt.position!==void 0||Yt.normal!==void 0||Yt.color!==void 0)&&ne.update(N,B,kt),(Ht||we.receiveShadow!==N.receiveShadow)&&(we.receiveShadow=N.receiveShadow,at.setValue(A,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(qt.envMap.value=me,qt.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&I.environment!==null&&(qt.envMapIntensity.value=I.environmentIntensity),Ht&&(at.setValue(A,"toneMappingExposure",S.toneMappingExposure),we.needsLights&&Tc(qt,Gi),te&&H.fog===!0&&Q.refreshFogUniforms(qt,te),Q.refreshMaterialUniforms(qt,H,V,j,h.state.transmissionRenderTarget[v.id]),H1.upload(A,sa(we),qt,ze)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(H1.upload(A,sa(we),qt,ze),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&at.setValue(A,"center",N.center),at.setValue(A,"modelViewMatrix",N.modelViewMatrix),at.setValue(A,"normalMatrix",N.normalMatrix),at.setValue(A,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Lt=H.uniformsGroups;for(let Nt=0,ss=Lt.length;Nt<ss;Nt++){const Wn=Lt[Nt];Fe.update(Wn,kt),Fe.bind(Wn,kt)}}return kt}function Tc(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function bc(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(v,I,B){const H=Me.get(v);H.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Me.get(v.texture).__webglTexture=I,Me.get(v.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:B,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const B=Me.get(v);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0};const Ac=A.createFramebuffer();this.setRenderTarget=function(v,I=0,B=0){U=v,R=I,C=B;let H=!0,N=null,te=!1,ue=!1;if(v){const me=Me.get(v);if(me.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(A.FRAMEBUFFER,null),H=!1;else if(me.__webglFramebuffer===void 0)ze.setupRenderTarget(v);else if(me.__hasExternalTextures)ze.rebindTextures(v,Me.get(v.texture).__webglTexture,Me.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Ae=v.depthTexture;if(me.__boundDepthTexture!==Ae){if(Ae!==null&&Me.has(Ae)&&(v.width!==Ae.image.width||v.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(v)}}const Re=v.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(ue=!0);const Le=Me.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Le[I])?N=Le[I][B]:N=Le[I],te=!0):v.samples>0&&ze.useMultisampledRTT(v)===!1?N=Me.get(v).__webglMultisampledFramebuffer:Array.isArray(Le)?N=Le[B]:N=Le,P.copy(v.viewport),F.copy(v.scissor),z=v.scissorTest}else P.copy(ce).multiplyScalar(V).floor(),F.copy(pe).multiplyScalar(V).floor(),z=Ne;if(B!==0&&(N=Ac),ve.bindFramebuffer(A.FRAMEBUFFER,N)&&H&&ve.drawBuffers(v,N),ve.viewport(P),ve.scissor(F),ve.setScissorTest(z),te){const me=Me.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+I,me.__webglTexture,B)}else if(ue){const me=I;for(let Re=0;Re<v.textures.length;Re++){const Le=Me.get(v.textures[Re]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Re,Le.__webglTexture,B,me)}}else if(v!==null&&B!==0){const me=Me.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,me.__webglTexture,B)}y=-1},this.readRenderTargetPixels=function(v,I,B,H,N,te,ue,_e=0){if(!(v&&v.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=Me.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(me=me[ue]),me){ve.bindFramebuffer(A.FRAMEBUFFER,me);try{const Re=v.textures[_e],Le=Re.format,Ae=Re.type;if(!Pe.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-H&&B>=0&&B<=v.height-N&&(v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),A.readPixels(I,B,H,N,Ee.convert(Le),Ee.convert(Ae),te))}finally{const Re=U!==null?Me.get(U).__webglFramebuffer:null;ve.bindFramebuffer(A.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(v,I,B,H,N,te,ue,_e=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=Me.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(me=me[ue]),me)if(I>=0&&I<=v.width-H&&B>=0&&B<=v.height-N){ve.bindFramebuffer(A.FRAMEBUFFER,me);const Re=v.textures[_e],Le=Re.format,Ae=Re.type;if(!Pe.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ve=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Ve),A.bufferData(A.PIXEL_PACK_BUFFER,te.byteLength,A.STREAM_READ),v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),A.readPixels(I,B,H,N,Ee.convert(Le),Ee.convert(Ae),0);const je=U!==null?Me.get(U).__webglFramebuffer:null;ve.bindFramebuffer(A.FRAMEBUFFER,je);const lt=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await zl(A,lt,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Ve),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,te),A.deleteBuffer(Ve),A.deleteSync(lt),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,B=0){const H=Math.pow(2,-B),N=Math.floor(v.image.width*H),te=Math.floor(v.image.height*H),ue=I!==null?I.x:0,_e=I!==null?I.y:0;ze.setTexture2D(v,0),A.copyTexSubImage2D(A.TEXTURE_2D,B,0,0,ue,_e,N,te),ve.unbindTexture()};const wc=A.createFramebuffer(),Rc=A.createFramebuffer();this.copyTextureToTexture=function(v,I,B=null,H=null,N=0,te=null){te===null&&(N!==0?(a1("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),te=N,N=0):te=0);let ue,_e,me,Re,Le,Ae,Ve,je,lt;const nt=v.isCompressedTexture?v.mipmaps[te]:v.image;if(B!==null)ue=B.max.x-B.min.x,_e=B.max.y-B.min.y,me=B.isBox3?B.max.z-B.min.z:1,Re=B.min.x,Le=B.min.y,Ae=B.isBox3?B.min.z:0;else{const Yt=Math.pow(2,-N);ue=Math.floor(nt.width*Yt),_e=Math.floor(nt.height*Yt),v.isDataArrayTexture?me=nt.depth:v.isData3DTexture?me=Math.floor(nt.depth*Yt):me=1,Re=0,Le=0,Ae=0}H!==null?(Ve=H.x,je=H.y,lt=H.z):(Ve=0,je=0,lt=0);const et=Ee.convert(I.format),we=Ee.convert(I.type);let rt;I.isData3DTexture?(ze.setTexture3D(I,0),rt=A.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(ze.setTexture2DArray(I,0),rt=A.TEXTURE_2D_ARRAY):(ze.setTexture2D(I,0),rt=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,I.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,I.unpackAlignment);const Ke=A.getParameter(A.UNPACK_ROW_LENGTH),kt=A.getParameter(A.UNPACK_IMAGE_HEIGHT),fi=A.getParameter(A.UNPACK_SKIP_PIXELS),Ht=A.getParameter(A.UNPACK_SKIP_ROWS),Gi=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,nt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,nt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Re),A.pixelStorei(A.UNPACK_SKIP_ROWS,Le),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Ae);const at=v.isDataArrayTexture||v.isData3DTexture,qt=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const Yt=Me.get(v),Lt=Me.get(I),Nt=Me.get(Yt.__renderTarget),ss=Me.get(Lt.__renderTarget);ve.bindFramebuffer(A.READ_FRAMEBUFFER,Nt.__webglFramebuffer),ve.bindFramebuffer(A.DRAW_FRAMEBUFFER,ss.__webglFramebuffer);for(let Wn=0;Wn<me;Wn++)at&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Me.get(v).__webglTexture,N,Ae+Wn),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Me.get(I).__webglTexture,te,lt+Wn)),A.blitFramebuffer(Re,Le,ue,_e,Ve,je,ue,_e,A.DEPTH_BUFFER_BIT,A.NEAREST);ve.bindFramebuffer(A.READ_FRAMEBUFFER,null),ve.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(N!==0||v.isRenderTargetTexture||Me.has(v)){const Yt=Me.get(v),Lt=Me.get(I);ve.bindFramebuffer(A.READ_FRAMEBUFFER,wc),ve.bindFramebuffer(A.DRAW_FRAMEBUFFER,Rc);for(let Nt=0;Nt<me;Nt++)at?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Yt.__webglTexture,N,Ae+Nt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Yt.__webglTexture,N),qt?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Lt.__webglTexture,te,lt+Nt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Lt.__webglTexture,te),N!==0?A.blitFramebuffer(Re,Le,ue,_e,Ve,je,ue,_e,A.COLOR_BUFFER_BIT,A.NEAREST):qt?A.copyTexSubImage3D(rt,te,Ve,je,lt+Nt,Re,Le,ue,_e):A.copyTexSubImage2D(rt,te,Ve,je,Re,Le,ue,_e);ve.bindFramebuffer(A.READ_FRAMEBUFFER,null),ve.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else qt?v.isDataTexture||v.isData3DTexture?A.texSubImage3D(rt,te,Ve,je,lt,ue,_e,me,et,we,nt.data):I.isCompressedArrayTexture?A.compressedTexSubImage3D(rt,te,Ve,je,lt,ue,_e,me,et,nt.data):A.texSubImage3D(rt,te,Ve,je,lt,ue,_e,me,et,we,nt):v.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,te,Ve,je,ue,_e,et,we,nt.data):v.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,te,Ve,je,nt.width,nt.height,et,nt.data):A.texSubImage2D(A.TEXTURE_2D,te,Ve,je,ue,_e,et,we,nt);A.pixelStorei(A.UNPACK_ROW_LENGTH,Ke),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,kt),A.pixelStorei(A.UNPACK_SKIP_PIXELS,fi),A.pixelStorei(A.UNPACK_SKIP_ROWS,Ht),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Gi),te===0&&I.generateMipmaps&&A.generateMipmap(rt),ve.unbindTexture()},this.initRenderTarget=function(v){Me.get(v).__webglFramebuffer===void 0&&ze.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?ze.setTextureCube(v,0):v.isData3DTexture?ze.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?ze.setTexture2DArray(v,0):ze.setTexture2D(v,0),ve.unbindTexture()},this.resetState=function(){R=0,C=0,U=null,ve.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}function hi(n,e,t,i){const s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"));const r=new ic(s);return r.colorSpace=Ot,r.anisotropy=4,i&&(r.wrapS=r.wrapT=G1,r.repeat.set(...i)),r}let oo=7;const gt=()=>(oo=oo*16807%2147483647)/2147483647,co=n=>hi(256,256,e=>{e.fillStyle="#5a4a40",e.fillRect(0,0,256,256);const t=64,i=21;for(let s=0;s*i<256;s++)for(let r=-1;r*t<256;r++){const a=r*t+(s%2?t/2:0),o=s*i,l=120+gt()*50,c=48+gt()*22,u=34+gt()*16;e.fillStyle=`rgb(${l|0},${c|0},${u|0})`,e.fillRect(a+2,o+2,t-4,i-4)}},n),lo=n=>hi(256,256,e=>{e.fillStyle="#8f8270",e.fillRect(0,0,256,256);let t=0;for(;t<256;){const i=28+gt()*26;let s=-gt()*60;for(;s<256;){const r=50+gt()*90,a=175+gt()*35;e.fillStyle=`rgb(${a|0},${a-12|0},${a-34|0})`,e.fillRect(s+2,t+2,r-3,i-3);for(let o=0;o<40;o++)e.fillStyle=`rgba(80,70,55,${gt()*.25})`,e.fillRect(s+gt()*r,t+gt()*i,2+gt()*5,2+gt()*4);s+=r}t+=i}},n),of=n=>hi(256,256,e=>{e.fillStyle="#4a3530",e.fillRect(0,0,256,256);for(let t=0;t<16;t++)for(let i=-1;i<9;i++){const s=i*32+(t%2?16:0),r=t*16,a=gt();e.fillStyle=`rgb(${110+a*40|0},${52+a*18|0},${44+a*12|0})`,e.fillRect(s+1,r+1,30,14)}},n),cf=n=>hi(256,256,e=>{e.fillStyle="#2a2a2e",e.fillRect(0,0,256,256);for(let t=0;t<3e3;t++){const i=30+gt()*40;e.fillStyle=`rgb(${i|0},${i|0},${i+4|0})`,e.fillRect(gt()*256,gt()*256,2,2)}},n),uo=()=>hi(512,512,n=>{n.fillStyle="#1d7a3a",n.beginPath(),n.arc(256,256,250,0,Math.PI*2),n.fill(),n.fillStyle="#f2e6c4",n.beginPath(),n.arc(256,256,236,0,Math.PI*2),n.fill(),n.fillStyle="#1d7a3a",n.beginPath(),n.arc(256,256,228,0,Math.PI*2),n.fill(),n.fillStyle="#f2d34a",n.beginPath(),n.arc(256,256,128,0,Math.PI*2),n.fill();const t=(i,s,r,a)=>{n.save(),n.translate(256,256),n.font='900 64px Impact, "Arial Black", sans-serif',n.fillStyle="#d4252a",n.strokeStyle="#f2e6c4",n.lineWidth=6,n.textAlign="center",n.textBaseline="middle";const o=.26;let l=r-a*(o*(i.length-1))/2;for(const c of i)n.save(),n.rotate(l),n.translate(0,-a*s),a<0&&n.rotate(Math.PI),n.strokeText(c,0,0),n.fillText(c,0,0),n.restore(),l+=a*o;n.restore()};t("KILROY'S",176,0,1),t("BAR N GRILL",180,Math.PI,-1),n.fillStyle="#1d7a3a",n.fillRect(204,194,84,120),n.lineWidth=16,n.strokeStyle="#1d7a3a",n.beginPath(),n.arc(294,256,34,-Math.PI/2,Math.PI/2),n.stroke(),n.fillStyle="#f2e6c4",n.beginPath(),n.arc(222,190,22,0,Math.PI*2),n.arc(252,182,26,0,Math.PI*2),n.arc(280,190,22,0,Math.PI*2),n.fill(),n.fillStyle="#f2d34a",n.font="900 54px Impact, sans-serif",n.textAlign="center",n.fillText("K",246,276)}),lf=()=>hi(1024,256,n=>{const e=n.createLinearGradient(0,0,0,256);e.addColorStop(0,"#3a1d10"),e.addColorStop(1,"#a5571f"),n.fillStyle=e,n.fillRect(0,0,1024,256);for(let t=20;t<1004;t+=9){const i=18+gt()*14;n.fillStyle=["#f6c25b","#7fd17f","#e8e0c8","#c96b3a","#9fd4f0"][gt()*5|0],n.fillRect(t,96-i,6,i),n.fillRect(t,140-i,6,i)}n.fillStyle="#ffdca0",n.fillRect(0,96,1024,3),n.fillRect(0,140,1024,3),n.fillStyle="rgba(20,8,4,0.85)";for(let t=0;t<1024;t+=26+gt()*30){const i=70+gt()*30;n.beginPath(),n.arc(t,256-i,11,0,Math.PI*2),n.fill(),n.fillRect(t-15,256-i+10,30,i)}n.shadowColor="#ff3b6b",n.shadowBlur=18,n.fillStyle="#ff7b9b",n.font="900 54px Impact, sans-serif",n.fillText("KOK",760,72),n.shadowColor="#5bf0ff",n.fillStyle="#c8fbff",n.font="italic 700 34px Georgia, serif",n.fillText("Thanks for playing!",120,66)});function uf(n){const{minX:e,maxX:t}=ot.bounds,i=ot.facadeY,s=k=>new ri({roughness:.85,...k}),r=(k,ce,pe,Ne,Be,We,K,J=!0)=>{const de=new He(new mn(k,ce,pe),Ne);return de.position.set(Be,We,K),de.castShadow=J,de.receiveShadow=!0,n.add(de),de};n.background=new qe(724506),n.fog=new Yr(724506,26,48),n.add(new _2(6977712,2759960,.55));const a=new y2(11188479,.7);a.position.set(-8,16,12),a.castShadow=!0,a.shadow.mapSize.set(2048,2048),Object.assign(a.shadow.camera,{left:-16,right:16,top:14,bottom:-14}),n.add(a);const o=(k,ce,pe,Ne,Be,We=16756848)=>{const K=new v2(We,Ne,Be,1.6);K.position.set(k,ce,pe),n.add(K)};o(-3,2.6,i+1.4,22,11),o(5,2.6,i+1.4,22,11),o(ot.obstacles.find(k=>k.kind==="post").x,4.2,2.3,30,13,16769712);const l=t-e+12,c=(k,ce,pe,Ne=0)=>{const Be=new He(new zn(l,k),pe);Be.rotation.x=-Math.PI/2,Be.position.set(0,Ne,ce),Be.receiveShadow=!0,n.add(Be)},u=ot.curbY-i;c(u,i+u/2,s({map:of([l/4,u/4]),roughness:.95})),c(14,ot.curbY+7,s({map:cf([l/6,14/6]),roughness:1}),-.12),r(l,.12,.25,s({color:10131343}),0,-.06,ot.curbY,!1);for(let k=e-6;k<t+6;k+=3)r(1.6,.01,.12,s({color:14266938,emissive:3811840}),k,-.115,ot.curbY+4.6,!1);const f=s({map:lo([3,3])}),d=s({map:lo([1,4])}),m=s({map:co([6,3])}),g=s({color:1841690,roughness:.6}),x=t-e+1.2,p=0,h=i-.3;r(1,3.6,.6,d,e-.1,1.8,h),r(1,3.6,.6,d,t+.1,1.8,h),r(.9,3.6,.6,d,-5.05,1.8,h),r(3.6,4.6,.6,f,e+1.3,6.1,h),r(3.6,4.6,.6,f,t-1.3,6.1,h),r(x-7.2,4.6,.5,m,p,6.1,h+.02),r(x-7.2,.9,.5,m,p,8.85,h+.02),r(4,.5,.5,m,p,9.55,h+.02),r(x+.2,.25,.8,f,p,3.75,h+.1),r(x,10,6,s({color:2366490}),p,5,h-3.3,!1);for(const k of[-1,1])r(8,7.5+k*.8,6,s({map:co([4,3]),color:6969941}),k*(x/2+4),3.75+k*.4,h-2.7);const T=s({color:3153936,emissive:16757850,emissiveIntensity:.7}),b=s({color:922136,roughness:.2,metalness:.4});for(const k of[-4.4,4.4])for(const ce of[-1,0,1]){const pe=k+ce*1.45;r(1.3,1.7,.1,g,pe,6.2,h+.3,!1),r(1.12,.72,.05,(ce+k)%3===0?T:b,pe,6.6,h+.36,!1),r(1.12,.72,.05,b,pe,5.8,h+.36,!1)}const S=new He(new $r(1.05,48),new ri({map:uo(),emissive:16777215,emissiveMap:uo(),emissiveIntensity:.35}));S.position.set(0,6.3,h+.32),n.add(S),r(2.3,.08,.1,g,0,5.15,h+.32,!1);const w=ot.door;r(1.7,2.7,.1,s({color:789518,roughness:.4}),w.x,1.35,h+.3),r(.06,2.5,.12,s({color:7829367,metalness:.8}),w.x,1.3,h+.37,!1);const R=hi(256,96,k=>{k.fillStyle="#f2efe6",k.font="700 72px Georgia, serif",k.textAlign="center",k.fillText("502",128,74)}),C=new He(new zn(.75,.28),new Nn({map:R,transparent:!0}));C.position.set(w.x,3,h+.36),n.add(C);const U=new He(new zn(13.8,3.2),new Nn({map:lf()}));U.position.set(2,1.6,h-.6),n.add(U);const y=s({color:11821610,roughness:.55});for(let k=-4.4;k<=8.4;k+=1.6){r(.12,3.1,.14,y,k,1.55,h+.25);const ce=r(.55,2.9,.06,s({color:11821610,transparent:!0,opacity:.9}),k+.3,1.45,h+.45,!1);ce.rotation.y=1.1}r(13.2,.14,.16,y,2,3.1,h+.25),r(x-.6,.32,1.5,s({color:3024418}),p,3.45,h+.95);const M=new Nn({color:16765562});for(let k=e+.3;k<t;k+=.55){const ce=new He(new Zt(.06,8,6),M);ce.position.set(k,3.2-Math.abs(Math.sin(k*1.1))*.12,h+1.6),n.add(ce)}const P=s({color:13148266}),F=s({color:11545124}),z=s({color:1118740,roughness:.5,metalness:.6}),Y=s({color:2050613,roughness:.5,metalness:.4});ot.obstacles.forEach((k,ce)=>{if(k.kind==="table"){const pe=ce===3?F:P;r(k.w,.07,.75,pe,k.x,.76,k.y);for(const Ne of[-1,1])r(k.w,.06,.28,pe,k.x,.45,k.y+Ne*(k.h/2-.14));for(const Ne of[-1,1])r(.08,.76,k.h*.9,pe,k.x+Ne*(k.w/2-.2),.38,k.y)}else if(k.kind==="fence"){const pe=k.w>k.h,Ne=pe?k.w:k.h;for(const Be of[.12,1.05])r(pe?Ne:.05,.05,pe?.05:Ne,z,k.x,Be,k.y,!1);for(let Be=-Ne/2;Be<=Ne/2+1e-6;Be+=.13)r(.025,1,.025,z,k.x+(pe?Be:0),.56,k.y+(pe?0:Be),!1)}else if(k.kind==="planter"){r(k.w,.6,k.h,f,k.x,.3,k.y);const pe=new He(new Zt(.45,10,8),s({color:3103274}));pe.scale.set(.9,.7,.6),pe.position.set(k.x-.25,.75,k.y),pe.castShadow=!0,n.add(pe)}});const X=ot.obstacles.filter(k=>k.kind==="post"),W=X[0],j=X[1];r(.4,.5,.4,Y,W.x,.25,W.y);const V=new He(new ki(.07,.1,4,10),Y);V.position.set(W.x,2.4,W.y),V.castShadow=!0,n.add(V);const ae=new He(new Zt(.28,16,12),new Nn({color:16773584}));ae.position.set(W.x,4.6,W.y),n.add(ae),r(.06,1.1,.06,s({color:7830141,metalness:.7}),j.x,.55,j.y);for(const k of[-1,1])r(.16,.36,.14,s({color:3816770,metalness:.6}),j.x+k*.11,1.25,j.y);for(const k of[e-1.6,t+1.6]){const ce=new He(new ki(.12,.16,3,8),s({color:3811872}));ce.position.set(k,1.5,1.8),n.add(ce);const pe=new He(new Zt(1.6,12,10),s({color:1980962}));pe.position.set(k,4,1.8),n.add(pe)}}const hf=JSON.parse('{"guard":{"fps":30,"frames":[[0,950,0,-8,1221,6,-15,1400,13,-15,1471,11,99,1371,5,255,1205,144,145,1420,183,-124,1365,31,-102,1166,206,15,1377,167,72,928,0,201,536,114,312,104,63,-70,924,0,-93,499,42,-89,107,-178,330,3,141,-124,6,-107],[0,946,0,-8,1217,4,-15,1396,14,-15,1467,12,99,1367,6,266,1212,146,140,1418,184,-124,1361,31,-111,1165,211,13,1371,168,71,924,0,203,536,125,313,105,64,-70,920,0,-94,496,48,-87,108,-179,332,6,143,-122,9,-106],[0,941,0,-8,1212,3,-15,1391,15,-16,1462,13,99,1362,7,273,1216,146,137,1415,185,-124,1355,30,-118,1164,215,13,1365,169,71,919,0,205,536,138,315,107,64,-70,915,0,-96,491,53,-86,109,-182,333,9,146,-121,12,-105],[0,938,0,-8,1209,4,-16,1387,16,-17,1458,15,98,1359,9,277,1218,147,134,1412,187,-126,1351,31,-122,1164,221,12,1362,172,72,916,0,208,537,146,317,109,64,-70,912,0,-97,488,56,-85,109,-184,335,12,147,-120,13,-104],[0,938,0,-9,1208,5,-18,1387,18,-18,1458,17,97,1358,11,278,1220,149,131,1412,188,-127,1350,32,-121,1165,223,11,1363,173,72,916,0,210,539,147,317,110,67,-70,911,-1,-97,487,53,-84,107,-185,336,12,148,-119,13,-104],[0,941,0,-11,1212,7,-18,1391,20,-18,1461,18,96,1361,12,273,1220,151,129,1413,187,-127,1354,35,-116,1165,222,13,1366,172,72,920,0,209,540,141,316,110,70,-70,915,-1,-95,490,49,-84,105,-182,335,10,150,-119,10,-103],[0,947,0,-12,1218,9,-19,1396,22,-19,1467,20,95,1367,13,265,1218,154,128,1418,185,-128,1360,38,-109,1165,218,16,1369,171,72,926,-1,206,541,129,315,108,74,-70,920,-1,-92,495,44,-84,104,-177,335,7,151,-119,6,-101],[0,953,0,-12,1223,12,-19,1402,24,-19,1473,23,95,1374,14,256,1215,156,128,1422,185,-128,1366,41,-103,1165,214,18,1373,170,72,932,-1,201,541,114,312,107,78,-70,926,-1,-90,500,37,-85,103,-173,333,3,151,-119,3,-100],[0,956,0,-12,1227,15,-19,1406,26,-19,1476,24,94,1378,16,248,1212,157,129,1424,185,-128,1370,44,-98,1164,211,19,1374,169,72,936,-2,198,539,101,310,105,78,-70,929,-1,-89,503,31,-86,102,-171,332,1,150,-120,0,-100],[0,957,0,-11,1227,16,-19,1406,27,-20,1477,25,94,1379,16,243,1209,158,131,1424,186,-128,1371,45,-94,1161,207,20,1374,169,72,936,-2,196,538,95,309,104,76,-70,930,-1,-89,504,29,-87,102,-172,331,0,149,-121,0,-101],[0,955,0,-12,1225,16,-20,1404,27,-21,1475,25,94,1377,16,242,1206,157,133,1423,186,-129,1367,45,-93,1157,205,18,1372,169,72,934,-1,197,536,96,310,102,71,-70,928,-1,-91,501,31,-87,102,-175,330,0,147,-122,1,-103],[0,950,0,-13,1220,14,-22,1399,25,-22,1470,24,92,1372,15,243,1201,154,136,1418,186,-130,1362,43,-93,1153,204,15,1369,170,72,929,-1,200,534,101,312,100,65,-70,923,-1,-92,497,33,-87,102,-180,331,2,145,-122,4,-105],[0,945,0,-13,1216,12,-22,1394,24,-23,1465,23,92,1367,14,245,1196,149,140,1413,186,-131,1357,41,-93,1150,205,16,1366,171,72,925,-2,204,532,105,315,99,57,-70,918,0,-94,492,34,-86,101,-187,333,5,143,-121,6,-107],[0,942,0,-13,1213,12,-22,1392,24,-22,1462,23,92,1364,12,246,1190,143,143,1407,186,-130,1354,43,-91,1147,206,18,1363,172,72,922,-4,209,530,101,318,98,50,-70,915,2,-91,488,32,-82,100,-193,337,8,141,-118,9,-109],[0,942,0,-14,1213,14,-21,1391,26,-22,1462,25,92,1363,10,245,1184,135,147,1401,186,-129,1354,49,-86,1145,209,23,1360,172,72,922,-7,212,530,91,322,97,49,-69,914,5,-86,487,31,-78,99,-194,341,8,141,-114,9,-109],[0,943,0,-14,1213,17,-21,1392,29,-21,1463,28,91,1364,8,242,1179,127,149,1397,185,-127,1356,59,-80,1144,214,29,1359,172,71,924,-11,212,530,79,327,96,51,-69,915,8,-80,487,29,-74,98,-194,346,7,142,-109,8,-108],[0,943,0,-15,1213,20,-20,1392,33,-20,1463,30,91,1363,5,242,1177,120,152,1395,182,-124,1357,68,-70,1145,221,36,1360,172,71,925,-15,212,529,68,331,96,51,-68,914,12,-76,486,28,-69,97,-194,351,7,142,-104,8,-108],[0,942,0,-15,1212,22,-19,1391,35,-19,1461,32,90,1361,1,243,1175,115,155,1393,179,-121,1356,76,-58,1146,228,43,1361,171,70,924,-19,215,529,63,336,96,50,-67,913,15,-73,485,31,-64,97,-195,356,9,142,-98,9,-108]]},"jab":{"fps":30,"frames":[[0,950,0,-19,1221,17,-26,1401,28,-26,1473,26,89,1373,22,216,1185,165,115,1404,209,-136,1366,44,-111,1153,205,3,1369,177,73,931,-2,197,533,107,317,98,114,-69,921,-2,-81,490,13,-30,98,-205,319,8,207,-82,9,-127],[0,949,0,-19,1220,19,-25,1400,31,-25,1471,28,89,1371,18,218,1183,160,119,1403,206,-134,1365,52,-101,1154,214,10,1370,177,73,930,-5,200,533,103,322,98,114,-69,919,1,-78,489,16,-25,99,-205,325,10,209,-76,10,-125],[0,946,0,-19,1217,19,-24,1397,31,-24,1468,29,89,1367,14,218,1179,156,122,1401,201,-132,1362,57,-93,1154,221,14,1371,178,73,927,-7,203,534,109,326,99,113,-69,916,4,-75,486,20,-23,99,-209,330,12,209,-73,13,-126],[0,942,0,-20,1214,17,-25,1394,30,-24,1465,28,88,1364,12,214,1173,154,123,1397,197,-133,1359,56,-92,1152,221,13,1370,178,73,924,-8,203,538,131,325,103,115,-69,912,5,-73,482,20,-23,100,-216,332,16,211,-72,16,-129],[0,940,0,-20,1212,13,-26,1391,27,-26,1463,24,87,1362,12,210,1171,156,123,1396,203,-135,1357,50,-99,1148,215,7,1367,177,73,922,-8,196,549,169,316,115,130,-69,910,6,-77,480,20,-27,100,-220,328,18,215,-74,18,-132],[0,940,0,-21,1212,8,-30,1391,22,-29,1463,19,84,1365,16,210,1177,161,122,1400,218,-140,1356,36,-113,1145,200,-5,1364,172,73,922,-4,183,567,215,302,137,148,-69,910,3,-85,480,16,-31,101,-223,320,29,218,-78,18,-136],[0,942,0,-24,1214,3,-38,1393,14,-36,1464,11,77,1369,23,217,1195,172,116,1405,251,-148,1356,15,-134,1143,176,-23,1361,165,73,924,4,166,586,254,282,158,168,-69,912,-4,-98,482,4,-43,100,-231,310,44,222,-89,16,-144],[0,946,0,-26,1217,-3,-44,1397,2,-42,1468,0,67,1376,33,231,1226,183,114,1412,294,-152,1358,-16,-155,1143,144,-39,1359,155,72,929,15,155,596,275,271,169,186,-67,915,-14,-114,487,-13,-58,100,-241,306,55,236,-103,12,-158],[0,952,0,-28,1223,-10,-50,1402,-11,-48,1473,-12,52,1384,41,243,1271,193,118,1417,347,-152,1361,-49,-176,1144,107,-61,1359,141,69,936,26,144,595,279,270,167,208,-64,920,-24,-127,494,-34,-74,101,-250,303,56,266,-117,6,-173],[0,956,0,-29,1226,-18,-54,1405,-24,-51,1476,-24,37,1390,46,239,1327,210,140,1411,418,-146,1363,-80,-194,1145,69,-86,1358,127,64,941,37,136,586,271,275,157,239,-59,923,-34,-141,500,-49,-92,104,-261,295,48,306,-132,4,-190],[0,955,0,-28,1225,-21,-55,1404,-31,-53,1475,-30,22,1393,53,204,1379,250,188,1400,494,-136,1360,-102,-206,1144,40,-110,1356,119,57,940,47,130,572,259,277,146,274,-52,922,-43,-158,505,-52,-107,112,-269,277,38,347,-145,7,-203],[0,949,0,-29,1220,-20,-56,1398,-34,-56,1469,-33,5,1391,61,132,1398,297,241,1403,518,-124,1353,-116,-216,1137,14,-135,1349,109,50,934,54,120,559,253,269,136,309,-45,917,-50,-183,509,-49,-123,123,-275,251,25,374,-162,15,-215],[0,939,0,-28,1209,-25,-59,1386,-45,-60,1457,-43,-14,1385,57,95,1398,302,195,1403,527,-114,1339,-135,-224,1123,-20,-155,1333,88,44,924,59,102,549,262,269,133,315,-40,906,-55,-209,510,-52,-133,133,-289,241,23,377,-176,25,-232],[0,927,0,-24,1197,-27,-59,1373,-51,-63,1444,-49,-15,1373,53,107,1399,291,218,1421,509,-106,1323,-144,-220,1104,-37,-164,1319,68,39,911,62,95,537,267,289,129,286,-36,894,-58,-223,507,-63,-132,140,-310,242,30,354,-182,35,-253],[0,920,0,-20,1190,-31,-56,1366,-53,-59,1437,-51,-3,1364,49,131,1381,280,190,1421,516,-109,1315,-143,-205,1088,-36,-155,1308,62,39,906,63,99,530,264,300,125,264,-36,887,-57,-222,499,-72,-124,138,-325,244,37,341,-181,39,-265],[0,923,0,-19,1192,-35,-53,1369,-49,-56,1440,-46,13,1360,46,159,1346,271,148,1426,503,-118,1319,-132,-188,1086,-18,-132,1305,79,43,909,60,100,534,264,299,128,273,-40,889,-54,-214,494,-65,-117,135,-321,248,35,347,-175,36,-260],[0,931,0,-16,1201,-34,-45,1379,-39,-47,1450,-33,33,1363,47,181,1308,264,127,1418,477,-123,1333,-113,-176,1098,5,-102,1311,104,48,916,56,105,544,264,290,133,303,-46,898,-50,-202,496,-45,-111,132,-296,252,28,369,-166,30,-240],[0,941,0,-13,1212,-29,-36,1391,-26,-36,1462,-18,51,1371,49,191,1267,253,123,1401,447,-124,1351,-90,-174,1117,32,-73,1320,127,53,925,51,117,554,259,278,138,333,-51,910,-45,-187,501,-27,-102,128,-267,258,25,393,-155,22,-215],[0,951,0,-12,1222,-26,-30,1401,-18,-29,1472,-9,64,1378,47,195,1239,235,125,1391,415,-126,1365,-71,-175,1135,57,-53,1331,141,58,934,45,129,561,249,270,144,351,-56,920,-39,-170,505,-19,-90,121,-243,260,30,412,-142,14,-193],[0,957,0,-10,1229,-22,-25,1408,-9,-23,1479,0,75,1382,45,194,1220,222,128,1388,389,-127,1374,-51,-172,1146,83,-40,1343,150,63,939,37,136,565,239,264,146,349,-61,928,-32,-156,508,-13,-78,116,-225,258,35,415,-130,8,-175],[0,960,0,-11,1232,-18,-22,1411,-1,-19,1482,8,84,1383,41,190,1205,211,130,1386,366,-128,1379,-32,-162,1151,105,-32,1352,156,66,941,30,139,570,236,260,145,330,-65,931,-25,-144,509,-5,-71,114,-212,255,37,402,-121,6,-162],[0,960,0,-12,1231,-15,-21,1410,6,-18,1481,15,87,1381,37,182,1191,200,128,1383,343,-131,1378,-14,-151,1149,124,-27,1357,162,69,940,23,137,576,243,253,143,297,-67,931,-20,-135,506,7,-67,114,-206,257,35,369,-115,6,-153],[0,955,0,-14,1227,-13,-22,1406,12,-18,1476,19,89,1376,34,178,1179,192,125,1382,321,-133,1372,0,-138,1143,139,-23,1358,166,70,936,18,134,581,253,249,144,255,-68,926,-14,-128,501,16,-66,114,-209,258,32,320,-112,9,-150],[0,947,0,-13,1219,-14,-20,1397,13,-17,1468,20,92,1367,29,179,1167,185,121,1377,298,-131,1362,8,-122,1134,149,-16,1355,168,71,927,14,137,576,255,256,143,208,-69,919,-11,-124,493,26,-61,117,-215,260,28,268,-107,14,-150],[0,938,0,-11,1210,-14,-18,1388,13,-14,1459,19,95,1359,25,182,1156,178,119,1373,274,-129,1352,12,-109,1127,156,-10,1351,169,71,918,12,145,564,247,262,132,184,-70,911,-8,-123,486,42,-53,121,-215,266,25,257,-102,22,-148],[0,931,0,-10,1203,-14,-18,1381,14,-15,1452,20,95,1352,24,186,1150,175,116,1371,255,-129,1345,15,-104,1122,162,-7,1347,172,71,910,11,153,555,240,270,124,171,-70,904,-7,-118,480,53,-48,123,-215,269,27,257,-100,27,-145],[0,929,0,-13,1200,-12,-20,1379,15,-16,1450,20,93,1349,25,187,1149,176,113,1373,241,-131,1343,17,-105,1123,169,-6,1348,172,72,908,9,161,548,227,277,116,160,-70,901,-6,-108,476,56,-43,122,-216,272,29,256,-99,30,-144],[0,933,0,-18,1204,-10,-24,1383,17,-20,1454,21,89,1353,24,185,1153,175,110,1381,230,-135,1348,21,-109,1129,175,-8,1353,170,73,914,7,170,549,213,279,113,166,-69,903,-4,-99,478,56,-42,118,-211,274,25,261,-98,26,-139],[0,942,0,-21,1213,-6,-26,1392,19,-21,1463,23,87,1362,23,186,1163,173,108,1390,227,-136,1357,28,-108,1136,177,-6,1360,168,73,924,4,179,551,193,282,111,180,-69,911,-2,-90,484,52,-42,113,-200,276,16,267,-96,17,-132],[0,951,0,-22,1223,-1,-26,1402,23,-22,1473,26,87,1373,23,190,1174,172,108,1400,226,-137,1367,34,-104,1143,178,0,1366,167,73,933,3,186,550,164,290,111,190,-69,921,-2,-86,493,42,-44,109,-192,280,10,270,-96,10,-127],[0,959,0,-20,1230,5,-26,1410,26,-23,1481,28,88,1382,26,195,1185,173,108,1409,228,-136,1375,40,-98,1150,180,5,1372,168,73,940,3,185,548,141,293,112,190,-69,929,-3,-85,500,30,-47,105,-187,285,8,267,-98,4,-125],[0,962,0,-19,1234,11,-27,1413,30,-25,1485,30,87,1388,30,197,1193,178,106,1415,231,-136,1378,44,-97,1153,184,5,1377,171,73,943,3,184,547,130,296,112,177,-69,933,-5,-88,503,17,-51,102,-187,297,7,253,-100,0,-124],[0,961,0,-19,1233,15,-28,1412,31,-27,1484,30,86,1388,32,199,1197,182,105,1417,234,-137,1377,45,-98,1152,187,2,1377,176,73,942,4,186,545,128,302,109,149,-69,933,-6,-91,503,6,-54,100,-195,306,5,225,-102,0,-128],[0,956,0,-16,1227,15,-27,1407,29,-27,1478,26,88,1383,31,202,1194,183,106,1415,233,-136,1371,42,-98,1147,186,0,1373,178,72,935,5,190,540,130,309,105,127,-69,927,-7,-95,498,4,-53,99,-205,310,5,210,-102,3,-132]]},"cross":{"fps":30,"frames":[[0,950,0,-1,1223,13,-1,1403,34,-3,1475,35,113,1370,22,291,1221,157,180,1435,208,-110,1373,57,-56,1152,200,73,1362,191,72,926,-1,214,543,141,336,109,94,-72,926,-1,-95,498,56,-117,96,-154,362,7,171,-136,6,-63],[0,951,0,-1,1224,16,-1,1404,38,-3,1475,38,113,1370,30,290,1222,168,175,1434,218,-111,1374,54,-65,1151,198,68,1358,194,72,927,1,211,544,146,334,110,98,-71,926,-3,-103,498,50,-120,94,-154,359,8,174,-138,5,-61],[0,948,0,-1,1221,18,-2,1401,41,-3,1472,42,112,1367,39,289,1220,179,171,1431,230,-113,1371,52,-76,1146,195,61,1351,198,72,924,3,212,547,160,333,114,100,-71,924,-5,-111,497,48,-119,92,-156,358,11,176,-140,8,-59],[0,943,0,0,1216,20,-1,1395,46,-1,1466,48,112,1360,49,291,1215,190,171,1424,243,-113,1366,51,-84,1138,192,54,1342,202,71,918,5,216,550,178,340,120,104,-71,919,-8,-122,495,62,-119,96,-152,362,18,182,-143,13,-54],[0,937,0,0,1209,24,-2,1388,55,-2,1459,57,111,1351,63,291,1207,201,171,1415,258,-114,1358,54,-91,1129,193,47,1333,208,71,912,7,221,553,196,351,126,120,-71,913,-11,-132,495,81,-124,102,-144,375,25,199,-149,19,-47],[0,931,0,-1,1203,30,-3,1381,66,-2,1452,68,109,1344,77,289,1194,211,171,1402,272,-116,1350,60,-95,1119,196,42,1324,216,71,906,7,229,557,207,365,129,146,-71,908,-12,-142,495,96,-132,108,-138,403,34,227,-157,25,-41],[0,926,0,-2,1197,37,-6,1374,76,-4,1445,79,107,1337,88,287,1182,214,171,1389,282,-118,1343,68,-95,1110,201,41,1314,224,71,901,5,239,558,208,383,130,176,-71,903,-11,-152,495,107,-142,113,-137,438,44,257,-167,30,-40],[0,923,0,-2,1193,44,-7,1369,85,-5,1440,88,106,1333,95,289,1171,208,177,1377,284,-119,1338,78,-93,1104,209,45,1307,231,71,898,2,250,556,197,403,130,205,-71,899,-9,-160,494,112,-154,116,-139,465,47,284,-181,33,-42],[0,921,0,-2,1190,49,-7,1366,91,-5,1438,94,106,1330,97,294,1162,190,188,1367,277,-119,1334,87,-90,1102,220,51,1303,236,72,897,-3,260,553,178,417,130,222,-71,897,-6,-160,490,111,-170,118,-148,472,43,302,-198,35,-52],[0,920,0,-4,1189,51,-8,1366,93,-5,1437,95,106,1330,91,297,1154,161,200,1358,260,-119,1334,96,-87,1103,231,58,1302,238,72,899,-9,263,550,160,415,127,224,-71,895,0,-154,484,107,-188,120,-162,458,38,308,-219,36,-67],[0,920,0,-7,1190,48,-9,1367,87,-6,1438,88,105,1332,73,293,1146,121,209,1347,235,-119,1335,102,-85,1107,242,64,1304,233,71,901,-19,263,557,158,377,121,210,-69,892,11,-144,476,103,-218,128,-178,417,36,299,-248,37,-91],[0,920,0,-11,1189,47,-10,1368,78,-8,1439,78,101,1334,46,280,1136,78,210,1334,208,-115,1335,114,-84,1112,260,67,1305,231,66,904,-34,266,569,151,341,124,190,-63,888,26,-120,467,109,-250,148,-185,383,36,276,-282,43,-115],[0,917,0,-11,1188,39,-6,1368,59,-7,1439,58,93,1333,2,264,1127,30,210,1321,171,-99,1337,121,-81,1122,281,75,1305,226,56,903,-48,272,578,138,302,126,162,-54,884,41,-73,458,113,-265,175,-186,349,39,246,-312,64,-139],[0,911,0,-13,1182,34,-3,1363,41,-5,1434,39,75,1324,-41,253,1124,-18,211,1315,132,-73,1337,129,-59,1147,319,99,1314,230,43,897,-60,276,586,129,272,132,132,-40,876,54,-14,448,108,-270,215,-184,320,45,215,-327,103,-150],[0,901,0,-15,1172,34,-3,1353,29,-3,1424,24,46,1309,-72,245,1128,-66,218,1318,88,-42,1333,135,-10,1195,364,164,1335,259,30,889,-68,272,590,130,237,138,112,-26,866,61,35,439,97,-283,244,-161,292,55,196,-323,122,-142],[0,890,0,-16,1160,39,-3,1340,22,-2,1411,14,13,1290,-86,228,1131,-115,225,1320,44,-9,1326,136,62,1258,386,275,1361,320,20,880,-72,272,597,135,213,148,102,-16,853,64,69,430,90,-281,249,-136,272,66,183,-332,130,-122],[0,881,0,-15,1149,47,4,1328,21,5,1398,10,-7,1274,-86,210,1129,-153,231,1320,1,24,1318,132,158,1324,366,394,1380,408,18,873,-73,285,601,131,198,158,91,-14,841,63,83,420,86,-287,264,-125,257,75,172,-337,145,-109],[0,875,0,-7,1142,55,25,1318,27,27,1388,15,0,1266,-78,201,1108,-162,247,1306,-22,57,1308,133,257,1352,308,451,1391,455,17,869,-73,301,602,113,190,164,81,-14,833,61,80,411,80,-291,259,-131,250,81,161,-349,144,-111],[0,873,0,8,1139,62,46,1313,29,49,1383,16,16,1261,-75,205,1090,-158,262,1286,-20,77,1305,136,307,1353,268,518,1392,389,14,870,-74,307,600,93,180,165,66,-13,831,61,61,405,69,-307,261,-153,241,82,146,-361,145,-131],[0,876,0,19,1141,62,63,1313,31,69,1384,20,34,1262,-74,220,1081,-145,281,1274,-6,93,1304,138,330,1344,260,547,1377,371,11,871,-75,306,596,81,172,163,56,-13,833,61,36,404,52,-326,253,-175,233,80,135,-376,136,-147],[0,881,0,28,1146,61,80,1317,34,87,1388,26,55,1269,-73,238,1080,-133,301,1270,11,102,1305,144,343,1333,260,565,1354,367,12,876,-74,299,590,78,165,158,53,-16,840,61,9,409,37,-348,245,-188,227,75,131,-391,126,-156],[0,890,0,34,1153,60,92,1324,38,101,1394,32,74,1277,-70,257,1086,-121,315,1274,27,106,1309,150,343,1320,277,561,1329,393,17,883,-73,287,584,83,161,149,54,-21,850,61,-16,418,32,-363,234,-194,224,66,132,-399,114,-158],[0,899,0,37,1163,60,100,1332,45,110,1403,42,91,1287,-65,273,1093,-105,322,1282,46,103,1315,158,329,1300,304,554,1307,403,22,891,-72,271,578,92,159,140,60,-27,861,59,-36,429,35,-368,225,-196,221,57,138,-403,106,-155],[0,909,0,38,1173,58,104,1342,52,115,1412,51,107,1298,-59,290,1102,-86,328,1292,65,95,1323,164,300,1272,331,537,1295,396,28,898,-69,257,571,98,158,130,67,-33,873,57,-51,441,39,-366,218,-199,221,47,145,-405,105,-150],[0,918,0,39,1183,56,104,1351,58,115,1422,58,122,1308,-52,305,1111,-63,331,1304,88,83,1332,168,261,1241,348,500,1287,382,34,904,-66,243,565,102,159,121,74,-39,884,55,-67,453,47,-361,217,-205,221,38,152,-406,108,-149],[0,925,0,38,1191,53,101,1360,62,111,1431,64,133,1316,-44,317,1120,-39,327,1317,109,65,1340,169,214,1206,348,448,1283,361,40,909,-62,233,560,105,160,113,80,-45,894,52,-84,464,56,-358,219,-211,222,31,159,-403,109,-158],[0,931,0,36,1197,50,96,1368,66,105,1439,69,142,1324,-34,328,1130,-12,321,1331,131,45,1347,167,165,1176,337,388,1282,338,46,913,-57,225,556,110,163,108,87,-51,902,47,-104,474,67,-354,221,-214,224,25,166,-399,108,-170],[0,936,0,34,1203,47,89,1374,68,97,1445,72,149,1330,-24,336,1141,19,315,1345,155,25,1353,162,118,1153,316,328,1283,317,52,915,-50,217,553,120,169,103,95,-57,909,42,-126,484,77,-346,220,-219,229,20,175,-392,105,-180],[0,939,0,31,1207,43,80,1380,68,87,1451,72,153,1334,-14,339,1150,49,302,1360,173,4,1358,153,74,1136,288,272,1283,294,58,916,-43,209,551,134,176,100,103,-62,914,35,-149,493,82,-336,216,-223,236,17,184,-385,101,-186],[0,941,0,27,1211,39,70,1384,66,77,1455,71,155,1338,-4,337,1156,76,287,1370,187,-17,1362,140,36,1128,261,225,1286,273,63,916,-34,200,549,149,186,98,113,-67,918,27,-170,502,83,-327,206,-223,245,15,194,-373,91,-185],[0,942,0,23,1213,34,61,1388,62,67,1459,68,155,1340,6,333,1161,98,272,1377,199,-36,1366,123,5,1124,235,187,1290,254,67,916,-24,194,548,163,201,96,125,-70,921,19,-188,509,78,-314,190,-220,258,14,207,-354,73,-181],[0,942,0,20,1214,29,54,1389,58,60,1460,65,154,1341,16,330,1162,116,258,1380,207,-50,1368,107,-18,1123,213,157,1295,236,69,915,-15,191,548,178,220,97,138,-72,921,10,-200,512,67,-298,170,-213,277,14,220,-328,50,-173],[0,940,0,18,1212,25,48,1388,55,53,1459,62,152,1339,25,323,1161,131,248,1380,214,-61,1369,91,-35,1123,198,133,1302,222,70,913,-6,191,549,194,244,101,155,-73,920,2,-202,511,55,-272,151,-212,299,15,236,-305,34,-165],[0,936,0,17,1208,21,44,1385,51,50,1456,59,151,1336,32,318,1157,144,240,1378,220,-68,1366,76,-45,1123,190,116,1308,214,70,908,2,197,551,210,273,106,172,-73,916,-5,-195,504,44,-239,137,-218,327,20,253,-276,29,-156],[0,930,0,19,1202,17,44,1379,48,51,1450,56,152,1329,37,316,1153,158,238,1377,223,-70,1362,64,-49,1124,189,108,1314,208,69,901,8,205,553,226,308,113,190,-72,911,-11,-183,496,42,-200,125,-218,359,26,273,-242,28,-142],[0,923,0,21,1196,14,45,1373,45,51,1443,54,153,1323,40,311,1150,172,235,1378,228,-70,1355,54,-50,1125,192,104,1317,202,68,894,12,209,553,237,338,119,209,-72,905,-14,-170,488,47,-162,118,-214,389,33,293,-210,34,-127],[0,919,0,24,1191,10,45,1368,43,52,1439,52,154,1319,40,306,1149,183,233,1380,230,-69,1350,48,-47,1127,196,103,1323,201,68,889,15,215,551,241,366,124,228,-72,901,-16,-158,485,67,-143,120,-201,416,38,312,-186,37,-111],[0,919,0,23,1191,9,43,1368,42,50,1438,51,152,1319,43,300,1151,193,227,1384,230,-71,1350,45,-44,1132,201,102,1330,200,67,888,16,220,549,237,384,127,248,-71,900,-16,-149,486,81,-121,120,-184,435,39,330,-165,37,-94],[0,922,0,19,1195,8,38,1372,40,43,1443,48,147,1324,41,292,1158,196,218,1392,228,-77,1354,42,-45,1139,202,98,1340,197,68,893,15,226,546,220,390,126,265,-71,902,-15,-146,488,83,-106,117,-174,446,37,341,-150,34,-84],[0,929,0,14,1202,9,32,1380,39,37,1451,45,142,1333,39,287,1169,196,211,1402,225,-83,1361,43,-47,1148,205,94,1350,196,69,901,13,230,544,195,393,127,271,-71,908,-14,-137,490,75,-96,110,-168,446,32,342,-139,27,-78],[0,938,0,10,1211,11,26,1389,38,31,1460,43,136,1344,37,285,1182,193,204,1413,222,-88,1369,45,-50,1157,206,91,1359,193,70,911,12,229,545,178,389,128,257,-71,916,-14,-124,493,62,-87,102,-165,430,26,327,-132,19,-76],[0,946,0,5,1220,12,20,1398,39,25,1469,43,130,1354,37,283,1194,191,198,1424,219,-94,1378,48,-53,1163,205,87,1365,191,70,921,12,224,550,172,373,126,231,-71,923,-13,-118,498,49,-88,97,-161,410,21,298,-132,10,-75],[0,953,0,1,1226,14,14,1405,40,18,1476,43,125,1363,38,279,1202,189,193,1431,219,-99,1384,51,-57,1166,203,84,1368,190,71,929,11,218,554,167,357,123,201,-71,929,-12,-113,502,37,-92,93,-159,389,14,264,-134,3,-75],[0,957,0,-1,1230,15,9,1409,41,12,1480,44,121,1369,38,275,1206,188,188,1434,221,-103,1386,53,-60,1165,200,81,1366,189,71,933,10,214,557,168,341,122,171,-70,932,-12,-111,504,31,-95,92,-158,371,11,233,-136,0,-76]]},"kick":{"fps":30,"frames":[[0,950,0,15,1222,-2,17,1401,21,17,1472,23,130,1363,20,296,1187,135,179,1380,232,-95,1368,28,-102,1132,155,50,1324,177,70,921,1,254,569,165,349,131,108,-73,930,1,-195,541,139,-238,131,-44,384,48,202,-282,48,45],[0,951,0,15,1222,-1,17,1402,21,17,1473,23,130,1364,20,302,1192,133,185,1380,239,-96,1369,29,-104,1135,160,49,1326,179,70,922,0,253,568,164,349,130,110,-73,931,1,-193,541,139,-239,130,-43,384,48,203,-283,48,46],[0,951,0,16,1223,-1,18,1402,22,19,1473,24,130,1365,19,311,1198,125,202,1377,252,-95,1370,31,-106,1140,170,50,1330,183,70,922,0,254,568,162,351,130,111,-73,931,1,-191,541,139,-238,130,-43,386,48,204,-283,48,46],[0,950,0,16,1222,0,19,1401,23,21,1472,25,132,1365,17,324,1202,107,234,1365,266,-93,1370,34,-106,1150,187,56,1334,193,70,921,-1,256,569,161,353,131,111,-73,931,2,-190,541,141,-236,131,-43,388,48,204,-282,49,45],[0,950,0,17,1222,1,20,1401,24,23,1472,26,133,1365,14,338,1206,81,283,1340,280,-91,1371,38,-100,1166,211,71,1342,206,69,921,-2,259,570,160,355,131,111,-73,930,3,-190,540,142,-235,132,-45,390,49,204,-282,50,44],[0,949,0,17,1221,3,22,1400,26,26,1471,27,134,1365,11,351,1212,49,350,1301,278,-89,1372,45,-86,1190,242,96,1354,222,69,920,-4,265,573,158,353,132,112,-73,930,5,-194,541,144,-234,132,-45,391,50,205,-283,50,43],[0,948,0,18,1219,6,25,1398,29,29,1469,31,136,1364,9,361,1218,14,424,1254,249,-85,1373,54,-58,1221,273,133,1372,237,69,919,-7,275,578,158,344,133,123,-73,929,6,-201,541,144,-236,133,-46,393,51,211,-285,51,41],[0,947,0,21,1218,11,31,1397,35,35,1468,35,140,1362,8,367,1224,-24,497,1201,183,-77,1373,66,-15,1256,299,182,1392,244,68,917,-10,284,584,157,330,134,155,-72,928,9,-209,542,143,-239,134,-49,400,52,226,-290,52,37],[0,945,0,26,1215,16,40,1394,40,45,1465,37,146,1359,4,368,1225,-66,552,1151,78,-65,1372,80,40,1290,312,240,1412,238,67,914,-14,291,585,150,324,137,195,-72,927,12,-218,543,140,-246,136,-54,413,54,239,-298,54,31],[0,944,0,34,1214,21,52,1392,43,56,1463,36,154,1356,-4,358,1222,-115,570,1113,-58,-48,1372,93,102,1315,308,303,1427,222,66,913,-18,290,581,140,325,141,233,-72,928,15,-221,541,132,-257,137,-65,421,54,246,-310,54,19],[0,946,0,43,1214,22,65,1392,38,66,1463,28,160,1354,-20,332,1221,-176,539,1092,-208,-29,1375,100,159,1327,285,362,1432,195,64,912,-22,286,575,126,324,143,252,-72,931,18,-222,539,112,-274,135,-84,416,53,240,-328,53,-1],[0,948,0,52,1215,15,77,1393,20,74,1463,7,163,1352,-49,287,1221,-247,465,1088,-352,-6,1380,95,207,1328,249,413,1428,160,61,912,-26,281,567,108,303,138,246,-71,936,23,-223,541,100,-302,144,-101,395,51,220,-354,52,-26],[0,951,0,63,1216,5,88,1394,-6,79,1463,-22,159,1349,-87,224,1224,-315,368,1096,-468,17,1385,82,243,1325,212,457,1413,129,57,913,-30,279,565,94,264,130,215,-69,942,29,-231,551,106,-344,167,-103,360,48,188,-391,58,-51],[0,955,0,69,1218,-12,95,1395,-39,82,1462,-57,146,1343,-131,142,1231,-374,266,1108,-547,37,1390,60,263,1321,186,485,1391,108,53,914,-35,270,564,88,226,126,189,-66,949,36,-240,570,141,-388,201,-72,322,43,163,-435,80,-64],[0,959,0,68,1220,-40,95,1393,-83,80,1460,-102,126,1336,-179,56,1240,-419,163,1105,-594,49,1394,25,262,1313,167,493,1358,100,48,916,-38,259,559,78,187,122,166,-61,957,44,-239,596,199,-430,247,-15,284,39,141,-474,139,-70],[0,962,0,61,1218,-69,82,1389,-123,69,1456,-142,98,1331,-220,-21,1247,-445,76,1092,-609,48,1393,-10,238,1303,157,479,1315,112,43,915,-40,250,552,61,155,119,149,-54,964,52,-215,633,276,-444,329,32,252,36,124,-493,241,-49],[0,966,0,47,1216,-97,57,1385,-159,46,1453,-177,63,1327,-255,-85,1248,-465,17,1071,-601,37,1391,-42,203,1299,147,447,1272,150,37,916,-42,235,543,44,127,115,137,-46,972,59,-170,687,357,-437,434,95,224,33,113,-515,370,14],[0,970,0,28,1213,-121,28,1381,-185,17,1450,-201,24,1322,-281,-131,1238,-483,-10,1043,-571,20,1387,-67,165,1297,140,392,1240,214,29,916,-44,217,536,33,104,111,134,-35,981,66,-101,756,426,-417,539,188,201,28,110,-516,501,113],[0,975,0,7,1210,-138,-3,1378,-202,-12,1447,-217,-15,1319,-298,-162,1210,-494,-1,1026,-523,3,1383,-83,126,1299,140,311,1230,286,22,918,-44,192,530,29,82,106,139,-24,991,70,-15,835,471,-389,636,316,179,23,114,-500,605,256],[0,981,0,-18,1206,-152,-36,1374,-213,-45,1444,-226,-56,1315,-308,-173,1167,-498,25,1026,-464,-18,1377,-95,79,1304,144,205,1237,344,16,921,-43,164,523,30,59,100,150,-13,1001,71,66,921,487,-338,721,469,156,18,126,-463,689,451],[0,983,0,-41,1200,-159,-66,1370,-216,-73,1439,-229,-92,1311,-310,-153,1120,-488,66,1051,-401,-37,1370,-99,30,1311,154,99,1256,383,11,921,-41,142,519,41,46,98,171,-4,1008,71,134,1002,479,-239,807,644,143,15,147,-357,774,684],[0,982,0,-59,1194,-160,-89,1364,-212,-94,1434,-226,-119,1305,-306,-102,1088,-462,108,1098,-334,-53,1362,-98,-11,1315,163,26,1270,401,7,919,-40,135,519,56,49,99,197,3,1010,70,183,1056,459,-59,902,807,146,16,174,-144,876,901],[0,977,0,-66,1188,-158,-101,1358,-206,-106,1428,-220,-130,1301,-301,-29,1086,-425,143,1159,-265,-61,1356,-92,-45,1313,172,-32,1271,413,7,913,-40,147,522,71,71,104,224,5,1005,70,192,1061,454,203,1003,901,168,21,201,188,998,1030],[0,971,0,-68,1185,-153,-107,1355,-200,-114,1424,-215,-128,1298,-297,48,1117,-387,164,1225,-200,-70,1353,-86,-70,1311,179,-73,1268,421,9,909,-42,174,527,67,104,110,227,3,996,71,244,1057,423,467,1090,814,201,28,204,533,1123,920],[0,967,0,-64,1187,-146,-105,1356,-195,-115,1425,-211,-114,1298,-295,112,1167,-353,173,1287,-148,-78,1355,-79,-89,1314,186,-102,1272,427,12,908,-45,203,533,48,139,114,203,-1,988,72,325,1059,344,666,1133,630,236,32,181,763,1190,695],[0,965,0,-75,1189,-135,-111,1357,-189,-123,1425,-206,-109,1299,-289,141,1207,-323,160,1335,-114,-96,1358,-71,-121,1317,192,-146,1276,433,15,909,-48,224,540,27,161,116,170,-2,982,73,387,1051,245,793,1099,438,258,34,147,896,1148,498],[0,968,0,-91,1193,-124,-116,1362,-181,-128,1429,-201,-111,1302,-280,145,1228,-299,140,1365,-95,-107,1364,-63,-154,1317,196,-187,1268,435,12,914,-50,223,542,0,167,113,130,6,984,73,430,1025,137,871,1006,232,264,30,107,994,1024,269],[0,975,0,-91,1205,-113,-112,1375,-170,-124,1441,-193,-117,1312,-268,138,1229,-277,129,1386,-88,-95,1377,-52,-162,1325,202,-173,1240,432,-1,919,-51,202,540,-30,163,106,91,18,990,71,443,1017,5,873,881,10,260,24,68,1001,862,16],[0,982,0,-90,1219,-99,-112,1388,-157,-126,1454,-180,-134,1322,-251,112,1216,-265,117,1395,-97,-78,1393,-43,-160,1330,205,-150,1200,412,-14,927,-49,167,536,-55,141,99,57,31,995,67,421,977,-116,797,742,-197,238,17,36,918,700,-220],[0,989,0,-98,1230,-80,-125,1399,-137,-141,1465,-158,-167,1329,-222,60,1193,-261,100,1390,-121,-68,1405,-33,-154,1328,209,-123,1151,378,-25,935,-46,125,532,-68,106,93,36,44,1001,60,366,909,-212,666,610,-367,203,10,16,769,551,-419],[0,995,0,-104,1241,-53,-139,1410,-104,-155,1477,-121,-203,1340,-174,-12,1168,-250,87,1368,-150,-57,1415,-17,-130,1320,222,-76,1109,337,-38,942,-38,79,529,-65,68,88,33,58,1004,47,284,829,-275,502,492,-482,164,4,12,578,423,-561],[0,997,0,-99,1250,-25,-139,1421,-66,-156,1488,-79,-224,1354,-114,-90,1153,-229,79,1327,-188,-35,1421,-6,-74,1304,232,-6,1076,290,-51,948,-24,37,527,-53,36,87,47,70,1002,28,190,758,-306,329,400,-543,129,1,21,376,326,-639],[0,998,0,-90,1255,-4,-130,1428,-33,-145,1497,-43,-230,1368,-49,-166,1150,-191,45,1267,-235,-12,1419,-9,7,1284,222,77,1049,232,-58,951,-3,4,526,-31,17,88,79,75,1000,3,98,705,-310,162,332,-556,105,0,43,176,255,-660],[0,998,0,-80,1258,10,-114,1434,-14,-127,1503,-21,-218,1382,8,-220,1151,-127,-25,1198,-270,4,1413,-29,101,1266,173,171,1031,156,-57,953,20,-14,525,1,17,91,122,72,998,-23,22,668,-296,18,284,-534,93,0,70,-6,208,-636],[0,997,0,-67,1260,25,-99,1436,2,-111,1506,-5,-192,1392,59,-242,1148,-40,-127,1129,-256,5,1405,-52,174,1258,96,247,1025,67,-48,955,40,-16,525,31,52,101,168,60,994,-46,-39,644,-276,-94,252,-493,101,1,101,-154,178,-582],[0,995,0,-49,1261,34,-85,1436,13,-98,1506,7,-153,1398,101,-234,1148,50,-236,1069,-183,-9,1399,-73,210,1267,6,273,1032,-32,-33,956,54,-17,525,53,108,115,194,42,988,-62,-85,624,-254,-175,226,-447,122,5,127,-262,155,-512],[0,992,0,-31,1260,33,-74,1435,20,-88,1505,17,-103,1402,129,-201,1152,130,-311,1039,-59,-38,1395,-88,203,1277,-93,249,1039,-131,-13,957,65,-12,526,86,167,128,199,18,980,-72,-116,604,-234,-222,200,-405,146,11,148,-324,125,-435],[0,988,0,-23,1258,27,-68,1432,27,-81,1502,28,-53,1402,140,-146,1158,197,-332,1033,96,-77,1390,-84,146,1276,-180,178,1035,-216,12,956,67,-6,529,119,212,139,186,-9,971,-73,-136,584,-212,-248,173,-362,170,18,167,-343,85,-361],[0,981,0,-21,1251,30,-63,1426,42,-74,1496,46,-6,1399,142,-72,1161,247,-282,1035,257,-114,1381,-56,54,1260,-226,65,1017,-262,36,952,59,6,534,158,239,148,163,-33,962,-65,-156,565,-177,-256,144,-304,193,28,184,-327,36,-291],[0,973,0,-9,1243,36,-44,1419,61,-54,1489,66,44,1391,135,28,1162,273,-159,1046,383,-125,1372,-14,-37,1237,-228,-57,993,-253,52,943,45,36,540,194,255,148,146,-52,956,-52,-192,554,-118,-214,129,-268,220,35,201,-298,30,-253],[0,964,0,3,1234,35,-23,1410,68,-32,1480,75,83,1381,112,124,1161,260,-3,1045,435,-123,1362,21,-119,1211,-199,-172,971,-188,62,934,31,74,546,216,267,144,144,-63,947,-37,-207,542,-69,-180,127,-246,244,41,219,-270,36,-227],[0,956,0,12,1226,32,-5,1402,70,-11,1472,78,109,1373,85,209,1161,216,153,1035,420,-113,1354,52,-184,1186,-144,-250,960,-74,67,925,17,109,555,233,286,146,162,-70,938,-22,-203,529,-29,-149,128,-230,267,46,242,-245,45,-205],[0,950,0,17,1220,27,10,1396,67,5,1466,76,124,1365,58,267,1157,147,281,1020,351,-101,1350,73,-226,1161,-70,-272,963,68,68,919,7,137,564,241,301,148,176,-72,932,-11,-199,521,-2,-134,132,-223,284,51,260,-229,50,-191],[0,947,0,17,1217,24,18,1394,63,16,1464,70,130,1360,37,297,1151,64,369,1006,248,-90,1350,84,-240,1139,15,-239,988,209,69,917,3,156,564,234,308,143,176,-73,928,-6,-199,517,18,-126,135,-212,292,54,268,-220,53,-179],[0,945,0,16,1216,22,22,1393,55,20,1464,61,131,1356,21,303,1153,-11,418,988,131,-85,1350,86,-228,1124,99,-163,1039,320,70,916,0,171,564,226,319,140,180,-73,925,-4,-197,515,33,-122,137,-204,299,55,275,-216,55,-169],[0,943,0,15,1214,19,21,1392,49,20,1463,53,128,1354,9,294,1159,-70,433,977,19,-83,1349,87,-198,1122,170,-75,1106,382,70,914,-2,181,566,225,325,140,186,-73,923,-1,-194,512,46,-120,139,-198,303,56,283,-213,57,-162],[0,941,0,13,1212,18,21,1390,46,20,1461,48,125,1352,-2,274,1163,-118,424,972,-76,-80,1350,92,-163,1130,221,1,1170,399,70,913,-5,188,568,224,329,140,191,-72,920,2,-194,510,54,-122,141,-195,304,58,287,-214,59,-157],[0,939,0,11,1211,18,21,1389,45,20,1460,45,122,1351,-9,249,1166,-156,398,970,-155,-78,1350,97,-128,1145,262,64,1223,394,70,913,-6,191,571,226,327,142,194,-72,918,4,-198,510,58,-126,142,-193,302,59,291,-218,59,-153]]},"slash":{"fps":30,"frames":[[0,950,0,9,1232,-8,16,1418,-18,22,1491,-30,128,1376,8,60,1150,153,-102,1010,290,-102,1382,-11,-96,1169,166,-46,1053,387,73,923,1,107,479,28,24,91,-220,-75,927,1,-119,554,241,-139,91,303,78,5,-132,-164,5,403],[0,950,0,9,1232,-8,16,1419,-18,22,1491,-30,128,1376,8,59,1152,156,-103,1013,293,-102,1383,-12,-97,1171,168,-46,1058,390,73,923,1,107,479,28,24,91,-219,-75,927,1,-119,554,240,-139,91,303,78,5,-131,-164,5,404],[0,950,0,9,1232,-8,16,1419,-19,22,1491,-30,128,1377,8,58,1155,160,-105,1018,299,-102,1383,-12,-98,1173,170,-47,1066,395,73,923,1,107,479,28,24,91,-218,-75,928,1,-119,553,239,-139,91,304,78,5,-130,-164,5,404],[0,951,0,9,1233,-8,16,1419,-19,22,1492,-31,128,1377,8,58,1160,165,-107,1027,306,-102,1383,-13,-99,1177,173,-48,1078,402,73,923,1,107,480,28,24,90,-218,-75,928,1,-119,553,238,-138,90,305,78,5,-129,-164,5,405],[0,951,0,9,1233,-9,16,1419,-21,22,1492,-32,128,1378,7,56,1166,172,-110,1039,317,-102,1384,-15,-101,1184,178,-50,1096,411,73,924,1,107,480,28,24,90,-217,-75,928,1,-119,552,237,-139,90,306,78,5,-129,-164,5,406],[0,951,0,9,1233,-9,17,1419,-22,22,1492,-33,128,1378,7,55,1175,181,-113,1058,331,-102,1384,-17,-104,1194,185,-52,1120,423,73,924,1,107,480,28,24,90,-216,-75,928,1,-119,552,235,-139,90,306,78,4,-128,-164,4,406],[0,951,0,9,1233,-10,17,1419,-24,23,1492,-36,128,1379,5,53,1187,191,-118,1082,347,-101,1385,-19,-107,1206,192,-55,1150,435,73,924,1,106,480,28,24,90,-216,-75,929,1,-118,551,234,-139,90,307,78,4,-128,-164,4,407],[0,951,0,9,1233,-11,18,1419,-27,23,1492,-38,129,1379,3,51,1201,201,-123,1113,364,-101,1387,-22,-111,1221,200,-58,1188,447,73,924,1,106,480,28,24,89,-215,-75,929,1,-118,551,234,-139,89,307,78,4,-127,-164,4,407],[0,952,0,10,1233,-12,19,1419,-29,24,1492,-41,130,1380,1,49,1218,211,-127,1149,381,-100,1388,-25,-116,1239,209,-60,1231,457,73,924,1,106,480,28,23,89,-215,-75,929,1,-119,551,233,-140,89,307,77,4,-127,-165,4,408],[0,952,0,10,1233,-14,19,1419,-32,25,1492,-44,130,1380,-2,47,1237,222,-132,1191,396,-99,1389,-29,-121,1261,216,-63,1279,463,73,924,1,105,480,28,23,89,-215,-75,929,1,-119,550,233,-140,89,307,76,4,-127,-165,4,408],[0,952,0,10,1233,-15,20,1419,-34,26,1491,-47,131,1381,-3,45,1260,231,-137,1236,408,-99,1390,-32,-127,1284,223,-64,1331,465,73,924,1,104,480,28,22,89,-215,-75,929,1,-119,550,232,-141,89,308,76,4,-127,-166,4,408],[0,952,0,10,1234,-15,20,1419,-36,26,1491,-49,131,1382,-4,44,1284,240,-140,1286,416,-98,1391,-35,-132,1311,228,-64,1385,462,73,924,1,103,480,28,21,89,-215,-75,930,1,-120,550,230,-142,89,308,75,3,-126,-167,3,408],[0,952,0,11,1234,-15,20,1419,-37,27,1491,-50,131,1384,-5,43,1310,248,-142,1337,420,-98,1393,-38,-137,1339,232,-64,1440,454,73,925,1,102,480,27,20,89,-215,-75,930,1,-120,549,228,-143,89,308,73,3,-126,-168,3,408],[0,953,0,11,1234,-15,20,1420,-38,27,1492,-51,131,1385,-5,42,1338,254,-144,1391,419,-98,1394,-39,-141,1369,234,-62,1495,440,73,925,2,100,481,27,18,88,-214,-75,930,1,-121,548,226,-145,88,308,72,3,-126,-170,3,408],[0,953,0,11,1235,-14,20,1420,-37,27,1492,-51,131,1387,-4,42,1367,258,-145,1444,413,-98,1395,-41,-145,1401,233,-59,1548,422,73,925,2,99,481,26,16,88,-214,-75,931,0,-121,547,223,-147,88,308,70,2,-126,-172,2,409],[0,953,0,11,1235,-13,20,1420,-36,27,1492,-51,130,1389,-3,41,1395,260,-144,1496,402,-98,1395,-42,-148,1432,229,-56,1598,398,73,926,2,97,481,25,14,87,-214,-75,931,0,-122,546,220,-149,87,309,68,2,-126,-174,2,409],[0,954,0,11,1236,-12,20,1421,-35,26,1493,-50,130,1390,-2,42,1422,259,-143,1545,385,-98,1396,-43,-150,1462,222,-51,1644,370,73,926,2,95,481,24,12,87,-214,-75,932,0,-122,545,217,-151,87,309,66,2,-125,-176,2,409],[0,954,0,11,1236,-11,20,1421,-34,26,1493,-49,130,1391,-1,42,1449,256,-140,1590,364,-98,1396,-43,-152,1490,213,-46,1684,339,73,926,2,93,481,23,10,87,-213,-75,932,0,-123,544,214,-153,87,309,64,1,-125,-178,1,409],[0,954,0,11,1236,-9,20,1422,-32,26,1493,-47,130,1393,1,43,1472,252,-136,1630,340,-98,1396,-43,-153,1515,202,-40,1719,305,73,927,2,92,482,23,8,86,-213,-75,932,-1,-123,543,211,-155,86,309,62,1,-125,-180,1,409],[0,955,0,11,1237,-8,19,1422,-30,26,1494,-46,130,1394,2,44,1493,247,-132,1663,315,-98,1396,-44,-153,1536,190,-34,1745,271,73,927,2,90,482,21,6,86,-214,-75,933,-1,-124,541,207,-157,86,309,60,1,-125,-182,1,409],[0,955,0,11,1237,-7,19,1422,-29,25,1494,-44,129,1395,4,46,1510,243,-128,1689,290,-98,1396,-44,-153,1552,180,-28,1764,240,73,927,2,88,482,20,4,86,-214,-75,933,-1,-124,540,204,-159,86,309,58,0,-125,-184,0,409],[0,955,0,10,1237,-5,18,1423,-27,24,1495,-42,129,1395,6,47,1523,238,-124,1709,268,-98,1396,-43,-154,1564,171,-22,1778,212,73,928,2,87,482,19,2,86,-214,-75,933,-2,-125,539,202,-161,86,309,56,0,-125,-186,0,409],[0,955,0,11,1237,-4,18,1423,-26,24,1495,-41,128,1396,7,49,1534,234,-121,1723,249,-99,1396,-44,-154,1571,163,-18,1785,190,73,928,2,86,482,18,1,85,-214,-75,933,-2,-125,539,201,-162,85,308,54,0,-126,-187,0,408],[0,955,0,10,1237,-4,17,1423,-25,23,1495,-40,128,1396,8,50,1541,231,-118,1733,235,-99,1395,-44,-155,1577,157,-14,1789,173,73,927,3,85,482,18,-1,86,-216,-75,933,-3,-126,540,202,-164,86,307,52,0,-127,-189,0,407],[0,955,0,10,1237,-3,16,1422,-24,22,1494,-39,127,1396,9,51,1546,230,-115,1738,224,-100,1394,-44,-157,1581,153,-12,1790,161,73,927,3,83,481,17,-2,86,-218,-75,932,-3,-128,542,205,-166,86,305,51,1,-129,-191,1,405],[0,954,0,10,1236,-2,16,1421,-23,22,1493,-38,127,1395,10,52,1548,230,-115,1740,216,-100,1393,-43,-159,1581,152,-11,1789,152,73,926,3,84,481,16,-2,87,-222,-75,931,-4,-129,545,212,-166,87,301,51,2,-133,-191,2,401],[0,953,0,9,1235,-1,16,1420,-22,22,1492,-37,127,1394,11,52,1548,230,-114,1740,212,-100,1391,-43,-159,1581,152,-11,1787,147,73,925,3,86,480,13,-1,88,-228,-75,930,-4,-129,548,220,-164,88,296,52,3,-138,-189,3,396],[0,952,0,10,1234,-1,16,1419,-21,22,1491,-36,127,1392,12,54,1546,231,-113,1737,209,-100,1390,-42,-160,1578,154,-10,1784,144,73,924,2,89,478,10,3,89,-235,-75,929,-3,-126,554,232,-152,91,295,55,4,-146,-184,4,392],[0,950,0,10,1232,-1,16,1418,-21,22,1490,-35,127,1390,11,53,1542,232,-113,1733,211,-100,1389,-41,-161,1575,156,-11,1780,146,73,922,2,91,477,5,7,91,-246,-75,927,-2,-127,560,245,-143,96,299,59,5,-157,-181,6,391],[0,948,0,9,1230,-1,15,1416,-21,22,1488,-35,127,1388,11,53,1537,234,-114,1728,217,-101,1387,-40,-162,1570,160,-13,1776,152,73,921,1,93,475,-2,12,93,-259,-75,925,-1,-127,565,256,-137,101,311,64,7,-169,-179,9,399],[0,946,0,8,1228,-1,15,1414,-19,21,1486,-33,126,1386,11,52,1529,237,-114,1721,225,-102,1386,-37,-163,1565,166,-14,1771,161,73,919,-1,96,474,-11,17,95,-273,-74,923,0,-124,566,262,-136,104,332,69,9,-183,-180,11,419],[0,944,0,6,1226,-1,14,1412,-18,20,1484,-32,125,1384,11,52,1522,240,-116,1713,235,-103,1384,-35,-164,1558,173,-17,1766,171,73,917,-2,102,473,-22,23,97,-289,-74,921,2,-121,563,264,-140,106,363,75,11,-200,-181,14,451],[0,941,0,5,1224,0,11,1410,-16,18,1482,-30,123,1381,11,51,1513,244,-120,1702,247,-106,1382,-31,-166,1550,182,-22,1759,184,73,915,-5,110,472,-37,31,99,-309,-74,917,4,-119,557,263,-147,110,397,83,14,-220,-183,19,489],[0,938,0,4,1221,3,11,1407,-12,18,1479,-26,123,1378,12,50,1502,250,-123,1689,262,-107,1378,-24,-170,1540,194,-28,1751,201,73,913,-9,121,472,-56,40,102,-332,-74,914,8,-116,554,267,-152,115,425,93,17,-243,-186,32,524],[0,936,0,6,1218,9,11,1404,-5,18,1476,-21,124,1376,15,51,1490,258,-124,1673,280,-107,1375,-13,-170,1528,210,-32,1741,221,72,910,-14,130,473,-80,54,105,-359,-73,912,12,-112,554,275,-149,118,443,107,20,-270,-187,45,548],[0,933,0,9,1215,15,12,1401,3,19,1473,-15,126,1373,19,54,1476,266,-123,1655,303,-106,1371,0,-167,1513,230,-35,1730,247,71,907,-20,135,475,-109,69,108,-392,-72,909,16,-106,557,288,-144,119,446,123,22,-303,-180,51,556],[0,930,0,11,1212,19,15,1398,8,22,1469,-11,129,1369,19,54,1456,272,-121,1631,333,-103,1367,11,-160,1492,252,-36,1713,279,69,904,-24,143,479,-138,88,115,-426,-71,906,20,-102,564,305,-141,115,429,142,25,-342,-167,45,540],[0,928,0,14,1208,23,19,1395,12,26,1466,-8,133,1364,19,54,1430,277,-115,1593,373,-99,1363,24,-145,1459,281,-33,1684,324,68,902,-28,156,484,-156,110,126,-454,-71,904,23,-90,572,320,-124,113,407,164,28,-380,-143,28,509],[0,926,0,11,1208,18,19,1394,5,25,1464,-15,132,1359,8,53,1391,272,-103,1532,414,-99,1363,28,-128,1406,301,-27,1627,375,67,901,-31,171,488,-164,125,138,-471,-69,902,27,-81,581,337,-104,115,363,182,30,-417,-124,29,464],[0,927,0,7,1209,9,17,1395,-3,24,1465,-23,130,1357,-6,63,1341,263,-75,1443,451,-97,1365,31,-105,1334,306,-12,1537,429,67,901,-31,189,494,-165,127,150,-476,-68,902,29,-73,581,339,-88,114,322,191,38,-441,-108,29,423],[0,929,0,4,1211,4,16,1397,-7,22,1468,-26,128,1356,-17,85,1288,249,-33,1331,470,-95,1368,37,-76,1261,292,19,1416,471,67,904,-32,205,500,-161,123,152,-463,-67,903,31,-62,578,336,-73,112,290,187,39,-431,-92,27,391],[0,930,0,-3,1212,3,11,1399,-5,17,1470,-23,121,1356,-23,109,1233,225,10,1216,459,-97,1369,46,-47,1209,268,58,1281,488,67,907,-32,208,501,-151,121,140,-434,-66,903,31,-57,574,331,-60,111,265,188,30,-397,-79,25,367],[0,931,0,-5,1213,3,11,1400,-1,16,1471,-17,120,1355,-27,133,1188,194,48,1118,424,-94,1369,56,-25,1181,248,96,1144,469,69,909,-29,207,500,-140,121,127,-409,-67,904,29,-58,570,325,-49,110,243,200,25,-372,-68,24,345],[0,931,0,-1,1213,5,16,1399,4,20,1471,-10,124,1356,-29,150,1154,160,67,1043,374,-84,1366,67,-4,1155,228,123,1035,413,69,907,-27,210,499,-137,123,124,-404,-68,904,26,-54,567,318,-37,110,221,208,27,-370,-56,25,322],[0,929,0,4,1211,10,22,1397,16,24,1469,4,128,1356,-26,157,1128,129,82,987,327,-73,1361,85,15,1129,210,142,961,352,69,905,-28,210,498,-142,129,125,-413,-69,903,26,-45,565,316,-23,112,200,217,29,-381,-43,27,301],[0,927,0,8,1208,17,26,1394,30,27,1466,19,128,1355,-21,158,1108,102,91,945,286,-64,1353,103,29,1108,194,155,915,303,67,902,-31,209,497,-152,138,126,-429,-68,901,28,-41,562,317,-13,114,182,227,31,-396,-32,29,284],[0,923,0,11,1204,23,29,1389,42,28,1462,34,128,1353,-17,160,1095,80,100,919,255,-57,1344,118,38,1091,180,165,890,270,65,899,-36,209,498,-167,142,126,-444,-66,898,32,-36,559,321,-5,118,169,234,35,-411,-23,32,271],[0,920,0,14,1200,28,31,1385,52,30,1458,46,128,1351,-13,163,1087,68,112,905,238,-52,1338,130,45,1081,176,175,876,250,63,895,-38,209,499,-181,141,124,-453,-65,894,34,-28,558,325,3,121,160,239,38,-421,-16,36,262],[0,916,0,16,1197,29,32,1381,57,30,1454,53,128,1348,-11,169,1084,64,125,900,234,-48,1332,136,52,1076,177,187,871,243,62,892,-40,207,500,-195,148,125,-469,-65,891,35,-19,557,328,9,125,153,245,40,-431,-10,39,254],[0,914,0,15,1194,31,31,1378,59,29,1452,57,125,1347,-10,173,1084,66,134,900,237,-49,1328,139,57,1074,179,198,873,245,62,890,-41,206,500,-202,154,127,-480,-64,888,36,-13,557,330,13,127,147,249,42,-439,-7,42,248],[0,912,0,14,1192,32,27,1376,61,25,1450,59,122,1346,-8,176,1085,68,140,902,242,-53,1325,139,58,1074,181,205,878,252,62,888,-42,208,499,-203,154,129,-485,-64,886,36,-13,556,332,15,129,143,249,44,-444,-5,44,244],[0,910,0,12,1191,32,23,1375,60,21,1449,59,119,1346,-8,177,1087,72,143,905,246,-57,1323,138,58,1074,184,210,884,258,62,887,-41,211,498,-202,153,131,-485,-64,884,36,-18,555,334,14,131,140,248,45,-446,-6,45,241],[0,909,0,11,1190,31,20,1374,59,18,1448,58,117,1346,-8,177,1089,76,143,908,252,-61,1322,136,57,1076,188,212,891,266,62,886,-41,213,498,-201,150,132,-485,-64,883,35,-26,554,335,11,132,138,246,47,-447,-9,46,239],[0,909,0,10,1189,31,17,1374,57,14,1447,57,115,1346,-9,176,1090,80,143,912,259,-65,1322,134,56,1079,191,214,898,274,63,885,-40,213,498,-202,147,133,-487,-65,882,35,-33,554,335,8,132,137,243,48,-449,-12,47,238],[0,908,0,9,1188,30,14,1373,56,12,1447,54,113,1346,-9,177,1092,84,144,916,264,-68,1322,131,55,1081,194,215,904,282,63,885,-40,212,497,-203,147,134,-490,-65,881,35,-36,554,336,7,133,136,242,48,-450,-13,48,237],[0,907,0,9,1187,30,13,1373,54,11,1446,52,113,1345,-11,178,1094,87,145,919,269,-69,1321,129,56,1082,195,218,908,287,63,884,-40,213,497,-203,147,134,-491,-65,880,34,-37,554,337,6,134,136,242,49,-451,-14,49,237],[0,906,0,8,1187,29,12,1372,52,10,1446,50,112,1344,-12,179,1094,89,146,922,273,-70,1321,128,56,1084,197,218,912,292,63,883,-39,215,497,-203,146,135,-491,-65,879,34,-37,554,338,6,135,136,242,49,-451,-14,49,237],[0,906,0,7,1187,29,12,1372,51,9,1446,48,111,1344,-13,181,1095,89,148,924,274,-71,1321,127,56,1085,199,219,915,294,63,883,-39,216,497,-203,146,135,-491,-65,879,34,-36,554,339,5,135,136,241,50,-451,-15,50,237],[0,906,0,7,1186,29,10,1372,49,8,1445,47,110,1344,-14,181,1096,88,148,926,275,-73,1321,125,55,1085,199,219,918,296,63,883,-39,215,497,-204,146,135,-492,-65,879,34,-36,555,339,4,135,136,241,50,-452,-16,50,237],[0,905,0,7,1186,28,8,1372,48,6,1445,45,109,1344,-15,181,1097,88,147,927,275,-76,1320,123,53,1085,197,219,920,297,63,882,-39,215,496,-204,145,136,-493,-65,879,34,-37,555,339,3,136,135,240,50,-452,-17,50,237],[0,905,0,7,1186,28,6,1372,47,4,1445,44,107,1345,-15,181,1097,87,146,928,274,-78,1320,121,51,1086,196,217,921,296,64,882,-39,214,496,-204,143,136,-494,-65,878,34,-38,555,339,2,136,135,238,50,-453,-18,50,236],[0,905,0,6,1186,28,5,1372,46,2,1445,43,106,1345,-15,181,1098,87,145,928,273,-79,1320,120,49,1086,195,215,921,296,64,882,-38,214,496,-204,142,136,-493,-65,878,33,-41,554,339,1,136,135,237,50,-453,-20,50,236],[0,905,0,5,1185,27,4,1371,46,1,1445,42,106,1344,-16,180,1098,88,144,928,274,-80,1320,120,48,1086,195,214,921,296,64,882,-38,214,496,-203,141,136,-493,-65,877,33,-44,555,340,0,136,135,236,51,-453,-21,51,236],[0,904,0,4,1185,27,4,1371,46,1,1445,42,105,1344,-16,179,1097,88,143,928,275,-81,1320,120,48,1085,196,212,919,296,64,882,-38,215,495,-202,140,137,-493,-65,877,33,-45,555,341,-1,137,135,235,51,-452,-21,51,237],[0,904,0,4,1185,28,4,1371,46,1,1444,42,105,1343,-15,178,1096,89,142,927,275,-80,1319,120,47,1085,196,211,918,296,65,881,-37,216,495,-202,140,137,-493,-65,877,33,-46,555,341,-1,137,135,235,52,-452,-21,52,237],[0,904,0,5,1184,28,5,1370,46,2,1444,42,106,1343,-15,179,1096,89,142,926,274,-80,1319,120,47,1084,195,211,917,295,65,881,-37,216,495,-202,141,137,-494,-66,876,32,-47,555,341,0,137,135,236,52,-453,-21,52,236],[0,903,0,5,1184,28,6,1370,46,2,1444,42,107,1343,-15,179,1095,88,141,925,273,-79,1319,120,48,1084,194,210,915,294,65,881,-37,216,495,-202,142,137,-494,-65,876,32,-47,555,341,0,137,134,237,52,-453,-20,52,236],[0,904,0,5,1184,28,6,1370,47,3,1444,42,107,1342,-15,179,1094,87,141,924,272,-78,1320,121,48,1083,194,210,914,292,64,881,-37,216,495,-203,142,137,-495,-66,877,33,-47,554,340,1,137,134,237,52,-454,-19,52,235],[0,904,0,6,1184,28,7,1370,47,4,1444,42,108,1342,-15,180,1094,86,142,923,271,-77,1320,121,49,1083,194,211,913,291,64,881,-38,216,495,-203,143,137,-495,-66,877,32,-46,554,340,2,137,133,238,52,-454,-19,52,235],[0,904,0,6,1185,29,8,1371,47,5,1444,43,109,1343,-15,180,1094,86,143,923,270,-76,1320,122,50,1083,194,212,912,290,64,881,-38,215,495,-203,143,137,-495,-66,877,32,-46,554,339,2,137,133,238,51,-454,-18,51,235]]},"swagger":{"fps":30,"stride":666,"frames":[[0,932,0,5,1202,-6,11,1371,54,6,1429,94,120,1320,63,156,1092,-71,188,884,-194,-95,1349,1,-285,1181,84,-345,1113,310,63,909,33,83,562,282,130,116,264,-64,907,-30,-137,490,-90,-75,143,-367,132,33,363,-118,39,-303],[0,932,0,6,1202,-10,13,1370,53,8,1427,94,120,1316,65,159,1090,-70,194,883,-195,-93,1349,-3,-282,1171,55,-338,1117,286,62,910,36,68,557,278,125,118,207,-63,906,-32,-154,490,-70,-78,172,-376,127,33,304,-119,54,-346],[0,935,0,6,1204,-12,11,1372,51,6,1429,93,117,1319,66,162,1088,-58,203,875,-172,-94,1351,-6,-274,1157,25,-328,1103,256,61,913,38,62,546,258,122,114,152,-62,909,-33,-176,496,-28,-86,201,-353,125,30,250,-118,78,-366],[0,938,0,6,1208,-15,9,1376,49,5,1432,91,116,1323,65,170,1084,-37,219,864,-132,-94,1353,-10,-259,1144,-5,-314,1074,222,61,917,38,59,536,232,122,110,104,-62,912,-32,-195,510,28,-77,227,-300,125,26,201,-111,110,-340],[0,943,0,7,1213,-16,7,1381,46,2,1437,88,114,1329,65,179,1083,-11,233,852,-70,-95,1356,-13,-240,1133,-32,-295,1035,184,62,922,36,61,526,200,125,106,58,-63,918,-30,-213,529,66,-75,240,-248,128,21,155,-103,117,-276],[0,949,0,7,1218,-16,4,1387,45,-2,1444,86,112,1337,65,189,1086,20,244,849,3,-97,1359,-15,-218,1125,-57,-272,992,140,63,926,34,68,519,164,129,100,15,-64,923,-28,-227,548,97,-82,228,-180,132,16,112,-103,101,-189],[0,953,0,6,1222,-13,0,1392,47,-7,1449,87,109,1344,67,198,1094,53,249,857,83,-101,1361,-13,-198,1122,-78,-250,955,93,64,930,31,78,514,128,133,96,-26,-66,928,-26,-235,564,122,-95,200,-100,136,11,71,-122,76,-82],[0,955,0,4,1225,-8,-5,1394,50,-13,1453,89,105,1350,71,205,1104,86,248,877,165,-106,1360,-8,-181,1120,-97,-229,927,44,66,932,27,86,510,95,137,93,-64,-67,931,-23,-231,572,142,-117,165,-9,140,8,32,-156,50,35],[0,955,0,3,1225,-7,-11,1393,53,-20,1452,91,101,1353,72,209,1114,117,244,906,240,-111,1355,-5,-168,1120,-115,-210,906,-5,67,931,23,91,506,67,142,94,-103,-68,931,-19,-217,569,154,-148,130,88,146,8,-7,-199,32,154],[0,951,0,-1,1221,-9,-19,1389,51,-30,1446,91,94,1353,68,209,1125,144,234,942,304,-119,1347,-4,-161,1118,-133,-196,889,-55,69,928,19,97,502,41,147,97,-147,-69,926,-15,-198,557,158,-189,109,184,151,11,-51,-245,31,269],[0,945,0,-7,1215,-11,-27,1382,49,-39,1439,90,87,1350,63,207,1137,169,222,983,357,-127,1338,-4,-157,1113,-144,-185,875,-100,70,923,14,108,497,16,155,104,-194,-69,919,-10,-179,541,158,-233,108,261,160,16,-99,-281,48,364],[0,938,0,-9,1208,-14,-31,1376,44,-44,1429,89,84,1347,54,207,1152,187,213,1026,396,-132,1328,-4,-151,1107,-151,-173,865,-138,71,917,9,121,492,-6,167,115,-243,-70,912,-4,-177,542,182,-235,111,294,172,24,-152,-284,66,404],[0,933,0,-8,1203,-11,-31,1371,47,-45,1422,94,85,1346,51,212,1168,202,209,1068,425,-133,1319,3,-144,1101,-150,-161,858,-158,71,911,4,136,488,-18,181,131,-286,-70,908,0,-174,553,216,-202,113,296,187,34,-202,-253,49,395],[0,928,0,-4,1198,-11,-30,1367,43,-42,1418,90,87,1346,42,224,1178,197,210,1106,430,-132,1310,5,-138,1095,-152,-149,853,-177,71,904,0,155,485,-17,200,158,-321,-71,905,4,-171,561,238,-191,113,257,207,48,-254,-232,31,348],[0,926,0,-3,1195,-22,-30,1364,32,-42,1417,78,87,1346,26,234,1178,172,207,1131,410,-132,1304,-1,-139,1087,-154,-143,846,-195,71,902,-1,171,486,11,210,189,-323,-71,904,7,-160,560,246,-173,115,192,222,64,-297,-213,33,283],[0,929,0,-3,1198,-26,-29,1367,29,-40,1420,74,88,1349,16,240,1173,146,202,1142,385,-132,1306,2,-145,1079,-138,-147,840,-188,70,904,-2,178,496,66,213,223,-288,-71,907,10,-156,551,230,-158,112,138,228,96,-307,-198,30,228],[0,934,0,-2,1203,-26,-26,1371,30,-37,1426,74,90,1354,12,242,1161,116,196,1139,354,-130,1310,9,-153,1074,-112,-157,834,-158,70,909,-3,174,515,127,195,255,-238,-71,912,10,-150,541,207,-147,107,92,221,134,-274,-188,25,183],[0,942,0,-4,1211,-27,-25,1379,30,-36,1436,71,91,1360,9,237,1149,78,187,1123,316,-130,1319,13,-166,1075,-86,-173,833,-115,71,918,0,174,538,168,178,268,-189,-71,919,7,-144,530,170,-140,99,47,209,145,-212,-181,17,138],[0,950,0,-6,1218,-27,-24,1388,29,-33,1446,68,92,1366,8,228,1139,39,180,1094,274,-130,1331,13,-178,1079,-58,-190,836,-60,71,927,4,173,561,201,165,255,-127,-71,926,4,-140,522,128,-136,91,3,193,130,-134,-176,9,93],[0,956,0,-7,1225,-22,-20,1395,33,-27,1454,71,95,1368,13,219,1133,7,179,1056,236,-129,1344,17,-189,1088,-25,-207,847,9,71,934,7,169,579,225,158,229,-56,-70,930,0,-136,516,87,-130,86,-39,179,104,-36,-171,4,51],[0,958,0,-7,1228,-17,-14,1398,38,-19,1457,77,100,1368,20,209,1128,-17,183,1010,196,-125,1353,21,-202,1098,7,-224,867,83,71,937,10,165,589,240,157,195,26,-70,932,-5,-132,512,51,-123,83,-79,173,76,73,-164,1,11],[0,957,0,-3,1227,-14,-5,1397,42,-9,1455,82,108,1363,26,203,1121,-33,191,959,149,-117,1357,22,-212,1108,38,-238,896,155,70,935,14,160,589,248,162,160,116,-70,931,-9,-129,509,24,-115,84,-119,175,56,190,-156,2,-29],[0,953,0,4,1222,-14,5,1392,45,2,1449,87,118,1354,31,198,1111,-42,201,908,93,-107,1355,20,-220,1119,67,-250,932,221,69,929,17,151,581,250,170,134,210,-70,929,-12,-129,505,3,-108,88,-162,183,50,307,-149,6,-71],[0,947,0,13,1216,-15,16,1384,47,14,1440,90,128,1342,36,196,1097,-41,213,863,28,-96,1352,16,-225,1130,90,-258,974,274,67,921,20,141,567,248,182,122,295,-70,924,-15,-131,501,-21,-102,95,-209,191,63,408,-143,13,-118],[0,939,0,19,1208,-13,26,1376,50,24,1431,93,136,1329,42,191,1080,-33,222,838,-40,-86,1348,15,-228,1142,106,-265,1018,313,66,913,24,129,556,251,182,121,347,-69,919,-19,-132,496,-50,-98,102,-260,190,81,469,-140,20,-170],[0,933,0,20,1202,-6,31,1369,58,29,1425,101,139,1317,56,183,1067,-24,221,837,-95,-80,1346,17,-234,1153,117,-274,1060,339,64,906,27,120,554,264,167,118,360,-68,912,-24,-130,492,-78,-91,110,-309,179,74,481,-138,28,-222],[0,927,0,15,1197,5,30,1364,68,28,1421,111,136,1308,74,170,1060,-17,198,833,-102,-79,1346,20,-244,1163,122,-287,1095,352,63,901,30,107,562,287,152,118,339,-66,906,-28,-140,491,-98,-99,124,-353,157,48,447,-144,33,-275]]},"angry":{"fps":30,"stride":1673,"frames":[[0,936,0,14,1197,61,14,1361,129,18,1429,143,121,1323,142,151,1065,189,20,1143,376,-97,1334,108,-106,1299,-153,-164,1119,-304,68,912,-17,83,503,-128,76,148,-395,-70,915,7,-43,533,190,-22,112,328,70,30,-347,-43,63,444],[0,933,0,21,1193,61,21,1358,126,25,1427,138,129,1319,134,163,1058,149,39,1072,356,-91,1327,110,-106,1263,-145,-159,1076,-288,67,906,-15,95,494,-113,83,174,-421,-71,914,5,-42,546,214,-13,109,285,80,47,-414,-36,27,381],[0,932,0,27,1195,45,27,1360,110,30,1429,122,136,1320,113,173,1060,93,73,975,296,-84,1324,98,-121,1215,-140,-164,1010,-261,67,902,-11,100,482,-62,94,202,-406,-72,916,5,-38,552,219,-4,109,198,87,83,-452,-26,28,294],[0,934,0,32,1198,33,33,1363,98,35,1432,110,143,1323,97,179,1066,49,124,885,198,-79,1324,88,-139,1162,-111,-173,936,-191,66,902,-8,94,480,15,98,227,-350,-73,920,3,-28,544,194,3,107,123,90,122,-421,-19,26,219],[0,941,0,30,1206,29,32,1372,91,34,1441,104,142,1331,87,186,1085,2,177,857,82,-79,1329,84,-157,1124,-62,-182,885,-77,66,909,-6,81,494,75,90,236,-287,-72,926,3,-24,532,151,6,100,53,85,121,-340,-16,19,148],[0,948,0,20,1213,31,24,1381,90,25,1450,103,134,1341,81,191,1114,-42,217,875,-21,-87,1338,89,-173,1107,-5,-184,875,59,68,919,-5,68,516,126,75,221,-206,-72,930,1,-29,521,102,3,93,-14,74,96,-230,-18,12,82],[0,953,0,8,1219,36,14,1387,92,15,1455,106,124,1351,74,194,1149,-81,253,916,-100,-96,1344,100,-187,1102,49,-175,907,191,69,928,-4,54,540,166,56,192,-110,-71,932,-1,-32,513,48,-1,88,-78,66,66,-95,-22,7,18],[0,955,0,-1,1220,41,6,1388,96,7,1457,111,115,1356,68,195,1186,-117,287,968,-165,-103,1345,112,-199,1100,101,-154,970,299,70,932,-3,42,556,192,38,155,2,-70,931,-3,-34,509,-5,-3,87,-140,60,41,53,-24,5,-44],[0,953,0,-2,1218,40,5,1386,95,6,1454,111,112,1356,60,197,1223,-151,322,1028,-222,-102,1341,118,-202,1099,148,-122,1047,371,70,930,-2,40,560,201,29,122,123,-70,928,-4,-37,510,-59,0,90,-202,49,27,206,-23,8,-107],[0,946,0,1,1212,34,7,1380,90,8,1448,106,114,1354,49,197,1255,-181,348,1090,-273,-97,1334,117,-195,1099,184,-92,1118,402,70,922,-1,45,548,196,30,105,236,-70,923,-4,-40,508,-83,-4,104,-263,34,35,342,-24,14,-174],[0,937,0,5,1203,29,10,1371,88,10,1439,104,116,1347,45,188,1277,-199,357,1141,-305,-93,1324,117,-185,1095,211,-68,1168,410,70,911,2,46,539,202,31,111,319,-71,915,-5,-45,502,-96,-8,122,-323,18,62,436,-25,23,-244],[0,929,0,4,1195,32,8,1362,91,7,1431,107,115,1339,52,170,1290,-201,342,1167,-318,-96,1316,119,-178,1088,222,-58,1182,409,70,904,3,44,543,223,30,118,350,-70,907,-7,-52,495,-104,-6,143,-371,10,75,469,-25,31,-313],[0,924,0,-3,1189,39,3,1357,97,0,1426,111,111,1332,63,155,1289,-193,316,1158,-316,-102,1311,121,-182,1074,204,-63,1156,397,70,901,1,38,554,241,16,119,328,-70,900,-6,-60,489,-108,-5,169,-411,8,43,430,-27,47,-383],[0,924,0,-11,1190,35,-4,1356,95,-7,1425,107,105,1328,66,151,1274,-188,289,1115,-306,-110,1310,115,-194,1062,151,-83,1088,365,71,904,0,37,561,246,13,117,248,-69,897,-4,-67,483,-90,-11,193,-423,5,36,346,-31,70,-445],[0,928,0,-18,1194,26,-12,1359,91,-14,1428,103,98,1328,66,155,1240,-175,269,1048,-269,-119,1312,105,-200,1061,87,-118,980,300,72,910,-1,35,553,225,11,113,170,-68,899,-2,-76,476,-21,-23,219,-380,3,32,268,-34,113,-449],[0,935,0,-23,1200,26,-20,1365,93,-22,1433,106,91,1331,73,159,1193,-141,248,973,-185,-128,1318,100,-200,1070,44,-167,876,184,72,918,0,37,541,191,8,107,103,-67,904,-3,-75,486,60,-22,245,-310,0,25,201,-43,146,-387],[0,943,0,-19,1209,27,-20,1373,95,-21,1442,110,92,1338,79,169,1146,-85,226,912,-68,-128,1325,96,-194,1090,-2,-210,851,31,72,925,1,42,528,145,11,98,37,-68,914,-4,-71,513,130,-17,256,-229,3,17,135,-49,147,-286],[0,951,0,-9,1217,32,-11,1380,102,-12,1448,119,101,1343,88,176,1114,-17,196,891,75,-119,1332,99,-190,1126,-50,-225,892,-102,71,929,0,52,517,93,21,90,-28,-69,925,-3,-65,546,186,-11,244,-135,12,9,70,-48,127,-168],[0,956,0,2,1220,40,0,1383,111,-1,1450,130,112,1347,101,177,1096,54,151,918,215,-110,1338,104,-182,1173,-88,-223,960,-196,70,932,-4,58,510,38,33,86,-90,-70,933,-1,-53,575,225,-4,217,-34,24,4,7,-44,96,-33],[0,957,0,9,1220,49,6,1382,122,5,1450,141,117,1347,118,172,1089,121,102,985,327,-104,1342,109,-170,1227,-119,-213,1034,-258,69,932,-8,62,508,-20,44,84,-151,-71,936,1,-39,591,245,2,182,77,34,3,-53,-38,68,116],[0,956,0,10,1218,54,7,1380,127,7,1447,146,117,1344,129,163,1089,177,59,1071,394,-104,1344,109,-155,1278,-141,-199,1106,-305,69,930,-10,65,513,-81,52,88,-210,-71,935,1,-31,589,243,5,149,192,43,4,-114,-30,52,267],[0,951,0,8,1213,53,7,1375,127,8,1442,146,116,1338,133,155,1093,221,27,1146,419,-104,1344,105,-138,1316,-155,-180,1165,-339,69,926,-10,69,514,-108,60,100,-269,-71,929,2,-29,563,212,4,127,290,51,9,-181,-20,58,395],[0,943,0,8,1206,54,8,1368,125,10,1436,143,116,1331,134,147,1090,238,14,1180,418,-103,1340,103,-119,1329,-160,-162,1194,-355,69,919,-12,73,510,-122,67,118,-331,-70,921,4,-29,544,193,7,126,339,58,15,-256,-12,89,460],[0,936,0,8,1198,57,9,1362,124,11,1430,141,117,1325,133,147,1079,222,15,1165,405,-103,1334,104,-106,1316,-159,-147,1184,-357,69,912,-14,85,504,-123,80,143,-382,-70,913,5,-26,532,185,14,114,328,69,26,-334,-11,80,448],[0,932,0,16,1193,62,16,1359,125,19,1427,139,125,1321,131,161,1066,187,32,1109,387,-96,1326,106,-99,1284,-154,-136,1137,-342,68,906,-13,99,496,-115,89,168,-414,-71,912,3,-25,540,200,20,110,300,80,41,-405,-10,31,395],[0,931,0,23,1193,51,21,1359,113,24,1428,126,132,1319,116,175,1060,129,62,1025,339,-90,1322,97,-107,1239,-153,-140,1062,-315,67,901,-9,105,485,-73,102,193,-409,-72,914,1,-26,551,214,32,110,215,91,73,-452,4,29,309],[0,932,0,28,1196,37,27,1362,100,28,1430,114,137,1319,102,183,1061,71,105,927,257,-84,1322,83,-123,1184,-138,-153,972,-250,67,900,-3,99,478,0,111,216,-358,-72,917,-2,-27,544,194,39,109,134,97,112,-432,12,28,228],[0,939,0,28,1203,31,28,1370,94,29,1438,108,138,1325,95,189,1076,25,155,871,148,-82,1328,77,-142,1137,-95,-169,901,-138,67,907,0,84,488,62,109,226,-296,-72,924,-4,-28,531,149,45,102,59,99,114,-355,18,21,154],[0,946,0,19,1211,33,21,1378,92,21,1447,108,131,1335,91,192,1102,-16,198,867,43,-90,1336,79,-165,1111,-36,-182,873,5,68,917,1,69,509,117,95,213,-213,-72,928,-6,-31,519,98,46,95,-10,96,90,-247,18,14,84],[0,952,0,6,1217,37,10,1385,94,10,1453,110,120,1345,87,195,1134,-54,235,896,-45,-102,1343,87,-183,1102,20,-181,896,147,69,926,3,53,532,159,77,188,-120,-70,930,-9,-29,512,41,43,90,-78,91,62,-109,16,8,17],[0,954,0,-4,1218,43,0,1387,99,1,1455,115,111,1350,84,196,1172,-92,269,943,-112,-110,1345,100,-200,1098,69,-167,960,265,70,930,6,38,549,188,56,151,-9,-69,930,-13,-26,509,-17,39,88,-143,82,39,44,14,6,-48],[0,952,0,-6,1216,46,-2,1385,103,-2,1453,118,109,1351,81,198,1214,-126,305,1001,-168,-111,1341,110,-209,1097,119,-141,1045,345,70,929,8,31,554,201,38,118,117,-68,929,-15,-24,512,-76,38,91,-204,65,26,201,14,8,-111],[0,948,0,-2,1212,45,0,1380,102,0,1448,117,111,1350,75,196,1252,-155,333,1064,-216,-108,1336,113,-209,1097,158,-114,1126,379,69,923,11,34,541,191,23,99,235,-68,926,-18,-28,512,-100,37,103,-262,34,33,344,15,12,-176],[0,939,0,2,1204,40,4,1371,100,3,1439,113,114,1344,71,186,1281,-174,349,1120,-253,-103,1327,114,-203,1093,184,-93,1181,381,68,912,13,32,534,200,7,108,326,-68,918,-19,-37,506,-111,35,121,-322,-2,60,444,15,20,-247],[0,930,0,3,1195,40,3,1362,100,1,1431,112,114,1336,75,170,1297,-180,342,1157,-276,-104,1318,114,-200,1086,195,-84,1199,375,68,904,14,27,536,220,-4,117,364,-68,910,-19,-46,498,-116,33,142,-370,-22,68,480,16,27,-318],[0,924,0,-4,1188,43,-3,1355,104,-6,1424,113,108,1328,84,158,1296,-173,321,1157,-286,-110,1311,115,-205,1073,177,-92,1172,367,69,899,10,19,550,245,-15,118,340,-69,901,-16,-53,490,-118,31,169,-413,-25,36,438,17,44,-391],[0,921,0,-11,1186,34,-8,1352,99,-11,1421,107,103,1322,82,161,1279,-172,301,1119,-286,-116,1307,106,-209,1061,124,-113,1099,342,70,900,8,14,564,260,-12,120,250,-68,895,-12,-61,480,-98,22,194,-428,-23,39,347,14,70,-455],[0,923,0,-19,1189,24,-17,1353,92,-19,1423,101,94,1322,78,170,1244,-162,280,1049,-254,-126,1307,96,-206,1058,65,-150,980,287,71,905,6,15,556,240,-11,118,170,-68,894,-8,-73,471,-28,0,219,-387,-23,37,268,2,114,-459],[0,929,0,-25,1195,23,-28,1360,87,-31,1430,97,84,1327,77,173,1195,-133,255,971,-173,-136,1313,88,-200,1063,30,-192,867,171,72,913,6,20,543,205,-13,112,101,-67,899,-8,-78,480,52,-12,243,-319,-24,31,199,-23,144,-398],[0,939,0,-23,1204,23,-31,1371,84,-33,1440,94,82,1337,74,178,1148,-82,225,913,-54,-138,1321,82,-191,1080,-12,-216,842,18,72,921,5,24,528,156,-9,103,33,-67,909,-8,-76,506,121,-20,249,-238,-20,21,131,-47,140,-298],[0,948,0,-13,1214,25,-23,1381,85,-26,1449,98,90,1347,76,179,1118,-18,186,900,86,-130,1329,82,-184,1115,-63,-213,879,-107,71,927,3,27,517,99,2,94,-34,-69,921,-6,-69,538,175,-25,233,-146,-10,12,64,-65,116,-176],[0,954,0,0,1220,32,-12,1387,93,-15,1455,108,102,1355,86,174,1104,48,136,937,218,-119,1337,86,-172,1162,-103,-199,938,-190,70,930,-1,31,510,38,14,87,-97,-70,932,-3,-56,566,211,-29,202,-42,2,6,0,-75,83,-34],[0,958,0,8,1222,40,-4,1389,101,-8,1457,117,109,1358,101,166,1101,111,82,1009,318,-113,1344,89,-159,1214,-136,-184,1003,-250,69,931,-4,41,509,-32,27,84,-158,-71,937,-2,-43,581,226,-33,164,74,15,3,-61,-79,55,121],[0,957,0,8,1221,42,-3,1387,105,-5,1455,121,109,1355,111,155,1101,165,34,1094,374,-112,1347,87,-147,1264,-161,-173,1069,-300,69,931,-5,49,513,-73,35,91,-212,-71,936,-1,-41,576,220,-37,133,194,24,3,-121,-80,44,275],[0,952,0,5,1217,40,-3,1382,104,-4,1450,120,107,1348,115,145,1104,207,-1,1164,390,-113,1348,83,-135,1300,-176,-168,1124,-337,69,927,-7,54,513,-96,43,104,-269,-71,929,2,-48,551,191,-39,119,292,33,8,-186,-71,57,400],[0,944,0,4,1208,43,-1,1373,107,-1,1442,123,108,1339,120,138,1100,227,-16,1188,391,-111,1343,85,-118,1314,-177,-159,1153,-352,69,920,-10,61,507,-103,55,121,-324,-70,921,4,-50,540,190,-35,121,336,45,15,-254,-54,85,456]]},"run":{"fps":30,"stride":1081,"frames":[[0,950,0,-1,1225,36,7,1402,82,8,1474,89,120,1348,72,183,1092,2,277,909,145,-108,1365,54,-181,1152,-100,-312,939,-113,74,929,-2,39,506,109,25,123,-146,-72,922,-2,-64,525,183,-91,240,-178,25,30,-52,-101,108,-172],[0,960,0,2,1235,34,7,1414,76,8,1486,82,119,1359,79,195,1102,24,272,946,204,-106,1377,37,-162,1170,-133,-300,965,-171,73,937,0,39,501,39,26,128,-230,-72,933,-4,-56,553,215,-77,207,-88,25,27,-146,-87,79,-58],[0,972,0,6,1248,32,8,1428,67,10,1500,73,119,1374,82,206,1118,39,267,989,244,-101,1391,20,-142,1188,-159,-285,991,-218,73,948,1,40,512,-29,25,142,-302,-72,947,-6,-48,574,224,-59,171,3,24,26,-239,-68,51,57],[0,984,0,9,1260,30,10,1441,59,12,1513,65,120,1387,82,213,1132,51,261,1029,274,-97,1403,8,-127,1203,-175,-271,1012,-249,73,959,2,42,532,-94,21,158,-361,-73,960,-6,-42,585,219,-41,142,94,21,30,-326,-47,34,169],[0,991,0,10,1266,29,11,1449,55,13,1521,60,120,1395,81,215,1140,60,253,1055,292,-95,1410,2,-120,1211,-183,-262,1023,-267,73,966,1,44,561,-165,18,175,-415,-73,967,-6,-39,586,210,-26,127,174,17,44,-406,-26,34,268],[0,993,0,9,1268,28,9,1451,52,12,1523,57,119,1398,79,211,1141,62,245,1064,297,-96,1411,-1,-120,1211,-185,-260,1023,-272,73,968,1,44,585,-210,16,202,-463,-72,968,-5,-38,581,198,-18,122,230,14,70,-471,-10,41,334],[0,988,0,8,1264,27,7,1447,51,9,1519,55,118,1394,77,204,1136,58,238,1054,293,-99,1406,0,-128,1202,-180,-264,1009,-263,73,964,0,43,583,-216,14,223,-500,-72,963,-4,-39,574,194,-16,118,253,11,92,-518,-4,42,360],[0,978,0,7,1254,26,5,1437,50,7,1509,54,117,1385,74,196,1125,48,234,1027,276,-101,1394,2,-141,1183,-167,-274,984,-240,73,954,-1,44,555,-181,16,242,-516,-73,954,-4,-38,568,202,-18,109,238,13,112,-542,-6,33,345],[0,965,0,9,1241,25,5,1423,51,6,1496,55,118,1373,70,191,1112,31,239,988,243,-102,1379,6,-157,1159,-147,-289,953,-200,72,939,-1,49,519,-126,24,260,-505,-73,942,-3,-33,565,219,-16,106,190,22,132,-534,-8,27,295],[0,953,0,13,1229,26,7,1410,59,7,1482,62,122,1360,70,190,1102,12,254,946,197,-101,1364,16,-172,1134,-113,-304,922,-136,71,925,-1,55,490,-60,37,270,-464,-74,932,-2,-23,561,227,-7,113,121,37,141,-491,-4,31,224],[0,944,0,15,1219,31,10,1399,70,10,1471,74,126,1350,73,192,1099,-12,275,918,140,-99,1353,31,-182,1114,-71,-314,902,-51,71,914,-2,61,476,14,53,267,-396,-74,924,-2,-18,548,216,-3,122,43,56,137,-417,-1,36,144],[0,942,0,15,1217,34,13,1395,78,13,1468,82,129,1347,72,192,1108,-44,297,913,72,-99,1351,46,-189,1105,-33,-318,902,36,71,913,-3,65,482,82,68,251,-315,-74,923,-1,-17,528,182,-5,125,-38,75,119,-322,-3,35,59],[0,949,0,14,1223,36,15,1402,80,15,1474,85,130,1354,64,188,1128,-78,318,929,0,-99,1357,57,-195,1109,-5,-315,929,122,71,920,-4,69,504,135,80,222,-229,-74,929,0,-20,511,123,-11,121,-122,91,92,-216,-9,27,-29],[0,960,0,11,1235,36,16,1414,76,16,1486,81,129,1366,53,182,1154,-110,333,958,-72,-100,1370,62,-201,1120,17,-303,969,188,71,932,-6,71,529,167,86,187,-140,-74,939,1,-29,504,44,-21,116,-203,101,60,-106,-18,12,-121],[0,973,0,7,1249,34,16,1429,69,15,1501,73,127,1380,42,174,1180,-137,340,993,-137,-101,1385,63,-204,1134,32,-288,1008,231,72,947,-6,70,550,180,86,152,-51,-73,951,1,-41,515,-39,-31,119,-272,101,34,4,-29,0,-214],[0,986,0,5,1261,32,14,1443,62,13,1515,65,125,1394,32,166,1202,-157,340,1024,-185,-103,1399,62,-205,1146,44,-273,1037,258,72,960,-6,69,563,182,83,128,34,-73,963,0,-54,543,-125,-40,130,-328,92,20,109,-41,0,-302],[0,994,0,4,1269,31,13,1451,58,12,1524,61,124,1403,27,160,1215,-168,335,1042,-212,-104,1407,61,-203,1153,52,-263,1051,272,72,967,-5,67,572,185,78,118,107,-73,971,0,-60,565,-165,-49,154,-372,82,22,197,-49,22,-375],[0,996,0,6,1271,31,14,1453,57,13,1526,58,125,1406,24,156,1217,-170,330,1044,-220,-102,1409,61,-199,1153,55,-257,1049,275,72,968,-5,65,576,192,72,118,154,-74,974,-1,-63,572,-176,-54,177,-412,75,30,252,-52,46,-430],[0,992,0,7,1267,31,16,1449,56,14,1522,58,126,1401,24,157,1208,-166,325,1028,-211,-101,1405,61,-195,1149,51,-256,1029,262,71,964,-4,63,574,198,66,116,164,-74,971,-1,-62,559,-152,-57,197,-437,68,31,266,-54,68,-462],[0,982,0,7,1258,29,17,1440,55,15,1513,57,127,1391,25,159,1189,-155,318,998,-186,-101,1397,58,-193,1141,34,-265,996,225,72,955,-4,61,565,197,62,109,141,-74,961,-1,-61,534,-101,-61,221,-438,60,23,241,-60,92,-467],[0,970,0,5,1246,27,15,1428,55,14,1500,58,126,1377,29,161,1164,-139,309,962,-147,-102,1385,53,-193,1132,4,-284,959,160,72,944,-4,56,554,196,52,106,90,-73,947,0,-65,510,-40,-71,241,-414,49,17,187,-71,113,-443],[0,958,0,1,1234,27,12,1414,61,11,1487,64,123,1362,38,165,1137,-111,300,928,-87,-106,1373,51,-195,1128,-30,-304,928,74,73,934,-3,46,540,187,37,112,17,-72,932,0,-71,495,33,-82,254,-359,36,21,112,-86,124,-384]]},"walk":{"fps":30,"stride":746,"frames":[[0,941,0,-8,1210,10,-4,1388,-4,-3,1457,-17,107,1347,-10,154,1121,-141,196,914,-262,-116,1350,10,-205,1113,88,-281,947,249,71,919,4,29,548,209,0,103,239,-69,915,-6,-55,493,-69,4,178,-380,-6,22,338,-25,53,-385],[0,942,0,-12,1211,2,-7,1389,-13,-6,1458,-28,104,1346,-19,152,1116,-141,198,904,-251,-119,1351,2,-203,1107,64,-275,931,215,72,921,3,30,547,203,-2,102,182,-69,914,-4,-64,489,-32,-2,198,-366,-7,20,281,-26,80,-409],[0,942,0,-14,1211,-4,-9,1389,-20,-8,1458,-34,102,1346,-24,152,1109,-132,203,890,-224,-122,1352,-5,-198,1102,41,-267,912,177,72,923,3,32,543,193,-4,102,133,-69,914,-3,-72,488,25,-13,213,-322,-10,20,232,-31,108,-393],[0,945,0,-17,1214,-7,-12,1391,-22,-10,1460,-35,100,1349,-24,151,1105,-115,210,879,-182,-125,1353,-10,-193,1099,21,-258,896,138,72,926,5,33,536,172,-6,99,87,-68,915,-4,-73,497,79,-17,230,-275,-11,17,186,-42,123,-341],[0,948,0,-15,1217,-9,-12,1395,-23,-10,1464,-36,100,1353,-21,155,1103,-91,218,872,-128,-124,1355,-15,-186,1098,1,-246,882,96,72,929,5,35,529,148,-6,96,44,-69,919,-4,-70,514,126,-17,234,-218,-11,14,143,-53,121,-267],[0,951,0,-11,1221,-8,-9,1399,-21,-7,1468,-34,103,1358,-16,160,1103,-62,226,869,-65,-121,1358,-16,-176,1098,-18,-233,873,53,71,931,5,37,522,120,-2,92,4,-69,924,-4,-62,533,165,-18,223,-154,-7,11,102,-63,106,-181],[0,955,0,-6,1224,-5,-5,1403,-18,-3,1472,-30,107,1363,-11,166,1105,-29,233,874,2,-118,1361,-15,-167,1102,-36,-220,868,8,71,933,3,36,517,88,1,89,-35,-70,929,-3,-53,552,194,-20,201,-80,-4,7,64,-72,83,-79],[0,958,0,-2,1227,-2,-2,1406,-13,1,1475,-25,111,1367,-6,172,1109,4,237,885,71,-114,1364,-11,-158,1106,-53,-209,868,-36,71,934,1,38,513,56,5,86,-72,-70,933,-1,-45,565,211,-23,170,3,1,4,27,-76,57,34],[0,959,0,1,1229,0,0,1407,-8,2,1476,-20,112,1370,-2,175,1114,36,237,902,137,-112,1365,-6,-152,1110,-69,-202,872,-79,70,935,-1,39,511,24,8,85,-108,-71,935,1,-40,568,214,-27,138,92,4,3,-9,-75,36,153],[0,959,0,-1,1228,3,-1,1407,-4,1,1476,-15,111,1370,2,174,1119,63,232,925,197,-113,1364,-2,-151,1115,-83,-199,879,-119,71,935,-4,41,510,-9,9,85,-144,-70,935,3,-41,559,202,-29,112,184,6,3,-45,-70,27,270],[0,957,0,-5,1226,4,-5,1405,-1,-2,1474,-12,108,1368,4,171,1123,84,223,951,248,-117,1363,0,-154,1119,-96,-199,887,-156,71,934,-6,44,510,-34,12,89,-182,-70,931,5,-46,539,170,-29,102,264,8,5,-85,-60,39,371],[0,953,0,-10,1222,5,-10,1401,-1,-7,1470,-11,102,1365,5,167,1125,101,213,977,288,-122,1360,0,-159,1120,-108,-202,895,-186,71,932,-8,47,509,-53,13,97,-222,-69,926,7,-47,535,177,-28,112,320,10,9,-129,-51,71,439],[0,949,0,-11,1218,8,-10,1396,3,-8,1466,-7,102,1360,9,167,1127,117,208,1001,320,-123,1356,4,-160,1121,-113,-202,900,-207,71,928,-10,52,506,-67,18,106,-262,-69,921,8,-45,530,177,-20,120,353,15,13,-173,-39,93,477],[0,945,0,-10,1214,11,-8,1393,4,-6,1462,-6,104,1356,9,170,1128,126,208,1019,340,-121,1353,6,-159,1121,-118,-201,905,-222,71,924,-11,56,504,-80,24,117,-301,-69,918,9,-42,527,177,-14,116,349,21,16,-223,-31,87,473],[0,943,0,-2,1212,14,0,1391,6,3,1460,-5,112,1353,10,178,1126,131,216,1030,351,-113,1350,8,-154,1121,-118,-196,908,-228,70,920,-11,64,501,-86,33,131,-335,-70,918,8,-35,530,180,2,109,326,31,19,-274,-26,58,440],[0,943,0,5,1212,16,7,1390,6,10,1459,-6,119,1352,10,186,1124,129,226,1029,349,-105,1349,8,-150,1118,-115,-191,906,-226,70,918,-10,71,498,-84,37,150,-361,-71,920,6,-33,534,183,10,104,297,38,27,-324,-17,31,399],[0,943,0,13,1212,13,15,1390,0,18,1460,-13,127,1352,5,191,1120,116,236,1019,333,-98,1350,3,-147,1116,-111,-191,901,-216,69,916,-8,82,494,-68,45,168,-371,-71,923,5,-31,541,189,16,100,247,45,40,-368,-8,19,343],[0,944,0,18,1213,5,19,1391,-9,22,1460,-23,131,1352,-4,193,1114,96,242,999,304,-94,1350,-5,-147,1112,-109,-195,893,-203,68,915,-5,89,490,-27,59,189,-356,-72,925,3,-28,544,189,23,100,189,53,66,-392,-2,18,285],[0,943,0,20,1212,-3,21,1390,-16,23,1460,-30,133,1352,-12,193,1109,77,244,972,271,-92,1350,-11,-149,1107,-101,-203,884,-182,68,914,-2,87,490,33,71,209,-315,-72,925,3,-24,542,182,28,100,140,62,98,-378,4,19,235],[0,945,0,21,1214,-7,22,1392,-19,25,1461,-32,134,1353,-17,192,1106,60,245,944,233,-90,1352,-12,-153,1105,-85,-214,877,-144,68,915,-2,78,499,86,75,231,-272,-72,928,4,-25,536,165,33,98,95,74,116,-328,9,17,190],[0,948,0,19,1217,-10,21,1395,-21,23,1464,-33,133,1355,-21,187,1104,42,242,918,189,-92,1355,-11,-159,1105,-67,-227,873,-98,68,919,-2,68,515,134,74,240,-218,-72,930,4,-26,529,142,36,96,52,84,118,-256,11,14,148],[0,951,0,15,1220,-10,18,1398,-20,20,1468,-31,129,1358,-22,181,1102,24,236,896,140,-95,1359,-8,-167,1106,-46,-240,875,-47,69,923,-2,59,534,173,70,232,-157,-72,932,3,-26,523,116,36,93,13,92,107,-172,12,11,108],[0,954,0,10,1223,-9,13,1402,-17,15,1471,-28,125,1361,-21,174,1102,5,229,881,89,-99,1363,-4,-176,1110,-24,-252,881,7,70,927,0,51,552,201,66,210,-86,-71,933,2,-26,518,87,36,90,-26,96,85,-76,11,8,70],[0,956,0,5,1226,-6,9,1404,-13,11,1474,-24,120,1363,-18,167,1102,-16,223,871,35,-103,1366,1,-183,1113,-1,-260,891,60,70,931,0,47,565,218,63,179,-7,-71,934,1,-28,513,58,35,88,-63,93,60,31,10,6,33],[0,957,0,3,1227,-3,7,1405,-8,9,1475,-19,119,1364,-14,164,1104,-37,218,868,-17,-105,1368,5,-187,1116,23,-265,904,112,70,932,1,46,569,223,59,146,80,-71,934,-1,-27,511,28,36,87,-98,84,39,147,11,5,-2],[0,957,0,4,1226,0,8,1405,-4,10,1475,-14,119,1364,-10,163,1106,-58,217,870,-69,-104,1368,10,-188,1119,46,-265,918,158,70,932,2,47,562,214,52,118,172,-71,934,-3,-24,510,-4,39,87,-133,72,30,263,12,6,-38],[0,955,0,6,1225,2,10,1403,-1,12,1473,-11,122,1362,-7,164,1110,-79,217,876,-118,-102,1367,12,-186,1120,64,-261,931,196,70,930,4,52,545,187,45,104,255,-71,933,-5,-23,510,-26,43,92,-169,56,42,367,14,8,-76],[0,952,0,9,1221,3,13,1400,0,15,1469,-9,125,1358,-6,166,1113,-98,217,884,-162,-99,1363,12,-184,1120,77,-255,941,225,69,925,6,52,535,177,37,110,314,-71,930,-7,-24,508,-40,42,99,-208,37,75,437,14,12,-119],[0,948,0,10,1217,5,14,1396,2,16,1466,-7,125,1355,-4,166,1116,-111,214,893,-196,-99,1360,14,-184,1120,89,-252,948,247,69,921,7,49,529,172,29,116,343,-71,927,-8,-29,505,-52,39,109,-247,22,98,469,12,15,-164],[0,945,0,9,1214,7,12,1393,4,14,1463,-6,124,1352,-3,165,1118,-121,210,901,-221,-100,1357,15,-185,1119,96,-251,951,259,69,919,8,46,526,171,22,111,335,-71,924,-9,-34,503,-62,35,120,-283,12,90,462,9,17,-212],[0,943,0,3,1213,10,6,1391,5,8,1461,-6,118,1350,-1,161,1120,-126,204,907,-236,-106,1355,16,-189,1116,98,-254,949,262,70,918,7,41,538,197,17,106,310,-70,920,-9,-37,500,-72,31,134,-319,7,58,429,5,22,-263],[0,942,0,-4,1212,11,0,1390,3,2,1460,-8,112,1349,-2,157,1119,-127,198,909,-241,-112,1353,15,-195,1113,93,-260,943,254,71,919,6,37,543,202,9,104,283,-70,918,-8,-43,498,-76,26,151,-350,1,30,388,0,31,-315]]},"call":{"fps":30,"frames":[[0,950,0,-5,1210,-11,-11,1381,-30,-12,1448,-38,98,1341,-39,153,1091,-54,249,882,-11,-117,1333,-24,-160,1081,-49,-228,870,26,68,927,0,66,516,11,63,85,4,-68,927,0,-41,517,-20,-21,90,-74,89,6,96,-57,11,14],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,153,1092,-55,250,882,-12,-117,1332,-24,-161,1082,-50,-230,870,25,68,927,0,66,516,10,62,85,1,-68,927,0,-41,517,-21,-22,90,-77,88,6,93,-57,11,12],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,153,1092,-57,252,883,-14,-117,1332,-23,-163,1082,-51,-232,871,24,68,927,0,65,516,8,61,85,-2,-68,927,1,-42,517,-22,-23,90,-80,87,6,90,-58,11,8],[0,950,0,-5,1210,-11,-12,1381,-29,-14,1448,-37,97,1341,-39,154,1092,-58,254,885,-17,-118,1332,-22,-165,1082,-52,-236,872,22,68,927,-1,65,516,5,60,85,-5,-68,927,1,-42,517,-24,-25,90,-84,86,6,86,-59,12,5],[0,950,0,-5,1210,-11,-12,1381,-27,-14,1449,-35,97,1342,-38,155,1093,-60,258,886,-20,-118,1332,-20,-168,1083,-53,-242,873,20,68,927,-1,64,516,2,59,85,-9,-68,927,1,-43,517,-25,-26,91,-87,85,6,83,-61,12,2],[0,950,0,-5,1210,-10,-12,1381,-24,-14,1449,-32,97,1342,-36,158,1095,-62,264,889,-24,-118,1332,-18,-173,1085,-55,-250,875,17,68,927,-1,64,516,-1,58,85,-13,-68,927,1,-44,517,-27,-28,91,-91,84,6,79,-62,12,-2],[0,950,0,-5,1210,-9,-12,1382,-20,-14,1449,-27,97,1342,-33,162,1096,-63,272,892,-29,-118,1332,-14,-178,1087,-56,-260,879,14,68,927,-1,63,516,-6,56,85,-16,-68,927,2,-45,517,-29,-30,91,-94,83,6,75,-64,12,-6],[0,950,0,-5,1210,-7,-11,1382,-15,-13,1450,-21,97,1342,-29,168,1099,-64,281,895,-35,-117,1332,-9,-185,1090,-58,-272,883,9,68,927,-2,62,516,-11,55,85,-20,-68,927,2,-45,517,-30,-32,92,-97,82,6,72,-65,12,-9],[0,950,0,-5,1210,-4,-11,1382,-8,-13,1450,-14,98,1342,-23,173,1101,-66,291,900,-43,-117,1332,-3,-191,1094,-60,-285,889,3,68,927,-2,61,516,-12,53,85,-23,-68,927,2,-47,518,-31,-34,92,-100,80,6,69,-67,12,-12],[0,950,0,-4,1210,0,-10,1382,0,-12,1450,-4,99,1342,-16,179,1105,-69,302,906,-53,-116,1332,5,-198,1100,-63,-300,896,-6,68,927,-2,60,516,-13,52,85,-25,-68,927,2,-48,518,-32,-36,92,-102,79,6,66,-69,11,-14],[0,950,0,-4,1210,5,-8,1383,11,-10,1450,8,100,1342,-6,185,1110,-72,313,914,-67,-115,1333,14,-205,1107,-66,-316,906,-17,68,927,-3,59,516,-14,50,85,-26,-68,927,2,-49,518,-33,-39,93,-103,78,6,65,-71,10,-16],[0,951,0,-3,1211,10,-7,1382,24,-8,1450,23,101,1342,5,191,1117,-77,326,925,-83,-113,1333,25,-212,1116,-69,-333,919,-31,68,928,-3,58,517,-15,48,86,-26,-68,928,2,-50,518,-33,-42,93,-103,76,6,64,-73,10,-17],[0,951,0,-2,1211,17,-4,1382,39,-5,1450,40,103,1341,18,198,1125,-82,338,938,-102,-111,1333,37,-219,1127,-71,-350,934,-46,68,928,-4,58,517,-15,47,86,-26,-68,928,1,-52,519,-33,-45,93,-102,75,5,63,-75,9,-17],[0,952,0,-1,1211,25,-1,1380,56,-2,1448,59,106,1339,34,204,1135,-86,349,955,-123,-109,1333,52,-224,1141,-72,-365,953,-63,68,929,-4,57,518,-14,45,87,-24,-68,929,0,-53,519,-33,-47,93,-101,74,5,64,-77,8,-16],[0,952,0,0,1210,34,2,1377,76,2,1445,81,108,1336,51,209,1146,-88,357,973,-144,-106,1332,68,-228,1155,-71,-376,973,-81,68,929,-4,56,518,-12,44,87,-20,-68,929,-1,-54,519,-31,-50,93,-98,72,4,67,-79,7,-14],[0,953,0,1,1209,44,5,1373,97,6,1441,104,111,1332,69,213,1158,-89,361,993,-165,-103,1330,85,-231,1170,-69,-384,995,-99,68,930,-5,56,519,-10,43,88,-16,-68,930,-1,-55,520,-30,-52,93,-93,71,3,70,-81,6,-10],[0,953,0,2,1207,55,8,1367,118,10,1434,129,114,1326,89,215,1171,-88,360,1015,-185,-101,1326,104,-232,1186,-65,-389,1019,-117,68,931,-5,55,520,-7,41,89,-10,-68,930,-2,-56,520,-28,-53,93,-88,70,3,75,-83,5,-6],[0,954,0,2,1205,66,11,1360,140,13,1427,154,116,1319,109,215,1184,-85,356,1038,-203,-99,1322,123,-232,1202,-60,-389,1044,-133,68,932,-6,54,521,-5,40,90,-3,-68,931,-3,-57,520,-25,-55,93,-82,68,2,80,-85,4,-1],[0,954,0,3,1202,77,13,1351,162,16,1417,179,118,1311,128,213,1196,-80,347,1062,-218,-97,1316,142,-231,1217,-52,-386,1069,-146,68,932,-7,53,522,-2,37,91,3,-68,931,-4,-58,521,-22,-58,93,-75,66,2,85,-88,3,5],[0,955,0,2,1198,89,15,1341,184,18,1406,203,119,1302,147,209,1207,-72,334,1084,-229,-96,1309,162,-229,1230,-42,-380,1091,-157,68,933,-8,51,523,1,34,92,10,-68,932,-5,-60,521,-20,-62,92,-68,63,3,91,-91,2,11],[0,955,0,2,1194,100,15,1330,204,19,1393,228,119,1292,166,203,1214,-63,317,1104,-236,-96,1300,180,-227,1239,-31,-370,1109,-164,68,934,-8,50,524,4,30,93,18,-68,932,-6,-62,520,-16,-67,92,-61,59,4,98,-96,1,18],[0,955,0,1,1189,109,16,1317,223,20,1379,250,120,1281,183,195,1217,-53,296,1117,-241,-95,1290,198,-223,1243,-19,-358,1121,-167,68,935,-9,48,524,7,27,94,25,-68,931,-7,-63,520,-13,-71,91,-54,56,5,105,-100,0,25],[0,954,0,2,1184,118,18,1304,240,22,1365,270,121,1270,197,186,1216,-45,272,1125,-243,-94,1280,213,-218,1243,-8,-342,1126,-169,68,934,-10,46,524,10,24,94,30,-68,931,-7,-64,520,-11,-73,90,-48,54,6,111,-103,0,31],[0,953,0,3,1179,125,20,1292,254,25,1350,288,123,1259,209,175,1211,-37,246,1125,-243,-92,1270,226,-211,1238,2,-323,1123,-169,68,933,-10,45,523,11,21,93,33,-68,931,-8,-65,519,-9,-74,90,-44,51,7,116,-104,1,36],[0,952,0,4,1174,131,23,1279,266,29,1335,304,126,1248,220,158,1209,-31,214,1110,-236,-89,1261,238,-201,1230,10,-298,1106,-165,68,932,-11,44,522,12,18,92,36,-68,930,-8,-65,519,-8,-74,89,-41,50,8,120,-106,2,41],[0,951,0,7,1168,137,27,1267,277,33,1321,318,129,1237,230,138,1206,-24,173,1090,-225,-86,1251,248,-188,1220,16,-263,1083,-159,68,930,-11,43,520,13,17,91,38,-68,930,-9,-64,518,-6,-73,88,-38,49,8,125,-106,4,46],[0,950,0,10,1163,142,31,1255,287,38,1306,330,133,1227,238,120,1198,-16,130,1068,-211,-81,1241,258,-174,1208,22,-224,1060,-153,68,929,-12,43,519,14,17,89,42,-68,930,-9,-63,518,-3,-71,88,-35,49,8,130,-105,6,50],[0,949,0,14,1159,147,36,1243,295,43,1293,341,138,1217,246,104,1187,-6,88,1049,-195,-77,1232,268,-160,1195,28,-187,1041,-146,67,927,-13,43,518,16,18,88,46,-69,930,-8,-61,519,1,-69,89,-31,51,8,135,-104,8,55],[0,949,0,16,1155,151,39,1233,303,47,1281,350,141,1209,252,91,1178,3,53,1037,-181,-74,1223,276,-152,1186,35,-157,1029,-140,67,926,-14,43,517,18,18,88,50,-69,930,-8,-60,520,4,-68,89,-27,51,9,139,-104,9,60],[0,949,0,18,1152,154,41,1225,308,49,1271,358,143,1202,257,82,1171,10,28,1032,-170,-72,1217,282,-149,1179,40,-137,1023,-134,67,926,-14,43,517,19,17,88,54,-69,931,-8,-60,520,6,-68,90,-24,52,9,143,-104,10,64],[0,948,0,18,1150,156,43,1219,312,51,1263,363,144,1197,260,78,1168,15,12,1031,-164,-70,1211,286,-150,1176,46,-126,1023,-131,67,926,-14,42,517,21,16,88,57,-69,931,-8,-60,520,8,-68,90,-21,51,9,146,-105,11,67],[0,948,0,19,1148,158,44,1214,315,52,1258,367,145,1193,263,77,1167,17,5,1034,-162,-70,1208,289,-153,1174,50,-122,1025,-129,67,926,-15,42,517,22,16,88,60,-69,931,-9,-60,520,10,-68,90,-19,51,10,149,-105,11,70],[0,948,0,19,1147,160,44,1211,317,53,1253,370,145,1190,265,77,1167,19,2,1039,-163,-69,1205,292,-155,1174,53,-123,1029,-129,67,926,-15,42,517,22,16,88,61,-69,931,-9,-60,520,11,-68,90,-17,51,10,150,-105,11,71],[0,948,0,19,1146,161,45,1209,319,53,1251,372,146,1188,266,78,1167,20,0,1043,-164,-69,1203,293,-157,1173,55,-124,1032,-129,67,926,-15,42,517,23,16,89,62,-69,931,-9,-60,520,11,-69,90,-16,50,10,151,-105,11,72],[0,948,0,19,1145,161,45,1207,320,54,1248,373,146,1186,267,79,1167,20,0,1045,-164,-69,1202,294,-158,1173,56,-124,1033,-130,67,926,-15,42,517,23,16,89,63,-69,931,-9,-60,520,12,-68,90,-16,50,10,152,-105,11,73],[0,948,0,19,1144,162,45,1206,321,54,1247,374,146,1185,267,79,1167,21,0,1045,-164,-68,1201,295,-158,1172,57,-124,1034,-129,67,926,-15,42,517,23,16,89,63,-69,931,-9,-59,520,12,-68,90,-15,51,10,152,-105,11,73],[0,948,0,19,1144,163,45,1205,322,54,1246,375,146,1184,268,79,1167,21,0,1045,-163,-68,1200,296,-158,1171,58,-124,1034,-129,67,926,-15,43,517,23,17,89,63,-69,931,-9,-59,520,12,-67,90,-15,51,10,152,-104,11,73],[0,948,0,19,1143,163,46,1204,322,54,1245,376,146,1183,269,78,1167,22,0,1046,-163,-68,1199,297,-158,1172,59,-124,1034,-129,67,926,-15,43,517,23,19,89,63,-69,931,-9,-58,520,12,-66,90,-15,52,9,152,-102,11,73],[0,948,0,19,1142,164,46,1203,323,55,1243,377,147,1182,269,78,1166,23,0,1046,-163,-68,1198,297,-157,1172,59,-124,1035,-128,67,926,-15,44,517,23,20,89,64,-69,931,-9,-58,520,12,-65,90,-15,53,9,152,-101,11,73],[0,948,0,19,1142,165,46,1201,324,55,1242,378,147,1181,270,77,1166,24,0,1047,-162,-67,1197,298,-157,1171,60,-124,1035,-128,67,926,-15,44,517,23,20,89,64,-69,931,-9,-57,520,13,-64,90,-14,53,9,153,-100,11,73],[0,948,0,19,1141,165,46,1200,325,54,1241,379,146,1180,271,77,1167,25,1,1047,-162,-68,1196,299,-156,1171,60,-124,1036,-128,67,926,-15,44,517,24,21,89,64,-69,931,-9,-57,520,13,-64,90,-14,53,9,153,-100,11,74],[0,948,0,19,1141,166,45,1199,326,54,1240,380,146,1179,271,77,1167,25,1,1047,-162,-68,1195,300,-156,1170,61,-124,1036,-128,67,926,-15,45,517,24,21,89,65,-69,931,-9,-57,520,13,-63,90,-13,54,9,154,-99,11,74],[0,948,0,18,1140,166,45,1198,326,53,1239,380,145,1178,272,76,1167,26,1,1048,-162,-69,1194,301,-156,1170,61,-123,1036,-129,67,926,-15,45,517,24,21,89,66,-69,931,-10,-57,520,14,-63,90,-13,54,9,155,-99,10,75],[0,948,0,17,1140,167,44,1198,327,52,1238,381,145,1178,273,76,1167,27,2,1048,-162,-70,1194,301,-156,1170,61,-123,1036,-129,67,926,-15,45,517,25,21,89,66,-69,931,-10,-57,520,14,-63,90,-12,53,9,155,-99,10,75],[0,948,0,17,1140,167,43,1197,327,51,1237,381,144,1177,274,75,1167,27,2,1048,-161,-71,1194,301,-156,1169,61,-123,1036,-129,67,926,-15,44,518,25,21,89,67,-69,931,-10,-57,520,14,-64,90,-11,53,9,156,-100,10,76],[0,948,0,16,1140,167,42,1197,327,50,1237,382,143,1177,274,75,1166,28,2,1048,-161,-71,1194,301,-156,1170,60,-123,1036,-129,67,926,-14,44,518,26,20,89,68,-69,930,-10,-57,520,15,-64,90,-11,53,10,157,-100,10,77],[0,948,0,16,1140,167,41,1197,328,49,1237,382,142,1177,275,75,1166,28,3,1048,-161,-72,1194,301,-156,1170,60,-122,1036,-129,67,926,-14,44,518,26,20,89,68,-69,930,-10,-57,520,15,-65,90,-10,52,10,157,-101,10,77],[0,948,0,16,1140,167,40,1197,328,48,1237,382,142,1177,275,74,1166,28,3,1048,-161,-73,1193,300,-156,1170,60,-122,1036,-130,67,926,-14,44,518,26,19,89,68,-69,930,-10,-58,520,16,-65,90,-10,52,10,158,-102,10,78],[0,948,0,15,1140,167,40,1197,328,47,1237,382,141,1177,275,74,1166,28,3,1048,-161,-73,1194,300,-156,1170,59,-122,1036,-130,67,926,-14,43,518,26,19,89,69,-69,930,-10,-58,520,16,-66,90,-10,51,10,158,-102,11,78],[0,948,0,15,1140,167,39,1197,327,47,1238,382,141,1178,275,74,1166,28,3,1048,-162,-74,1194,300,-157,1170,59,-122,1035,-130,67,926,-14,43,518,26,18,89,69,-69,930,-11,-58,520,16,-66,90,-10,51,10,158,-103,11,78],[0,948,0,15,1140,167,39,1198,327,46,1238,381,140,1179,275,73,1166,28,3,1048,-162,-74,1194,299,-157,1171,58,-122,1035,-130,67,926,-14,43,518,26,17,89,69,-69,930,-11,-58,520,16,-67,90,-10,50,10,158,-104,11,78],[0,948,0,15,1140,166,38,1198,327,46,1239,381,140,1179,275,73,1166,28,3,1048,-162,-75,1194,299,-158,1171,58,-122,1035,-130,67,926,-14,43,517,26,17,89,69,-69,930,-11,-59,520,16,-67,90,-10,50,10,158,-104,11,78],[0,948,0,15,1140,166,38,1199,327,45,1239,381,140,1180,275,73,1166,28,3,1047,-162,-75,1194,299,-158,1171,58,-122,1035,-130,67,926,-14,42,518,26,17,89,69,-69,930,-10,-59,520,16,-68,90,-10,50,10,158,-105,11,78],[0,948,0,15,1141,166,38,1199,326,45,1240,380,140,1180,275,72,1166,28,3,1047,-162,-75,1195,299,-158,1171,58,-122,1035,-130,67,926,-14,42,518,26,16,89,69,-69,930,-10,-59,520,16,-68,90,-10,50,10,158,-105,11,78],[0,948,0,15,1141,166,37,1200,326,45,1241,380,139,1181,275,72,1166,28,3,1047,-162,-75,1195,298,-158,1171,57,-122,1035,-130,67,926,-14,42,518,26,16,89,69,-69,930,-10,-59,520,16,-68,90,-10,49,10,158,-105,11,78],[0,948,0,15,1141,166,37,1200,326,44,1241,380,139,1181,274,72,1167,28,3,1047,-162,-76,1195,298,-158,1171,57,-122,1035,-130,67,926,-14,42,518,26,17,89,68,-69,930,-10,-59,520,16,-68,90,-10,49,10,158,-105,11,78],[0,948,0,14,1141,165,37,1201,326,44,1242,379,139,1182,274,72,1167,28,3,1047,-162,-76,1196,298,-158,1172,56,-122,1035,-131,67,926,-14,42,518,26,17,89,68,-69,930,-11,-59,520,16,-68,90,-10,50,10,158,-105,11,78],[0,948,0,14,1142,165,37,1202,325,44,1243,379,139,1182,274,72,1167,27,4,1047,-162,-76,1197,297,-158,1172,56,-122,1035,-131,67,926,-14,43,518,26,17,89,68,-69,931,-11,-59,520,16,-67,90,-10,50,10,158,-105,11,78],[0,948,0,14,1142,165,36,1202,325,43,1244,378,139,1183,273,72,1167,27,4,1046,-163,-76,1197,296,-158,1172,55,-122,1035,-131,67,926,-14,43,518,27,17,89,69,-69,931,-11,-59,520,15,-67,90,-10,50,10,158,-104,11,78],[0,948,0,14,1143,164,36,1204,324,43,1245,377,138,1184,273,72,1168,26,4,1046,-163,-77,1198,296,-158,1172,54,-121,1034,-132,67,926,-13,43,518,27,18,89,69,-69,931,-11,-59,521,15,-67,90,-10,50,10,158,-104,11,78],[0,949,0,14,1144,163,36,1205,323,43,1247,376,138,1185,272,72,1168,25,4,1046,-163,-77,1200,295,-158,1173,54,-121,1034,-132,67,927,-13,43,518,27,19,90,69,-69,931,-11,-58,521,15,-66,90,-9,51,10,158,-103,11,79],[0,949,0,14,1145,162,36,1207,322,43,1249,375,138,1187,271,72,1168,24,4,1045,-164,-77,1201,294,-158,1173,53,-121,1034,-132,67,927,-13,44,518,27,20,90,70,-69,931,-11,-58,521,16,-65,91,-9,52,10,159,-102,12,79],[0,949,0,14,1146,161,36,1209,320,43,1251,373,138,1189,269,72,1169,23,4,1045,-164,-77,1203,292,-158,1174,51,-121,1033,-133,67,927,-13,44,518,27,21,90,70,-69,932,-10,-58,521,16,-64,91,-8,53,10,159,-101,12,79],[0,950,0,14,1148,159,36,1212,318,43,1255,370,138,1191,267,72,1170,21,4,1044,-165,-77,1206,290,-158,1174,50,-121,1033,-134,67,927,-13,45,519,28,22,90,70,-69,932,-10,-57,522,15,-63,91,-8,54,10,159,-100,12,80],[0,950,0,14,1150,157,36,1216,315,43,1259,367,138,1195,264,72,1171,18,5,1042,-166,-76,1210,287,-158,1175,47,-121,1032,-135,67,928,-13,46,519,28,23,90,70,-69,932,-10,-57,522,15,-61,91,-8,55,11,159,-98,12,80],[0,950,0,14,1153,155,36,1221,311,43,1265,362,139,1199,261,73,1172,15,5,1041,-167,-76,1215,284,-158,1176,44,-121,1030,-136,67,928,-12,47,519,28,25,90,70,-69,932,-10,-56,522,15,-60,91,-8,57,10,159,-97,13,80],[0,950,0,14,1156,151,37,1228,306,44,1273,356,139,1205,256,73,1173,11,5,1038,-168,-76,1220,279,-158,1177,40,-121,1028,-137,67,928,-12,47,519,28,27,90,69,-69,932,-10,-55,522,14,-58,92,-9,58,10,158,-95,13,79],[0,951,0,14,1159,147,36,1236,300,43,1282,349,139,1211,250,74,1173,6,7,1032,-169,-76,1227,272,-158,1178,35,-120,1023,-138,67,927,-11,48,518,28,29,90,68,-69,932,-10,-55,522,13,-56,91,-10,60,10,157,-93,13,78],[0,951,0,14,1163,142,36,1245,292,43,1293,339,138,1219,243,76,1172,-1,11,1024,-170,-77,1235,265,-157,1177,29,-121,1015,-138,67,927,-11,49,518,27,31,89,67,-69,932,-9,-54,522,12,-54,91,-11,62,9,156,-91,13,77],[0,951,0,14,1167,136,36,1255,282,43,1305,328,138,1227,235,81,1171,-8,20,1015,-172,-77,1244,255,-158,1175,23,-127,1006,-137,67,927,-10,50,518,27,33,89,65,-69,932,-9,-54,522,10,-52,91,-13,64,8,154,-89,13,75],[0,950,0,13,1172,129,35,1267,271,42,1320,313,137,1237,224,87,1169,-17,37,1005,-177,-77,1254,243,-163,1174,16,-141,997,-137,67,927,-9,51,517,26,35,88,62,-69,932,-9,-53,521,7,-50,91,-16,66,7,151,-87,12,72],[0,950,0,13,1177,120,34,1281,255,41,1336,295,137,1249,211,98,1168,-29,63,997,-185,-78,1266,228,-173,1175,9,-165,990,-135,67,926,-8,52,516,24,37,87,58,-69,932,-9,-53,521,4,-47,90,-20,68,6,147,-85,12,68],[0,950,0,12,1183,110,33,1298,236,39,1355,272,136,1262,195,111,1167,-42,96,991,-196,-79,1280,210,-188,1178,2,-201,984,-130,67,926,-6,53,516,22,39,86,53,-69,931,-9,-52,520,0,-45,90,-26,70,5,141,-83,12,62],[0,950,0,12,1189,98,32,1315,214,37,1375,245,134,1276,175,128,1164,-55,137,982,-203,-80,1294,188,-207,1183,-5,-243,980,-117,67,925,-5,54,515,20,41,85,46,-69,931,-9,-52,520,-4,-44,90,-33,71,4,134,-81,12,55],[0,950,0,11,1194,85,30,1331,188,34,1394,215,133,1289,154,147,1151,-62,181,963,-198,-82,1307,163,-228,1190,-12,-290,981,-97,67,925,-3,55,515,17,43,84,38,-69,931,-9,-51,520,-7,-42,90,-41,73,4,127,-79,12,48],[0,951,0,10,1199,71,28,1346,160,32,1410,182,131,1300,131,167,1137,-63,223,945,-186,-83,1319,136,-248,1200,-20,-334,988,-71,67,925,-1,56,514,14,44,84,30,-69,931,-9,-51,520,-11,-40,90,-49,75,3,119,-77,12,40],[0,950,0,9,1203,58,26,1358,131,29,1424,149,130,1309,109,184,1127,-63,257,930,-167,-85,1328,107,-263,1211,-35,-369,1002,-42,67,925,1,57,514,11,46,83,22,-68,930,-9,-50,520,-15,-38,90,-57,77,3,111,-74,12,32],[0,951,0,9,1206,45,25,1367,104,27,1434,117,128,1316,88,196,1121,-64,283,919,-144,-86,1334,80,-270,1220,-56,-391,1025,-8,67,925,4,58,514,9,49,83,14,-68,930,-10,-49,519,-19,-36,91,-64,79,3,104,-72,12,24],[0,951,0,8,1208,33,24,1374,78,26,1441,88,128,1321,68,206,1116,-63,307,911,-118,-86,1339,54,-272,1221,-76,-408,1060,27,67,925,6,60,514,7,52,83,8,-68,930,-10,-48,519,-23,-33,91,-71,82,3,97,-68,12,17],[0,951,0,9,1210,21,24,1378,54,25,1446,60,128,1324,50,215,1111,-61,326,907,-92,-86,1341,30,-271,1212,-90,-418,1105,57,67,925,8,61,514,5,55,83,2,-68,930,-11,-47,519,-26,-29,91,-76,85,3,92,-65,12,12],[0,951,0,9,1210,11,25,1381,31,26,1449,34,128,1326,33,220,1105,-59,340,904,-67,-84,1343,7,-268,1197,-96,-422,1157,76,67,926,11,63,514,6,59,83,-3,-68,930,-12,-46,519,-28,-26,92,-81,88,4,87,-61,12,7],[0,951,0,10,1211,1,27,1382,9,27,1450,9,129,1326,17,224,1100,-56,349,902,-42,-82,1344,-14,-264,1182,-93,-420,1207,81,66,926,13,64,515,14,62,84,-7,-67,929,-13,-44,519,-31,-23,92,-86,91,4,83,-58,12,2],[0,951,0,11,1210,-9,29,1382,-11,29,1450,-14,131,1326,2,225,1094,-52,352,900,-18,-80,1345,-34,-259,1168,-85,-412,1250,73,66,926,15,65,515,19,65,85,-12,-67,929,-14,-43,519,-34,-19,92,-90,94,6,79,-54,12,-2],[0,951,0,12,1210,-17,31,1381,-28,31,1449,-33,133,1325,-10,225,1089,-48,353,899,3,-78,1344,-52,-251,1157,-74,-401,1281,57,66,927,17,65,516,23,69,86,-15,-67,929,-15,-41,519,-36,-16,92,-93,97,7,76,-51,12,-5],[0,950,0,13,1209,-25,34,1379,-43,33,1447,-50,134,1324,-21,224,1085,-44,351,899,21,-75,1343,-67,-241,1148,-64,-388,1301,36,65,927,19,66,516,27,72,87,-17,-67,928,-15,-40,518,-37,-12,92,-96,100,8,74,-47,12,-8],[0,950,0,15,1208,-32,36,1377,-56,35,1445,-64,136,1323,-30,223,1082,-42,349,900,36,-72,1341,-81,-229,1140,-55,-373,1312,15,65,927,21,67,516,30,76,87,-19,-66,928,-16,-38,518,-38,-9,92,-97,103,8,73,-43,12,-9],[0,950,0,17,1207,-38,39,1375,-67,38,1442,-77,138,1322,-38,222,1080,-39,346,901,47,-69,1338,-94,-216,1134,-48,-357,1316,-4,64,927,22,68,516,32,80,88,-20,-66,928,-17,-37,518,-39,-5,92,-98,106,9,72,-40,13,-10],[0,950,0,19,1205,-43,41,1373,-78,40,1440,-88,140,1321,-45,220,1078,-38,342,901,56,-66,1336,-105,-203,1129,-40,-344,1316,-22,64,926,24,69,515,33,83,88,-20,-66,927,-18,-35,518,-40,-2,92,-99,109,9,72,-37,13,-10],[0,950,0,20,1204,-47,43,1370,-86,42,1438,-97,142,1320,-51,219,1076,-37,338,900,63,-64,1333,-115,-191,1127,-33,-333,1313,-39,63,926,25,70,515,34,86,88,-20,-66,927,-18,-34,518,-40,1,92,-99,111,9,72,-34,13,-10],[0,949,0,22,1203,-51,44,1369,-94,44,1436,-104,143,1319,-57,217,1075,-37,333,899,68,-62,1331,-122,-181,1125,-27,-327,1307,-55,63,926,26,70,515,35,88,88,-20,-66,927,-19,-33,518,-41,4,92,-98,113,9,72,-31,13,-10],[0,949,0,23,1202,-54,45,1367,-99,45,1434,-109,144,1318,-61,215,1074,-37,327,898,70,-61,1329,-128,-174,1124,-25,-323,1300,-67,63,926,27,71,515,36,90,88,-19,-66,927,-19,-33,518,-40,5,92,-97,114,9,74,-29,13,-9],[0,949,0,23,1202,-56,46,1366,-103,45,1433,-113,144,1318,-63,213,1073,-37,322,896,72,-60,1327,-133,-169,1122,-25,-321,1294,-74,62,926,27,71,515,37,91,88,-17,-65,927,-20,-32,517,-40,6,92,-96,115,9,75,-28,13,-7],[0,949,0,23,1201,-57,45,1365,-105,44,1432,-115,144,1318,-65,211,1073,-38,317,894,72,-60,1326,-135,-166,1119,-27,-321,1289,-76,62,926,28,71,515,38,91,88,-16,-65,927,-20,-32,517,-39,7,91,-94,115,9,77,-27,13,-5],[0,949,0,23,1201,-58,44,1365,-106,43,1432,-116,143,1319,-66,209,1073,-38,312,893,71,-61,1325,-136,-164,1117,-28,-322,1284,-75,62,926,28,71,515,40,91,88,-14,-65,927,-20,-32,517,-38,7,91,-93,115,9,78,-27,13,-3],[0,949,0,23,1201,-58,43,1365,-106,42,1433,-115,142,1320,-65,206,1073,-39,308,892,69,-62,1325,-136,-163,1116,-29,-324,1281,-72,62,926,28,71,515,41,90,88,-12,-65,926,-20,-32,517,-37,6,91,-91,114,9,80,-28,13,-1],[0,949,0,22,1201,-57,42,1366,-105,40,1433,-114,141,1321,-65,205,1074,-41,305,891,67,-63,1325,-135,-163,1114,-29,-325,1278,-69,62,926,28,70,516,41,89,88,-10,-65,926,-20,-33,517,-36,4,90,-89,113,9,82,-29,13,1],[0,949,0,21,1202,-57,40,1366,-103,38,1434,-112,140,1321,-63,203,1074,-42,303,890,64,-65,1326,-133,-162,1114,-28,-327,1277,-66,62,927,27,70,516,42,87,88,-8,-65,926,-20,-34,517,-35,3,90,-87,111,9,84,-30,12,3],[0,949,0,20,1202,-56,38,1367,-101,36,1435,-109,138,1322,-62,201,1075,-43,301,889,60,-66,1326,-131,-162,1113,-26,-328,1275,-62,63,927,27,69,516,42,86,88,-6,-65,926,-19,-34,517,-34,2,90,-85,110,9,86,-32,12,5],[0,949,0,19,1202,-55,37,1368,-99,35,1435,-107,137,1323,-60,200,1076,-44,299,888,57,-68,1327,-129,-161,1113,-24,-329,1274,-60,63,927,27,69,516,41,84,88,-5,-65,926,-19,-35,516,-33,0,89,-84,108,9,88,-33,12,7],[0,949,0,18,1203,-54,35,1369,-96,33,1436,-104,135,1324,-58,199,1076,-45,298,888,53,-70,1328,-126,-161,1113,-22,-329,1273,-57,63,927,26,68,516,41,82,87,-4,-65,926,-19,-35,516,-33,-2,89,-82,107,9,89,-35,11,8],[0,949,0,17,1203,-53,33,1370,-94,31,1437,-101,134,1325,-57,197,1077,-46,297,887,49,-71,1329,-124,-161,1112,-21,-329,1272,-55,63,927,26,67,516,41,81,87,-3,-65,926,-19,-36,516,-32,-3,89,-82,105,9,90,-37,11,9],[0,949,0,16,1203,-52,32,1370,-91,30,1438,-99,133,1325,-55,196,1077,-48,297,887,45,-73,1330,-121,-161,1112,-20,-329,1272,-52,63,927,26,67,516,41,79,87,-2,-65,926,-19,-37,516,-32,-5,89,-81,103,9,90,-39,11,9],[0,949,0,15,1204,-51,31,1371,-89,28,1439,-96,132,1326,-53,195,1078,-49,296,886,42,-74,1330,-119,-161,1112,-19,-330,1272,-50,63,927,26,66,516,41,78,87,-1,-65,926,-19,-38,516,-31,-7,89,-80,102,9,91,-40,11,10],[0,950,0,15,1204,-49,29,1372,-87,27,1439,-93,131,1327,-51,194,1079,-50,295,886,39,-75,1331,-117,-162,1111,-18,-330,1272,-49,63,928,26,66,517,41,76,87,0,-65,926,-19,-38,516,-31,-8,88,-79,100,9,92,-42,10,11],[0,950,0,14,1205,-48,28,1372,-84,26,1440,-90,130,1327,-49,193,1079,-50,294,886,36,-76,1332,-114,-163,1111,-17,-330,1273,-47,64,928,25,65,517,41,75,87,0,-65,926,-18,-39,516,-30,-10,88,-78,99,9,93,-44,10,11],[0,950,0,13,1205,-47,27,1373,-82,25,1441,-88,129,1328,-47,193,1080,-51,294,886,33,-77,1332,-112,-163,1111,-17,-330,1273,-45,64,928,25,64,517,41,73,88,1,-65,926,-18,-40,516,-30,-11,88,-78,97,9,93,-45,10,12],[0,950,0,13,1205,-46,26,1374,-79,24,1441,-85,128,1328,-45,192,1080,-52,294,886,30,-78,1333,-110,-164,1111,-16,-330,1274,-44,64,928,25,64,517,41,72,88,2,-65,926,-18,-40,516,-30,-12,88,-77,96,9,94,-46,10,13],[0,950,0,12,1205,-45,25,1374,-77,23,1442,-83,127,1329,-43,192,1081,-52,294,886,28,-79,1333,-108,-164,1110,-16,-329,1275,-41,64,928,25,63,517,42,71,88,3,-65,926,-18,-41,516,-29,-13,88,-76,95,9,95,-47,10,14],[0,950,0,12,1206,-45,24,1375,-75,22,1443,-80,126,1329,-42,192,1082,-52,295,886,26,-80,1334,-106,-165,1110,-16,-329,1276,-39,64,928,25,63,517,42,70,88,3,-65,926,-18,-41,515,-29,-14,88,-76,94,9,95,-49,10,14],[0,950,0,11,1206,-44,23,1375,-73,21,1443,-77,125,1330,-40,191,1083,-52,295,887,24,-81,1334,-104,-165,1110,-15,-329,1276,-36,64,928,25,62,517,42,69,88,4,-65,926,-18,-42,515,-28,-15,87,-75,93,9,96,-50,10,15],[0,950,0,10,1206,-43,22,1376,-70,20,1444,-74,124,1330,-38,191,1083,-52,296,888,23,-82,1335,-101,-166,1109,-15,-329,1277,-33,64,928,25,62,517,42,68,88,5,-65,926,-18,-42,515,-28,-16,87,-74,92,9,97,-51,10,16],[0,950,0,10,1206,-41,21,1376,-67,19,1444,-71,124,1331,-35,191,1084,-52,297,888,22,-83,1335,-99,-167,1109,-15,-328,1278,-30,64,928,24,62,517,42,67,88,6,-65,926,-18,-42,515,-27,-17,87,-73,91,9,98,-51,10,17],[0,950,0,9,1207,-40,20,1377,-65,18,1445,-68,123,1331,-33,191,1085,-51,297,889,22,-84,1336,-96,-167,1108,-14,-328,1278,-27,64,928,24,62,517,42,66,88,7,-65,926,-18,-43,515,-27,-18,87,-72,91,8,99,-52,10,18],[0,950,0,9,1207,-39,19,1377,-62,17,1445,-65,122,1332,-31,191,1086,-50,298,890,21,-85,1336,-93,-168,1107,-14,-328,1279,-23,64,928,24,61,517,41,66,87,8,-65,926,-18,-43,515,-26,-18,87,-71,90,8,100,-53,10,19],[0,950,0,8,1207,-37,18,1378,-59,15,1446,-61,121,1333,-29,190,1087,-50,299,891,20,-86,1337,-90,-169,1106,-14,-327,1279,-19,64,928,24,61,517,40,65,87,9,-65,926,-18,-43,515,-26,-19,87,-70,90,8,101,-53,10,20],[0,950,0,8,1208,-36,16,1379,-55,14,1446,-58,119,1333,-26,190,1088,-49,300,893,20,-88,1337,-87,-170,1105,-14,-327,1279,-15,64,928,23,61,517,40,65,87,10,-65,926,-18,-43,515,-25,-19,87,-69,89,8,102,-54,10,21],[0,950,0,7,1208,-34,14,1379,-52,12,1447,-54,118,1334,-24,190,1090,-48,300,894,19,-90,1337,-84,-170,1104,-15,-327,1279,-10,65,928,23,61,517,39,65,87,11,-66,926,-17,-44,516,-25,-20,87,-68,89,8,102,-54,10,22],[0,950,0,6,1208,-32,12,1379,-49,10,1447,-51,117,1335,-22,189,1091,-48,301,896,19,-91,1337,-80,-171,1103,-15,-327,1278,-5,65,928,22,62,517,38,64,87,12,-66,926,-17,-44,516,-24,-20,87,-67,89,7,103,-55,10,23],[0,950,0,6,1208,-31,10,1380,-46,8,1448,-47,115,1336,-19,188,1092,-47,302,897,18,-93,1337,-77,-172,1101,-15,-326,1277,0,65,928,22,62,517,38,64,87,12,-66,926,-17,-44,516,-24,-20,87,-67,89,7,104,-55,10,24],[0,950,0,5,1209,-29,8,1380,-42,6,1448,-43,113,1337,-17,188,1094,-47,303,899,17,-96,1337,-73,-172,1099,-16,-327,1274,6,65,928,21,62,517,37,64,86,13,-66,926,-16,-44,516,-23,-20,87,-66,89,7,104,-55,10,24],[0,950,0,4,1209,-27,6,1381,-39,4,1449,-40,112,1338,-15,187,1095,-46,304,902,17,-98,1337,-68,-173,1097,-18,-327,1271,12,65,928,20,62,517,36,64,86,13,-66,926,-16,-44,516,-23,-20,87,-65,89,7,105,-55,10,25],[0,950,0,3,1209,-24,4,1381,-35,2,1449,-36,110,1339,-13,186,1096,-45,305,904,16,-100,1337,-63,-173,1095,-21,-328,1267,18,65,928,19,63,517,35,64,86,14,-66,926,-16,-44,516,-22,-20,87,-65,89,7,106,-55,10,25],[0,950,0,2,1209,-22,1,1381,-31,0,1449,-31,108,1340,-10,185,1098,-45,305,906,15,-102,1336,-58,-174,1093,-25,-329,1261,25,66,927,18,63,517,35,64,86,15,-66,926,-15,-43,516,-22,-20,87,-64,89,6,106,-54,10,26],[0,950,0,1,1209,-19,-1,1382,-26,-2,1450,-27,107,1341,-8,183,1099,-44,306,908,15,-105,1336,-53,-174,1091,-30,-331,1253,31,66,927,17,63,516,34,64,86,15,-66,927,-14,-43,516,-21,-20,88,-64,89,6,107,-54,10,26],[0,950,0,0,1210,-16,-3,1382,-22,-4,1450,-23,105,1342,-6,182,1101,-43,306,910,13,-107,1335,-47,-173,1088,-35,-333,1244,37,66,927,16,63,516,33,64,85,16,-67,927,-14,-43,516,-21,-20,88,-63,89,6,107,-54,10,26],[0,950,0,0,1210,-13,-6,1382,-17,-7,1450,-19,103,1343,-3,180,1102,-43,306,912,12,-109,1335,-42,-171,1086,-40,-336,1232,43,66,927,15,64,516,32,64,85,16,-67,927,-13,-43,516,-20,-20,88,-62,89,6,108,-55,10,27],[0,950,0,-1,1210,-10,-8,1382,-13,-9,1450,-15,101,1344,-1,179,1103,-42,306,914,10,-112,1334,-36,-169,1084,-45,-339,1217,48,67,927,14,64,516,31,64,85,17,-67,927,-12,-43,516,-19,-20,88,-62,89,6,109,-55,10,27],[0,950,0,-2,1210,-7,-10,1382,-9,-11,1450,-11,100,1345,1,177,1105,-42,306,915,9,-114,1333,-31,-167,1083,-51,-343,1200,51,67,927,12,64,516,30,64,85,18,-67,927,-12,-43,517,-19,-20,88,-61,89,6,109,-55,10,28],[0,950,0,-2,1210,-5,-12,1382,-6,-13,1450,-8,98,1346,3,176,1106,-42,306,917,6,-115,1332,-27,-165,1082,-55,-348,1181,54,67,927,11,64,516,29,64,85,18,-67,927,-11,-43,517,-18,-21,88,-61,89,6,109,-55,10,28],[0,950,0,-2,1210,-3,-13,1382,-4,-14,1450,-6,97,1346,3,175,1107,-42,306,918,4,-116,1331,-23,-164,1082,-60,-354,1160,54,67,927,10,64,516,28,63,85,17,-67,927,-10,-43,517,-18,-21,88,-61,89,5,109,-56,10,28],[0,950,0,-3,1210,-2,-14,1382,-2,-15,1450,-5,97,1347,3,175,1107,-43,307,919,1,-117,1330,-20,-164,1082,-63,-359,1137,53,67,926,9,64,516,27,63,85,17,-68,927,-10,-43,517,-18,-21,89,-62,89,5,108,-56,10,27],[0,950,0,-3,1210,0,-14,1382,-1,-15,1450,-4,96,1347,3,174,1108,-44,308,920,-1,-118,1330,-18,-163,1083,-67,-364,1113,51,67,926,8,65,516,26,63,84,16,-68,928,-9,-43,517,-18,-21,89,-62,89,5,108,-56,10,27],[0,950,0,-3,1210,1,-15,1382,-1,-16,1450,-4,96,1347,2,174,1108,-45,309,921,-4,-118,1330,-16,-163,1083,-69,-367,1089,47,67,926,7,65,516,25,63,84,16,-68,928,-8,-43,517,-18,-21,89,-63,89,5,107,-56,10,26],[0,950,0,-3,1210,2,-15,1382,0,-16,1450,-5,96,1347,1,175,1108,-46,311,921,-6,-118,1329,-14,-164,1084,-71,-368,1066,44,68,926,6,65,516,23,63,84,15,-68,928,-8,-43,517,-18,-21,89,-63,89,5,107,-56,10,25],[0,950,0,-3,1210,2,-15,1382,-1,-16,1450,-5,96,1347,-1,175,1108,-47,312,922,-8,-118,1329,-13,-165,1084,-72,-367,1043,40,68,926,6,65,516,22,63,84,14,-68,928,-7,-42,517,-18,-21,89,-64,89,5,106,-56,10,25],[0,950,0,-3,1210,2,-15,1382,-1,-15,1450,-6,96,1347,-2,175,1108,-48,313,922,-10,-119,1329,-12,-165,1085,-72,-363,1021,36,68,926,5,65,516,21,63,84,14,-68,928,-6,-42,517,-18,-21,89,-65,89,5,105,-56,10,24],[0,950,0,-3,1210,2,-15,1382,-3,-15,1450,-8,96,1347,-4,175,1108,-50,314,923,-12,-119,1329,-12,-166,1085,-71,-359,1002,33,68,926,4,65,516,20,63,84,13,-68,928,-6,-42,517,-18,-21,89,-66,89,5,104,-56,11,23],[0,950,0,-3,1210,2,-15,1382,-4,-15,1450,-9,96,1347,-6,175,1108,-51,315,923,-13,-119,1329,-12,-167,1085,-70,-353,984,31,68,926,4,66,516,18,64,84,12,-68,928,-6,-42,517,-19,-21,89,-67,90,5,103,-56,11,22],[0,950,0,-3,1210,1,-15,1382,-5,-15,1450,-11,96,1347,-9,175,1107,-52,314,923,-14,-119,1329,-12,-168,1084,-69,-347,968,29,68,927,4,66,516,17,64,84,11,-68,928,-5,-42,517,-19,-21,90,-68,90,5,103,-56,11,21],[0,950,0,-4,1210,0,-14,1382,-7,-15,1449,-13,96,1347,-11,175,1107,-53,314,922,-15,-119,1329,-13,-169,1084,-67,-340,954,27,68,927,3,66,516,16,64,84,10,-68,928,-5,-42,517,-19,-21,90,-68,90,5,102,-56,11,20],[0,950,0,-4,1210,0,-14,1382,-9,-15,1449,-15,96,1346,-14,174,1106,-53,313,920,-15,-119,1330,-14,-170,1084,-65,-334,944,27,68,927,3,66,516,15,64,84,10,-68,927,-4,-41,517,-19,-21,90,-69,90,5,101,-56,11,20],[0,950,0,-4,1210,-1,-14,1382,-11,-15,1449,-18,96,1346,-16,174,1105,-54,311,919,-15,-119,1330,-15,-171,1084,-64,-329,936,28,68,927,3,66,516,15,64,84,9,-68,927,-4,-41,517,-19,-21,90,-70,90,5,100,-56,11,19],[0,950,0,-4,1210,-2,-14,1382,-14,-15,1449,-20,97,1345,-19,173,1104,-55,309,917,-15,-119,1330,-16,-172,1084,-62,-324,929,29,68,927,2,66,516,14,64,84,8,-68,927,-4,-41,517,-19,-21,90,-70,90,5,100,-56,11,18],[0,950,0,-4,1210,-3,-13,1382,-16,-14,1449,-22,97,1345,-22,173,1103,-55,307,914,-14,-119,1330,-17,-173,1084,-60,-318,923,30,68,927,2,66,516,13,63,85,7,-68,927,-3,-41,517,-20,-21,89,-71,89,6,99,-56,11,17],[0,950,0,-4,1210,-4,-13,1381,-18,-14,1449,-25,97,1344,-24,172,1101,-55,303,912,-14,-118,1331,-18,-174,1084,-58,-313,917,30,68,927,2,66,516,12,63,85,7,-68,927,-3,-41,517,-20,-21,89,-72,89,6,99,-56,11,17],[0,950,0,-5,1210,-5,-12,1381,-20,-13,1449,-27,97,1344,-26,171,1100,-55,300,909,-13,-118,1331,-19,-174,1084,-56,-307,911,31,68,927,2,66,516,12,63,85,7,-68,927,-3,-41,517,-20,-21,89,-72,89,6,98,-56,11,16],[0,950,0,-5,1210,-6,-12,1381,-22,-13,1449,-29,98,1343,-28,169,1099,-55,296,906,-12,-118,1331,-20,-173,1084,-55,-301,906,30,68,927,2,66,516,12,63,85,6,-68,927,-2,-41,517,-20,-22,89,-72,89,6,98,-57,10,16],[0,950,0,-5,1210,-7,-12,1381,-23,-13,1449,-30,98,1343,-30,168,1098,-55,292,903,-12,-118,1332,-22,-172,1084,-55,-294,902,30,68,927,2,66,516,11,63,85,6,-68,927,-2,-41,517,-20,-22,89,-73,89,6,98,-57,10,16],[0,950,0,-5,1210,-7,-11,1381,-25,-12,1449,-32,98,1342,-31,166,1097,-55,287,901,-11,-117,1332,-23,-171,1084,-54,-288,898,29,68,927,2,66,516,11,63,85,6,-68,927,-2,-41,517,-20,-22,89,-73,89,6,97,-57,10,16],[0,950,0,-5,1210,-8,-11,1381,-26,-12,1448,-33,98,1342,-32,164,1096,-55,283,898,-11,-117,1332,-24,-170,1083,-54,-282,894,28,68,927,2,66,516,11,62,85,5,-68,927,-2,-41,517,-20,-22,89,-73,88,6,97,-57,10,15],[0,950,0,-5,1210,-9,-11,1381,-27,-12,1448,-34,98,1342,-33,163,1095,-55,279,896,-11,-117,1332,-24,-169,1083,-54,-277,891,27,68,927,1,66,516,11,62,85,5,-68,927,-2,-41,517,-20,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-9,-11,1381,-28,-12,1448,-35,98,1342,-34,162,1094,-55,275,894,-11,-117,1332,-25,-168,1083,-54,-272,888,26,68,927,1,66,516,11,62,85,5,-68,927,-2,-41,517,-20,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-9,-11,1381,-28,-12,1448,-36,98,1341,-35,160,1094,-55,272,892,-11,-117,1332,-25,-167,1083,-54,-267,886,25,68,927,1,66,516,11,62,85,5,-68,927,-1,-41,517,-20,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-9,-11,1381,-29,-12,1448,-36,98,1341,-36,159,1094,-54,269,891,-11,-117,1332,-25,-166,1082,-53,-262,883,24,68,927,1,66,516,11,62,85,5,-68,927,-1,-41,517,-20,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-10,-11,1381,-29,-12,1448,-37,98,1341,-36,158,1093,-54,266,889,-11,-117,1332,-25,-165,1082,-53,-258,881,24,68,927,1,66,516,11,62,85,6,-68,927,-1,-41,517,-20,-22,89,-73,88,6,97,-57,11,16],[0,950,0,-5,1210,-10,-11,1381,-29,-12,1448,-37,98,1341,-37,158,1093,-54,263,888,-11,-117,1332,-25,-165,1082,-53,-255,879,24,68,927,1,66,516,11,62,85,6,-68,927,-1,-41,517,-19,-22,89,-73,88,6,98,-57,11,16],[0,950,0,-5,1210,-10,-11,1381,-30,-12,1448,-37,98,1341,-37,157,1093,-54,261,887,-11,-117,1332,-25,-164,1082,-52,-251,878,25,68,927,1,66,516,11,62,85,6,-68,927,-1,-41,517,-19,-22,89,-73,88,6,98,-57,11,16],[0,950,0,-5,1210,-10,-11,1381,-30,-13,1448,-38,98,1341,-38,156,1093,-54,259,886,-11,-117,1332,-25,-164,1082,-52,-248,877,25,68,927,1,66,516,11,62,85,6,-68,927,-1,-41,517,-19,-22,89,-73,88,6,98,-57,11,16],[0,950,0,-5,1210,-10,-11,1381,-30,-13,1448,-38,98,1341,-38,156,1093,-54,258,886,-11,-117,1332,-25,-163,1082,-51,-246,876,25,68,927,0,66,516,11,62,85,6,-68,927,-1,-41,517,-19,-22,89,-73,88,6,98,-57,11,16],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-38,155,1092,-54,257,885,-11,-117,1332,-25,-163,1081,-50,-244,875,26,68,927,0,66,516,11,62,85,6,-68,927,0,-41,517,-19,-22,89,-73,88,6,98,-58,11,16],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,155,1092,-55,256,885,-11,-117,1332,-25,-163,1081,-50,-242,874,26,68,927,0,66,516,11,62,85,6,-68,927,0,-41,517,-19,-22,89,-73,88,6,97,-57,11,16],[0,950,0,-5,1210,-11,-11,1381,-31,-13,1448,-38,98,1341,-39,155,1092,-55,256,885,-11,-117,1332,-25,-163,1081,-50,-240,873,26,68,927,0,66,516,11,62,85,6,-68,927,0,-41,517,-19,-22,89,-73,88,6,97,-57,11,16],[0,950,0,-5,1210,-11,-11,1381,-31,-13,1448,-38,98,1341,-39,155,1092,-55,255,884,-12,-117,1332,-25,-162,1081,-50,-238,873,26,68,927,0,66,516,11,62,85,6,-68,927,0,-41,517,-19,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-31,-13,1448,-39,98,1341,-39,154,1092,-55,254,884,-12,-117,1332,-25,-162,1081,-49,-236,872,26,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-19,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1209,-11,-11,1381,-31,-13,1448,-39,98,1341,-39,154,1092,-55,253,884,-12,-117,1332,-25,-161,1081,-49,-235,872,26,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-19,-22,89,-73,88,6,97,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-31,-13,1448,-38,98,1341,-39,153,1092,-55,252,883,-12,-117,1332,-25,-161,1081,-49,-233,871,25,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-19,-22,89,-74,88,6,97,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-31,-13,1448,-38,98,1341,-39,153,1092,-55,251,883,-12,-117,1332,-25,-161,1081,-49,-232,871,25,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-19,-22,89,-74,88,6,97,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,153,1092,-55,251,883,-12,-117,1332,-25,-161,1081,-49,-231,870,26,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-19,-22,89,-74,88,6,97,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,153,1091,-55,250,882,-11,-117,1332,-25,-160,1081,-49,-230,870,26,68,927,0,66,516,11,62,85,5,-68,927,0,-41,517,-20,-22,89,-74,89,6,96,-57,11,15],[0,950,0,-5,1210,-11,-11,1381,-30,-13,1448,-38,98,1341,-39,153,1091,-54,250,882,-11,-117,1333,-24,-160,1081,-49,-229,870,26,68,927,0,66,516,11,63,85,4,-68,927,0,-41,517,-20,-22,89,-74,89,6,96,-57,11,14]]},"taunt":{"fps":30,"frames":[[0,950,0,17,1212,-14,14,1386,-22,11,1455,-21,125,1352,-21,157,1095,-33,211,878,50,-95,1349,-24,-140,1093,-38,-210,880,41,68,924,0,76,507,-11,98,84,-120,-70,930,0,-45,513,-1,-32,82,-71,85,3,-25,-17,2,24],[0,950,0,17,1212,-14,13,1386,-23,10,1455,-22,124,1352,-22,156,1095,-34,212,880,49,-96,1348,-25,-140,1093,-39,-211,880,39,68,923,0,76,507,-11,97,84,-122,-70,930,0,-46,513,-1,-33,82,-73,85,3,-27,-17,2,23],[0,950,0,16,1212,-15,12,1386,-25,8,1455,-24,123,1352,-24,154,1094,-39,215,883,50,-97,1347,-26,-141,1092,-42,-214,880,38,68,923,0,75,506,-9,97,84,-123,-70,930,0,-45,513,0,-33,83,-75,85,3,-29,-17,3,21],[0,949,0,16,1211,-16,10,1385,-26,6,1454,-26,122,1351,-27,151,1094,-47,223,891,55,-99,1346,-27,-143,1091,-44,-217,879,35,68,922,0,75,505,-7,98,85,-125,-70,929,0,-45,513,1,-32,83,-77,85,4,-31,-17,3,19],[0,948,0,15,1210,-18,8,1385,-29,4,1453,-28,120,1349,-30,149,1093,-56,236,907,64,-101,1344,-28,-146,1089,-46,-222,878,32,68,921,0,75,504,-4,99,85,-128,-70,929,0,-44,513,2,-32,84,-79,86,4,-33,-16,4,16],[0,948,0,14,1210,-19,6,1384,-31,1,1453,-30,117,1348,-34,147,1092,-67,256,937,77,-103,1343,-29,-149,1088,-48,-228,877,28,67,920,0,74,503,-1,99,86,-130,-70,929,0,-43,513,4,-31,84,-82,87,5,-35,-16,4,14],[0,948,0,13,1210,-21,3,1384,-33,-1,1452,-32,115,1347,-37,149,1092,-75,282,986,92,-105,1342,-30,-154,1088,-50,-235,877,23,67,920,0,75,503,-1,100,87,-132,-70,929,1,-42,513,4,-30,85,-84,87,5,-38,-15,5,11],[0,947,0,11,1209,-22,1,1384,-33,-2,1452,-34,113,1346,-39,159,1094,-76,310,1055,104,-107,1342,-30,-159,1089,-50,-242,877,18,67,920,0,76,503,-2,101,87,-134,-70,928,2,-41,512,3,-30,85,-87,88,5,-40,-14,5,8],[0,947,0,9,1209,-22,0,1384,-33,-2,1452,-33,112,1347,-40,183,1099,-68,335,1138,110,-108,1343,-29,-164,1090,-50,-250,877,13,68,920,-1,77,503,-4,103,87,-137,-70,928,2,-40,512,4,-29,85,-90,90,5,-43,-13,5,6],[0,947,0,7,1210,-21,-1,1384,-31,-2,1453,-32,111,1349,-39,221,1114,-52,355,1226,109,-109,1344,-27,-169,1092,-49,-258,879,6,68,921,-1,79,504,-7,104,88,-139,-70,927,3,-39,511,4,-28,85,-93,91,6,-45,-12,5,3],[0,947,0,6,1210,-18,-1,1384,-27,-1,1453,-28,110,1351,-36,266,1144,-30,370,1310,104,-110,1345,-23,-174,1095,-46,-266,880,0,68,921,-2,81,505,-11,105,88,-141,-70,926,3,-38,511,4,-28,85,-95,92,5,-48,-12,5,0],[0,947,0,5,1210,-14,0,1385,-20,0,1454,-22,110,1354,-29,310,1189,-8,382,1388,101,-110,1347,-17,-178,1098,-43,-273,883,-5,68,922,-2,82,505,-15,106,88,-142,-70,926,3,-39,510,3,-28,85,-97,92,5,-49,-12,5,-1],[0,948,0,4,1211,-8,1,1386,-11,3,1455,-13,111,1357,-20,343,1246,14,394,1459,104,-108,1349,-9,-181,1102,-38,-280,887,-10,68,923,-2,83,506,-19,106,87,-141,-70,926,2,-40,510,2,-28,84,-97,92,4,-48,-13,4,-1],[0,948,0,5,1212,-1,4,1387,0,6,1455,-3,113,1360,-9,363,1305,35,406,1525,115,-106,1351,0,-184,1105,-32,-286,891,-13,69,924,-2,82,508,-23,104,86,-139,-69,926,1,-42,510,0,-30,84,-95,90,3,-47,-14,4,0],[0,949,0,6,1213,6,7,1387,12,10,1456,9,115,1364,2,369,1363,56,416,1583,133,-103,1353,9,-185,1109,-26,-289,895,-16,69,925,-2,82,509,-28,101,86,-136,-69,927,-1,-45,511,-3,-33,83,-92,87,2,-44,-18,3,3],[0,950,0,7,1213,13,10,1388,23,14,1456,21,117,1368,15,364,1414,78,421,1631,157,-101,1355,19,-185,1112,-20,-291,899,-17,69,926,-2,80,510,-33,97,85,-133,-69,928,-2,-49,512,-9,-38,82,-89,82,2,-41,-22,2,6],[0,951,0,8,1214,20,13,1388,35,17,1456,34,118,1371,27,351,1458,102,422,1668,187,-98,1356,28,-183,1115,-16,-290,902,-19,69,927,-3,79,512,-38,92,84,-130,-69,929,-3,-52,512,-13,-42,81,-85,78,1,-37,-26,1,10],[0,951,0,10,1213,26,16,1387,46,21,1456,46,120,1373,38,332,1493,126,421,1693,219,-95,1357,37,-181,1117,-11,-288,905,-21,69,928,-3,77,513,-43,86,84,-128,-69,929,-4,-55,512,-13,-46,81,-81,73,1,-34,-31,1,14],[0,952,0,11,1213,32,19,1385,56,25,1454,57,121,1374,48,311,1520,148,417,1707,250,-92,1357,46,-179,1118,-8,-286,907,-24,69,928,-3,74,513,-47,78,83,-126,-69,929,-5,-56,512,-9,-51,80,-78,68,2,-31,-35,1,18],[0,951,0,12,1212,39,22,1384,67,28,1452,69,121,1375,58,291,1537,168,411,1710,280,-90,1357,54,-177,1119,-4,-284,908,-28,69,928,-2,73,513,-46,74,83,-123,-69,929,-6,-58,512,-3,-56,81,-73,63,3,-27,-40,1,22],[0,951,0,12,1210,45,23,1381,78,29,1450,81,121,1375,68,278,1544,187,401,1708,308,-88,1355,62,-175,1119,-1,-282,908,-31,69,928,-2,71,513,-43,68,82,-119,-69,929,-7,-60,512,3,-61,81,-69,58,2,-23,-46,1,27],[0,951,0,13,1209,51,24,1379,89,30,1447,93,120,1374,80,271,1544,205,390,1705,333,-88,1353,70,-174,1118,2,-280,908,-34,69,927,-2,69,512,-39,63,81,-114,-69,929,-9,-62,512,9,-66,81,-64,52,1,-18,-51,1,32],[0,951,0,12,1207,57,23,1377,99,30,1445,104,119,1373,91,266,1541,223,379,1702,356,-88,1351,78,-172,1117,5,-278,908,-37,69,927,-1,66,512,-34,59,81,-109,-69,929,-10,-64,513,12,-70,81,-58,48,1,-13,-55,1,37],[0,951,0,12,1206,62,23,1375,107,29,1443,114,118,1371,101,261,1538,239,369,1699,377,-88,1350,84,-171,1116,7,-276,908,-39,69,927,0,64,511,-29,54,80,-104,-69,929,-12,-67,513,15,-75,81,-54,43,0,-8,-60,1,42],[0,951,0,12,1205,65,22,1373,114,28,1441,123,117,1370,109,256,1535,252,361,1695,394,-89,1349,88,-171,1116,8,-274,908,-42,69,927,1,62,510,-23,50,80,-100,-68,930,-13,-69,514,16,-79,82,-50,39,0,-5,-64,2,45],[0,951,0,11,1205,68,21,1371,118,26,1439,129,115,1369,115,252,1533,263,355,1691,408,-90,1348,91,-170,1116,7,-273,908,-46,69,926,2,60,510,-17,46,80,-98,-68,930,-14,-72,514,17,-83,82,-47,35,0,-2,-68,2,48],[0,950,0,11,1204,69,19,1371,122,25,1438,133,113,1369,120,249,1530,271,351,1686,418,-91,1347,92,-170,1115,6,-272,908,-50,69,926,2,58,510,-12,43,81,-96,-68,930,-16,-74,514,17,-87,82,-46,31,0,0,-72,2,50],[0,950,0,10,1204,71,18,1370,124,23,1438,136,112,1368,123,247,1527,277,349,1682,426,-92,1347,92,-170,1115,4,-272,908,-54,69,926,3,56,509,-8,39,81,-95,-68,930,-16,-76,514,17,-90,82,-44,28,1,1,-75,2,51],[0,950,0,9,1204,71,17,1370,125,22,1437,139,111,1368,125,246,1525,281,347,1678,432,-92,1346,93,-170,1116,2,-271,909,-58,69,926,4,55,509,-4,37,82,-94,-68,930,-17,-78,515,17,-93,82,-44,25,1,2,-78,2,52],[0,950,0,9,1203,72,16,1369,126,21,1436,140,110,1367,127,246,1522,285,347,1674,437,-93,1346,93,-170,1116,0,-271,909,-62,69,926,4,53,509,-1,34,82,-93,-68,930,-18,-79,515,17,-95,82,-43,23,2,3,-80,2,53],[0,950,0,9,1203,72,15,1369,127,21,1436,142,110,1367,128,246,1521,287,348,1671,440,-93,1346,93,-170,1116,-1,-270,910,-64,68,926,5,52,509,1,32,82,-93,-68,930,-18,-80,515,17,-97,82,-43,21,2,3,-82,2,53],[0,950,0,9,1203,73,15,1369,128,20,1436,143,110,1366,129,246,1519,289,348,1669,443,-93,1345,93,-169,1116,-1,-269,910,-67,68,926,5,51,509,3,31,83,-93,-68,930,-18,-81,515,17,-98,82,-43,20,3,3,-84,2,53],[0,950,0,9,1203,73,15,1368,129,20,1435,144,110,1366,130,246,1518,291,349,1667,445,-93,1345,94,-169,1116,-2,-269,911,-68,68,926,5,50,509,3,30,83,-93,-68,930,-18,-82,515,17,-100,82,-43,18,3,3,-85,2,53],[0,950,0,9,1203,74,15,1368,130,20,1435,145,109,1365,131,246,1517,292,349,1665,446,-93,1345,94,-169,1116,-2,-269,911,-69,68,925,5,50,509,3,29,83,-93,-68,930,-19,-82,515,17,-101,82,-43,17,3,3,-86,2,53],[0,950,0,9,1202,74,15,1368,131,20,1435,146,109,1365,132,247,1516,293,350,1664,448,-93,1345,95,-169,1116,-2,-269,911,-69,68,925,5,49,509,4,28,83,-93,-68,930,-19,-83,515,17,-102,82,-43,16,3,3,-87,2,53],[0,950,0,8,1202,75,15,1367,132,20,1434,147,109,1365,133,247,1515,294,350,1663,449,-94,1345,95,-169,1116,-1,-269,911,-69,68,925,5,49,509,3,27,83,-93,-68,930,-19,-83,515,17,-102,82,-43,16,3,3,-88,2,53],[0,950,0,8,1202,75,14,1367,132,20,1434,148,109,1365,134,247,1515,295,350,1663,450,-94,1344,96,-169,1116,-1,-269,910,-68,68,925,5,49,509,3,26,83,-93,-68,930,-19,-83,515,17,-103,82,-43,15,3,3,-88,2,53],[0,950,0,8,1202,76,14,1367,133,19,1434,148,109,1365,134,247,1514,296,350,1662,451,-94,1344,96,-169,1115,0,-269,910,-66,68,925,5,48,509,3,26,83,-94,-67,930,-19,-83,515,17,-103,82,-43,14,3,2,-89,2,52],[0,950,0,8,1202,76,14,1367,133,19,1434,149,109,1364,135,247,1514,296,350,1661,451,-94,1344,97,-170,1115,1,-270,910,-65,68,925,5,48,509,3,25,83,-94,-67,930,-19,-83,515,16,-104,82,-44,14,3,2,-89,2,52],[0,950,0,8,1202,76,14,1367,134,19,1434,149,108,1364,135,246,1513,296,350,1660,452,-94,1344,97,-170,1115,1,-270,909,-64,68,925,5,48,509,2,25,83,-94,-67,930,-19,-84,515,16,-104,82,-44,13,3,1,-90,2,51],[0,950,0,8,1202,76,13,1367,134,18,1434,149,108,1365,135,246,1513,297,350,1660,452,-95,1344,97,-170,1115,2,-271,909,-62,68,925,5,48,509,2,24,83,-95,-67,930,-19,-84,515,16,-104,82,-45,13,3,1,-90,2,51],[0,950,0,8,1202,76,13,1367,134,18,1434,149,108,1365,135,246,1513,297,350,1659,453,-95,1344,97,-171,1114,2,-272,909,-62,68,925,5,48,509,1,24,83,-95,-67,930,-19,-84,515,16,-105,82,-45,13,3,0,-90,2,50],[0,950,0,8,1202,76,13,1367,133,18,1434,149,107,1365,135,246,1513,297,350,1659,453,-95,1344,97,-171,1114,2,-272,909,-61,68,925,5,48,509,1,24,83,-96,-67,930,-19,-84,515,15,-105,82,-46,13,3,0,-90,2,50],[0,950,0,7,1202,76,12,1367,133,17,1434,149,107,1365,134,246,1513,297,350,1659,452,-95,1344,96,-171,1114,1,-272,909,-61,68,925,5,48,509,0,24,83,-97,-67,930,-19,-84,515,15,-105,82,-47,13,3,-1,-90,2,49],[0,950,0,7,1202,76,12,1367,133,17,1434,148,107,1365,134,245,1513,296,350,1660,452,-96,1344,96,-171,1114,1,-272,909,-62,68,925,5,48,509,0,25,83,-97,-67,930,-19,-84,515,15,-104,82,-47,13,3,-2,-90,2,48],[0,950,0,7,1202,75,12,1367,132,17,1434,148,107,1365,134,245,1513,296,349,1660,451,-96,1344,95,-171,1114,0,-273,909,-63,68,925,5,48,509,-1,25,83,-98,-67,930,-19,-84,515,14,-104,82,-48,14,3,-3,-90,2,47],[0,950,0,7,1202,75,12,1367,132,16,1434,147,106,1366,133,245,1514,295,350,1661,450,-96,1344,94,-171,1114,-1,-272,909,-63,68,925,5,48,509,-2,25,83,-99,-67,930,-19,-83,514,14,-104,82,-49,14,3,-3,-89,2,46],[0,950,0,7,1202,75,12,1368,131,16,1435,147,106,1366,133,245,1514,294,350,1661,449,-96,1344,94,-171,1114,-2,-272,909,-64,68,925,5,48,509,-3,26,83,-100,-67,930,-19,-83,514,13,-103,82,-50,15,3,-4,-89,2,45],[0,950,0,7,1202,74,11,1368,130,16,1435,146,106,1366,132,245,1515,293,350,1662,448,-96,1344,93,-171,1115,-2,-272,909,-65,68,925,5,49,509,-3,27,83,-101,-67,930,-19,-83,514,13,-102,82,-51,15,3,-5,-88,2,45],[0,950,0,7,1203,74,11,1368,129,16,1435,144,106,1367,131,245,1515,292,350,1662,447,-96,1345,92,-171,1115,-3,-272,909,-66,68,925,6,49,509,-4,27,83,-102,-67,930,-19,-83,514,12,-101,82,-52,16,3,-6,-87,2,43],[0,950,0,7,1203,73,11,1369,128,16,1436,143,106,1367,130,245,1516,290,351,1663,445,-96,1345,90,-171,1115,-4,-272,909,-66,68,926,6,49,509,-5,28,83,-103,-67,930,-19,-82,514,12,-101,82,-53,17,3,-7,-86,2,42],[0,950,0,7,1203,72,12,1369,126,16,1436,141,106,1367,128,246,1516,289,351,1663,443,-96,1345,89,-171,1115,-5,-273,909,-67,68,926,6,50,509,-6,29,84,-104,-67,930,-19,-82,514,11,-100,82,-54,18,3,-9,-85,2,41],[0,950,0,7,1203,71,12,1370,124,16,1437,139,106,1368,126,246,1517,287,351,1664,441,-96,1346,87,-171,1115,-6,-273,909,-67,68,926,6,50,509,-7,30,84,-105,-67,930,-19,-81,514,10,-99,82,-55,19,3,-10,-84,2,40],[0,950,0,7,1204,70,12,1370,122,15,1438,137,107,1368,124,246,1518,284,352,1665,438,-96,1346,85,-170,1115,-8,-273,909,-68,68,926,6,51,509,-9,31,84,-107,-67,930,-19,-81,514,10,-97,82,-57,20,3,-11,-83,2,39],[0,950,0,7,1204,69,12,1371,120,15,1438,134,107,1369,122,247,1519,281,353,1666,435,-96,1347,82,-170,1116,-9,-273,909,-69,68,926,6,52,509,-10,33,84,-108,-67,930,-19,-80,514,9,-96,82,-58,21,3,-12,-82,2,37],[0,950,0,7,1205,67,12,1372,117,15,1439,131,107,1370,119,247,1520,278,354,1668,430,-96,1347,80,-170,1116,-11,-273,909,-69,68,926,6,52,510,-12,34,84,-109,-67,930,-19,-80,514,8,-95,82,-60,23,4,-14,-81,2,36],[0,950,0,7,1205,65,11,1373,114,14,1440,128,106,1371,117,248,1521,274,355,1670,426,-96,1348,77,-170,1116,-13,-273,909,-70,68,926,6,53,510,-14,35,84,-111,-67,929,-19,-79,513,7,-94,82,-61,24,4,-15,-79,2,35],[0,950,0,7,1206,63,11,1374,110,13,1441,124,106,1372,113,248,1522,270,356,1671,421,-97,1348,74,-170,1116,-14,-272,908,-71,69,926,6,54,510,-16,36,84,-112,-67,929,-18,-78,513,6,-92,82,-63,25,4,-16,-78,2,33],[0,951,0,6,1206,61,10,1375,106,12,1443,119,105,1373,109,248,1524,265,357,1674,415,-97,1349,71,-171,1115,-16,-272,907,-71,69,927,6,55,511,-18,38,84,-114,-67,929,-18,-77,513,6,-91,82,-64,27,4,-18,-76,2,32],[0,951,0,6,1207,59,10,1376,102,11,1444,114,105,1375,105,248,1526,259,357,1676,408,-98,1349,67,-171,1115,-18,-272,907,-72,69,927,6,57,511,-21,40,84,-115,-67,929,-17,-76,513,5,-89,81,-65,28,4,-19,-75,2,30],[0,951,0,6,1208,56,9,1378,97,10,1446,108,105,1376,100,248,1528,253,358,1679,401,-99,1349,63,-171,1115,-21,-273,906,-72,69,927,6,58,511,-23,41,85,-116,-67,929,-17,-75,513,5,-87,81,-67,30,4,-21,-73,1,29],[0,951,0,6,1209,53,9,1379,91,9,1447,102,105,1377,94,248,1531,246,359,1682,392,-99,1350,59,-171,1114,-23,-273,905,-72,69,928,5,59,512,-25,44,85,-118,-68,929,-16,-74,512,4,-85,81,-68,32,5,-22,-71,1,27],[0,951,0,6,1209,49,9,1380,85,8,1449,94,105,1379,87,249,1533,238,359,1686,383,-99,1350,54,-171,1114,-26,-273,904,-72,69,928,5,61,512,-28,46,85,-119,-68,928,-15,-72,512,4,-83,81,-70,35,5,-24,-68,1,25],[0,951,0,6,1210,45,10,1382,78,7,1450,86,106,1379,80,250,1535,230,360,1689,373,-99,1350,48,-171,1113,-29,-273,903,-72,69,928,5,62,513,-30,49,85,-121,-68,928,-14,-70,512,3,-80,81,-72,38,5,-25,-66,1,24],[0,951,0,7,1211,41,11,1383,70,7,1451,77,108,1380,71,252,1536,221,362,1691,364,-98,1351,41,-170,1113,-32,-272,902,-71,69,928,4,63,513,-31,52,85,-122,-68,928,-13,-68,511,3,-77,81,-73,41,5,-27,-62,1,22],[0,951,0,7,1211,36,12,1384,62,6,1453,68,109,1380,63,253,1537,212,364,1693,354,-97,1351,35,-168,1112,-35,-272,900,-70,69,928,4,64,513,-32,55,85,-123,-68,928,-12,-66,511,3,-73,81,-74,44,5,-27,-59,1,21],[0,951,0,8,1212,31,12,1385,54,5,1453,59,110,1381,55,255,1538,203,366,1693,344,-97,1351,29,-167,1110,-38,-271,899,-69,69,928,4,64,513,-31,59,85,-123,-68,928,-11,-64,511,4,-69,81,-75,48,4,-28,-55,1,21],[0,951,0,8,1212,27,13,1386,46,4,1454,51,111,1381,47,257,1539,193,369,1694,334,-97,1351,22,-166,1109,-41,-270,896,-68,69,928,3,66,512,-28,64,85,-122,-68,927,-10,-61,511,6,-65,81,-75,52,4,-28,-51,1,20],[0,951,0,9,1212,22,13,1386,38,3,1454,42,111,1382,39,259,1539,184,372,1694,324,-97,1350,16,-165,1107,-44,-268,894,-66,69,928,3,68,512,-23,70,86,-121,-68,927,-9,-59,511,9,-61,81,-75,57,3,-27,-46,1,21],[0,950,0,9,1213,17,13,1387,31,2,1455,35,111,1382,31,261,1539,175,376,1694,314,-97,1349,10,-165,1105,-47,-267,891,-65,69,928,3,70,511,-17,76,86,-119,-68,927,-8,-56,510,12,-56,82,-74,63,3,-26,-41,2,21],[0,950,0,9,1212,13,13,1387,24,2,1455,27,112,1382,24,263,1538,166,380,1693,303,-97,1349,4,-164,1104,-49,-265,889,-64,69,927,2,71,510,-10,83,87,-118,-69,926,-7,-53,510,15,-50,82,-73,69,4,-25,-35,2,22],[0,950,0,10,1212,8,14,1387,17,2,1455,21,113,1382,17,266,1538,157,385,1693,292,-96,1349,-1,-163,1103,-51,-263,888,-62,69,927,2,73,510,-4,89,87,-116,-69,926,-6,-49,510,18,-44,82,-72,75,4,-23,-29,2,23],[0,949,0,11,1212,4,15,1387,11,3,1454,14,114,1381,10,271,1536,148,391,1692,281,-95,1348,-5,-161,1102,-53,-262,887,-61,69,926,2,75,509,2,95,88,-115,-69,926,-5,-46,510,22,-37,83,-70,81,5,-22,-23,3,25],[0,949,0,12,1211,1,17,1386,5,5,1454,8,116,1380,4,275,1533,140,397,1690,271,-94,1347,-10,-160,1101,-55,-262,886,-60,69,925,2,76,508,8,101,89,-113,-69,925,-4,-42,510,26,-31,83,-68,87,6,-20,-16,4,27],[0,948,0,13,1211,-3,18,1385,-1,6,1453,2,118,1379,-2,281,1529,132,404,1688,260,-92,1346,-14,-159,1100,-57,-262,885,-59,69,924,1,78,507,14,107,89,-111,-69,925,-3,-38,511,30,-25,84,-66,94,6,-17,-10,4,30],[0,947,0,14,1210,-7,20,1384,-7,8,1452,-4,120,1377,-8,289,1523,124,412,1684,249,-91,1345,-18,-158,1098,-60,-262,884,-58,69,923,1,80,506,20,113,90,-109,-69,925,-2,-34,511,35,-18,85,-64,100,7,-15,-3,5,32],[0,946,0,16,1209,-11,22,1383,-13,10,1451,-10,122,1375,-15,299,1514,115,420,1677,238,-89,1344,-22,-157,1097,-63,-263,884,-57,68,921,1,82,505,26,118,90,-107,-70,924,-1,-30,511,39,-13,86,-61,105,7,-13,3,6,34],[0,945,0,18,1207,-15,23,1382,-19,11,1450,-16,125,1372,-21,310,1502,107,430,1669,227,-87,1342,-27,-157,1095,-66,-264,883,-57,68,920,1,84,504,31,124,90,-105,-70,924,0,-26,512,43,-7,87,-59,111,8,-12,8,7,36],[0,944,0,19,1206,-19,26,1381,-25,13,1448,-22,128,1369,-27,323,1485,99,440,1656,215,-85,1341,-32,-156,1094,-69,-265,883,-58,68,918,1,85,503,35,129,91,-104,-70,924,1,-23,512,47,-2,88,-58,116,8,-10,13,8,37],[0,943,0,21,1205,-22,27,1379,-31,15,1447,-28,131,1366,-33,336,1464,92,452,1640,203,-84,1339,-37,-155,1092,-72,-267,882,-58,68,917,0,86,502,38,134,91,-103,-70,923,2,-19,512,50,3,89,-57,121,8,-9,18,9,39],[0,943,0,22,1204,-25,29,1378,-37,16,1446,-34,133,1362,-38,350,1438,84,463,1617,191,-82,1338,-42,-154,1091,-75,-268,882,-58,68,916,0,87,501,40,138,91,-102,-70,923,2,-16,513,51,7,89,-56,125,9,-8,22,9,40],[0,942,0,23,1203,-28,30,1377,-42,17,1445,-39,135,1359,-42,362,1407,75,473,1589,179,-81,1337,-46,-153,1089,-78,-269,882,-58,67,915,0,87,500,41,141,91,-102,-70,923,3,-14,513,52,10,90,-55,128,9,-8,25,10,41],[0,942,0,23,1203,-30,31,1377,-45,18,1444,-43,137,1356,-46,371,1370,65,481,1555,167,-80,1336,-49,-152,1088,-80,-269,882,-57,67,915,0,87,500,41,144,91,-102,-70,924,3,-13,513,51,12,90,-54,130,9,-7,28,10,41],[0,943,0,24,1203,-31,31,1377,-48,18,1444,-47,137,1354,-48,375,1330,53,485,1514,156,-80,1335,-52,-151,1087,-82,-269,882,-55,67,915,0,87,500,40,145,91,-102,-70,924,3,-12,514,50,14,90,-54,131,9,-7,29,10,42],[0,943,0,24,1203,-32,30,1377,-50,17,1444,-49,137,1352,-50,373,1289,40,484,1470,147,-81,1334,-53,-150,1086,-83,-269,882,-52,67,915,0,87,500,39,145,90,-101,-70,924,3,-12,514,48,14,89,-54,132,9,-7,29,9,42],[0,943,0,23,1203,-32,29,1377,-50,16,1445,-50,137,1350,-51,363,1248,25,481,1420,139,-82,1334,-53,-148,1085,-83,-268,882,-48,67,915,0,87,500,38,144,90,-102,-70,925,4,-12,514,46,13,89,-54,131,9,-7,28,9,42],[0,944,0,23,1204,-32,27,1378,-51,15,1445,-51,136,1349,-51,348,1212,9,478,1366,135,-83,1334,-53,-147,1084,-82,-266,882,-43,67,916,-1,86,501,36,143,90,-102,-70,925,4,-14,514,43,12,88,-54,129,8,-8,27,8,41],[0,944,0,22,1205,-32,26,1378,-50,13,1446,-51,135,1348,-51,328,1181,-6,473,1308,132,-84,1334,-53,-146,1084,-81,-264,881,-38,67,916,-1,85,501,33,141,89,-103,-70,926,4,-16,514,40,10,88,-55,127,8,-8,25,8,40],[0,945,0,22,1205,-31,24,1379,-50,12,1447,-52,134,1348,-50,305,1155,-20,467,1247,128,-86,1334,-52,-146,1083,-80,-261,881,-32,67,917,-1,85,501,30,138,89,-104,-70,926,4,-18,514,36,7,87,-56,125,7,-9,23,7,40],[0,946,0,21,1206,-31,23,1380,-50,11,1448,-51,133,1347,-49,283,1136,-32,457,1187,123,-87,1335,-52,-145,1083,-78,-258,881,-26,67,918,-1,84,502,26,135,88,-105,-70,927,3,-21,514,31,5,86,-57,122,7,-11,20,6,38],[0,946,0,21,1207,-30,22,1381,-49,10,1448,-51,132,1347,-47,263,1123,-41,442,1129,115,-88,1336,-51,-145,1084,-76,-255,881,-19,67,919,-1,84,503,22,132,87,-107,-70,928,3,-24,514,27,1,86,-58,119,6,-12,17,6,37],[0,947,0,20,1208,-29,21,1381,-47,10,1449,-49,131,1347,-46,245,1113,-48,422,1078,105,-89,1337,-50,-144,1084,-73,-251,881,-13,67,919,0,84,503,18,129,87,-108,-70,928,3,-26,514,22,-2,85,-60,116,5,-13,14,5,36],[0,948,0,20,1208,-28,20,1382,-46,10,1450,-48,131,1347,-44,229,1107,-53,400,1036,96,-89,1338,-48,-143,1085,-70,-248,881,-7,67,920,0,83,504,14,126,86,-109,-70,928,2,-29,514,18,-5,85,-61,113,5,-15,10,5,34],[0,948,0,20,1209,-26,20,1383,-43,11,1451,-45,130,1347,-42,215,1102,-56,377,1003,87,-90,1339,-46,-142,1086,-67,-243,881,-1,67,921,0,82,504,11,123,86,-111,-70,929,2,-32,514,15,-8,84,-62,110,5,-16,7,4,33],[0,948,0,20,1209,-25,20,1383,-41,11,1451,-43,130,1347,-40,203,1099,-57,354,976,80,-90,1340,-43,-141,1087,-64,-239,881,4,68,921,-1,81,504,9,120,86,-112,-70,929,2,-34,514,12,-11,84,-63,107,4,-17,4,4,32],[0,948,0,20,1209,-23,20,1384,-39,12,1452,-40,130,1348,-38,194,1097,-56,332,953,73,-90,1341,-40,-141,1088,-60,-234,880,10,68,921,-1,80,504,7,117,85,-113,-70,929,2,-35,514,11,-14,84,-65,104,4,-18,1,4,31],[0,949,0,20,1210,-22,20,1384,-36,12,1452,-37,130,1348,-35,187,1096,-54,312,934,67,-90,1342,-38,-140,1088,-57,-230,880,14,68,921,-1,80,504,6,114,85,-114,-70,929,2,-37,514,10,-17,84,-65,101,4,-19,-1,4,30],[0,949,0,20,1210,-20,19,1384,-34,12,1453,-35,130,1349,-33,182,1095,-51,293,918,62,-91,1343,-35,-139,1089,-54,-225,880,19,68,921,-1,79,505,4,111,85,-115,-70,929,1,-38,514,9,-19,83,-66,98,4,-20,-4,3,29],[0,949,0,20,1210,-19,19,1385,-32,13,1453,-32,129,1349,-31,177,1095,-48,275,906,58,-91,1344,-33,-139,1090,-51,-222,879,23,68,922,-1,78,505,2,108,85,-116,-70,929,1,-39,514,8,-22,83,-67,96,4,-21,-7,3,28],[0,949,0,19,1211,-18,18,1385,-30,13,1454,-30,129,1350,-29,172,1094,-45,259,897,55,-92,1345,-31,-138,1090,-48,-219,879,27,68,922,-1,77,505,0,106,85,-117,-70,929,1,-40,514,7,-24,83,-68,93,4,-22,-9,3,27],[0,949,0,19,1211,-17,17,1385,-28,12,1454,-28,128,1350,-27,169,1094,-42,246,890,53,-92,1346,-29,-138,1091,-46,-216,879,30,68,922,-1,77,506,-2,103,85,-118,-70,929,1,-42,514,5,-27,83,-69,91,4,-23,-12,3,26],[0,949,0,18,1211,-16,17,1385,-27,12,1454,-26,127,1351,-26,165,1094,-39,234,885,51,-93,1346,-28,-138,1091,-44,-214,879,33,68,923,-1,76,506,-4,101,84,-118,-70,930,0,-43,513,3,-29,83,-70,89,3,-24,-14,3,26],[0,950,0,18,1211,-15,16,1386,-25,12,1455,-25,127,1351,-25,162,1094,-36,225,882,50,-94,1347,-27,-139,1092,-42,-212,880,36,68,923,-1,76,506,-7,100,84,-119,-70,930,0,-44,513,2,-30,82,-70,87,3,-24,-15,2,25],[0,950,0,18,1212,-15,15,1386,-24,11,1455,-23,126,1351,-23,160,1094,-35,218,880,50,-94,1348,-26,-139,1092,-40,-211,880,38,68,923,0,76,506,-9,98,84,-120,-70,930,0,-45,513,1,-31,82,-71,86,3,-25,-16,2,25],[0,950,0,17,1212,-14,15,1386,-23,11,1455,-22,125,1352,-22,158,1095,-33,214,879,49,-95,1348,-25,-139,1093,-39,-211,880,39,68,923,0,76,507,-10,98,84,-120,-70,930,0,-45,513,0,-32,82,-71,85,3,-25,-17,2,24]]}}'),ff={clips:hf},fe={Hips:0,Chest:1,Neck:2,Head:3,ShL:4,ElL:5,HandL:6,ShR:7,ElR:8,HandR:9,HipL:10,KneeL:11,FootL:12,HipR:13,KneeR:14,FootR:15,ToeL:16,ToeR:17},dc=18,bt=Object.fromEntries(Object.entries(ff.clips).map(([n,e])=>[n,{stride:(e.stride??0)/1e3,frames:e.frames.map(t=>Float32Array.from(t,i=>i/1e3))}])),df=()=>new Float32Array(dc*3),pf=n=>Float32Array.from(n),ut=(n,e)=>({x:n[e*3],y:n[e*3+1],z:n[e*3+2]});function Ur(n,e,t){n[e*3]=t.x,n[e*3+1]=t.y,n[e*3+2]=t.z}function li(n,e,t,i=df()){for(let s=0;s<i.length;s++)i[s]=n[s]+(e[s]-n[s])*t;return i}function ai(n,e,t=!1){const i=n.frames.length;let s=t?(e%i+i)%i:Math.max(0,Math.min(i-1,e));const r=Math.floor(s),a=s-r,o=t?(r+1)%i:Math.min(i-1,r+1);return li(n.frames[r],n.frames[o],a)}function ui(n,e,t,i,s){const r=Math.cos(s),a=Math.sin(s);for(const o of e){const l=n[o*3]-t.x,c=n[o*3+1]-t.y,u=n[o*3+2]-t.z;let f=l,d=c,m=u;i==="x"?(d=c*r-u*a,m=c*a+u*r):i==="y"?(f=l*r+u*a,m=-l*a+u*r):(f=l*r-c*a,d=l*a+c*r),n[o*3]=f+t.x,n[o*3+1]=d+t.y,n[o*3+2]=m+t.z}}function Nr(n,e,t){for(const i of e)n[i*3]+=t.x??0,n[i*3+1]+=t.y??0,n[i*3+2]+=t.z??0}const t1=Array.from({length:dc},(n,e)=>e),ts=[fe.Chest,fe.Neck,fe.Head,fe.ShL,fe.ElL,fe.HandL,fe.ShR,fe.ElR,fe.HandR],ho=(n,e)=>Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z);function pc(n,e,t,i,s,r){const a=ut(n,e),o=ut(n,t),l=ut(n,i),c=ho(a,o),u=ho(o,l);let f=s.x-a.x,d=s.y-a.y,m=s.z-a.z,g=Math.hypot(f,d,m)||1e-6;f/=g,d/=g,m/=g,g=Math.max(Math.abs(c-u)+.001,Math.min(c+u-.001,g));const x=(c*c-u*u+g*g)/(2*g),p=Math.sqrt(Math.max(0,c*c-x*x)),h=r.x*f+r.y*d+r.z*m;let T=r.x-f*h,b=r.y-d*h,S=r.z-m*h;const w=Math.hypot(T,b,S)||1;T/=w,b/=w,S/=w,Ur(n,t,{x:a.x+f*x+T*p,y:a.y+d*x+b*p,z:a.z+m*x+S*p}),Ur(n,i,{x:a.x+f*g,y:a.y+d*g,z:a.z+m*g})}function Ci(n,e,t){const[i,s,r,a]=e?[fe.HipL,fe.KneeL,fe.FootL,fe.ToeL]:[fe.HipR,fe.KneeR,fe.FootR,fe.ToeR],o=ut(n,r),l=ut(n,a);pc(n,i,s,r,t,{x:0,y:0,z:1});const c=ut(n,r);Ur(n,a,{x:l.x+c.x-o.x,y:l.y+c.y-o.y,z:l.z+c.z-o.z})}function It(n,e,t,i={x:e?1:-1,y:-.6,z:-.3}){pc(n,e?fe.ShL:fe.ShR,e?fe.ElL:fe.ElR,e?fe.HandL:fe.HandR,t,i)}function mf(n,e){e<=0||(ui(n,t1,{x:0,y:0,z:-.15},"x",-Math.PI/2*e),Nr(n,t1,{y:.12*e}))}const Bs=new Map;function gf(n,e){const t=n+e;if(!Bs.has(t)){const i=document.createElement("canvas");i.width=256,i.height=160;const s=i.getContext("2d");s.fillStyle=e,s.textAlign="center",s.textBaseline="middle",s.font=`900 ${n.length>2?104:124}px Georgia, "Times New Roman", serif`,s.fillText(n,128,84);const r=new ic(i);r.colorSpace=Ot,Bs.set(t,r)}return Bs.get(t)}const _f=new D(0,1,0),un=n=>new D(n.x,n.y,n.z),xf=1.08;class fo{root=new Fn;torso=new Fn;head=new Fn;segs=[];joints=[];cloth;torsoLen;constructor(e,t){const i=(g,x=.75)=>new ri({color:g,roughness:x});this.cloth=i(e.jacket??e.shirt,.7);const s=i(e.skin,.8),r=i(e.pants,.9),a=i(1710620,.6),o=e.jacket!==void 0||e.longSleeves?this.cloth:s,l=(g,x)=>ut(t,g)&&un(ut(t,g)).distanceTo(un(ut(t,x))),c=(g,x,p,h)=>{const T=new He(new e1(p,Math.max(.01,l(g,x)-p*.5),4,10),h);T.castShadow=!0,this.root.add(T),this.segs.push({mesh:T,a:g,b:x})},u=(g,x,p)=>{const h=new He(new Zt(x,12,8),p);h.castShadow=!0,this.root.add(h),this.joints.push({mesh:h,j:g})};c(fe.ShL,fe.ElL,.062,this.cloth),c(fe.ElL,fe.HandL,.05,o),c(fe.ShR,fe.ElR,.062,this.cloth),c(fe.ElR,fe.HandR,.05,o),u(fe.HandL,.058,s),u(fe.HandR,.058,s),c(fe.HipL,fe.KneeL,.085,r),c(fe.KneeL,fe.FootL,.068,r),c(fe.HipR,fe.KneeR,.085,r),c(fe.KneeR,fe.FootR,.068,r),c(fe.FootL,fe.ToeL,.055,a),c(fe.FootR,fe.ToeR,.055,a),c(fe.HipL,fe.HipR,.11,r),c(fe.Neck,fe.Head,.05,s),this.torsoLen=l(fe.Hips,fe.Neck);const f=new He(new e1(.15,this.torsoLen-.12,4,12),this.cloth);f.position.y=this.torsoLen/2,f.scale.set(1.35,1,.85),f.castShadow=!0;const d=new He(new e1(.075,l(fe.ShL,fe.ShR)-.05,4,8),this.cloth);if(d.rotation.z=Math.PI/2,d.position.y=this.torsoLen-.06,d.castShadow=!0,this.torso.add(f,d),e.jacket!==void 0){const g=new He(new mn(.11,.3,.02),i(e.shirt,.6));g.position.set(0,this.torsoLen-.17,.128),g.rotation.x=-.08,this.torso.add(g)}if(e.collar!==void 0)for(const g of[-1,1]){const x=new He(new mn(.09,.03,.08),i(e.collar,.8));x.position.set(g*.055,this.torsoLen-.01,.09),x.rotation.set(.5,g*.5,g*.35),this.torso.add(x)}if(e.print){const g=new ri({map:gf(e.print.letters,e.print.ink),transparent:!0,roughness:.8});for(const x of[1,-1]){const p=new He(new zn(.32,.2),g);p.position.set(0,this.torsoLen*.62,x*.13),x<0&&(p.rotation.y=Math.PI),this.torso.add(p)}}this.root.add(this.torso);const m=new He(new Zt(.115,16,12),s);if(m.position.y=.09,m.castShadow=!0,this.head.add(m),e.hair!==void 0){const g=i(e.hair,.95),x=new He(new Zt(.122,14,8,0,Math.PI*2,0,Math.PI/2.1),g);x.position.set(0,.105,-.012),this.head.add(x);const p=e.messy?[[-.05,.035,.4],[.045,.055,-.3],[0,-.04,.1],[.075,-.012,-.6],[-.08,0,.7]]:[[0,.05,0]];for(const[h,T,b]of p){const S=new He(new Zt(e.messy?.048:.07,8,6),g);S.position.set(h,.2,T),S.scale.set(1.25,.55,1),S.rotation.z=b,this.head.add(S)}}if(e.beard!==void 0){const g=new He(new Zt(.1,12,8),i(e.beard,1));g.position.set(0,e.messy?.035:.025,.05),g.scale.set(1.02,e.messy?.8:1.05,.85),this.head.add(g)}if(e.glasses){const g=i(1381653,.4);for(const p of[-.045,.045]){const h=new He(new Q1(.031,.008,6,14),g);h.position.set(p,.105,.11),this.head.add(h)}const x=new He(new mn(.035,.008,.008),g);x.position.set(0,.11,.113),this.head.add(x)}this.root.add(this.head),this.root.scale.setScalar(e.scale*xf),this.apply(t)}place(e,t){this.root.position.set(e.x,0,e.y),this.root.rotation.y=Math.atan2(t.x,t.y)}apply(e){const t=new D,i=new D,s=new D;for(const u of this.segs){t.copy(un(ut(e,u.a))),i.copy(un(ut(e,u.b))),s.subVectors(i,t);const f=s.length();u.mesh.position.addVectors(t,i).multiplyScalar(.5),f>1e-5&&u.mesh.quaternion.setFromUnitVectors(_f,s.divideScalar(f))}for(const u of this.joints)u.mesh.position.copy(un(ut(e,u.j)));const r=un(ut(e,fe.Hips)),a=un(ut(e,fe.Neck)),o=un(ut(e,fe.Head)),l=un(ut(e,fe.ShL)).sub(un(ut(e,fe.ShR))),c=u=>{u.normalize();const f=l.clone().sub(u.clone().multiplyScalar(l.dot(u))).normalize(),d=new D().crossVectors(f,u);return new ct().makeBasis(f,u,d)};this.torso.position.copy(r),this.torso.quaternion.setFromRotationMatrix(c(a.clone().sub(r))),this.torso.scale.y=a.distanceTo(r)/this.torsoLen,this.head.position.copy(o),this.head.quaternion.setFromRotationMatrix(c(o.clone().sub(a)))}glow(e,t){this.cloth.emissive.setHex(e),this.cloth.emissiveIntensity=t}}function ji(n,e,t=0,i=n.frames.length){let s=t,r=-1/0;for(let a=t;a<i;a++){const o=e(n.frames[a]);o>r&&(r=o,s=a)}return s}const zs=(n,e)=>n[e*3+2],ks=(n,e)=>n[e*3+1],Y1={jab:ji(bt.jab,n=>zs(n,fe.HandL)),cross:ji(bt.cross,n=>zs(n,fe.HandR)),kick:ji(bt.kick,n=>zs(n,fe.FootR)+ks(n,fe.FootR)),slash:(()=>{const n=ji(bt.slash,e=>ks(e,fe.HandR));return ji(bt.slash,e=>-ks(e,fe.HandR),n,Math.min(bt.slash.frames.length,n+25))})()},mc=n=>n.frames.length-1,Fr=n=>n*n,ns=n=>1-(1-n)*(1-n),vf=n=>n<.5?2*n*n:1-2*(1-n)*(1-n),jt=n=>Math.max(0,Math.min(1,n));function Jt(n){const e=bt.guard.frames.length-1,t=n*.5%(2*e);return ai(bt.guard,t<e?t:2*e-t)}function N1(n,e,t,i,s,r,a=0){const o=bt[n],l=Y1[n],c=mc(o);if(e<t)return ai(o,a+(l-a)*Fr(e/Math.max(1,t)));if(e<t+i)return ai(o,l);const u=jt((e-t-i)/Math.max(1,s)),f=ai(o,l+(c-l)*ns(u));return li(f,Jt(r),jt((u-.5)*2))}function gc(n,e,t,i,s){const r=n.frames.length,a=ai(n,e/(n.stride*s)*r,!0);return li(Jt(i),a,jt(t*1.6))}function Di(n,e,t="x"){ui(n,ts,ut(n,fe.Hips),t,e)}function Mf(n,e,t){const i=e.frame;switch(n.state){case"free":return gc(bt.run,t.distance,t.speed,i,2.6);case"attack":{if(n.smash){const a=$.combo[2];return N1("slash",n.t,a.startup,a.active,a.recovery,i,Math.max(0,Y1.slash-14))}if(n.target===null&&n.hasHit&&n.dur===14)return N1("cross",n.t,4,2,8,i);const s=$.combo[n.combo];return N1(n.combo===0?"jab":n.combo===1?"cross":"kick",n.t,s.startup,s.active,s.recovery,i)}case"counter":{const s=N1("cross",n.t,3,6,Math.max(4,n.dur-9),i);return ui(s,ts,ut(s,fe.Hips),"y",-.35*(1-jt(n.t/n.dur))),s}case"whiff":{const s=Jt(i),r=Math.sin(jt(n.t/n.dur)*Math.PI);return It(s,!0,{x:.45,y:1.45,z:.25}),It(s,!1,{x:-.45,y:1.45,z:.25}),Di(s,-.35*r),s}case"dodge":{const s=jt(n.t/n.dur),r=Math.sin(s*Math.PI),a=Jt(i);return Ci(a,!0,{x:.14,y:.35*r,z:.3*r}),Ci(a,!1,{x:-.14,y:.3*r,z:.2*r}),It(a,!0,{x:.16,y:.9-.3*r,z:.35}),It(a,!1,{x:-.16,y:.9-.3*r,z:.35}),Di(a,1.1*r),Nr(a,t1,{y:-.45*r}),ui(a,t1,{x:0,y:.45,z:0},"x",vf(s)*Math.PI*2),a}case"hitstun":return _c(i,n.t,n.dur);case"grabbed":{const s=Jt(i),r=Math.sin(i*.6);return It(s,!0,{x:.3,y:1.75+.15*r,z:.2}),It(s,!1,{x:-.3,y:1.75-.15*r,z:.2}),Ci(s,!0,{x:.12,y:.12+.1*r,z:.1}),Ci(s,!1,{x:-.12,y:.12-.1*r,z:-.05}),Nr(s,t1,{y:.2}),s}case"down":return Jr(i,1)}}function _c(n,e,t){const i=Jt(n),s=Math.sin(jt(e/Math.max(1,t))*Math.PI)*(e<4?e/4:1);return Di(i,-.5*s),ui(i,[fe.Head],ut(i,fe.Neck),"x",-.6*s),It(i,!0,{x:.45,y:1,z:-.15*s+.1}),It(i,!1,{x:-.45,y:1.05,z:-.15*s+.1}),li(Jt(n),i,Math.min(1,s*1.5))}function Jr(n,e){const t=Jt(n);return It(t,!0,{x:.6,y:1.1,z:0}),It(t,!1,{x:-.6,y:1.15,z:.05}),Ci(t,!0,{x:.25,y:0,z:.1}),Ci(t,!1,{x:-.2,y:0,z:-.05}),mf(t,e),t}function po(n,e){const t=ns(jt(e/10)),i=Jr(n,t);return ui(i,ts,ut(i,fe.Hips),"y",.6*(1-t)),i}const mo={thug:"cross",heavy:"slash",boss:"cross",grappler:"cross",thrower:"cross"};function yf(n,e,t){const i=e.frame+n.id*37,s=n.kind==="heavy"||n.kind==="boss"?bt.angry:bt.swagger;switch(n.state){case"spawn":case"circle":case"approach":return gc(s,t.distance,t.speed,i,n.state==="approach"?1.6:1.2);case"windup":case"active":{const r=n.state==="windup"?Fr(jt(n.t/Math.max(1,n.dur))):1;if(n.kind==="grappler"){const u=Jt(i),f=n.state==="active"?1:0;return It(u,!0,{x:.75-.55*f,y:1.3,z:.2+.45*f}),It(u,!1,{x:-.75+.55*f,y:1.3,z:.2+.45*f}),Di(u,.15*r+.3*f),u}const a=n.unblockable?"slash":mo[n.kind],o=Y1[a],l=a==="slash"?Math.max(0,o-18):0,c=ai(bt[a],l+(o-l)*r);if(a==="cross"&&n.state==="windup"){const u=Math.sin(jt(n.t/Math.max(1,n.dur))*Math.PI*.85);It(c,!1,{x:-.32,y:1.4,z:-.3*u+.1}),ui(c,ts,ut(c,fe.Hips),"y",.5*u),Di(c,-.12*u)}return c}case"recover":{const r=n.unblockable?"slash":mo[n.kind],a=Y1[r],o=mc(bt[r]),l=jt(n.t/Math.max(1,n.dur));return li(ai(bt[r],a+(o-a)*l*.6),Jt(i),ns(l))}case"holding":{const r=Jt(i);return It(r,!0,{x:.18,y:1.2,z:.55}),It(r,!1,{x:-.18,y:1.2,z:.55}),Di(r,.1),r}case"stun":return _c(i,n.t,n.dur);case"down":return po(i,n.t);case"getup":{const r=jt(n.t/n.dur);return li(Jr(i,1),Jt(i),Fr(r))}case"dead":return po(i,n.t)}}class Sf{prev=null;from=null;state="";t=0;next(e,t,i=!1){e!==this.state&&(this.from=this.prev?pf(this.prev):null,this.state=e,this.t=0),this.t++;const s=i?2:6,r=this.from&&this.t<s?li(this.from,t,ns(this.t/s)):t;return this.prev=r,r}}const $t=[{name:"CONRAD",css:"#2bb3a3",look:{shirt:1974050,collar:2895153,pants:2831432,skin:15120790,hair:5125412,messy:!0,beard:5913382,longSleeves:!0,scale:1.1}},{name:"GEORGE",css:"#6f8fe0",look:{jacket:2043226,shirt:13163248,pants:1778496,skin:14990488,hair:2759958,beard:3810584,glasses:!0,scale:1}}],Hs=[{letters:"ΦΓΔ",shirt:5974662,ink:"#f4f1ea"},{letters:"ΑΤΩ",shirt:3108277,ink:"#f2c443"},{letters:"ΒΘΠ",shirt:15044528,ink:"#23408f"},{letters:"ΣΧ",shirt:2047887,ink:"#f2c443"},{letters:"ΦΔΘ",shirt:15000804,ink:"#1f4fa6"},{letters:"ΚΣ",shirt:11739184,ink:"#f4f1ea"}],go=[2831432,7035461,3817286,2763312],_o=[14726282,13145200,15780004,9264963,14264450],xc={thug:1,heavy:1.18,thrower:.95,grappler:1.12,boss:1.35},Ef=(n,e)=>{const t=n==="heavy"||n==="boss"?Hs[0]:Hs[e*7%Hs.length];return{shirt:t.shirt,pants:go[e%go.length],skin:_o[e*3%_o.length],hair:[2759958,7031338,11569744,1710618][e*5%4],print:{letters:t.letters,ink:t.ink},scale:xc[n]}};class Tf{renderer;scene=new h2;camera=new Xt(38,1,.1,200);players=[];enemies=new Map;bottles=new Map;cups=new Map;bossBar=null;fx=[];camTarget=new D;moves=new Map;blenders=new Map;overlay;constructor(e,t){this.overlay=t,this.renderer=new af({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.toneMapping=Fo,uf(this.scene),addEventListener("resize",()=>this.resize()),this.resize()}resize(){const{innerWidth:e,innerHeight:t}=window;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}motion(e,t,i){let s=this.moves.get(e);s||(s={last:{...t},distance:0,speed:0},this.moves.set(e,s));const r=Math.hypot(t.x-s.last.x,t.y-s.last.y);return s.last={...t},s.distance+=r,s.speed+=(Math.min(1,r/(i/60))-s.speed)*.25,s}blender(e){let t=this.blenders.get(e);return t||(t=new Sf,this.blenders.set(e,t)),t}posePlayer(e,t,i){t.place(e.pos,e.facing);const s=Mf(e,i,this.motion(e,e.pos,$.player.speed)),r=e.state==="attack"||e.state==="counter";t.apply(this.blender(e).next(`${e.state}:${e.combo}:${e.smash}`,s,r)),t.glow(16777215,e.state==="counter"?.25:e.state==="hitstun"&&i.frame%6<3?.4:0)}poseEnemy(e,t,i){t.place(e.pos,e.facing);const s=yf(e,i,this.motion(e,e.pos,$[e.kind].speed));t.apply(this.blender(e).next(e.state,s,e.state==="active"||e.state==="down"));const r=Xs(e);let a=0,o=16765503;r!==null&&r<=$.counter.window&&(a=.5+.3*Math.sin(i.frame*.8),o=e.unblockable?16719904:16765503),e.state==="stun"&&e.t<4&&(a=.8,o=16777215),t.glow(o,a)}burst(e,t,i,s){const r=new He(new Zt(i,12,8),new Nn({color:t,transparent:!0}));r.position.set(e.x,1.2,e.y),this.scene.add(r),this.fx.push({mesh:r,life:s,max:s,grow:2.5})}shards(e){for(let t=0;t<10;t++){const i=new He(new mn(.06,.06,.06),new Nn({color:7328623,transparent:!0}));i.position.set(e.x,1.1,e.y);const s=Math.random()*Math.PI*2;this.scene.add(i),this.fx.push({mesh:i,life:30,max:30,vel:new D(Math.cos(s)*.08,.06+Math.random()*.06,Math.sin(s)*.08)})}}clear(){for(const e of this.enemies.values())this.scene.remove(e.fig.root),e.prompt.remove(),e.bar.remove();this.enemies.clear();for(const e of this.cups.values())this.scene.remove(e.mesh),e.prompt.remove();this.cups.clear(),this.bossBar?.remove(),this.bossBar=null}screen(e,t,i){const s=new D(e,t,i).project(this.camera);return{sx:(s.x*.5+.5)*innerWidth,sy:(-s.y*.5+.5)*innerHeight}}popup(e,t){const i=document.createElement("div");i.className="popup",i.textContent=t;const{sx:s,sy:r}=this.screen(e.x,2.6,e.y);i.style.left=`${s}px`,i.style.top=`${r}px`,this.overlay.append(i),setTimeout(()=>i.remove(),900)}events(e){for(const t of e)t.type==="hit"&&this.burst(t.pos,16777215,t.heavy?.35:.22,t.heavy?10:7),t.type==="counter"&&this.burst(t.pos,16765503,.45,12),t.type==="playerHit"&&this.burst(t.pos,16728128,.3,9),t.type==="shatter"&&this.shards(t.pos),t.type==="tag"&&this.popup(t.pos,"TAG TEAM!"),t.type==="slam"&&(this.burst(t.pos,16777215,.5,12),this.popup(t.pos,"SLAM!")),t.type==="deflect"&&(this.burst(t.pos,16765503,.3,8),this.popup(t.pos,"RETURN TO SENDER"))}draw(e){e.players.forEach((l,c)=>{let u=this.players[c];if(!u){const g=new fo($t[c].look,bt.guard.frames[0]);this.scene.add(g.root);const x=document.createElement("div");x.className="nametag",x.style.setProperty("--c",$t[c].css),this.overlay.append(x),u=this.players[c]={fig:g,tag:x}}e.hitstop===0&&this.posePlayer(l,u.fig,e);const{sx:f,sy:d}=this.screen(l.pos.x,l.state==="down"?.9:2.25*$t[c].look.scale,l.pos.y);u.tag.style.transform=`translate(${f}px, ${d}px) translate(-50%, -100%)`;const m=l.state==="down"&&l.revive>0;u.tag.textContent=l.state==="grabbed"?`${$t[c].name} · MASH!`:l.state==="down"?m?`${$t[c].name} ${Math.round(l.revive/$.coop.reviveFrames*100)}%`:`${$t[c].name} · HELP`:$t[c].name,u.tag.classList.toggle("down",l.state==="down"||l.state==="grabbed")});for(let l=e.players.length;l<this.players.length;l++)this.scene.remove(this.players[l].fig.root),this.players[l].tag.remove();this.players.length=Math.min(this.players.length,e.players.length);const t=new Set;for(const l of e.enemies){t.add(l.id);let c=this.enemies.get(l.id);if(!c){const p=new fo(Ef(l.kind,l.id),bt.guard.frames[0]);this.scene.add(p.root);const h=document.createElement("div");h.className="prompt";const T=document.createElement("div");T.className="ebar",T.appendChild(document.createElement("i")),this.overlay.append(h,T),c={fig:p,prompt:h,bar:T},this.enemies.set(l.id,c)}(e.hitstop===0||l.state==="dead")&&this.poseEnemy(l,c.fig,e);const u=new D(l.pos.x,2.2*xc[l.kind]+.1,l.pos.y).project(this.camera),f=(u.x*.5+.5)*innerWidth,d=(-u.y*.5+.5)*innerHeight,m=Xs(l),g=e.players.some(p=>Po(p,l)),x=l.unblockable&&m!==null&&m<=$.counter.window;c.prompt.style.transform=`translate(${f}px, ${d}px) translate(-50%, -50%)`,c.prompt.textContent=g?"Y":x?"A":"",c.prompt.className="prompt"+(g?" counter":x?" dodge":""),c.bar.style.transform=`translate(${f}px, ${d+22}px) translate(-50%, 0)`,c.bar.style.opacity=l.state==="dead"||l.hp===l.maxHp?"0":"1",c.bar.firstChild.style.width=`${l.hp/l.maxHp*100}%`}for(const[l,c]of this.enemies)t.has(l)||(this.scene.remove(c.fig.root),c.prompt.remove(),c.bar.remove(),this.enemies.delete(l));const i=new Set;for(const l of e.cups){i.add(l.id);let c=this.cups.get(l.id);if(!c){const m=new Fn,g=new He(new ki(.1,.07,.22,12),new ri({color:13113630,roughness:.5})),x=new He(new Q1(.1,.012,6,16),new ri({color:16777215}));x.rotation.x=Math.PI/2,x.position.y=.11,m.add(g,x),this.scene.add(m);const p=document.createElement("div");p.className="prompt",this.overlay.append(p),c={mesh:m,prompt:p},this.cups.set(l.id,c)}c.mesh.position.set(l.pos.x,1.3,l.pos.y),c.mesh.rotation.x+=.35,c.mesh.rotation.z+=.2;const u=e.players.some(m=>Lo(m,l)),{sx:f,sy:d}=this.screen(l.pos.x,1.9,l.pos.y);c.prompt.style.transform=`translate(${f}px, ${d}px) translate(-50%, -50%)`,c.prompt.textContent=u?"Y":"",c.prompt.className="prompt"+(u?" counter":"")}for(const[l,c]of this.cups)i.has(l)||(this.scene.remove(c.mesh),c.prompt.remove(),this.cups.delete(l));const s=e.enemies.find(l=>l.kind==="boss"&&l.state!=="dead");s&&!this.bossBar&&(this.bossBar=document.createElement("div"),this.bossBar.className="bossbar",this.bossBar.innerHTML="<b>THE FIJI PRESIDENT</b><div><i></i></div>",this.overlay.append(this.bossBar)),this.bossBar&&(s?(this.bossBar.querySelector("i").style.width=`${s.hp/s.maxHp*100}%`,this.bossBar.classList.toggle("enraged",s.enraged)):(this.bossBar.remove(),this.bossBar=null));for(const l of e.bottles){let c=this.bottles.get(l.id);if(c||(c=new He(new ki(.07,.09,.4,10),new ri({color:4169551,roughness:.2,metalness:.1})),c.castShadow=!0,this.scene.add(c),this.bottles.set(l.id,c)),c.visible=l.state!=="broken",l.state==="held"){const u=e.players[l.holder],f={x:-u.facing.y,y:u.facing.x};c.position.set(u.pos.x+u.facing.x*.3-f.x*.4,1,u.pos.y+u.facing.y*.3-f.y*.4),c.rotation.set(0,0,0)}else if(l.state==="flying")c.position.set(l.pos.x,1.1,l.pos.y),c.rotation.x+=.5;else{const u=l.pos.x===l.home.x&&l.pos.y===l.home.y;c.position.set(l.pos.x,u?ot.obstacles.some(f=>f.kind==="planter"&&Math.abs(f.x-l.pos.x)<f.w/2&&Math.abs(f.y-l.pos.y)<f.h/2)?.8:.99:.1,l.pos.y),c.rotation.set(0,0,u?0:Math.PI/2)}}for(let l=this.fx.length-1;l>=0;l--){const c=this.fx[l];c.life--;const u=c.life/c.max;c.grow&&c.mesh.scale.setScalar(1+(1-u)*c.grow),c.vel&&(c.mesh.position.add(c.vel),c.vel.y-=.006),c.mesh.material.opacity=u,c.life<=0&&(this.scene.remove(c.mesh),this.fx.splice(l,1))}const r=e.players.filter(l=>l.state!=="down"),a=(r.length?r:e.players).reduce((l,c,u,f)=>({x:l.x+c.pos.x/f.length,y:l.y+c.pos.y/f.length}),{x:0,y:0});this.camTarget.lerp(new D(a.x*.55,0,a.y*.35),.08);const o=e.shake;this.camera.position.set(this.camTarget.x+(Math.random()-.5)*o,10.5+(Math.random()-.5)*o,this.camTarget.z+12.5),this.camera.lookAt(this.camTarget.x,1.6,this.camTarget.z-2.2),this.renderer.render(this.scene,this.camera)}}let ht=null;function Qr(){ht??=new AudioContext,ht.state==="suspended"&&ht.resume()}function wi(n,e,t){if(!ht||ht.state!=="running")return;const i=Math.floor(ht.sampleRate*n),s=ht.createBuffer(1,i,ht.sampleRate),r=s.getChannelData(0);for(let c=0;c<i;c++)r[c]=(Math.random()*2-1)*(1-c/i)**2;const a=ht.createBufferSource();a.buffer=s;const o=ht.createBiquadFilter();o.type="lowpass",o.frequency.value=e;const l=ht.createGain();l.gain.value=t,a.connect(o).connect(l).connect(ht.destination),a.start()}function Vs(n,e,t){if(!ht||ht.state!=="running")return;const i=ht.createOscillator(),s=ht.createGain();i.frequency.setValueAtTime(n,ht.currentTime),i.frequency.exponentialRampToValueAtTime(n*.4,ht.currentTime+e),s.gain.setValueAtTime(t,ht.currentTime),s.gain.exponentialRampToValueAtTime(.001,ht.currentTime+e),i.connect(s).connect(ht.destination),i.start(),i.stop(ht.currentTime+e)}const rn={hit(n){wi(n?.18:.1,n?1800:2600,.5),Vs(n?90:140,n?.25:.12,.8)},counter(){wi(.2,4e3,.4),Vs(70,.3,1)},hurt(){wi(.15,900,.6),Vs(60,.2,.9)},whiff(){wi(.12,600,.25)},dodge(){wi(.08,1200,.15)},shatter(){wi(.3,7e3,.35)}},vc=.45,bf=1200,K1=new Map;let ti=null,ni=!1;try{ni=localStorage.getItem("lastcall-muted")==="1"}catch{}function Af(n){let e=K1.get(n);return e||(e=new Audio(`./music/${n}.mp3`),e.loop=!0,e.volume=0,e.preload="auto",K1.set(n,e)),e}function xo(n,e,t){const i=n.volume,s=performance.now(),r=()=>{const a=Math.min(1,(performance.now()-s)/bf);n.volume=i+(e-i)*a,a<1?requestAnimationFrame(r):t?.()};requestAnimationFrame(r)}function Qi(n){if(n===ti)return;const e=ti?K1.get(ti):void 0;ti=n,e&&xo(e,0,()=>e.pause());const t=Af(n);t.currentTime=0,t.play().then(()=>xo(t,ni?0:vc)).catch(()=>{ti=null})}function wf(){ni=!ni;try{localStorage.setItem("lastcall-muted",ni?"1":"0")}catch{}const n=ti?K1.get(ti):void 0;return n&&(n.volume=ni?0:vc),ni}const Rf=document.querySelector("#game"),Cf=document.querySelector("#overlay"),vo=document.querySelector("#banner"),Mc=document.querySelector("#hud"),Pf=document.querySelector("#hint"),Tt=new Zc,Or=new Tf(Rf,Cf);let _t=wo(Date.now()),$1=!1,yc=0;addEventListener("pointerdown",()=>{Qr(),Qi($1?"fight":"title")});addEventListener("keydown",n=>{Qr(),n.code==="KeyM"&&Wt(wf()?"MUSIC OFF":"MUSIC ON",45)});Mc.innerHTML=$t.map((n,e)=>`
  <div class="pbar p${e+1}" style="--c:${n.css}">
    <b>${n.name}</b><div class="hp"><i></i></div><small></small>
  </div>`).join("");const Lf=[...Mc.querySelectorAll(".pbar")];function Wt(n,e=0){vo.innerHTML=n,vo.style.opacity=n?"1":"0",yc=e?_t.frame+e:1/0}Wt("LAST CALL<small>click the game, then press Start / Enter · M mutes music</small>");function Df(){const n=Tt.poll();if(!$1){const e=Tt.joiner(n);e&&(Tt.slots=[e],$1=!0,Qr(),Wt(""),Qi("fight"));return}if(_t.players.length<$t.length&&_t.result==="playing"){const e=Tt.joiner(n);e&&(Tt.slots.push(e),Ao(_t),Wt(`${$t[1].name} JOINS`,75))}if(_t.result!=="playing"&&Tt.startPressed(n)){_t=wo(Date.now(),Tt.slots.length),Or.clear(),Qi("fight"),Wt("");return}Kc(_t,_t.players.map((e,t)=>Tt.inputFor(t,n))),Or.events(_t.events);for(const e of _t.events)if(e.type==="hit"&&(rn.hit(e.heavy),e.by>=0&&Tt.rumble(e.by,e.heavy?.7:.3,.5,e.heavy?120:60)),e.type==="counter"&&(rn.counter(),Tt.rumble(e.by,1,.6,140)),e.type==="tag"&&rn.counter(),e.type==="slam"&&(rn.hit(!0),Tt.rumble(0,.8,.8,150),Tt.rumble(1,.8,.8,150)),e.type==="deflect"&&(rn.counter(),Tt.rumble(e.by,.6,.6,100)),e.type==="throw"&&rn.whiff(),e.type==="grabbed"&&(rn.hurt(),Tt.rumble(e.player,.5,1,300)),e.type==="enrage"&&Wt("HE CALLED FOR BACKUP",90),e.type==="ko"&&e.boss&&Wt("THE PRESIDENT IS DOWN",90),e.type==="playerHit"&&(rn.hurt(),Tt.rumble(e.player,1,1,200)),e.type==="playerDown"&&_t.players.length>1&&_t.result==="playing"&&Wt(`${$t[e.player].name} IS DOWN<small>stand next to them to help them up</small>`,120),e.type==="revived"&&Wt(`${$t[e.player].name} IS BACK UP`,60),e.type==="whiff"&&rn.whiff(),e.type==="dodge"&&rn.dodge(),e.type==="shatter"&&rn.shatter(),e.type==="wave"){const t=e.n===$.waves.length-1;Wt(t?"FINAL ROUND":`ROUND ${e.n+1}`,90),Qi(t?"boss":"fight")}_t.result!=="playing"&&Qi("title"),_t.result==="win"&&Wt("LAST CALL<small>Kilroy's is yours · Start / Enter to go again</small>"),_t.result==="lose"&&Wt("KNOCKED OUT<small>Start / Enter to try again</small>"),_t.frame>=yc&&Wt("")}const Mo=1e3/$.fps;let Gs=0,yo=performance.now();function Sc(n){for(Gs+=Math.min(100,n-yo),yo=n;Gs>=Mo;)Df(),Gs-=Mo;Lf.forEach((e,t)=>{const i=_t.players[t];e.classList.toggle("waiting",!i),e.querySelector("i").style.width=i?`${i.hp/$.player.hp*100}%`:"0%",e.querySelector("small").textContent=$1?i?i.state==="down"?"DOWN":"":"press any button to join":""}),Pf.textContent=Tt.isPad(0)?"X attack · Y counter · A dodge · B grab / throw":"P1: WASD · J attack · K counter · Space dodge · E bottle  |  P2: arrows · numpad 1 attack · 2 counter · 0 dodge · 3 bottle",Or.draw(_t),requestAnimationFrame(Sc)}requestAnimationFrame(Sc);window.game={get world(){return _t},T:$,controls:Tt};
