import{isWedDefaultDisplay}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{IS_EltWedlet,isDisplayedWedlet,isParentWedlet,isTargetableWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{DOM,ENodeType,EUnknownNodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{isSkAnnotDrawer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export function isWedletSingleElt(wedlet){return wedlet&&"element"in wedlet}export var EWedletArch;(function(EWedletArch){EWedletArch[EWedletArch["dom"]=0]="dom"
EWedletArch[EWedletArch["merged"]=1]="merged"
EWedletArch[EWedletArch["custom"]=2]="custom"})(EWedletArch||(EWedletArch={}))
export function AgWedletSingleElt(cls,config){if(config.isParentWedlet){const proto=cls.prototype
switch(config.wedletArch){case EWedletArch.dom:case EWedletArch.merged:proto.findWedletChild=findWedletChild
proto.visitWedletChildren=visitWedletChildren
break}cls.prototype.findInArea=findInArea}if(config.isCharsWedlet){const proto=cls.prototype
proto.insertChars=insertChars
proto.deleteChars=deleteChars
proto.replaceChars=replaceChars}if(config.isVirtualisableWedlet){const proto=cls.prototype
proto.getVirtualXaPart=getVirtualXaPart}if(config.proxySkAnnots){const proto=cls.prototype
proto.onAddedSkAnnot=onAddedSkAnnot
proto.onRemovedSkAnnot=onRemovedSkAnnot}return cls}function findWedletChild(xaPart,options){var _a
const parent=((_a=this.element)===null||_a===void 0?void 0:_a.delegatedHost)||this.element
for(let ch=parent===null||parent===void 0?void 0:parent.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)&&ch.wedlet.xaPart===xaPart)return ch.wedlet}return null}function visitWedletChildren(from,len,visitor,options){var _a
const parent=((_a=this.element)===null||_a===void 0?void 0:_a.delegatedHost)||this.element
const end=from+len
for(let ch=parent===null||parent===void 0?void 0:parent.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){const xaPart=ch.wedlet.xaPart
if(xaPart==null){if(options&&options.includeVirtuals){if(visitor.call(null,ch.wedlet)==="stop")return"stop"}}else if(typeof xaPart==="number"?xaPart>=from:from===-1){if(xaPart>=end)return
if(visitor.call(null,ch.wedlet)==="stop")return"stop"}}}}function insertChars(from,chars,msg){this.element.insertChars(from,chars,msg)}function deleteChars(from,len,msg){this.element.deleteChars(from,len,msg)}function replaceChars(chars,msg){this.element.replaceChars(chars,msg)}function onAddedSkAnnot(annot){if(isSkAnnotDrawer(this.element))this.element.drawAnnot(annot)}function onRemovedSkAnnot(annot){if(isSkAnnotDrawer(this.element))this.element.eraseAnnot(annot)}function getVirtualXaPart(){if(this.xaPart!=null)return this.xaPart
switch(this.model.nodeType){case ENodeType.attribute:return this.wedNodeName||this.model.nodeName
case ENodeType.document:console.error("getVirtualXaPart() on document bind!")
return null}let prevNode=this.element.previousElementSibling
while(prevNode){if(IS_EltWedlet(prevNode)&&typeof prevNode.wedlet.xaPart==="number"){return prevNode.wedlet.xaPart+1}prevNode=prevNode.previousElementSibling}return 0}function findInArea(cb,area,visitOptions){let rect=this.wedletRect
if(rect===undefined)rect=window.getComputedStyle(this.element).display!=="contents"?this.element.getBoundingClientRect():null
let intersectRect
if(!rect||(intersectRect=GFX.intersect(rect,area))!=null){switch(cb({wedlet:this,intersectRect:intersectRect})){case"next":if(isParentWedlet(this)&&this.visitWedletChildren(-1,Infinity,w=>{if(WEDLET.findWedletInArea(cb,w,area,visitOptions)==="stop")return"stop"},visitOptions)==="stop")return"stop"
return
case"nextSibling":return
case"stop":return"stop"
default:throw Error("Unknown findInArea cb return value.")}}}export class OffView extends HTMLElement{get wedlet(){return this}get wedMgr(){return this.wedParent.wedMgr}get wedAnchor(){return XA.append(this.wedParent.wedAnchor,this.xaPart)}get model(){return OFFVIEW_MODEL}isVirtual(){return false}get element(){return this}get elementHost(){return this}insertElement(parent,insertBefore,slotName,caller){throw Error("Should not be used ?")}initViewOff(wedParent,xaPart,weight){this.wedParent=wedParent
this.xaPart=xaPart
this.weight=weight
this.style.display="block"
this.adjustHeight()
return this}bindWithNode(xaOffset,node,children){}adjustHeight(){this.style.height=Math.max(1,this.weight/100)+"em"}onIntersectChange(entry){if(entry.intersectionRatio===0)return
if(this.isSync())this.drawContentSync(OffView.shouldPreserveScroll!==0)
else this.drawContentAsync(OffView.shouldPreserveScroll!==0)
if(OffView.shouldPreserveScroll!==0){clearTimeout(OffView.shouldPreserveScroll)
OffView.shouldPreserveScroll=0}}isSync(){return this.wedMgr.docHolder!=null}async focusWedlet(){if(this.isSync())this.drawContentSync()
else await this.drawContentAsync()
let newWedlet=this.wedParent.findWedletChild(this.xaPart,WEDLET.VISITOPTIONS_mainBranch)
while(newWedlet){if(newWedlet.focusWedlet){newWedlet.focusWedlet()
OffView.shouldPreserveScroll=setTimeout(()=>{OffView.shouldPreserveScroll=0},50)
break}newWedlet=newWedlet.wedParent}}async highlightFromLink(blockPos){if(this.isSync())this.drawContentSync()
else await this.drawContentAsync()
let newWedlet=this.wedParent.findWedletChild(this.xaPart,WEDLET.VISITOPTIONS_mainBranch)
while(newWedlet){if(isTargetableWedlet(newWedlet)){await newWedlet.highlightFromLink(blockPos)
OffView.shouldPreserveScroll=setTimeout(()=>{OffView.shouldPreserveScroll=0},50)
break}newWedlet=newWedlet.wedParent}}drawContentSync(preserveScroll){if(preserveScroll)this.tryPreserveScroll()
const xa=this.wedAnchor
const wedMgr=this.wedMgr
const jml=wedMgr.getContent(xa)
if(jml&&jml.length>0){this.wedParent.replaceChildBind(this.xaPart,jml[0],jml[1])
wedMgr.dispatchAnnotsAfterRebuildWedlet(xa)}else console.log(`BoxOffView.drawContent : no content at ${xa}`)}async drawContentAsync(preserveScroll){let xa=this.wedAnchor
const wedMgr=this.wedMgr
const fetchJml=await wedMgr.fetchContent(xa)
const jml=fetchJml.result
xa=fetchJml.xa
if(jml&&jml.length>0){if(preserveScroll)this.tryPreserveScroll()
this.wedParent.replaceChildBind(this.xaPart,jml[0],jml[1])
wedMgr.dispatchAnnotsAfterRebuildWedlet(xa)}else console.log(`BoxOffView.drawContent : no content at ${xa}`)}tryPreserveScroll(){if(!OffView.reqScrollFreeze){const scrollRoot=this.wedMgr.wedEditor.scrollContainer
if(!scrollRoot)return
const eltRef=DOMSH.findDeepActiveElement(DOMSH.findDocumentOrShadowRoot(this))
if(eltRef){const oriSrcollTop=scrollRoot.scrollTop
const eltRect=eltRef.getBoundingClientRect()
OffView.reqScrollFreeze=()=>{OffView.reqScrollFreeze=null
const newEltRect=eltRef.getBoundingClientRect()
scrollRoot.scrollTop=oriSrcollTop+newEltRect.top-eltRect.top}
requestAnimationFrame(OffView.reqScrollFreeze)}}}connectedCallback(){this.wedMgr.intersectObs.observe(this)}disconnectedCallback(){this.wedMgr.intersectObs.unobserve(this)}configWedletElt(tpl,wedlet){}refreshBindValue(val){const node=XA.findDomLast(this.wedAnchor,this.wedMgr.docHolder.getDocument())
this.weight=JML.computeWeightNode(node)
this.adjustHeight()}findWedletChild(xaPart,options){if(!options||!options.forceFetch)return null
options.contentUpdated=true
const prev=DOM.findPreviousSibling(this,IS_EltWedlet)
const parent=this.parentNode
if(this.isSync()){this.drawContentSync()
const newElt=prev?DOM.findNextSibling(prev,IS_EltWedlet):DOM.findFirstChild(parent,IS_EltWedlet)
return newElt&&isParentWedlet(newElt.wedlet)?newElt.wedlet.findWedletChild(xaPart,options):null}else{(options.forceFetchPromises&&(options.forceFetchPromises=[])).push(this.drawContentAsync().then(()=>{const newElt=prev?DOM.findNextSibling(prev,IS_EltWedlet):DOM.findFirstChild(parent,IS_EltWedlet)
return newElt&&isParentWedlet(newElt.wedlet)?newElt.wedlet.findWedletChild(xaPart,options):null}))}}visitWedletChildren(from,len,visitor,options){if(!options||!options.forceFetch)return null
const prev=DOM.findPreviousSibling(this,IS_EltWedlet)
const parent=this.parentNode
if(this.isSync()){this.drawContentSync()
const newElt=prev?DOM.findNextSibling(prev,IS_EltWedlet):DOM.findFirstChild(parent,IS_EltWedlet)
return newElt&&isParentWedlet(newElt.wedlet)?newElt.wedlet.visitWedletChildren(from,len,visitor):undefined}else{(options.forceFetchPromises&&(options.forceFetchPromises=[])).push(this.drawContentAsync().then(()=>{const newElt=prev?DOM.findNextSibling(prev,IS_EltWedlet):DOM.findFirstChild(parent,IS_EltWedlet)
return newElt&&isParentWedlet(newElt.wedlet)?newElt.wedlet.visitWedletChildren(from,len,visitor):undefined}))}}insertChildNode(xaOffest,node,children){this.weight+=JML.computeWeightJml([node,children])}onChildNodesInserted(){this.adjustHeight()}replaceChildBind(xaOffest,node,children){this.refreshBindValue(null)}insertAttrNode(nameAttr,value){}deleteAttrNode(nameAttr){}deleteChildNodes(xaOffest,count){this.refreshBindValue(null)}updateInDescendants(msg){this.refreshBindValue(null)}isEmpty(){return false}}OffView.shouldPreserveScroll=0
const OFFVIEW_MODEL=Object.freeze({nodeType:EUnknownNodeType.unknown,initModel:function(config){}})
window.customElements.define("wed-offview",OffView)
export var WEDLET_SINGLEELT;(function(WEDLET_SINGLEELT){function insertChildNode(wedlet,xaOffset,node,children,childrenElts,defaultWedSelector,insertBefore){const wedMgr=wedlet.wedMgr
let wedletCh
if(childrenElts){const childrenElt=WEDLET.findChildrenEltForNode(childrenElts,node,wedlet,xaOffset)
if(!childrenElt)return
let model
const display=wedMgr.wedModel.findDisplayForNode(node,childrenElt)
if(display){const dispWedlet=WEDLET.findVirtualWedletFrom(display,wedlet.elementHost,insertBefore)
if(dispWedlet){if(dispWedlet.getVirtualXaPart()===xaOffset){dispWedlet.bindWithNode(xaOffset,node,children)
return}}model=display.wedletModel||wedMgr.wedModel.findModelForNodeFromCh(node,wedlet,childrenElt)}else{model=wedMgr.wedModel.findModelForNodeFromCh(node,wedlet,childrenElt)}wedletCh=model?model.createWedlet(wedlet,display):null
if(!wedletCh)return
wedletCh.insertElement(wedlet.elementHost,insertBefore,childrenElt.wedSlotName,childrenElt)}else{const model=wedMgr.wedModel.findModelForNode(node,null,null,wedlet,defaultWedSelector)
wedletCh=model?model.createWedlet(wedlet):null
if(!wedletCh)return
wedletCh.insertElement(wedlet.elementHost,insertBefore)}return wedletCh.bindWithNode(xaOffset,node,children)}WEDLET_SINGLEELT.insertChildNode=insertChildNode
function findInsertPointForAttr(wedMgr,wedlet,wedletXa,attrName,slot){let found=false
const attsOrder=wedlet.model.attsOrder
const idx=attsOrder===null||attsOrder===void 0?void 0:attsOrder.indexOf(attrName)
let nextFound
if(idx>=0){wedlet.visitWedletChildren(-1,Infinity,w=>{if(!isWedletSingleElt(w)||w.element.slot!=slot)return
if(w.model.nodeType===ENodeType.attribute){if(attsOrder.indexOf(w.model.nodeName)>idx){nextFound=w
return"stop"}}else if(w.model.nodeType===ENodeType.element){nextFound=w
return"stop"}},WEDLET.VISITOPTIONS_includeVirtuals)}else{wedlet.visitWedletChildren(-1,1,w=>{if(!isWedletSingleElt(w))return
if(w.model.nodeType===ENodeType.element){nextFound=w
return"stop"}},WEDLET.VISITOPTIONS_includeVirtuals)}return nextFound}function insertAttrNode(wedlet,attrName,value,childrenElts,defaultWedSelector){const wedMgr=wedlet.wedMgr
let model
let childrenElt
if(childrenElts){childrenElt=WEDLET.findChildrenEltForAttr(childrenElts,attrName)
if(!childrenElt)return
const display=wedMgr.wedModel.findDisplayForAttr(attrName,childrenElt)
if(display){const dispWedlet=WEDLET.findVirtualWedletFrom(display,wedlet.elementHost)
if(dispWedlet){dispWedlet.bindWithAttr(attrName,value)
return}model=display.wedletModel||wedMgr.wedModel.findModelForAttr(attrName,value,childrenElt.wedModesAtts,childrenElt.wedVariants,wedlet,childrenElt.wedSelector,childrenElt.wedPreferedModels,childrenElt.wedParams)}else{model=wedMgr.wedModel.findModelForAttr(attrName,value,childrenElt.wedModesAtts,childrenElt.wedVariants,wedlet,childrenElt.wedSelector,childrenElt.wedPreferedModels,childrenElt.wedParams)}}else{model=wedMgr.wedModel.findModelForAttr(attrName,value,null,null,wedlet,defaultWedSelector)}const attWedlet=model?model.createWedlet(wedlet):null
if(!attWedlet)return
let nextFound=findInsertPointForAttr(wedMgr,wedlet,wedlet.wedAnchor,attrName,childrenElt===null||childrenElt===void 0?void 0:childrenElt.wedSlotName)
attWedlet.insertElement(wedlet.elementHost,nextFound===null||nextFound===void 0?void 0:nextFound.element,childrenElt===null||childrenElt===void 0?void 0:childrenElt.wedSlotName,childrenElt)
return attWedlet.bindWithAttr(attrName,value)}WEDLET_SINGLEELT.insertAttrNode=insertAttrNode
function deleteChildNodes(wedlet,xaOffest,count){const xaEnd=xaOffest+count
let ch=wedlet.elementHost.lastElementChild
while(ch){const next=ch.previousElementSibling
if(IS_EltWedlet(ch)){const chWedlet=ch.wedlet
const xaPart=chWedlet.xaPart
if(typeof xaPart==="number"&&xaPart>=xaOffest){if(xaPart<xaEnd){if(isDisplayedWedlet(chWedlet)&&!wedlet.wedMgr.wedEditor.config.disableVirtuals&&!DOM.findPreviousSibling(ch,n=>IS_EltWedlet(n)&&n.wedlet.model===chWedlet.model)){chWedlet.bindAsVirtual()}else{if("onDelete"in chWedlet)chWedlet.onDelete()
ch.remove()}}else{chWedlet.xaPart=xaPart-count}}}ch=next}}WEDLET_SINGLEELT.deleteChildNodes=deleteChildNodes
function deleteAttrNode(wedlet,attName){for(let ch=wedlet.elementHost.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){if(ch.wedlet.xaPart===attName){if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()}}}}WEDLET_SINGLEELT.deleteAttrNode=deleteAttrNode
function adjustVirtuals(wedlet,childrenElts){const wedMgr=wedlet.wedMgr
if(childrenElts&&wedlet.elementHost.getAttribute("adjust-virtuals")!=="no"&&!wedMgr.wedEditor.config.disableVirtuals){const addAfterBatch=adjustVirtualsTasks.size===0
adjustVirtualsTasks.set(wedlet,childrenElts)
if(addAfterBatch)wedMgr.doAfterBatch(adjustVirtualsExecute)}else{if(wedlet.element.onChildWedletsChange)wedlet.element.onChildWedletsChange()}}WEDLET_SINGLEELT.adjustVirtuals=adjustVirtuals
const adjustVirtualsTasks=new Map
function adjustVirtualsExecute(){adjustVirtualsTasks.forEach((childrenElts,wedlet)=>{try{if(!wedlet.element)return
if(childrenElts.length>1){const binds=new Map
for(let ch=DOM.findFirstChild(wedlet.elementHost,IS_EltWedlet);ch;ch=DOM.findNextSibling(ch,IS_EltWedlet)){let list=binds.get(ch.fromChildrenElt)
if(list===undefined)binds.set(ch.fromChildrenElt,list=[])
if(ch.wedlet.isVirtual())list.push(ch)
else list.hasRealBind=true}const xa=wedlet.wedAnchor
for(let i=0;i<childrenElts.length;i++){const childrenElt=childrenElts[i]
adjustVirtualsForChildrenElt(wedlet,xa,childrenElt,binds.get(childrenElt))}}else{let list
let ch=DOM.findFirstChild(wedlet.elementHost,IS_EltWedlet)
if(ch){list=[]
for(;ch;ch=DOM.findNextSibling(ch,IS_EltWedlet))if(ch.wedlet.isVirtual())list.push(ch)
else list.hasRealBind=true}adjustVirtualsForChildrenElt(wedlet,wedlet.wedAnchor,childrenElts[0],list)}}catch(e){console.error(e)}if(wedlet.doCustomAdjust)wedlet.doCustomAdjust()})
adjustVirtualsTasks.clear()}function adjustVirtualsForChildrenElt(wedlet,xa,childrenElt,virtualsList){if(childrenElt.wedDefaultDisplay){if(!virtualsList||!virtualsList.hasRealBind){adjustVirtualsForDisplay(wedlet,xa,childrenElt,childrenElt.wedDefaultDisplay,virtualsList)}}else if(childrenElt.wedDisplays){for(let i=0;i<childrenElt.wedDisplays.length;i++){adjustVirtualsForDisplay(wedlet,xa,childrenElt,childrenElt.wedDisplays[i],virtualsList)}}if(virtualsList)for(let i=0;i<virtualsList.length;i++){const eltWedlet=virtualsList[i]
if(eltWedlet&&isDisplayedWedlet(eltWedlet.wedlet))eltWedlet.wedlet.deleteVirtualWedlet()}}function adjustVirtualsForDisplay(wedlet,xa,childrenElt,displayElt,virtualsList){const modes=displayElt.wedNodeType===ENodeType.attribute?childrenElt.wedModesAtts:childrenElt.wedModesNodes
const model=displayElt.wedletModel||wedlet.wedMgr.wedModel.findModelForVirtual(displayElt.wedNodeType,displayElt.wedNodeName,modes,childrenElt.wedVariants,wedlet,childrenElt.wedSelector,childrenElt.wedPreferedModels,childrenElt.wedParams)
if(model){if(model.config.hasAttribute("denyVirtual"))return
const insertBefore=findInsertBeforeVirtual(wedlet,xa,model,childrenElt.wedSlotName)
if(insertBefore!=="noInsert"){if(!isVirtualAlreadyInPlace(insertBefore?insertBefore.previousSibling:wedlet.elementHost.lastChild,model,virtualsList)){const displayedWedlet=model.createWedlet(wedlet,displayElt)
if(displayedWedlet){if(!isVirtualRecursive(wedlet,model)){displayedWedlet.insertElement(wedlet.elementHost,insertBefore,childrenElt.wedSlotName,childrenElt)
displayedWedlet.bindAsVirtual()}else if("switchToRecursiveVirtualButton"in displayedWedlet){displayedWedlet.switchToRecursiveVirtualButton()
displayedWedlet.insertElement(wedlet.elementHost,insertBefore,childrenElt.wedSlotName,childrenElt)}}}}}else{console.log("Display not found for ",childrenElt)}}function isVirtualRecursive(parent,childModel){while(parent&&parent.isVirtual()){if(parent.model===childModel)return true
parent=parent.wedParent}return false}function isVirtualAlreadyInPlace(elt,childModel,virtualsList){while(elt){if(IS_EltWedlet(elt)){if(!elt.wedlet.isVirtual()&&childModel.nodeType!==ENodeType.attribute){return false}if(elt.wedlet.model===childModel){if(virtualsList)for(let i=0;i<virtualsList.length;i++){if(virtualsList[i]===elt){virtualsList[i]=null
return true}}}}elt=elt.previousSibling}return false}function findInsertBeforeVirtual(wedlet,xa,model,slot){const offset=wedlet.isVirtual()?0:wedlet.wedMgr.docHolder.getInsertableOffset(xa,model.nodeType,"reject",model.nodeName)
if(offset<0)return"noInsert"
if(model.nodeType===ENodeType.attribute){const nextWedlet=findInsertPointForAttr(wedlet.wedMgr,wedlet,xa,model.nodeName,slot)
return nextWedlet===null||nextWedlet===void 0?void 0:nextWedlet.element}else{const nextWedlet=wedlet.findWedletChild(offset,WEDLET.VISITOPTIONS_mainBranch)
let nextS=isWedletSingleElt(nextWedlet)?nextWedlet.element:null
while(IS_EltWedlet(nextS)&&(nextS.wedlet.isVirtual()||nextS.wedlet.model.nodeType===ENodeType.comment))nextS=nextS.nextSibling
return nextS}}function clearChildrenAsVirtual(wedlet){const elt=wedlet.elementHost
let ch=elt.firstElementChild
while(ch){const next=ch.nextElementSibling
if(IS_EltWedlet(ch)){if(ch.wedlet!==wedlet){if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()}else if(isDisplayedWedlet(ch.wedlet)&&!isWedDefaultDisplay(ch.wedlet.displayCtx)){ch.wedlet.bindAsVirtual()}}ch=next}}WEDLET_SINGLEELT.clearChildrenAsVirtual=clearChildrenAsVirtual
function reselectOnVirtualizing(elt){try{let w=elt.wedlet
const wedletStack=[]
while(!w.element||!w.element.isConnected){wedletStack.push(w)
w=w.wedParent}for(let i=wedletStack.length-1;i>=0;i--){const target=wedletStack[i]
w.visitWedletChildren(-1,Infinity,ch=>{if(ch.isVirtual()&&ch.model===target.model){w=ch
return"stop"}},{includeVirtuals:true})}w.focusWedlet()}catch(e){}}WEDLET_SINGLEELT.reselectOnVirtualizing=reselectOnVirtualizing})(WEDLET_SINGLEELT||(WEDLET_SINGLEELT={}))

//# sourceMappingURL=wedletSingleElt.js.map