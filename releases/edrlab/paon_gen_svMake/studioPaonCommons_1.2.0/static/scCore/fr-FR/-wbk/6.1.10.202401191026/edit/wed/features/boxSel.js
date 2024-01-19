import{BarActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/bars.js"
import{IS_Popupable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popupable.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{EWedletEditMode,findElementWedlet,IS_EltWedlet,isDisplayedWedlet,isEditableWedlet,isParentWedlet,WEDLET,WedletActionCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{AccelKeyMgr,ACTION,Action,ActionMenu,ActionSeparator,ActionWrapperFromSvc}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{isXmlMsg,XmlBatch,XmlInsertMsg,XmlRangeState}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{EPastePos}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schema.js"
import{EFuzzyType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{SkRuleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{CONVERT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/import/convert.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{HistoEditPoint}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/histoEditPoints.js"
export function AgBoxSelEditor(cls){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){superInit.call(this,config)
this.boxSelMgr=new BoxSelMgr(this)
if(!config.disableBoxSelection){this.addEventListener("pointerdown",onPointerDown)
this.boxSelMgr.accelKeyMgr=(new AccelKeyMgr).initFromMapActions((config.reg||REG.findReg(this)).getListAsMap("wed:box:sel:accelkeys"))
this.boxSelMgr.accelKeyMgr.addAccelKey("c","accel,shift",copyXmlMenu)
this.addEventListener("keydown",onKeyDown,false)
this.wedMgr.listeners.on("getFocus",onFocus)
this.wedMgr.listeners.on("looseFocus",onBlur)
this.wedMgr.listeners.on("clipboard",onClipboardEvent)
this.wedMgr.listeners.on("readOnlyChangeAfter",onReadOnlyChange)}this.wedMgr.listeners.on("initLastDatas",(async function(wedMgr,lastDatas){if(!lastDatas.scCmtsPd)return
import("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxScComment.js").then(exports=>{if(!wedMgr.rootWedlet)return
exports.initLastDatasScComments(wedMgr,lastDatas.scCmtsPd)})}))
this.wedMgr.listeners.on("hookMsgAfter",hookMsgAfter)
this.wedMgr.listeners.on("hookMsgForNextSel",hookMsgForNextSel)
this.wedMgr.listeners.on("getCurrentSel",getCurrentSel)
return this}
return cls}const copyXmlMenu=new Action("copyXml").setLabel("Copier en XML").setExecute((ctx,ev)=>{const rg=ctx.boxSelMgr.range
if(!rg.isCollapsed)ctx.wedMgr.writeRangeToClipboardAsXml(rg)})
export function isWedletBoxSelection(w){return w&&"drawBoxSelection"in w}export function AgWedletBoxSelectionSingleElt(cls){const proto=cls.prototype
proto.focusWedlet=focusWedlet
proto.drawBoxSelection=wedlet_drawBoxSelection
proto.drawBoxSelActions=wedlet_drawBoxSelActions
proto.highlightFromLink=highlightFromLink
return cls}export function isEltBoxSelection(elt){return elt instanceof Element&&"drawEltBoxSelection"in elt}export function AgEltBoxSelection(cls,options){const proto=cls.prototype
if(options.selMode)proto.selMode=options.selMode
const connectedCallback=proto.connectedCallback
proto.connectedCallback=function(){if(connectedCallback)connectedCallback.call(this)
if(!this.wedlet.wedMgr.config.noFocus)(this.focusableElement||this).tabIndex=options.tabIndex||0}
proto.drawEltBoxSelection=drawEltBoxSelection
proto.drawEltBoxSelActions=drawEltBoxSelActions
if(options.actionsLists)proto.actionsLists=options.actionsLists
if(options.groupOrderPref)proto.groupOrderPref=options.groupOrderPref
if(options.groupOrder)proto.groupOrder=options.groupOrder
if(options.force_ctxMenuActions||!("ctxMenuActions"in proto))Object.defineProperty(proto,"ctxMenuActions",{get:ctxMenuActions})
if(options.force_focusBar||!("focusBar"in proto))Object.defineProperty(proto,"focusBar",{get:focusBar})
return cls}function focusWedlet(){const elt=getFocusable(this)
if(elt){WEDLET.ensureContainersUncollapsed(elt)
elt.focus()}return elt}async function highlightFromLink(blockPos){const elt=getFocusable(this)||this.element
WEDLET.ensureContainersUncollapsed(elt)
elt.focus({preventScroll:true})
BASIS.ensureVisible(elt,this.wedMgr.wedEditor.scrollContainer,blockPos)}function getFocusable(from){let elt=from.element.focusableElement
if(!elt){elt=from.element
if(!DOM.IS_focusable(elt)){elt=DOMSH.findFlatNext(elt,elt,DOM.IS_focusable)||DOMSH.findFlatParentElt(elt,from.wedMgr.wedEditor.rootNode,DOM.IS_focusable)}}return elt}function wedlet_drawBoxSelection(inSel){if(isEltBoxSelection(this.element)){this.element.drawEltBoxSelection(inSel)}else{const parent=this.elementHost
if(parent)for(let ch=parent.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_EltWedlet(ch)&&isWedletBoxSelection(ch.wedlet)){ch.wedlet.drawBoxSelection(inSel)}}}}function wedlet_drawBoxSelActions(show,focusActionWidgets,what){if(isEltBoxSelection(this.element)){this.element.drawEltBoxSelActions(show,focusActionWidgets,what)}else if(isWedletBoxSelection(this.wedParent)){this.wedParent.drawBoxSelActions(show,focusActionWidgets,"after")}}export class BoxSelMgr{constructor(editor){this.editor=editor
this.range=(new XmlRangeState).init("sel",null,[],[])
this.htmlSel=window.getSelection()
this.multiSelBaseIsStart=null
this.focusActionWidgets=[]
this._selHidden=false}isSingleSel(){return this.activeWedlet&&this.multiSelBaseIsStart===null}clearSel(){if(!this.activeWedlet)return
this.xUnactiveWedlet()
this._drawSelMulti(this.range,false)
const empty=[]
this.range.setRange(empty,empty)}hideSel(){this._selHidden=true
if(this.activeWedlet)this._drawSelSingle(this.activeWedlet,false)
this._drawSelMulti(this.range,false)}showSel(){this._selHidden=false
if(this.activeWedlet)this._drawSelSingle(this.activeWedlet,true)
this._drawSelMulti(this.range,true)}selectWedlet(wedletToSel){if(this.activeWedlet===wedletToSel&&!this._selHidden)return
if(!wedletToSel.wedParent)return
if(this._selHidden){this._selHidden=false}else{this.xUnactiveWedlet()
this._drawSelMulti(this.range,false)}this.activeWedlet=wedletToSel
const anchor=wedletToSel.wedAnchor
if(wedletToSel.isVirtual()){this.selInVirtual=true
this.range.setRange(anchor,anchor)}else{this.selInVirtual=false
if(XA.isAttribute(anchor)){this.range.setRange(anchor,anchor)}else{this.range.setRange(anchor,XA.newBd(anchor).incrAtDepth(-1,1).xa)}}this._drawSelSingle(wedletToSel,true)}extendSelTo(wedletToSel){if(this._selHidden)this.showSel()
let extent=wedletToSel.wedAnchor
const multiSelBaseWasStart=this.multiSelBaseIsStart
let base=multiSelBaseWasStart===false?this.range.end:this.range.start
if(!base){this.selectWedlet(wedletToSel)}else{this.xUnactiveWedlet()
this._drawSelMulti(this.range,false)
this.selInVirtual=false
if(XA.isAttribute(base))base=XA.up(base)
if(XA.isAttribute(extent)){extent=XA.up(extent)
const wedletElt=wedletToSel.wedParent
if(!isWedletBoxSelection(wedletElt)){this.selectWedlet(wedletToSel)
return}wedletToSel=wedletElt}this.activeWedlet=wedletToSel
wedletToSel.focusWedlet()
if(XA.isAnc(extent,base)||XA.isBefore(extent,base)){if(multiSelBaseWasStart!==false)base=XA.incrAtDepth(base,-1,1)
this.multiSelBaseIsStart=false
this.range.setRange(extent,base)}else{if(multiSelBaseWasStart===false)base=XA.incrAtDepth(base,-1,-1)
extent=XA.incrAtDepth(extent,-1,1)
this.multiSelBaseIsStart=true
this.range.setRange(base,extent)}this._drawSelMulti(this.range,true)}}setSelection(rg){if(!rg.end||XA.isEquals(rg.start,rg.end)){return this.focusAroundXAddr(rg.start)}let start=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,rg.start,WEDLET.FINDOPTIONS_lastAncestorIfNone)
while(!isWedletBoxSelection(start)){if(start==null)return false
start=start.wedParent}let end=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,rg.end,WEDLET.FINDOPTIONS_lastAncestorIfNone)
while(end&&!isWedletBoxSelection(end))end=end.wedParent
if(!end||start===end){return this.focusAroundXAddr(rg.start)}else{this.selectWedlet(start)
if(end)this.extendSelTo(end)
return true}}findAroundXAddr(xa){const find={lastAncestorIfNone:true,wedletNotFoundDepth:-1,forceFetch:true,mainBranch:true}
let wedlet=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,xa,find)
if(wedlet&&find.wedletNotFoundDepth>0&&isParentWedlet(wedlet)){const notFound=xa[find.wedletNotFoundDepth]
if(typeof notFound==="number"){const prev=wedlet.findWedletChild(notFound-1,{mainBranch:true,forceFetch:true})
if(prev)wedlet=prev}}while(!isWedletBoxSelection(wedlet)){if(wedlet==null)return null
wedlet=wedlet.wedParent}return wedlet}focusAroundXAddr(xa){const wedlet=this.findAroundXAddr(xa)
if(isWedletSingleElt(wedlet)){const elt=wedlet.element
if(elt.matches(":focus-within")){const focused=DOMSH.findDeepActiveElement(DOMSH.findDocumentOrShadowRoot(elt))
if(focused)BASIS.ensureVisible(focused,this.editor.scrollContainer,"nearest")
return false}}if(wedlet){wedlet.focusWedlet()
return true}return false}focusFirst(root){function findFocusFirst(w){if(isWedletBoxSelection(w)){w.focusWedlet()
return"stop"}if(isParentWedlet(w))w.visitWedletChildren(-1,Infinity,findFocusFirst,WEDLET.VISITOPTIONS_mainBranch)}root.visitWedletChildren(-1,Infinity,findFocusFirst,WEDLET.VISITOPTIONS_mainBranch)}redrawSelection(){if(this._selHidden)return
if(isWedletSingleElt(this.activeWedlet)&&(!this.activeWedlet.element||!this.activeWedlet.element.isConnected)){this.clearSel()
return}if(this.isSingleSel()){if(this.selInVirtual&&!this.activeWedlet.isVirtual()){const wedlet=this.activeWedlet
this.clearSel()
this.selectWedlet(wedlet)}else{this._drawSelSingle(this.activeWedlet,true)}}}markWedlet(wedletToSel,ensureVisible=false){if(!wedletToSel)return
this.xUnactiveWedlet()
if(this._selHidden){this._selHidden=false}else{this._drawSelMulti(this.range,false)}const anchor=wedletToSel.wedAnchor
if(wedletToSel.isVirtual()){this.selInVirtual=true
this.range.setRange(anchor,anchor)}else{this.selInVirtual=false
if(XA.isAttribute(anchor)){this.range.setRange(anchor,anchor)}else{this.range.setRange(anchor,XA.newBd(anchor).incrAtDepth(-1,1).xa)}}if(ensureVisible&&isWedletSingleElt(wedletToSel)){BASIS.ensureVisible(wedletToSel.element,this.editor.scrollContainer,"nearest")}wedletToSel.drawBoxSelection(true)}deleteContentSelection(batchIn){this._drawSelMulti(this.range,false)
const batch=batchIn||this.editor.wedMgr.docHolder.newBatch()
if(XA.isAttribute(this.range.start)){const wedlet=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,this.range.start)
if(wedlet){if(isEditableWedlet(wedlet)&&wedlet.editMode!==EWedletEditMode.write)return
const xa=wedlet.wedParent.onChildEmptied(subXa=>XA.isEquals(this.range.start,subXa))
if(xa)batch.deleteSequence(xa,1)
else batch.setAttr(this.range.start,null)}}else if(!this.range.isCollapsed){let allowed=true
WEDLET.visitRange(this.editor.wedMgr.rootWedlet,this.range,w=>{if(isEditableWedlet(w)&&w.editMode!==EWedletEditMode.write){allowed=false
return"stop"}},WEDLET.VISITOPTIONS_mainBranch)
if(!allowed)return
batch.deleteRange(WEDLET.absorbContainersOnDelete(this.editor.wedMgr.rootWedlet,this.range))}if(!batchIn)batch.doBatch()}visitSelectedWedlets(cb){if(XA.isAttribute(this.range.start)){const attWedlet=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,this.range.start)
if(isWedletBoxSelection(attWedlet))return cb(attWedlet)}else{let r
WEDLET.visitRange(this.editor.wedMgr.rootWedlet,this.range,w=>{if(isWedletBoxSelection(w)){r=cb(w)
if(r!==undefined)return"stop"}},WEDLET.VISITOPTIONS_mainBranch)
return r}}_drawSelSingle(wedletToSel,show){this.focusActionWidgets.forEach(elt=>{try{elt.remove()}catch(_a){}})
this.focusActionWidgets.length=0
wedletToSel.drawBoxSelection(show)
wedletToSel.drawBoxSelActions(show,this.focusActionWidgets)}_drawSelMulti(range,select){if(!select)this.multiSelBaseIsStart=null
if(XA.isAttribute(range.start)){const attWedlet=WEDLET.findWedlet(this.editor.wedMgr.rootWedlet,range.start)
if(isWedletBoxSelection(attWedlet))attWedlet.drawBoxSelection(select)}else{WEDLET.visitRange(this.editor.wedMgr.rootWedlet,range,w=>{if(isWedletBoxSelection(w))w.drawBoxSelection(select)},WEDLET.VISITOPTIONS_mainBranch)}}xUnactiveWedlet(){if(this.activeWedlet){if(!this._selHidden)this._drawSelSingle(this.activeWedlet,false)
this.activeWedlet=null
this.selInVirtual=false}}toString(){return this.range.toString()}}REG.reg.registerSvc("wedBoxSelDelete",1,new Action("wedBoxSelDelete").setLabel("Supprimer la sélection").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/deleteTag.svg").setVisible(ctx=>{const wedMgr=ctx.wedMgr
const boxSelMgr=wedMgr.wedEditor.boxSelMgr
return boxSelMgr&&!boxSelMgr.selInVirtual&&!wedMgr.wedEditor.config.disableBoxSelection}).setEnabled(ctx=>!ctx.wedMgr.readOnly).setExecute((function(ctx,ev){const boxSelMgr=ctx.wedMgr.wedEditor.boxSelMgr
if(boxSelMgr)boxSelMgr.deleteContentSelection()})))
REG.reg.registerSvc("wedBoxSelExclude",1,new Action("wedBoxSelExclude").setLabel("Exclure la sélection").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/excludeTag.svg").setVisible(ctx=>{const wedMgr=ctx.wedMgr
const boxSelMgr=wedMgr.wedEditor.boxSelMgr
return boxSelMgr&&!boxSelMgr.selInVirtual&&!wedMgr.wedEditor.config.disableBoxSelection&&!boxSelMgr.range.isCollapsed&&XA.isInSameSeq(boxSelMgr.range.start,boxSelMgr.range.end)}).setEnabled(ctx=>WEDLET.resolveEditMode(ctx.wedMgr.wedEditor.boxSelMgr.activeWedlet.wedParent)===EWedletEditMode.write).setExecute((function(ctx,ev){const wedMgr=ctx.wedMgr
const rg=wedMgr.wedEditor.boxSelMgr.range
if(!rg.isCollapsed&&XA.isInSameSeq(rg.start,rg.end)){const txt=wedMgr.docHolder.exportRange(rg,"application/xml",{rootTagNs:"scenari.eu:exclude:1.0",rootTagName:"sexc:exclude"})
const batch=wedMgr.docHolder.newBatch(rg)
batch.deleteSequence(rg.start,XA.last(rg.end)-XA.last(rg.start))
batch.insertJml(rg.start,[{"":JML.COMMENT,"=":DOM.escapeComment(txt)}])
batch.doBatch()}})))
const delFromKeyboard=new ActionWrapperFromSvc("deleteBox").setWrappedSvcCd("wedBoxSelDelete").setExecute((function(ctx,ev){const from=ev.composedPath()[0]
if(IS_EltWedlet(from)&&isWedletBoxSelection(from.wedlet)){this.getWrapped(ctx).execute(ctx,ev)}else return"noPreventDefault"}))
REG.reg.addToList("wed:box:sel:accelkeys","Delete",1,delFromKeyboard)
REG.reg.addToList("wed:box:sel:accelkeys","Backspace",1,delFromKeyboard)
REG.reg.addToList("wed:box:sel:accelkeys","Escape",1,new Action("boxEscape").setExecute((function(ctx,ev){const from=ev.composedPath().find((node,i)=>node.selMode==="box"&&i>0)
if(from){from.wedlet.focusWedlet()}else return"noStopPropag-noPreventDefault"})))
REG.reg.addToList("wed:box:sel:accelkeys","ArrowUp",1,new Action("boxArrowUp").setExecute((function(ctx,ev){const from=ev.composedPath()[0]
if(isEltBoxSelection(from)){if(from instanceof HTMLElement){const scrollCtn=ctx.scrollContainer
if(scrollCtn){const scrollRect=scrollCtn.getBoundingClientRect()
const rect=from.getBoundingClientRect()
if(rect.top<scrollRect.top){scrollCtn.scrollBy(0,-Math.min(scrollRect.height*.8,scrollRect.top-rect.top+scrollRect.height*.1))
return}}}const prev=DOMSH.findFlatPrevUncle(from,ctx.rootNode,isBox)
if(prev){prev.wedlet.focusWedlet()
ev.preventDefault()}else if(ctx.config.crossNav)return"noStopPropag-noPreventDefault"}else return"noPreventDefault"})))
REG.reg.addToList("wed:box:sel:accelkeys","ArrowDown",1,new Action("ArrowDown").setExecute((function(ctx,ev){const from=ev.composedPath()[0]
if(isEltBoxSelection(from)){if(from instanceof HTMLElement){const scrollCtn=ctx.scrollContainer
if(scrollCtn){const scrollRect=scrollCtn.getBoundingClientRect()
const rect=from.getBoundingClientRect()
if(rect.bottom>scrollRect.bottom){scrollCtn.scrollBy(0,Math.min(scrollRect.height*.8,rect.bottom-scrollRect.bottom+scrollRect.height*.1))
return}}}const next=DOMSH.findFlatNextUncle(from,ctx.rootNode,isBox)
if(next){next.wedlet.focusWedlet()
ev.preventDefault()}else if(ctx.config.crossNav)return"noStopPropag-noPreventDefault"}else return"noPreventDefault"})))
REG.reg.addToList("wed:box:sel:accelkeys","ArrowLeft",1,new Action("ArrowLeft").setExecute((function(ctx,ev){const from=ev.composedPath()[0]
if(isEltBoxSelection(from)){const prev=DOMSH.findFlatPrevious(from,ctx.rootNode,isBox)
if(prev){prev.wedlet.focusWedlet()
ev.preventDefault()}else if(ctx.config.crossNav)return"noStopPropag-noPreventDefault"}else return"noPreventDefault"})))
REG.reg.addToList("wed:box:sel:accelkeys","ArrowRight",1,new Action("ArrowRight").setExecute((function(ctx,ev){const from=ev.composedPath()[0]
if(isEltBoxSelection(from)){const next=DOMSH.findFlatNext(from,ctx.rootNode,isBox)
if(next){next.wedlet.focusWedlet()
ev.preventDefault()}else if(ctx.config.crossNav)return"noStopPropag-noPreventDefault"}else return"noPreventDefault"})))
function isBox(n){return isEltBoxSelection(n)&&n.selMode==="box"&&getComputedStyle(n).display!=="none"}function drawEltBoxSelection(inSel){if(this.selMode==="box"){if(inSel)this.setAttribute("selected","")
else this.removeAttribute("selected")}}function drawEltBoxSelActions(show,focusActionWidgets,what){if(!show||!WEDLET.isWritableWedlet(this.wedlet.wedParent)||this.hasAttribute("hide-actions"))return
const descEditMode=isEditableWedlet(this.wedlet)&&"getEditModeForDesc"in this.wedlet?this.wedlet.getEditModeForDesc(null):undefined
const insideEditable=(descEditMode?descEditMode.editMode===EWedletEditMode.write||descEditMode.editMode===EWedletEditMode.na:true)&&WEDLET.isWritableWedlet(this.wedlet)
const addForVirtualNode=(wedlet,wedMgr,target)=>{if(!wedlet.wedParent||this===target&&wedlet.element.hasAttribute("replace-here")){return false}let structs
if(wedlet.model.nodeType===ENodeType.attribute){structs=wedMgr.docHolder.getAlternateStructs(wedlet.wedParent.wedAnchor,0,ENodeType.attribute,wedlet.model.nodeName,WEDLET.buildVirtualPath(wedlet.wedParent))}else if(wedlet.wedParent.isVirtual()){structs=wedMgr.docHolder.getAlternateStructs(wedlet.wedParent.wedAnchor,wedlet.getVirtualXaPart(),ENodeType.element,wedlet.model.nodeName,WEDLET.buildVirtualPath(wedlet.wedParent))}else{const insertables=wedMgr.docHolder.getInsertableStructs(wedlet.wedParent.wedAnchor,wedlet.getVirtualXaPart(),null,this.getAttribute("replace-in")!=null)
if(insertables[1]){insertables[1].push(...insertables[0])
structs=insertables[1]}else{structs=insertables[0]}}if(WEDLET.cleanupStructList(structs,WEDLET.findVirtualWedletsBefore(target,true),WEDLET.isTextBindBefore(target))===0)return false
if(WEDLET.cleanupStructList(structs,WEDLET.findVirtualWedletsAfter(target),WEDLET.isTextBindAfter(target))===0)return false
if(this!==target){insertReplaceBtnIn(wedMgr,this,this.getAttribute("replace-in"),wedlet,structs,focusActionWidgets)}else{focusActionWidgets.push(createInsertBtn(wedMgr,"middle",structs,target,GFX.getContainerOrient(DOMSH.getParentElt(target))))}return true}
const wedlet=this.wedlet
const wedMgr=wedlet.wedMgr
if(wedlet.wedParent){const xaPart=wedlet.xaPart
let countBefore,countAfter
if(what!=="after"){if(typeof xaPart==="number"||typeof xaPart==="string"){let structsBefore,structsAfter,structsReplace
const doAlterPart=isWedletSingleElt(wedlet)&&wedlet.element.hasAttribute("replace-here")?undefined:xaPart
if(typeof xaPart==="number"){[structsBefore,structsAfter,structsReplace]=wedMgr.docHolder.getInsertableStructs(wedlet.wedParent.wedAnchor,xaPart,xaPart+1,false,doAlterPart)
if(wedlet.model.nodeType==ENodeType.comment){const virtuals=WEDLET.findVirtualWedletsAfter(this,WEDLET.findVirtualWedletsBefore(this))
const isText=WEDLET.isTextBindBefore(this)||WEDLET.isTextBindAfter(this)
countBefore=WEDLET.cleanupStructList(structsBefore,virtuals,isText)
countAfter=WEDLET.cleanupStructList(structsAfter,virtuals,isText)
structsReplace=null}else{countBefore=WEDLET.cleanupStructList(structsBefore,WEDLET.findVirtualWedletsBefore(this),WEDLET.isTextBindBefore(this))
countAfter=WEDLET.cleanupStructList(structsAfter,WEDLET.findVirtualWedletsAfter(this),WEDLET.isTextBindAfter(this))}}else if(doAlterPart!=null){structsReplace=wedMgr.docHolder.getAlternateStructs(wedlet.wedParent.wedAnchor,0,ENodeType.attribute,doAlterPart)}if(structsReplace&&structsReplace.length===0)structsReplace=null
if(countBefore>0||countAfter>0||structsReplace!=null){const ctnOrient=GFX.getContainerOrient(DOMSH.getParentElt(this))
let forceSpace=0
if(ctnOrient==="v"&&structsReplace!=null&&countBefore>0&&countAfter>0){const fontSize=parseInt(getComputedStyle(this).fontSize)
const height=this.clientHeight
let missingSp=fontSize*2.5-height
if(missingSp>0)forceSpace=missingSp/2/fontSize}if(countBefore>0)focusActionWidgets.push(createInsertBtn(wedMgr,"before",structsBefore,this,ctnOrient,forceSpace))
if(structsReplace!=null)focusActionWidgets.push(createReplaceBtn(wedMgr,structsReplace,this,ctnOrient,countBefore>0?.8-forceSpace:0))
if(countAfter>0)focusActionWidgets.push(createInsertBtn(wedMgr,"after",structsAfter,this,ctnOrient,forceSpace))}}else if(wedlet.isVirtual()){addForVirtualNode(wedlet,wedMgr,this)}if(insideEditable){const insChildren=wedlet.model.config.getAttribute("insertUiForChildren")
const insAtts=wedlet.model.config.getAttribute("insertUiForAtts")
if((insChildren||insAtts)&&isWedletSingleElt(wedlet)){const subStructs=wedMgr.docHolder.getInsertableStructsAll(insChildren?insAtts?"both":"children":"atts",wedlet.wedAnchor,WEDLET.buildVirtualPath(wedlet))
if(insAtts){const s=subStructs[insChildren?1:0]
if(WEDLET.cleanupStructList(s,WEDLET.findAllChildrenVirtualWedlets(this))>0){focusActionWidgets.push(createInsertChildBtn(wedMgr,s,wedlet.element,insAtts,"att"))}}if(insChildren&&WEDLET.cleanupStructList(subStructs[0],WEDLET.findAllChildrenVirtualWedlets(this))>0){focusActionWidgets.push(createInsertChildBtn(wedMgr,subStructs[0],wedlet.element,insChildren))}}}}if(!countAfter&&wedlet.model.nodeType!==ENodeType.attribute){const predicate=elt=>{if(isEltBoxSelection(elt)&&!elt.wedlet.isVirtual()){const parent=elt.wedlet.wedParent
if(parent&&parent.wedParent&&WEDLET.isWritableWedlet(parent.wedParent)&&isWedletSingleElt(parent)&&!parent.element.hasAttribute("hide-actions")){const[structsAfter]=wedMgr.docHolder.getInsertableStructs(parent.wedAnchor,elt.wedlet.xaPart+1)
countAfter=WEDLET.cleanupStructList(structsAfter,WEDLET.findVirtualWedletsAfter(elt),WEDLET.isTextBindAfter(elt))
if(countAfter>0){focusActionWidgets.push(createInsertBtn(wedMgr,"after",structsAfter,elt,GFX.getContainerOrient(DOMSH.getParentElt(elt))))
return true}}}return false}
if(what!=="after")DOMSH.findFlatParentElt(wedlet.element,wedMgr.wedEditor.rootNode,predicate)
else DOMSH.findFlatParentEltOrSelf(wedlet.element,wedMgr.wedEditor.rootNode,predicate)}const replIn=insideEditable?wedlet.element.getAttribute("replace-in"):null
if(replIn!=null){let elt=DOM.findLastChild(wedlet.elementHost,replaceInSelector1)||DOM.findLastChild(wedlet.elementHost,replaceInSelector2)
while(elt){const currWedlet=elt.wedlet
if(currWedlet.isVirtual()){if(addForVirtualNode(currWedlet,wedMgr,elt))break}else if(currWedlet.wedParent){let structsReplace
if(currWedlet.model.nodeType===ENodeType.attribute){structsReplace=wedMgr.docHolder.getAlternateStructs(currWedlet.wedParent.wedAnchor,0,ENodeType.attribute,currWedlet.xaPart)}else{structsReplace=wedMgr.docHolder.getAlternateStructs(currWedlet.wedParent.wedAnchor,currWedlet.xaPart,currWedlet.model.nodeType,currWedlet.wedNodeName||currWedlet.model.nodeName)}if(structsReplace!=null){insertReplaceBtnIn(wedMgr,this,replIn,currWedlet,structsReplace,focusActionWidgets)
break}}elt=DOM.findLastChild(currWedlet.elementHost,replaceInSelector1)||DOM.findLastChild(currWedlet.elementHost,replaceInSelector2)}}}}function replaceInSelector1(elt){return elt.hasAttribute("replace-here")&&IS_EltWedlet(elt)}function replaceInSelector2(elt){return IS_EltWedlet(elt)&&!isEltBoxSelection(elt)}function createInsertBtn(wedMgr,pos,structs,target,ctnOrient,forceSpace){const btn=document.createElement("box-btnadd")
btn.setAttribute("pos",pos)
const sr=btn.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(btn.localName,sr)
sr.appendChild(document.createTextNode(pos==="middle"?"+⇄":"+"))
btn.title=pos==="before"?"Insérer avant...":pos==="after"?"Insérer après...":"Insérer autour ou remplacer..."
btn.addEventListener("pointerdown",execBtnAdd)
btn.structs=structs
btn.structPos=pos==="middle"?"before":pos
btn.style.position="absolute"
if(ctnOrient==="v"){DOM.setStyleStart(btn,"-1em",target)
switch(pos){case"after":btn.style.bottom=forceSpace?`-${.8+forceSpace}em`:"-.8em"
break
case"before":btn.style.top=forceSpace?`-${.8+forceSpace}em`:"-.8em"
break
case"middle":break}}else{btn.style.top="-1em"
switch(pos){case"after":DOM.setStyleEnd(btn,"-1em",target)
break
case"before":DOM.setStyleStart(btn,"-1em",target)
break
case"middle":DOM.setStyleStart(btn,"50%",target)
break}}const parent=target.shadowRoot||target
DOM.setStyle(target,"position","relative")
parent.insertBefore(btn,parent.firstChild)
return btn}function createInsertChildBtn(wedMgr,structs,target,parentSel,pos="child"){var _a
const btn=document.createElement("box-btnadd")
btn.setAttribute("pos",pos)
const sr=btn.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(btn.localName,sr)
sr.appendChild(document.createTextNode("+"))
btn.structs=structs
btn.structPos="child"
btn.title=pos==="child"?"Insérer dedans...":"Insérer un attribut..."
btn.style.position=pos==="child"?"absolute":"relative"
btn.addEventListener("pointerdown",execBtnAdd)
DOM.setStyle(target,"position","relative");(parentSel&&((_a=target.shadowRoot)===null||_a===void 0?void 0:_a.querySelector(parentSel))||target.shadowRoot||target).appendChild(btn)
return btn}function insertReplaceBtnIn(wedMgr,parentElt,insPath,wedlet,structs,focusActionWidgets){DOM.setStyle(parentElt,"position","relative")
const btn=document.createElement("box-btnreplace-in")
const sr=btn.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin("box-btnreplace",sr)
sr.appendChild(document.createTextNode("⇄"))
btn.title="Remplacer..."
btn.wedlet=wedlet
btn.addEventListener("pointerdown",wedlet.isVirtual()?execBtnAdd:execBtnReplace)
btn.structs=structs
btn.structPos="before"
const p=parentElt.shadowRoot||parentElt
if(insPath===""){p.appendChild(btn)}else if(insPath.startsWith("append:")){const subP=p.querySelector(insPath.substring(7))
subP.appendChild(btn)}else if(insPath.startsWith("insBefore:")){const before=p.querySelector(insPath.substring(10))
before.parentNode.insertBefore(btn,before)}focusActionWidgets.push(btn)}REG.reg.registerSkin("box-btnadd",1,`\n\t:host {\n\t\tborder-radius: .2rem;\n\t\tbackground: var(--insbtn-bg);\n\t\tcolor: var(--insbtn-color);\n\t\tfont-size: .8rem;\n\t\tcursor: pointer;\n\t\twidth: .9rem;\n\t\ttext-align: center;\n\t\tz-index: 700;\n\t\tuser-select: none;\n\t}\n\n\t:host([pos=middle]) {\n\t\tline-height: 85%;\n\t}\n\n\t:host(:hover) {\n\t\tbackground: var(--insbtn-hover-bg);\n\t}\n`)
function createReplaceBtn(wedMgr,structs,target,ctnOrient,topPos){const btn=document.createElement("box-btnreplace")
const sr=btn.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(btn.localName,sr)
sr.appendChild(document.createTextNode("⇄"))
btn.title="Remplacer ou transformer..."
btn.addEventListener("pointerdown",execBtnReplace)
btn.structs=structs
btn.style.position="absolute"
if(ctnOrient==="v"){DOM.setStyleStart(btn,"-1em",target)
btn.style.top=`${topPos}em`}else{DOM.setStyleStart(btn,"-1em",target)}DOM.setStyle(target,"position","relative")
const parent=target.shadowRoot||target
parent.insertBefore(btn,parent.firstChild)
return btn}REG.reg.registerSkin("box-btnreplace",1,`\n\t:host {\n\t\tborder-radius: .2rem;\n\t\tbackground: var(--insbtn-bg);\n\t\tcolor: var(--insbtn-color);\n\t\tfont-size: .8rem;\n\t\twidth: .9rem;\n\t\ttext-align: center;\n\t\tcursor: pointer;\n\t\tuser-select: none;\n\t}\n\n\t:host(:hover) {\n\t\tbackground: var(--insbtn-hover-bg);\n\t}\n`)
export class InsertAction extends Action{constructor(struct,wedlet,pos){super()
this.struct=struct
this.wedlet=wedlet
this.pos=pos}getLabel(){return this.struct.structLabel||this.struct.structName}execute(ctx,ev){InsertAction.insertStruct(ctx.wedMgr,this.struct,this.wedlet,this.pos)}static async insertStruct(wedMgr,struct,wedlet,pos){const batch=wedMgr.docHolder.newBatch()
let xa=wedlet.wedAnchor
let jml
let atts
if(pos==="replace"&&struct instanceof SkRuleElt&&struct.convertFrom){const src={outStruct:struct,doc:wedMgr.docHolder.getDocument(),xa:xa}
const cnv=struct.convertFrom.findConverter(src)
if(cnv){const dst=await cnv.convert(src)
if(dst)jml=CONVERT.getDstAsJml(dst)}}let finalName=struct.structName
if(!jml){jml=[]
atts=Object.create(null)
const partialName=pos==="replace"&&struct.createContentAsync?await struct.createContentAsync(jml,atts,wedMgr.wedEditor.rootNode):struct.createContent(jml,atts)
if(partialName===false)return
if(typeof partialName==="string"){finalName=await POPUP.prompt(JSX.createElement("label",null,JSX.createElement("div",null,struct.structType===EFuzzyType.elements?"Nom de cet élément":"Nom de cet attribut"),JSX.createElement("input",{value:partialName,required:true,pattern:"^[A-Za-z_:][\\w\\-.:]*"})),wedMgr.wedEditor.rootNode,{titleBar:EFuzzyType.elements?"Ajout d\'un élément":"Ajout d\'un attribut"})
if(!finalName)return
if(!struct.structMatch(struct.structType===EFuzzyType.elements?ENodeType.element:ENodeType.attribute,finalName)){POPUP.showNotifInfo("Ce nom n\'est pas autorisé",wedMgr.wedEditor.rootNode)
return}if(struct.structType===EFuzzyType.elements){jml.push({"":finalName||"x"})}else if(struct.structType===EFuzzyType.attributes){let nm=finalName||"x"
if(!wedlet.isVirtual()){const elt=XA.findDomLast(xa,wedMgr.docHolder.getDocument())
while(elt.hasAttribute(nm))nm+="x"}atts[nm]=""}else throw Error()}}if(isWedletSingleElt(wedlet)&&!wedlet.element.isConnected)return
let attNames=atts?Object.keys(atts):null
if((attNames===null||attNames===void 0?void 0:attNames.length)===0)attNames=null
if(pos==="after"){XA.incrAtDepth(xa,-1,1)}else if(pos==="replace"){if(XA.isAttribute(xa)){batch.setAttr(xa,null)
if(jml.length>0){if(!wedlet.wedParent.isVirtual()){const node=XA.findDomContainer(xa,wedMgr.docHolder.getDocument())
xa=XA.setAtDepth(xa,-1,node.childNodes.length)}else{xa=XA.setAtDepth(xa,-1,0)}}else{xa=XA.up(xa)}}else{batch.deleteSequence(xa,1)
if(jml.length===0&&attNames!=null)xa=XA.up(xa)}}else if(pos==="child"){if(LANG.in(struct.structType,ENodeType.element,EFuzzyType.elements)){const pos=wedlet.isVirtual()?0:wedMgr.docHolder.getInsertableOffset(xa,ENodeType.element,"end",finalName)
if(pos<0)return
XA.append(xa,pos)}else if(struct.structType==ENodeType.text){const pos=wedlet.isVirtual()?0:wedMgr.docHolder.getInsertableOffset(xa,ENodeType.text,"end")
if(pos<0)return
XA.append(xa,pos)}}if(pos==="child"){if(wedlet.isVirtual())WEDLET.insertDatasFromDisplay(wedlet,batch)}else{if(wedlet.wedParent.isVirtual())WEDLET.insertDatasFromDisplay(wedlet.wedParent,batch)}if(attNames){if(attNames.length>1||jml.length>0){const xaParent=XA.freeze(XA.up(xa))
for(let i=0;i<attNames.length;i++){batch.setAttr(XA.append(xaParent,attNames[i]),atts[attNames[i]]||"")}if(jml.length>0){if(XA.isAttribute(xa))xa=XA.setAtDepth(xa,-1,0)
batch.insertJml(xa,jml)}}else{xa=XA.append(pos==="before"||XA.isAttribute(xa)?XA.up(xa):xa,attNames[0])
batch.setAttr(xa,atts[attNames[0]]||"")}}else{if(XA.isAttribute(xa))xa=XA.setAtDepth(xa,-1,0)
batch.insertJml(xa,jml)}batch.doBatch()}}class ReplaceAction extends InsertAction{execute(ctx,ev){InsertAction.insertStruct(ctx.wedMgr,this.struct,this.wedlet,"replace")}}function buildAddActions(wedlet,pos,structs){const actions=[]
for(let i=0;i<structs.length;i++){const struct=structs[i]
if(struct===null)continue
actions.push(new InsertAction(struct,wedlet,pos))}return actions}function execBtnAdd(ev){const wedlet=this.wedlet||findElementWedlet(this).wedlet
const actions=buildAddActions(wedlet,this.structPos,this.structs)
POPUP.showPopupActionsFromEvent({actions:actions,actionContext:wedlet,restoreFocus:this},ev)
ev.stopImmediatePropagation()
ev.preventDefault()}function buildReplaceActions(structs,wedlet){const actions=[]
for(let i=0;i<structs.length;i++){const struct=structs[i]
if(struct!==null)actions.push(new ReplaceAction(struct,wedlet,"replace"))}return actions}function execBtnReplace(ev){const wedlet=this.wedlet||findElementWedlet(this).wedlet
const actions=buildReplaceActions(this.structs,wedlet)
POPUP.showPopupActionsFromEvent({actions:actions,actionContext:wedlet,restoreFocus:this},ev)
ev.stopImmediatePropagation()
ev.preventDefault()}function hookMsgAfter(wedMgr,msg){if(isXmlMsg(msg)){const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(!boxSelMgr.selInVirtual)boxSelMgr.range.update(msg)}}function hookMsgForNextSel(wedMgr,transac,msg){var _a,_b,_c,_d,_e,_f
if(!msg||transac.getMeta("noFocus")===true)return
const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(wedMgr.docHolderAsync.isMsgFromUs(transac)){if(boxSelMgr.selInVirtual&&(!transac.metas||!(transac.metas.undo||transac.metas.redo))){const anchor=boxSelMgr.activeWedlet.wedAnchor
boxSelMgr.range.setRange(anchor,anchor)
boxSelMgr.redrawSelection()}if(isXmlMsg(msg)){if(msg instanceof XmlInsertMsg){boxSelMgr.setSelection({start:msg.xa,end:XA.newBd(msg.xa).incrAtDepth(-1,JML.lengthJmlOrText(msg.jml)-1).xa})}else{if(!boxSelMgr.focusAroundXAddr(msg.xa))boxSelMgr.redrawSelection()}(_a=wedMgr.config.histoEditPointsMgr)===null||_a===void 0?void 0:_a.addEditEntry(new HistoEditPoint(msg.xa,wedMgr.docHolder.house),(_b=boxSelMgr.activeWedlet)===null||_b===void 0?void 0:_b.wedAnchor.length,wedMgr.config.histoEditHolder)}else if(msg instanceof XmlBatch&&msg.selAfter){if(msg.selAfter.end&&typeof XA.last(msg.selAfter.end)==="number"){boxSelMgr.setSelection({start:msg.selAfter.addr,end:XA.newBd(msg.selAfter.end).incrAtDepth(-1,-1).xa});(_c=wedMgr.config.histoEditPointsMgr)===null||_c===void 0?void 0:_c.addEditEntry(new HistoEditPoint(msg.selAfter.end,wedMgr.docHolder.house),(_d=boxSelMgr.activeWedlet)===null||_d===void 0?void 0:_d.wedAnchor.length,wedMgr.config.histoEditHolder)}else{if(!boxSelMgr.focusAroundXAddr(msg.selAfter.addr))boxSelMgr.redrawSelection();(_e=wedMgr.config.histoEditPointsMgr)===null||_e===void 0?void 0:_e.addEditEntry(new HistoEditPoint(msg.selAfter.addr,wedMgr.docHolder.house),(_f=boxSelMgr.activeWedlet)===null||_f===void 0?void 0:_f.wedAnchor.length,wedMgr.config.histoEditHolder)}}}else{}}function getCurrentSel(wedMgr){const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(!boxSelMgr.activeWedlet)return undefined
if(boxSelMgr.selInVirtual){let w=boxSelMgr.activeWedlet
const virtualPath=WEDLET.buildVirtualPath(w)
while(w.wedParent&&w.wedParent.isVirtual())w=w.wedParent
return{start:w.wedAnchor,startInText:false,virtualPath:virtualPath}}const sel=XA.cloneRange(boxSelMgr.range)
sel.startInText=false
sel.endInText=false
return sel}function onPointerDown(ev){if(ev.shiftKey){const path=ev.composedPath()
for(let i=0;i<path.length;i++){const elt=path[i]
if(isEltBoxSelection(elt)&&elt.wedlet.wedMgr===this.wedMgr&&!elt.stopBoxSelection){if(this.boxSelMgr.activeWedlet!==elt.wedlet){this.boxSelMgr.extendSelTo(elt.wedlet)
ev.preventDefault()
ev.stopImmediatePropagation()}break}}}}function onFocus(wedMgr,focusElt){var _a
const elt=DOMSH.findFlatParentEltOrSelf(focusElt,wedMgr.wedEditor.rootNode,n=>isEltBoxSelection(n)||n.stopBoxSelection)
const editor=wedMgr.wedEditor
if(isEltBoxSelection(elt)&&elt.wedlet.wedMgr===wedMgr){if(elt.selMode!=="caret")editor.boxSelMgr.htmlSel.removeAllRanges()
editor.boxSelMgr.selectWedlet(elt.wedlet);(_a=wedMgr.config.histoEditPointsMgr)===null||_a===void 0?void 0:_a.onEditPointFocus(elt.wedlet.wedAnchor,wedMgr.config.histoEditHolder)}}function onBlur(wedMgr,ev){var _a,_b
if(ev.relatedTarget instanceof Element){if(((_b=findElementWedlet((_a=DOMSH.findFlatParentEltOrSelf(ev.relatedTarget,null,IS_Popupable))===null||_a===void 0?void 0:_a.logicalParent))===null||_b===void 0?void 0:_b.wedlet.wedMgr)===wedMgr)return}wedMgr.wedEditor.boxSelMgr.hideSel()}function onClipboardEvent(wedMgr,ev,focusElt){if(IS_EltWedlet(focusElt)&&isWedletBoxSelection(focusElt.wedlet)){const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(!boxSelMgr)return
if(boxSelMgr.isSingleSel()&&isEltBoxSelection(focusElt)&&"onClipboard"in focusElt){if(focusElt.onClipboard(ev))return true}const rg=boxSelMgr.range
switch(ev.type){case"copy":if(XA.isAttribute(rg.start)||!rg.isCollapsed)wedMgr.writeRangeToClipboard(rg,ev.clipboardData)
return true
case"cut":if(XA.isAttribute(rg.start)||!rg.isCollapsed){wedMgr.writeRangeToClipboard(rg,ev.clipboardData)
boxSelMgr.deleteContentSelection()}return true
case"paste":doPaste(wedMgr,focusElt,boxSelMgr,ev.clipboardData)
return true}}}function onReadOnlyChange(wedMgr){const boxSelMgr=wedMgr.wedEditor.boxSelMgr
boxSelMgr.redrawSelection()}async function doPaste(wedMgr,elt,boxSelMgr,dataTrsf){const txStamp=wedMgr.txStamp
const menuPos={posFrom:elt,fromY:"middle",targetY:"middle"}
function finalPaste(imp,ctx){const batch=wedMgr.docHolder.newBatch()
imp.doImport(ctx,batch)
batch.doBatch()}function pasteWithPos(imp,ctx,pos){if(!elt.isConnected)return
if(!pos||pos===EPastePos.replace||ctx.virtualPath){if(!WEDLET.isWritableWedlet(elt.wedlet))return
if(txStamp!==wedMgr.txStamp)ctx=newSiblingContext()
finalPaste(imp,ctx)}else if(pos===EPastePos.before){if(!WEDLET.isWritableWedlet(elt.wedlet.wedParent))return
finalPaste(imp,{sel:{start:boxSelMgr.range.start}})}else if(pos===EPastePos.after){if(!WEDLET.isWritableWedlet(elt.wedlet.wedParent))return
finalPaste(imp,{sel:{start:XA.newBd(boxSelMgr.range.start).incrAtDepth(-1,1).xa}})}else{const parentEditable=WEDLET.isWritableWedlet(elt.wedlet.wedParent)
const actions=[]
if((pos&EPastePos.before)>0&&parentEditable)actions.push(new Action("before").setLabel("Insérer avant").setExecute(()=>{pasteWithPos(imp,ctx,EPastePos.before)}))
if((pos&EPastePos.replace)>0&&WEDLET.isWritableWedlet(elt.wedlet))actions.push(new Action("replace").setLabel("Remplacer").setExecute(()=>{pasteWithPos(imp,ctx,EPastePos.replace)}))
if((pos&EPastePos.after)>0&&parentEditable)actions.push(new Action("after").setLabel("Insérer après").setExecute(()=>{pasteWithPos(imp,ctx,EPastePos.after)}))
if(actions.length===1){actions[0].execute()}else if(actions.length>0){POPUP.showPopupActions({actions:actions,restoreFocus:elt},menuPos,elt)}}}async function pasteSelected(imp,ctx,asChild){if(imp.needAsyncBuild&&await imp.buildContentToImport(elt)==="stop")return
if(!elt.isConnected)return
if(txStamp!==wedMgr.txStamp){ctx=asChild?newChildContext():newSiblingContext()}if(!asChild&&boxSelMgr.isSingleSel()){pasteWithPos(imp,ctx,imp.pastePos)}else{finalPaste(imp,ctx)}}async function tryPasteAsChild(siblingImp,siblingCtx,siblingMinMalue){let canAdd=true
let firstFound
elt.wedlet.visitWedletChildren(0,Number.MAX_SAFE_INTEGER,ch=>{if((ch.model.nodeType===ENodeType.element||ch.model.nodeType===ENodeType.text)&&isWedletSingleElt(ch)&&!ch.element.classList.contains("forbidden")){if(firstFound||ch.element.tabIndex>=0){canAdd=false
return"stop"}if(isDisplayedWedlet(ch))firstFound=true}})
if(canAdd){const childCtx=newChildContext()
const doc=wedMgr.docHolder
if(cache.originalDom){const childImports=await doc.house.schemaDom.tryPasteNodes(childCtx,cache.originalDom,cache)
if(childImports){const childMinMalus=childImports.reduce((acc,imp)=>Math.min(acc,imp.malus),Infinity)
if(siblingImp&&siblingMinMalue<=childMinMalus){selectImporters(siblingImp,siblingCtx,false)}else{selectImporters(childImports,childCtx,true)}return}}}if(siblingImp){selectImporters(siblingImp,siblingCtx,false)}else{POPUP.showNotifWarning("Aucun contenu du presse-papier n\'a pu être importé.",elt)}}function selectImporters(imToSel,ctx,asChild){if(imToSel.length===1&&imToSel[0].malus===0){pasteSelected(imToSel[0],ctx,asChild)}else{const actions=[]
imToSel.sort((a,b)=>a.malus-b.malus)
for(const imp of imToSel)actions.push((new Action).setLabel(imp.getLabel()).setExecute(()=>{pasteSelected(imp,ctx,asChild)}))
POPUP.showPopupActions({actions:actions,restoreFocus:elt},menuPos,wedMgr.wedEditor)}}function newSiblingContext(){return{sel:boxSelMgr.range,virtualPath:WEDLET.buildVirtualPath(elt.wedlet.wedParent)}}function newChildContext(){return{sel:{start:XA.append(elt.wedlet.wedAnchor,0)},virtualPath:WEDLET.buildVirtualPath(elt.wedlet)}}const cache={}
const siblingCtx=newSiblingContext()
const importers=await wedMgr.tryPaste(siblingCtx,cache,dataTrsf)
if(!importers){await tryPasteAsChild()}else{const minMalus=importers.reduce((acc,imp)=>Math.min(acc,imp.malus),Infinity)
if(minMalus>0)await tryPasteAsChild(importers,siblingCtx,minMalus)
else selectImporters(importers,siblingCtx,false)}}function onKeyDown(ev){this.boxSelMgr.accelKeyMgr.handleKeyboardEvent(ev,this)}function ctxMenuActions(){const wedMgr=this.wedlet.wedMgr
const editor=wedMgr.wedEditor
if(!editor.boxSelMgr)return null
let actions=buildActions(this,wedMgr)
const focusActionWidgets=editor.boxSelMgr.focusActionWidgets
for(let i=0;i<focusActionWidgets.length;i++){const actW=focusActionWidgets[i]
if(actW.localName==="box-btnadd"){const structs=actW.structs
switch(actW.structPos){case"before":const subBefore=buildAddActions(this.wedlet,"before",structs)
if(subBefore.length>0)(actions||(actions=[])).push(new ActionMenu("insBefore").setLabel(this.wedlet.isVirtual()?"Insérer autour ou remplacer...":"Insérer avant...").setGroup("ins").setActions(subBefore))
break
case"child":const subIn=buildAddActions(this.wedlet,"child",structs)
if(subIn.length>0){let last
if(!actions)actions=[]
else last=actions[actions.length-1]
const newAct=new ActionMenu("insInside").setLabel("Insérer dedans...").setGroup("ins").setActions(subIn)
if((last===null||last===void 0?void 0:last.getId())==="insAfter"){actions[actions.length-1]=newAct
actions.push(last)}else{actions.push(newAct)}const next=focusActionWidgets[i+1]
if((next===null||next===void 0?void 0:next.localName)==="box-btnadd"&&next.structPos==="child"){i++
const nextSubIn=buildAddActions(this.wedlet,"child",next.structs)
if(nextSubIn.length>0){subIn.push(new ActionSeparator)
subIn.push(...nextSubIn)}}}break
case"after":if(DOMSH.isFlatAncestor(this,actW)){const subAfter=buildAddActions(this.wedlet,"after",structs)
if(subAfter.length>0)(actions||(actions=[])).push(new ActionMenu("insAfter").setLabel("Insérer après...").setGroup("ins").setActions(subAfter))}break}}else if(actW.localName==="box-btnreplace"){const subReplace=buildReplaceActions(actW.structs,this.wedlet)
if(subReplace.length>0)(actions||(actions=[])).push(new ActionMenu("replace").setLabel("Remplacer...").setGroup("ins").setActions(subReplace))}}if(!actions||actions.length===0)return null
actions=ACTION.injectSepByGroup(actions,this.groupOrder||wedMgr.reg.getPref(this.groupOrderPref||"groupOrder.wed.box","ins insObj *"),this.wedlet)
return{actions:actions,actionContext:this.actionContext||new WedletActionCtx(this)}}function focusBar(){if(this._focusBar===undefined){const wedMgr=this.wedlet.wedMgr
const datas=wedMgr.getDatasForModel(this.wedlet.model)
if("focusBar"in datas){this._focusBar=datas.focusBar
if(!this._focusBar)return null
this._focusBar.actionContext.focusedElt=this
return this.focusBar}let actions=buildActions(this,wedMgr)
if(!actions||actions.length===0){this._focusBar=datas.focusBar=null}else{actions=ACTION.injectSepByGroup(actions,this.groupOrder||wedMgr.reg.getPref(this.groupOrderPref||"groupOrder.wed.box","ins insObj *"),this.wedlet)
this._focusBar=datas.focusBar=(new BarActions).initialize({actions:actions,actionContext:this.actionContext||new WedletActionCtx})}}if(this._focusBar===null)return null
this._focusBar.actionContext.focusedElt=this
return this._focusBar}function buildActions(elt,wedMgr){if(wedMgr.config.noFocus)return null
let actions
if(elt.actionsLists){actions=wedMgr.reg.mergeLists(...elt.actionsLists,"actions:wed:global")}else{actions=wedMgr.reg.getList("actions:wed:global")}return actions}REG.reg.addSvcToList("actions:wed:global","exclude",1,"wedBoxSelExclude",10)
REG.reg.addSvcToList("actions:wed:global","delete",1,"wedBoxSelDelete",20)

//# sourceMappingURL=boxSel.js.map