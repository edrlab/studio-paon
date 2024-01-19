import{ActionableList,ACTIONABLES,IS_Actionable,IS_ActionableEnabled}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/actionables.js"
import{BaseElement,BASIS,isEltRefreshable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ActionSeparator}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{isRefreshHook}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class Actionables extends ActionableList{_createButton(action){return ActionBtn.buildButton(action,this._actionContext,this.uiContext,this)}}customElements.define("c-actionables",Actionables)
export class BarActions extends ActionableList{get vertical(){return this.classList.contains("vertical")}_initialize(init){super._initialize(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
const ctn=sr.appendChild(JSX.createElement("slot",null))
this.addEventListener("keydown",this.onKeydown)
this.overrideButtonsElts=init.overrideButtonsElts
if(init.disableFullOverlay){this._initAndInstallSkin("c-bar-actions/disableFullOverlay",init)}else{ctn.addEventListener("mousedown",this.onMouseDown)
ctn.addEventListener("mouseenter",this.onMouseEnter)
ctn.addEventListener("mouseleave",this.onMouseLeave)
this.addEventListener("focusin",this.onFocusIn)
this.addEventListener("focusout",this.onFocusOut)
this._initAndInstallSkin("c-bar-actions",init)}}_createButton(action){const btn=ActionBtn.buildButton(action,this._actionContext,this.uiContext,this)
if(btn&&this.overrideButtonsElts)this.overrideButtonsElts(btn)
return btn}evalShowFull(slot,ch=this.lastElementChild){if(this.vertical){if(ch&&this.offsetWidth<ch.offsetLeft+ch.offsetWidth-2)DOM.addClass(slot,"show")}else{if(ch&&this.offsetHeight<ch.offsetTop+ch.offsetHeight-2)DOM.addClass(slot,"show")}}onMouseDown(ev){if(this===ev.target){ev.stopImmediatePropagation()
ev.preventDefault()}}onMouseLeave(){if(DOMSH.isLogicalFlatAncestor(DOMSH.findHost(this),DOMSH.findDeepActiveElement()))return
DOM.removeClass(this,"show")}onMouseEnter(){DOMSH.findHost(this).evalShowFull(this)}onFocusIn(ev){this.evalShowFull(this.shadowRoot.querySelector("slot"))}onFocusOut(ev){if(ev.relatedTarget&&DOMSH.isLogicalFlatAncestor(this,ev.relatedTarget)){const blur=ev=>{ev.target.removeEventListener("blur",blur)
this.onFocusOut(ev)}
ev.relatedTarget.addEventListener("blur",blur)
return}DOM.removeClass(this.shadowRoot.querySelector("slot"),"show")}onKeydown(ev){if(this.vertical){switch(ev.key){case"ArrowUp":this.moveFocus(ev,false)
break
case"ArrowDown":this.moveFocus(ev,true)
break}}else{switch(ev.key){case"ArrowLeft":this.moveFocus(ev,false)
break
case"ArrowRight":this.moveFocus(ev,true)
break}}}moveFocus(ev,forward){const target=ev.composedPath()[0]
if(target.parentNode===this){const next=forward?DOM.findNextSibling(target,IS_ActionableEnabled):DOM.findPreviousSibling(target,IS_ActionableEnabled)
if(next){ev.stopImmediatePropagation()
next.focus()}}}}REG.reg.registerSkin("c-bar-actions",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: calc(6px + var(--icon-size));\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\tposition: relative;\n\t}\n\n\t:host(.vertical) {\n\t\tmin-width: calc(6px + var(--icon-size));\n\t\tmin-height: 0;\n\t\tflex-direction: column;\n\t}\n\n\tslot {\n\t\tposition: relative;\n\t\toverflow: hidden;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tmax-height: calc(6px + var(--icon-size));\n\t\tflex-wrap: wrap;\n\t\tflex: 1;\n\t}\n\n\t:host(.vertical) > slot {\n\t  flex-direction: column;\n\t  max-height: unset;\n\t  max-width: calc(6px + var(--icon-size));\n  }\n\n  slot.show {\n\t  position: absolute;\n\t  top: 0;\n\t  left: 0;\n\t  overflow: visible;\n\t  bottom: unset;\n\t  z-index: 100;\n\t  max-height: unset;\n\t  background-color: var(--bgcolor); /* on doit écraser ce qui est en dessous. */\n\t  border: 1px solid var(--border-color);\n\t  box-shadow: 1px 1px 6px var(--fade-color);\n  }\n\n  ::slotted(hr) {\n\t  border-top: 1px solid var(--border-color);\n\t  border-inline-start: 1px solid var(--border-color);\n\t  border-inline-end: none;\n\t  border-bottom: none;\n\t  margin: .2rem;\n\t  align-self: stretch;\n  }\n`)
REG.reg.registerSkin("c-bar-actions/disableFullOverlay",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: calc(6px + var(--icon-size));\n\t\tmin-width: 0;\n\t\tflex-wrap: wrap;\n\t\talign-items: center;\n\t}\n\n\t:host(.vertical) {\n\t\tflex-direction: column;\n\t\tmin-height: 0;\n\t\tmin-width: calc(6px + var(--icon-size));\n\t}\n\n\t::slotted(hr) {\n\t\tborder-top: 1px solid var(--border-color);\n\t\tborder-inline-start: 1px solid var(--border-color);\n\t\tborder-inline-end: none;\n\t\tborder-bottom: none;\n\t\tmargin: .2em;\n\t\talign-self: stretch;\n\t}\n`)
customElements.define("c-bar-actions",BarActions)
export class BarShared extends BaseElement{_initialize(init){this.actionContext=init.actionContext
if(init.startActions)this.startActions=init.startActions
if(init.endActions)this.endActions=init.endActions
if(init.focusListening)this.focusListening=init.focusListening
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this._startBar=sr.appendChild(JSX.createElement("div",{id:"start"}))
if(this.endActions&&this.endActions.length>0)this._createEndBar()
this._startBar.addEventListener("mousedown",this.onMouseDown)
this._startBar.addEventListener("mouseenter",this.onMouseEnter)
this._startBar.addEventListener("mouseleave",this.onMouseLeave)
this._startBar.addEventListener("focusin",this.onFocusIn)
this._startBar.addEventListener("focusout",this.onFocusOut)
this._requestIdleBinded=this._requestIdle.bind(this)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
const reg=this.findReg(init)
if(this.hasAttribute("start-actions"))init.startActions=reg.getList(BASIS.extractAttr(this,"start-actions"))
if(this.hasAttribute("end-actions"))init.endActions=reg.getList(BASIS.extractAttr(this,"end-actions"))
if(this.hasAttribute("action-context"))init.actionContext=reg.getSvc(BASIS.extractAttr(this,"action-context"))
return init}connectedCallback(){super.connectedCallback()
if(this.focusListening){function add(elt,lstn){elt.addEventListener("focusin",lstn)
elt.addEventListener("c-focus-actions",lstn)
elt.addEventListener("focusout",lstn)}this._onEventsBinded=this._onEvents.bind(this)
if(Array.isArray(this.focusListening))for(const elt of this.focusListening)add(elt,this._onEventsBinded)
else add(this.focusListening,this._onEventsBinded)}}disconnectedCallback(){if(this.focusListening){function rem(elt,lstn){elt.removeEventListener("focusin",lstn)
elt.removeEventListener("c-focus-actions",lstn)
elt.removeEventListener("focusout",lstn)}if(Array.isArray(this.focusListening))for(const elt of this.focusListening)rem(elt,this._onEventsBinded)
else rem(this.focusListening,this._onEventsBinded)
this._onEventsBinded=null}}planRefresh(){if(!this._refreshPlanned)this._refreshPlanned=window.requestIdleCallback(this._requestIdleBinded)}_onEvents(ev){if(ev instanceof CustomEvent){this.focusActionables=ev.detail?ev.detail.focusActionables:null
this.planRefresh()}else if(ev.type==="focusin"){for(const node of ev.composedPath()){if("focusActionables"in node){this.focusActionables=node.focusActionables
this.planRefresh()
return}else if(node===this){if(this.focusActionables){this.focusActionables=null
this.planRefresh()}return}}}else if(ev.type==="focusout"){if(ev.relatedTarget&&DOMSH.isLogicalFlatAncestor(this,ev.relatedTarget))return
this.focusActionables=null
this.planRefresh()}}_requestIdle(deadline){if(deadline.timeRemaining()<5){this._refreshPlanned=window.requestIdleCallback(this._requestIdleBinded)
return}this._refreshPlanned=null
this.refresh()}evalShowFull(ch=this._startBar.lastElementChild){if(ch&&this.offsetHeight<ch.offsetTop+ch.offsetHeight)DOM.addClass(this._startBar,"show")}onMouseDown(ev){if(this===ev.target){ev.stopImmediatePropagation()
ev.preventDefault()}}onMouseLeave(){if(DOMSH.isLogicalFlatAncestor(DOMSH.findHost(this),DOMSH.findDeepActiveElement()))return
DOM.removeClass(this,"show")}onMouseEnter(){DOMSH.findHost(this).evalShowFull()}onFocusIn(ev){DOMSH.findHost(this).evalShowFull()}onFocusOut(ev){const barShared=this instanceof BarShared?this:DOMSH.findHost(this)
if(ev.relatedTarget&&DOMSH.isLogicalFlatAncestor(barShared._startBar,ev.relatedTarget)){const blur=ev=>{ev.target.removeEventListener("blur",blur)
barShared.onFocusOut(ev)}
ev.relatedTarget.addEventListener("blur",blur)
return}DOM.removeClass(barShared._startBar,"show")
barShared.focusActionables=null
barShared.planRefresh()}_refresh(){if(!this.actionContext){this.textContent=null
return}if(isRefreshHook(this.actionContext)&&this.actionContext.onRefreshCycle(true)==="stop")return
try{let nextTag=this._startBar.firstElementChild
if(this.startActions)for(let i=0;i<this.startActions.length;i++){const action=this.startActions[i]
if(IS_Actionable(nextTag)&&nextTag.action===action){if(isEltRefreshable(nextTag))nextTag.refresh()
nextTag=nextTag.nextElementSibling}else{const b=this._createButton(action)
if(b)this._startBar.insertBefore(b,nextTag)}}if(this.focusActionables&&this.focusActionables.length>0){if(IS_Actionable(nextTag)&&nextTag.action instanceof ActionSeparator){if(isEltRefreshable(nextTag))nextTag.refresh()
nextTag=nextTag.nextElementSibling}else{this._startBar.insertBefore(this._createButton(new ActionSeparator),nextTag)}for(let i=0;i<this.focusActionables.length;i++){const actionable=this.focusActionables[i]
if(IS_Actionable(nextTag)&&nextTag.action===actionable.action){if(isEltRefreshable(nextTag))nextTag.refresh()
nextTag=nextTag.nextElementSibling}else{this._startBar.insertBefore(actionable,nextTag)}}}while(nextTag){const toRem=nextTag
nextTag=nextTag.nextElementSibling
toRem.remove()}ACTIONABLES.cleanupDoubleSep(this._startBar)
if(this.endActions&&this.endActions.length>0){if(!this._endBar)this._createEndBar()
nextTag=this._endBar.firstElementChild
for(let i=0;i<this.endActions.length;i++){const action=this.endActions[i]
if(IS_Actionable(nextTag)&&nextTag.action===action){if(isEltRefreshable(nextTag))nextTag.refresh()
nextTag=nextTag.nextElementSibling}else{const b=this._createButton(action)
if(b)this._endBar.insertBefore(b,nextTag)}}while(nextTag){const toRem=nextTag
nextTag=nextTag.nextElementSibling
toRem.remove()}ACTIONABLES.cleanupDoubleSep(this._endBar)}else if(this._endBar)this._endBar.textContent=null}finally{if(isRefreshHook(this.actionContext))this.actionContext.onRefreshCycle(false)}}_createEndBar(){this.shadowRoot.appendChild(JSX.createElement("hr",null))
return this._endBar=this.shadowRoot.appendChild(JSX.createElement("div",{id:"end"}))}_createButton(action){return ActionBtn.buildButton(action,this.actionContext,"bar",this)}}REG.reg.registerSkin("c-bar-shared",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 1.7em;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\talign-items: center;\n\t\tjustify-content: flex-end;\n\t\tposition: relative;\n  }\n\n  :host([vertical]) {\n\t  flex-direction: column;\n\t  min-height: 0;\n\t  min-width: 1.7em;\n\t  justify-content: unset;\n  }\n\n  #end {\n\t  display: flex;\n\t  min-height: 0;\n\t  min-width: 0;\n  }\n\n  #start {\n\t  position: relative;\n\t  overflow: hidden;\n\t  display: flex;\n\t  min-width: 0;\n\t  min-height: calc(6px + var(--icon-size));\n\t  flex-wrap: wrap;\n\t  flex: 1;\n  }\n\n  :host([vertical]) #start {\n\t  flex-direction: column;\n\t  min-height: unset;\n\t  min-width: calc(6px + var(--icon-size));\n  }\n\n  #start.show {\n\t  position: absolute;\n\t  top: 0;\n\t  left: 0;\n\t  overflow: visible;\n\t  bottom: unset;\n\t  z-index: 100;\n\t  max-height: unset;\n\t  border: 1px solid var(--border-color);\n\t  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);\n\t  background-color: var(--bgcolor);\n  }\n\n  hr {\n\t  border-top: 1px solid var(--border-color);\n\t  border-inline-start: 1px solid var(--border-color);\n\t  border-inline-end: none;\n\t  border-bottom: none;\n\t  margin: .2em;\n\t  align-self: stretch;\n  }\n`)
customElements.define("c-bar-shared",BarShared)
export class BarStatus extends BaseElement{_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
this._textCtn=sr.appendChild(document.createElement("div"))}setStatus(status){this._textCtn.textContent=status}}REG.reg.registerSkin("c-bar-status",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex: 1;\n\t\tpadding: 2px;\n\t}\n\n\tdiv {\n\t\tflex: 1;\n\t\tjustify-content: start;\n\t\toverflow: hidden;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t\tfont-size: small;\n\t}\n`)
customElements.define("c-bar-status",BarStatus)

//# sourceMappingURL=bars.js.map