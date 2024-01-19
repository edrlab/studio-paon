import{EWedletEditMode,findElementWedlet,IS_EltWedlet,isEditableWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DocHolder}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/docHolder.js"
import{applyDiffs,DiffAnnotReplace,EXmlDiffMode,mixCtToForeign}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/diff.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{WedEditorFrag}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditorBox.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{XmlTypedHouse}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlTypedHouse.js"
import{SkRuleDoc,SkRuleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaPatterns.js"
import{SkMatcherAnyElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaMatchers.js"
var IS_focusable=DOM.IS_focusable
export class WedDiffMark extends HTMLElement{get wedlet(){var _a
return(_a=findElementWedlet(this.holder))===null||_a===void 0?void 0:_a.wedlet}initDiffAnnot(holder,skAnnot,wedlet,foreignReplace,noAction){const wedMgr=wedlet.wedMgr
this.holder=holder
this.foreignReplace=foreignReplace
holder.wedAnnotDiff=this
wedMgr.reg.installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
this.skAnnot=skAnnot
this.title=foreignReplace?skAnnot.diffSession.mode===EXmlDiffMode.diff?"Contenu issu d\'un remplacement":"Contenu éliminé par un remplacement":skAnnot.getLabel()
const uiType=skAnnot.level.name
this.classList.add(uiType)
if(skAnnot instanceof DiffAnnotReplace){const uiSubType=skAnnot.inCurrent.level.name
this.classList.add(uiSubType)
holder.setAttribute("annot-diff",uiSubType)}else{holder.setAttribute("annot-diff",uiType)}if(!noAction)this.shadowRoot.appendChild(JSX.createElement(ActionBtn,{"î":{reg:wedMgr.reg,action:ERASEDIFF,actionContext:this,uiContext:"bar"}}))
return this}defaultInject(){DOM.setStyle(this.holder,"position","relative");(this.holder.shadowRoot||this.holder).appendChild(this)
return this}removeDiffWidget(){this.holder.wedAnnotDiff=null
this.holder.removeAttribute("annot-diff")
this.remove()
this.holder=null}get ctxMenuActions(){return{actions:[ERASEDIFF],actionContext:this}}get eraseDiffLabel(){if(this.foreignReplace)return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Annuler ce remplacement":"Valider ce remplacement par l\'autre version"
return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Annuler cet ajout":"Valider cette suppression"}eraseDiff(){const batch=this.fillBatch()
if(this.foreignReplace&&this.foreignReplace.parentNode){batch.needAdjustForNextAdds()
this.foreignReplace.fillBatch(batch)
this.foreignReplace.removeDiffWidget()}this.removeDiffWidget()
batch.doBatch()}fillBatch(batch){const eltWedlet=findElementWedlet(this.holder)
if(eltWedlet){if(!batch)batch=eltWedlet.wedlet.wedMgr.docHolder.newBatch()
const xa=eltWedlet.wedlet.wedAnchor
if(XA.isAttribute(xa)){batch.setAttr(xa,null)}else{batch.deleteSequence(xa,1)}}return batch}}REG.reg.registerSkin("wed-diff-mark",1,`\n\t:host {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: flex-end;\n\t\twidth: 10px;\n\t\tbackground-repeat: repeat-y;\n\t\tcursor: default;\n\t}\n\n\t:host(.diffadd) {\n\t\tbackground-color: var(--edit-diffadd-bgcolor);\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/add.svg");\n\t}\n\n\t:host(.diffrem) {\n\t\tbackground-color: var(--edit-diffrem-bgcolor);\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/rem.svg");\n\t}\n\n\t:host(.diff) {\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t}\n\n\t#eraseDiff {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n`)
window.customElements.define("wed-diff-mark",WedDiffMark)
export class WedDiffWrapMark extends WedDiffMark{initDiffWrapAnnot(holder,skAnnot,wedlet,startMark){const wedMgr=wedlet.wedMgr
wedMgr.reg.installSkin(this.localName,this.attachShadow(DOMSH.SHADOWDOM_INIT))
this.skAnnot=skAnnot
this.title=skAnnot.getLabel()
this.classList.add(skAnnot.level.name)
if(startMark){this.shadowRoot.append("[")
holder.insertBefore(this,holder.firstChild)}else{this.holder=holder
holder.wedAnnotDiff=this
this.shadowRoot.append("]")
holder.appendChild(this)
if(skAnnot.wrap==="full")this.startMark=(new WedDiffWrapMark).initDiffWrapAnnot(holder,skAnnot,wedlet,true)}return this}addAnnotForMetas(metaAnnot){}removeAnnotForMetas(metaAnnot){}removeDiffWidget(){this.holder.wedAnnotDiff=null
if(this.startMark){this.startMark.remove()
this.startMark=null}this.remove()
this.holder=null}initDiffAnnot(holder,skAnnot,wedlet,foreignReplace,noAction){throw Error("do not use")}defaultInject(){throw Error("do not use")}eraseDiff(){}}REG.reg.registerSkin("wed-diff-wrap-mark",1,`\n\t:host {\n\t\tcursor: default;\n\t}\n\n\t:host(.diffadd) {\n\t\tbackground-color: var(--edit-diffadd-bgcolor);\n\t\tcolor: var(--edit-diffadd-color);\n\t}\n\n\t:host(.diffrem) {\n\t\tbackground-color: var(--edit-diffrem-bgcolor);\n\t\tcolor: var(--edit-diffrem-color);\n\t}\n\n\t:host(.diff) {\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\tcolor: var(--edit-diff-color);\n\t}\n`)
window.customElements.define("wed-diff-wrap-mark",WedDiffWrapMark)
export class WedDiffForeign extends HTMLElement{get wedlet(){var _a
return(_a=findElementWedlet(this))===null||_a===void 0?void 0:_a.wedlet}initDiffForeign(annot,house,parentWedlet,replaceOther){this.skAnnot=annot
this.replaceOther=replaceOther
const parentWedMgr=parentWedlet.wedMgr
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
parentWedMgr.reg.installSkin(this.localName,sr)
this.classList.add(annot.level.name)
const foreignModel=parentWedlet.model.buildModelForFragment(parentWedlet)
if(foreignModel){const docHolder=new DocHolder(house)
this.subEditor=(new WedEditorFrag).initialize({reg:parentWedMgr.reg,commonBar:parentWedMgr.wedEditor.commonBar})
this.subEditor.wedModel=parentWedMgr.wedModel
this.subEditor.initFromDocHolder(docHolder,{noAnnots:true,readOnlyCauses:["diffForeign"],rootModel:foreignModel,xaRoot:annot.attName?[0]:undefined})
this.shadowRoot.appendChild(this.subEditor)}else{this.shadowRoot.append("Différence non affichable")}this.margin=sr.appendChild(JSX.createElement("div",{class:"margin",title:replaceOther?annot.diffSession.mode===EXmlDiffMode.diff?"Contenu éliminé par un remplacement":"Contenu issu d\'un remplacement":annot.getLabel()}))
this.margin.classList.add(annot.level.name)
if(replaceOther)this.margin.classList.add("replace")
this.margin.addEventListener("pointerdown",this.onPointerdown)
this.margin.appendChild(JSX.createElement(ActionBtn,{"î":{reg:parentWedMgr.reg,action:ERASEDIFF,actionContext:this,uiContext:"bar"}}))
return this}get ctxMenuActions(){return{actions:[ERASEDIFF],actionContext:this}}removeDiffWidget(){this.remove()}get eraseDiffLabel(){if(this.replaceOther)return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Rétablir ce contenu remplacé":"Valider ce remplacement"
return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Annuler cette suppression":"Valider cet ajout"}eraseDiff(){const batch=this.fillBatch()
if(this.replaceOther){batch.needAdjustForNextAdds()
this.replaceOther.fillBatch(batch)}this.remove()
batch.doBatch()}fillBatch(batch){const parent=DOM.findParent(this,null,IS_EltWedlet)
if(!batch)batch=parent.wedlet.wedMgr.docHolder.newBatch()
if(this.skAnnot.attName){batch.setAttr(this.skAnnot.start,this.skAnnot.strValue)}else{batch.insertJml(this.skAnnot.start,JML.dom2jml(this.skAnnot.foreignNode))}return batch}focus(options){const root=this.subEditor.rootNode
const elt=DOMSH.findFlatNext(root,root,IS_focusable)
if(elt)elt.focus(options)}onPointerdown(ev){DOMSH.findHost(this).focus()
ev.preventDefault()}}REG.reg.registerSkin("wed-diff-foreign",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tclear: both;\n\t}\n\n\t:host(.diffrem) {\n\t\tbackground-color: var(--edit-diffrem-bgcolor);\n\t\t--edit-bgcolor: none;\n\t}\n\n\t:host(.diffadd) {\n\t\tbackground-color: var(--edit-diffadd-bgcolor);\n\t\t--edit-bgcolor: none;\n\t}\n\n\t:host(:focus) {\n\t\toutline: none;\n\t}\n\n\t.margin {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\twidth: 10px;\n\t\tbackground-repeat: repeat-y;\n\t}\n\n\t.diffrem {\n\t\tbackground-color: var(--edit-diffrem-bgcolor);\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/rem.svg");\n\t}\n\n\t.diffadd {\n\t\tbackground-color: var(--edit-diffadd-bgcolor);\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/add.svg");\n\t}\n\n\t.replace {\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t}\n\n\tbox-editor-frag {\n\t\tflex: 1;\n\t}\n\n\t#doDiff {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\tleft: -.5rem;\n\t}\n`)
window.customElements.define("wed-diff-foreign",WedDiffForeign)
export class WedDiffValue extends HTMLElement{get wedlet(){var _a
return(_a=findElementWedlet(this))===null||_a===void 0?void 0:_a.wedlet}get stopBoxSelection(){return true}initDiffValue(annot,holder,wedMgr,inputWidget){var _a
this.skAnnot=annot
this.holder=holder
holder.wedAnnotDiff=this
this.holder.setAttribute("annot-diff",annot.level.name)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(this.localName,sr)
this.classList.add(annot.level.name)
sr.appendChild(document.createElement("slot"))
this.margin=sr.appendChild(JSX.createElement("div",{class:"margin",title:annot.getLabel()}))
this.margin.appendChild(JSX.createElement(ActionBtn,{"î":{reg:wedMgr.reg,action:ERASEDIFF,actionContext:this,uiContext:"bar"}}))
this.appendChild(inputWidget||JSX.createElement("div",null,annot.otherValue))
const p=((_a=holder.shadowRoot)===null||_a===void 0?void 0:_a.getElementById("diffCtn"))||holder.shadowRoot||holder
p.insertBefore(this,p.firstChild)
return this}get ctxMenuActions(){return{actions:[ERASEDIFF],actionContext:this}}get eraseDiffLabel(){return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Rétablir cette valeur":"Valider cette valeur"}removeDiffWidget(){this.holder.wedAnnotDiff=null
this.holder.removeAttribute("annot-diff")
this.remove()
this.holder=null}eraseDiff(){const wedlet=this.holder.wedlet
wedlet.wedMgr.docHolder.newBatch().setText(wedlet.wedAnchor,this.skAnnot.otherValue).doBatch()
this.removeDiffWidget()}}REG.reg.registerSkin("wed-diff-value",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\t--edit-bgcolor: none;\n\t\talign-self: stretch;\n\t}\n\n\tslot {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t.margin {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\talign-items: center;\n\t\twidth: 10px;\n\t\tbackground-repeat: repeat-y;\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/edit.svg");\n\t}\n\n\t#doDiff {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t\tleft: -.5rem;\n\t}\n`)
window.customElements.define("wed-diff-value",WedDiffValue)
export class WedDiffTable extends HTMLElement{initTable(table){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
table.wedMgr.reg.installSkin(this.localName,sr)
this.shadowRoot.append(JSX.createElement("div",null))
this.table=table
table.insertAdjacentElement("beforebegin",this)
table.classList.toggle("diff",true)
this.annots=[]
return this}addAnnot(annot){this.annots.push(annot)
this.shadowRoot.lastElementChild.textContent=`Des modifications de la structure du tableau ne sont pas représentées`}removeAnnot(annot){this.table.diffTable=null
this.table.classList.toggle("diff",false)
this.remove()}}REG.reg.registerSkin("wed-diff-table",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\t--edit-bgcolor: none;\n\t\tuser-select: none;\n\t}\n\n\tdiv {\n\t\tcolor: var(--fade-color);\n\t\tfont-style: italic;\n\t\ttext-align: center;\n\t\tfont-size: var(--label-size);\n\t}\n`)
window.customElements.define("wed-diff-table",WedDiffTable)
export class WedDiffPara extends HTMLElement{get wedlet(){var _a
return(_a=findElementWedlet(this))===null||_a===void 0?void 0:_a.wedlet}get eraseDiffLabel(){return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Annuler toutes les modifications de ce paragraphe":"Valider toutes les modifications de ce paragraphe"}initDiffPara(para,annot){this.skAnnot=annot
const wedMgr=para.wedMgr
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(this.localName,sr)
sr.appendChild(JSX.createElement(ActionBtn,{"î":{reg:wedMgr.reg,action:ERASEDIFF,actionContext:this,uiContext:"bar"}}))
const foreignDoc=DOM.newDomDoc()
foreignDoc.namespaces=wedMgr.docHolder.house.namespaces
mixCtToForeign(annot.diffRoot,JML.jmlToDom([para.paraModel.newJml()],foreignDoc).firstElementChild)
const house=new XmlTypedHouse({initialDoc:foreignDoc,schema:annot.skNodePara.schemaDom.schema,schemaDomConfig:{rootRule:(new SkRuleDoc).init((new SkRuleElt).init(SkMatcherAnyElt.SINGLETON,"1",annot.skNodePara.rule.contentRule).initSkMeta(annot.skNodePara.rule.skMeta))},buildOptions:{autoMutate:true,autoComplete:true,autoNormXml:true,autoNormChars:true,genAnnots:false}})
const docHolder=new DocHolder(house)
const subEditor=this.subEditor=(new WedEditorFrag).initialize({reg:wedMgr.reg,commonBar:wedMgr.wedEditor.commonBar})
subEditor.wedModel=wedMgr.wedModel
const foreignModel=para.model.buildModelForFragment(para)
subEditor.initFromDocHolder(docHolder,{readOnlyCauses:["diffForeign"],rootModel:foreignModel})
subEditor.wedMgr.listeners.on("redrawAtEnd",para.diffForeignRedrawAtEnd)
subEditor.wedMgr.listeners.on("redrawAtEnd",subWedMgr=>{subWedMgr.docHolder.setDiffSession(annot.paraSession)})
para.insertAdjacentElement("afterbegin",subEditor)
para.insertAdjacentElement("beforeend",this)
para.setAttribute("diff-para","")
para.style.position="relative"
return this}eraseDiff(){const eltWedlet=findElementWedlet(this)
const replaceCt=this.subEditor.wedMgr.docHolder.getContent()
replaceCt[0]=eltWedlet.newJml()
eltWedlet.wedlet.wedMgr.docHolder.newBatch().spliceSequence(eltWedlet.wedlet.wedAnchor,1,replaceCt).doBatch()
this.removeDiffWidget()}removeDiffWidget(){var _a
if(this.parentElement){this.parentElement.removeAttribute("diff-para");(_a=DOM.findFirstChild(this.parentNode,n=>n instanceof WedEditorFrag))===null||_a===void 0?void 0:_a.remove()
this.remove()}}}REG.reg.registerSkin("wed-diff-para",1,`\n\t:host {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tright: 0;\n\t\theight: 100%;\n\t\twidth: 10px;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\tjustify-items: center;\n\t\talign-items: center;\n\t\talign-content: center;\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\tbackground-repeat: repeat-y;\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/edit.svg");\n\t}\n\n\tc-action {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n`)
window.customElements.define("wed-diff-para",WedDiffPara)
export function initDiffOnPara(para,annot){(new WedDiffPara).initDiffPara(para,annot)}export function removeDiffOnPara(para,annot){var _a;(_a=DOM.findFirstChild(para,n=>n instanceof WedDiffPara))===null||_a===void 0?void 0:_a.removeDiffWidget()}export class WedDiffTxtObj extends HTMLElement{constructor(){super(...arguments)
this.initForeign=false}get skAnnot(){return this.skAnnots[0]}get wedlet(){var _a
return(_a=findElementWedlet(this))===null||_a===void 0?void 0:_a.wedlet}get eraseDiffLabel(){return this.skAnnot.diffSession.mode===EXmlDiffMode.diff?"Annuler toutes les modifications de ce bloc":"Valider toutes les modifications de ce bloc"}initDiffTxtObj(txtObj,annot,customImpl){txtObj.style.position="relative"
this.txtObj=txtObj
this.custom=customImpl
this.skAnnots=[annot]
txtObj.wedAnnotDiff=this
const wedMgr=txtObj.wedMgr
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
wedMgr.reg.installSkin(this.localName,sr)
sr.appendChild(JSX.createElement(ActionBtn,{"î":{reg:wedMgr.reg,action:ERASEDIFF,actionContext:this,uiContext:"bar"}}))
txtObj.insertAdjacentElement("beforeend",this)
txtObj.setAttribute("diff-txtblock","")
this.foreignDoc=DOM.newDomDoc()
this.foreignDoc.namespaces=wedMgr.docHolder.house.namespaces
const xa=txtObj.wedlet.wedAnchor
this.txtObjDepth=xa.length
if(wedMgr.docHolder){this.foreignDoc.appendChild(this.foreignDoc.importNode(XA.findDomLast(xa,wedMgr.docHolder.getDocument()),true))}else{console.log("TODO fetch async content for WedDiffTxtObj from wedMgr.docHolderAsync")}this.redrawDiff()
return this}addAnnotForMetas(metaAnnot){this.skAnnots.push(metaAnnot)
this.redrawDiff()}removeAnnotForMetas(metaAnnot){const idx=this.skAnnots.indexOf(metaAnnot)
if(idx>=0){this.skAnnots.splice(idx,1)
if(this.skAnnots.length===0)this.removeDiffWidget()
else this.redrawDiff()}}eraseDiff(){const eltWedlet=findElementWedlet(this)
const replaceCt=JML.dom2jml(this.foreignDoc.documentElement)
eltWedlet.wedlet.wedMgr.docHolder.newBatch().spliceSequence(eltWedlet.wedlet.wedAnchor,1,replaceCt).doBatch()
this.removeDiffWidget()}removeDiffWidget(){if(this.parentElement){this.skAnnots.length=0
this.custom.redrawDiff(this)
this.parentElement.removeAttribute("diff-txtblock")
this.remove()
this.txtObj.wedAnnotDiff=null
this.txtObj=null}}redrawDiff(){if(!this.willRedraw)this.willRedraw=Promise.resolve().then(this._redrawDiff.bind(this))}_redrawDiff(){if(!this.txtObj)return
this.willRedraw=null
if(!this.initForeign){applyDiffs(this.foreignDoc.documentElement,this.skAnnots,this.txtObjDepth)
this.initForeign=true}this.custom.redrawDiff(this)}}REG.reg.registerSkin("wed-diff-txtobj",1,`\n\t:host {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tright: 0;\n\t\theight: 100%;\n\t\twidth: 10px;\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-content: center;\n\t\tjustify-items: center;\n\t\talign-items: center;\n\t\talign-content: center;\n\t\tbackground-color: var(--edit-diff-bgcolor);\n\t\tbackground-repeat: repeat-y;\n\t\tbackground-image: url("https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/edit.svg");\n\t}\n\n\tc-action {\n\t\twidth: var(--icon-size);\n\t\theight: var(--icon-size);\n\t\tmargin: 0;\n\t\tpadding: 0;\n\t}\n`)
window.customElements.define("wed-diff-txtobj",WedDiffTxtObj)
export class DiffInMeta{constructor(widget){this.widget=widget
this.skAnnots=new Set
this.subAnnotsCheck=(wedMgr,annots,deadline)=>{var _a
if(deadline.timeRemaining()<5)return this.subAnnotsCheck
for(let a of this.skAnnots){const n=a.anchorNode
if(!(n instanceof Attr?(_a=n.ownerElement)===null||_a===void 0?void 0:_a.isConnected:n===null||n===void 0?void 0:n.isConnected))this.removeAnnot(a)}}}addAnnot(annot){this.skAnnots.add(annot)
this.refresh()}removeAnnot(annot){this.skAnnots.delete(annot)
this.refresh()}refresh(){switch(this.skAnnots.size){case 1:this.widget.wedlet.wedMgr.listeners.on("asyncSkAnnots",this.subAnnotsCheck)
this.widget.classList.add("diffInMeta")
break
case 0:this.widget.wedlet.wedMgr.listeners.removeListener("asyncSkAnnots",this.subAnnotsCheck)
this.widget.classList.remove("diffInMeta")
break}}}const ERASEDIFF=new Action("eraseDiff").setVisible(ctx=>isEditableWedlet(ctx.wedlet)&&ctx.wedlet.editMode===EWedletEditMode.write).setLabel(ctx=>ctx.eraseDiffLabel).setIcon(ctx=>ctx.skAnnot.diffSession.mode===EXmlDiffMode.diff?"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/revert.svg":"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/diff/valid.svg").setExecute((ctx,ev)=>{ctx.eraseDiff()
if(ev){ev.stopPropagation()
ev.preventDefault()}})
export function isDiffAnnot(annot){var _a
return((_a=annot)===null||_a===void 0?void 0:_a.diffSession)!=null}
//# sourceMappingURL=diffTags.js.map