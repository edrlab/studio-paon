import{EWedletEditMode,EWedletEditModeLabel,IS_EltWedlet,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{EFuzzyType,SkAnnotAttrUnknown,SkAnnotEltUnknown}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{DOM,ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{WED}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{MSGMETA_noCleanup}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/houseOt.js"
class BoxNameInput extends HTMLElement{constructor(){super()
this.ondblclick=this.onDblClick
this.addEventListener("keydown",this.onKeyDown)
this.addEventListener("blur",this.onBlur)
this.addEventListener("copy",this.onCopyCutPaste)
this.addEventListener("paste",this.onCopyCutPaste)
this.addEventListener("cut",this.onCopyCutPaste)
this.style.whiteSpace="pre"
this.spellcheck=false
this.contentEditable="true"
this.appendChild(document.createTextNode(""))}onDblClick(ev){ev.preventDefault()
ev.stopPropagation()}onCopyCutPaste(ev){ev.stopPropagation()}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.contentEditable=WEDLET.isWritableWedlet(wedlet)?"true":"false"}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
this.textContent=this.wedlet.wedNodeName||this.wedlet.model.nodeName}setEditMode(mode){this.contentEditable=mode===EWedletEditMode.write?"true":"false"
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}onBlur(ev){const newName=this.textContent
const oldName=this.wedlet.wedNodeName||this.wedlet.model.nodeName
if(oldName!==newName){if(newName){const isAttr=typeof this.wedlet.xaPart==="string"
const rule=this.wedlet.wedMgr.docHolder.getStruct(this.wedlet.wedAnchor,WEDLET.buildVirtualPath(this.wedlet))
if(/^[A-Za-z_:][\w\-.:]*$/.test(newName)&&(rule===null||rule===void 0?void 0:rule.structMatch(isAttr?ENodeType.attribute:ENodeType.element,newName))){if(this.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(this.wedlet,null,null,newName)}else{if(isAttr){const xa=this.wedlet.wedAnchor
this.wedlet.wedMgr.docHolder.newBatch().renameOrMoveAttr(xa,XA.append(XA.subXa(xa,-1),newName)).setMeta(MSGMETA_noCleanup,true).doBatch()}else{this.wedlet.wedMgr.docHolder.newBatch().renameElt(this.wedlet.wedAnchor,newName).setMeta(MSGMETA_noCleanup,true).doBatch()}}}else{POPUP.showNotifInfo("Ce nom n\'est pas autorisé",this)}}this.textContent=oldName}}onKeyDown(ev){switch(ev.key){case"Delete":case"Backspace":ev.stopPropagation()
break
case"Enter":case" ":ev.preventDefault()
ev.stopImmediatePropagation()
break}}drawAnnot(annot){if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotAttrUnknown.TYPE)this.classList.add("forbidden")
return false}eraseAnnot(annot){if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotAttrUnknown.TYPE)this.classList.remove("forbidden")
return false}}window.customElements.define("box-nameinput",BoxNameInput)
class BoxInsert extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.matcher=WED.buildMatcherVariants(tpl.getAttribute("select"))
let parentBtn=this
if(tpl.hasAttribute("skin")){WEDLET.installSkins(tpl,this.attachShadow(DOMSH.SHADOWDOM_INIT),wedlet,this.localName)
parentBtn=this.shadowRoot}const btn=parentBtn.appendChild(document.createElement("button"))
btn.addEventListener("click",this._onClickInsert)}refreshBindValue(val){}setEditMode(mode){DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}_onClickInsert(ev){const comp=DOMSH.getFlatParentElt(this)
if(comp.wedlet.isVirtual())return
const wedMgr=comp.wedlet.wedMgr
if(!wedMgr.docHolder)return
const tw=document.createTreeWalker(DOMSH.findDocumentOrShadowRoot(comp),NodeFilter.SHOW_ELEMENT)
tw.currentNode=comp
let prev
let offset=0
findOffset:while(prev=tw.previousNode()){if(prev instanceof HTMLSlotElement){const children=prev.assignedNodes()
for(let i=children.length-1;i>=0;i--){const ch=children[i]
if(IS_EltWedlet(ch)&&typeof ch.wedlet.xaPart==="number"){offset=ch.wedlet.xaPart+1
break findOffset}}}}const wedletAnchor=XA.freeze(comp.wedlet.wedAnchor)
const[structsNodes,structsAtts]=wedMgr.docHolder.getInsertableStructs(wedletAnchor,offset,null,true)
const virtuals=WEDLET.findVirtualWedletsAfter(comp,WEDLET.findVirtualWedletsBefore(comp))
const structNodesCount=WEDLET.cleanupStructList(structsNodes,virtuals,WEDLET.isTextBindBefore(comp)||WEDLET.isTextBindAfter(comp))
const structAttsCount=WEDLET.cleanupStructList(structsAtts,virtuals)
const actions=[]
const xa=XA.append(wedletAnchor,offset)
if(structNodesCount>0)for(let i=0;i<structsNodes.length;i++){const struct=structsNodes[i]
if(struct&&comp.matcher.matchStruct(struct))actions.push(new InsertTag(struct,xa))}if(structAttsCount>0)for(let i=0;i<structsAtts.length;i++){const struct=structsAtts[i]
if(struct&&comp.matcher.matchStruct(struct))actions.push(new InsertTag(struct,xa))}if(actions.length>0){POPUP.showPopupActionsFromEvent({actions:actions,actionContext:comp.wedlet,restoreFocus:this},ev)}else{POPUP.showNotif(JSX.createElement("i",{style:"margin:.2em"},"Aucune insertion possible"),this,{autoHide:500,noCloseBtn:true},{initX:ev.pageX,initY:ev.pageY})}ev.stopImmediatePropagation()
ev.preventDefault()}}REG.reg.registerSkin("box-insert",1,`\n\t:host([edit-mode]) {\n\t\tdisplay: none;\n\t}\n\n\tbutton {\n\t\tuser-select: none;\n\t\tpadding: 0 2px;\n\t\tborder-radius: .2em;\n\t\tbackground: var(--insbtn-bg);\n\t\tcolor: var(--insbtn-color);\n\t\tborder: none;\n\t\tfont-size: var(--label-size);\n\t\tcursor: pointer;\n\t}\n\n\tbutton:before {\n\t\tcontent: "+";\n\t}\n\n\tbutton:hover {\n\t\tbackground: var(--insbtn-hover-bg);\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-box-focus);\n\t}\n`)
window.customElements.define("box-insert",BoxInsert)
class InsertTag extends Action{constructor(struct,xaInsert){super()
this.struct=struct
this.xaInsert=xaInsert}getLabel(){return this.struct.structLabel||this.struct.structName}execute(ctx,ev){if(isWedletSingleElt(ctx)&&!ctx.element.isConnected)return
const wedMgr=ctx.wedMgr
const batch=wedMgr.docHolder.newBatch()
let jml=[]
let atts=Object.create(null)
const partialName=this.struct.createContent(jml,atts)
if(typeof partialName==="string"){if(this.struct.structType===EFuzzyType.elements){jml.push({"":partialName||"x"})}else if(this.struct.structType===EFuzzyType.attributes){let nm=partialName||"x"
const elt=XA.findDomContainer(this.xaInsert,wedMgr.docHolder.getDocument())
while(elt.hasAttribute(nm))nm+="x"
atts[nm]=""}else throw Error()}if(ctx.isVirtual())WEDLET.insertDatasFromDisplay(ctx,batch)
const attNames=atts?Object.keys(atts):null
if(attNames&&attNames.length>0){if(attNames.length>1||jml.length>0){const xaParent=XA.freeze(XA.up(this.xaInsert))
for(let i=0;i<attNames.length;i++){batch.setAttr(XA.append(xaParent,attNames[i]),atts[attNames[i]]||"")}if(jml.length>0)batch.insertJml(this.xaInsert,jml)}else{batch.setAttr(XA.setAtDepth(this.xaInsert,-1,attNames[0]),atts[attNames[0]]||"")}}else{batch.insertJml(this.xaInsert,jml)}batch.doBatch()}}
//# sourceMappingURL=boxGeneric.js.map