const vm=require('vm'),fs=require('fs'),assert=require('assert');
const elements=new Map();function element(){return {textContent:'',hidden:false,open:false,style:{},classList:{add(){}},getContext(){return {}},addEventListener(){},append(){},close(){this.open=false},showModal(){this.open=true}}}const document={getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelector:()=>element(),createElement:()=>element(),body:element(),addEventListener(){}};
const context=vm.createContext({document,window:{addEventListener(){}},requestAnimationFrame(){},setTimeout(){return 1},clearTimeout(){},console,assert});
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../game.js'),'utf8')+`
function step(){assert(move);px=move.tx;py=move.ty;move=null;arrive()}
assert.equal(visited.size,0);assert.equal(distances.size,97);reset();let guard=0;while(state==='moving'&&guard++<200)step();assert.equal(state,'choice');assert(!options.includes(2));assert(visited.size>1);const junction=[x,y];
// Traverse the tree to the exit, checking every automatic segment and later reverse option.
function pathTo(tx,ty){let q=[[x,y,[]]],seen=new Set();for(let i=0;i<q.length;i++){let [a,b,path]=q[i];if(a===tx&&b===ty)return path;seen.add(a+','+b);for(const p of neighbors(a,b))if(!seen.has(p.x+','+p.y))q.push([p.x,p.y,[...path,p.d]])}}
const dead=queue.find(([a,b])=>neighbors(a,b).length===1&&(a!==1||b!==1)&&(a!==exit[0]||b!==exit[1]));
function travel(target){let count=0;while((x!==target[0]||y!==target[1])&&count++<500){if(state==='moving')step();else if(state==='choice'){let d=pathTo(...target)[0];selected=(d-heading+4)%4;assert(options.includes(selected));confirm()}else throw Error(state)}assert(count<500)}
travel(dead);assert.equal(state,'encounter');resolveEncounter(true);assert.equal(state,'moving');while(state==='moving')step();assert.equal(state,'choice');assert(options.includes(2));travel(exit);assert.equal(state,'portal');reset();assert.equal(x,1);assert.equal(y,1);travel(dead);assert.equal(state,'encounter');resolveEncounter(false);assert.equal(x,1);assert.equal(y,1);assert.equal(state,'moving');toggleMap();assert($('mapDialog').open);toggleMap();assert(!$('mapDialog').open);console.log('PASS: first-junction restriction, traversable maze, dead-end win/lose, portal reset, map toggle.');
`,context);
