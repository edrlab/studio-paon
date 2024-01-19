import{NoneModel,WED,WedModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{WED_SELECTOR_BOX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{OtlEditor}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/outline/outlineTags.js"
import{IS_EltWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{AgWedletSingleElt,EWedletArch,WEDLET_SINGLEELT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{JmlSubSetIterator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{AgWedletInsMgr}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
const OTL_NS="scenari.eu:wed:outline"
export var EOtlType;(function(EOtlType){EOtlType[EOtlType["container"]=0]="container"
EOtlType[EOtlType["wrapper"]=1]="wrapper"
EOtlType[EOtlType["node"]=2]="node"})(EOtlType||(EOtlType={}))
class OtlModel{get defaultWedSelector(){switch(this.otlType){case EOtlType.container:return WED_SELECTOR_OTL
case EOtlType.wrapper:return WED_SELECTOR_OTL_BOX
case EOtlType.node:return WED_SELECTOR_BOX}}initModel(cnf){this.config=cnf
this.nodeLabel=cnf.getAttribute("label")
switch(cnf.getAttribute("wedlet")){case"OtlContainer":this.otlType=EOtlType.container
this.containerConfig=cnf
this.hierChildrenElts=WEDLET.extractChildrenNodes(cnf,(elt,forChidrenElt)=>WED_SELECTOR_OTL)
this.hierChildrenElts.sort(WED.SORT_ChildrenElts)
break
case"OtlNode":this.otlType=EOtlType.node
this.entryConfig=DOM.findFirstChild(cnf,n=>DOM.IS_element(n)&&n.localName==="entry"&&n.namespaceURI===OTL_NS)
this.containerConfig=DOM.findFirstChild(cnf,n=>DOM.IS_element(n)&&n.localName==="hier"&&n.namespaceURI===OTL_NS)
this.entryChildrenEltsNaturalOrder=WEDLET.extractChildrenNodes(this.entryConfig,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_BOX)
if(this.entryChildrenEltsNaturalOrder){this.entryChildrenElts=this.entryChildrenEltsNaturalOrder.slice()
this.entryChildrenElts.sort(WED.SORT_ChildrenElts)}if(this.containerConfig){this.hierChildrenElts=WEDLET.extractChildrenNodes(this.containerConfig,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_OTL)
this.hierChildrenElts.sort(WED.SORT_ChildrenElts)}break
case"OtlWrapper":this.otlType=EOtlType.wrapper
this.entryConfig=cnf
this.entryChildrenEltsNaturalOrder=WEDLET.extractChildrenNodes(cnf,(elt,forChidrenElt)=>WEDLET.findWedSelector(elt,forChidrenElt)||WED_SELECTOR_OTL_BOX)
this.entryChildrenElts=this.entryChildrenEltsNaturalOrder.slice()
this.entryChildrenElts.sort(WED.SORT_ChildrenElts)
break}}createWedlet(parent,displayContext){switch(this.otlType){case EOtlType.node:return(new OtlWedletNode).initAsChild(this,parent,displayContext)
case EOtlType.container:return(new OtlWedletContainer).initAsChild(this,parent)
case EOtlType.wrapper:return(new OtlWedletWrapper).initAsChild(this,parent,displayContext)}}createRootWedlet(wContainer,insertBefore,wedMgr){switch(this.otlType){case EOtlType.node:return(new OtlWedletNode).initAsRoot(this,wedMgr)
case EOtlType.container:return(new OtlWedletContainer).initAsRoot(this,wedMgr)
case EOtlType.wrapper:return(new OtlWedletWrapper).initAsRoot(this,wedMgr)}}}WED.registerWedletModel("OtlContainer",OtlModel)
WED.registerWedletModel("OtlWrapper",OtlModel)
WED.registerWedletModel("OtlNode",OtlModel)
const WED_SELECTOR_OTL=function(wedModel,node,ctx){if(wedModel instanceof OtlModel||wedModel instanceof NoneModel)return WedModel.SELECTOR_PERFECT_MATCH
return WedModel.SELECTOR_REJECT}
const WED_SELECTOR_OTL_BOX=function(wedModel,node,ctx){if(wedModel instanceof OtlModel||wedModel instanceof NoneModel)return WedModel.SELECTOR_PERFECT_MATCH
if(wedModel.isBoxFamily)return 50
return WedModel.SELECTOR_REJECT}
class OtlWedlet{get wedAnchor(){return this.wedParent?XA.append(this.wedParent.wedAnchor,this.xaPart):this._rootXa}isVirtual(){return false}get otlParent(){return this.wedParent instanceof OtlWedlet?this.wedParent:null}get otlDriver(){return this._otlDriver||this.otlParent?this.otlParent.otlDriver:this.wedMgr.wedEditor}initAsRoot(model,wedMgr){this.model=model
this.wedMgr=wedMgr
this.createElement()
return this}initAsChild(model,parent){this.model=model
this.wedParent=parent
this.wedMgr=parent.wedMgr
this.createElement()
return this}bindRoot(jmlChildren,jmlRoot,xaRoot){this._rootXa=XA.freeze(xaRoot||[])
this.otlDriver.onNewOtlWedlet(this)
return this.endBind(this._appendChildWedlets(jmlChildren))}isEmpty(){return false}endBind(promises){if(promises)return Promise.all(promises).then(()=>{this.otlDriver.onOtlRowUpdated()})
this.refreshEditMode()
this.otlDriver.onOtlRowUpdated()}_appendChildWedlets(children,promises){const it=new JmlSubSetIterator(children)
while(it.next()){const promise=this._insertChildWedlet(it.currentIdx,it.currentNode,it.currentChildren)
if(promise){if(!promises)promises=[promise]
else promises.push(promise)}}return promises}refreshEditMode(){this.editMode=WEDLET.resolveEditMode(this)}getEditModeForDesc(target){return target instanceof OtlWedlet?undefined:WEDLET.READSTATIC_MUST}}class OtlWedletWrapper extends OtlWedlet{get elementHost(){return this.element}get otlType(){return EOtlType.wrapper}initAsChild(model,parent,displayContext){super.initAsChild(model,parent)
this.displayCtx=displayContext
return this}createElement(){if(this.element)throw Error("Element already setted.")
const root=this.model.config.firstElementChild
this.element=document.importNode(root,false)
this.element.configWedletElt(root,this)}insertElement(parent,insertBefore,slotName,caller){if(slotName)this.element.setAttribute("slot",slotName)
if(caller)this.element.fromChildrenElt=caller
parent.insertBefore(this.element,insertBefore)}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
this.element.refreshBindValue(node,children)
this.otlDriver.onNewOtlWedlet(this)
let promises=WEDLET.appendAttWedlets(this,node,this._insertAttrNode)
if(children)promises=this._appendChildWedlets(children,promises)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)
return this.endBind(promises)}bindRoot(jmlChildren,jmlRoot,xaRoot){const pr=super.bindRoot(jmlChildren,jmlRoot,xaRoot)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)
return pr}deleteChildNodes(xaOffest,count){this.visitWedletChildren(xaOffest,count,wedlet=>{if(wedlet instanceof OtlWedlet)this.otlDriver.onDeletedOtlWedlet(wedlet)})
WEDLET_SINGLEELT.deleteChildNodes(this,xaOffest,count)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)}insertAttrNode(attrName,value){const result=this._insertAttrNode(attrName,value)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)
return result}_insertAttrNode(attrName,value){return WEDLET_SINGLEELT.insertAttrNode(this,attrName,value,this.model.entryChildrenElts,this.model.defaultWedSelector)}deleteAttrNode(attName){const attWedlet=this.findWedletChild(attName)
if(attWedlet instanceof OtlWedlet)this.otlDriver.onDeletedOtlWedlet(attWedlet)
WEDLET_SINGLEELT.deleteAttrNode(this,attName)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)}findPreviousSiblingHier(fromChild){return this.otlParent?this.otlParent.findPreviousSiblingHier(this):null}findNextSiblingHier(fromChild){return this.otlParent?this.otlParent.findNextSiblingHier(this):null}findFirstHier(){return this}findLastHier(){return this}insertChildNode(xaOffest,node,children){let result
for(let ch=this.elementHost.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){const xaPart=ch.wedlet.xaPart
if(xaPart>xaOffest){ch.wedlet.xaPart=xaPart+1}else if(xaPart===xaOffest){result=this._insertChildWedlet(xaOffest,node,children,ch)||null
ch.wedlet.xaPart=xaPart+1}}}if(result===undefined)result=this._insertChildWedlet(xaOffest,node,children,null)
return result}onChildNodesInserted(){WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)}replaceChildBind(xaOffest,node,children){for(let ch=this.elementHost.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)){if(ch.wedlet.xaPart===xaOffest){let next=ch.nextElementSibling
while(IS_EltWedlet(next)&&next.wedlet.isVirtual())next=next.nextElementSibling
if("onDelete"in ch.wedlet)ch.wedlet.onDelete()
ch.remove()
const result=this._insertChildWedlet(xaOffest,node,children,next)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)
return result}}}}injectForeignChild(similarTo,elt,before,after,options){if(before){const otlTree=OtlEditor.findOtlTree(before)
if(otlTree)otlTree.parentNode.insertBefore(elt,otlTree)}else if(after){const otlTree=OtlEditor.findOtlTree(after)
if(otlTree)otlTree.parentNode.insertBefore(elt,otlTree.nextSibling)}else{const otlTree=OtlEditor.findOtlTree(this)
if(otlTree)otlTree.otlChildrenCtn.appendChild(elt)}}_insertChildWedlet(xaOffset,node,children,insertBefore){if(typeof node==="number")return
return WEDLET_SINGLEELT.insertChildNode(this,xaOffset,node,children,this.model.entryChildrenElts,this.model.defaultWedSelector,insertBefore)}isVirtual(){return this.xaPart==null}bindAsVirtual(){this.xaPart=null
this.element.refreshBindValue(null)
this.otlDriver.onNewOtlWedlet(this)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)
this.endBind(null)}deleteVirtualWedlet(){this.element.remove()}newJml(){throw Error("not implemented")}doCustomAdjust(){if(this.element.onChildWedletsChange)this.element.onChildWedletsChange()}}AgWedletSingleElt(OtlWedletWrapper,{wedletArch:EWedletArch.dom,isParentWedlet:true,isVirtualisableWedlet:true})
AgWedletInsMgr(OtlWedletWrapper)
class OtlWedletNode extends OtlWedletWrapper{get elementHost(){return this.element}get otlType(){return EOtlType.node}get wedletRect(){var _a
return(_a=OtlEditor.findOtlTree(this))===null||_a===void 0?void 0:_a.getBoundingClientRect()}createElement(){if(this.element)throw Error("Element already setted.")
const root=this.model.config.querySelector("entry").firstElementChild
this.element=document.importNode(root,false)
this.element.configWedletElt(root,this)}findWedletChild(xaPart,options){const entryCh=!options||!options.mainBranch?super.findWedletChild(xaPart,options):null
const hierCh=this.hierWedlets?this.hierWedlets.find(e=>e.xaPart===xaPart):null
return entryCh?hierCh?[entryCh,hierCh]:entryCh:hierCh}visitWedletChildren(from,len,visitor,options){if(!options||!options.mainBranch){if(super.visitWedletChildren(from,len,visitor)==="stop")return"stop"}const end=from+len
if(this.hierWedlets)for(let i=0;i<this.hierWedlets.length;i++){const e=this.hierWedlets[i]
const xaPart=e.xaPart
if(xaPart!=null&&(typeof xaPart==="number"?xaPart>=from:from===-1)){if(xaPart>=end)return
if(visitor.call(null,e)==="stop")return"stop"}}}findPreviousSiblingHier(child){if(this.hierWedlets)for(let i=0;i<this.hierWedlets.length;i++){if(this.hierWedlets[i]===child)return i>0?this.hierWedlets[i-1].findLastHier():null}return null}findNextSiblingHier(child){if(this.hierWedlets)for(let i=0;i<this.hierWedlets.length;i++){if(this.hierWedlets[i]===child)return i<this.hierWedlets.length-1?this.hierWedlets[i+1].findFirstHier():null}return null}deleteChildNodes(xaOffest,count){const xaEnd=xaOffest+count
if(this.hierWedlets){let found=false
for(let i=0;i<this.hierWedlets.length;i++){const ch=this.hierWedlets[i]
const xaPart=ch.xaPart
if(xaPart>=xaEnd){ch.xaPart-=count}else if(xaPart>=xaOffest){this.otlDriver.onDeletedOtlWedlet(ch)
this.hierWedlets.splice(i--,1)
found=true}}if(found)this.otlDriver.onOtlRowUpdated()}WEDLET_SINGLEELT.deleteChildNodes(this,xaOffest,count)
WEDLET_SINGLEELT.adjustVirtuals(this,this.model.entryChildrenEltsNaturalOrder)}_insertChildWedlet(xaOffset,node,children,insertBefore){const promises=super._insertChildWedlet(xaOffset,node,children,insertBefore)
if(typeof node==="number")return promises
let insertOffset=this.hierWedlets?this.hierWedlets.length:0
while(insertOffset>0&&this.hierWedlets[insertOffset-1].xaPart>=xaOffset){const ch=this.hierWedlets[insertOffset-1]
ch.xaPart=ch.xaPart+1
insertOffset--}const hierChildrenElt=WEDLET.findChildrenEltForNodeStrict(this.model.hierChildrenElts,node)
if(hierChildrenElt){const model=this.wedMgr.wedModel.findModelForNodeFromCh(node,this,hierChildrenElt)
const wedletCh=model?model.createWedlet(this):null
if(!wedletCh)return
if(!this.hierWedlets)this.hierWedlets=[]
this.hierWedlets.splice(insertOffset,0,wedletCh)
return wedletCh.bindWithNode(xaOffset,node,children)}return promises}}class OtlWedletContainer extends OtlWedlet{constructor(){super(...arguments)
this.hierWedlets=[]}get otlType(){return EOtlType.container}bindWithNode(xaOffset,node,children){this.xaPart=xaOffset
this.otlDriver.onNewOtlWedlet(this)
return this.endBind(children?this._appendChildWedlets(children):null)}findWedletChild(xaPart,options){return this.hierWedlets.find(e=>e.xaPart===xaPart)}visitWedletChildren(from,len,visitor,options){const end=from+len
for(let i=0;i<this.hierWedlets.length;i++){const e=this.hierWedlets[i]
const xaPart=e.xaPart
if(xaPart!=null&&(typeof xaPart==="number"?xaPart>=from:from===-1)){if(xaPart>=end)return
if(visitor.call(null,e)==="stop")return"stop"}}}findPreviousSiblingHier(fromChild){for(let i=0;i<this.hierWedlets.length;i++){if(this.hierWedlets[i]===fromChild){if(i===0)return this.otlParent?this.otlParent.findPreviousSiblingHier(this):null
return this.hierWedlets[i-1].findLastHier()}}throw Error("Child not found: "+fromChild)}findNextSiblingHier(fromChild){for(let i=0,s=this.hierWedlets.length-1;i<=s;i++){if(this.hierWedlets[i]===fromChild){if(i===s)return this.otlParent?this.otlParent.findNextSiblingHier(this):null
return this.hierWedlets[i+1].findFirstHier()}}throw Error("Child not found: "+fromChild)}findFirstHier(){return this.hierWedlets&&this.hierWedlets[0]?this.hierWedlets[0].findFirstHier():null}findLastHier(){return this.hierWedlets&&this.hierWedlets.length>0?this.hierWedlets[this.hierWedlets.length-1].findLastHier():null}createElement(){}insertChildNode(xaOffest,node,children){let result
for(let i=0;i<this.hierWedlets.length;i++){const ch=this.hierWedlets[i]
const xaPart=ch.xaPart
if(xaPart>xaOffest){ch.xaPart=xaPart+1}else if(xaPart===xaOffest){result=this._insertChildWedlet(xaOffest,node,children)||null
ch.xaPart=xaPart+1}}if(result===undefined)return this._insertChildWedlet(xaOffest,node,children)
return result}onChildNodesInserted(){}deleteChildNodes(xaOffest,count){const xaEnd=xaOffest+count
for(let i=0;i<this.hierWedlets.length;i++){const ch=this.hierWedlets[i]
const xaPart=ch.xaPart
if(xaPart>=xaEnd){ch.xaPart-=count}else if(xaPart>=xaOffest){this.otlDriver.onDeletedOtlWedlet(ch)
this.hierWedlets.splice(i--,1)}}this.otlDriver.onOtlRowUpdated()}_insertChildWedlet(xaOffset,node,children){if(typeof node==="number")return
const hierChildrenElt=WEDLET.findChildrenEltForNodeStrict(this.model.hierChildrenElts,node)
if(hierChildrenElt){const wedMgr=this.wedMgr
let wedletCh
const model=wedMgr.wedModel.findModelForNodeFromCh(node,this,hierChildrenElt)
wedletCh=model?model.createWedlet(this):null
if(!wedletCh)return
let insertOffset=this.hierWedlets.length
while(insertOffset>0&&this.hierWedlets[insertOffset-1].xaPart>=xaOffset){const ch=this.hierWedlets[insertOffset-1]
ch.xaPart=ch.xaPart+1
insertOffset--}this.hierWedlets.splice(insertOffset,0,wedletCh)
return wedletCh.bindWithNode(xaOffset,node,children)}}}export{OTL_NS,OtlModel,OtlWedlet,OtlWedletNode,OtlWedletWrapper,OtlWedletContainer,WED_SELECTOR_OTL}

//# sourceMappingURL=outline.js.map