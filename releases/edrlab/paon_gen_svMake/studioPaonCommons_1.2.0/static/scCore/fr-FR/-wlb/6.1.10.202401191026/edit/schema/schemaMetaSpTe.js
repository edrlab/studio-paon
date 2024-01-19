import{EGramLevelType,SkMBase,SkMCompo,SKMETALIB,SkMPart}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMeta.js"
import{SK_NS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaBuilder.js"
import{replaceXmlContent,XmlAddrMsg,XmlInsertMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{SkAnnotEltFree}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{House}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{XmlTypedState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
var IS_element=DOM.IS_element
export class SkMSpTeCompo extends SkMCompo{onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(!execOpt.resetAll&&(execOpt.autoComplete||execOpt.genAnnots))planContinuousCheck(skCtx,node)}}SKMETALIB.registerMetaNode(new SkMSpTeCompo("SpTeCompo"))
export class SkMSpTeCompoRoot extends SkMSpTeCompo{initSkRule(skRule,confRule){const v=confRule.getAttributeNS(SK_NS,"temporal")
skRule.continuousTracks=v!=null?v.split(" "):[]}getContinuousTracks(skRule){return skRule.continuousTracks}onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(!execOpt.genAnnots&&!execOpt.autoComplete)return
if(execOpt.corrections&&execOpt.corrections.length>0)return
if(execOpt.shouldRevalid&&execOpt.shouldRevalid.has(node))return
for(const track of this.getContinuousTracks(rule)){new SpTeRootContinuousTrack(track).onExecRules(skCtx,rule,node)}}getAspect(keyAspect,rule,skNode,options){if(keyAspect==="ContinuousSegMgr"&&skNode.rule===rule){if(!skNode.continuousSegMgr)skNode.continuousSegMgr=new ContinuousSegMgr(skNode,options.track)
return skNode.continuousSegMgr}return null}}SKMETALIB.registerMetaNode(new SkMSpTeCompoRoot("SpTeCompoRoot"))
export class SkMSpTeSegment extends SkMPart{onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(!execOpt.resetAll&&(execOpt.autoComplete||execOpt.genAnnots))planContinuousCheck(skCtx,node)}}SKMETALIB.registerMetaNode(new SkMSpTeSegment("SpTeSegment"))
class SkMSpTeSpatial extends SkMBase{get gramLevelType(){return EGramLevelType.metas}}SKMETALIB.registerMetaNode(new SkMSpTeSpatial("SpTeSpatial"))
class SkMSpTeSpatialShape extends SkMSpTeSpatial{initSkRule(skRule,confRule){const v=confRule.getAttributeNS(SK_NS,"shapes")
skRule.shapes=v?v.split(" "):["rect"]
skRule.coordsEltName=confRule.getAttributeNS(SK_NS,"coordsEltName")||"sc:coords"}getCoordsElt(skRule,shape){return DOM.findFirstChild(shape.parentNode,n=>n.nodeName===skRule.coordsEltName)}onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(!execOpt.resetAll&&(execOpt.autoComplete||execOpt.genAnnots)){if(execOpt.pendingRevalid.has(node)){const coordsElt=this.getCoordsElt(rule,node)
if(coordsElt&&!execOpt.pendingRevalid.has(coordsElt)){(execOpt.shouldRevalid||(execOpt.shouldRevalid=new Set)).add(coordsElt)}}}}}SKMETALIB.registerMetaNode(new SkMSpTeSpatialShape("SpTeSpatialShape"))
class SkMSpTeSpatialCoords extends SkMSpTeSpatial{initSkRule(skRule,confRule){const v=confRule.getAttributeNS(SK_NS,"shapes")
skRule.shapes=v?v.split(" "):["rect"]
skRule.shapeEltName=confRule.getAttributeNS(SK_NS,"shapeEltName")||"sc:shape"}getShapeElt(skRule,coordsElt){return DOM.findFirstChild(coordsElt.parentNode,n=>n.nodeName===skRule.shapeEltName)}getShape(skRule,coordsElt){const shapeElt=this.getShapeElt(skRule,coordsElt)
const shape=shapeElt?shapeElt.textContent:null
return skRule.shapes.indexOf(shape)>=0?shape:null}onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(execOpt.autoComplete){const shapeElt=this.getShapeElt(rule,node)
if(shapeElt===null)return
let shape=shapeElt.textContent
if(!shape||rule.shapes.indexOf(shape)<0){shape=rule.shapes[0]
execOpt.corrections.push(replaceXmlContent(shapeElt,[shape]))}const coords=node.textContent
if(!coords||!this.isCoordsValid(shape,coords)){const x=Math.floor(Math.random()*100)+200
const y=Math.floor(Math.random()*100)+200
let coords
if(shape==="rect"){coords=`${x},${y},${x+200},${y+100}`}else if(shape==="circle"){coords=`${x},${y},100`}else if(shape=="ellipse"){coords=`${x},${y},100,50`}else{coords=`${x},${y},${x+200},${y},${x+100},${y+100}`}execOpt.corrections.push(replaceXmlContent(node,[coords]))}}else if(execOpt.genAnnots){const shape=this.getShape(rule,node)
if(!shape){skCtx.addAnnot((new SkAnnotEltFree).init(node,"La forme de cette zone est invalide"))}else if(!this.isCoordsValid(shape,node.textContent)){skCtx.addAnnot((new SkAnnotEltFree).init(node,"La définition de cette zone est invalide"))}}}isCoordsValid(shape,coords){return true}}SKMETALIB.registerMetaNode(new SkMSpTeSpatialCoords("SpTeSpatialCoords"))
function planContinuousCheck(skCtx,node){const schemaDom=skCtx.skNode.schemaDom
let parent=node
while(parent){const compoRootNode=DOM.findParent(parent,null,n=>{const skRule=schemaDom.getSkNode(n).rule
return skRule.skMeta instanceof SkMSpTeCompoRoot})
if(compoRootNode){const execOpt=skCtx.execOptions;(execOpt.shouldRevalid||(execOpt.shouldRevalid=new Set)).add(compoRootNode)}parent=compoRootNode}}export class SkMSpTeContinuous extends SkMBase{get gramLevelType(){return EGramLevelType.metas}initSkRule(skRule,confRule){skRule.track=confRule.getAttributeNS(SK_NS,"track")||""}getTrack(skNode){return skNode.rule.track}onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(!execOpt.resetAll&&(execOpt.autoComplete||execOpt.genAnnots))planContinuousCheck(skCtx,node)}}SKMETALIB.registerMetaNode(new SkMSpTeContinuous("SpTeContinuous"))
class SkMSpTeTime extends SkMBase{get gramLevelType(){return EGramLevelType.metas}onExecRules(skCtx,rule,node){const execOpt=skCtx.execOptions
if(execOpt.resetAll){if(execOpt.importCtx&&execOpt.autoMutate){const v=node.textContent
if(v&&v.charAt(0)!=="-"){const txtNode=DOM.findFirstChild(node,DOM.IS_text)
if(DEBUG_SPTE)console.log("SkMSpTeTime fuzzy value : ",v,node.parentNode.parentNode.cloneNode(true));(execOpt.mutations||(execOpt.mutations=[])).push((new XmlInsertMsg).init(XA.append(XA.from(txtNode),0),"-"))}}return}if(execOpt.autoComplete||execOpt.genAnnots){const schemaDom=skCtx.skNode.schemaDom
let track
let n=node.parentElement
do{const skNode=schemaDom.getSkNode(n)
const skMeta=skNode.rule.skMeta
if(skMeta instanceof SkMSpTeContinuous){track=skMeta.getTrack(skNode)
break}n=n.parentElement
if(!n)return}while(true)
const compoRootNode=DOM.findParent(n.parentElement,null,n=>{const skRule=schemaDom.getSkNode(n).rule
return skRule.skMeta instanceof SkMSpTeCompoRoot&&skRule.skMeta.getContinuousTracks(skRule).indexOf(track)>=0})
if(compoRootNode){(execOpt.shouldRevalid||(execOpt.shouldRevalid=new Set)).add(compoRootNode)}}}}class SkMSpTeStart extends SkMSpTeTime{}SKMETALIB.registerMetaNode(new SkMSpTeStart("SpTeStart"))
class SkMSpTeEnd extends SkMSpTeTime{}SKMETALIB.registerMetaNode(new SkMSpTeEnd("SpTeEnd"))
class SpTeRootContinuousTrack{constructor(track){this.track=track}onExecRules(skCtx,rule,node){const execOpts=skCtx.execOptions
const seg=buildContinuousSeg(this.track,skCtx.skNode.schemaDom,node)
if(!seg)return
const contMgr=skCtx.skNode.continuousSegMgr
const streamEnd=contMgr?contMgr._duration:undefined
const countNextSeg=seg._countNextSeg()
minOptimalSegDur=streamEnd>0?Math.min(1,round(streamEnd/countNextSeg)):1
try{if(seg.checkTree(0,streamEnd))return
if(execOpts.autoComplete){if(DEBUG_SPTE)console.log("SpTeRootContinuousTrack fixFuzzyBoundaries:::",this.track,node.cloneNode(true))
if(!seg.fixFuzzyBoundaries(execOpts.corrections,[seg],streamEnd)){if(DEBUG_SPTE)console.log("SpTeRootContinuousTrack checkBoundaries:::",this.track,node.cloneNode(true))
if(streamEnd>0)seg.fixEndStream(execOpts.corrections,streamEnd)
seg.checkBoundaries(execOpts.corrections,0,countNextSeg,streamEnd,countNextSeg,streamEnd)
if(streamEnd>0){const endReal=getEndLine(seg).endValue
if(endReal>streamEnd){if(DEBUG_SPTE)console.log("Force duration from",contMgr._duration,"to",endReal)
contMgr._duration=endReal}}}}else if(execOpts.genAnnots){skCtx.addAnnot((new SkAnnotEltFree).init(node,"La continuité temporelle des segments n\'est pas correcte."))}}finally{minOptimalSegDur=1}}}class ContinuousSeg{constructor(startNode,endNode,previous){this.startNode=startNode
this.endNode=endNode
this.countSeg=1
this.startValue=parseFloat(startNode.textContent)
if(Number.isNaN(this.startValue)||!Object.is(Math.abs(this.startValue),this.startValue)){this.startValue=Math.abs(this.startValue)
this.startFuzzy=true}this.endValue=parseFloat(endNode.textContent)
if(Number.isNaN(this.endValue)||!Object.is(Math.abs(this.endValue),this.endValue)){this.endValue=Math.abs(this.endValue)
this.endFuzzy=true}if(previous)previous.next=this}checkTree(start,endLine){if(this.startValue!==start)return false
if(this.endValue-this.startValue>this._getMinDuration()){if(this.firstCh&&!this.firstCh.checkTree(start,this.endValue))return false
if(this.next){if(!this.next.checkTree(this.endValue,endLine))return false}else{if(endLine!==undefined&&this.endValue!==endLine)return false}return true}return false}fixEndStream(msgs,streamEnd){let seg=this
let needFix=false
while(seg){if(!seg.endValue||seg.endValue>streamEnd){needFix=true
if(seg.startValue>=streamEnd)seg.startFuzzy=true
if(!seg.next)seg.setEndRecurs(msgs,streamEnd)
else seg.endFuzzy=true
seg.forceFuzzyChildren()}else{if(!seg.next&&seg.endValue<streamEnd)seg.setEndRecurs(msgs,streamEnd)}seg=seg.next}if(needFix)this.fixFuzzyBoundaries(msgs,[this],streamEnd)}forceFuzzyChildren(){let ch=this.firstCh
if(!ch)return
while(ch){ch.startFuzzy=ch===this.firstCh?this.startFuzzy:true
ch.endFuzzy=ch===this.lastCh?this.endFuzzy:true
ch.forceFuzzyChildren()
ch=ch.next}}checkBoundaries(msgs,start,lineCountNextSeg,parentEnd,streamCountNextSeg,streamEnd){let seg=this
const stackCh=[]
while(seg){stackCh.push(seg)
seg.setStart(msgs,start)
seg=seg.firstCh}for(let i=stackCh.length-1;i>=0;i--){seg=stackCh[i]
seg.setEnd(msgs,seg._computeEnd(lineCountNextSeg,parentEnd,streamCountNextSeg,streamEnd))
const next=seg.next
if(next){const lineParentEnd=i===0?parentEnd:stackCh[i-1].endValue
next.checkBoundaries(msgs,seg.endValue,lineCountNextSeg-seg.countSeg,lineParentEnd,streamCountNextSeg-seg.countSeg,streamEnd)}}}_computeEnd(lineCountNextSeg,parentEnd,streamCountNextSeg,streamEnd){if(this.lastCh)return this.lastCh.endValue
let end=this.endValue
if(!end||end-this.startValue<minOptimalSegDur){let firstNextValid=this.next
let count=1
while(firstNextValid&&!firstNextValid.startValue){count+=firstNextValid.countSeg
firstNextValid=firstNextValid.next}if(firstNextValid){end=round(this.startValue+Math.max((firstNextValid.startValue-this.startValue)/count,minOptimalSegDur))}else if(parentEnd){end=round(this.startValue+Math.max((parentEnd-this.startValue)/lineCountNextSeg,minOptimalSegDur))}else{end=minOptimalSegDur}}if(streamEnd){if(streamEnd-end<(streamCountNextSeg-1)*minOptimalSegDur){end=round(this.startValue+Math.max((streamEnd-this.startValue)/streamCountNextSeg,minSegDur))}}return end}addSubTimeLine(subTimeLine){this.firstCh=subTimeLine
this.countSeg=subTimeLine.countSeg
let last=subTimeLine
while(last.next){last=last.next
this.countSeg+=last.countSeg}this.lastCh=last}fixFuzzyBoundaries(msgs,ancestors,streamEnd){if(this.startFuzzy||this.endFuzzy){this._fixBoundariesFromNeighbours(msgs,ancestors,streamEnd)
return true}else{let fixed=false
if(this.next&&this.next.fixFuzzyBoundaries(msgs,ancestors,streamEnd))fixed=true
if(this.firstCh){ancestors.push(this)
if(this.firstCh.fixFuzzyBoundaries(msgs,ancestors,streamEnd))fixed=true
ancestors.length--}return fixed}}_fixBoundariesFromNeighbours(msgs,ancestors,streamEnd){const prev=this._getPrevious(getStartLine(ancestors))
let start=prev?prev.endValue:ancestors.length>1?ancestors[ancestors.length-1].startValue:0
const segToFix=[this]
const minDur=this._getMinDuration()
let minDurAll=minDur
let curr=this
let next=this.next
while(next&&next.startFuzzy){segToFix.push(next)
minDurAll+=next._getMinDuration()
curr=next
next=next.next}let end=limitEnd(next?next.startValue:ancestors.length>1?ancestors[ancestors.length-1].endValue:streamEnd!==undefined?streamEnd:start+minDur,streamEnd)
let preserveValues=false
let ancToMove=this.isFuzzyLogicMoveBeforeUp(segToFix,ancestors)
if(ancToMove){ancToMove.setEndRecurs(msgs,segToFix[segToFix.length-1].endValue)
preserveValues=true}else if(ancToMove=this.isFuzzyLogicMoveBeforeRoot(segToFix,ancestors)){ancToMove.setStartRecurs(msgs,segToFix[segToFix.length-1].endValue)
preserveValues=true}else if(ancToMove=this.isFuzzyLogicMoveAfterUp(segToFix,ancestors)){ancToMove.setStartRecurs(msgs,segToFix[0].startValue)
preserveValues=true}else if(ancToMove=this.isFuzzyLogicMoveAfterRoot(segToFix,ancestors)){ancToMove.setEndRecurs(msgs,segToFix[0].startValue)
preserveValues=true}function fixEnd(seg,segEnd){segEnd=limitEnd(segEnd,streamEnd)
seg.setEnd(msgs,segEnd)
if(seg.next)seg.next.setStart(msgs,segEnd)
if(seg.firstCh){ancestors.push(seg)
seg.firstCh._fixBoundariesFromNeighbours(msgs,ancestors,streamEnd)
ancestors.length--}}if(preserveValues){this.setStart(msgs,start)
for(const seg of segToFix)fixEnd(seg,seg.endValue)}else{if(end<start+minDur){if(next){let smallestNext=next
while(smallestNext.firstCh)smallestNext=smallestNext.firstCh
const delta=(smallestNext.endValue-smallestNext.startValue-minDurAll)/(segToFix.length+1)
if(delta>0){end=round(end+delta*segToFix.length)
this.setStart(msgs,start)}}else if(prev){let smallestPrev=prev
while(smallestPrev.lastCh)smallestPrev=smallestPrev.lastCh
const delta=(smallestPrev.endValue-smallestPrev.startValue-minDurAll)/(segToFix.length+1)
if(delta>0){start=round(start-delta*segToFix.length)
prev.setEndRecurs(msgs,start)}}else{this.setStart(msgs,start)}}else{this.setStart(msgs,start)}const durToDistrib=Math.max(0,(end-start-minDurAll)/segToFix.length)
for(const seg of segToFix)fixEnd(seg,round(seg.startValue+seg._getMinDuration()+durToDistrib))}}isFuzzyLogicMoveBeforeUp(segToFix,ancestors){let anc=ancestors[ancestors.length-1]
if(!anc)return null
const firstSeg=segToFix[0]
const lastSeg=segToFix[segToFix.length-1]
if(!lastSeg.next&&firstSeg.startValue===anc.endValue){let i=ancestors.length-2
while(i>=1&&!anc.next)anc=ancestors[i--]
return anc}return null}isFuzzyLogicMoveBeforeRoot(segToFix,ancestors){if(ancestors.length>1)return null
const firstSeg=segToFix[0]
const lastSeg=segToFix[segToFix.length-1]
if(lastSeg.next&&firstSeg.startValue===lastSeg.next.startValue)return lastSeg.next
return null}isFuzzyLogicMoveAfterUp(segToFix,ancestors){let anc=ancestors[ancestors.length-1]
if(!anc)return null
const firstSeg=segToFix[0]
const lastSeg=segToFix[segToFix.length-1]
if(!firstSeg._getPrevious(getStartLine(ancestors))&&lastSeg.endValue===anc.startValue){for(let i=ancestors.length-2;i>=1&&ancestors[i].startValue===lastSeg.endValue;i--)anc=ancestors[i]
return anc}return null}isFuzzyLogicMoveAfterRoot(segToFix,ancestors){if(ancestors.length>1)return null
const firstSeg=segToFix[0]
const lastSeg=segToFix[segToFix.length-1]
const prev=firstSeg._getPrevious(getStartLine(ancestors))
if(prev&&lastSeg.endValue===prev.startValue)return prev
return null}setStart(msgs,start,startStr){if(this.startValue===start&&!this.startFuzzy)return
if(this.startMsgOffset===undefined)this.startMsgOffset=msgs.length
msgs[this.startMsgOffset]=replaceXmlContent(this.startNode,[startStr||start.toFixed(3)])
if(DEBUG_SPTE)console.log("SET start for segment: ",XA.from(this.startNode.parentElement.parentElement),this.startValue,"->",start,startStr)
this.startValue=start
if(this.startFuzzy)this.startFuzzy=false}setStartRecurs(msgs,start){const str=start.toFixed(3)
let seg=this
while(seg){seg.setStart(msgs,start,str)
seg=seg.firstCh}}setEnd(msgs,end,endStr){if(this.endValue===end&&!this.endFuzzy)return
if(this.endMsgOffset===undefined)this.endMsgOffset=msgs.length
msgs[this.endMsgOffset]=replaceXmlContent(this.endNode,[endStr||end.toFixed(3)])
if(DEBUG_SPTE)console.log("SET end for segment: ",XA.from(this.endNode.parentElement.parentElement),this.endValue,"->",end,endStr)
this.endValue=end
if(this.endFuzzy)this.endFuzzy=false}setEndRecurs(msgs,end){const str=end.toFixed(3)
let seg=this
while(seg){seg.setEnd(msgs,end,str)
if(seg.next){seg.next.setStart(msgs,end,str)
let nextCh=seg.next.firstCh
while(nextCh){nextCh.setStart(msgs,end,str)
nextCh=nextCh.firstCh}}seg=seg.lastCh}}_getPrevious(startLine){if(startLine===this)return null
let p=startLine
while(p&&p.next!==this)p=p.next
return p}_getMinDuration(){return minOptimalSegDur*this.countSeg}_countNextSeg(){let c=0
for(let s=this;s;s=s.next)c+=s.countSeg
return c}forceEnd(temporalElt,value,ancestors,msgs,forInsertAfter){if(this.endNode.parentNode===temporalElt){if(forInsertAfter){this.setEnd(msgs,value)
if(this.lastCh)this.lastCh.setEndRecurs(msgs,value)}else{let anc=this
let i=ancestors.length-1
while(!anc.next&&i>=1)anc=ancestors[i--]
anc.setEndRecurs(msgs,value)}return true}if(this.next&&this.next.forceEnd(temporalElt,value,ancestors,msgs,forInsertAfter))return true
if(this.firstCh){ancestors.push(this)
if(this.firstCh.forceEnd(temporalElt,value,ancestors,msgs,forInsertAfter))return true
ancestors.length--}return false}forceStart(temporalElt,value,ancestors,msgs,forInsertBefore){if(this.startNode.parentNode===temporalElt){if(forInsertBefore){this.setStartRecurs(msgs,value)}else{let prev=this._getPrevious(getStartLine(ancestors))
if(!prev){ancestors=ancestors.concat()
while(!prev&&ancestors.length>1){const anc=ancestors[ancestors.length-1]
ancestors.length--
prev=anc._getPrevious(getStartLine(ancestors))}}return prev?prev.forceEnd(temporalElt,value,ancestors,msgs,false):false}}if(this.next&&this.next.forceStart(temporalElt,value,ancestors,msgs,forInsertBefore))return true
if(this.firstCh){ancestors.push(this)
if(this.firstCh.forceStart(temporalElt,value,ancestors,msgs,forInsertBefore))return true
ancestors.length--}return false}}function limitEnd(end,endStream){return Math.max(0,endStream==undefined?end:Math.min(end,endStream))}function buildContinuousSeg(track,schemaDom,compo){let firstSeg
let seg
for(let ch=compo.firstElementChild;ch;ch=ch.nextElementSibling){const skNode=schemaDom.getSkNode(ch)
const skMeta=skNode.rule.skMeta
if(skMeta instanceof SkMSpTeSegment){const eltCont=DOM.findFirstChild(ch,n=>{if(!IS_element(n))return false
const skNodeCont=schemaDom.getSkNode(n)
const skMetaCont=skNodeCont.rule.skMeta
return skMetaCont instanceof SkMSpTeContinuous&&skMetaCont.getTrack(skNodeCont)===track})
if(eltCont){const eltStart=DOM.findFirstChild(eltCont,n=>{if(!IS_element(n))return false
return schemaDom.getSkNode(n).rule.skMeta instanceof SkMSpTeStart})
const eltEnd=DOM.findFirstChild(eltCont,n=>{if(!IS_element(n))return false
return schemaDom.getSkNode(n).rule.skMeta instanceof SkMSpTeEnd})
if(eltStart&&eltEnd){seg=new ContinuousSeg(eltStart,eltEnd,seg)
if(!firstSeg)firstSeg=seg
const eltSubCompo=DOM.findFirstChild(ch,n=>{if(!IS_element(n))return false
const rule=schemaDom.getSkNode(n).rule
if(!(rule.skMeta instanceof SkMSpTeCompo))return false
if(rule.skMeta instanceof SkMSpTeCompoRoot){if(rule.skMeta.getContinuousTracks(rule).indexOf(track)>=0)return false}return true})
if(eltSubCompo){const subTimeLine=buildContinuousSeg(track,schemaDom,eltSubCompo)
if(subTimeLine)seg.addSubTimeLine(subTimeLine)}}}}}return firstSeg}function getStartLine(ancestors,offset=ancestors.length-1){return offset===0?ancestors[0]:ancestors[offset].firstCh}function getEndLine(from){while(from.next)from=from.next
return from}function round(v){return Math.round(v*1e3)/1e3}class SetDurationMsg extends XmlAddrMsg{get isBodyMutator(){return true}init(start,end){throw Error("do not use")}initDur(spTeCompoRoot,oldDur,newDur){this.oldDur=oldDur
this.newDur=newDur
this.setMeta("autoCorrect",true)
return super.init(spTeCompoRoot)}invert(){return(new SetDurationMsg).initDur(this.addr,this.newDur,this.oldDur)}applyUpdates(state){if(this.addr&&state instanceof XmlTypedState){const schemaDom=state.schemaDom
const spTeRootNode=XA.findDomLast(this.addr,schemaDom.nodeRoot)
const skNode=schemaDom.getSkNode(spTeRootNode)
const skMeta=skNode.rule.skMeta
if(skMeta.id==="SpTeCompoRoot"){const mgr=skMeta.getAspect("ContinuousSegMgr",skNode.rule,skNode,{track:""})
mgr._duration=this.newDur}}}}SetDurationMsg.type="setDur"
House.MSG_FACTORYREG.register(SetDurationMsg)
export class ContinuousSegMgr{constructor(skNode,track){this.skNode=skNode
this.track=track}forceStart(xaTemporalSeg,time,forInsertBefore){const temporalElt=XA.findDomLast(xaTemporalSeg,this.skNode.node.ownerDocument)
if(!DOM.IS_element(temporalElt))return null
const seg=buildContinuousSeg(this.track,this.skNode.schemaDom,this.skNode.node)
const result=[]
seg.forceStart(temporalElt,time,[seg],result,forInsertBefore)
if(DEBUG_SPTE)console.log("ContinuousSegMgr forceStart:: ",this._duration,result)
return result}forceEnd(xaTemporalSeg,time,forInsertAfter){const temporalElt=XA.findDomLast(xaTemporalSeg,this.skNode.node.ownerDocument)
if(!DOM.IS_element(temporalElt))return null
const seg=buildContinuousSeg(this.track,this.skNode.schemaDom,this.skNode.node)
const result=[]
seg.forceEnd(temporalElt,time,[seg],result,forInsertAfter)
if(DEBUG_SPTE)console.log("ContinuousSegMgr forceEnd:: ",this._duration,result)
return result}needFixDuration(durInS){if(this._duration!==round(durInS))return true
if(this._duration>0){const seg=buildContinuousSeg(this.track,this.skNode.schemaDom,this.skNode.node)
if(seg)return!seg.checkTree(0,this._duration)}return false}setDuration(durInS,tolerance){if(durInS>minSegDur){durInS=round(durInS)
const old=this._duration
const seg=buildContinuousSeg(this.track,this.skNode.schemaDom,this.skNode.node)
if(!seg){this._duration=durInS
return null}if(tolerance>0&&this._duration>0&&Math.abs(this._duration-durInS)<=tolerance)durInS=this._duration
const minTech=seg._countNextSeg()*minSegDur
if(durInS<minTech)durInS=minTech
this._duration=durInS
const msgs=[]
seg.fixEndStream(msgs,this._duration)
if(msgs.length===0)return null
if(DEBUG_SPTE)console.log("ContinuousSegMgr setDuration:: ",this._duration,msgs)
msgs.push((new SetDurationMsg).initDur(XA.from(this.skNode.node),old,this._duration))
return msgs}else{this._duration=undefined
return null}}}export const minSegDur=.001
export let minOptimalSegDur=1
const DEBUG_SPTE=false

//# sourceMappingURL=schemaMetaSpTe.js.map