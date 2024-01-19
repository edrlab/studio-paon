import{Actionable,ActionableList,ACTIONABLES}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/actionables.js"
import{BaseElement,BASIS,Clickable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{PopupActions}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popups.js"
import{ACTION,ActionWrapper,isAccelKeyMgrPointer}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
export class Button extends Clickable{get role(){return this.getAttribute("role")}get uiContext(){return this.getAttribute("ui-context")}_initialize(init){super._initialize(init)
initButtonFromConfig(this,init)}_initSkin(){}}function initButtonFromConfig(elt,init){if(init.role)DOM.setAttr(elt,"role",init.role)
else if(!elt.hasAttribute("role"))elt.setAttribute("role","button")
if(init.uiContext)DOM.setAttr(elt,"ui-context",init.uiContext)
if(elt.shadowRoot)elt._initAndInstallSkin(elt.uiContext?elt.uiContext+"/c-button":"bar/c-button",init)}REG.reg.registerSkin("dialog/c-button",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-width: 0;\n\t\tmin-height: min-content;\n\t\tmax-height: 5em;\n\t\toverflow: hidden;\n\t\talign-items: center;\n\t\ttext-align: center;\n\t\tjustify-content: center;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: 3px;\n\t\tpadding: 0.3ex 0.6ex;\n\t\tmargin: .5em;\n\t\tuser-select: none;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\topacity: .3;\n\t}\n\n\t:host(:not([disabled])) {\n\t\tcursor: pointer;\n\t}\n\n\t:host(.vertical) {\n\t\tflex-direction: column;\n\t}\n\n\t:host(.inline) {\n\t\tdisplay: inline-flex;\n\t}\n\n\t:host(.default:not([disabled])) {\n\t\t/*outline: 1px solid var(--border-color);\n\t\toutline-offset: -2px;*/\n\t\tcolor: var(--inv-color);\n\t\tbackground-color: var(--inv-bgcolor);\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tfilter: var(--filter);\n\t\t/*mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*-webkit-mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*background-blend-mode: multiply;*/\n\t}\n\n\t:host(:hover:not([disabled])) > .icon {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t:host(:active:not([disabled])) > .icon {\n\t\tfilter: var(--actve-filter);\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\t-webkit-margin-start: 0.3em;\n\t\tmargin-inline-start: 0.3em;\n\t}\n\n\t:host(.vertical) .icon {\n\t\theight: calc(var(--icon-size) * 1.5);\n\t\twidth: calc(var(--icon-size) * 1.5);\n\t}\n\n\t.label {\n\t\t/* Utilisé seulement si white-space: nowrap; */\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t:host(:hover:not([disabled])) {\n\t\t/*box-shadow: inset 0 0 3px var(--border-color);*/\n\t\tbackground-color: var(--pressed-bgcolor);\n\t}\n\n\t:host(.default:hover:not([disabled])) {\n\t\tbackground-color: var(--inv-bgcolor);\n\t\tbackground-image: linear-gradient(var(--inv-pressed-bgcolor), var(--inv-pressed-bgcolor));\n\t}\n\n\t:host(:focus-visible) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t:host(:active:not([disabled])) {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t\t/*box-shadow: inset 0 0 2px var(--border-color);*/\n\t}\n\n\t:host([role=menu]) {\n\t\tpadding-inline-end: 1.2em;\n\t\tbackground: var(--dropdown-url) no-repeat right / 1em;\n\t}\n\n\t:host([role=menu]:hover:not([disabled])) {\n\t\tbackground: var(--pressed-bgcolor) var(--dropdown-url) no-repeat right / 1em;\n\t}\n\n\t:host([aria-pressed])::before {\n\t\tcontent: '✓ ';\n\t}\n\n\t:host([aria-pressed=true]) {\n\t\tborder: 1px inset var(--border-color);\n\t}\n\n\t:host([aria-pressed=false])::before {\n\t\tcolor: transparent;\n\t}\n\n\t:host([aria-pressed=mixed])::before {\n\t\tcolor: var(--fade-color);\n\t}\n\n\n`)
REG.reg.registerSkin("bar/c-button",1,`\n\t:host {\n\t\tfont-size: var(--label-size);\n\t\tborder: solid 1px transparent;\n\t\tborder-radius: 3px;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\ttext-align: center;\n\t\tjustify-content: center;\n\t\t-moz-user-select: none;\n\t\t-ms-user-select: none;\n\t\tuser-select: none;\n\t}\n\n\t:host(:not([hidden])) {\n\t\tpadding: 2px 4px;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host(:not([disabled])) {\n\t\tcursor: pointer;\n\t}\n\n\t:host([disabled]) {\n\t\topacity: .5;\n\t}\n\n\t:host(.vertical) {\n\t\tflex-direction: column;\n\t}\n\n\t:host(.inline) {\n\t\tdisplay: inline-flex;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tfilter: var(--filter);\n\t\t/*mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*-webkit-mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*background-blend-mode: multiply;*/\n\t}\n\n\t:host(:hover:not([disabled])) > .icon {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t:host(:active:not([disabled])) > .icon {\n\t\tfilter: var(--active-filter);\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\t-webkit-margin-start: 0.3em;\n\t\tmargin-inline-start: 0.3em;\n\t}\n\n\t:host(.vertical) > .icon {\n\t\theight: calc(var(--icon-size) * 1.5);\n\t\twidth: calc(var(--icon-size) * 1.5);\n\t}\n\n\t.label {\n\t\t/* Utilisé seulement si white-space: nowrap; */\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t:host(:hover:not([disabled])) {\n\t\t/*box-shadow: inset 0 0 3px var(--border-color);*/\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\t:host(:focus) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t:host(:active:not([disabled])) {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t\t/*box-shadow: inset 0 0 3px var(--border-color);*/\n\t}\n\n\t:host([role=menu]:not([disabled])) { /* NE PAS SUPPR :not([disabled]) pour priorité > :host(:hover:not([disabled])) */\n\t\tpadding-inline-end: 1.2em;\n\t\tbackground: var(--dropdown-url) no-repeat right / 1em;\n\t}\n\n\t:host([role=menu]:hover:not([disabled])) {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t}\n\n\t:host([role=menu][disabled]) { /* NE PAS SUPPR [disabled] pour priorité > :host(:hover:not([disabled])) */\n\t\tpadding-inline-end: 1.2em;\n\t}\n\n\t:host([aria-pressed]) {\n\t\tborder: 1px outset var(--border-color);\n\t\tborder-radius: 3px;\n\t\tmargin-inline: 1px;\n\t}\n\n\t/* TODO aria-pressed=mixed */\n\t:host([aria-pressed=true]) {\n\t\tborder: 1px inset;\n\t\tbackground-color: var(--pressed-bgcolor);\n\t}\n\n\t/*:host([aria-pressed])::before {\n\t\tcontent:'✓ ';\n\t}\n\n\t:host(:not([aria-pressed=true]))::before {\n\t\tcolor:transparent;\n\t}*/\n`)
REG.reg.registerSkin("menu/c-button",1,`\n\t:host {\n\t\tpadding: .3ex;\n\t\tpadding-inline-start: 0;\n\t\tpadding-inline-end: .3em;\n\t\tdisplay: grid;\n\t\tmin-height: min-content;\n\t\tmin-width: min-content;\n\t\tgrid-template-areas: "check icon label sub";\n\t\tgrid-template-columns: 0 var(--icon-size) 1fr auto;\n\t\tcolumn-gap: .2em;\n\t\t-moz-user-select: none;\n\t\tuser-select: none;\n\t\tcursor: default;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\topacity: 0.6;\n\t}\n\n\t.icon {\n\t\tgrid-area: icon;\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tbackground-origin: content-box;\n\t\twidth: var(--icon-size);\n\t\tfilter: var(--filter);\n\t}\n\n\t:host(:hover:not([disabled])) > .icon {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t.label {\n\t\tgrid-area: label;\n\t\twhite-space: nowrap;\n\t}\n\n\t.ctn {\n\t\tgrid-area: label;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t}\n\n\t.ctn > .label {\n\t\tflex: 1;\n\t}\n\n\t.accel {\n\t\tpadding-inline-start: .3em;\n\t\tfont-style: italic;\n\t\tfont-size: 80%;\n\t\tcolor: grey;\n\t}\n\n\t:host(:focus) {\n\t\tbackground-color: var(--row-inSel-bgcolor);\n\t\toutline: none;\n\t}\n\n\t:host(.inSubMenu) {\n\t\tbackground-color: var(--row-inSel-unfocus-bgcolor);\n\t}\n\n\t:host([aria-haspopup]):after {\n\t\tgrid-area: sub;\n\t\tcontent: '';\n\t\tpadding-inline-start: 1em;\n\t\tbackground: var(--dropdown-url) no-repeat center / 1em;\n\t\ttransform: rotate(-90deg);\n\t}\n\n\t:host([aria-pressed]),\n\t:host([check-space]) {\n\t\tpadding-inline-start: .3em;\n\t\tgrid-template-columns: 1em var(--icon-size) 1fr auto;\n\t}\n\n\t:host([aria-pressed])::before {\n\t\tgrid-area: check;\n\t\tcontent: ' ';\n\t}\n\n\t:host([aria-pressed=true])::before {\n\t\tcolor: transparent;\n\t\tbackground-position: center;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-image: var(--row-current-img-end);\n\t}\n\n\t:host([aria-pressed=mixed])::before {\n\t\tcolor: var(--fade-color);\n\t\tcontent: '?';\n\t}\n`)
REG.reg.registerSkin("custom/c-button",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\talign-items: center;\n\t\ttext-align: center;\n\t\tjustify-content: center;\n\t\t-moz-user-select: none;\n\t\tuser-select: none;\n\t}\n\n\t:host([hidden]) {\n\t\tdisplay: none;\n\t}\n\n\t:host([disabled]) {\n\t\topacity: 0.2;\n\t}\n\n\t:host(:not([disabled])) {\n\t\tcursor: pointer;\n\t}\n\n\t:host(.vertical) {\n\t\tflex-direction: column;\n\t}\n\n\t.icon {\n\t\theight: var(--icon-size);\n\t\twidth: var(--icon-size);\n\t\tmin-height: var(--icon-size);\n\t\tmin-width: var(--icon-size);\n\t\tbackground: var(--icon-color) var(--icon-img) no-repeat center / contain;\n\t\tfilter: var(--filter);\n\t\t/*mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*-webkit-mask: var(--icon-img) no-repeat center / contain;*/\n\t\t/*background-blend-mode: multiply;*/\n\t}\n\n\t:host(:hover:not([disabled])) > .icon {\n\t\tfilter: var(--hover-filter);\n\t}\n\n\t:host(.vertical) .icon {\n\t\theight: calc(var(--icon-size) * 1.5);\n\t\twidth: calc(var(--icon-size) * 1.5);\n\t}\n\n\t:host(:active:not([disabled])) > .icon {\n\t\tfilter: var(--active-filter);\n\t}\n\n\t.label {\n\t\tflex: 1;\n\t\t/* Utilisé seulement si white-space: nowrap; */\n\t\toverflow: hidden;\n\t\ttext-overflow: ellipsis;\n\t}\n\n\t.icon:not([hidden]) + .label {\n\t\tmargin-inline-start: .3em;\n\t}\n\n\t:host(:hover:not([disabled])) {\n\t\t/*box-shadow: inset 0 0 3px var(--border-color);*/\n\t\tbackground: var(--pressed-bgcolor);\n\t}\n\n\t:host(:focus-visible) {\n\t\toutline: var(--focus-outline);\n\t\toutline-offset: -2px;\n\t}\n\n\t:host(:active:not([disabled])) {\n\t\tbackground-color: var(--pressed-bgcolor);\n\t\t/*box-shadow: inset 0 0 2px var(--border-color);*/\n\t}\n\n`)
customElements.define("c-button",Button)
export class ButtonToggle extends Button{get toggleOn(){const val=this.getAttribute("aria-pressed")
return val==="true"?true:val==="false"?false:val==="mixed"?null:undefined}set toggleOn(val){DOM.setAttr(this,"aria-pressed",val!=null?val.toString():val===undefined?null:"mixed")
this.refresh()}_initialize(init){super._initialize(init)
if(init.toggleOn!==undefined){this.toggleOn=init.toggleOn}else if(!this.hasAttribute("aria-pressed")){this.toggleOn=false}}}customElements.define("c-button-toggle",ButtonToggle)
export class ActionBtn extends Actionable{static buildButton(action,ctx,uiContext,parent){if(!action.isInstantiable(ctx))return null
const r=action.buildCustomButton(ctx,uiContext,parent)
if(r===null)return null
return r||(new ActionBtn).initialize({reg:REG.findReg(parent,ctx),action:action,actionContext:ctx,skin:action.getSkin(ctx),skinOver:action.getSkinOver(ctx),uiContext:uiContext,role:uiContext==="menu"?"menuitem":"button"})}static buildButtons(actions,ctx,uiContext,parent){const r=[]
for(const a of actions){const b=ActionBtn.buildButton(a,ctx,uiContext,parent)
if(b)r.push(b)}return r}static mergeActionablesForBar(reg,groupsOrder,ctx,...list){const id="barActs:"+(list.length===1?list[0]:list.join())
let a=reg.cache.get(id)
if(!a){const actions=ACTION.injectSepByGroup(reg.mergeLists(...list),groupsOrder,ctx)
a=ActionBtn.buildButtons(actions,ctx,"bar")
reg.cache.set(id,a)}return a}get role(){return this.getAttribute("role")}get uiContext(){return this.getAttribute("ui-context")}get label(){if(this.hideLabel)return null
return super.label}set label(val){super.label=val}get title(){if(this.hideLabel)return this._appendAccel(super.label||super.title)
return this.uiContext==="menu"?super.title:this._appendAccel(super.title)}get ariaLabel(){return super.label||super.title}get hideLabel(){return this._hideLabel===undefined?this.uiContext==="bar"&&!!this.icon:this._hideLabel}_appendAccel(text){const accel=this.accel
return accel?text?`${text} (${accel})`:`(${accel})`:text||""}set title(val){super.title=val}get accel(){if(this._accel!=null)return this._accel
if(this._action&&isAccelKeyMgrPointer(this._actionContext)){return this._actionContext.accelKeyMgr.searchAccelText(this._action)}return null}set accel(val){if(this._accel!=val){this._accel=val
this.refresh()}}_initialize(init){const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
sr.appendChild(document.createElement("slot"))
initButtonFromConfig(this,init)
super._initialize(init)
if(init.accel)this._accel=init.accel
this.setAttribute("id",this._action.getId())
if(this._action.isMenu(this._actionContext)){if(this.role==="menuitem"){this.setAttribute("aria-haspopup","true")}else{this.setAttribute("role","menu")}}}_refresh(){super._refresh()
if(this.uiContext==="menu"){const accel=this.accel
if(accel){if(!this._accelElt)this._createAccel()
DOM.setTextContent(this._accelElt,accel)}else if(this._accelElt)DOM.setTextContent(this._accelElt,null)}}_createAccel(){const labelParent=this.shadowRoot.appendChild(JSX.createElement("span",{class:"ctn"}))
if(!this._labelElt)this._createLabel()
labelParent.appendChild(this._labelElt)
this._accelElt=labelParent.appendChild(JSX.createElement("span",{class:"accel"}))}_executeAction(ev){if(this._action&&this._action.isAvailable(this._actionContext)){if(this._action.isMenu(this._actionContext)){const actions=this._action.getDatas("menu",this._actionContext)
if(!this._popupMenu){this._popupMenu=this._createPopup({actions:actions,actionContext:this._actionContext})
this._popupMenu.addEventListener("c-beforeclose",ev=>{if(ev.target===this._popupMenu){this.classList.remove("inSubMenu")}})}else{if(this._popupMenu.contains(ev.target))return
this._popupMenu.actions=actions}this.classList.add("inSubMenu")
this._popupMenu.show(this.uiContext!=="menu"?this:{posFrom:this,fromX:"end",marginX:-5,toleranceY:Number.MAX_SAFE_INTEGER,notAvailableSpace:{posFrom:this,targetX:"end",marginX:5,toleranceY:Number.MAX_SAFE_INTEGER,toleranceX:Number.MAX_SAFE_INTEGER}},this,this)
ev.stopImmediatePropagation()
ev.preventDefault()}else{this._action.execute(this._actionContext,ev)}}this.dispatchEvent(new CustomEvent("c-actioned",{detail:{actionable:this},bubbles:true,composed:true}))}_createPopup(init){return(new PopupActions).initialize(init)}}customElements.define("c-action",ActionBtn)
export class ButtonActions extends Button{get actions(){return this._actions}set actions(actions){this._actions=actions
if(this._popup)this._popup.actions=actions}get actionContext(){return this._actionContext}get popup(){if(!this._popup)this._popup=this._createPopup()
return this._popup}_initialize(init){init.role="menu"
this._actions=init.groupOrder==null?init.actions:ACTION.injectSepByGroup(init.actions,init.groupOrder,this._actionContext)
this._actionContext=init.actionContext||this
super._initialize(init)
if(!this.onclick)this.onclick=function(ev){if(!this.disabled&&(!this._popup||!this._popup.contains(ev.target)))this.openPopup()}}openPopup(){this.popup.show(this,this,this)}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.actionContext=ACTIONABLES.extractActionContextFromDom(this,init)
init.actions=ACTIONABLES.extractActionsFromDom(this,init)
return init}_createPopup(){return this.appendChild((new PopupActions).initialize({actions:this.actions,actionContext:this.actionContext}))}}customElements.define("c-button-actions",ButtonActions)
export class ActionActions extends BaseElement{constructor(){super()
this.actionBtn=new ActionBtn
this.actionsBtn=new ButtonActions}get uiContext(){return this.getAttribute("ui-context")}get lastAsDefault(){return this.hasAttribute("last-as-default")}get actionContext(){return this.actionBtn.actionContext}_initialize(init){if(init.uiContext)this.setAttribute("ui-context",init.uiContext)
if(init.lastAsDefault)this.setAttribute("last-as-default","")
if(!this.hasAttribute("ui-context"))this.setAttribute("ui-context","bar")
DOM.setAttr(this.actionBtn,"action",BASIS.extractAttr(this,"action"))
DOM.setAttr(this.actionsBtn,"actions",BASIS.extractAttr(this,"actions"))
const ctxSvc=BASIS.extractAttr(this,"action-context")
if(ctxSvc){DOM.setAttr(this.actionBtn,"action-context",ctxSvc)
DOM.setAttr(this.actionsBtn,"action-context",ctxSvc)}if(!this.actionBtn.hasAttribute("ui-context"))this.actionBtn.setAttribute("ui-context",this.uiContext==="bar"?"bar":"custom")
if(!this.actionsBtn.hasAttribute("ui-context"))this.actionsBtn.setAttribute("ui-context","custom")
const actionBtnInit=init.actionBtn?Object.create(init.actionBtn):this.actionBtn.buildInitFromAtts()
if(init.actionContext)actionBtnInit.actionContext=init.actionContext
const actionsBtnInit=init.actionsBtn?Object.create(init.actionsBtn):this.actionsBtn.buildInitFromAtts()
if(init.actionContext)actionsBtnInit.actionContext=init.actionContext
this.actionBtn.initialize(actionBtnInit)
this.actionsBtn.initialize(actionsBtnInit)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.localName,init)
sr.appendChild(this.actionBtn)
sr.appendChild(this.actionsBtn)
if(this.lastAsDefault){this.actionsBtn.popup.addEventListener("c-close",ev=>{if(!ev.detail.returnValue)return
const newButton=(new ActionBtn).initialize({action:ev.detail.returnValue,actionContext:this.actionBtn.actionContext,uiContext:this.actionBtn.uiContext,skin:init.skin,skinOver:init.skinOver,tabIndexCustom:this.actionBtn.tabIndexCustom})
this.shadowRoot.insertBefore(newButton,this.actionBtn)
this.actionBtn.remove()
this.actionBtn=newButton})}}_refresh(){super._refresh()
this.actionBtn.refresh()
this.actionsBtn.refresh()}}REG.reg.registerSkin("c-action-actions",1,`\n\t:host {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\ttext-align: center;\n\t\tjustify-content: center;\n\t}\n\n\t:host([ui-context=dialog]) {\n\t\tborder: solid 1px var(--border-color);\n\t\tmargin: .5em;\n\t}\n\n\t:host([ui-context=dialog]) > c-action {\n\t\tpadding: 0.3ex 0.6ex;\n\t\t/* RTL border-inline-end: */\n\t\tborder-inline-end: solid 1px var(--border-color);\n\t}\n\n\t:host([ui-context=dialog]) > c-action[aria-pressed]::before {\n\t\tgrid-area: check;\n\t\tcontent: '✓';\n\t}\n\n\t:host([ui-context=dialog]) > c-action[aria-pressed=false]::before {\n\t\tcolor: transparent;\n\t}\n\n\t:host([ui-context=dialog]) > c-action[aria-pressed=mixed]::before {\n\t\tcolor: var(--fade-color);\n\t}\n\n\tc-action {\n\t\tflex: 1 1;\n\t}\n\n\tc-button-actions {\n\t\tbackground: var(--dropdown-url) no-repeat center / 1em;\n\t\tpadding: .5em;\n\t}\n`)
customElements.define("c-action-actions",ActionActions)
export class RadioBtnsActionable extends ActionableList{_initialize(init){super._initialize(init)
const sr=this.attachShadow(DOMSH.SHADOWDOM_INIT)
this._initAndInstallSkin(this.nodeName,init)
const ctn=sr.appendChild(JSX.createElement("slot",null))}get disabled(){return this.hasAttribute("disabled")}set disabled(val){if(DOM.setAttrBool(this,"disabled",val))this.refreshContent()}_createButton(action){const ctn=this
const ctx=this._actionContext
const buildBtn=(act,prt)=>{if(act.isMenu(ctx)){if(act.isInstantiable(ctx)){const subActions=act.getDatas("menu",ctx)
if((subActions===null||subActions===void 0?void 0:subActions.length)>0){const src=act.getIcon(ctx)
const listElt=JSX.createElement("div",{class:"radioBox"},JSX.createElement("div",{class:"icoLabel"},src?JSX.createElement("img",{src:src,class:"icon"}):undefined,JSX.createElement("span",{class:"label"},act.getLabel(ctx))))
const acionsElt=listElt.appendChild(JSX.createElement("div",{class:"actionsList"}))
const desc=act.getDescription(ctx)
if(desc)listElt.title=desc
subActions.forEach(sub=>acionsElt.append(buildBtn(sub,listElt)))
return listElt}}return null}return ActionBtn.buildButton(new ActionWrapper(act.getId()).setSkinOver("c-radios-actions-action").setOverridenSvc(act).override("isEnabled",(function(ctx){if(ctn.disabled)return false
return this.getWrapped(ctx).isEnabled(ctx)})),ctx,ctn.uiContext,prt)}
return buildBtn(action,this)}}customElements.define("c-radios-actions",RadioBtnsActionable)
REG.reg.registerSkin("c-radios-actions",1,`\n\t/* Séparateur */\n\t::slotted(hr) {\n\t\tdisplay: none;\n\t}\n`)
REG.reg.registerSkin("c-radios-actions-action",1,`\n\t:host([aria-pressed])::before,\n\t:host(.unknlownValue)::before {\n\t\tcontent: '';\n\t\twidth: 1.5em;\n\t}\n\n\t:host([aria-pressed=true])::before,\n\t:host(.unknlownValue)::before {\n\t\tcontent: '✓';\n\t}\n\n\t:host(.unknlownValue) {\n\t\tcolor: var(--error-color);\n\t}\n\n\t:host(.unknlownValue[disabled]) {\n\t\topacity: 1;\n\t}\n\n`)

//# sourceMappingURL=buttons.js.map