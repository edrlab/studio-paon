import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
export var XA;(function(XA){function newAddr(){return[]}XA.newAddr=newAddr
function newBd(from){if(from==null)return new XAddrBuilder
if(Array.isArray(from))return new XAddrBuilder(from.concat())
if(from instanceof Node)return new XAddrBuilder(fromNode(from))
if(from instanceof XAddrBuilder)return new XAddrBuilder(from.xa.concat())
throw"XA.newBd(from) : from unknown : "+from}XA.newBd=newBd
function from(from){return fromNode(from)}XA.from=from
function fromNode(node,root){const xa=[]
function pushXa(node){if(!node||!node.parentNode)return
pushXa(node.parentNode)
let offs=0
while(node.previousSibling){offs++
node=node.previousSibling}xa.push(offs)
if(root&&root===node.parentNode)return}if(node instanceof Attr){pushXa(node.ownerElement)
xa.push(node.nodeName)}else pushXa(node)
return xa}XA.fromNode=fromNode
function subXa(xa,depth){const end=depth>=0?depth:xa.length+depth
return xa.slice(0,end)}XA.subXa=subXa
function last(xa){return xa[xa.length-1]}XA.last=last
function isAttribute(xa){return typeof xa[xa.length-1]==="string"}XA.isAttribute=isAttribute
function offset(xa,depth){if(depth<0)depth=xa.length+depth
const offs=xa[depth]
return typeof offs==="string"?-1:offs}XA.offset=offset
function append(xa,...items){if(Object.isFrozen(xa))return xa.concat(items)
Array.prototype.push.apply(xa,items)
return xa}XA.append=append
function up(xa){if(Object.isFrozen(xa))return xa.slice(0,xa.length-1)
xa.length=xa.length-1
return xa}XA.up=up
function setAtDepth(xa,depth,newVal){if(Object.isFrozen(xa))xa=xa.concat()
if(depth>=0){xa[depth]=newVal}else{xa[xa.length+depth]=newVal}return xa}XA.setAtDepth=setAtDepth
function incrAtDepth(xa,depth,delta){if(Object.isFrozen(xa))xa=xa.concat()
if(depth<0)depth=xa.length+depth
const val=xa[depth]
if(typeof val==="number"){xa[depth]=val+delta}else throw Error(`Increment xAddr ${xa} at depth ${depth} failed.`)
return xa}XA.incrAtDepth=incrAtDepth
XA.freeze=Object.freeze
function newRangeAround(xaNode){if(xaNode.length===0)return{start:XA.freeze([0]),end:XA.freeze([1])}
const xaStart=XA.freeze(xaNode)
return{start:xaStart,end:XA.isAttribute(xaStart)?xaStart:XA.incrAtDepth(xaStart,-1,1)}}XA.newRangeAround=newRangeAround
function cloneRange(range){return range!=null?{start:range.start,end:range.end}:null}XA.cloneRange=cloneRange
function findDomContainer(xa,node){try{return findDom(xa,node,xa.length-1)}catch(e){return null}}XA.findDomContainer=findDomContainer
function findDomLast(xa,node){try{return findDom(xa,node,xa.length)}catch(e){return null}}XA.findDomLast=findDomLast
function findDom(xa,node,beforeDepth){for(let i=0;i<beforeDepth;i++){const item=xa[i]
if(typeof item==="number"){node=node.childNodes[item]}else{node=node.attributes.getNamedItem(item)}}return node}XA.findDom=findDom
function cloneFragment(from,to,range){let forkDepth=XA.findForkDepth(range.start,range.end)
if(forkDepth===range.start.length){if(forkDepth===range.end.length)return to
forkDepth--}let fromRoot=range.start[forkDepth]
const toRoot=range.end[forkDepth]
if(typeof fromRoot==="string")throw Error(`Clone fragment throw attributes not allowed: ${range.start}`)
if(typeof toRoot==="string")throw Error(`Clone fragment throw attributes not allowed: ${range.end}`)
const commonNode=XA.findDom(range.start,from,forkDepth)
if(!commonNode)return to
if(commonNode instanceof CharacterData||commonNode instanceof Attr){JML.appendText(commonNode.nodeValue.substring(fromRoot,toRoot),to)
return to}const childDepth=forkDepth+1
let ch=commonNode.childNodes.item(fromRoot)
if(ch&&childDepth<range.start.length){cloneAfter(ch,to,range.start,childDepth)
ch=ch.nextSibling
fromRoot++}while(ch&&fromRoot++<toRoot){JML.appendDomNode(ch,true,to)
ch=ch.nextSibling}if(ch&&range.end.length>childDepth){cloneBefore(ch,to,range.end,childDepth)}return to}XA.cloneFragment=cloneFragment
function cloneAfter(from,to,xa,depth){const start=xa[depth]||0
if(typeof start==="string")throw Error(`Clone fragment throw attributes not allowed: ${xa}`)
if(from instanceof CharacterData){let str=from.nodeValue
if(start<str.length){if(start>0)str=str.substring(start)
JML.appendText(str,to)}}else{const subTo=JML.appendDomNode(from,false,to)
let ch=from.childNodes.item(start)
if(ch){if(depth===xa.length-1){JML.appendDomNode(ch,true,subTo)}else{cloneAfter(ch,subTo,xa,depth+1)}ch=ch.nextSibling}while(ch){JML.appendDomNode(ch,true,subTo)
ch=ch.nextSibling}}}XA.cloneAfter=cloneAfter
function cloneBefore(from,to,xa,depth){const end=xa[depth]
if(typeof end==="string")throw Error(`Clone fragment attributes not allowed: ${xa}`)
if(from instanceof CharacterData){let str=from.nodeValue
if(end===undefined||end>0){if(end>0)str=str.substring(0,end)
JML.appendText(str,to)}}else{const subTo=JML.appendDomNode(from,false,to)
let ch=from.firstChild
let offset=0
const last=depth===xa.length-1?end-1:end===undefined?Infinity:end
while(ch&&offset++<last){JML.appendDomNode(ch,true,subTo)
ch=ch.nextSibling}if(ch){if(depth===xa.length-1){if(end>0)JML.appendDomNode(ch,true,subTo)}else{cloneBefore(ch,subTo,xa,depth+1)}}}}XA.cloneBefore=cloneBefore
function buildXpath(xa){const buf=[]
for(let i=xa.length-1;i>=0;i--){const frag=xa[i]
if(typeof frag==="number"){buf.push(`node()[${frag+1}]`)}else if(typeof frag==="string"){buf.push(`@${frag}`)}}return buf.reverse().join("/")}XA.buildXpath=buildXpath
function isEquals(xa1,xa2){if(xa1.length!==xa2.length)return false
for(let i=0;i<xa1.length;i++)if(xa1[i]!==xa2[i])return false
return true}XA.isEquals=isEquals
function isAncOrEquals(xaSup,xaSub){if(xaSup.length>xaSub.length)return false
for(let i=0;i<xaSup.length;i++)if(xaSup[i]!==xaSub[i])return false
return true}XA.isAncOrEquals=isAncOrEquals
function isAnc(xaSup,xaSub){if(xaSup.length>=xaSub.length)return false
for(let i=0;i<xaSup.length;i++)if(xaSup[i]!==xaSub[i])return false
return true}XA.isAnc=isAnc
function isBefore(xaBefore,xaAfter){const depth=Math.min(xaBefore.length,xaAfter.length)
for(let i=0;i<depth;i++){const offsBef=XA.offset(xaBefore,i)
const offsAft=XA.offset(xaAfter,i)
if(offsBef<offsAft)return true
if(offsBef>offsAft)return false}return xaBefore.length<xaAfter.length}XA.isBefore=isBefore
function isAfter(xaAfter,xaBefore){const depth=Math.min(xaBefore.length,xaAfter.length)
for(let i=0;i<depth;i++){const offsBef=XA.offset(xaBefore,i)
const offsAft=XA.offset(xaAfter,i)
if(offsBef<offsAft)return true
if(offsBef>offsAft)return false}return xaAfter.length>xaBefore.length}XA.isAfter=isAfter
function isInSameSeq(xa1,xa2){if(xa1.length!==xa2.length)return false
const lastIdx=xa1.length-1
if(typeof xa1[lastIdx]==="string"||typeof xa2[lastIdx]==="string")return false
for(let i=0;i<lastIdx;i++)if(xa1[i]!==xa2[i])return false
return true}XA.isInSameSeq=isInSameSeq
function isInSeq(xaStart,len,xaSub){if(xaStart.length>xaSub.length)return false
const lastIdx=xaStart.length-1
if(lastIdx<0)return true
for(let i=0,s=lastIdx;i<s;i++)if(xaStart[i]!==xaSub[i])return false
const start=xaStart[lastIdx]
if(typeof start==="string")throw Error(`Can not point an attr : ${xaStart}`)
const offset=xaSub[lastIdx]
if(typeof offset==="string")return false
if(xaStart.length===xaSub.length){return offset>start&&offset<start+len}else{return offset>=start&&offset<start+len}}XA.isInSeq=isInSeq
function isBeforeInSameSeq(xaBefore,xaAfter,orEqual){if(xaBefore.length!==xaAfter.length)return false
const lastIdx=xaBefore.length-1
if(typeof xaBefore[lastIdx]==="string"||typeof xaAfter[lastIdx]==="string")return false
if(orEqual?xaBefore[lastIdx]>xaAfter[lastIdx]:xaBefore[lastIdx]>=xaAfter[lastIdx])return false
for(let i=0;i<lastIdx;i++)if(xaBefore[i]!==xaAfter[i])return false
return true}XA.isBeforeInSameSeq=isBeforeInSameSeq
function isInRange(rg,xa,excludeStart,excludeEnd){if(excludeStart&&XA.isEquals(rg.start,xa))return false
if(XA.isBefore(xa,rg.start))return false
if(excludeEnd&&XA.isEquals(rg.end,xa))return false
if(XA.isBefore(rg.end,xa))return false
return true}XA.isInRange=isInRange
function translateInsSeq(xaToMove,xaInsert,len,biasBefore){if(xaToMove.length<xaInsert.length)return xaToMove
const s=xaInsert.length-1
for(let i=0;i<s;i++)if(xaInsert[i]!==xaToMove[i])return xaToMove
const offsetToMove=xaToMove[s]
if(typeof offsetToMove==="string")return xaToMove
const startIns=xaInsert[s]
if(typeof startIns==="string")return xaToMove
if(biasBefore?offsetToMove<=startIns:offsetToMove<startIns)return xaToMove
return setAtDepth(xaToMove,s,offsetToMove+len)}XA.translateInsSeq=translateInsSeq
function translateInsSeqRange(range,xaInsert,len,biasBefore){if(Object.isFrozen(range))range=cloneRange(range)
if(range.start)range.start=translateInsSeq(range.start,xaInsert,len,biasBefore)
if(range.end)range.end=translateInsSeq(range.end,xaInsert,len,biasBefore)
return range}XA.translateInsSeqRange=translateInsSeqRange
function translateDelSeq(xaToMove,xaDelStart,len,nullIfInDel){if(xaToMove.length<xaDelStart.length)return xaToMove
const s=xaDelStart.length-1
for(let i=0;i<s;i++)if(xaDelStart[i]!==xaToMove[i])return xaToMove
const offsetToMove=xaToMove[s]
const startDel=xaDelStart[s]
if(typeof startDel==="string"){if(startDel===offsetToMove)return nullIfInDel?null:xaDelStart
return xaToMove}if(typeof offsetToMove==="string")return xaToMove
if(offsetToMove<startDel)return xaToMove
if(offsetToMove<startDel+len)return nullIfInDel?null:xaDelStart
return setAtDepth(xaToMove,s,offsetToMove-len)}XA.translateDelSeq=translateDelSeq
function translateDelSeqRange(range,xaDelStart,len,nullIfInDel){if(Object.isFrozen(range))range=cloneRange(range)
if(range.start)range.start=translateDelSeq(range.start,xaDelStart,len,nullIfInDel)
if(range.end)range.end=translateDelSeq(range.end,xaDelStart,len,nullIfInDel)
return range}XA.translateDelSeqRange=translateDelSeqRange
function isCollapsed(rg){if(!rg.end)return true
return isEquals(rg.start,rg.end)}XA.isCollapsed=isCollapsed
function findForkDepth(xa1,xa2){const maxDepth=Math.min(xa1.length,xa2.length)
for(let d=0;d<maxDepth;d++)if(xa1[d]!==xa2[d])return d
return maxDepth}XA.findForkDepth=findForkDepth
function range2Seqs(range,options){let commonDepth=XA.findForkDepth(range.start,range.end)
let startDepth=range.start.length
let fromRoot=range.start[commonDepth]
const toRoot=range.end[commonDepth]
if(typeof fromRoot==="string")throw Error(`Leaf bound range can not be an attribute : ${range.start}`)
if(typeof toRoot==="string")throw Error(`Leaf bound range can not be an attribute : ${range.end}`)
const res=[]
if(startDepth-1>commonDepth){res.push({start:XA.subXa(range.start,startDepth--),len:Infinity})
while(--startDepth>commonDepth){res.push({start:XA.append(XA.subXa(range.start,startDepth),XA.offset(range.start,startDepth)+1),len:Infinity})}fromRoot++}const endDepth=range.end.length
if(endDepth>commonDepth){if(toRoot>fromRoot)res.push({start:XA.append(XA.subXa(range.start,commonDepth),fromRoot),len:toRoot-fromRoot})
else if(fromRoot===undefined)commonDepth--
if(options&&options.excludeAtts){for(let i=commonDepth+1;i<endDepth;i++){const len=XA.offset(range.end,i)
if(len>0)res.push({start:XA.append(XA.subXa(range.end,i),0),len:len})}}else{for(let i=commonDepth+1;i<endDepth;i++){res.push({start:XA.append(XA.subXa(range.end,i),-1),len:XA.offset(range.end,i)+1})}}}else if(fromRoot!==undefined){res.push({start:XA.subXa(range.start,commonDepth+1),len:toRoot-fromRoot})}return res}XA.range2Seqs=range2Seqs
function range2StartSeq(rg){if(isCollapsed(rg))return{start:rg.start,len:0}
const commonDepth=XA.findForkDepth(rg.start,rg.end)
if(commonDepth===rg.start.length)return{start:rg.start,len:0}
if(commonDepth===rg.start.length-1)return{start:rg.start,len:rg.end[commonDepth]-rg.start[commonDepth]}
return{start:rg.start,len:Infinity}}XA.range2StartSeq=range2StartSeq})(XA||(XA={}))
export class XAddrBuilder{constructor(xa=[]){this.xa=xa}append(...items){this.xa.push(...items)
return this}up(){this.xa.length=this.xa.length-1
return this}setAtDepth(depth,newVal){if(depth>=0){this.xa[depth]=newVal}else{this.xa[this.xa.length+depth]=newVal}return this}incrAtDepth(depth,delta){if(depth<0)depth=this.xa.length+depth
const val=this.xa[depth]
if(typeof val==="number"){this.xa[depth]=val+delta}else throw Error(`Increment xAddr ${this.xa} at depth ${depth} failed.`)
return this}freeze(){return XA.freeze(this.xa)}}
//# sourceMappingURL=xAddr.js.map