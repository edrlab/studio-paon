import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{GFX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/gfx.js"
import{MarkImportInsert,MarkImportReplace}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{findTxtStrParent}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/txt/txtUtils.js"
export function AgEltBoxInsertDrawerTxt(cls){const proto=cls.prototype
proto.drawInsertMarks=drawInsertMarks_Txt
proto.removeInsertMarks=removeInsertMarks_Txt
return cls}function drawInsertMarks_Txt(importers,emptyStruct){this._insMarks=[]
let isSelInThis
let replaceCh
let insertCh
for(const imp of importers){if(!imp.importPos){console.log("drawInsertMarks_Txt::: !imp.importPos::",imp)
return}if(imp.importPos.replaceChildren){if(!replaceCh)replaceCh=new Map
for(const chPath of imp.importPos.replaceChildren){let mark=replaceCh?replaceCh.get(chPath):null
if(mark){if(WEDLET.matchModel(imp.importPos.similarTo,mark.from.model))mark.addImporter(imp)}else{const ch=this.wedlet.findWedletChild(chPath,WEDLET.VISITOPTIONS_mainBranch)
if(ch&&WEDLET.matchModel(imp.importPos.similarTo,ch.wedlet.model)){mark=(new MarkImportReplace).placeOn(ch,imp,ch.element)
this._insMarks.push(mark)
replaceCh.set(chPath,mark)}}}}if(imp.importPos.insertOffsetMin!==undefined){if(this.isTextContainer){const txtRoot=this.txtRoot
if(txtRoot._insSelMarked===undefined){const selMgr=txtRoot.selMgr
const typeSel=selMgr.type
if(typeSel==="Range"||typeSel==="Caret"){if(DOM.isAncestor(this,selMgr.range.startContainer)){isSelInThis=true
if(typeSel==="Range"){txtRoot._insSelMarked=new MarkImportSel(this.wedlet,txtRoot,imp)}else{txtRoot._insSelMarked=(new MarkImportCaret).init(this.wedlet,imp,this,selMgr.range)}}}}else if(isSelInThis){txtRoot._insSelMarked.addImporter(imp)}}else{if(!insertCh)insertCh=new Map
let previousCh
for(let i=imp.importPos.insertOffsetMin;i<=imp.importPos.insertOffsetMax;i++){let mark=insertCh.get(i)
if(mark){mark.addImporter(imp)}else{const ch=this.wedlet.findWedletChild(i,WEDLET.VISITOPTIONS_mainBranch)
mark=(new MarkImportInsert).setClass("small").placeOn(this.wedlet,imp,this,i,ch,previousCh)
this._insMarks.push(mark)
insertCh.set(i,mark)
previousCh=ch}}}}}}function removeInsertMarks_Txt(){if(this._insMarks){for(const mark of this._insMarks)mark.remove()
this._insMarks=null}const txtRoot=this.txtRoot
if(txtRoot._insSelMarked){txtRoot._insSelMarked.remove()
txtRoot._insSelMarked=undefined}}class MarkImportCaret extends MarkImportInsert{placeOn(from,importer,parentRef){throw Error()}init(from,importer,para,rgCaret){this.from=from
this.importer=importer
from.wedMgr.reg.installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
if(rgCaret.startContainer instanceof Text){rgCaret.startContainer.parentNode.insertBefore(this,rgCaret.startContainer.splitText(rgCaret.startOffset))}else{console.error("MarkImportCaret caret position::::",rgCaret)}return this}buildImportContext(){const txtStr=findTxtStrParent(this)
if(txtStr.isVirtual()){return{sel:{start:XA.append(txtStr.wedAnchor,0)},virtualPath:WEDLET.buildVirtualPath(txtStr)}}else{const offset=txtStr.getXmlOffset(this,0)+1
return{sel:{start:XA.append(txtStr.wedAnchor,offset)}}}}remove(){const parent=this.parentElement
super.remove()
parent.normalize()}}REG.reg.registerSkin("txt-mark-caret",1,`\n\t:host {\n\t\tdisplay: inline-block;\n\t\tposition: absolute;\n\t\tz-index: 910;\n\t\twidth: 16px;\n\t\tmargin-inline-start: -8px;\n\t\tmargin-block-start: -.3em;\n\t\theight: 2em;\n\t\tbox-sizing: border-box;\n\t\tbackground-color: var(--edit-drop-color);\n\t\tbackground-clip: padding-box;\n\t\tborder: 6px solid transparent;\n\t\tborder-bottom-width: .3em;\n\t\tborder-top-width: .3em;\n\t\tborder-radius: 12px;\n\t}\n\n\t:host(.over),\n\t:host(:hover) {\n\t\twidth: 20px;\n\t\tmargin-inline-start: -10px;\n\t\tborder: 7px solid var(--edit-drop-bgcolor);\n\t  border-bottom-width: .1em;\n\t  border-top-width: .1em;\n\t}\n`)
customElements.define("txt-mark-caret",MarkImportCaret)
class MarkImportSel{constructor(from,txtRoot,imp){this.from=from
this.txtRoot=txtRoot
this.importer=imp
txtRoot.addEventListener("dragover",this.onTxtDragOverSel)
txtRoot.addEventListener("drop",this.onTxtDropOverSel)}addImporter(importer){if(!Array.isArray(this.importer))this.importer=[this.importer,importer]
else this.importer.push(importer)}remove(){DOM.setAttr(this.txtRoot,"dragOn",null)
this.txtRoot.removeEventListener("dragover",this.onTxtDragOverSel)
this.txtRoot.removeEventListener("drop",this.onTxtDropOverSel)}isOnSel(x,y){const rects=this.txtRoot.selMgrAsIs.range.getClientRects()
for(let i=0;i<rects.length;i++)if(GFX.isPointIn(rects.item(i),x,y))return true
return false}onTxtDragOverSel(ev){ev.preventDefault()
ev.stopImmediatePropagation()
if(this._insSelMarked.isOnSel(ev.x,ev.y)){ev.dataTransfer.dropEffect="link"
DOM.setAttr(this.txtRoot,"dragOn","sel")}else{ev.dataTransfer.dropEffect="none"
DOM.setAttr(this.txtRoot,"dragOn",null)}}onTxtDropOverSel(ev){ev.preventDefault()
ev.stopImmediatePropagation()
if(this._insSelMarked.isOnSel(ev.x,ev.y)){this._insSelMarked.execute(ev.dataTransfer)}}async execute(dataTransfer){const editor=this.from.wedMgr.wedEditor
if(Array.isArray(this.importer)){const actions=[]
for(const imp of this.importer){if(dataTransfer&&imp.completeDatasAtDrop){if(await imp.completeDatasAtDrop(dataTransfer)==="stop")continue}actions.push((new Action).setLabel(imp.getLabel()).setExecute(()=>{this.executeImporter(imp)}))}switch(actions.length){case 0:{POPUP.showNotifInfo("Import incompatible",this.txtRoot)
return}case 1:{return actions[0].execute(null)}default:const action=await POPUP.showPopupActions({actions:actions},{posFrom:this.txtRoot,fromY:"middle",targetY:"middle"},editor)
if(!action)editor.endInsertSession()}}else{if(dataTransfer&&this.importer.completeDatasAtDrop){if(await this.importer.completeDatasAtDrop(dataTransfer)==="stop"){POPUP.showNotifInfo("Import incompatible",this.txtRoot)
return}}return this.executeImporter(this.importer)}}async executeImporter(imp){try{if(imp.needAsyncBuild){if(await imp.buildContentToImport(this.from.wedMgr.wedEditor)==="stop")return
this.txtRoot.selMgrAsIs.restoreSel()}const ctx=this.buildImportContext()
if(ctx){const batch=this.from.wedMgr.docHolder.newBatch()
imp.doImport(ctx,batch)
batch.doBatch()}}finally{this.from.wedMgr.wedEditor.endInsertSession()}}buildImportContext(){if(this.txtRoot.selMgr.type==="Range"){return{sel:this.txtRoot.selMgr.getXaRange()}}else{return null}}}
//# sourceMappingURL=insMgrTxt.js.map