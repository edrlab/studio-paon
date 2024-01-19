import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{isWedletBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{isWedDefaultDisplay}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{EWedletEditMode,findWedEditor,IS_EltWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,JSX,ShadowJsx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{SkRuleNode}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{IS_ActionableEnabled}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/actionables.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{BoxHost}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
export function AgInsSelEditor(cls,visitOptions){const proto=cls.prototype
const superInit=proto.initialize
proto.initialize=function(config){superInit.call(this,config)
this.rootNode.addEventListener("delegate-host",ev=>{const elt=ev.composedPath()[0]
const host=elt.delegatedHost
if(host instanceof BoxHost)addDragMgrOnWedletHost(host)})
this.rootNode.addEventListener("dragenter",ev=>{if(this._dragEnter){this._dragEnter=ev.target
return}const datas=this.wedMgr.extractDatasFromDragSession(ev.dataTransfer)
if(datas){this._dragEnter=ev.target
this.startInsertSession(datas,true)}})
this.rootNode.addEventListener("dragleave",ev=>{if(this._dragEnter!==ev.target)return
this._dragEnter=null
this.endInsertSession()})
const insAction=new ListInsBoxStruct
config.reg.addToList("actions:wed:commonbar:start","insTag",1,insAction,60)
this.wedMgr.accelKeyMgr.addAccelKey("Insert","",insAction)
return this}
proto._insMgrVisitOptions=visitOptions
proto.startInsertSession=startInsertSession
proto.endInsertSession=endInsertSession
return cls}export function addDragMgrOnWedletHost(root){root.addEventListener("dragstart",(function onDragStart(ev){const eltWedlet=DOM.findParentOrSelf(ev.target,null,IS_EltWedlet)
const wedlet=eltWedlet?eltWedlet.wedlet:null
const wedMgr=wedlet.wedMgr
const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(!eltWedlet||wedlet.isVirtual()||boxSelMgr&&boxSelMgr.activeWedlet!==wedlet){ev.preventDefault()
return}const doc=wedMgr.docHolder.getDocument()
const frag=doc.createElementNS(DOM.SCCORE_NS,"fragment")
if(boxSelMgr){XA.cloneFragment(doc,frag,boxSelMgr.range)
if(!frag.hasChildNodes()){ev.preventDefault()
return}}else{const node=XA.findDomLast(wedlet.wedAnchor,doc)
if(!node||node.nodeType===ENodeType.attribute){ev.preventDefault()
return}frag.appendChild(node.cloneNode(true))}ev.dataTransfer.effectAllowed=wedlet.editMode===EWedletEditMode.write?"copyMove":"copy"
ev.dataTransfer.setDragImage(new Image,0,0)
wedMgr.wedEditor.startInsertSession({originalDom:frag},true,wedlet)}))
root.addEventListener("dragend",(function onDragEnd(ev){const eltWedlet=DOM.findParentOrSelf(ev.target,null,IS_EltWedlet)
if(eltWedlet)eltWedlet.wedlet.wedMgr.wedEditor.endInsertSession()}))}function isInsMgrWedlet(w){return w&&typeof w.markInserts==="function"}export function AgWedletInsMgr(cls){const proto=cls.prototype
if(!proto.markInserts)proto.markInserts=markInserts
if(!proto.eraseInsertMarks)proto.eraseInsertMarks=eraseInsertMarks
if(!proto.getDropEffect)proto.getDropEffect=function(mark,ev){const allowed=ev.dataTransfer.effectAllowed
if(allowed==="copyMove"){let result
function checkFrom(w){if(mark.wdlBefore===w||mark.wdlAfter===w)return"copy"
if(WEDLET.isAncestorOrEqual(w,mark.from))return"copy"}const boxSelMgr=this.wedMgr.wedEditor.boxSelMgr
if(boxSelMgr){result=boxSelMgr.visitSelectedWedlets(checkFrom)}else{result=checkFrom(this)}return result||ACTION.isCopyOverMove(ev)?"copy":"move"}return allowed}
if(!proto.finalizeInsertion)proto.finalizeInsertion=function(batch,action){if(action==="move"){const wedMgr=this.wedMgr
const boxSelMgr=wedMgr.wedEditor.boxSelMgr
if(batch.docHolder===wedMgr.docHolder){batch.needAdjustForNextAdds()
if(boxSelMgr){batch.setSelBefore(boxSelMgr.range.start,boxSelMgr.range.end)
boxSelMgr.deleteContentSelection(batch)}else{batch.setSelBeforeSeq(this.wedAnchor,1)
batch.deleteSequence(this.wedAnchor,1)}batch.doBatch()}else{batch.doBatch()
if(boxSelMgr)boxSelMgr.deleteContentSelection()
else wedMgr.docHolder.newBatch().deleteSequence(this.wedAnchor,1).doBatch()}}else{batch.doBatch()}}
return cls}function startInsertSession(datas,byDrag,ctrl){this.endInsertSession()
this._insSession=new InsSession(this,datas,byDrag,ctrl)}function endInsertSession(){const insSess=this._insSession
if(!insSess)return
this._insSession=null
this._dragEnter=null
insSess.erase()}class InsSession{constructor(editor,datas,byDrag,ctrl){this.editor=editor
this.datas=datas
this.byDrag=byDrag
this.ctrl=ctrl
this.widgets=new Set
if(!byDrag)editor.rootNode.addEventListener("pointerdown",onPointerdownInsSession,{capture:true})
const scrollCtn=this.editor.scrollContainer
if(scrollCtn)scrollCtn.addEventListener("scroll",this.onScroll,{passive:true})
this.redraw()}redraw(){WEDLET.findWedletInArea(wedletArea=>{const w=wedletArea.wedlet
if(isInsMgrWedlet(w)&&WEDLET.isWritableWedlet(w)){if(w.currentInsDatas!==this.datas){this.widgets.add(w)
return w.markInserts(this.datas)}}return"next"},this.editor.wedMgr.rootWedlet,this.editor.rootNode.getBoundingClientRect(),this.editor._insMgrVisitOptions)}erase(){if(!this.byDrag)this.editor.rootNode.removeEventListener("pointerdown",onPointerdownInsSession,{capture:true})
if(this.editor.scrollContainer)this.editor.scrollContainer.removeEventListener("scroll",this.onScroll)
for(const w of this.widgets)w.eraseInsertMarks()
this.editor=null
this.widgets.clear()}onScroll(ev){DOMSH.findHost(this)._insSession.redraw()}}async function onPointerdownInsSession(ev){const eltPath=ev.composedPath()
const editor=findWedEditor(this)
try{const mark=eltPath.find(IS_MarkImportInsert)
if(mark)await mark.execute()}finally{editor.endInsertSession()}}export function markInserts(datas){var _a
this.currentInsDatas=datas
if(!isEltInsertDrawer(this.elementHost)||!WEDLET.isWritableWedlet(this))return"next"
if(this.wedParent==null)return"next"
const wedMgr=this.wedMgr
const impCtx={xaParent:this.wedAnchor,virtualPath:WEDLET.buildVirtualPath(this)};(_a=wedMgr.docHolder.house.schemaDom.tryImport(impCtx,datas))===null||_a===void 0?void 0:_a.then(importers=>{if((importers===null||importers===void 0?void 0:importers.length)>0&&this.currentInsDatas===datas){this.elementHost.drawInsertMarks(importers,datas.emptyStruct)}})
return"next"}function eraseInsertMarks(){this.currentInsDatas=null
const p=this.elementHost
if(isEltInsertDrawer(p)&&p.isConnected)p.removeInsertMarks()}function isEltInsertDrawer(elt){return elt&&"drawInsertMarks"in elt}export function AgEltBoxInsertDrawerBox(cls){const proto=cls.prototype
proto.drawInsertMarks=drawInsertMarks_Box
proto.removeInsertMarks=removeInsertMarks
return cls}function drawInsertMarks_Box(importers,emptyStruct){var _a,_b
this._insMarks=[]
let replaceFull
let replaceCh
let insertCh
let replaceVirtuals
let orientHoriz
for(const imp of importers){if(!imp.importPos){if(replaceFull)replaceFull.addImporter(imp)
else{this._insMarks.push(replaceFull=(new MarkImportReplace).placeOn(this.wedlet,imp,this))}}else{if(imp.importPos.replaceChildren){if(!replaceCh)replaceCh=new Map
repl:for(const chPath of imp.importPos.replaceChildren){let mark=replaceCh?replaceCh.get(chPath):null
if(mark){mark.addImporter(imp)}else{const ch=this.wedlet.findWedletChild(chPath,WEDLET.VISITOPTIONS_mainBranch)
if(isWedletSingleElt(ch)){if(!emptyStruct||!WEDLET.matchModel(imp.importPos.similarTo,ch.model)){for(let widget=ch.elementHost.previousElementSibling;widget;widget=widget.previousElementSibling){if(IS_EltWedlet(widget)){if(widget.wedlet.model.nodeType===ENodeType.comment)continue
if(!widget.wedlet.isVirtual())break
if(WEDLET.matchModel(imp.importPos.similarTo,widget.wedlet.model))continue repl}}mark=(new MarkImportReplaceCtn).placeOn(ch,imp,ch.element)
this._insMarks.push(mark)
replaceCh.set(chPath,mark)}}}}}if(imp.importPos.insertOffsetMin!==undefined){if(!insertCh)insertCh=new Map
let previousCh
eachOffset:for(let i=imp.importPos.insertOffsetMin;i<=imp.importPos.insertOffsetMax;i++){let mark=insertCh.get(i)
if(mark){mark.addImporter(imp)}else{const ch=this.wedlet.findWedletChild(i,WEDLET.VISITOPTIONS_mainBranch)
if(!ch||isWedletSingleElt(ch)){for(let widget=ch?ch.elementHost.previousElementSibling:this.wedlet.elementHost.lastElementChild;widget;widget=widget.previousElementSibling){if(IS_EltWedlet(widget)){if(widget.wedlet.model.nodeType===ENodeType.comment)continue
if(!widget.wedlet.isVirtual())break
const sameModel=WEDLET.matchModel(imp.importPos.similarTo,widget.wedlet.model)
if(emptyStruct?!sameModel&&isWedDefaultDisplay(widget.wedlet.displayCtx):sameModel){let mark=replaceVirtuals&&replaceVirtuals.get(widget)
if(mark){mark.addImporter(imp)}else{mark=(new MarkImportReplaceCtn).placeOn(widget.wedlet,imp,widget)
this._insMarks.push(mark);(replaceVirtuals||(replaceVirtuals=new Map)).set(widget,mark)}}if(sameModel)continue eachOffset}}}if(orientHoriz===undefined)orientHoriz=GFX.getContainerOrient(((_b=(_a=ch)===null||_a===void 0?void 0:_a.elementHost)===null||_b===void 0?void 0:_b.assignedSlot)||this.wedlet.elementHost)==="h"
mark=(new MarkImportInsert).placeOn(this.wedlet,imp,this,i,ch,previousCh,orientHoriz)
this._insMarks.push(mark)
insertCh.set(i,mark)
previousCh=ch}}}if(imp.importPos.insertAtts)throw"TODO imp.importPos.insertAtts"}}}function removeInsertMarks(){if(this._insMarks){for(const mark of this._insMarks)mark.remove()
this._insMarks=null}}export class MarkImportInsert extends HTMLElement{constructor(){super()
this.ondragenter=this.onDragEnter
this.ondragleave=this.onDragLeave
this.ondragover=this.onDragOver
this.ondrop=this.onDrop
this.onkeydown=this.onKeyDown
this.onblur=this.onBlur
this.onclick=this.onClick
this.tabIndex=0}setClass(cls){if(cls)this.classList.add(cls)
return this}placeOn(from,importer,parentRef,offset,before,after,orientHoriz){this.from=from
this.wdlBefore=before
this.wdlAfter=after
this.offset=offset
this.importer=importer
REG.findReg(parentRef).installSkin(orientHoriz?"box-mark-ins/horiz":"box-mark-ins",this.attachShadow(DOMSH.SHADOWDOM_INIT))
parentRef.wedlet.injectForeignChild(importer.importPos.similarTo,this,before,after)
return this}addImporter(importer){if(!Array.isArray(this.importer))this.importer=[this.importer,importer]
else this.importer.push(importer)}onDragEnter(ev){ev.preventDefault()
ev.stopImmediatePropagation()
this.setDropEffect(ev)
DOM.addClass(this,"over")}onDragOver(ev){ev.preventDefault()
ev.stopImmediatePropagation()
this.setDropEffect(ev)}setDropEffect(ev){const insCtrl=this.from.wedMgr.wedEditor._insSession.ctrl
if(insCtrl&&insCtrl.getDropEffect){ev.dataTransfer.dropEffect=insCtrl.getDropEffect(this,ev)}else{switch(ev.dataTransfer.effectAllowed){case"copy":ev.dataTransfer.dropEffect="copy"
return
case"move":ev.dataTransfer.dropEffect="move"
return
case"copyMove":if(ACTION.isCopyOverMove(ev)){ev.dataTransfer.dropEffect="copy"}else{ev.dataTransfer.dropEffect="move"}return}ev.dataTransfer.dropEffect="link"}}onDragLeave(ev){ev.preventDefault()
DOM.removeClass(this,"over")}onDrop(ev){this.onDragLeave(ev)
this.setDropEffect(ev)
this.execute(ev.dataTransfer,ev.dataTransfer.dropEffect)}onKeyDown(ev){if(ev.key==="Tab"){if(ev.shiftKey)findPreviousMark(this.from.wedMgr.wedEditor,this,ev)
else findNextMark(this.from.wedMgr.wedEditor,this,ev)}else if(ev.key==="ArrowDown"){ev.preventDefault()
ev.stopImmediatePropagation()
findNextMark(this.from.wedMgr.wedEditor,this,ev)}else if(ev.key==="ArrowUp"){ev.preventDefault()
ev.stopImmediatePropagation()
findPreviousMark(this.from.wedMgr.wedEditor,this,ev)}else if(ev.key==="Enter"||ev.key===" "){ev.preventDefault()
ev.stopImmediatePropagation()
this.execute()}}onBlur(ev){if(!this._freezeBlur)this.from.wedMgr.wedEditor.endInsertSession()
else this._freezeBlur=false}onClick(ev){ev.preventDefault()
ev.stopImmediatePropagation()
this.execute()}async execute(dataTransfer,dropEffect){const editor=this.from.wedMgr.wedEditor
if(Array.isArray(this.importer)){const actions=[]
for(const imp of this.importer){if(dataTransfer&&imp.completeDatasAtDrop){if(await imp.completeDatasAtDrop(dataTransfer)==="stop")continue}actions.push((new Action).setLabel(imp.getLabel()).setExecute(()=>{this.executeImporter(imp,dropEffect)}))}switch(actions.length){case 0:{POPUP.showNotifInfo("Import incompatible",this)
return}case 1:{return actions[0].execute(null)}default:const action=await POPUP.showPopupActions({actions:actions},{posFrom:this,fromY:"middle",targetY:"middle"},editor)
if(!action)editor.endInsertSession()}}else{if(dataTransfer&&this.importer.completeDatasAtDrop){if(await this.importer.completeDatasAtDrop(dataTransfer)==="stop"){POPUP.showNotifInfo("Import incompatible",this)
return}}return this.executeImporter(this.importer,dropEffect)}}async executeImporter(imp,action){const wedMgr=this.from.wedMgr
const insCtrl=wedMgr.wedEditor._insSession.ctrl
const batch=wedMgr.docHolder.newBatch()
try{if(imp.needAsyncBuild){if(await imp.buildContentToImport(wedMgr.wedEditor)==="stop")return}imp.doImport(this.buildImportContext(),batch)}finally{wedMgr.wedEditor.endInsertSession()}if(insCtrl&&insCtrl.finalizeInsertion)insCtrl.finalizeInsertion(batch,action)
else batch.doBatch()}buildImportContext(){if(this.from.isVirtual()){return{sel:{start:XA.append(this.from.wedAnchor,0)},virtualPath:WEDLET.buildVirtualPath(this.from)}}else{return{sel:{start:XA.append(this.from.wedAnchor,this.offset)}}}}}REG.reg.registerSkin("box-mark-ins",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tposition: relative;\n\t\tz-index: 900;\n\t\twidth: 38px;\n\t\theight: 16px;\n\t\tmargin-top: -8px;\n\t\tmargin-bottom: -8px;\n\t\tbox-sizing: border-box;\n\t\tbackground-color: var(--edit-drop-color);\n\t\tbackground-clip: padding-box;\n\t\tborder: 6px solid transparent;\n\t\tborder-radius: 12px;\n\t}\n\n\t:host(.small) {\n\t\tborder: 7px solid transparent;\n\t}\n\n\t:host(.over),\n\t:host(:hover),\n\t:host(:focus) {\n\t\twidth: 48px;\n\t\theight: 20px;\n\t\tmargin-top: -10px;\n\t\tmargin-bottom: -10px;\n\t\tborder: 7px solid var(--edit-drop-bgcolor);\n\t\tborder-radius: 14px;\n\t\tmargin-inline-start: -1px;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n`)
REG.reg.registerSkin("box-mark-ins/horiz",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tposition: relative;\n\t\tz-index: 900;\n\t\twidth: 12px;\n\t\theight: 2em;\n\t\tmargin-inline-start: -6px;\n\t\tmargin-inline-end: -6px;\n\t\tbox-sizing: border-box;\n\t\tbackground-color: var(--edit-drop-color);\n\t\tbackground-clip: padding-box;\n\t\tborder: 4px solid transparent;\n\t\tborder-bottom-width: .3em;\n\t\tborder-top-width: .3em;\n\t\tborder-radius: 8px;\n\t}\n\n\t:host(.over),\n\t:host(:hover),\n\t:host(:focus) {\n\t\twidth: 16px;\n\t\tmargin-inline-start: -8px;\n\t\tmargin-inline-end: -8px;\n\t\tborder: 5px solid var(--edit-drop-bgcolor);\n\t\tborder-bottom-width: .3em;\n\t\tborder-top-width: .3em;\n\t\tborder-radius: 10px;\n\t\tmargin-block-start: -1px;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n`)
customElements.define("box-mark-ins",MarkImportInsert)
function IS_MarkImportInsert(n){return n instanceof MarkImportInsert}function findPreviousMark(wedEditor,mark,ev){const prev=DOMSH.findFlatPrevious(mark||wedEditor.rootNode,wedEditor.rootNode,IS_MarkImportInsert)
if(prev){ev.preventDefault()
ev.stopImmediatePropagation()
mark._freezeBlur=true
prev.focus()}else if(wedEditor.scrollContainer){wedEditor.scrollContainer.scrollBy({top:-wedEditor.scrollContainer.clientHeight*.8,behavior:"smooth"})}}function findNextMark(wedEditor,mark,ev){const next=DOMSH.findFlatNext(mark||wedEditor.rootNode,wedEditor.rootNode,IS_MarkImportInsert)
if(next){if(ev){ev.preventDefault()
ev.stopImmediatePropagation()}if(mark)mark._freezeBlur=true
next.focus()}else if(wedEditor.scrollContainer){wedEditor.scrollContainer.scrollBy({top:wedEditor.scrollContainer.clientHeight*.8,behavior:"smooth"})}}function findVisibleMark(wedEditor){const top=wedEditor.scrollContainer?wedEditor.scrollContainer.scrollTop:0
let next=DOMSH.findFlatNext(wedEditor.rootNode,wedEditor.rootNode,IS_MarkImportInsert)
while(next){if(next.offsetTop+next.offsetHeight>top){next.focus()
return}next=DOMSH.findFlatNext(next,wedEditor.rootNode,IS_MarkImportInsert)}}export class MarkImportReplace extends MarkImportInsert{placeOn(from,importer,ref){this.from=from
this.importer=importer
REG.findReg(ref).installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
ref.style.setProperty("position","relative");(ref.shadowRoot||ref).appendChild(this)
return this}buildImportContext(){const xa=this.from.wedAnchor
if(this.from.isVirtual()){return{sel:{start:xa},virtualPath:WEDLET.buildVirtualPath(this.from.wedParent)}}else if(XA.isAttribute(xa)){return{sel:{start:xa}}}else{return{sel:XA.newRangeAround(xa)}}}}REG.reg.registerSkin("box-mark-rep",1,`\n\t:host {\n\t\tbackground-color: var(--edit-drop-bgcolor);\n\t\tposition: absolute;\n\t\tz-index: 900;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\tright: 0;\n\t}\n\n\t:host(.over),\n\t:host(:hover),\n\t:host(:focus) {\n\t\tbackground-color: var(--edit-drop-bgcolor);\n\t\toutline: 2px solid var(--edit-drop-color);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n`)
customElements.define("box-mark-rep",MarkImportReplace)
export class MarkImportReplaceCtn extends MarkImportReplace{placeOn(from,importer,ref){this.from=from
this.importer=importer
REG.findReg(ref).installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
ref.style.setProperty("position","relative");(ref.shadowRoot||ref).appendChild(this)
return this}onDragEnter(ev){ev.preventDefault()
ev.stopImmediatePropagation()
this.setDropEffect(ev)
if(DOM.addClass(this,"over")){this.parentNode.insertBefore(JSX.createElement("div",{style:"pointer-events: none; background-color: var(--edit-drop-bgcolor); position: absolute;\ttop:0; bottom:0; left:0; right:0; z-index: 1;"}),this)}}onDragLeave(ev){ev.preventDefault()
if(DOM.removeClass(this,"over")){this.previousElementSibling.remove()}}}REG.reg.registerSkin("box-mark-rep-ctn",1,`\n\t:host {\n\t\tbackground: linear-gradient(to right, var(--edit-drop-bgcolor), var(--edit-drop-bgcolor), transparent);\n\t\tposition: absolute;\n\t\tz-index: 900;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tleft: 0;\n\t\twidth: 15px;\n\t}\n\n\t:host(:hover),\n\t:host(:focus) {\n\t\tbackground: linear-gradient(to right, var(--edit-drop-bgcolor), var(--edit-drop-bgcolor), transparent);\n\t\twidth: 30px;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n`)
customElements.define("box-mark-rep-ctn",MarkImportReplaceCtn)
class ListInsBoxStruct extends Action{constructor(){super("insTag")
this._label="Insérer..."
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/insertTag.svg"}isVisible(ctx){if(!ctx.boxSelMgr||ctx.config.disableBoxSelection)return false
return super.isVisible(ctx)}isEnabled(ctx){if(ctx.wedMgr.readOnly)return false
return super.isEnabled(ctx)}execute(ctx,ev){var _a
ctx.boxSelMgr.clearSel()
const structs=new Set
const virtualParents=new Set
WEDLET.findWedletInArea(wedletArea=>{var _a,_b
const w=wedletArea.wedlet
const wParent=w.wedParent
if(wParent&&isWedletBoxSelection(w)&&isWedletSingleElt(w)&&WEDLET.isWritableWedlet(wParent)&&!wParent.isCollapsed){const xaPart=w.xaPart
const wedMgr=ctx.wedMgr
if(wParent.isVirtual()){if(!virtualParents.has(wParent)){virtualParents.add(wParent)
const struct=wedMgr.docHolder.getStruct(wParent.wedAnchor,WEDLET.buildVirtualPath(wParent))
if(struct instanceof SkRuleNode){const subStructs=struct.contentRule.findRules(r=>r.structType==ENodeType.element)
if(subStructs){WEDLET.cleanupStructList(subStructs,WEDLET.findVirtualWedletsAfter(w.element,WEDLET.findVirtualWedletsBefore(w.element,true)),true)
for(const s of subStructs)if(s)structs.add(s)}}}}else{if(w.isVirtual()){if(w.model.nodeType===ENodeType.element){const[structsBefore]=wedMgr.docHolder.getInsertableStructs(wParent.wedAnchor,w.getVirtualXaPart())
WEDLET.cleanupStructList(structsBefore,WEDLET.findVirtualWedletsAfter(w.element,WEDLET.findVirtualWedletsBefore(w.element,true)),true)
if(structsBefore)for(const s of structsBefore)if((s===null||s===void 0?void 0:s.structType)===ENodeType.element)structs.add(s)
if(w.model.config.hasAttribute("insertUiForChildren")){const struct=wedMgr.docHolder.getStruct(w.wedAnchor,WEDLET.buildVirtualPath(w));(_b=(_a=struct===null||struct===void 0?void 0:struct.contentRule)===null||_a===void 0?void 0:_a.findRules(r=>r instanceof SkRuleNode))===null||_b===void 0?void 0:_b.forEach(s=>{if((s===null||s===void 0?void 0:s.structType)===ENodeType.element)structs.add(s)})}}}else if(typeof xaPart==="number"){const[structsBefore,structsAfter,structsReplace]=wedMgr.docHolder.getInsertableStructs(wParent.wedAnchor,xaPart,xaPart+1,false,xaPart)
WEDLET.cleanupStructList(structsBefore,WEDLET.findVirtualWedletsBefore(w.element),true)
WEDLET.cleanupStructList(structsAfter,WEDLET.findVirtualWedletsAfter(w.element),true)
const childrenElt=w.element.fromChildrenElt
function appendStructs(structList){if(structList)for(const s of structList)if((s===null||s===void 0?void 0:s.structType)===ENodeType.element){if(!childrenElt||!childrenElt.wedMatchStrict||childrenElt.wedMatcher.matchStruct(s))structs.add(s)}}appendStructs(structsBefore)
appendStructs(structsReplace)
appendStructs(structsAfter)
if(w.model.config.hasAttribute("insertUiForChildren")){const subStructs=wedMgr.docHolder.getInsertableStructsAll("children",w.wedAnchor)
if(WEDLET.cleanupStructList(subStructs[0],WEDLET.findAllChildrenVirtualWedlets(w.element))>0)appendStructs(subStructs[0])}}}}return"next"},ctx.wedMgr.rootWedlet,ctx.rootNode.getBoundingClientRect(),WEDLET.VISITOPTIONS_includeVirtuals)
if(structs.size>0){const rootList=JSX.createElement("div",{id:"list"})
const structsAdded=[]
list:for(const s of structs){for(const other of structsAdded)if(other.isSameRoot(s))continue list
structsAdded.push(s)
rootList.appendChild(ActionBtn.buildButton(new InsertableStruct(s),ctx,"custom"))}const rootFilter=JSX.createElement("div",{id:"search"},JSX.createElement("input",{type:"search",oninput:this.onSearchChange,onchange:this.onSearchChange,onkeydown:this.onSearchKeydown,onfocus:()=>{ctx.endInsertSession()}}))
const root=JSX.createElement("div",null,JSX.createElement(ShadowJsx,{reg:ctx.wedMgr.reg,skin:"ListInsBoxStruct",skinOver:"webzone:panel"},rootFilter,rootList))
const popup=POPUP.showFloating(root,listInsPopupPos(ctx.rootNode),ctx)
root.addEventListener("focusout",(function(ev){if(!ev.relatedTarget||!DOM.isAncestor(this,ev.relatedTarget)){ctx.endInsertSession()
popup.close()}}))
rootList.addEventListener("focusin",(function(ev){const target=ev.target
if(IS_ActionableEnabled(target))target.action.startSession(target.actionContext,false)}))
rootList.addEventListener("pointerover",(function(ev){const target=ev.target
if(IS_ActionableEnabled(target))target.focus()}))
rootList.addEventListener("keydown",(function(ev){let next
if(ev.key==="ArrowDown"){next=DOM.findNextSibling(ev.target,IS_ActionableEnabled)}else if(ev.key==="ArrowUp"){next=DOM.findPreviousSibling(ev.target,IS_ActionableEnabled)}else return
const target=ev.target
if(next){next.focus()
ev.preventDefault()
ev.stopImmediatePropagation()}}));(_a=DOM.findNext(root.shadowRoot,null,DOM.IS_focusable))===null||_a===void 0?void 0:_a.focus()}else{POPUP.showFloating(JSX.createElement("div",{style:"padding:.5em; font-style:italic;"},JSX.createElement(ShadowJsx,{reg:ctx.wedMgr.reg,skin:"webzone:panel"},"Aucune insertion possible")),listInsPopupPos(ctx.rootNode),ctx,{closeOnBlur:true})}}onSearchChange(ev){const value=this.value.trim()
const IS_actionBtn=n=>n instanceof ActionBtn
let btn=DOM.findFirstChild(DOMSH.findDocumentOrShadowRoot(this).getElementById("list"),IS_actionBtn)
if(value){const regexp=new RegExp(LANG.escape4RegexpFuzzy(value),"i")
while(btn!=null){btn.hidden=!regexp.test(btn.label)
btn=DOM.findNextSibling(btn,IS_actionBtn)}}else{while(btn!=null){btn.hidden=false
btn=DOM.findNextSibling(btn,IS_actionBtn)}}}onSearchKeydown(ev){var _a
if(ev.key==="ArrowDown"){(_a=DOM.findFirstChild(DOMSH.findDocumentOrShadowRoot(this).getElementById("list"),DOM.IS_focusable))===null||_a===void 0?void 0:_a.focus()}}}function listInsPopupPos(posFrom){return{posFrom:posFrom,fromX:"start",targetX:"start",marginX:200,toleranceX:50,fromY:"middle",targetY:"middle",toleranceY:1e4,notAvailableSpace:{posFrom:posFrom,fromX:"end",targetX:"start",toleranceX:1e4,fromY:"middle",targetY:"middle",toleranceY:1e4}}}REG.reg.registerSkin("ListInsBoxStruct",1,`\n\t:host {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\t#search {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tbackground: 0.1em / 1em no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/filter.svg) var(--form-search-bgcolor);\n\t\tpadding-inline-start: 1.2em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\tinput {\n\t\tflex: 1;\n\t\tpadding: 2px;\n\t\tbackground: var(--form-search-bgcolor);\n\t\tcolor: var(--form-color);\n\t\tborder: none;\n\t\tfont-size: inherit;\n\t}\n\n\t:focus {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\t#list {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t}\n\n\tc-action {\n\t\talign-items: start;\n\t\ttext-align: start;\n\t\tpadding: 1px 2px;\n\t}\n\n\tc-action:focus {\n\t\tbackground-color: var(--row-inSel-bgcolor);\n\t\toutline: none;\n\t}\n`)
class InsertableStruct extends Action{constructor(struct){super(struct.structName)
this.struct=struct
this._label=struct.structLabel}execute(ctx,ev){const isDrag=ev instanceof DragEvent
if(!isDrag){const focus=DOMSH.findDeepActiveElement()
if(focus instanceof HTMLElement)focus.blur()
POPUP.findPopupableParent(ev.target).close()}this.startSession(ctx,isDrag)
setTimeout(()=>{findVisibleMark(ctx)},200)}startSession(ctx,byDrag){const ct=[]
const root=DOM.newDomDoc().createElementNS(DOM.SCCORE_NS,DOM.SCFRAGMENT_TAG)
this.struct.createContent(ct)
ctx.startInsertSession({originalDom:JML.jmlToDom(ct,root),emptyStruct:true},byDrag)}}
//# sourceMappingURL=insMgr.js.map