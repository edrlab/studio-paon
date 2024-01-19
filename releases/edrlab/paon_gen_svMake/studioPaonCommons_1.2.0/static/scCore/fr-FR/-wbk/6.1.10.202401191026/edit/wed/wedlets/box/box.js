import{AgWedletBoxSelectionSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgWedletInsMgr,markInserts}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{isWedDefaultDisplay,WED,WedletModelBase,WedModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{BoxCreate}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{IS_EltSkAnnot,IS_EltWedlet,isDisplayedWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AgWedletSingleElt,EWedletArch,isWedletSingleElt,OffView,WEDLET_SINGLEELT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{DOM,ENodeType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JML,JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{FetchJml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{OffscreenEltLeafWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/offscreen/offscreen.js"
import{isSkAnnotDrawer,isSkAnnotFocuser,isSkStructDef,isSkTextAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{EventMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/events.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export const BOX_NS="scenari.eu:wed:box"
export class BoxModel{get isBoxFamily(){return true}initModel(cnf){this.wedletClass=BoxWedlet
this.config=cnf
if(cnf.childElementCount!==1)throw Error(`This wedlet must contain one and only one wedlet element: ${DOM.ser(cnf)}`)
this.nodeLabel=cnf.getAttribute("label")
this.childrenEltsNaturalOrder=WEDLET.extractChildrenNodes(cnf,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_BOX)
if(this.childrenEltsNaturalOrder){if(this.childrenEltsNaturalOrder.length>1){this.childrenElts=this.childrenEltsNaturalOrder.slice()
this.childrenElts.sort(WED.SORT_ChildrenElts)}else{this.childrenElts=this.childrenEltsNaturalOrder}}else{this.defaultWedSelector=WEDLET.findWedSelector(cnf.firstElementChild)||WED_SELECTOR_BOX}}createWedlet(parent,displayContext){return(new this.wedletClass).init(parent,this,displayContext)}createRootWedlet(wContainer,insertBefore,wedMgr){const wedlet=(new this.wedletClass).initAsRoot(wedMgr,this)
wedlet.insertElement(wContainer,insertBefore)
return wedlet}buildModelForFragment(insertCtx){var _a
const model=new BoxModel
model.childrenEltsNaturalOrder=[]
const doc=this.config.ownerDocument
const bind=doc.createElementNS(WED.WED_NS,"bind")
bind.setAttribute("nodeType","all")
bind.setAttribute("wedlet","Box")
const styleCtn=insertCtx?DOMSH.findHost(insertCtx.elementHost):null
const box=bind.appendChild(doc.createElementNS(DOM.XHTML_NS,"box-static"))
if(styleCtn){let skins=styleCtn.getAttribute("skins4frag")
if(skins){box.setAttribute("skins4frag",skins)
const skinList=skins.split(" ")
for(let i=0;i<skinList.length;i++){const sk=skinList[i]
if(sk.charAt(0)==="#"){const styleTag=styleCtn.shadowRoot.getElementById(sk.substring(1))
if(styleTag)box.appendChild(styleTag.cloneNode(true))
skins=null
skinList.splice(i--,1)}}box.setAttribute("skinOver",skins||skinList.join(" "))}}const boxHost=box.appendChild(doc.createElementNS(DOM.XHTML_NS,"box-host"))
const slot=boxHost.appendChild(doc.createElementNS(WED.WED_NS,"wed:slot"))
if(this.childrenEltsNaturalOrder)for(const parentChElts of this.childrenEltsNaturalOrder){const children=slot.appendChild(doc.createElementNS(WED.WED_NS,"children"))
children.wedMatcher=parentChElts.wedMatcher
children.wedMatchStrict=parentChElts.wedMatchStrict
children.wedModesNodes=parentChElts.wedModesNodes
children.wedModesAtts=parentChElts.wedModesAtts
children.wedVariants=parentChElts.wedVariants
children.wedParams=parentChElts.wedParams
children.wedSlotName=""
children.wedSelector=parentChElts.wedSelector
children.wedPreferedModels=parentChElts.wedPreferedModels
if(parentChElts.wedDisplays){children.wedPreferedModels=((_a=children.wedPreferedModels)===null||_a===void 0?void 0:_a.slice())||[]
for(const disp of parentChElts.wedDisplays){if(disp.wedletModel)children.wedPreferedModels.push(disp.wedletModel)}}model.childrenEltsNaturalOrder.push(children)}model.wedletClass=BoxWedlet
model.config=bind
if(model.childrenEltsNaturalOrder.length>1){model.childrenElts=model.childrenEltsNaturalOrder.slice()
model.childrenElts.sort(WED.SORT_ChildrenElts)}else{model.childrenElts=model.childrenEltsNaturalOrder}return model}get attsOrder(){if(this._attsOrder==undefined){this._attsOrder=[]
if(this.childrenEltsNaturalOrder)for(let wedCh of this.childrenEltsNaturalOrder){let bind=wedCh.firstElementChild
while(bind){const att=bind.getAttribute("attName")
if(att)this._attsOrder.push(att)
bind=bind.nextElementSibling}}}return this._attsOrder}}WED.registerWedletModel("Box",BoxModel)
export class BoxVirtualSwitchModel extends BoxModel{initModel(cnf){this.wedletClass=BoxVirtualSwitchWedlet
this.config=cnf
if(cnf.childElementCount!==2)throw Error(`This wedlet must contain two and only two children elements: ${DOM.ser(cnf)}`)
this.nodeLabel=cnf.getAttribute("label")
this.virtualEltWedletConfig=cnf.firstElementChild
this.realEltWedletConfig=cnf.lastElementChild
this.chEltsNatOrderVirtual=WEDLET.extractChildrenNodes(this.virtualEltWedletConfig,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_BOX)
this.childrenEltsNaturalOrder=WEDLET.extractChildrenNodes(this.realEltWedletConfig,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_BOX)
if(this.childrenEltsNaturalOrder){this.childrenElts=this.childrenEltsNaturalOrder.slice()
this.childrenElts.sort(WED.SORT_ChildrenElts)}else{this.defaultWedSelector=WEDLET.findWedSelector(this.realEltWedletConfig)||WED_SELECTOR_BOX}}}WED.registerWedletModel("BoxVirtualSwitch",BoxVirtualSwitchModel)
export class BoxCommentModel extends BoxModel{initModel(cnf){this.wedletClass=BoxCommentWedlet
this.config=cnf
const count=cnf.childElementCount
if(count<2||count>3)throw Error(`This wedlet must contain 2 or 3 children elements: ${DOM.ser(cnf)}`)
this.nodeLabel="Commentaire"
this.textCmtConfig=cnf.firstElementChild
if(cnf.lastElementChild.previousElementSibling!==cnf.firstElementChild){this.exclCmtConfig=cnf.lastElementChild.previousElementSibling}this.scCmtConfig=cnf.lastElementChild}}WED.registerWedletModel("BoxScComment",BoxCommentModel)
export const WED_SELECTOR_BOX=function(wedModel,node,ctx){if(wedModel.isBoxFamily)return WedModel.SELECTOR_PERFECT_MATCH
return WedModel.SELECTOR_REJECT}
export class BoxWedlet{get elementHost(){return this.element?this.element.delegatedHost||this.element:null}get wedMgr(){return this.wedParent.wedMgr}get wedAnchor(){return XA.append(this.wedParent.wedAnchor,this.xaPart!=null?this.xaPart:this.getVirtualXaPart())}init(host,model,displayContext){this.wedParent=host
this.model=model
if(displayContext)this.displayCtx=displayContext
this.createElement(model.config.firstElementChild)
return this}initAsRoot(wedMgr,model){Object.defineProperty(this,"wedMgr",{writable:false,value:wedMgr})
this.model=model
this.createElement(model.config.firstElementChild)
return this}bindRoot(children,node,xaRoot){Object.defineProperty(this,"wedAnchor",{writable:false,value:XA.freeze(xaRoot||[])})
this.xaPart=XA.last(this.wedAnchor)||0
return this._bind(node,children)}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
if(!this.model.nodeName&&this.model.nodeType===ENodeType.element){this.wedNodeName=JML.jmlNode2name(node)}return this._bind(node,children)}_bind(node,children){this.refreshEditMode()
this.element.refreshBindValue(node,children)
let promises=WEDLET.appendAttWedlets(this,node,this.xInsertAttWedlet)
if(children)promises=this.xAppendChildWedlets(children,promises)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)
if(promises!=null)return Promise.all(promises)}bindWithAttr(nameAttr,value){this.xaPart=nameAttr
if(!this.model.nodeName)this.wedNodeName=nameAttr
this.refreshEditMode()
this.element.refreshBindValue(value)
this.doCustomAdjust()}createElement(root){this.element=document.importNode(root,false)
this.element.configWedletElt(root,this)}insertElement(parent,insertBefore,slotName,caller){if(slotName)this.element.setAttribute("slot",slotName)
if(caller)this.element.fromChildrenElt=caller
parent.insertBefore(this.element,insertBefore)}insertChildNode(xaOffest,node,children){let result
for(let ch=this.elementHost.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){const xaPart=ch.wedlet.xaPart
if(xaPart>xaOffest){ch.wedlet.xaPart=xaPart+1}else if(xaPart===xaOffest){result=this.xInsertChildWedlet(xaOffest,node,children,ch)||null
ch.wedlet.xaPart=xaPart+1}}}if(result===undefined)result=this.xInsertChildWedlet(xaOffest,node,children,null)
return result}onDelete(){this.visitWedletChildren(-1,Number.MAX_SAFE_INTEGER,w=>{if("onDelete"in w)w.onDelete()})
this.element=null}onChildNodesInserted(){WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)}replaceChildBind(xaOffest,node,children){for(let ch=this.elementHost.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){if(ch.wedlet.xaPart===xaOffest){let next=ch.nextElementSibling
while(IS_EltWedlet(next)&&next.wedlet.isVirtual())next=next.nextElementSibling
if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()
const result=this.xInsertChildWedlet(xaOffest,node,children,next)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)
return result}}}}redrawFull(){if(typeof this.xaPart==="number"){this.wedMgr.docHolderAsync.fetchContent([new FetchJml(this.wedAnchor)]).then(([f])=>{if(this.element.isConnected)this.wedParent.replaceChildBind(this.xaPart,f.result[0],f.result[1])})}}deleteChildNodes(xaOffest,count){WEDLET_SINGLEELT.deleteChildNodes(this,xaOffest,count)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)}insertAttrNode(attrName,value){const result=this.xInsertAttWedlet(attrName,value)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)
return result}xInsertAttWedlet(attrName,value){return WEDLET_SINGLEELT.insertAttrNode(this,attrName,value,this.model.childrenElts,this.model.defaultWedSelector)}deleteAttrNode(attName){WEDLET_SINGLEELT.deleteAttrNode(this,attName)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)}onChildEmptied(willBeEmptied){if(!isDisplayedWedlet(this)||isWedDefaultDisplay(this.displayCtx))return null
return WEDLET.onChildEmptied(this,willBeEmptied)}injectForeignChild(similarTo,elt,before,after,options){const model=this.model
let slot=null
if(model.childrenElts){if(model.childrenElts.length===1){slot=model.childrenElts[0].wedSlotName}else{let childrenElt
if(isSkStructDef(similarTo)){childrenElt=model.childrenElts.find(c=>c.wedMatcher.matchStruct(similarTo))}else if(similarTo instanceof Attr){childrenElt=model.childrenElts.find(c=>c.wedMatcher.matchAttr(similarTo.nodeName))}else if(similarTo instanceof Node){childrenElt=model.childrenElts.find(c=>c.wedMatcher.matchNode(JML.dom2jmlNode(similarTo)))}else{childrenElt=model.childrenElts.find(c=>c.wedMatcher.matchNode(similarTo))}if(childrenElt)slot=childrenElt.wedSlotName}}if(slot)elt.setAttribute("slot",slot)
const parent=this.elementHost
let beforeNode
if(isWedletSingleElt(before)){beforeNode=this.findPreviousInsBefore(parent,before.element,similarTo)}else if(isWedletSingleElt(after)){let stopPoint=after.element.nextElementSibling
let doc
let xa
let eltName
while(stopPoint){if(IS_EltWedlet(stopPoint)){if(stopPoint.wedlet.isVirtual()){if(!doc){doc=this.wedMgr.docHolder
xa=this.wedAnchor
eltName=isSkStructDef(similarTo)?similarTo.structName:similarTo instanceof Node?similarTo.nodeName:JML.jmlNode2name(similarTo)}if(doc.checkSchemaOrder(xa,eltName,stopPoint.wedlet.model.nodeName))break}else if(LANG.in(stopPoint.wedlet.model.nodeType,ENodeType.element,ENodeType.attribute)){break}}stopPoint=stopPoint.nextElementSibling}beforeNode=stopPoint||after.element.nextSibling}else{beforeNode=this.findPreviousInsBefore(parent,null,similarTo)}parent.insertBefore(elt,beforeNode)}findPreviousInsBefore(parent,from,similarTo){let stopPoint=from==null?parent.lastElementChild:from.previousElementSibling
let doc
let xa
let eltName
while(stopPoint){if(IS_EltWedlet(stopPoint)){if(stopPoint.wedlet.isVirtual()){if(!doc){doc=this.wedMgr.docHolder
xa=this.wedAnchor
eltName=isSkStructDef(similarTo)?similarTo.structName:similarTo instanceof Node?similarTo.nodeName:JML.jmlNode2name(similarTo)}if(doc.checkSchemaOrder(xa,stopPoint.wedlet.model.nodeName,eltName)===false){stopPoint=stopPoint.previousElementSibling
continue}}}break}return stopPoint?stopPoint.nextSibling:parent.firstChild}getEditModeForDesc(target){var _a
if((_a=this.element)===null||_a===void 0?void 0:_a.collapsed)return(target===null||target===void 0?void 0:target.isVirtual())?WEDLET.HIDDEN_MUST:WEDLET.READSTATIC_MUST
return undefined}refreshEditMode(){const old=this.editMode
this.editMode=WEDLET.resolveEditMode(this)
if(this.element&&old!==this.editMode&&"setEditMode"in this.element)this.element.setEditMode(this.editMode)
else if(typeof this.element.reassessPerms==="function")this.element.reassessPerms()}switchToRecursiveVirtualButton(){this.xaPart=null
this.element=new BoxCreate
this.element.configWedletElt(BoxWedlet.getRecursiveVirtualButtonTpl(),this)
if(this.model.nodeLabel)this.element.appendChild(document.createElement("span")).appendChild(document.createTextNode(this.model.nodeLabel))}static getRecursiveVirtualButtonTpl(){if(!BoxWedlet._RecursVirtBtnTpl){const elt=BoxWedlet._RecursVirtBtnTpl=new BoxCreate
elt.setAttribute("skinOver","box-create/recursive")}return BoxWedlet._RecursVirtBtnTpl}xInsertChildWedlet(index,node,children,insertBefore){if(typeof node==="number"){const elt=(new OffView).initViewOff(this,index,node)
const childrenElt=WEDLET.findChildrenEltForNode(this.model.childrenElts,null,this,index)
if(childrenElt&&childrenElt.wedSlotName)elt.setAttribute("slot",childrenElt.wedSlotName)
elt.fromChildrenElt=childrenElt
let previousNotVirtual=insertBefore?insertBefore.previousElementSibling:this.elementHost.lastElementChild
while(previousNotVirtual&&IS_EltWedlet(previousNotVirtual)&&previousNotVirtual.wedlet.isVirtual()){insertBefore=previousNotVirtual
previousNotVirtual=previousNotVirtual.previousElementSibling}this.elementHost.insertBefore(elt,insertBefore)}else{return WEDLET_SINGLEELT.insertChildNode(this,index,node,children,this.model.childrenElts,this.model.defaultWedSelector,insertBefore)}}xAppendChildWedlets(children,promises){const it=new JmlSubSetIterator(children)
while(it.next()){const promise=this.xInsertChildWedlet(it.currentIdx,it.currentNode,it.currentChildren)
if(promise){if(!promises)promises=[promise]
else promises.push(promise)}}return promises}isVirtual(){return this.xaPart===null}bindAsVirtual(){this.xaPart=null
if(!this.model.nodeName&&(this.model.nodeType===ENodeType.element||this.model.nodeType===ENodeType.attribute)){this.wedNodeName=(this.displayCtx?this.displayCtx.wedNodeName:null)||"x"}this.refreshEditMode()
WEDLET_SINGLEELT.clearChildrenAsVirtual(this)
this.element.refreshBindValue(null)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.childrenEltsNaturalOrder)}deleteVirtualWedlet(){this.element.remove()}newJml(){switch(this.model.nodeType){case ENodeType.element:return{"":this.wedNodeName||this.model.nodeName}
case ENodeType.text:return""
case ENodeType.comment:return{"":JML.COMMENT}}return null}isEmpty(){if(this.isVirtual())return true
if((!isDisplayedWedlet(this)||isWedDefaultDisplay(this.displayCtx))&&this.wedMgr.rootWedlet!==this)return false
switch(this.model.nodeType){case ENodeType.element:case ENodeType.document:case ENodeType.documentFragment:let empty=true
this.visitWedletChildren(-1,Infinity,wedlet=>{if(!wedlet.isEmpty()){empty=false
return"stop"}},WEDLET.VISITOPTIONS_mainBranch)
return empty
case ENodeType.text:case ENodeType.attribute:return this.element.isEmpty()
default:return false}}get isCollapsed(){return false}doCustomAdjust(){if(this.element.onChildWedletsChange)this.element.onChildWedletsChange()
if(this.customAdjust)this.customAdjust.emit(this)}addCustomAdjust(lstn,order){if(!this.customAdjust)this.customAdjust=new EventMgr
this.customAdjust.add(lstn,order)}focusSkAnnot(annot){if(typeof annot.offset==="number"){const a=DOM.findFirstChild(this.elementHost,n=>IS_EltSkAnnot(n)&&n.skAnnot===annot)
if(a){a.focus()
return true}}else if(isSkTextAnnot(annot)){if(isSkAnnotFocuser(this.element)&&this.element.focusSkAnnot(annot))return true
const sh=this.element.shadowRoot
if(sh)return DOM.findNext(sh,sh,n=>isSkAnnotFocuser(n)?n.focusSkAnnot(annot):false)!=null}return false}}AgWedletInsMgr(AgWedletBoxSelectionSingleElt(AgWedletSingleElt(BoxWedlet,{wedletArch:EWedletArch.dom,isParentWedlet:true,isCharsWedlet:true,isVirtualisableWedlet:true,proxySkAnnots:true})))
export class BoxVirtualSwitchWedlet extends BoxWedlet{init(host,model,displayContext){this.wedParent=host
this.model=model
if(displayContext)this.displayCtx=displayContext
return this}insertElement(parent,insertBefore,slotName,caller){this.eltParent=parent
this.eltBefore=insertBefore
this.eltSlot=slotName
this.eltCaller=caller}resetElt(real){let parent
let insertBefore
let slot
let caller
if(this.element){parent=this.element.parentNode
insertBefore=this.element.nextSibling
slot=this.element.getAttribute("slot")
caller=this.element.fromChildrenElt
this.element.remove()}else{parent=this.eltParent
insertBefore=this.eltBefore
slot=this.eltSlot
caller=this.eltCaller
this.eltParent=undefined
this.eltBefore=undefined
this.eltSlot=undefined
this.eltCaller=undefined}this.createElement(real?this.model.realEltWedletConfig:this.model.virtualEltWedletConfig)
if(slot)this.element.setAttribute("slot",slot)
if(caller)this.element.fromChildrenElt=caller
parent.insertBefore(this.element,insertBefore)}bindWithNode(xaOffset,node,children){this.resetElt(true)
super.bindWithNode(xaOffset,node,children)}bindWithAttr(nameAttr,value){this.resetElt(true)
super.bindWithAttr(nameAttr,value)}bindAsVirtual(){if(!this.model.nodeName&&(this.model.nodeType===ENodeType.element||this.model.nodeType===ENodeType.attribute)){this.wedNodeName=(this.displayCtx?this.displayCtx.wedNodeName:null)||"x"}this.resetElt(false)
this.xaPart=null
this.refreshEditMode()
this.element.refreshBindValue(null)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.chEltsNatOrderVirtual)}get isCollapsed(){return this.isVirtual()}markInserts(datas){if(this.isVirtual())return"nextSibling"
return markInserts.call(this,datas)}}export class BoxCommentWedlet extends BoxWedlet{createElement(root){this.element=document.createElement("template")
this.element.configWedletElt=()=>{}
this.element.wedlet=this}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
this.wedMgr.doAfterBatch(async()=>{const cmtHolder=this.wedMgr.docHolderAsync.getCmtHouse(this.wedAnchor)
if(cmtHolder){this.cmtHouse=cmtHolder.futureHouse
if(cmtHolder.type==="scCmt"&&this.model.scCmtConfig){if(!window.customElements.get("box-sccomment"))await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxScComment.js")
this.initComment(this.model.scCmtConfig,node)
return}else if(cmtHolder.type==="scExcl"&&this.model.exclCmtConfig){if(!window.customElements.get("box-scexclude"))await import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxScExclude.js")
this.initComment(this.model.exclCmtConfig,node)
return}}this.initComment(this.model.textCmtConfig,node)})}bindAsVirtual(){this.xaPart=null
return import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxScComment.js").then(()=>{this.initComment(this.model.scCmtConfig,null)})}initComment(tpl,node){const oldElt=this.element
super.createElement(tpl)
this.insertElement(oldElt.parentElement,oldElt,oldElt.getAttribute("slot"),oldElt.fromChildrenElt)
oldElt.remove()
this.refreshEditMode()
this.element.refreshBindValue(node)
this.doCustomAdjust()
if(this.pendingAnnots&&isSkAnnotDrawer(this.element)){for(const an of this.pendingAnnots)this.element.drawAnnot(an)
this.pendingAnnots=null}}onAddedSkAnnot(annot){if(this.element.localName==="template"){if(!this.pendingAnnots)this.pendingAnnots=[annot]
else this.pendingAnnots.push(annot)}else{if(isSkAnnotDrawer(this.element))this.element.drawAnnot(annot)}}onRemovedSkAnnot(annot){if(this.element.localName==="template"){if(this.pendingAnnots){const i=this.pendingAnnots.indexOf(annot)
if(i>=0)this.pendingAnnots.splice(i,1)}}else{if(isSkAnnotDrawer(this.element))this.element.eraseAnnot(annot)}}isEmpty(){return false}bindRoot(){throw Error("BoxCommentWedlet not implemented in root position")}bindWithAttr(){throw Error("BoxCommentWedlet not usable with attr binding")}}export class BoxHiddenModel extends WedletModelBase{get isBoxFamily(){return true}initModel(cnf){this.config=cnf
this.nodeLabel=cnf.getAttribute("label")}createWedlet(parent,displayContext){return new BoxHiddenWedlet(this,parent,displayContext)}}WED.registerWedletModel("BoxHidden",BoxHiddenModel)
export class BoxHiddenWedlet extends OffscreenEltLeafWedlet{constructor(model,wedParent,displayContext){super(model,wedParent)
if(displayContext)this.displayCtx=displayContext}get elementHost(){return this.element}isVirtual(){return this.xaPart==null}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset}bindAsVirtual(){this.xaPart=null}insertElement(parent,insertBefore,slotName,caller){const elt=document.createElement("box-hidden")
elt.hidden=true
elt.style.display="none"
elt.configWedletElt=()=>{}
elt.wedlet=this
elt.fromChildrenElt=caller
this.element=elt
if(slotName)elt.setAttribute("slot",slotName)
parent.insertBefore(elt,insertBefore)}onAddedSkAnnot(annot){}onRemovedSkAnnot(annot){}onDelete(){this.element=null}deleteVirtualWedlet(){if(this.element)this.element.remove()}isEmpty(){return this.xaPart!=null}newJml(){throw Error()}}AgWedletSingleElt(BoxHiddenWedlet,{wedletArch:EWedletArch.dom,isVirtualisableWedlet:true})
export class BoxFreeDomModel extends WedletModelBase{get isBoxFamily(){return true}initModel(cnf){if(this.nodeType!==ENodeType.element)throw Error("BoxFreeDom wedlet can only be bound with element.")
this.config=cnf
this.nodeLabel=cnf.getAttribute("label")
this.drawerLib=cnf.getAttribute("lib")
this.drawerMeth=cnf.getAttribute("method")}createWedlet(parent,displayContext){return new BoxFreeDomWedlet(this,parent)}getDrawer(wedMgr){return wedMgr.wedModel.jsLibs[this.drawerLib][this.drawerMeth]}}WED.registerWedletModel("BoxFreeDom",BoxFreeDomModel)
export class BoxFreeDomWedlet extends OffscreenEltLeafWedlet{get elementHost(){return this.element}insertElement(parent,insertBefore,slotName,caller){const elt=this.model.getDrawer(this.wedMgr).createElement(this,parent,insertBefore,slotName,caller)
if(!IS_EltWedlet(elt))elt.configWedletElt=()=>{}
elt.wedlet=this
this.element=elt
if(slotName)elt.setAttribute("slot",slotName)
parent.insertBefore(elt,insertBefore)}setContent(content){this.content=content
const drawer=this.model.getDrawer(this.wedMgr)
if(content)drawer.refreshContent(this)
else if("onDelete"in drawer)drawer.onDelete(this)}}
//# sourceMappingURL=box.js.map