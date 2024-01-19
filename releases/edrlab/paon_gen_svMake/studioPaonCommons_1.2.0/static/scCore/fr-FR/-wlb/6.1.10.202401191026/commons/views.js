import{BaseElement,BaseElementAsync,isEltInitableAsyncPending}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{isAreaPointer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{LASTDATAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lastDatas.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export function isViewsContainer(ctn){return ctn&&typeof ctn.visitViews==="function"}export class ViewsContainer extends BaseElement{_initialize(init){this.views=init.views}visitViews(visitor){if(this.views)for(const view of this.views){const r=visitor(view)
if(r)return r}else{return VIEWS.visitDescendants(this,visitor)}}async visitViewsAsync(visitor){if(this.views)for(const view of this.views){const r=await visitor(view)
if(r)return r}else{return VIEWS.visitDescendantsAsync(this,visitor)}}}customElements.define("c-views-ctn",ViewsContainer)
export class BaseAreaView extends BaseElement{get icon(){return VIEWS.getIcon(this)}set icon(val){if(DOM.setAttr(this,"icon",val))VIEWS.dispatchViewChange(this)}get label(){return VIEWS.getLabel(this)}set label(val){if(DOM.setAttr(this,"label",val))VIEWS.dispatchViewChange(this)}get description(){return VIEWS.getDescription(this)}set description(val){if(DOM.setAttr(this,"description",val))VIEWS.dispatchViewChange(this)}get disabled(){return!VIEWS.isEnabled(this)}set disabled(val){if(DOM.setAttrBool(this,"disabled",val))VIEWS.dispatchViewChange(this)}get hidden(){return!VIEWS.isVisible(this)}set hidden(val){if(DOM.setHidden(this,val))VIEWS.dispatchViewChange(this)}_initialize(init){if(init.area)this.area=init.area
if(!this.areaContext)this.areaContext=init.areaContext||this
if(init.lastDatasKey)this.setAttribute("last-datas",init.lastDatasKey)
if(!this.reg)this.reg=this.findReg(init)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
const reg=this.findReg(init)
const areaCtx=this.getAttribute("area-context")
if(areaCtx)init.areaContext=reg.getSvc(areaCtx)
const area=this.getAttribute("area")
if(area)init.area=reg.getSvc(area)
init.lastDatas=LASTDATAS.getLastDatas(this,this.getAttribute("last-datas"))
return init}}export class BaseAreaViewAsync extends BaseElementAsync{}LANG.completeClassProps(BaseAreaView,BaseAreaViewAsync)
export var VIEWS;(function(VIEWS){function getCode(view){const code=view.getAttribute("code")
if(code!=null)return code
if(isAreaPointer(view))return view.area.getId()
return null}VIEWS.getCode=getCode
function getLabel(view){const label=view.getAttribute("label")
if(label!=null)return label
if(isAreaPointer(view))return view.area.getLabel(view.areaContext)
return null}VIEWS.getLabel=getLabel
function getIcon(view){const icon=view.getAttribute("icon")
if(icon!=null)return icon
if(isAreaPointer(view))return view.area.getIcon(view.areaContext)
return null}VIEWS.getIcon=getIcon
function getDescription(view){const desc=view.getAttribute("description")
if(desc!=null)return desc
if(isAreaPointer(view))return view.area.getDescription(view.areaContext)
return null}VIEWS.getDescription=getDescription
function isVisible(view){if(view.hasAttribute("hidden"))return false
if(isAreaPointer(view))return view.area.isVisible(view.areaContext)
return true}VIEWS.isVisible=isVisible
function isEnabled(view){if(view.hasAttribute("disabled"))return false
if(isAreaPointer(view))return view.area.isEnabled(view.areaContext)
return false}VIEWS.isEnabled=isEnabled
function dispatchViewChange(view){view.dispatchEvent(new CustomEvent("c-view-change",{bubbles:true}))}VIEWS.dispatchViewChange=dispatchViewChange
function onViewShown(view){if(view&&"onViewShown"in view){if(isEltInitableAsyncPending(view))view.initializedAsync.then(()=>{view.onViewShown()})
else view.onViewShown()}else if(isViewsContainer(view))onContainerShown(view)}VIEWS.onViewShown=onViewShown
function onContainerShown(ctn){if(isEltInitableAsyncPending(ctn))ctn.initializedAsync.then(()=>{ctn.visitViews(onViewShown,VIEWS.VISIT_VISIBLES)})
else ctn.visitViews(onViewShown,VIEWS.VISIT_VISIBLES)}VIEWS.onContainerShown=onContainerShown
async function canHideViewSilently(view,close){if(!view)return true
if(isEltInitableAsyncPending(view))await view.initializedAsync
if("onViewBeforeHide"in view)return view.onViewBeforeHide(close)
if(isViewsContainer(view))return canHideContainerSilently(view,close)
return true}VIEWS.canHideViewSilently=canHideViewSilently
async function canHideContainerSilently(ctn,close){if(isEltInitableAsyncPending(ctn))await ctn.initializedAsync
return await ctn.visitViewsAsync(async v=>await canHideViewSilently(v,close)?undefined:false,close?null:VIEWS.VISIT_VISIBLES)!==false}VIEWS.canHideContainerSilently=canHideContainerSilently
async function canHideView(view,close,beforeAsyncCheck){if(!view)return true
if(isEltInitableAsyncPending(view))await view.initializedAsync
if("onViewBeforeHide"in view){if(view.onViewBeforeHide(close))return true
if("onViewWaitForHide"in view){if(beforeAsyncCheck)beforeAsyncCheck()
return view.onViewWaitForHide(close)}return false}if(isViewsContainer(view))return canHideContainer(view,close)
return true}VIEWS.canHideView=canHideView
async function canHideContainer(ctn,close,beforeAsyncCheck){if(isEltInitableAsyncPending(ctn))await ctn.initializedAsync
return await ctn.visitViewsAsync(async v=>await canHideView(v,close,beforeAsyncCheck)?undefined:false,close?null:VIEWS.VISIT_VISIBLES)!==false}VIEWS.canHideContainer=canHideContainer
function onViewHidden(view,closed){if(view&&"onViewHidden"in view){if(isEltInitableAsyncPending(view))view.initializedAsync.then(()=>{view.onViewHidden(closed)})
else view.onViewHidden(closed)}else if(isViewsContainer(view))onContainerHidden(view,closed)}VIEWS.onViewHidden=onViewHidden
async function onContainerHidden(ctn,closed){if(isEltInitableAsyncPending(ctn))await ctn.initializedAsync
ctn.visitViews(v=>{onViewHidden(v,closed)},closed?null:VIEWS.VISIT_VISIBLES)}VIEWS.onContainerHidden=onContainerHidden
function visitDescendants(from,visitor){const tw=document.createTreeWalker(from,NodeFilter.SHOW_ELEMENT)
if(!tw.nextNode())return
do{const r=visitor(tw.currentNode)
if(r!==undefined)return r
if(isViewsContainer(tw.currentNode)){while(!tw.nextSibling())if(!tw.parentNode())return}else{if(!tw.nextNode())return}}while(true)}VIEWS.visitDescendants=visitDescendants
async function visitDescendantsAsync(from,visitor){const tw=document.createTreeWalker(from,NodeFilter.SHOW_ELEMENT)
do{const r=await visitor(tw.currentNode)
if(r!==undefined)return r
if(isViewsContainer(tw.currentNode)){while(!tw.nextSibling())if(!tw.parentNode())return}else{if(!tw.nextNode())return}}while(true)}VIEWS.visitDescendantsAsync=visitDescendantsAsync
function visitNodes(visitor,options,...nodes){for(const n of nodes){if(n){const r=visitor(n)
if(r!==undefined)return r}}}VIEWS.visitNodes=visitNodes
async function visitNodesAsync(visitor,options,...nodes){for(const n of nodes){if(n){const r=await visitor(n)
if(r!==undefined)return r}}}VIEWS.visitNodesAsync=visitNodesAsync
function clearContent(parent,closed){let ch=parent.lastChild
while(ch){if(ch.localName!=="style"){const prev=ch.previousSibling
if("onViewHidden"in ch)onViewHidden(ch,closed)
else if(isViewsContainer(ch))onContainerHidden(ch,closed)
else visitDescendants(ch,n=>onViewHidden(n,closed))
parent.removeChild(ch)
ch=prev}else{ch=ch.previousSibling}}}VIEWS.clearContent=clearContent
function setArea(view,areaPointer){view.area=areaPointer.area
view.areaContext=areaPointer.areaContext}VIEWS.setArea=setArea
VIEWS.VISIT_VISIBLES={visible:true}})(VIEWS||(VIEWS={}))

//# sourceMappingURL=views.js.map