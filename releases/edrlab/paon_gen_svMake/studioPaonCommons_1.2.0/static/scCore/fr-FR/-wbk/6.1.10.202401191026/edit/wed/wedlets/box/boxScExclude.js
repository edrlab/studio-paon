import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{EWedletEditMode,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DocHolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{WedEditorFrag}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditorBox.js"
import{ACTION,Action,ActionHackCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
export class BoxScExclude extends HTMLElement{configWedletElt(tpl,wedlet){this.setAttribute("sc-comments","no")
this.title="Contenu exclu"
const parentWedMgr=wedlet.wedMgr
this.wedlet=wedlet
this.btn=JSX.createElement("div",{id:"btn",onclick:this.onClick})
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
sr.append(this.btn)
if(wedlet.cmtHouse!=null){wedlet.cmtHouse.then(async cmtH=>{this.cmtDoc=new DocHolder(cmtH)
this.subEditor=(new WedEditorFrag).initialize({reg:parentWedMgr.reg,commonBar:parentWedMgr.wedEditor.commonBar})
this.subEditor.wedModel=parentWedMgr.wedModel
const exclModel=wedlet.wedParent.model.buildModelForFragment(wedlet.wedParent)
sr.appendChild(this.subEditor)
this.subEditor.onkeydown=this.onKeyDownSubEditor
this.subEditor.stopBoxSelection=true
this.subEditor.addEventListener("focusout",ev=>{if(ev.relatedTarget===this){parentWedMgr.listeners.emit("getFocus",parentWedMgr,this)}},true)
this.subEditor.scrollContainer.addEventListener("scroll",(function(ev){this.style.minHeight=Math.ceil(this.scrollHeight)+"px"}),{passive:true})
await this.subEditor.initFromDocHolder(this.cmtDoc,{noAnnots:true,readOnlyCauses:["excludeCtx"],xaRoot:[0],rootModel:exclModel,overrideReg:reg=>{reg.addToList("actions:wed:global","include",1,new IncludeInSubEditor(includeAction,{wedMgr:parentWedMgr,focusedElt:this,wedlet:wedlet}),-999)}})
if(this.collapsed)this._doCollapse(true)})}this.ondblclick=this.toggle
this.onkeydown=this.onKeyDown}get collapsed(){return this.hasAttribute("collapsed")}set collapsed(state){if(DOM.setAttrBool(this,"collapsed",state)){this._doCollapse(state)
this.dispatchEvent(new CustomEvent("wed-resized",{bubbles:true,composed:true}))}}toggle(ev){ev===null||ev===void 0?void 0:ev.stopImmediatePropagation()
ev===null||ev===void 0?void 0:ev.preventDefault()
this.collapsed=!this.collapsed}_doCollapse(st){if(this.subEditor){this.subEditor.hidden=st
if(!st)this.subEditor.scrollContainer.style.minHeight=null}}setEditMode(mode){}refreshBindValue(val,children){}onClick(){DOMSH.findHost(this).toggle()}onKeyDown(ev){if(ev.target!==this)return
if(ev.key==="ArrowRight"||ev.key==="Tab"){if(!ACTION.isAccelPressed(ev)&&this.collapsed)this.collapsed=false}else if(LANG.in(ev.key,"Enter"," ")&&!ACTION.isAnyControlPressed(ev)){this.toggle(ev)}}onKeyDownSubEditor(ev){if(ev.key==="Backspace"||ev.key==="Delete"){ev.stopImmediatePropagation()
ev.preventDefault()}}}AgEltBoxSelection(BoxScExclude,{selMode:"box",actionsLists:["actions:wed:box-scexclude","actions:wed:box"]})
REG.reg.registerSkin("box-scexclude",1,`\n\t:host {\n\t\tbackground-color: var(--edit-exclude-bgcolor, #eaeaea);\n\t\tbackground-image: linear-gradient(rgba(0, 0, 0, .03), rgba(0, 0, 0, .03));\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\tmargin: .5em;\n\t\tbox-shadow: .1em .1em .5em .1em var(--edit-exclude-shadow-color, #b6b6b6);\n\t\tclear: both;\n\t\tpadding: 0 .5em .5em .5em;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-box-focus);\n\t}\n\n\t#btn {\n\t\talign-self: start;\n\t\tmin-width: 1em;\n\t\tmin-height: 1em;\n\t\tbackground: no-repeat top / contain url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/collapse.svg);\n\t\tcursor: pointer;\n\t}\n\n\t:host([collapsed]) {\n\t\tbackground-image: repeating-linear-gradient(-30deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .03) 5px, rgba(255, 255, 255, .03) 5px, rgba(255, 255, 255, .03) 10px);\n\t}\n\n\t:host([collapsed]) > #btn {\n\t\tbackground: no-repeat top / contain url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/uncollapse.svg);\n\t}\n\n\tbox-editor-frag {\n\t\tflex: 1;\n\t\topacity: .6;\n\t\tfont-size: .8em;\n\t\tbackground-color: var(--edit-exclude-bgcolor, #eaeaea);\n\t\tbackground-image: repeating-linear-gradient(-30deg, rgba(0, 0, 0, .03), rgba(0, 0, 0, .03) 5px, rgba(255, 255, 255, .03) 5px, rgba(255, 255, 255, .03) 10px);\n\t\tborder: 1px solid var(--edit-exclude-bgcolor, #eaeaea);\n\t}\n`)
window.customElements.define("box-scexclude",BoxScExclude)
const includeAction=new Action("wedBoxInclude").setLabel("Réinclure").setIcon("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/box/includeTag.svg").setVisible(ctx=>ctx.wedMgr.wedEditor.boxSelMgr.isSingleSel()).setEnabled(ctx=>WEDLET.resolveEditMode(ctx.wedlet.wedParent)===EWedletEditMode.write).setExecute(async ctx=>{var _a
const box=ctx.focusedElt
const excludedRoot=box.cmtDoc.getDocument().documentElement
const toInsertFrag=box.cmtDoc.house.exportFragment({start:XA.fromNode(excludedRoot.firstChild),end:XA.incrAtDepth(XA.fromNode(excludedRoot.lastChild),-1,1)})
const doc=ctx.wedMgr.docHolder
async function doReinsert(node,sel,addRemExclude){const impCtx={sel:sel}
const cache={}
const importers=await doc.house.schemaDom.tryPasteNodes(impCtx,node,cache)
if(!box.isConnected)return
if((importers===null||importers===void 0?void 0:importers.length)>0){const importer=importers[0]
if(importer.malus===0){const batch=doc.newBatch()
importer.doImport(impCtx,batch)
batch.doBatch()
return true}}return false}const toInsertRoot=toInsertFrag.ownerDocument.createElementNS(DOM.SCCORE_NS,DOM.SCFRAGMENT_TAG)
toInsertRoot.appendChild(toInsertFrag)
if(!await doReinsert(toInsertRoot,XA.newRangeAround(ctx.wedlet.wedAnchor))){if(!box.isConnected)return
const impCtx={xaParent:ctx.wedlet.wedParent.wedAnchor}
const datas={originalDom:toInsertRoot}
const importers=await doc.house.schemaDom.tryImport(impCtx,datas)
if(!box.isConnected)return
if((importers===null||importers===void 0?void 0:importers.length)>0){const importer=importers[0]
const impPos=importer.importPos
if(impPos.insertOffsetMin==null&&((_a=impPos.replaceChildren)===null||_a===void 0?void 0:_a.length)===1){const batch=doc.newBatch()
importer.doImport({sel:XA.newRangeAround(XA.append(box.wedlet.wedParent.wedAnchor,impPos.replaceChildren[0]))},batch)
batch.needAdjustForNextAdds().deleteSequence(box.wedlet.wedAnchor,1)
batch.doBatch()}else if(!impPos.replaceChildren&&impPos.insertOffsetMin===impPos.insertOffsetMax){const batch=doc.newBatch()
importer.doImport({sel:{start:XA.append(box.wedlet.wedParent.wedAnchor,impPos.insertOffsetMin)}},batch)
batch.needAdjustForNextAdds().deleteSequence(box.wedlet.wedAnchor,1)
batch.doBatch()}else{POPUP.showNotifInfo("Ce contenu exclu n\'a pas pu être réintroduit simplement. Réintégrez-le par des actions de copier et coller.",box)}}}})
class IncludeInSubEditor extends ActionHackCtx{constructor(sub,ctx){super(sub)
this.ctx=ctx}getGroup(ctx){return"UP"}wrapCtx(ctx){return this.ctx}}REG.reg.addToList("actions:wed:box-scexclude","include",1,includeAction,10)
REG.reg.addToList("actions:wed:box-scexclude","exclude",1,null)

//# sourceMappingURL=boxScExclude.js.map