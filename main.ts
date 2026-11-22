// Tiny stack VM: a correct, compact interpreter of make.fun's tiny stack ISA v1.
// For each /input/<id>/{program.bin,input.bin} writes /output/<id>/{stdout.bin,exit.txt}.
// T packs each opcode 0x00..0x53 as imm*16+pops*4+pushes, +33; 90 marks an opcode the ISA does not name.
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const T=`!2b%'+,0{{{{{{{{*******&***&***{***{{{{{{{{{{{{{AEEA!{{{{{{{{{{{&){{{{{{{{{{{{{{%%"%"`;
function run(p,q){
const S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),U=new Uint8Array(65536);
let s=0,c=0,pc=0,ip=0,st=0,ol=0;const E=new TextEncoder();
const done=e=>[U.slice(0,ol),e];
for(;;){
if(st===1e6)return done(10);
if(pc<0||pc>=p.length)return done(9);
const o=p[pc],t=T.charCodeAt(o)-33;
if(o>0x53||t===90)return done(5);
const im=t>>4,po=(t>>2)&3,pu=t&3;
if(pc+im>=p.length)return done(9);
st++;const nx=pc+1+im;
if(s<po)return done(2);
if(s-po+pu>256)return done(3);
pc=nx;
if(o>=0x10&&o<=0x22&&o!==0x17&&o!==0x1b&&o!==0x1f){
const b=S[s-1],a=S[s-2];
if(o>0x12&&o<0x17&&!b)return done(4);
s-=2;S[s++]=[(a+b)|0,(a-b)|0,Math.imul(a,b),(a/b)|0,(a%b)|0,Math.floor((a>>>0)/(b>>>0))|0,((a>>>0)%(b>>>0))|0,0,a&b,a|b,a^b,0,a<<(b&31),a>>(b&31),(a>>>(b&31))|0,0,a===b?1:0,a<b?1:0,(a>>>0)<(b>>>0)?1:0][o-16];
continue;
}
switch(o){
case 0:return done(0);
case 1:S[s++]=(p[nx-1]<<24)>>24;break;
case 2:S[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
case 3:s--;break;
case 4:S[s]=S[s-1];s++;break;
case 5:{const x=S[s-1];S[s-1]=S[s-2];S[s-2]=x;break;}
case 6:S[s]=S[s-2];s++;break;
case 7:{const a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a;break;}
case 0x17:S[s-1]=-S[s-1]|0;break;
case 0x1b:S[s-1]=~S[s-1];break;
case 0x30:case 0x31:case 0x32:{const r=((p[nx-2]|p[nx-1]<<8)<<16)>>16;let k=o===0x30;if(o!==0x30){const v=S[--s];k=o===0x31?v===0:v!==0;}if(k)pc=nx+r;break;}
case 0x33:if(c===64)return done(7);C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
case 0x34:if(!c)return done(8);pc=C[--c];break;
case 0x40:{const a=S[s-1];if(a<0||a>255)return done(6);S[s-1]=M[a];break;}
case 0x41:{const a=S[s-1],v=S[s-2];if(a<0||a>255)return done(6);s-=2;M[a]=v;break;}
case 0x50:{const b=E.encode(String(S[s-1]));if(ol+b.length>65536)return done(11);s--;U.set(b,ol);ol+=b.length;break;}
case 0x51:if(ol+1>65536)return done(11);U[ol++]=S[--s]&255;break;
case 0x52:S[s++]=ip<q.length?q[ip++]:-1;break;
case 0x53:return done(S[--s]&255);
}}}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
const[o,e]=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
mkdirSync(join(O,id),{recursive:true});writeFileSync(join(O,id,'stdout.bin'),o);writeFileSync(join(O,id,'exit.txt'),e+'\n');
}
