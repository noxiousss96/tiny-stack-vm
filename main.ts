import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
const T=`!2b%'+,0{{{{{{{{*******&***&***{***{{{{{{{{{{{{{AEEA!{{{{{{{{{{{&){{{{{{{{{{{{{{%%"%`;
function run(p,q){
const A=Int32Array,S=new A(256),C=new A(64),M=new A(256),U=new Uint8Array(65536);
let s=0,c=0,pc=0,ip=0,st=0,ol=0;
const done=e=>[U.slice(0,ol),e];
for(;;){
if(st==1e6)return done(10);
if(pc>>>0>=p.length)return done(9);
const o=p[pc],t=T.charCodeAt(o)-33;
if(o>83||t==90)return done(5);
const im=t>>4,po=t>>2&3,pu=t&3;
if(pc+im>=p.length)return done(9);
st++;const nx=pc+1+im;
if(s<po)return done(2);
if(s-po+pu>256)return done(3);
pc=nx;
if(t%16==9){
const b=S[s-1],a=S[s-2];
if(o>18&&o<23&&!b)return done(4);
s-=2;S[s++]=[a+b,a-b,Math.imul(a,b),a/b,a%b,(a>>>0)/(b>>>0),(a>>>0)%(b>>>0),0,a&b,a|b,a^b,0,a<<b,a>>b,a>>>b,0,a==b|0,a<b|0,(a>>>0)<(b>>>0)|0][o-16];
continue;
}
switch(o){
case 0:return done(0);
case 1:S[s++]=p[nx-1]<<24>>24;break;
case 2:S[s++]=p.readInt32LE(nx-4);break;
case 3:s--;break;
case 4:S[s]=S[s-1];s++;break;
case 5:[S[s-1],S[s-2]]=[S[s-2],S[s-1]];break;
case 6:S[s]=S[s-2];s++;break;
case 7:[S[s-3],S[s-2],S[s-1]]=[S[s-2],S[s-1],S[s-3]];break;
case 23:S[s-1]=-S[s-1];break;
case 27:S[s-1]=~S[s-1];break;
case 48:case 49:case 50:{const r=p.readInt16LE(nx-2),j=o-48,v=j?S[--s]:0;if(!j||(j==1)==(v==0))pc=nx+r;break;}
case 51:if(c==64)return done(7);C[c++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
case 52:if(!c)return done(8);pc=C[--c];break;
case 64:if(S[s-1]&~255)return done(6);S[s-1]=M[S[s-1]];break;
case 65:if(S[s-1]&~255)return done(6);M[S[s-1]]=S[s-2];s-=2;break;
case 80:{const b=Buffer.from(S[--s]+'');if(ol+b.length>65536)return done(11);U.set(b,ol);ol+=b.length;break;}
case 81:if(ol>>16)return done(11);U[ol++]=S[--s]&255;break;
case 82:S[s++]=q[ip++]??-1;break;
case 83:return done(S[--s]&255);
}}}
const E=process.env,I=E.MAKEFUN_INPUT_DIR??'/input',O=E.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I)){const A=I+'/'+id,B=O+'/'+id,[o,e]=run(readFileSync(A+'/program.bin'),readFileSync(A+'/input.bin'));mkdirSync(B,{recursive:true});writeFileSync(B+'/stdout.bin',o);writeFileSync(B+'/exit.txt',e+'\n');}
