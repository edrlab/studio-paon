import{POPUP}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AgEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{WedModel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedCore.js"
import{WedEditAction}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedEditor.js"
import{BoxCommentModel,BoxCommentWedlet}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/box.js"
import{EWedletEditMode,EWedletEditModeLabel,WEDLET,WedletActionCtx}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{isWedletSingleElt}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{InitSlaveRep,ResetStatesMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/urban.js"
import{isXmlMsg,XmlBatch,XmlDeleteMsg,XmlInsertMsg,XmlStrMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{SkSearchCommentAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{insertAnnot,removeAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxTags.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{HistoEditPoint}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/histoEditPoints.js"
export class BoxScComment extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
WEDLET.installSkins(tpl,this.attachShadow(DOMSH.SHADOWDOM_INIT),wedlet,this.localName)
this.setAttribute("sc-comments","no")
this.shadowRoot.addEventListener("copy",ev=>{const sel=DOMSH.findDocumentOrShadowRoot(ev.target).getSelection()
if(sel.type==="Range"){const rg=sel.getRangeAt(0)
ev.clipboardData.setData("text/plain",rg.cloneContents().textContent)}ev.stopImmediatePropagation()
ev.preventDefault()})
if(wedlet.cmtHouse==null){this.drawThread()}else{wedlet.cmtHouse.then(cmtH=>{this.cmtHouse=cmtH
this.cmtHouseDoor=cmtH.openPublicDoor()
this._threadSrcElt=this.cmtHouse.document.documentElement
this.drawThread()
this.cmtHouseDoor.addMsgListener(msg=>{if(msg.getMeta("$cmAct")){this._applyXmlMsg(msg)}else if(isXmlMsg(msg)||msg.type===ResetStatesMsg.type||msg.type===InitSlaveRep.type){this.drawThread()}})})}}drawAnnot(annot){if(annot instanceof SkSearchCommentAnnot){if(!this.searchAnnots)this.searchAnnots=new Map
const eltComment=annot.subAnnot.anchorNode.parentElement
if(!eltComment)return false
let annots=this.searchAnnots.get(eltComment)
if(annots)annots.push(annot)
else{annots=[annot]
this.searchAnnots.set(eltComment,annots)}this._redrawCmAnnots(eltComment,annots)
return true}else if(this===this.wedlet.element){insertAnnot(this,annot)
return true}return false}eraseAnnot(annot){if(annot instanceof SkSearchCommentAnnot&&this.searchAnnots){const eltComment=annot.subAnnot.anchorNode.parentElement
if(!eltComment)return false
const annots=this.searchAnnots.get(eltComment)
if(annots){if(annots.length===1&&annots[0]===annot){this.searchAnnots.set(eltComment,null)
this._redrawCmAnnots(eltComment,null)
return true}else{const idx=annots.indexOf(annot)
if(idx>=0){annots.splice(idx,1)
this._redrawCmAnnots(eltComment,annots)
return true}}}}else if(this===this.wedlet.element){return removeAnnot(this,annot)}return false}get threadClosed(){return this._threadSrcElt&&this._threadSrcElt.getAttribute("threadClosed")==="true"}toggleCloseState(){const xa=XA.append(XA.fromNode(this._threadSrcElt),"threadClosed")
if(this.threadClosed){this.cmtHouseDoor.receiveMsg((new XmlStrMsg).init(xa,null).setMeta("$cmAct","state"))}else{this.cmtHouseDoor.receiveMsg((new XmlStrMsg).init(xa,"true").setMeta("$cmAct","state"))}}addCmt(text){startEdition(this,this._cmtsCtn.appendChild(JSX.createElement("div",{class:"cmt"})),text)}getCmt(offs){return this._cmtsCtn.children[offs]}editCmt(cmt,overwriteText){startEdition(this,cmt,overwriteText)}execAddCm(txt,by){var _a,_b
if(!this._threadSrcElt){const xa=this.wedlet.wedAnchor
const root=document.createElementNS("scenari.eu:comment:1.0","comment")
root.setAttribute("type","thread")
const cmt=root.appendChild(document.createElementNS("scenari.eu:comment:1.0","comment"))
if(by)cmt.setAttribute("author",by)
cmt.setAttribute("creationTime",Date.now().toString(10))
cmt.appendChild(document.createTextNode(txt||""))
const wedMgr=this.wedlet.wedMgr
wedMgr.docHolder.newBatch().insertJml(xa,[{"":"!","=":DOM.escapeComment(DOM.ser(root))}]).doBatch()
this.wedlet.deleteVirtualWedlet();(_a=wedMgr.config.histoEditPointsMgr)===null||_a===void 0?void 0:_a.addEditEntry(new HistoEditPoint(xa,wedMgr.docHolder.house),null,wedMgr.config.histoEditHolder)}else{const cmNode={"":"comment"}
if(by)cmNode.author=by
cmNode.creationTime=Date.now().toString(10)
const jml=[cmNode,[txt||""]]
const xa=XA.append(XA.fromNode(this._threadSrcElt),DOM.computeOffset(this._threadSrcElt.lastElementChild,-1)+1)
this.cmtHouseDoor.receiveMsg((new XmlInsertMsg).init(xa,jml).setMeta("$cmAct","cm"))
const wedMgr=this.wedlet.wedMgr;(_b=wedMgr.config.histoEditPointsMgr)===null||_b===void 0?void 0:_b.addEditEntry(new HistoEditPoint(this.wedlet.wedAnchor,wedMgr.docHolder.house),null,wedMgr.config.histoEditHolder)}}execDelCm(cmtSrc){var _a
if(!cmtSrc.nextElementSibling&&!cmtSrc.previousElementSibling){this.wedlet.wedMgr.docHolder.newBatch().deleteSequence(this.wedlet.wedAnchor,1).doBatch()}else{this.cmtHouseDoor.receiveMsg((new XmlDeleteMsg).init(XA.fromNode(cmtSrc),1).setMeta("$cmAct","cm"))}const wedMgr=this.wedlet.wedMgr;(_a=wedMgr.config.histoEditPointsMgr)===null||_a===void 0?void 0:_a.addEditEntry(new HistoEditPoint(this.wedlet.wedAnchor,wedMgr.docHolder.house),null,wedMgr.config.histoEditHolder)}execUpdtCm(cmtSrc,txt,updtBy){const by=cmtSrc.getAttribute("author")
const create=cmtSrc.getAttribute("creationTime")
const xa=XA.fromNode(cmtSrc)
const cmNode={"":"comment"}
if(by)cmNode.author=by
if(create)cmNode.creationTime=create
if(updtBy)cmNode.updatedBy=updtBy
cmNode.updateTime=Date.now().toString(10)
const jml=[cmNode,[txt||""]]
const m=(new XmlBatch).add((new XmlDeleteMsg).init(xa,1)).add((new XmlInsertMsg).init(xa,jml)).setMeta("$cmAct","cm")
this.cmtHouseDoor.receiveMsg(m)}drawThread(){const threadHtml=this.shadowRoot
let last
while((last=threadHtml.lastElementChild)&&last.localName!=="style")last.remove()
const threadBar=threadHtml.appendChild(JSX.createElement("div",{id:"cmtsBar"}))
this._cmtsCtn=threadHtml.appendChild(JSX.createElement("div",{id:"cmts"}))
if(this.wedlet.isVirtual()){const cm=this._cmtsCtn.appendChild(JSX.createElement("div",{class:"cmt"}))
startEdition(this,cm,this.wedlet.initText)
return}this._closedCheckbox=threadBar.appendChild(JSX.createElement("input",{id:"close",type:"checkbox",onchange:onToggleState}))
this.drawState()
threadBar.appendChild(JSX.createElement("span",{style:"flex:1"}))
threadBar.appendChild(JSX.createElement("button",{id:"addCm",title:"Répondre",onclick:addComment},JSX.asSvg(()=>JSX.createElement("svg",{viewBox:"0 0 448 512"},JSX.createElement("path",{d:"m 393.22034,234.84746 v 42.30508 c 0,8.72543 -7.13898,15.86441 -15.86441,15.86441 H 261.01695 v 116.33898 c 0,8.72543 -7.13898,15.86441 -15.86441,15.86441 h -42.30508 c -8.72543,0 -15.86441,-7.13898 -15.86441,-15.86441 V 293.01695 H 70.644068 c -8.725424,0 -15.864407,-7.13898 -15.864407,-15.86441 v -42.30508 c 0,-8.72543 7.138983,-15.86441 15.864407,-15.86441 H 186.98305 V 102.64407 c 0,-8.725426 7.13898,-15.864409 15.86441,-15.864409 h 42.30508 c 8.72543,0 15.86441,7.138983 15.86441,15.864409 v 116.33898 h 116.33898 c 8.72543,0 15.86441,7.13898 15.86441,15.86441 z"})))))
for(let cm=this._threadSrcElt.firstElementChild;cm;cm=cm.nextElementSibling){this._drawCm(cm)}this.setEditMode(this.wedlet.editMode)}setEditMode(mode){const sr=this.shadowRoot
const readOnly=mode!==EWedletEditMode.write
DOM.findNext(sr,sr,n=>{if(n instanceof HTMLInputElement||n instanceof HTMLButtonElement)n.disabled=readOnly
return false})
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}drawState(){const stClosed=this.threadClosed
this._closedCheckbox.title=stClosed?"Réactiver ce commentaire":"Clore ce commentaire"
this.classList.toggle("closed",stClosed)
if(this._closedCheckbox.checked!==stClosed)this._closedCheckbox.checked=stClosed}_drawCm(cm,insertBefore){var _a
if(cm.localName!=="comment")return
let user=cm.getAttribute("author")
let date=dateFormatter.format(new Date(Number.parseInt(cm.getAttribute("creationTime"))))
let meta
if(user){meta=JSX.createElement("span",{class:"meta"},`Créé le ${date} par `,JSX.createElement("c-userref",{account:user}))}else{meta=JSX.createElement("span",{class:"meta"},`Créé le ${date}`)}const updt=cm.getAttribute("updateTime")
if(updt){date=dateFormatter.format(new Date(Number.parseInt(updt)))
user=cm.getAttribute("updatedBy")
if(user){meta.append(` (modifié le ${date} par `,JSX.createElement("c-userref",{account:user}),`)`)}else{meta.append(` (modifié le ${date})`)}}const cmHtml=this._cmtsCtn.insertBefore(JSX.createElement("div",{class:"cmt",ondblclick:editComment},JSX.createElement("div",{class:"cmtHead"},meta,JSX.createElement("button",{class:"editCm",onclick:editComment,title:"Éditer ce commentaire"},JSX.asSvg(()=>JSX.createElement("svg",{viewBox:"0 0 512 512"},JSX.createElement("path",{d:"M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"})))),JSX.createElement("button",{class:"delCm",onclick:delComment,title:"Supprimer ce commentaire"},JSX.asSvg(()=>JSX.createElement("svg",{viewBox:"0 0 448 512"},JSX.createElement("path",{d:"M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"}))))),JSX.createElement("div",{class:"content"},this._getContent(cm.textContent,(_a=this.searchAnnots)===null||_a===void 0?void 0:_a.get(cm)))),insertBefore)
cmHtml.xmlSrc=cm}_redrawCmAnnots(cm,annots){if(this._cmtsCtn)for(const cmHtml of this._cmtsCtn.children){if(cmHtml.xmlSrc===cm){const htmlElt=cmHtml.querySelector(".content")
if(htmlElt){htmlElt.textContent=null
htmlElt.append(...this._getContent(cm.textContent,annots))}break}}}_getContent(content,annots){if(!annots)return content
const res=[]
let idx=0
for(const an of annots){const start=an.subAnnot.offsetStart
const end=start+an.subAnnot.len
if(idx<start)res.push(content.substring(idx,start))
res.push(JSX.createElement("mark",null,content.substring(start,end)))
idx=end}if(idx<content.length)res.push(content.substring(idx))
return res}_applyXmlMsg(msg){const act=msg.getMeta("$cmAct")
if(act==="state"){this.drawState()}else if(act==="cm"){const delCm=m=>{for(let cm=this._cmtsCtn.firstElementChild;cm;){const next=cm.nextElementSibling
if(!cm.xmlSrc.isConnected)cm.remove()
cm=next}}
const addCm=m=>{const cm=XA.findDomLast(m.xa,this.cmtHouse.root)
if(cm){let nextHtml
const nextCmtSrc=cm.nextElementSibling
if(nextCmtSrc)this._cmtsCtn.childNodes.forEach(e=>{if(e.xmlSrc===nextCmtSrc)nextHtml=e})
this._drawCm(cm,nextHtml)}}
if(msg instanceof XmlDeleteMsg){delCm(msg)}else if(msg instanceof XmlInsertMsg){addCm(msg)}else if(msg instanceof XmlBatch){delCm(msg.msgs.find(m=>m instanceof XmlDeleteMsg))
addCm(msg.msgs.find(m=>m instanceof XmlInsertMsg))}}else throw Error("Unknown ScComment act msg: "+act)}refreshBindValue(val,children){}replaceChars(chars,msg){}get isEditing(){return this.classList.contains("editing")}setEditing(editing){const wedMgr=this.wedlet.wedMgr
if(editing){this.classList.add("editing")
if(!this._lstn_beforeHide)this._lstn_beforeHide=(wedMgr,close)=>{if(close){POPUP.showNotifWarning("Veuillez valider ou abandonner votre commentaire.",this)
this.focus()
const input=this.shadowRoot.querySelector("textarea")
if(input)input.focus()
return false}}
if(!this._lstn_builsLastDatas)this._lstn_builsLastDatas=(wedMgr,lastDatas)=>{const textarea=this.shadowRoot.querySelector("textarea")
if(!textarea||!textarea.value)return
const xmlSrc=textarea.closest(".cmt").xmlSrc
if(xmlSrc&&xmlSrc.textContent===textarea.value)return
if(!lastDatas.scCmtsPd)lastDatas.scCmtsPd=[]
lastDatas.scCmtsPd.push({xa:this.wedlet.wedAnchor,txt:textarea.value,offs:xmlSrc?DOM.computeOffset(xmlSrc):this.wedlet.isVirtual()?undefined:-1,dt:xmlSrc?xmlSrc.getAttribute("updateTime")||xmlSrc.getAttribute("creationTime"):undefined})}
wedMgr.listeners.on("beforeHide",this._lstn_beforeHide)
wedMgr.listeners.on("beforeHideAsync",beforeHideAsync)
wedMgr.listeners.on("buildLastDatas",this._lstn_builsLastDatas)}else{this.classList.remove("editing")
wedMgr.listeners.removeListener("beforeHide",this._lstn_beforeHide)
wedMgr.listeners.removeListener("beforeHideAsync",beforeHideAsync)
wedMgr.listeners.removeListener("buildLastDatas",this._lstn_builsLastDatas)}}}AgEltBoxSelection(BoxScComment,{selMode:"box",actionsLists:["actions:wed:box-sccomment","actions:wed:box"]})
function beforeHideAsync(wedMgr,close){return Promise.resolve(close?false:undefined)}const dateFormatter=new Intl.DateTimeFormat("fr",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"})
function onToggleState(ev){DOMSH.findHost(this).toggleCloseState()}function addComment(ev){DOMSH.findHost(this).addCmt()}function delComment(ev){DOMSH.findHost(this).execDelCm(this.closest(".cmt").xmlSrc)}function editComment(ev){const cmt=this.closest(".cmt")
startEdition(DOMSH.findHost(this),cmt)}function startEdition(boxCmts,cmt,overwrite){if(!boxCmts||boxCmts.isEditing||boxCmts.threadClosed||!WEDLET.isWritableWedlet(boxCmts.wedlet))return
const startHeight=cmt.xmlSrc?Math.max(cmt.querySelector(":scope>.content").offsetHeight,50):50
function valid(ev){const val=cmt.txtArea.value
if(val===(cmt.xmlSrc?cmt.xmlSrc.textContent:"")){cancel(ev)
return}boxCmts.setEditing(false)
const secCtx=boxCmts.wedlet.wedMgr.reg.env.securityCtx
const user=secCtx?secCtx.account:null
if(cmt.xmlSrc){boxCmts.execUpdtCm(cmt.xmlSrc,val,user)}else{cmt.remove()
boxCmts.execAddCm(val,user)}boxCmts.focus()}function cancel(ev){boxCmts.setEditing(false)
if(cmt.xmlSrc){boxCmts._drawCm(cmt.xmlSrc,cmt)
boxCmts.setEditMode(boxCmts.wedlet.editMode)
cmt.remove()}else if(boxCmts.wedlet.isVirtual()){const parent=boxCmts.wedlet.wedParent
boxCmts.wedlet.deleteVirtualWedlet()
if(isWedletSingleElt(parent)&&parent.element.onChildWedletsChange)parent.element.onChildWedletsChange()}else{cmt.remove()}boxCmts.focus()}boxCmts.setEditing(true)
cmt.classList.add("editing")
cmt.textContent=null
cmt.txtArea=JSX.createElement("textarea",{style:startHeight?`height:${startHeight}px`:"height:3em"},cmt.xmlSrc?cmt.xmlSrc.textContent:"")
cmt.appendChild(JSX.createElement("div",{class:"cmEdit"},cmt.txtArea,JSX.createElement("div",{class:"editBar"},JSX.createElement("c-button",{class:"edit valid",onclick:valid,label:"Valider","ui-context":"dialog"}),JSX.createElement("c-button",{class:"edit cancel",onclick:cancel,label:"Annuler","ui-context":"dialog"}))))
const txtarea=cmt.querySelector("textarea")
cmt.onkeydown=async ev=>{ev.stopImmediatePropagation()
if(ACTION.isAccelPressed(ev)&&ev.key==="s"){ev.preventDefault()
valid(ev)}else if(!ACTION.isAnyControlPressed(ev)&&ev.key==="Escape"){if(cmt.txtArea.value===(cmt.xmlSrc?cmt.xmlSrc.textContent:"")||await POPUP.confirm("Confirmez-vous l\'abandon de vos modifications de ce commentaire ?",cmt)){cancel(ev)}}}
txtarea.onkeypress=txtarea.oncontextmenu=txtarea.oncopy=txtarea.oncut=txtarea.onpaste=ev=>ev.stopImmediatePropagation()
Promise.resolve().then(()=>{boxCmts.focus()
txtarea.focus()
if(overwrite)txtarea.value=overwrite})}REG.reg.registerSkin("box-sccomment",1,`\n\t:host {\n\t\tcolor: var(--edit-cmt-color);\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tmargin: .5em;\n\t\tbox-shadow: .1em .1em .5em .1em var(--edit-cmt-shadow-color);\n\t\tclear: both;\n\t\tfont-size: 1rem;\n\t}\n\n\t::selection {\n\t\tcolor: currentColor;\n\t\tbackground: var(--edit-seltext-bgcolor);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-box-focus);\n\t}\n\n\t:host(.closed) {\n\t\ttext-decoration: line-through;\n\t}\n\n\t:host(.closed) button,\n\t:host(.editing) button:not(.edit),\n\t:host(.editing) input {\n\t\tdisplay: none;\n\t}\n\n\t:host([edit-mode=rs]) {\n\t\tdisplay: none;\n\t}\n\n  :focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#cmtsBar {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\talign-items: center;\n\t\tfont-size: var(--label-size);\n\t\tbackground: linear-gradient(var(--edit-cmt-bgcolor), var(--edit-cmt-bgcolor)), var(--edit-cmt-bgcolor);/*double l'opacité == .cmtHead*/\n\t\tborder-inline-end: 1px solid var(--edit-cmt-border-color);\n\t\talign-content: center;\n\t\twidth: 2em;\n\t}\n\n\t#cmts {\n\t\tflex: 1;\n\t\tbackground-color: var(--edit-cmt-bgcolor);\n\t}\n\n\t.cmt:not(:first-child) {\n\t\tborder-top: 1px solid var(--edit-cmt-border-color);\n\t}\n\n\t.cmtHead {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\tbackground-color: var(--edit-cmt-bgcolor);\n\t\tfont-size: var(--label-size);\n\t\tfont-style: italic;\n\t\tfill: var(--edit-cmt-color);\n\t  padding: .2em;\n\t}\n\n\t.content {\n\t\twhite-space: pre-wrap;\n\t\tpadding: .2em;\n\t  min-height: 1em;\n\t\tmin-height: 1 lh;\n\t\tuser-select: text;\n\t}\n\n\t.meta {\n\t\tflex: 1;\n\t}\n\n\tc-userref {\n\t\tdisplay: inline-flex;\n\t}\n\n\t.editBar {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tjustify-content: flex-end;\n\t}\n\n\tbutton {\n\t\t-webkit-appearance: none;\n\t\tborder: 1px solid var(--edit-cmt-border-color);\n\t\tborder-radius: .2em;\n\t\tpadding: .2em;\n\t\tbackground-color: var(--edit-cmt-bgcolor);\n\t\twidth: 1.5em;\n\t\theight: 1.5em;\n\t\tfont-size: var(--label-size);\n\t\tmargin: 2px;\n\t\tcursor: pointer;\n\t\tfill: var(--edit-cmt-color);\n\t\topacity: .8;\n\t}\n\n\tbutton:disabled {\n\t\topacity: .4;\n\t\tcursor: auto;\n\t}\n\n\tbutton:hover:not(:disabled) {\n\t\tfilter: brightness(1.2);\n\t}\n\n\t.cm.editing {\n\t\tposition: relative;\n\t}\n\n\ttextarea {\n\t\twidth: 100%;\n\t\tresize: vertical;\n\t\tbox-sizing: border-box;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--edit-cmt-border-color);\n\t\tpadding: 1px;\n\t\tfont-size: 1em;\n\t\tbackground: var(--edit-bgcolor);\n\t\tcolor: var(--edit-color);\n\t}\n\n\t.cmEdit {\n\t\t/*position: absolute;*/\n\t\t/*top: 0;*/\n\t\tbox-shadow: .1em .1em .5em .1em var(--edit-cmt-shadow-color);\n\t\tbackground-color: var(--edit-cmt-bgcolor);\n\t}\n\n\tc-button {\n\t\tmargin: .2em .5em;\n\t}\n\t\n\t#close {\n\t\t\tcursor: pointer;\n  }\n\n  ::selection {\n\t\tcolor: currentColor;\n\t  background-color: var(--edit-seltext-bgcolor);\n  }\n`)
window.customElements.define("box-sccomment",BoxScComment)
export function initLastDatasScComments(wedMgr,comments){for(const cmtPending of comments){if(cmtPending.offs!==undefined){const cmtWedlet=WEDLET.findWedlet(wedMgr.rootWedlet,cmtPending.xa,{forceFetch:true})
if(!cmtWedlet||!(cmtWedlet instanceof BoxCommentWedlet)||!(cmtWedlet.element instanceof BoxScComment))showLostComment(cmtPending)
else{const boxCmt=cmtWedlet.element
if(cmtPending.offs===-1){boxCmt.addCmt(cmtPending.txt)}else{const cmt=boxCmt.getCmt(cmtPending.offs)
if(!cmt){boxCmt.addCmt(cmtPending.txt)}else{boxCmt.editCmt(cmt,cmtPending.txt)}}}}else{const insAct=new InsertScComment
const parent=WEDLET.findWedlet(wedMgr.rootWedlet,XA.up(cmtPending.xa),{forceFetch:true,lastAncestorIfNone:true})
if(!parent||!isWedletSingleElt(parent))showLostComment(cmtPending)
else{const ctx=new WedletActionCtx(parent.element)
if(insAct.isAvailable(ctx))insAct.execute(ctx,null,cmtPending.txt)}}}}function showLostComment(cmt){console.log("Last comment lost:",cmt)}export class InsertScComment extends WedEditAction{constructor(){super(...arguments)
this._label="Ajouter un commentaire"
this._icon="https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/edit/wed/comment.svg"
this._group="insObj"}isVisible(ctx){const wedlet=ctx.wedlet
if(wedlet.isVirtual()||!(typeof wedlet.xaPart==="number"))return false
if(!wedlet.element||wedlet.element.getAttribute("sc-comments")==="no")return false
return super.isVisible(ctx)}async execute(ctx,ev,text){const wedlet=ctx.wedlet
const childrenElt=WEDLET.findChildrenEltForComment(wedlet.model.childrenEltsNaturalOrder)
const slot=childrenElt?childrenElt.wedSlotName:null
const model=ctx.wedMgr.wedModel.findModelForVirtual(ENodeType.comment,null,null,null,wedlet,scCommentSelector)
const cmtWedlet=model.createWedlet(wedlet)
if(text)cmtWedlet.initText=text
const parent=wedlet.elementHost
cmtWedlet.insertElement(parent,parent.firstElementChild,slot)
await cmtWedlet.bindAsVirtual()
if(text)cmtWedlet.initText=null
if(wedlet.element.onChildWedletsChange)wedlet.element.onChildWedletsChange()}}const scCommentSelector=function(wedModel,node,ctx,params){return wedModel instanceof BoxCommentModel?WedModel.SELECTOR_PERFECT_MATCH:WedModel.SELECTOR_REJECT}

//# sourceMappingURL=boxScComment.js.map