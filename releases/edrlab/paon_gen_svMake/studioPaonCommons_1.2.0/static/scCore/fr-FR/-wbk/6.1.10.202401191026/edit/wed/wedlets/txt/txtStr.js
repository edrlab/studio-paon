import{BOUND_CHAR,BOUND_CHARS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
import{isSkSearchAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{isSkTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{ERROR}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/errorReport.js"
export function IS_TxtStrTextNode(n){return n&&n.nodeType===Node.TEXT_NODE}export function IS_TxtStrNbSp(n){return n&&n.localName==="x-nbsp"}export function IS_TxtStrMarkNode(n){return(n===null||n===void 0?void 0:n.localName)==="mark"}export function xmlLen(txt){const l=txt.ime?txt.length-txt.ime.len:txt.length
if(txt.startBoundary)return txt.length-(txt.endBoundary?2:1)
return txt.endBoundary?txt.length-1:txt.length}export function xmlOffset(txt,webOffset){var _a
if(((_a=txt.ime)===null||_a===void 0?void 0:_a.start)<webOffset)webOffset-=txt.ime.len
if(txt.startBoundary)webOffset--
return webOffset}export function webOffset(txt,xmlOffset){var _a
if(txt.startBoundary)xmlOffset++
if(((_a=txt.ime)===null||_a===void 0?void 0:_a.start)<xmlOffset)xmlOffset+=txt.ime.len
return xmlOffset}export function xmlText(txt){var _a
if(((_a=txt.ime)===null||_a===void 0?void 0:_a.len)>0){const first=txt.nodeValue.substring(txt.startBoundary?1:0,txt.ime.start)
const last=txt.nodeValue.substring(txt.ime.start+txt.ime.len,txt.endBoundary?txt.nodeValue.length-1:txt.nodeValue.length)
return first+last}if(txt.startBoundary)return txt.nodeValue.substring(1,txt.endBoundary?txt.nodeValue.length-1:txt.nodeValue.length)
if(txt.endBoundary)return txt.nodeValue.substring(0,txt.nodeValue.length-1)
return txt.nodeValue}export function getXmlOffset(txtStr,from,webOffset){let result=0
if(IS_TxtStrTextNode(from)){result=xmlOffset(from,webOffset)}else if(IS_TxtStrNbSp(from)){result=1}else{const ch=from.childNodes[webOffset]
from=ch||from.lastChild||from
if(from===txtStr)return 0
if(IS_TxtStrTextNode(from))result=xmlLen(from)
else if(IS_TxtStrNbSp(from))result=1}do{const parent=from.parentNode
while(from=from.previousSibling){if(IS_TxtStrTextNode(from))result+=xmlLen(from)
else if(IS_TxtStrNbSp(from))result+=1
else if(IS_TxtStrMarkNode(from))result+=markLen(from)}if(parent!==txtStr)from=parent}while(from)
return result}export function getWebOffset(txtStr,xmlOffset){const result=[]
DOM.findNext(txtStr,txtStr,n=>{if(IS_TxtStrTextNode(n)){const nodeLen=xmlLen(n)
if(xmlOffset<=nodeLen){result.push(n,webOffset(n,xmlOffset))
return true}xmlOffset-=nodeLen}else if(IS_TxtStrNbSp(n)){if(xmlOffset===0)console.log("texNode missing before nbsp",txtStr)
xmlOffset--}else if(IS_TxtStrMarkNode(n)){for(let ch=n.firstChild;ch;ch=ch.nextSibling){if(IS_TxtStrTextNode(ch)){const len=xmlLen(ch)
if(xmlOffset<=len){result.push(ch,webOffset(ch,xmlOffset))
return true}}else if(IS_TxtStrNbSp(n)){xmlOffset--}}}return false})
return result}export function insertXmlText(txtStr,node,offset,xmlText){if(IS_TxtStrTextNode(node)){const len=xmlLen(node)
if(len>=offset){insertHtmlTextHere(txtStr,node,offset,xmlText)
return 0}else{offset-=len}}else if(IS_TxtStrNbSp(node)){if(offset===0){const txt=node.parentNode.insertBefore(newTxtStrTextNode(),node)
insertHtmlTextHere(txtStr,txt,0,xmlText)
return 0}else if(offset===1){let next=node.nextSibling
if(!IS_TxtStrTextNode(next))next=node.parentNode.insertBefore(newTxtStrTextNode(),next)
insertHtmlTextHere(txtStr,next,0,xmlText)
return 0}else{return offset-1}}else{for(let ch=node.firstChild;ch;ch=ch.nextSibling){offset=insertXmlText(txtStr,ch,offset,xmlText)
if(offset===0)return 0}}if(offset===0){const txt=node.appendChild(newTxtStrTextNode())
insertHtmlTextHere(txtStr,txt,0,xmlText)
return 0}return offset}function insertHtmlTextHere(txtStr,txtNode,xmlOffset,xmlText){let start=0
let end=xmlText.indexOf(" ")
while(end>=0){const insOffset=webOffset(txtNode,xmlOffset)
const lenToRemove=xmlLen(txtNode)-xmlOffset
const moveStr=lenToRemove>0?txtNode.nodeValue.substr(insOffset,lenToRemove):null
if(start<end)txtNode.replaceData(insOffset,lenToRemove,xmlText.substring(start,end))
else if(lenToRemove>0)txtNode.deleteData(insOffset,lenToRemove)
const nbsp=txtNode.parentNode.insertBefore(document.createElement("x-nbsp"),txtNode.nextSibling)
txtNode=nbsp.nextSibling
if(!IS_TxtStrTextNode(txtNode))txtNode=nbsp.parentNode.insertBefore(newTxtStrTextNode(),txtNode)
if(moveStr)txtNode.insertData(1,moveStr)
xmlOffset=0
start=end+1
end=xmlText.indexOf(" ",start)}if(start<xmlText.length)txtNode.insertData(webOffset(txtNode,xmlOffset),xmlText.substring(start))}export function deleteXmlText(txtStr,node,point){if(IS_TxtStrTextNode(node)){const len=xmlLen(node)
if(len>point.start){const webStart=webOffset(node,point.start)
if(len>=point.end){node.deleteData(webStart,webOffset(node,point.end)-webStart)
point.start=point.end
return null}node.deleteData(webStart,webOffset(node,len)-webStart)
point.end-=len
point.start=0}else{point.start-=len
point.end-=len}}else if(IS_TxtStrNbSp(node)){if(point.start===0){const prev=node.previousSibling
let next=node.nextSibling
node.remove()
point.end--
if(IS_TxtStrTextNode(prev)){while(IS_TxtStrTextNode(next)){const lenNext=xmlLen(next)
if(lenNext<=point.end){if(prev.endBoundary){if(!next.endBoundary){prev.deleteData(prev.length-1,1)
prev.endBoundary=false}}else if(next.endBoundary){prev.insertData(prev.length,BOUND_CHAR)
prev.endBoundary=true}next.remove()
point.end-=lenNext
if(point.end===0)return null
next=prev.nextSibling}else{const lenPrev=xmlLen(prev)
if((prev.startBoundary||false)==(next.startBoundary||false)){if(lenPrev>0)next.insertData(next.startBoundary?1:0,xmlText(prev))}else{if(next.startBoundary)next.deleteData(0,1)
next.insertData(0,prev.endBoundary?prev.nodeValue.substring(0,prev.nodeValue.length-1):prev.nodeValue)
next.startBoundary=prev.startBoundary}if(lenPrev>0){point.start+=lenPrev
point.end+=lenPrev}const selMgr=txtStr.txtRoot.selMgr
if(selMgr.type==="Caret"&&selMgr.focusNode===prev)selMgr.collapse(next,selMgr.focusOffset)
prev.remove()
break}}}if(point.end===0)return null
return next}else{point.start--
point.end--}}else{for(let ch=node.firstChild;ch;){ch=deleteXmlText(txtStr,ch,point)}}return point.start===point.end?null:node===null||node===void 0?void 0:node.nextSibling}export function resetXmlText(txtStr){txtStr.textContent=null
return txtStr.appendChild(newTxtStrTextNode())}export function planRedrawTxtStrAnnots(txtStr){if(!txtStr.redrawAnnotRequest)txtStr.redrawAnnotRequest=window.requestIdleCallback(txtStr.redrawAnnotExecutor||(txtStr.redrawAnnotExecutor=redrawAnnotExecutor.bind(txtStr)))}function redrawAnnotExecutor(deadline){this.redrawAnnotRequest=0
if(!this.isConnected)return
const selMgr=this.txtRoot.selMgrAsIs
let anchorOffset=-1
let focusOffset=-1
if(DOM.isAncestor(this,selMgr.anchorNode)){anchorOffset=this.getXmlOffset(selMgr.anchorNode,selMgr.anchorOffset)}if(DOM.isAncestor(this,selMgr.focusNode)){focusOffset=this.getXmlOffset(selMgr.focusNode,selMgr.focusOffset)}const newAnnots=this.wedMgr.docHolder.getAnnots(this.wedAnchor)
const toKeep=new Set
let offset=0
for(let ch=this.firstChild;ch;ch=ch.nextSibling){if(IS_TxtStrTextNode(ch)){offset+=xmlLen(ch)}else if(IS_TxtStrNbSp(ch)){offset+=1}else if(IS_TxtStrMarkNode(ch)){const markLenght=markLen(ch)
for(let i=0;i<newAnnots.length;i++){const a=newAnnots[i]
if(a&&isMatchNewAnnot(ch,offset,markLenght,a)){newAnnots[i]=null
toKeep.add(a)}}offset+=markLenght}}removeAnnotsInTxtStr(this,toKeep)
for(const a of newAnnots){if(isSkTextAnnot(a))injectAnnotInTxtStr(this,a.offsetStart,a)}if(anchorOffset>=0){const[ancN,ancOffs]=this.getWebOffset(anchorOffset)
if(focusOffset>=0){const[focN,focOffs]=this.getWebOffset(focusOffset)
selMgr.setSelBounds(ancN,ancOffs,focN,focOffs)}else{selMgr.setSelAnchor(ancN,ancOffs)}}else if(focusOffset>=0){const[focN,focOffs]=this.getWebOffset(focusOffset)
selMgr.setSelFocus(focN,focOffs)}}export function injectAnnotInTxtStr(txtStr,pos,annot){let node=txtStr.firstChild
while(node){if(IS_TxtStrTextNode(node)){let len=xmlLen(node)
if(len>pos){const annotLen=annot.len
let textNode
if(pos===0){textNode=node}else{textNode=splitTextForMark(node,pos)
len-=pos}if(len>annotLen){splitTextForMark(textNode,annotLen)
len=annotLen}const mark=txtStr.insertBefore(newTxtStrMarkNode(annot),textNode)
mark.appendChild(textNode)
extendMarkUntil(txtStr,mark,annot,annotLen-len)
return}else{pos-=len}}else if(IS_TxtStrNbSp(node)){if(pos===0){const mark=txtStr.insertBefore(newTxtStrMarkNode(annot),node)
mark.appendChild(node)
extendMarkUntil(txtStr,mark,annot,annot.len-1)
return}else{pos--}}else if(IS_TxtStrMarkNode(node)){let len=markLen(node)
if(pos<len){const annotLen=annot.len
let mark
if(pos===0){mark=node}else{mark=splitMark(node,pos)
len-=pos}if(annotLen<len){splitMark(mark,annotLen)
len=annotLen}addAnnotTo(mark,annot)
extendMarkUntil(txtStr,mark,annot,annotLen-len)
return}else{pos-=len}}node=node.nextSibling}return}function extendMarkUntil(txtStr,mark,annot,lenLeft){while(lenLeft>0){const node=mark.nextSibling
if(IS_TxtStrTextNode(node)){const nodeLen=xmlLen(node)
if(lenLeft<nodeLen){splitTextForMark(node,lenLeft)
const newMark=newTxtStrMarkNode(annot)
node.parentNode.insertBefore(newMark,node)
newMark.appendChild(node)
return}const newMark=newTxtStrMarkNode(annot)
node.parentNode.insertBefore(newMark,node)
newMark.appendChild(node)
lenLeft-=nodeLen}else if(IS_TxtStrNbSp(node)){mark.appendChild(node)
lenLeft--}else if(IS_TxtStrMarkNode(node)){const lenMark=markLen(node)
if(lenLeft<lenMark){splitMark(node,lenLeft)
addAnnotTo(node,annot)
return}addAnnotTo(node,annot)
mark=node
lenLeft-=lenMark}else if(node){mark.appendChild(node)}else{ERROR.log(`node null, but lenLeft=${lenLeft} in txtStr: ${txtStr.outerHTML}\nxa: ${JSON.stringify(txtStr.wedlet.wedAnchor)}\napp: ${document.location.hash}`,Error())
lenLeft=0}}}export function removeAnnotsInTxtStr(txtStr,exceptFor){let ch=txtStr.firstChild
while(ch){if(IS_TxtStrMarkNode(ch)){if(remAllAnnotsExcept(ch,exceptFor)){const prev=ch.previousSibling
const next=ch.nextSibling
const firstCh=ch.firstChild
const lastCh=ch.lastChild
if(IS_TxtStrTextNode(prev)&&IS_TxtStrTextNode(firstCh)){prev.appendData(firstCh.nodeValue)
prev.endBoundary=firstCh.endBoundary
firstCh.remove()
if(firstCh===lastCh){if(IS_TxtStrTextNode(next)){prev.appendData(next.nodeValue)
prev.endBoundary=next.endBoundary
next.remove()}const m=ch.nextSibling
ch.remove()
ch=m
continue}}if(IS_TxtStrTextNode(next)&&IS_TxtStrTextNode(lastCh)){next.insertData(0,lastCh.nodeValue)
next.startBoundary=lastCh.startBoundary
lastCh.remove()}while(ch.hasChildNodes())txtStr.insertBefore(ch.firstChild,ch)
const m=ch.nextSibling
ch.remove()
ch=m
continue}}ch=ch.nextSibling}}function newTxtStrTextNode(){const t=document.createTextNode(BOUND_CHARS)
t.startBoundary=true
t.endBoundary=true
return t}function newTxtStrMarkNode(annot){return addAnnotTo(document.createElement("mark"),annot)}function splitTextForMark(node,pos){const nextT=node.splitText(webOffset(node,pos))
nextT.startBoundary=false
nextT.endBoundary=node.endBoundary
node.endBoundary=false
return nextT}function splitMark(mark,pos){const nextMark=document.createElement("mark")
if(mark.search)addAnnotTo(nextMark,mark.search)
if(mark.diff)addAnnotTo(nextMark,mark.diff)
mark.parentNode.insertBefore(nextMark,mark.nextSibling)
let node=mark.firstChild
while(node&&pos>0){if(IS_TxtStrTextNode(node)){const len=xmlLen(node)
if(pos<len)splitTextForMark(node,pos)
pos-=len}else if(IS_TxtStrNbSp(node)){pos--}node=node.nextSibling}while(node){const n=node.nextSibling
nextMark.appendChild(node)
node=n}return nextMark}function addAnnotTo(mark,annot){var _a
if(isSkSearchAnnot(annot)){mark.search=annot}else if((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot)){mark.diff=annot}else{console.trace("Unknown annot",annot)}mark.classList.add(annot.level.name)
return mark}function remAllAnnotsExcept(mark,annots){let discard=true
if(mark.search){if(annots.has(mark.search)){discard=false}else{mark.classList.remove(mark.search.level.name)
mark.search=null}}if(mark.diff){if(annots.has(mark.diff)){discard=false}else{mark.classList.remove(mark.diff.level.name)
mark.diff=null}}return discard}function isMatchNewAnnot(mark,markOffset,markLength,newAnnot){if(mark.search){if(mark.search.search===newAnnot.search&&isSkTextAnnot(newAnnot)){if(newAnnot.offsetStart===markOffset&&newAnnot.len===markLength){mark.search=newAnnot
return true}}}if(mark.diff===newAnnot){return true}return false}function markLen(mark){let l=0
for(let ch=mark.firstChild;ch;ch=ch.nextSibling){if(IS_TxtStrTextNode(ch))l+=xmlLen(ch)
else if(IS_TxtStrNbSp(ch))l+=1
else if(IS_TxtStrMarkNode(ch))l+=markLen(ch)}return l}export class ImeComposition{}
//# sourceMappingURL=txtStr.js.map