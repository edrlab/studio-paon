import{Button,RadioBtnsActionable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{IS_Popupable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popupable.js"
import{POPUP,PopupActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{AgEltBoxSelection,isEltBoxSelection}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/boxSel.js"
import{AgEltBoxInsertDrawerBox}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/features/insMgr.js"
import{EWedletEditMode,EWedletEditModeLabel,findElementWedlet,IS_EltWedlet,WedAnnotErr,WedAnnotSearch,WEDLET}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedlet.js"
import{WEDLET_SINGLEELT}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/wedletSingleElt.js"
import{ACTION,Action,ActionMenu,ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{LANG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/lang.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,ENodeType,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{JML}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/jml.js"
import{XA}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/xAddr.js"
import{isXmlMsg}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/ot/xmlHouse.js"
import{EAnnotLevel,isSkAnnotDrawer,isSkAnnotMissing,SkAnnotAttrUnknown,SkAnnotEltUnknown,SkAnnotTextForbidden}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaAnnots.js"
import{isSkSearchAnnot}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/edit/schema/schemaSearch.js"
import{BaseElement,BASIS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{PublicEndPoint}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/io/io.js"
import"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/edit/wed/wedlets/box/boxGeneric.js"
import{InputUserPanel}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/core/widgets/inputs.js"
import{EUserType}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/core/user.js"
export class BoxContainer extends HTMLElement{static buildWedSelector(elt){return null}get childrenElts(){return this.wedlet.model.childrenElts}setDelegatedHost(delegatedHost){this.delegatedHost=delegatedHost}connectedCallback(){if(this.delegatedHost)this.dispatchEvent(new Event("delegate-host",{bubbles:true,composed:true}))}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.subEltWedlets=WEDLET.cloneWedletContent(this,tpl,wedlet,tpl.parentNode===wedlet.model.config)}refreshBindValue(val,children){this.classList.toggle("virtual",this.wedlet.isVirtual())
if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){this.subEltWedlets[i].refreshBindValue(val,children)}WEDLET.clearAnnots(this)}onChildWedletsChange(){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const sub=this.subEltWedlets[i]
if(sub.onChildWedletsChange)sub.onChildWedletsChange()}}insertChars(from,chars,msg){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("insertChars"in elt)elt.insertChars(from,chars,msg)}}deleteChars(from,len,msg){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("deleteChars"in elt)elt.deleteChars(from,len,msg)}}replaceChars(chars,msg){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("replaceChars"in elt)elt.replaceChars(chars,msg)}}setEditMode(mode){DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])
if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("setEditMode"in elt)elt.setEditMode(mode)}}reassessPerms(){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("reassessPerms"in elt)elt.reassessPerms()}}isEmpty(){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if("isEmpty"in elt&&!elt.isEmpty())return false}return true}drawAnnot(annot){if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if(isSkAnnotDrawer(elt))if(elt.drawAnnot(annot))return true}if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotAttrUnknown.TYPE)this.classList.add("forbidden")
else if(isSkAnnotMissing(annot)){if(DOM.findFirstChild(this,n=>{if(isSkAnnotDrawer(n)&&IS_EltWedlet(n)&&annot.structDef.structMatch(n.wedlet.model.nodeType,n.wedlet.wedNodeName||n.wedlet.model.nodeName)){n.drawAnnot(annot)
return true}return false}))return true}if(this===this.wedlet.element){insertAnnot(this,annot)
return true}return false}eraseAnnot(annot){if(!this.wedlet)return false
if(this.subEltWedlets)for(let i=0;i<this.subEltWedlets.length;i++){const elt=this.subEltWedlets[i]
if(isSkAnnotDrawer(elt))if(elt.eraseAnnot(annot))return true}if(annot.type===SkAnnotEltUnknown.TYPE||annot.type===SkAnnotAttrUnknown.TYPE)this.classList.remove("forbidden")
else if(DOM.findFirstChild(this,n=>isSkAnnotDrawer(n)?n.eraseAnnot(annot):false))return true
if(this===this.wedlet.element)return removeAnnot(this,annot)
return false}}AgEltBoxInsertDrawerBox(BoxContainer)
export class BoxHost extends BoxContainer{configWedletElt(tpl,wedlet){wedlet.element.setDelegatedHost(this)
super.configWedletElt(tpl,wedlet)}}window.customElements.define("box-host",BoxHost)
class BoxStatic extends BoxContainer{}window.customElements.define("box-static",BoxStatic)
class BoxCtn extends BoxContainer{configWedletElt(tpl,wedlet){super.configWedletElt(tpl,wedlet)
if(tpl.getAttribute("hv")==="auto")this.hvAuto=true}onChildWedletsChange(){super.onChildWedletsChange()
if(this.hvAuto){const first=DOM.findFirstChild(this.wedlet.elementHost,IS_EltWedlet)
if(first&&DOM.findNextSibling(first,IS_EltWedlet)){if(this.classList.toggle("v",true))this.classList.remove("h")}else{if(this.classList.toggle("h",true))this.classList.remove("v")}}}}AgEltBoxSelection(BoxCtn,{selMode:"box",actionsLists:["actions:wed:box-ctn","actions:wed:box"]})
window.customElements.define("box-ctn",BoxCtn)
class BoxCollaps extends BoxContainer{constructor(){super()
this.onkeydown=this.onKeyDown}get collapsed(){return this.hasAttribute("collapsed")}set collapsed(state){if(DOM.setAttrBool(this,"collapsed",state)){if(state)this._doCollapse()
else this._doUncollapse()
this.dispatchEvent(new CustomEvent("wed-resized",{bubbles:true,composed:true}))}}get skinCollaps(){return this.getAttribute("skinCollaps")||(this.getAttribute("collapsMode")==="under"?"box-collaps/collapsed_under":"box-collaps/collapsed")}get skinUncollaps(){return this.getAttribute("collapsMode")==="start-switch"?"box-collaps/uncollapsed":null}_doCollapse(atInit){if(!atInit){const skinUncollaps=this.skinUncollaps
if(skinUncollaps)REG.removeSkin(skinUncollaps,this.shadowRoot)
const skinOver=this.getAttribute("skinUncollapsOver")
if(skinOver)REG.removeSkin(skinOver,this.shadowRoot)}const wedMgr=this.wedlet.wedMgr
wedMgr.reg.installSkin(this.skinCollaps,this.shadowRoot)
const skinCollOver=this.getAttribute("skinCollapsOver")
if(skinCollOver)wedMgr.reg.installSkin(skinCollOver,this.shadowRoot)
const collapser=this.shadowRoot.getElementById("collapser")
if(collapser)collapser.remove()
const underMode=this.getAttribute("collapsMode")==="under"
const head=this.shadowRoot.querySelector(".head")
if(head||underMode){const btn=document.createElement("span")
btn.id="decollapser"
btn.title="Déployer ce bloc"
btn.onclick=this.onDblClick
if(underMode){this.shadowRoot.appendChild(btn)
if(head){head.addEventListener("pointerdown",this.onPointerBody,true)
head.addEventListener("dblclick",this.onDblClick,true)
head.addEventListener("focusin",this.onDblClick,true)}}else{head.insertBefore(btn,head.firstChild)}}const body=this.shadowRoot.querySelector(".body")
if(body){body.addEventListener("pointerdown",this.onPointerBody,true)
body.addEventListener("dblclick",this.onDblClick,true)
body.addEventListener("focusin",this.onDblClick,true)
body.scrollTop=0}if(!atInit){WEDLET.refreshEditMode(this.wedlet)
wedMgr.wedEditor.boxSelMgr.hideSel()
wedMgr.wedEditor.boxSelMgr.selectWedlet(this.wedlet)}}_doUncollapse(atInit){if(!atInit){REG.removeSkin(this.skinCollaps,this.shadowRoot)
const skinOver=this.getAttribute("skinCollapsOver")
if(skinOver)REG.removeSkin(skinOver,this.shadowRoot)
const decollapser=this.shadowRoot.getElementById("decollapser")
if(decollapser)decollapser.remove()}const wedMgr=this.wedlet.wedMgr
const skinUncollaps=this.skinUncollaps
if(skinUncollaps)wedMgr.reg.installSkin(skinUncollaps,this.shadowRoot)
const skinUncoOver=this.getAttribute("skinUncollapsOver")
if(skinUncoOver)wedMgr.reg.installSkin(skinUncoOver,this.shadowRoot)
const head=this.shadowRoot.querySelector(".head")
if(head){const mode=this.getAttribute("collapsMode")
if(mode==="start-switch"){const btn=document.createElement("span")
btn.id="collapser"
btn.title="Replier ce bloc"
btn.onclick=this.onDblClick
head.insertBefore(btn,head.firstChild)}else if(mode==="under"){head.removeEventListener("pointerdown",this.onPointerBody,true)
head.removeEventListener("dblclick",this.onDblClick,true)
head.removeEventListener("focusin",this.onDblClick,true)}}if(!atInit){const body=this.shadowRoot.querySelector(".body")
if(body){body.removeEventListener("pointerdown",this.onPointerBody,true)
body.removeEventListener("dblclick",this.onDblClick,true)
body.removeEventListener("focusin",this.onDblClick,true)}WEDLET.refreshEditMode(this.wedlet)
wedMgr.wedEditor.boxSelMgr.hideSel()
wedMgr.wedEditor.boxSelMgr.selectWedlet(this.wedlet)}}configWedletElt(tpl,wedlet){this.wedlet=wedlet
const sh=this.shadowRoot||this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sh,wedlet)
this.subEltWedlets=WEDLET.cloneWedletContent(this,tpl,wedlet,true)
const head=this.shadowRoot.querySelector(".head")
if(head)head.ondblclick=this.onDblClickInShadow
if(this.collapsed)this._doCollapse(true)
else if(this.getAttribute("collapsMode")==="start-switch")this._doUncollapse(true)}refreshBindValue(val,children){super.refreshBindValue(val,children)
if(this.getAttribute("collapsDefault")==="ifVirtual"){this.collapsed=this.wedlet.isVirtual()}}onDblClick(ev){const me=DOMSH.findHost(this)
me.collapsed=!me.collapsed
ev.stopPropagation()
ev.preventDefault()}onDblClickInShadow(ev){const me=DOMSH.findHost(this)
if(DOMSH.findHost(ev.target)===me){me.collapsed=!me.collapsed
ev.stopPropagation()
ev.preventDefault()}}onPointerBody(ev){ev.stopImmediatePropagation()
ev.preventDefault()
DOMSH.findHost(this).focus()}onKeyDown(ev){if(ev.target!==this)return
if(ev.key==="ArrowRight"||ev.key==="Tab"){if(!ACTION.isAccelPressed(ev)&&this.collapsed)this.collapsed=false}else if(LANG.in(ev.key,"Enter"," ")&&!ACTION.isAnyControlPressed(ev)){this.collapsed=!this.collapsed
ev.stopImmediatePropagation()
ev.preventDefault()}}}AgEltBoxSelection(BoxCollaps,{selMode:"box",actionsLists:["actions:wed:box-ctn","actions:wed:box"]})
window.customElements.define("box-collaps",BoxCollaps)
class BoxCtnInput extends BoxCtn{constructor(){super()
this.ondblclick=this.onDblClick
this.onkeydown=this.onKeyDown}onDblClick(ev){const input=this.findBoxInput()
if(input){if(input.matches(":focus-within"))return;(input.focusableElement||input).focus()
if(typeof input.handleEventFromContainer==="function")input.handleEventFromContainer(ev)
ev.preventDefault()
ev.stopPropagation()}}onKeyDown(ev){if(ACTION.isAnyControlPressed(ev)||ev.composedPath()[0]!==this)return
if(ev.key.length===1||LANG.in(ev.key,"Enter")){const input=this.findBoxInput()
if(input){BASIS.ensureVisible(input,this.wedlet.wedMgr.wedEditor.scrollContainer,"nearest");(input.focusableElement||input).focus()
if(typeof input.handleEventFromContainer==="function")input.handleEventFromContainer(ev)
ev.preventDefault()
ev.stopPropagation()}else{const input=this.findStandardInput()
if(input){BASIS.ensureVisible(input,this.wedlet.wedMgr.wedEditor.scrollContainer,"nearest")
input.focus()
ev.preventDefault()
ev.stopPropagation()}}}}findBoxInput(){return DOMSH.findFlatNext(this,this,elt=>isEltBoxSelection(elt)&&LANG.in(elt.selMode,"input","caret")&&getComputedStyle(elt).display!=="none")}findStandardInput(){return DOMSH.findFlatNext(this,this,elt=>(elt instanceof HTMLInputElement||elt instanceof HTMLTextAreaElement||elt instanceof HTMLSelectElement)&&getComputedStyle(elt).display!=="none")}}window.customElements.define("box-ctn-input",BoxCtnInput)
export class BoxCreate extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.addEventListener("click",this)
this.addEventListener("keydown",this)
this.tabIndex=0
this.setAttribute("role","button")
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,wedlet,this.localName)
sr.appendChild(document.createElement("slot"))
const jml=tpl.getAttribute("content-jml")
if(jml)this.defaultContent=JSON.parse(jml)
WEDLET.cloneWedletContent(this,tpl,this.wedlet,false)}setEditMode(mode){DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}refreshBindValue(val,children){}handleEvent(ev){if(ev.type==="click"||ev instanceof KeyboardEvent&&(ev.keyCode==13||ev.keyCode==32)){if(!WEDLET.isWritableWedlet(this.wedlet))return
const eltWedlet=findElementWedlet(this)
eltWedlet.wedlet.wedMgr.wedEditor.boxSelMgr.clearSel()
this.remove()
WEDLET.insertDatasFromDisplay(eltWedlet.wedlet,null,this.defaultContent)
ev.preventDefault()
ev.stopImmediatePropagation()}}}AgEltBoxSelection(BoxCreate,{selMode:"box"})
REG.reg.registerSkin("box-create",1,`\n\t:host {\n\t\tcursor: pointer;\n\t\talign-self: start;\n\t\tjustify-self: start;\n\t\tbackground-color: var(--edit-btn-bgcolor);\n\t\tcolor: var(--edit-btn-color);\n\t\tpadding: .2em .3em;\n\t\tborder-radius: .3em;\n\t\tuser-select: none;\n\t}\n\n\t:host(:hover) {\n\t\tbackground: linear-gradient(rgb(153, 153, 153, 0.1), rgb(153, 153, 153, 0.1)), var(--edit-btn-bgcolor);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t:host([edit-mode^=r]),\n\t:host([edit-mode=h]) {\n\t\tdisplay: none;\n\t}\n`)
REG.reg.registerSkin("box-create/recursive",1,`\n\t:host {\n\t\tborder-radius: .2em;\n\t\tborder: 1px solid var(--border-color);\n\t\tpadding: 2px;\n\t\tcolor: var(--fade-color);\n\t}\n\n\t:host::after {\n\t\tcontent: '...';\n\t}\n`)
window.customElements.define("box-create",BoxCreate)
export class BoxInput extends HTMLElement{get multiline(){return this.getAttribute("aria-multiline")==="true"}get webValue(){return this.focusableElement.value}get selMode(){return this.isCaretInput()?"caret":"input"}get trimOnBlur(){return this.isCaretInput()&&this.getAttribute("trim-onblur")!=="false"}configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.ondblclick=this.onDblClick
if(!this.dispatchMode)this.dispatchMode=this.getAttribute("dispatch-mode")||"input"
this._createShadow(tpl)
this._initListeners()
this._initReadOnly()}onDblClick(ev){ev.preventDefault()
ev.stopPropagation()}setWebValue(val){const input=this.focusableElement
if(input.value!==val){this.oldWebChars=val
input.value=val||""}}setCaretAt(offset){this.focusableElement.setSelectionRange(offset,offset)}getXmlText(){return this.oldXmlChars}getSel(){if(this.isCaretInput()){const input=this.focusableElement
return[input.selectionStart,input.selectionEnd]}else{return[0,this.oldXmlChars.length]}}getSelRange(){const xa=this.wedlet.wedAnchor
if(this.isCaretInput()){const input=this.focusableElement
const start=input.selectionStart
const end=input.selectionEnd
if(start!==end)return{start:XA.freeze(XA.append(xa,start)),end:XA.setAtDepth(xa,-1,end)}
return{start:XA.append(xa,start)}}else{return{start:XA.freeze(XA.append(xa,0)),end:XA.setAtDepth(xa,-1,this.oldXmlChars.length)}}}setEditMode(mode){this.focusableElement.readOnly=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}isReadOnly(){return this.focusableElement.readOnly}refreshBindValue(val){this.batchDone=true
const isVirtual=this.wedlet.isVirtual()
this.oldXmlChars=JML.jmlNode2value(val)||""
this.setWebValue(this.xml2webChars(this.oldXmlChars))
if(this.isCaretInput()&&!isVirtual){const wedMgr=this.wedlet.wedMgr
const msg=wedMgr.currentMsg
if(msg&&isXmlMsg(msg)&&wedMgr.docHolderAsync.isMsgFromUs(msg)&&XA.isAncOrEquals(this.wedlet.wedAnchor,msg.xa)){this.setCaretAt(this.oldXmlChars.length)}}if(isVirtual)removeAnnots(this)}insertChars(from,chars,msg){try{this.oldXmlChars=LANG.stringInsert(this.oldXmlChars,from,chars)
this.setWebValue(this.xml2webChars(this.oldXmlChars))
if(this.batchDone&&this.isCaretInput()&&this.wedlet.wedMgr.docHolderAsync.isMsgFromUs(msg)){this.setCaretAt(from+this.xml2webChars(chars).length)}}finally{this.batchDone=true}}deleteChars(from,len,msg){try{this.oldXmlChars=LANG.stringDelete(this.oldXmlChars,from,len)
this.setWebValue(this.xml2webChars(this.oldXmlChars))
if(this.batchDone&&this.isCaretInput()&&this.wedlet.wedMgr.docHolderAsync.isMsgFromUs(msg)){this.setCaretAt(from)}}finally{this.batchDone=true}}replaceChars(chars,msg){this.batchDone=true
this.oldXmlChars=chars
this.setWebValue(this.xml2webChars(this.oldXmlChars))}isEmpty(){return this.oldXmlChars.length===0}handleEventFromContainer(ev){if(this.isCaretInput()&&!this.isReadOnly()&&ev instanceof KeyboardEvent&&ev.key.length===1){this.setWebValue(ev.key)
this.dispatchValue()
this.setCaretAt(1)}}onBeforeInput(ev){const boxInput=DOMSH.findHost(this)
switch(ev.inputType){case"historyUndo":case"historyRedo":if(boxInput.dispatchMode==="blur"){ev.stopPropagation()}else{ev.preventDefault()}break}}onInput(ev){DOMSH.findHost(this).dispatchDiff()}onBlur(ev){const me=DOMSH.findHost(this)
if(me.isReadOnly())return
if(me.trimOnBlur){const val=me.webValue
const trim=val.trim()
if(val!=trim)me.setWebValue(trim)}me.dispatchValue()}onChange(ev){DOMSH.findHost(this).dispatchValue()}onBlurTrim(ev){const me=DOMSH.findHost(this)
if(me.isReadOnly())return
const val=me.webValue
const trim=val.trim()
if(val!=trim){me.setWebValue(trim)
me.dispatchValue()}}dispatchValue(){try{this.batchDone=false
const wedlet=this.wedlet
const newC=this.web2xmlChars(this.webValue)
if(wedlet.isVirtual()){if(newC)WEDLET.insertDatasFromDisplay(wedlet,null,newC)
else this.batchDone=true
return}const oldC=this.oldXmlChars
if(oldC===newC){this.batchDone=true
return}const thisXa=wedlet.wedAnchor
if(!newC&&"onChildEmptied"in wedlet.wedParent){const xa=wedlet.wedParent.onChildEmptied(subXa=>XA.isEquals(thisXa,subXa))
if(xa){wedlet.wedMgr.docHolder.newBatch().deleteSequence(xa,1).doBatch()
WEDLET_SINGLEELT.reselectOnVirtualizing(this)
return}}wedlet.wedMgr.docHolder.newBatch().setText(XA.append(thisXa),newC).doBatch()}finally{if(!this.batchDone)this.setWebValue(this.oldWebChars)}}dispatchDiff(){try{this.batchDone=false
const wedlet=this.wedlet
const newC=this.web2xmlChars(this.webValue)
if(wedlet.isVirtual()){if(newC)WEDLET.insertDatasFromDisplay(wedlet,null,newC)
return}const oldC=this.oldXmlChars
if(oldC===newC){this.batchDone=true
return}const minLen=Math.min(oldC.length,newC.length)
let startDiff=0
while(startDiff<minLen){if(oldC.charCodeAt(startDiff)!==newC.charCodeAt(startDiff)){break}else startDiff++}let endDiff=0
const maxEndDiff=minLen-startDiff
const oldLast=oldC.length-1
const newLast=newC.length-1
while(endDiff<maxEndDiff){if(oldC.charCodeAt(oldLast-endDiff)!==newC.charCodeAt(newLast-endDiff)){break}else endDiff++}const sumSame=startDiff+endDiff
if(oldC.length>sumSame){if(newC.length>sumSame){wedlet.wedMgr.docHolder.newBatch().spliceSequence(XA.append(wedlet.wedAnchor,startDiff),oldC.length-sumSame,newC.substr(startDiff,newC.length-sumSame)).doBatch()}else{const thisXa=wedlet.wedAnchor
let xa
if(startDiff===0&&sumSame===0&&"onChildEmptied"in wedlet.wedParent){xa=wedlet.wedParent.onChildEmptied(subXa=>XA.isEquals(thisXa,subXa))
if(xa){wedlet.wedMgr.docHolder.newBatch().deleteSequence(xa,1).doBatch()
WEDLET_SINGLEELT.reselectOnVirtualizing(this)
return}}wedlet.wedMgr.docHolder.newBatch().deleteSequence(XA.append(thisXa,startDiff),oldC.length-sumSame).doBatch()}}else if(newC.length>sumSame){wedlet.wedMgr.docHolder.newBatch().insertText(XA.append(wedlet.wedAnchor,startDiff),newC.substr(startDiff,newC.length-sumSame)).doBatch()}}finally{if(!this.batchDone)this.setWebValue(this.oldWebChars)}}onCopy(ev){ev.stopImmediatePropagation()
if(DOMSH.findHost(this).dispatchMode==="blur")return
ev.preventDefault()
const boxInput=DOMSH.findHost(this)
boxInput.wedlet.wedMgr.writeRangeToClipboard(boxInput.getSelRange(),ev.clipboardData)}onCut(ev){ev.stopImmediatePropagation()
if(DOMSH.findHost(this).dispatchMode==="blur")return
ev.preventDefault()
const boxInput=DOMSH.findHost(this)
boxInput.wedlet.wedMgr.writeRangeToClipboard(boxInput.getSelRange(),ev.clipboardData).then(()=>{const doc=boxInput.wedlet.wedMgr.docHolder
if(doc&&this.isConnected){if(this.selectionStart===0&&this.selectionEnd===this.value.length){const thisXa=boxInput.wedlet.wedAnchor
const xa=boxInput.wedlet.wedParent.onChildEmptied(subXa=>XA.isEquals(thisXa,subXa))
if(xa){boxInput.wedlet.wedMgr.docHolder.newBatch().deleteSequence(xa,1).doBatch()
WEDLET_SINGLEELT.reselectOnVirtualizing(boxInput)
return}}doc.newBatch().deleteRange(boxInput.getSelRange()).doBatch()}})}async onPaste(ev){ev.stopImmediatePropagation()
const boxInput=DOMSH.findHost(this)
if(boxInput.dispatchMode!=="input"||!boxInput.isCaretInput())return
ev.preventDefault()
const wedMgr=boxInput.wedlet.wedMgr
const txStamp=wedMgr.txStamp
let impCtx={sel:boxInput.getSelRange(),virtualPath:WEDLET.buildVirtualPath(boxInput.wedlet),targetHint:"text"}
const imports=await wedMgr.tryPaste(impCtx,{},ev.clipboardData)
if(!imports||imports.length===0){POPUP.showNotifWarning("Aucun contenu du presse-papier n\'a pu être importé.",this)}else{const doImport=async importer=>{if(importer.needAsyncBuild&&await importer.buildContentToImport(this)==="stop")return
if(boxInput.isConnected){if(txStamp!==wedMgr.txStamp){impCtx={sel:boxInput.getSelRange(),virtualPath:WEDLET.buildVirtualPath(boxInput.wedlet)}}const batch=wedMgr.docHolder.newBatch()
importer.doImport(impCtx,batch)
batch.doBatch()}}
if(imports.length===1){doImport(imports[0])}else{const actions=imports.map(imp=>(new Action).setLabel(imp.getLabel()).setExecute(doImport))
POPUP.showPopupActions({actions:actions},boxInput,this)}}}makeInputForDiff(annot){const clone=this.focusableElement.cloneNode(true)
clone.readOnly=true
clone.value=annot.otherValue
return clone}onKeyPress(ev){if(ev.key==="Enter"){const boxInput=DOMSH.findHost(this)
if(!boxInput.multiline&&boxInput.isCaretInput())ev.preventDefault()}}onKeyDown(ev){const boxInput=DOMSH.findHost(this)
if(boxInput.dispatchMode==="blur"){if(ev.key==="Escape"||ev.key==="Tab"||ACTION.isAccelPressed(ev)){boxInput.dispatchValue()}else{ev.stopPropagation()}}}_createShadow(tpl){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,this.wedlet,this.localName)
if(tpl.hasChildNodes()){WEDLET.cloneSimpleContent(sr,tpl)
this.focusableElement=this.shadowRoot.querySelector("input,textarea,.input")}if(!this.focusableElement)this.focusableElement=sr.appendChild(document.createElement(this.multiline?"textarea":"input"))
if(this.isCaretInput())this.setAttribute("edit-mode","caret")}_initListeners(){switch(this.dispatchMode){case"input":this.focusableElement.addEventListener("input",this.onInput)
if(this.trimOnBlur)this.focusableElement.addEventListener("blur",this.onBlurTrim)
break
case"change":this.focusableElement.addEventListener("change",this.onChange)
break
case"blur":this.focusableElement.addEventListener("blur",this.onBlur)
break}this.focusableElement.addEventListener("beforeinput",this.onBeforeInput)
this.focusableElement.addEventListener("keydown",this.onKeyDown)
this.focusableElement.addEventListener("keypress",this.onKeyPress)
this.focusableElement.addEventListener("copy",this.onCopy)
this.focusableElement.addEventListener("cut",this.onCut)
this.focusableElement.addEventListener("paste",this.onPaste)}_initReadOnly(){this.focusableElement.readOnly=!WEDLET.isWritableWedlet(this.wedlet)}isCaretInput(){switch(this.focusableElement.type){case"text":case"textarea":case"url":case"email":case"tel":case"password":case"search":return true}return false}xml2webChars(chars){return this.multiline?chars:chars.replace(/[\n\r]/g," ")}web2xmlChars(chars){return chars}}AgEltBoxInsertDrawerBox(AgEltBoxSelection(AgEltBoxInputAnnotable(BoxInput),{}))
REG.reg.registerSkin("box-input",1,`\n\t:host {\n\t\tdisplay: block;\n\t}\n\n\tinput, textarea {\n\t\t-webkit-appearance: none;\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\twidth: 100%;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tfont-size: inherit;\n\t}\n\n\tinput[type=time],\n\tinput[type=month],\n\tinput[type=week] {\n\t\twidth: unset;\n\t}\n\n\tinput {\n\t\ttext-overflow: ellipsis;\n\t}\n\n\tinput[readonly] {\n\t\tcursor: pointer;\n\t}\n\n\ttextarea {\n\t\tresize: vertical;\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\t:host([edit-mode=caret]) :focus-visible {\n\t\toutline: var(--edit-caret-focus);\n\t}\n\n\t::selection {\n\t\tcolor: currentColor;\n\t\tbackground-color: var(--edit-seltext-bgcolor);\n\t}\n`)
window.customElements.define("box-input",BoxInput)
export class BoxInputCtEdit extends BoxInput{get display(){return"block"}configWedletElt(tpl,wedlet){this.placeholder=tpl.getAttribute("placeholder")
super.configWedletElt(tpl,wedlet)}_createShadow(tpl){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,this.wedlet,this.localName)
if(tpl.hasChildNodes()){WEDLET.cloneSimpleContent(sr,tpl)
this.focusableElement=this.shadowRoot.querySelector("[content-editable]")}if(!this.focusableElement)this.focusableElement=sr.appendChild(document.createElement("span"))
this.focusableElement.setAttribute("part","focusable")
this.focusableElement.spellcheck=this.spellcheck
this.focusableElement.style.whiteSpace="pre-wrap"
if(this.placeholder)this.focusableElement.setAttribute("placeholder",this.placeholder)}_initReadOnly(){this.focusableElement.contentEditable=WEDLET.isWritableWedlet(this.wedlet)?"true":"false"}setEditMode(mode){this.focusableElement.contentEditable=mode===EWedletEditMode.write?"true":"false"
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}isReadOnly(){return this.focusableElement.contentEditable!=="true"}get webValue(){const t=this.focusableElement.textContent
return t.substring(0,t.length-1)}setWebValue(val){this.oldWebChars=val
this.focusableElement.textContent=val+"\n"}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
super.refreshBindValue(val)}makeInputForDiff(annot){const clone=this.focusableElement.cloneNode(true)
clone.spellcheck=false
clone.contentEditable="false"
clone.removeAttribute("tabindex")
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[EWedletEditMode.read])
clone.textContent=annot.otherValue+"\n"
return clone}onInput(ev){const me=DOMSH.findHost(this)
let fixSel
if(me.display==="block"){const t=this.textContent
if(!this.textContent.endsWith("\n")){fixSel=t.length
this.textContent=t+"\n"}}else{if(!this.textContent){this.textContent=me.oldWebChars+"\n"
return}}me.dispatchDiff()
if(fixSel>=0)me.shadowRoot.getSelection().setPosition(this.lastChild,fixSel)}onKeyPress(ev){if(ev.key==="Enter"){const input=DOMSH.findHost(this)
if(input.multiline){if(WEDLET.isWritableWedlet(input.wedlet)){const sel=input.shadowRoot.getSelection()
if(sel.type==="Caret"){input.wedlet.wedMgr.docHolder.newBatch().insertText(XA.append(input.wedlet.wedAnchor,sel.focusOffset),"\n").doBatch()}else if(sel.type==="Range"){const rg=sel.getRangeAt(0)
input.wedlet.wedMgr.docHolder.newBatch().spliceSequence(XA.append(input.wedlet.wedAnchor,rg.startOffset),rg.endOffset-rg.startOffset,"\n").doBatch()}}}ev.preventDefault()}}setCaretAt(offset){const sel=this.shadowRoot.getSelection()
sel.collapse(this.focusableElement.firstChild,offset)}isCaretInput(){return true}getSel(){const sel=this.shadowRoot.getSelection()
if(sel.type==="Range"){const webRg=sel.getRangeAt(0)
return[webRg.startOffset,webRg.endOffset]}return[sel.focusOffset||0,sel.focusOffset||0]}getSelRange(){const sel=this.shadowRoot.getSelection()
const xa=this.wedlet.wedAnchor
if(sel.type==="Range"){const webRg=sel.getRangeAt(0)
return{start:XA.freeze(XA.append(xa,webRg.startOffset)),end:XA.setAtDepth(xa,-1,webRg.endOffset)}}return{start:XA.append(xa,sel.focusOffset||0)}}}REG.reg.registerSkin("box-input-ctedit",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t:host([aria-multiline='true']) {\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:host > span {\n\t\tpadding-inline: .2em;\n\t\tdisplay: block;\n\t}\n\n\t:host(.virtual) > span[contenteditable][placeholder]:not(:focus):before {\n\t\tcontent: attr(placeholder);\n\t\tcolor: var(--fade-color);\n\t\tcursor: text;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-caret-focus);\n\t}\n\n\t::selection {\n\t\tcolor: currentColor;\n\t\tbackground-color: var(--edit-seltext-bgcolor);\n\t}\n`)
window.customElements.define("box-input-ctedit",BoxInputCtEdit)
export class BoxInputRaw extends BoxInputCtEdit{onKeyDown(ev){const input=DOMSH.findHost(this)
if(ev.key==="Tab"&&!ACTION.isAnyControlPressed(ev)){const sel=input.shadowRoot.getSelection()
if(sel.type==="Caret"){input.wedlet.wedMgr.docHolder.newBatch().insertText(XA.append(input.wedlet.wedAnchor,sel.focusOffset),"\t").doBatch()}else if(sel.type==="Range"){const rg=sel.getRangeAt(0)
input.wedlet.wedMgr.docHolder.newBatch().spliceSequence(XA.append(input.wedlet.wedAnchor,rg.startOffset),rg.endOffset-rg.startOffset,"\t").doBatch()}ev.preventDefault()}else{BoxInput.prototype.onKeyDown.call(this,ev)}}onPaste(ev){ev.stopImmediatePropagation()
ev.preventDefault()
const txt=ev.clipboardData.getData("text/plain")
if(!txt)return
const boxInput=DOMSH.findHost(this)
if(boxInput.wedlet.isVirtual()){WEDLET.insertDatasFromDisplay(boxInput.wedlet,null,txt)}else{const xaRange=boxInput.getSelRange()
const batch=boxInput.wedlet.wedMgr.docHolder.newBatch(xaRange)
if(!XA.isCollapsed(xaRange))batch.deleteRange(xaRange)
batch.insertText(xaRange.start,txt)
batch.setSelAfterSeq(xaRange.start,txt.length)
batch.doBatch()}return null}}REG.reg.registerSkin("box-input-raw",1,`\n\t:host {\n\t\tdisplay: block;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t}\n\n\t:host([aria-multiline='true']) {\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:host > div {\n\t\tpadding: .2em;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-caret-focus);\n\t}\n`)
window.customElements.define("box-input-raw",BoxInputRaw)
export class BoxInputDate extends BoxInput{configWedletElt(tpl,wedlet){this.dispatchMode="change"
super.configWedletElt(tpl,wedlet)
const input=this.focusableElement
if(!LANG.in(input.getAttribute("type"),"date","datetime-local"))input.setAttribute("type","date")
this.focusableElement.addEventListener("blur",this.onBlur)}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
super.refreshBindValue(val)}setWebValue(val){const input=this.focusableElement
if(input.value!==val){this.oldWebChars=val
const re=this.getAttribute("type")==="date"?/^\d\d\d\d-\d\d-\d\d$/:/^\d\d\d\d-\d\d-\d\d(T\d\d:\d\d)?$/
if(!re.test(val))input.value=null
else input.value=val}}get editPending(){return this.focusableElement.classList.contains("editError")}onBlur(ev){const boxInput=DOMSH.findHost(this)
if(boxInput.editPending){boxInput.setWebValue(boxInput.xml2webChars(boxInput.oldXmlChars))
DOM.removeClass(this,"editError")}}onChange(ev){const boxInput=DOMSH.findHost(this)
if(this.validity.valid){DOM.removeClass(this,"editError")
boxInput.dispatchValue()}else{DOM.addClass(this,"editError")}}}REG.reg.registerSkin("box-input-date",1,`\n\t:host {\n\t\tjustify-self: start;\n\t\talign-self: start;\n\t}\n\n\tinput {\n\t\t-webkit-appearance: none;\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tmax-width: 12em;\n\t\ttext-align: end;\n\t}\n\n\tinput.editError {\n\t\t-webkit-appearance: none;\n\t\tbackground-color: rgba(216, 1, 0, 0.16);\n\t}\n\n\t:host(.virtual) > input::-webkit-datetime-edit-fields-wrapper {\n\t\topacity: .4;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n`)
window.customElements.define("box-input-date",BoxInputDate)
export class BoxInputNumber extends BoxInput{configWedletElt(tpl,wedlet){this.dispatchMode="input"
super.configWedletElt(tpl,wedlet)
this.focusableElement.setAttribute("type","number")
this.focusableElement.addEventListener("blur",this.onBlur)}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
super.refreshBindValue(val)}get selMode(){return"caret"}get editPending(){return this.focusableElement.classList.contains("editError")}onBlur(ev){const boxInput=DOMSH.findHost(this)
if(boxInput.editPending){boxInput.setWebValue(boxInput.xml2webChars(boxInput.oldXmlChars))
DOM.removeClass(this,"editError")}}onInput(ev){const boxInput=DOMSH.findHost(this)
if(this.validity.valid){DOM.removeClass(this,"editError")
boxInput.dispatchValue()}else{DOM.addClass(this,"editError")}}onCut(ev){ev.stopImmediatePropagation()}onCopy(ev){ev.stopImmediatePropagation()}}REG.reg.registerSkin("box-input-number",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-self: start;\n\t\talign-self: start;\n\t}\n\n\tinput {\n\t\t-webkit-appearance: none;\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tmax-width: 12em;\n\t\ttext-align: end;\n\t}\n\n\tinput.editError {\n\t\t-webkit-appearance: none;\n\t\tbackground-color: rgba(216, 1, 0, 0.16);\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n`)
window.customElements.define("box-input-number",BoxInputNumber)
export class BoxInputUser extends BoxInput{constructor(){super(...arguments)
this.multiUsersSeparator=null}get webValue(){var _a
return(_a=this.focusableElement.value)===null||_a===void 0?void 0:_a.filter(entry=>entry!=null).join(this.multiUsersSeparator)}get selMode(){return"input"}configWedletElt(tpl,wedlet){var _a
this.dispatchMode="input"
super.configWedletElt(tpl,wedlet)
this.focusableElement.initialize({reg:wedlet.wedMgr.reg,userCard:this.multiUsersSeparator?"multi":"single",required:false,selectWithConfirm:false,hideRemButton:!this.multiUsersSeparator,emptySelectionMsg:tpl.getAttribute("placeholder"),skinOver:"box-input-user/input",usersGridInit:{usersSrv:wedlet.wedMgr.reg.env.universe.useUsers,filterGroups:(_a=tpl.getAttribute("filterGroups"))===null||_a===void 0?void 0:_a.split(" "),filterType:tpl.getAttribute("filterType")==="groups"?EUserType.group:tpl.getAttribute("filterType")==="users"?EUserType.user:null}})
this.focusableElement.addEventListener("blur",this.onBlur)}_createShadow(tpl){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
WEDLET.installSkins(tpl,sr,this.wedlet,this.localName)
if(!this.focusableElement)this.focusableElement=sr.appendChild(JSX.createElement(InputUserPanel,null))}setWebValue(val){const valArray=val?val.split(this.multiUsersSeparator):[]
if(JSON.stringify(this.focusableElement.value)!=JSON.stringify(valArray)){this.oldWebChars=val
this.focusableElement.value=valArray}}onKeyPress(ev){var _a
if(ev.key==="Enter"){const input=DOMSH.findHost(this)
if(WEDLET.isWritableWedlet(input.wedlet)){(_a=input.focusableElement)===null||_a===void 0?void 0:_a.addUser()}ev.preventDefault()}}}REG.reg.registerSkin("box-input-user/input",1,`\n\t.inputBox {\n\t\tbackground-color: unset;\n\t\tborder: unset;\n\t}\n`)
REG.reg.registerSkin("box-input-user",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tjustify-self: start;\n\t\talign-self: start;\n\t\tmin-height: min-content;\n\t\tmin-width: 5em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tpadding-top: 2px;\n\t\tpadding-bottom: 2px;\n\t\tcursor: pointer;\n\t}\n\n\tc-input-users-panel.editError {\n\t\t-webkit-appearance: none;\n\t\tborder: 1px solid var(--error-color);\n\t\tbox-shadow: 0 0 2px var(--error-color);\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\t:host(.virtual) > input {\n\t\topacity: .4;\n\t}\n`)
window.customElements.define("box-input-user",BoxInputUser)
class BoxInputRange extends BoxInput{configWedletElt(tpl,wedlet){this.dispatchMode="input"
super.configWedletElt(tpl,wedlet)
this.focusableElement.setAttribute("type","range")}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
super.refreshBindValue(val)}_createShadow(tpl){super._createShadow(tpl)
const sr=this.shadowRoot
if(tpl.hasChildNodes()){this.previewValueElement=this.shadowRoot.querySelector(".preview")}if(!this.previewValueElement)this.previewValueElement=sr.appendChild(this.focusableElement.cloneNode(true))
this.previewValueElement.setAttribute("type","number")
this.previewValueElement.disabled=true
DOM.addClass(this.previewValueElement,"preview")}setWebValue(val){super.setWebValue(val)
if(this.previewValueElement)this.previewValueElement.value=val}}REG.reg.registerSkin("box-input-range",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tjustify-self: start;\n\t\talign-self: start;\n\t}\n\n\tinput:not(.preview) {\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\tborder: none;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tmax-width: 12em;\n\t\ttext-align: end;\n\t\tcursor: pointer;\n\t}\n\n\t.preview {\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\tborder: none;\n\t\tfont-style: italic;\n\t\tmax-width: 5em;\n\t\ttext-align: end;\n\t\tfont-size: .8em;\n\t}\n\n\tinput.editError {\n\t\t-webkit-appearance: none;\n\t\tbackground-color: rgba(216, 1, 0, 0.16);\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n\n\t:host(.virtual) > * {\n\t\topacity: .4;\n\t}\n\n\t::-webkit-slider-runnable-track {\n\t}\n\n\t::-webkit-slider-thumb {\n\t}\n`)
window.customElements.define("box-input-range",BoxInputRange)
class BoxInputColor extends BoxInput{configWedletElt(tpl,wedlet){this.dispatchMode="change"
this.defaultColor=tpl.getAttribute("defaultcolor")
super.configWedletElt(tpl,wedlet)
DOM.setAttr(this.focusableElement,"type","color")
this.focusableElement.addEventListener("blur",this.onBlur)
this.focusableElement.addEventListener("keydown",this.onKeydown)}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
super.refreshBindValue(val)}setWebValue(val){const input=this.focusableElement
if(input.value!==val){this.oldWebChars=val
if(!BoxInputColor.colorPattern.test(val))input.value=this.defaultColor
else input.value=val}}get editPending(){return this.focusableElement.classList.contains("editError")}onBlur(ev){const boxInput=DOMSH.findHost(this)
if(boxInput.editPending){boxInput.setWebValue(boxInput.xml2webChars(boxInput.oldXmlChars))
DOM.removeClass(this,"editError")}}onChange(ev){const boxInput=DOMSH.findHost(this)
if(this.validity.valid){DOM.removeClass(this,"editError")
boxInput.dispatchValue()}else{DOM.addClass(this,"editError")}}async onKeydown(ev){if(!ACTION.isAccelPressed(ev))return
try{if(ev.key==="c"){navigator.clipboard.writeText(this.value)}else if(ev.key==="v"){const color=await navigator.clipboard.readText()
if(BoxInputColor.colorPattern.test(color)){this.value=color
DOMSH.findHost(this).dispatchValue()}}else if(ev.key==="x"){navigator.clipboard.writeText(this.value)
const boxInput=DOMSH.findHost(this)
this.value=boxInput.defaultColor
DOMSH.findHost(this).dispatchValue()}}catch(e){}}}BoxInputColor.colorPattern=/^#([A-F0-9]{6}|[A-F0-9]{3})$/i
REG.reg.registerSkin("box-input-color",1,`\n\t:host {\n\t\tjustify-self: start;\n\t\talign-self: start;\n\t}\n\n\tinput {\n\t\t-webkit-appearance: none;\n\t\tdisplay: block;\n\t\tbackground: unset;\n\t\tcolor: unset;\n\t\tmargin: 0;\n\t\tborder: none;\n\t\tmax-width: 12em;\n\t\ttext-align: end;\n\t\tcursor: pointer;\n\t}\n\n\tinput.editError {\n\t\t-webkit-appearance: none;\n\t\tbackground-color: rgba(216, 1, 0, 0.16);\n\t}\n\n\t:host(.virtual) > input::-webkit-color-swatch-wrapper {\n\t\topacity: .4;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--edit-input-focus);\n\t}\n`)
window.customElements.define("box-input-color",BoxInputColor)
export class BoxInputEnum extends Button{configWedletElt(tpl,wedlet){this.wedlet=wedlet
this.disabled=!WEDLET.isWritableWedlet(wedlet)
this.placeholder=tpl.getAttribute("placeholder")
this.valPrefix=tpl.getAttribute("prefix")
this.valSuffix=tpl.getAttribute("suffix")
WedEnumProvider.initProviderFromTpl(tpl,this)
this.initialize({reg:wedlet.wedMgr.reg,role:"menu",skin:tpl.getAttribute("skin")||"box-input-enum",skinOver:tpl.getAttribute("skinOver")})
this.onclick=this.onClick.bind(this)}async open(){const popup=this.popup
if(popup){if(!popup.actions)popup.actions=await this.provider.getActions(this)
popup.show(this,this)}}async onClick(ev){const popup=this.popup
if(popup&&!popup.contains(ev.target)){if(!popup.actions)popup.actions=await this.provider.getActions(this)
popup.show(this,this)}}getKey(){return this.key}isSelected(key){return this.key==null?!key:this.key===key}setEditMode(mode){this.disabled=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}async refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
this.key=val
if(this.wedlet.isVirtual())removeAnnots(this)
const action=await this.provider.getAction(this.getKey(),this)
this.refreshFreeze(1)
try{function normaliseValue(val){if(val&&(this.valPrefix||this.valSuffix))return this.valPrefix+val+this.valSuffix
else return val}this.label=action?normaliseValue.call(this,action.getLabel(this)):this.placeholder||normaliseValue.call(this,this.key)||" "
this.icon=action?action.getIcon(this):null}finally{this.refreshFreeze(-1)
this.refresh()}}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.key,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.key,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}handleEventFromContainer(ev){if(!(ev instanceof KeyboardEvent)||ev.key===" "||ev.key==="Enter"){this.open()
ev.preventDefault()
ev.stopPropagation()}}isEmpty(){return!this.key}makeInputForDiff(annot){const action=this.provider.getAction(annot.otherValue,this)
if(action instanceof Promise){const div=document.createElement("div")
action.then(act=>{const label=div.appendChild(this._labelElt.cloneNode(true))
label.textContent=act?act.getLabel(this):annot.otherValue||" "
if(this._iconElt&&act){const iconUrl=act.getIcon(this)
if(iconUrl){const icon=this._iconElt.cloneNode(true)
icon.style.setProperty("--icon-img",iconUrl.startsWith("--")?`var(${iconUrl})`:`url("${iconUrl}")`)
div.appendChild(icon)}}})
return div}const label=this._labelElt.cloneNode(true)
label.textContent=action?action.getLabel(this):annot.otherValue||" "
if(this._iconElt&&action){const iconUrl=action.getIcon(this)
if(iconUrl){const icon=this._iconElt.cloneNode(true)
icon.style.setProperty("--icon-img",iconUrl.startsWith("--")?`var(${iconUrl})`:`url("${iconUrl}")`)
const div=document.createElement("div")
div.append(label,icon)
return div}}return label}_createIcon(){let labelIconBox=(this.shadowRoot||this).querySelector(".labelIconBox")
if(!labelIconBox)labelIconBox=(this.shadowRoot||this).appendChild(JSX.createElement("div",{class:"labelIconBox"}))
this._iconElt=labelIconBox.insertBefore(JSX.createElement("span",{class:"icon"}),this._labelElt)}_createLabel(){let labelIconBox=(this.shadowRoot||this).querySelector(".labelIconBox")
if(!labelIconBox)labelIconBox=(this.shadowRoot||this).appendChild(JSX.createElement("div",{class:"labelIconBox"}))
this._labelElt=labelIconBox.insertBefore(JSX.createElement("span",{class:"label"}),this._iconElt?this._iconElt.nextSibling:null)}get popup(){const popup=DOM.findFirstChild(this,IS_Popupable)||this._createPopup()
if(!("restoreFocus"in popup))popup.restoreFocus=this
return popup}_createPopup(){const popup=(new PopupActions).initialize({actionContext:this})
popup.classList.add("hideIcons")
popup.addEventListener("c-actioned",(function(ev){const{actionContext:actionContext,action:action}=ev.detail.actionable
if(action.isToggle(actionContext)&&action.isEnabled(actionContext)&&!actionContext.isSelected(action.getId())){WEDLET.replaceValue(actionContext.wedlet,actionContext.key,action.getId())}}))
return this.appendChild(popup)}connectedCallback(){super.connectedCallback()
if(this.provider.onEnumChange){this._lstn=()=>{this.refreshBindValue(this.key)}
this.provider.onEnumChange.add(this._lstn)}}disconnectedCallback(){if(this.provider.onEnumChange)this.provider.onEnumChange.delete(this._lstn)}}AgEltBoxSelection(AgEltBoxInputAnnotable(BoxInputEnum),{selMode:"input"})
REG.reg.registerSkin("box-input-enum",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-height: min-content;\n\t\tmin-width: 5em;\n\t\tborder-bottom: 1px solid var(--border-color);\n\t\tmargin: 0;\n\t\tuser-select: none;\n\t\tcursor: pointer;\n\t\tcolor: var(--color);\n\t\talign-self: start;\n\t\t/*padding-top: 2px;*/\n\t\t/*padding-bottom: 2px;*/\n\t\tpadding-inline-start: 1.2em;\n\t\tbackground: var(--dropdown-url) no-repeat left / 1em;\n\t}\n\n\t:host(.virtual) > div {\n\t\topacity: .4;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\tbackground: none;\n\t\tpointer-events: none;\n\t}\n\n\t.labelIconBox {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\tmargin-inline-start: 0.3em;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-input-focus);\n\t}\n`)
window.customElements.define("box-input-enum",BoxInputEnum)
export class BoxInputRadio extends BaseElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
WEDLET.installSkins(tpl,this.attachShadow(DOMSH.SHADOWDOM_INIT),wedlet,this.localName)
const sr=this.shadowRoot
if(tpl.childNodes){for(let node of tpl.childNodes){if(node.nodeName==="style")sr.appendChild(document.importNode(node,true))
else break}}WedEnumProvider.initProviderFromTpl(tpl,this)
this.actionnableList=sr.appendChild(JSX.createElement(RadioBtnsActionable,{class:"actionsList","î":{actionContext:this,uiContext:"custom"}}))
this.actionnableList.addEventListener("c-actioned",(function(ev){const{actionContext:actionContext,action:action}=ev.detail.actionable
if(action.isToggle(actionContext)&&action.isEnabled(actionContext)&&!actionContext.isSelected(action.getId())){WEDLET.replaceValue(actionContext.wedlet,actionContext.key,action.getId())}}))
this.actionnableList.disabled=!WEDLET.isWritableWedlet(wedlet)
this.redrawActionnableList()}async redrawActionnableList(){if(this._redrawActionnableListPendig)return
this._redrawActionnableListPendig=true
try{const actions=this.provider.getActions(this)
if(actions instanceof Promise){this.actionnableList.actions=await actions}else{this.actionnableList.actions=actions}}finally{this._redrawActionnableListPendig=false}}getKey(){return this.key}isSelected(key){return this.key==null?!key:this.key===key}setEditMode(mode){this.actionnableList.disabled=mode!==EWedletEditMode.write
DOM.setAttr(this,"edit-mode",EWedletEditModeLabel[mode])}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
this.key=val
if(this.wedlet.isVirtual())removeAnnots(this)
this.actionnableList.refreshContent()}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.key,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.key,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}isEmpty(){return!this.key}makeInputForDiff(annot){const action=this.provider.getAction(annot.otherValue,this)
let boxError=JSX.createElement("div",{class:"diffBlock"})
const fill=act=>{if(act&&act.getIcon(this)){const iconUrl=act.getIcon(this)
const iconElt=boxError.appendChild(JSX.createElement("span",{class:"icon"}))
iconElt.style.setProperty("--icon-img",iconUrl.startsWith("--")?`var(${iconUrl})`:`url("${iconUrl}")`)}boxError.appendChild(JSX.createElement("span",{class:"label"},act?act.getLabel(this):annot.otherValue||" "))}
if(action instanceof Promise){action.then(fill)}else{fill(action)}return boxError}connectedCallback(){super.connectedCallback()
if(this.provider.onEnumChange){this._lstn=this.redrawActionnableList.bind(this)
this.provider.onEnumChange.add(this._lstn)}}disconnectedCallback(){if(this.provider.onEnumChange)this.provider.onEnumChange.delete(this._lstn)}}AgEltBoxSelection(AgEltBoxInputAnnotable(BoxInputRadio),{selMode:"input"})
REG.reg.registerSkin("box-input-radio",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 5em;\n\t\tuser-select: none;\n\t\tcolor: var(--color);\n\t\tpadding-top: 2px;\n\t\tpadding-bottom: 2px;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\t.actionsList {\n\t\tdisplay: flex;\n\t\talign-items: start;\n\t\tflex-wrap: wrap;\n\t}\n\n\t.radioBox > .actionsList {\n\t\tmargin-inline-start: 1em;\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t}\n\n\tc-action {\n\t\tmin-width: 4em;\n\t}\n\n\tc-action:not(:last-child),\n\t.radioBox:not(:last-child),\n\thr:not(:last-child) {\n\t\tmargin-inline-end: 1em;\n\t}\n\n\t.radioBox, c-action {\n\t\tmargin-block: .2em 0;\n\t\tmargin-inline: 0;\n\t}\n\n\t.diffBlock {\n\t\tdisplay: inline-flex;\n\t\talign-items: center;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tfilter: var(--filter);\n\t}\n\n\t.icoLabel {\n\t\tdisplay: flex;\n\t\tflex: 0;\n\t\twidth: fit-content;\n\t\tbackground-color: var(--alt1-bgcolor);\n\t\tpadding: 0 2px;\n\t}\n\n\t:host(.virtual) {\n\t\topacity: .4;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\tbackground: none;\n\t\tpointer-events: none;\n\t}\n\n\t.labelIconBox {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\tmargin-inline-start: 0.3em;\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--edit-input-focus);\n\t}\n`)
window.customElements.define("box-input-radio",BoxInputRadio)
export class WedEnumProvider{constructor(rootEnum){this._actions=rootEnum?WedEnumProvider.buildActions(rootEnum,this):null}static initProviderFromTpl(tpl,widget){widget.provider=tpl.enumProvider
if(!widget.provider){if(tpl.hasAttribute("enumSvc")){const svcCd=tpl.getAttribute("enumSvc")
const svc=widget.wedlet.wedMgr.reg.getSvc(svcCd)
if(svc){widget.provider=svc(tpl,widget)}else{console.warn("Enum svc not found: "+svcCd)}}else{const url=tpl.getAttribute("src")
if(url){widget.provider=new WedEnumProviderFromUrl(widget.wedlet.wedMgr.reg,url,tpl.getAttribute("credentials"))}else{widget.provider=new WedEnumProvider(tpl)}WedEnumProvider.shareEnumProvForTpl(tpl,widget.provider)}}}static shareEnumProvForTpl(tpl,provider){tpl.enumProvider=provider}static findEntry(entries,key,ctx){for(const e of entries){if(e.getId()===key&&e.isToggle(ctx))return e
if(e.isMenu(ctx)){const r=WedEnumProvider.findEntry(e.getDatas("menu",ctx),key,ctx)
if(r)return r}}}static buildActions(rootEnum,prov){var _a,_b,_c
const result=[]
for(let ch=rootEnum.firstElementChild;ch;ch=ch.nextElementSibling){const k=ch.getAttribute("k")
switch(ch.localName){case"e":const a=new BoxEnumEntry(k).setLabel((_a=ch.getAttribute("v"))!==null&&_a!==void 0?_a:k).setIcon(ch.getAttribute("src")).setDescription(ch.getAttribute("d"))
if(k===null){if(prov)prov._nullAction=a}else result.push(a)
break
case"sep":result.push(new ActionSeparator)
break
case"subList":result.push(new ActionMenu(k).setLabel((_b=ch.getAttribute("v"))!==null&&_b!==void 0?_b:k).setIcon(ch.getAttribute("src")).setDescription(ch.getAttribute("d")).setActions(WedEnumProvider.buildActions(ch)))
break
case"eList":result.push(new BoxEnumMenu(k).setLabel((_c=ch.getAttribute("v"))!==null&&_c!==void 0?_c:k).setIcon(ch.getAttribute("src")).setDescription(ch.getAttribute("d")).setActions(WedEnumProvider.buildActions(ch)))
break}}return result}static filterActions(actions,regexp,widget){const list=[]
for(const a of actions){if(a instanceof ActionSeparator){if(!(list[list.length-2]instanceof ActionSeparator))list.push(a)}else if(a.isMenu(widget)){const subList=WedEnumProvider.filterActions(a.getDatas("menu",widget),regexp,widget)
if(subList.length>0){if(a.getId()==="?"){list.push(new ActionMenu(a.getId()).setLabel(a.getLabel(widget)).setDescription(a.getDescription(widget)).setIcon(a.getIcon(widget)).setActions(subList))}else{list.push(new BoxEnumMenu(a.getId()).setLabel(a.getLabel(widget)).setDescription(a.getDescription(widget)).setIcon(a.getIcon(widget)).setActions(subList))}}else if(a.isToggle(widget)&&(regexp.test(a.getLabel(widget))||regexp.test(a.getDescription(widget)||""))){list.push(new BoxEnumEntry(a.getId()).setLabel(a.getLabel(widget)).setDescription(a.getDescription(widget)).setIcon(a.getIcon(widget)))}}else if(regexp.test(a.getLabel(widget))||regexp.test(a.getDescription(widget)||"")){list.push(a)}}if(list[list.length-1]instanceof ActionSeparator)list.length--
if(list[0]instanceof ActionSeparator)list.splice(0,1)
return list}getActions(widget,filter){if(!this._actions)return null
if(filter){const regexp=new RegExp(LANG.escape4RegexpFuzzy(filter),"i")
return WedEnumProvider.filterActions(this._actions,regexp,widget)}return this._actions}getAction(key,widget){if(key===null)return this._nullAction
if(!this._actions)return null
return WedEnumProvider.findEntry(this._actions,key,widget)}}export class WedEnumProviderFromUrl extends WedEnumProvider{constructor(reg,url,credentials){super(null)
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement en cours...")]
this.fetching=this.fetchEnum(reg,url,credentials)}async fetchEnum(reg,url,credentials){try{const doc=await new PublicEndPoint(document.baseURI,credentials).fetchDom(url)
this.fetching=null
this._actions=doc?WedEnumProvider.buildActions(doc.documentElement,this):[]}catch(e){this.fetching=null
this._actions=[new BoxEnumEntry(null).setEnabled(false).setLabel("Chargement des valeurs en échec")]
throw e}}async getActions(widget,filter){if(this.fetching)await this.fetching
return super.getActions(widget,filter)}getAction(key,widget){if(this.fetching)return this.fetching.then(()=>super.getAction(key,widget))
return super.getAction(key,widget)}}export class BoxEnumEntry extends Action{isToggle(ctx){return true}getDatas(api,ctx){return ctx.isSelected(this._id)}isEnabled(ctx){if(ctx.provider.isKeyEnabled&&ctx.provider.isKeyEnabled(this._id)===false)return false
return super.isEnabled(ctx)}isVisible(ctx){if(ctx.provider.isKeyEnabled&&ctx.provider.isKeyVisible(this._id)===false)return false
return super.isVisible(ctx)}}export class BoxEnumMenu extends ActionMenu{isToggle(ctx){return true}getDatas(api,ctx){return api==="menu"?super.getDatas(api,ctx):ctx.isSelected(this._id)}}export class BoxLabel extends HTMLElement{constructor(){super()
this.style.userSelect="none"}configWedletElt(tpl,wedlet){this.wedlet=wedlet}refreshBindValue(val){this.classList.toggle("virtual",this.wedlet.isVirtual())
if(!this.hasChildNodes()){this.textContent=this.wedlet.model.nodeLabel||this.wedlet.model.nodeName}}}window.customElements.define("box-label",BoxLabel)
export class BoxValue extends HTMLElement{configWedletElt(tpl,wedlet){this.wedlet=wedlet
if(tpl.hasAttribute("transform"))this.transform=new Function("val",tpl.getAttribute("transform"))
if(tpl.hasAttribute("customize"))this.customize=new Function("val",tpl.getAttribute("customize"))}refreshBindValue(val){var _a,_b
this.classList.toggle("virtual",this.wedlet.isVirtual())
let v=((_a=this.transform)===null||_a===void 0?void 0:_a.call(this,val))||(val===null||val===void 0?void 0:val.toString())||""
const prefix=this.getAttribute("prefix")
if(prefix)v=prefix+v
const suffix=this.getAttribute("suffix")
if(suffix)v=v+suffix
if(this.hasAttribute("asTitle")){DOMSH.getFlatParentElt(this).title=v}else{this.textContent=v}(_b=this.customize)===null||_b===void 0?void 0:_b.call(this,val)}insertChars(from,chars,msg){this.refreshBindValue(LANG.stringInsert(this.textContent,from,chars))}deleteChars(from,len,msg){this.refreshBindValue(LANG.stringDelete(this.textContent,from,len))}replaceChars(chars,msg){this.refreshBindValue(chars)}}window.customElements.define("box-value",BoxValue)
function insertDiffMark(parent,annot){document.createElement("wed-diff-mark").initDiffAnnot(parent,annot,parent.wedlet).defaultInject()}function insertDiffValue(parent,annot){var _a
document.createElement("wed-diff-value").initDiffValue(annot,parent,parent.wedlet.wedMgr,(_a=parent.makeInputForDiff)===null||_a===void 0?void 0:_a.call(parent,annot))}function insertDiffForeign(parent,annot){const wedlet=parent.wedlet
const insBeforeWedlet=typeof annot.offset==="number"?wedlet.findWedletChild(annot.offset,WEDLET.VISITOPTIONS_mainBranch):undefined
const elt=document.createElement("wed-diff-foreign").initDiffForeign(annot,annot.createForeignHouse(),wedlet)
wedlet.injectForeignChild(annot.foreignNode,elt,insBeforeWedlet)}function insertDiffReplace(parent,annot){const wedlet=parent.wedlet
const margin=document.createElement("wed-diff-mark")
const foreignParent=wedlet.wedParent
const foreignElt=document.createElement("wed-diff-foreign")
foreignElt.initDiffForeign(annot.foreign,annot.foreign.createForeignHouse(),foreignParent,margin)
margin.initDiffAnnot(parent,annot,wedlet,foreignElt).defaultInject()
if(wedlet.model.nodeType===ENodeType.attribute){foreignParent.injectForeignChild(annot.foreign.foreignNode,foreignElt,null,wedlet)}else{foreignParent.injectForeignChild(annot.foreign.foreignNode,foreignElt,wedlet)}}export function insertAnnot(parent,annot){var _a,_b
if(annot.level.weight<=EAnnotLevel.error.weight&&annot.level.weight>0){if(parent.wedAnnotErr){parent.wedAnnotErr.addAnnot(annot,false)}else{(new WedAnnotErr).initAnnot(parent,annot,parent.wedlet,false)}}else if(isSkSearchAnnot(annot)){if(parent.wedAnnotSearch)parent.wedAnnotSearch.addAnnot(annot)
else(new WedAnnotSearch).initSearchAnnot(parent,parent.wedlet).addAnnot(annot)}else if((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot)){if(((_b=parent.wedlet.wedMgr.docHolder)===null||_b===void 0?void 0:_b.getDiffSession())===annot.diffSession){if(annot.type==="diffMark"){if(WEDLET.getWedletDepth(parent.wedlet)===annot.start.length)insertDiffMark(parent,annot)}else if(annot.type==="diffValue"){if(WEDLET.getWedletDepth(parent.wedlet)===annot.start.length)insertDiffValue(parent,annot)}else if(annot.type==="diffForeign"){if(WEDLET.getWedletDepth(parent.wedlet)+1===annot.start.length)insertDiffForeign(parent,annot)}else if(annot.type==="diffReplace"){if(WEDLET.getWedletDepth(parent.wedlet)===annot.start.length)insertDiffReplace(parent,annot)}}}}export function removeAnnot(parent,annot){var _a,_b,_c,_d
if(annot.level.weight<=EAnnotLevel.error.weight&&annot.level.weight>0){return parent.wedAnnotErr?parent.wedAnnotErr.removeAnnot(annot):false}else if(isSkSearchAnnot(annot)){return parent.wedAnnotSearch?parent.wedAnnotSearch.removeAnnot(annot):false}else if((_a=WEDLET.diffLib)===null||_a===void 0?void 0:_a.isDiffAnnot(annot)){if(annot.type==="diffMark"||annot.type==="diffValue"){if(((_b=parent.wedAnnotDiff)===null||_b===void 0?void 0:_b.skAnnot)===annot){parent.wedAnnotDiff.removeDiffWidget()
return true}}else if(annot.type==="diffForeign"){const d=DOM.findFirstChild(parent.wedlet.elementHost,n=>n.localName==="wed-diff-foreign"&&n.skAnnot===annot)
if(d){d.remove()
return true}}else if(annot.type==="diffReplace"){if(((_c=parent.wedAnnotDiff)===null||_c===void 0?void 0:_c.skAnnot)===annot){parent.wedAnnotDiff.removeDiffWidget();(_d=DOM.findFirstChild(parent.wedlet.wedParent.elementHost,n=>n.localName==="wed-diff-foreign"&&n.skAnnot===annot.foreign))===null||_d===void 0?void 0:_d.remove()
return true}}}return false}export function removeAnnots(parent){if(parent.wedAnnotErr)parent.wedAnnotErr.removeAll()}export function AgEltBoxInputAnnotable(cls){const proto=cls.prototype
proto.drawAnnot=drawAnnot
proto.eraseAnnot=eraseAnnot
return cls}function drawAnnot(annot){if(annot.type===SkAnnotTextForbidden.TYPE||annot.type===SkAnnotAttrUnknown.TYPE){this.classList.add("forbidden")
return false}insertAnnot(this,annot)
return true}function eraseAnnot(annot){if(annot.type===SkAnnotTextForbidden.TYPE||annot.type===SkAnnotAttrUnknown.TYPE){this.classList.remove("forbidden")
return false}return removeAnnot(this,annot)}export const boxTagsDefined=Promise.resolve()

//# sourceMappingURL=boxTags.js.map