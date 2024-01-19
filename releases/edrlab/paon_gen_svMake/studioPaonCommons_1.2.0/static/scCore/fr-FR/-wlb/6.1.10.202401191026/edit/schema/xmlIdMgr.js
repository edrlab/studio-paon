class XmlIdMgr{constructor(){this.map=new Map}onStartValid(options){var _a,_b
if(options.genAnnots){if(options.resetAll){this.map.clear()}else{for(const[id,atts]of this.map){if(Array.isArray(atts)){for(let i=0;i<atts.length;i++){const att=atts[i]
if(att.nodeValue!==id||!((_a=att.ownerElement)===null||_a===void 0?void 0:_a.isConnected))atts.splice(i--,1)}if(atts.length===0){this.map.delete(id)}else if(atts.length===1){const att=atts[0]
this.map.set(id,att);(options.shouldRevalid||(options.shouldRevalid=new Set)).add(att.ownerElement)}}else{if(atts.nodeValue!==id||!((_b=atts.ownerElement)===null||_b===void 0?void 0:_b.isConnected))this.map.delete(id)}}}}}updateMap(id,fromAtt,skCtx,abortIfConflict){let ref=this.map.get(id)
if(ref===undefined){this.map.set(id,fromAtt)
return}if(Array.isArray(ref)){let found=ref.indexOf(fromAtt)
if(found===0&&ref.length===1){this.map.set(id,fromAtt)
return}else if(found===-1&&!abortIfConflict){ref.push(fromAtt)}}else if(ref===fromAtt){return}else{const execOpt=skCtx.execOptions;(execOpt.shouldRevalid||(execOpt.shouldRevalid=new Set)).add(ref.ownerElement)
if(!abortIfConflict){ref=[ref,fromAtt]
this.map.set(id,ref)}}return"conflict"}generateId(createdIds){let start=FIRSTCHARS.charAt(Math.floor(Math.random()*FIRSTCHARS.length))
let next=Math.floor(Math.random()*NEXTCHARS.length)
let id=start+NEXTCHARS[next]
while(this.map.has(id)||createdIds.has(id)){const tested=next
if(++next===NEXTCHARS.length)next=0
while(tested!==next){id=start+NEXTCHARS[next]
if(!this.map.has(id)&&!createdIds.has(id))return id
if(++next===NEXTCHARS.length)next=0}start+=NEXTCHARS[tested]
next=Math.floor(Math.random()*NEXTCHARS.length)
id=start+NEXTCHARS[next]}return id}}const FIRSTCHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NEXTCHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
export const crossDomMgrFactory=config=>()=>new XmlIdMgr

//# sourceMappingURL=xmlIdMgr.js.map