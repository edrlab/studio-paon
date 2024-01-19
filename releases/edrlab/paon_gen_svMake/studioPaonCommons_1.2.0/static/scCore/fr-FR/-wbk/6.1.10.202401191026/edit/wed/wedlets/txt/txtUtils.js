import{TxtOLModel,TxtRoot,TxtRootStr,TxtSLModel,TxtULModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txt.js"
import{TXTTABLE}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTable.js"
import{InlWrap,TxtBlock,TxtCaption,TxtCell,TxtElement,TxtParaLike,TxtParaParent,TxtRow,TxtStr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtTags.js"
import{IS_EltWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{WEDLET_SINGLEELT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
export const BOUND_CHAR="​"
export const BOUND_CHARS="​​"
export const IS_TxtElement=function(elt){return elt instanceof TxtElement||elt instanceof TxtCell}
export const IS_TxtBlock=function(elt){return elt instanceof TxtBlock||elt instanceof TxtCell}
export const IS_TxtParaParent=function(elt){return elt instanceof TxtParaParent||elt instanceof TxtCell}
export const IS_TxtElementReal=function(n){return IS_TxtElement(n)&&!n.isVirtual()}
export const IS_TxtStr=function(n){return n instanceof TxtStr}
export const IS_TxtStrReal=function(n){return n instanceof TxtStr&&!n.isVirtual()}
export const IS_TxtRoot=function(n){return n instanceof TxtRoot}
export function isTxtWrapElt(n){return n.isTxtWrapElt}export const cellSpanMgrDefault={refreshSpan(){},isRowSpanAvailable(){return false},isColSpanAvailable(){return false}}
export function findOrCreateTxtStr_inline(last){let ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)
if(!ch){console.trace("CreateOnTheFly: display content")
this.onChildWedletsChange()
ch=last?findTxtEltLastChild(this):findTxtEltFirstChild(this)}if(!(ch instanceof TxtStr)){return ch.findOrCreateCaretableSibling(!last)}return ch}export function merge_none(next,batch){return false}export function merge_elts(next,batch){if(!next||!this.isMergeable(next))return false
if(next.isVirtual()){if(next.mustKeepAsVirtual()){const parent=findTxtEltParent(next)
const toDel=parent?parent.onChildDeletedByCaret(next):null
if(toDel){batch.deleteSequence(toDel.wedAnchor,1)
return true}this.setCaretIn(this.txtRoot.selMgr,false)
return false}this.setCaretIn(this.txtRoot.selMgr,false)
next.remove()
return true}const parent=findTxtEltParent(next)
const toDel=parent?parent.onChildDeletedByCaret(next):null
batch.deleteSequence((toDel||next).wedAnchor,1)
const content=next.exportContent()
if(this.isVirtual()){WEDLET.insertDatasFromDisplay(this,batch,content)
this.setCaretIn(this.txtRoot.selMgr,true)}else{if(JML.isText(content[0])){const last=findTxtEltLastChild(this)
if(last instanceof TxtStr&&!last.isVirtual()){const txtXa=XA.append(last.wedAnchor,last.getXmlTextLength())
batch.insertText(txtXa,content[0])
content.splice(0,1)}}if(content.length>0)batch.insertJml(XA.append(this.wedAnchor,getLastChildXmlOffset(this)+1),content)
const lastTxt=this.findOrCreateTxtStr(true)
lastTxt.setCaretIn(this.txtRoot.selMgr,false)}return true}export function isUnwrappable_inline(target){var _a
return(_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.isUnwrappable(target)}export function unwrapSeq_inline(target,fromChild,toChild,batch,addSelAfter){var _a
return((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.unwrapSeq(target,this,this,batch,addSelAfter))||false}export function findTxtEltParent(from,includeFrom){if(from==null)return null
if(!includeFrom){from=from.parentNode
if(from==null)return null}do{if(IS_TxtElement(from))return from
if(from instanceof TxtRoot)return null}while(from=from.parentNode)
return null}export function findTxtEltOrRootParent(from,includeFrom){if(from==null)return null
if(!includeFrom){from=from.parentNode
if(from==null)return null}do{if(IS_TxtElement(from))return from
if(from instanceof TxtRoot)return from}while(from=from.parentNode)
return null}export function findTxtEltNextSibling(from){let n=from?from.nextElementSibling:null
while(n){if(IS_TxtElement(n))return n
if(isTxtWrapElt(n)){const ch=findTxtEltFirstChild(n)
if(ch)return ch}n=n.nextElementSibling}if(from&&isTxtWrapElt(from.parentNode))return findTxtEltNextSibling(from.parentNode)
return null}export function findTxtEltPreviousSibling(from){let n=from?from.previousElementSibling:null
while(n){if(IS_TxtElement(n))return n
if(isTxtWrapElt(n)){const ch=findTxtEltLastChild(n)
if(ch)return ch}n=n.previousElementSibling}if(from&&isTxtWrapElt(from.parentNode))return findTxtEltPreviousSibling(from.parentNode)
return null}export function findTxtEltFirstChild(from){let n=from?from.firstElementChild:null
while(n){if(IS_TxtElement(n))return n
if(isTxtWrapElt(n)){const ch=findTxtEltFirstChild(n)
if(ch)return ch}n=n.nextElementSibling}return null}export function findTxtEltLastChild(from){let n=from?from.lastElementChild:null
while(n){if(IS_TxtElement(n))return n
if(isTxtWrapElt(n)){const ch=findTxtEltLastChild(n)
if(ch)return ch}n=n.previousElementSibling}return null}export function findTxtStrParent(from,includeFrom){if(!from)return null
if(!includeFrom){from=from.parentNode
if(!from)return null}do{if(from instanceof TxtStr)return from
if(from instanceof TxtRoot)return null}while(from=from.parentNode)
return null}export function findTxtStrFirstChild(from){return DOM.findNext(from,from,IS_TxtStr)}export function findTxtStrLastChild(from){return DOM.findPreviousIn(from,IS_TxtStr)}export function findTxtStrPrevious(from){let node=DOM.findPrevious(from,null)
while(node){if(node instanceof TxtStr)return node
if(node instanceof TxtRoot)return null
node=DOM.findPrevious(node,null)}return null}export function findTxtStrNext(from){let node=DOM.findNext(from,null)
while(node){if(node instanceof TxtStr)return node
if(node instanceof TxtRoot)return null
node=DOM.findNext(node,null)}return null}export function findTxtParaLikeFrom(from){if(!from)return null
do{if(from instanceof TxtParaLike)return from
if(from instanceof TxtRoot)return null}while(from=from.parentNode)
return null}export function findTxtParaSiblingFrom(from){if(!from)return null
do{if(IS_TxtElement(from)&&from.isParaSibling)return from
if(from instanceof TxtRoot)return null}while(from=from.parentNode)
return null}export function getLastChildXmlOffset(elt){let ch=findTxtEltLastChild(elt)
while(ch&&ch.isVirtual())ch=findTxtEltPreviousSibling(ch)
return ch?ch.xaPart:elt.getFirstChildXmlOffset()-1}export function webRange2XaRange(range){const xaStart=buildXa(range.startContainer,range.startOffset)
const xaEnd=buildXa(range.endContainer,range.endOffset)
return{start:xaStart,end:xaEnd}}export function buildXa(from,webOffset){if(webOffset===undefined){while(!IS_TxtElement(from)&&!(from instanceof TxtRoot)){from=from.previousSibling||from.parentNode}return from.wedAnchor}const txtFrom=findTxtStrParent(from,true)
if(txtFrom===null){let target=from.childNodes[webOffset]
if(IS_TxtElement(target))return target.wedAnchor
target=from.childNodes[webOffset-1]
if(IS_TxtElement(target))return target.isVirtual()?target.wedAnchor:XA.incrAtDepth(target.wedAnchor,-1,1)
if(IS_TxtElement(from))return from.wedAnchor
return null}if(txtFrom.isVirtual()){let virtualRoot=txtFrom
let parent=findTxtEltParent(virtualRoot)
while(parent&&parent.isVirtual()){virtualRoot=parent
parent=findTxtEltParent(virtualRoot)}return virtualRoot.wedAnchor}return XA.append(txtFrom.wedAnchor,txtFrom.getXmlOffset(from,webOffset))}export function buildXaInVirtual(from,webOffset){const txtFrom=findTxtStrParent(from,true)
return txtFrom.isVirtual()?XA.append(txtFrom.wedAnchor,0):XA.append(txtFrom.wedAnchor,txtFrom.getXmlOffset(from,webOffset))}export function isStaticRangeCollapsed(r){return r.startContainer===r.endContainer&&r.startOffset===r.endOffset}export function adjustVirtualsPara(parent){let needPara=true
let ch=findTxtEltFirstChild(parent)
while(ch){if(ch instanceof TxtParaLike){if(!needPara){if(ch.isVirtual()){const prev=ch
ch=findTxtEltNextSibling(ch)
prev.remove()
continue}}else{needPara=false}}else if(needPara){parent.insertVirtualPara(ch)}else{needPara=true}ch=findTxtEltNextSibling(ch)}if(needPara)parent.insertVirtualPara(null)}export function adjustVirtualsStr(parent,tailNode){let needTxtStr=true
let ch=findTxtEltFirstChild(parent)
while(ch&&ch!==tailNode){if(ch instanceof TxtStr){if(!needTxtStr){if(ch.isVirtual()){const prev=ch
ch=findTxtEltNextSibling(ch)
prev.remove()
continue}}else{needTxtStr=false}}else if(needTxtStr){parent.insertVirtualStr(ch)}else{needTxtStr=true}ch=findTxtEltNextSibling(ch)}if(needTxtStr)parent.insertVirtualStr(tailNode)}export function createChildToDisplay(parent,childModel,insertBefore){const child=childModel.createWedlet(parent.wedlet)
child.insertElement(parent.delegatedHost||parent,insertBefore)
child.bindAsVirtual()}export function deleteContent(ctn,batch){const first=ctn.getFirstChildXmlOffset()
const last=getLastChildXmlOffset(ctn)
if(first<=last)batch.deleteSequence(XA.append(ctn.wedAnchor,first),last-first+1)}export function deleteWebRange(txtRoot,webRange,batch,backward,absorbCtn,willInsert){let wr=webRange
const anc=wr.commonAncestorContainer
let txtStrNodeDeleted=false
let ctn=wr.startContainer
let firstCellInEndSelFound
function moveRg(ctn,before){if(wr===webRange){if(!before&&backward)batch.setSelAfter(buildXa(wr.startContainer,wr.startOffset))
wr=webRange.cloneRange()}if(!firstCellInEndSelFound&&before&&!backward){firstCellInEndSelFound=true
batch.setSelAfter(ctn.wedAnchor)}if(before)wr.setEnd(ctn.parentNode,DOM.computeOffset(ctn))
else wr.setStart(ctn.parentNode,DOM.computeOffset(ctn)+1)}while(ctn!==anc){if(ctn instanceof TxtCell||ctn instanceof TxtCaption){const subRg=wr.cloneRange()
subRg.setEnd(ctn,DOM.computeOffset(ctn.lastChild,-1)+1)
txtStrNodeDeleted=deleteWebRange(txtRoot,subRg,batch,backward,absorbCtn)
if(ctn instanceof TxtCaption)batch.needAdjustForNextAdds()
moveRg(ctn)}else if(ctn instanceof TxtRow){for(let cell=ctn.childNodes.item(wr.startOffset);cell;cell=cell.nextSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}moveRg(ctn)}else if(ctn instanceof HTMLTableElement){for(let row=ctn.childNodes.item(wr.startOffset);row;row=row.nextSibling){if(row instanceof TxtRow){for(let cell=row.firstChild;cell;cell=cell.nextSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}}else if(row instanceof TxtCaption){deleteContent(row,batch)}}moveRg(ctn.parentElement)}ctn=ctn.parentNode}ctn=wr.endContainer
while(ctn!==anc){if(ctn instanceof TxtCell||ctn instanceof TxtCaption){const subRg=wr.cloneRange()
subRg.setStart(ctn,0)
deleteWebRange(txtRoot,subRg,batch,backward,absorbCtn)
moveRg(ctn,true)}else if(ctn instanceof TxtRow){for(let cell=ctn.childNodes.item(wr.endOffset-1);cell;cell=cell.previousSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}moveRg(ctn,true)}else if(ctn instanceof HTMLTableElement){for(let row=ctn.childNodes.item(wr.endOffset-1);row;row=row.previousSibling){if(row instanceof TxtRow){for(let cell=row.firstChild;cell;cell=cell.nextSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}}else if(row instanceof TxtCaption){deleteContent(row,batch)}}moveRg(ctn.parentElement,true)}ctn=ctn.parentNode}if(anc instanceof TxtRow){if(wr.startContainer!==anc||wr.endContainer!==anc)throw Error()
for(let cell=anc.childNodes.item(wr.startOffset),end=anc.childNodes.item(wr.endOffset);cell!==end;cell=cell.nextSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}return txtStrNodeDeleted}else if(anc instanceof HTMLTableElement){if(wr.startContainer!==anc||wr.endContainer!==anc)throw Error()
for(let row=ctn.childNodes.item(wr.startOffset),end=anc.childNodes.item(wr.endOffset);row!==end;row=row.nextSibling){if(row instanceof TxtRow){for(let cell=row.firstChild;cell;cell=cell.nextSibling){if(cell instanceof TxtCell)deleteContent(cell,batch)}}else if(row instanceof TxtCaption){deleteContent(row,batch)}}return txtStrNodeDeleted}if(!willInsert)wr=absorbSpacesForDel(wr)
let xaRange=webRange2XaRange(wr)
const start=findTxtStrParent(wr.startContainer)
const end=findTxtStrParent(wr.endContainer)
let endEated=false
if(end){if(end.isVirtual()){endEated=true}else if(start!==end&&end.isXmlEndOffset(wr.endContainer,wr.endOffset)){endEated=true
xaRange.end=XA.incrAtDepth(XA.up(xaRange.end),-1,1)}}if(absorbCtn){if(start&&!start.isVirtual()&&start.isXmlStartOffset(wr.startContainer,wr.startOffset)){if(start===end){if(end.isXmlEndOffset(wr.endContainer,wr.endOffset)){const xaParent=XA.up(XA.freeze(xaRange.start))
if(!XA.isAttribute(xaParent)){const superRg=WEDLET.absorbContainersOnDelete(txtRoot.wedMgr.rootWedlet,XA.newRangeAround(xaParent))
if(superRg)xaRange=superRg
absorbCtn=false}}}else if(endEated){const startUp=XA.up(XA.freeze(xaRange.start))
const superRg=WEDLET.absorbContainersOnDelete(txtRoot.wedMgr.rootWedlet,{start:startUp,end:xaRange.end})
if(superRg)xaRange=superRg
absorbCtn=false}}}batch.deleteRange(absorbCtn?WEDLET.absorbContainersOnDelete(txtRoot.wedMgr.rootWedlet,xaRange):xaRange)
return txtStrNodeDeleted}function absorbSpacesForDel(rg){const start=rg.startContainer
if(start instanceof Text&&/\s/.test(start.nodeValue.charAt(rg.startOffset-1))){const end=rg.endContainer
while(end instanceof Text&&/\s/.test(end.nodeValue.charAt(rg.endOffset))){rg.setEnd(rg.endContainer,rg.endOffset+1)}}return rg}export function exportFragment(startCtn,xmlStartOffset,endCtn,xmlEndOffset){const docHolder=startCtn.wedMgr.docHolder
let result=[]
function copyContent(elt){if(elt instanceof TxtStr&&elt.isEmpty())return
Array.prototype.push.apply(result,docHolder.getContent(elt.wedAnchor))}function copySiblings(sibling){while(sibling){if(IS_TxtElement(sibling)){if(sibling===endCtn){if(!sibling.isVirtual()){if(endCtn instanceof TxtStr){if(xmlEndOffset>0)result.push(endCtn.getXmlText().substring(0,xmlEndOffset))}else{result=endCtn.exportWrap(result)
let ch=findTxtEltFirstChild(endCtn)
while(ch){if(!ch.isVirtual()){if(ch.xaPart>=xmlEndOffset)break
copyContent(ch)}ch=findTxtEltNextSibling(ch)}}}return true}else{if(!sibling.isVirtual())copyContent(sibling)}}sibling=sibling.nextElementSibling}return false}if(startCtn===endCtn){if(startCtn instanceof TxtStr){if(xmlStartOffset<xmlEndOffset)result.push(startCtn.getXmlText().substring(xmlStartOffset,xmlEndOffset))}else{let ch=startCtn.findWedletChild(xmlStartOffset)
while(ch){if(!ch.isVirtual()){if(ch.xaPart>=xmlEndOffset)break
copyContent(ch)}ch=findTxtEltNextSibling(ch)}}}else{if(startCtn instanceof TxtStr){if(startCtn.getXmlTextLength()>xmlStartOffset)result.push(startCtn.getXmlText().substring(xmlStartOffset))
if(copySiblings(startCtn.nextElementSibling))return result}else{if(copySiblings(startCtn.findWedletChild(xmlStartOffset)))return result}let parent=startCtn.parentElement
while(parent&&parent!==endCtn){if(IS_TxtElement(parent)){result=parent.exportWrap(result)}if(copySiblings(parent.nextElementSibling))return result
parent=parent.parentElement}}return result}export function deleteFromSel(txtRoot,forward,granularity){const selMgr=txtRoot.selMgr
let batch
const selType=selMgr.type
const wedMgr=txtRoot.wedMgr
if(selType==="Caret"){const focusNode=selMgr.focusNode
const txtStr=findTxtStrParent(focusNode)
batch=wedMgr.docHolder.newBatch()
if(forward?!txtStr.isXmlEndOffset(focusNode,selMgr.focusOffset):!txtStr.isXmlStartOffset(focusNode,selMgr.focusOffset)){txtStr.moveCaretFrom(selMgr,!forward,"extend",granularity)
deleteWebRange(txtRoot,selMgr.range,batch,!forward,true)
batch.doBatch()
if(!txtRoot.isConnected)WEDLET_SINGLEELT.reselectOnVirtualizing(txtRoot)
return}else{txtStr.deleteByCaret(true,!forward,batch)}}else if(selType==="Range"){batch=wedMgr.docHolder.newBatch(selMgr.getXaRange())
const selAround=selMgr.selAround
if(selAround){batch.deleteRange(WEDLET.absorbContainersOnDelete(txtRoot.wedMgr.rootWedlet,XA.newRangeAround(selAround.wedAnchor)))}else{deleteWebRange(txtRoot,selMgr.range,batch,!forward,true)
selMgr.collapseToStart()}selMgr.collapseToStart()}else if(selType==="Object"){batch=wedMgr.docHolder.newBatch(selMgr.getXaRange())
const range=new Range
range.selectNode(selMgr.focusObject)
deleteWebRange(txtRoot,range,batch,!forward,true)
txtRoot.moveCaret(true)}else{return}batch.setSelAfterSkipAdjust(selMgr.getXaRange().start)
batch.doBatch()
if(!txtRoot.isConnected)WEDLET_SINGLEELT.reselectOnVirtualizing(txtRoot)}export function splitPara(txtRoot,para,splitParent,splitOffset,batch){const endTxtStr=findTxtStrParent(splitParent)
const lastTxtStr=para.findOrCreateTxtStr(true)
const contentToMove=exportFragment(endTxtStr,endTxtStr.getXmlOffset(splitParent,splitOffset),lastTxtStr,undefined)
if(para.addNextPara(batch,contentToMove)){deleteWebRange(txtRoot,DOM.newRange(splitParent,splitOffset,para,para.childNodes.length),batch)}}export function unwrapContainerFromSel(target,root,checkAvailable,addSelAfter){const selMgr=checkAvailable?root.selMgrAsIs:root.selMgr
const batch=checkAvailable?null:root.wedlet.wedMgr.docHolder.newBatch(selMgr.getXaRange())
if(selMgr.type==="Range"){const range=selMgr.range
let ancestor=findTxtEltOrRootParent(range.commonAncestorContainer,true)
if(ancestor instanceof TxtStr)ancestor=findTxtEltParent(ancestor)
if(ancestor instanceof TxtRoot){let from=findTxtEltParent(range.startContainer,true)
while(from&&findTxtEltOrRootParent(from)!==ancestor)from=findTxtEltParent(from)
let to=findTxtEltParent(range.endContainer,true)
while(to&&findTxtEltOrRootParent(to)!==ancestor)to=findTxtEltParent(to)
to=findTxtEltNextSibling(to)
for(let ch=from;ch!==to;ch=findTxtEltNextSibling(ch)){if(ch.isUnwrappable(target)){if(checkAvailable)return true
ch.unwrapSeq(target,findTxtEltFirstChild(ch),findTxtEltLastChild(ch),batch,addSelAfter)
batch.needAdjustForNextAdds()}}}else if(ancestor===null||ancestor===void 0?void 0:ancestor.isUnwrappable(target)){if(checkAvailable)return true
let from=findTxtEltParent(range.startContainer,true)
while(findTxtEltOrRootParent(from)!==ancestor)from=findTxtEltParent(from)
let to=findTxtEltParent(range.endContainer,true)
while(findTxtEltOrRootParent(to)!==ancestor)to=findTxtEltParent(to)
ancestor.unwrapSeq(target,from,to,batch,addSelAfter)}}else{const ch=findTxtEltParent(selMgr.focusNode,true)
if(ch===null||ch===void 0?void 0:ch.isUnwrappable(target)){if(checkAvailable)return true
ch.unwrapSeq(target,findTxtEltFirstChild(ch),findTxtEltLastChild(ch),batch,addSelAfter)}}if(checkAvailable||batch.getState()==="empty")return false
batch.doBatch()
return true}export function unwrapInlFromSel(root,checkAvailable){const selMgr=checkAvailable?root.selMgrAsIs:root.selMgr
let ctn=selMgr.commonTxtElement
if(ctn instanceof TxtStr)ctn=findTxtEltParent(ctn)
if(ctn instanceof InlWrap){if(!checkAvailable){const batch=root.wedlet.wedMgr.docHolder.newBatch()
batch.setSelBeforeSeq(ctn.wedAnchor,1)
unwrapInl(ctn,batch)
const prev=findTxtEltPreviousSibling(ctn)
if(prev instanceof TxtStr){let offset=prev.getXmlTextLength()
const rg=selMgr.range
const txtStr=findTxtStrParent(rg.startContainer,true)
if(txtStr)offset+=txtStr.getXmlOffset(rg.startContainer,rg.startOffset)
batch.setSelAfterSkipAdjust(XA.append(prev.wedAnchor,offset))}else{console.log("prev TxtStr not found???")
batch.setSelAfterSkipAdjust(ctn.wedAnchor)}batch.doBatch()}return true}return false}export function unwrapInl(inl,batch,remMem){const content=inl.exportContent()
let beforeTxtStr,afterTxtStr
let mergeBefore
if(typeof content[0]==="string"){const prev=DOM.findPreviousSibling(inl,IS_TxtElementReal)
if(IS_TxtStrReal(prev)){mergeBefore=true
beforeTxtStr=prev}}let mergeAfter
if(typeof content[content.length-1]==="string"){const next=DOM.findNextSibling(inl,IS_TxtElementReal)
if(IS_TxtStrReal(next)){mergeAfter=true
afterTxtStr=next}}const inlXa=XA.freeze(inl.wedAnchor)
if(mergeBefore&&mergeAfter&&content.length===1){if(remMem){beforeTxtStr=remMem.get(beforeTxtStr)||beforeTxtStr
afterTxtStr=remMem.get(afterTxtStr)||afterTxtStr}const txt=content[0]+afterTxtStr.getXmlText()
batch.insertText(XA.append(beforeTxtStr.wedAnchor,beforeTxtStr.getXmlText().length),txt)
batch.deleteSequence(inl.wedAnchor,2)
batch.needAdjustForNextAdds()
if(remMem)remMem.set(afterTxtStr,beforeTxtStr)
return}else{if(mergeBefore){if(remMem)beforeTxtStr=remMem.get(beforeTxtStr)||beforeTxtStr
batch.insertText(XA.append(beforeTxtStr.wedAnchor,beforeTxtStr.getXmlText().length),content[0])
content.splice(0,1)}if(mergeAfter){if(remMem)afterTxtStr=remMem.get(afterTxtStr)||afterTxtStr
batch.insertText(XA.append(afterTxtStr.wedAnchor,0),content[content.length-1])
content.length--}}batch.spliceSequence(inlXa,1,content).needAdjustForNextAdds()}export function onPointerDownObject(ev){ev.stopPropagation()
ev.preventDefault()
this.focus()}export function hasMetaDefs_multi(){var _a
return this.model.panelModel!=null||((_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.hasMetaDefs())||false}export function getMetaDefs_multi(){var _a
const result=(_a=findTxtEltParent(this))===null||_a===void 0?void 0:_a.getMetaDefs()
if(!this.model.panelModel)return result
const thisMetaDef={from:this,model:this.model.panelModel,label:this.model.nodeLabel}
if(!result)return thisMetaDef
if(!Array.isArray(result))return[result,thisMetaDef]
result.push(thisMetaDef)
return result}export function getTextFirstOffset(txt){return txt.startEdgeOmitted?0:1}export function getTextLength(txt){return txt.nodeValue.length-(txt.startEdgeOmitted?txt.endEdgeOmitted?0:1:txt.endEdgeOmitted?1:2)}export function doInput(data,ev,root){const wedMgr=root.wedlet.wedMgr
const selMgr=root.selMgr
const range=selMgr.range
const batch=wedMgr.docHolder.newBatch()
let startTxtStrDeleted=false
if(!isStaticRangeCollapsed(range)){const xaRange=selMgr.getXaRange()
batch.setSelBefore(xaRange.start,xaRange.end)
startTxtStrDeleted=deleteWebRange(root,range,batch,false,false,true)
batch.setSelAfter(null,null)}const txtStr=findTxtStrParent(range.startContainer)
if(!txtStr)ERROR.log("txtStr is null",Error(`range.startContainer::connected:${range.startContainer?range.startContainer.isConnected:"null"}::${DOM.debug(range.startContainer)}|parent::${DOM.debug(range.startContainer.parentNode)}`),null)
data=txtStr.transformInsertData(data)
const xmlOffset=txtStr.getXmlOffset(range.startContainer,range.startOffset)
let customCaretParent
let customCaretPrev
if(startTxtStrDeleted){batch.insertText(txtStr.wedAnchor,data)}else if(txtStr.isVirtual()){const rootVirtual=WEDLET.insertDatasFromDisplay(txtStr,batch,data).element
customCaretParent=rootVirtual.parentElement
customCaretPrev=DOM.findPreviousSibling(rootVirtual,IS_EltWedlet)}else{batch.insertText(XA.append(txtStr.wedAnchor,xmlOffset),data)}if(customCaretParent){try{wedMgr.freezeFocus=true
batch.doBatch()
if(!txtStr.isConnected){const filter=n=>n instanceof TxtStr&&n.getXmlText()==data
const newTxtStr=customCaretPrev?DOMSH.findFlatNextUncle(customCaretPrev,customCaretParent,filter):DOMSH.findFlatNext(customCaretParent,customCaretParent,filter)
if(newTxtStr)newTxtStr.txtRoot.selMgr.setCaretAtEnd(newTxtStr)}else{selMgr.setCaretAtEnd(txtStr)}}finally{wedMgr.freezeFocus=false}}else{batch.doBatch()}if(ev.cancelable){ev.preventDefault()
if(ev instanceof InputEvent){const onTypings=root.onTypings
if(onTypings){let lang
DOMSH.findLogicalFlatParentOrSelf(txtStr,null,n=>(lang=n.getAttribute("lang"))!=null)
const text=txtStr.getXmlText()
const beforeText=text.substr(0,xmlOffset)
for(let i=0;i<onTypings.length;i++){if(onTypings[i].onTyping(ev,root,txtStr,lang,beforeText,xmlOffset,text))break}}}}else{selMgr.resetSel()
setTimeout(()=>{const[node,ofsset]=txtStr.getWebOffset(xmlOffset+data.length)
selMgr.setSelCaret(node,ofsset)},4)}}export const beforeInputHandler={insertText:function(ev,root){doInput(ev.data,ev,root)},insertReplacementText:function(ev,root){doInput(ev.dataTransfer.getData("text/plain")||"",ev,root)},deleteByComposition:function(ev,root){deleteFromSel(root,false,"character")}}
export const keyPressHandler={Enter:function(ev,root){ev.stopPropagation()
ev.preventDefault()
if(root.contentEditable!=="true")return
const selMgr=root.selMgr
const selType=selMgr.type
if(selType==="None"||selType==="Object")root.moveCaret(false)
const range=selMgr.range
const batch=root.wedlet.wedMgr.docHolder.newBatch(selMgr.getXaRange())
if(!isStaticRangeCollapsed(range))deleteWebRange(root,range,batch)
const startTxtStr=findTxtStrParent(range.startContainer)
if(startTxtStr){const startPara=findTxtParaLikeFrom(startTxtStr)
if(!startPara){if(root instanceof TxtRootStr&&root.getAttribute("aria-multiline")==="true"){if(startTxtStr.isVirtual()){WEDLET.insertDatasFromDisplay(startTxtStr,batch,"\n")}else{batch.insertText(XA.append(startTxtStr.wedAnchor,startTxtStr.getXmlOffset(range.startContainer,range.startOffset)),"\n")}batch.doBatch()}return}if(startTxtStr.getXmlOffset(range.startContainer,range.startOffset)===0&&startTxtStr.isFirstContentInPara()){let prevPara
if(startPara.isEmpty()||(prevPara=findTxtEltPreviousSibling(startPara))&&!prevPara.isVirtual()&&prevPara.isEmpty()){const ctn=findTxtEltParent(startPara)
if(ctn&&ctn.isUnwrappable()==="list"){let lastPara=startPara
let nextParaLike=findTxtEltNextSibling(startPara)
while(nextParaLike){lastPara=nextParaLike
nextParaLike=findTxtEltNextSibling(nextParaLike)}let prevPrevPara
if(prevPara&&(prevPrevPara=findTxtEltPreviousSibling(prevPara))&&!prevPrevPara.isVirtual()){batch.needAdjustForNextAdds().deleteSequence(prevPara.wedAnchor,1).needAdjustForNextAdds()}ctn.unwrapSeq("list",startPara,lastPara,batch,false)
batch.setMeta("caretAtStart",true)
batch.doBatch()
return}}}batch.needAdjustForNextAdds()
const endPara=findTxtParaLikeFrom(range.endContainer)
if(startPara===endPara){const endTxtStr=findTxtStrParent(range.endContainer)
let startMoveNode=endTxtStr
let startMoveOffset=endTxtStr.getXmlOffset(range.endContainer,range.endOffset)
if(endTxtStr.isXmlEndOffset(range.endContainer,range.endOffset)){const top=endTxtStr.getTopInlineParent("end")
if(top){startMoveNode=findTxtEltParent(top)
startMoveOffset=top.getVirtualXaPart()+1}}const startTxtStr=findTxtStrParent(range.startContainer)
if(startTxtStr.isXmlStartOffset(range.startContainer,range.startOffset)&&DOM.findPreviousSibling(startTxtStr,IS_TxtElementReal)==null){if(startTxtStr.isFirstContentInPara()){batch.setSelAfter(buildXa(range.startContainer,range.startOffset))
if(!startPara.addPreviousPara(batch))return
batch.doBatch()
return}}const contentToMove=exportFragment(startMoveNode,startMoveOffset,endPara,findTxtEltLastChild(endPara).getVirtualXaPart()+1)
if(contentToMove.length>0)deleteWebRange(root,DOM.newRange(range.endContainer,range.endOffset,endPara,endPara.childNodes.length),batch)
if(!startPara.addNextPara(batch,contentToMove)){return}if(batch.msgs.length===0){startPara.moveCaretOut(selMgr,false)}else{batch.setSelAfter(XA.append(XA.incrAtDepth(startPara.wedAnchor,-1,1),0))}}else{if(!startPara.addNextPara(batch))return}batch.doBatch()}else{console.trace("No startTxtStr!!!!")}}," ":function(ev,root){if(root.contentEditable!=="true")return
if(root.selMgr.type==="Caret"){const node=root.selMgr.focusNode
if(node instanceof Text){const offset=root.selMgr.focusOffset
const txtStr=findTxtStrParent(node)
if(!txtStr)return
if(!txtStr.model.keepSpaces){if(node.nodeValue.charAt(offset-1)===" "){ev.preventDefault()
ev.stopImmediatePropagation()}else if(node.nodeValue.charAt(offset)===" "){ev.preventDefault()
ev.stopImmediatePropagation()
root.selMgr.setSelCaret(node,offset+1)}else{if(txtStr.isXmlStartOffset(node,offset)){const prev=DOM.findPrevious(txtStr,findTxtParaLikeFrom(txtStr)||root,(function(n){return IS_TxtElement(n)&&!n.isVirtual()&&!(n instanceof InlWrap)}))
if(!prev||prev instanceof TxtStr&&DOM.txtEndsWithSp(prev.getXmlText())){ev.preventDefault()
ev.stopImmediatePropagation()}}else if(txtStr.isXmlEndOffset(node,offset)){const next=DOM.findNext(txtStr,findTxtParaLikeFrom(txtStr)||root,(function(n){return IS_TxtElement(n)&&!n.isVirtual()&&!(n instanceof InlWrap)}))
if(next instanceof TxtStr&&DOM.txtStartsWithSp(next.getXmlText())){root.wedMgr.docHolder.newBatch().deleteSequence(XA.append(next.wedAnchor,0),DOM.txtStartSpLen(next.getXmlText())).insertText(XA.append(txtStr.wedAnchor,txtStr.getXmlTextLength())," ").doBatch()
ev.preventDefault()
ev.stopImmediatePropagation()}}}}}}}}
export const keyDownHandler={ArrowLeft:function(ev,root){ev.preventDefault()
ev.stopImmediatePropagation()
root.moveCaret(true,ev.shiftKey?"extend":"move",ACTION.isAccelPressed(ev)?"word":"character")},ArrowRight:function(ev,root){ev.stopImmediatePropagation()
ev.preventDefault()
root.moveCaret(false,ev.shiftKey?"extend":"move",ACTION.isAccelPressed(ev)?"word":"character")},ArrowUp:function(ev,root){ev.stopImmediatePropagation()
if(root.moveCaretV(true,ev.shiftKey?"extend":"move"))ev.preventDefault()},ArrowDown:function(ev,root){ev.stopImmediatePropagation()
if(root.moveCaretV(false,ev.shiftKey?"extend":"move"))ev.preventDefault()},Backspace:function(ev,root){ev.stopImmediatePropagation()
ev.preventDefault()
if(root.contentEditable!=="true")return
if(ev.shiftKey){unwrapContainerFromSel(null,root,false,false)}else{deleteFromSel(root,false,ACTION.isAccelPressed(ev)?"word":"character")}},Delete:function(ev,root){ev.stopImmediatePropagation()
ev.preventDefault()
if(root.contentEditable!=="true")return
deleteFromSel(root,true,ACTION.isAccelPressed(ev)?"word":"character")},Insert:function(ev,root){ev.preventDefault()
const table=DOM.findParentOrSelf(root.selMgr.commonAncestor,root,TXTTABLE.IS_TxtTable)
if(table){ev.stopImmediatePropagation()
table.tableLayout.drawTableLayout()}},Enter:function(ev,root){if(ACTION.isAccelPressed(ev)){if(root.contentEditable!=="true")return
const cell=DOM.findParentOrSelf(root.selMgr.commonAncestor,root,TXTTABLE.IS_TxtCell)
if(cell){ev.stopImmediatePropagation()
ev.preventDefault()
const table=DOM.findParentOrSelf(cell,root,TXTTABLE.IS_TxtTable)
const logicTable=table.tableLayout.logicTable
const batch=root.wedMgr.docHolder.newBatch()
logicTable.insertRows(batch,logicTable.getLogicOffsets(cell).offsRow+1,table.model.rowModels[0])
batch.doBatch()}}},Tab:function(ev,root){if(root.selMgr.type==="Object")return
const cell=DOM.findParentOrSelf(root.selMgr.commonAncestor,root,TXTTABLE.IS_TxtCell)
if(cell){const table=cell.parentNode.parentNode
function cellFilter(n){return n instanceof TxtCell&&n.parentNode.parentNode===table}const next=ev.shiftKey?DOM.findPrevious(cell,table,cellFilter):DOM.findNext(cell,table,cellFilter)
if(next){ev.stopImmediatePropagation()
ev.preventDefault()
root.selMgr.setSelection(next)}}},a:function(ev,root){if(ACTION.isAccelPressed(ev)){root.selMgr.selectAll()
ev.preventDefault()}}," ":function(ev,root){if(!ev.shiftKey||!ACTION.isAccelPressed(ev)||root.contentEditable!=="true"||root.selMgr.type!=="Caret")return
const node=root.selMgr.focusNode
if(node instanceof Text){const offset=root.selMgr.focusOffset
const txtStr=findTxtStrParent(node)
if(!txtStr)return
if(txtStr.isVirtual()){WEDLET.insertDatasFromDisplay(txtStr,null," ")}else{root.wedMgr.docHolder.newBatch().insertText(XA.append(txtStr.wedAnchor,txtStr.getXmlOffset(node,offset))," ").doBatch()}ev.preventDefault()
ev.stopImmediatePropagation()}}}
keyDownHandler.A=keyDownHandler.a
const DOUBLEPONCT=[":",";","?","!"]
REG.reg.addToList("wed:text:onTyping","nbspBeforeDoublePonctInFrench",1,{label:"Espace insécable avant une double ponctuation (si langue française)",onTyping(ev,root,txtStr,lang,beforeXmlText,xmlOffset,fullXmlText){if(!isFr(lang))return false
if(DOUBLEPONCT.indexOf(ev.data)>=0){if(beforeXmlText.length===0||/\S$/.test(beforeXmlText)&&!/.*(http|ftp)s?$/.test(beforeXmlText)){const xa=XA.freeze(txtStr.wedAnchor)
root.wedMgr.docHolder.newBatch().insertText(XA.append(xa,xmlOffset)," ").setSelAfter(XA.append(xa,xmlOffset+2)).doBatch()}else if(beforeXmlText.endsWith(" ")){const xa=XA.freeze(txtStr.wedAnchor)
root.wedMgr.docHolder.newBatch().spliceSequence(XA.append(xa,xmlOffset-1),1," ").setSelAfter(XA.append(xa,xmlOffset+1)).doBatch()}return true}return false}})
REG.reg.addToList("wed:text:onTyping","frenchQuote",1,{label:"Guillemets « » (si langue française)",onTyping(ev,root,txtStr,lang,beforeXmlText,xmlOffset,fullXmlText){if(!isFr(lang))return false
if(ev.data==='"'){if(!beforeXmlText||/[\s({\[]$/.test(beforeXmlText)){root.wedMgr.docHolder.newBatch().spliceSequence(XA.append(txtStr.wedAnchor,xmlOffset),1,"« ").doBatch()}else{root.wedMgr.docHolder.newBatch().spliceSequence(XA.append(txtStr.wedAnchor,xmlOffset),1," »").doBatch()}return true}return false}})
function isFr(lang){return lang&&lang.startsWith("fr")}REG.reg.addToList("wed:text:onTyping","ul",1,{label:"* Liste",onTyping(ev,root,txtStr,lang,beforeXmlText,xmlOffset,fullXmlText){if(beforeXmlText==="*"&&ev.data===" "&&!findTxtEltPreviousSibling(txtStr)){const para=findTxtEltParent(txtStr)
if(para&&para.isParaSibling){const ctn=findTxtEltOrRootParent(para)
const models=ctn.txtWedModels
const model=models?models.find(m=>m instanceof TxtULModel):null
if(model){const doc=root.wedMgr.docHolder
const xa=para.wedAnchor
const paraJml=doc.getContent(xa)
const ch=paraJml[1]
const idx=ch.findIndex(c=>typeof c==="string")
if(idx>=0&&ch[idx].startsWith("* "))ch[idx]=ch[idx].substring(2)
doc.newBatch().spliceSequence(xa,1,[model.newJml(),[model.itemModel.newJml(),paraJml]]).doBatch()
return true}}}return false}})
REG.reg.addToList("wed:text:onTyping","ol",1,{label:"1. Liste",onTyping(ev,root,txtStr,lang,beforeXmlText,xmlOffset,fullXmlText){if(beforeXmlText==="1."&&ev.data===" "&&!findTxtEltPreviousSibling(txtStr)){const para=findTxtEltParent(txtStr)
if(para&&para.isParaSibling){const ctn=findTxtEltOrRootParent(para)
const models=ctn.txtWedModels
const model=models?models.find(m=>m instanceof TxtOLModel):null
if(model){const doc=root.wedMgr.docHolder
const xa=para.wedAnchor
const paraJml=doc.getContent(xa)
const ch=paraJml[1]
const idx=ch.findIndex(c=>typeof c==="string")
if(idx>=0&&ch[idx].startsWith("1. "))ch[idx]=ch[idx].substring(3)
doc.newBatch().spliceSequence(xa,1,[model.newJml(),[model.itemModel.newJml(),paraJml]]).doBatch()
return true}}}return false}})
REG.reg.addToList("wed:text:onTyping","sl",1,{label:"- Liste simple",onTyping(ev,root,txtStr,lang,beforeXmlText,xmlOffset,fullXmlText){if(beforeXmlText==="-"&&ev.data===" "&&!findTxtEltPreviousSibling(txtStr)){const para=findTxtEltParent(txtStr)
if(para&&para.isParaSibling){const ctn=findTxtEltOrRootParent(para)
const models=ctn.txtWedModels
const model=models?models.find(m=>m instanceof TxtSLModel):null
if(model){const xa=para.wedAnchor
const paraJml=para.exportContent()
const idx=paraJml.findIndex(c=>typeof c==="string")
if(idx>=0&&paraJml[idx].startsWith("- "))paraJml[idx]=paraJml[idx].substring(2)
root.wedMgr.docHolder.newBatch().spliceSequence(xa,1,[model.newJml(),[model.memberModel.newJml(),paraJml]]).doBatch()
return true}else{const modelUL=models?models.find(m=>m instanceof TxtULModel):null
if(modelUL){const doc=root.wedMgr.docHolder
const xa=para.wedAnchor
const paraJml=doc.getContent(xa)
const ch=paraJml[1]
const idx=ch.findIndex(c=>typeof c==="string")
if(idx>=0&&ch[idx].startsWith("- "))ch[idx]=ch[idx].substring(2)
doc.newBatch().spliceSequence(xa,1,[modelUL.newJml(),[modelUL.itemModel.newJml(),paraJml]]).doBatch()
return true}}}}return false}})
REG.reg.registerSvc("wedTxtUnknownLeaf",1,(function(){if(!this.shadowRoot)this.attachShadow(DOMSH.SHADOWDOM_INIT)
DOM.addClass(this,"unknown")
DOM.setTextContent(this.shadowRoot,this.model.nodeLabel)}))

//# sourceMappingURL=txtUtils.js.map