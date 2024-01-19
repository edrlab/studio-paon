import{ActionableList,ACTIONABLES,IS_ActionableEnabled}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/actionables.js"
import{BaseElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ActionBtn}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/buttons.js"
import{ACTION,Action}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{isRefreshHook}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{DEBUG_TOOLTIP,EPopupType,findPopupableParent as findPopupableParentImp,IS_Popupable,MxPopupable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/popupable.js"
import{GridSmall}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-tags.js"
import{GridColDef}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-core.js"
import{GridDataHolderJsonArray}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/widgets/grid-libs.js"
export class PopupMenu extends(MxPopupable(BaseElement,EPopupType.menu)){_initialize(init){super._initialize(init)
if("restoreFocus"in init)this.restoreFocus=init.restoreFocus}show(anchor,uiContainer,logicalParent){this._restoreFocus=this.restoreFocus
return super.show(anchor,uiContainer,logicalParent)}}REG.reg.registerSkin("c-popup-menu",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t}\n\n\t::slotted([role=menu][slot=subPopup]) {\n\t\tpointer-events: none;\n\t}\n\n\t#content {\n\t\tbackground-color: var(--row-bgcolor);\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t}\n`)
customElements.define("c-popup-menu",PopupMenu)
export class PopupActions extends(MxPopupable(ActionableList,EPopupType.menu)){get headTitle(){return this.getAttribute("head-title")}_initialize(init){super._initialize(init)
if("headTitle"in init)this.setAttribute("head-title",init.headTitle)
if("restoreFocus"in init)this.restoreFocus=init.restoreFocus
if("headBuilder"in init)this.headBuilder=init.headBuilder
this.addEventListener("c-actioned",(function(ev){const actionable=ev.detail.actionable
if(!actionable.action.isMenu(actionable.actionContext)){this.close(actionable.action)}}))
this.addEventListener("pointerover",(function(ev){const target=ev.target
if(IS_ActionableEnabled(target)&&target.parentNode==this){target.focus()
for(const subPopup of this._subPopupSlot.assignedNodes()){subPopup.close()}window.addEventListener("pointermove",()=>{if(target.action.isMenu(target.actionContext)){const openTimeout=setTimeout(()=>target.click(),300)
this.addEventListener("pointerout",()=>clearTimeout(openTimeout),{once:true})}},{once:true})}}))}onKeyDown(ev){if(ACTION.isAnyControlPressed(ev))return false
let next
switch(ev.key){case"ArrowDown":if(ev.target===this){next=DOM.findFirstChild(ev.target,IS_ActionableEnabled)}else{next=DOM.findNextSibling(ev.target,IS_ActionableEnabled)}break
case"ArrowUp":if(ev.target===this){next=DOM.findLastChild(ev.target,IS_ActionableEnabled)}else{next=DOM.findPreviousSibling(ev.target,IS_ActionableEnabled)}break
case"ArrowLeft":if(this.parentPopup){ev.preventDefault()
ev.stopImmediatePropagation()
this.close()
return true}break
case"ArrowRight":const actionBtn=ev.target
if(IS_ActionableEnabled(actionBtn)&&actionBtn.action.isMenu(actionBtn.actionContext)){ev.preventDefault()
ev.stopImmediatePropagation()
actionBtn.click()
return true}break}if(next){next.focus()
ev.preventDefault()
ev.stopImmediatePropagation()
return true}return false}show(anchor,uiContainer,logicalParent){if(isRefreshHook(this._actionContext)&&this._actionContext.onRefreshCycle(true)==="stop")return
try{if(this._buildMenu()===0)return false
return super.show(anchor,uiContainer,logicalParent)}finally{if(isRefreshHook(this._actionContext))this._actionContext.onRefreshCycle(false)}}onViewHidden(){super.onViewHidden()
this.textContent=null}_refresh(){}_buildMenu(){this.textContent=null
if(this.headBuilder)this.headBuilder(this.appendChild(JSX.createElement("h5",null)))
else if(this.headTitle)this.appendChild(JSX.createElement("h5",null,this.headTitle))
let needCheckSpace=false
let count=0
if(this._actions)for(let i=0;i<this._actions.length;i++){const action=this._actions[i]
if(!action.isVisible(this._actionContext))continue
const menuItem=ActionBtn.buildButton(action,this._actionContext,"menu",this)
if(menuItem){if(needCheckSpace){if(!action.isToggle(this._actionContext))menuItem.setAttribute("check-space","")}else if(action.isToggle(this._actionContext)){needCheckSpace=true
for(let prev=this.firstElementChild;prev;prev=prev.nextElementSibling){prev.setAttribute("check-space","")}}this.appendChild(menuItem)
count++}}ACTIONABLES.cleanupDoubleSep(this)
return count}}REG.reg.registerSkin("c-popup-actions",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t}\n\n\t::slotted([role=menu][slot=subPopup]) {\n\t\tpointer-events: none;\n\t}\n\n\t:host(.hideIcons) {\n\t\t--icon-size: 0;\n\t}\n\n\t#content {\n\t\tbackground-color: var(--row-bgcolor);\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t\toverflow: scroll;\n\t\t/* Firefox */\n\t\tscrollbar-width: none;\n\t}\n\n\t#content::-webkit-scrollbar {\n\t\tdisplay: none;\n\t}\n\n\t::slotted(hr) {\n\t\tborder: none;\n\t\tborder-top: 1px solid var(--border-color);\n\t\twidth: 100%;\n\t\tmargin: .3em 0 !important;\n\t\theight: 1px; /* sinon border-top parfois non dessiné - chrome79 */\n\t}\n\n\t::slotted(h5) {\n\t\tmargin: 0;\n\t\tpadding: .3em .1em;\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n`)
customElements.define("c-popup-actions",PopupActions)
export class PopupDialog extends(MxPopupable(BaseElement,EPopupType.dialog)){_initialize(init){super._initialize(init)
this.closeOnCtrlEnter=init.closeOnCtrlEnter}onKeyDown(ev){if(this.closeOnCtrlEnter&&ev.key==="Enter"&&ACTION.isAccelPressed(ev)){ev.preventDefault()
ev.stopImmediatePropagation()
this.tryClose()
return true}return false}}REG.reg.registerSkin("c-popup-dialog",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t\tbackground-color: rgba(128, 128, 128, .4);\n\t}\n\n\t#content {\n\t\tborder: 2px solid var(--dialog-bgcolor);\n\t\tborder-radius: 5px;\n\t\tbox-shadow: 1px 1px 4px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\tmin-height: 6em;\n\t\tmin-width: 12em;\n\t}\n\n\t:focus-visible {\n\t\toutline: var(--focus-outline);\n\t}\n\n\t#body {\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tflex: 1;\n\t}\n`)
customElements.define("c-popup-dialog",PopupDialog)
export class PopupFloating extends(MxPopupable(BaseElement,EPopupType.floating)){_initialize(init){if(init.closeOnBlur){this.closeOnBlur=true
this.addEventListener("focusout",this.onFocusout)
this.tabIndex=0}super._initialize(init)}onFocusout(ev){if(!ev.relatedTarget||!(ev.relatedTarget instanceof Node)||!DOMSH.isFlatAncestor(this,ev.relatedTarget))this.close()}onViewShown(){this.focus()
super.onViewShown()}}REG.reg.registerSkin("c-popup-floating",1,`\n\t#body {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t}\n\n\t#content {\n\t\tbox-sizing: border-box;\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n`)
customElements.define("c-popup-floating",PopupFloating)
export class PopupProgress extends PopupFloating{get progressCallback(){return this.onProgress.bind(this)}onProgress(done,total){if(total>0&&done<total){this.prg.max=total
this.prg.value=done}else{this.prg.max=1
this.prg.removeAttribute("value")}}_initialize(init){super._initialize(init)
this.prg=document.createElement("progress")
this.shadowRoot.getElementById("content").appendChild(this.prg)}}REG.reg.registerSkin("c-popup-progress",1,`\n\t#content {\n\t\tbox-sizing: border-box;\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t}\n\n\tprogress {\n\t\tflex: 1;\n\t\twidth: auto;\n\t\tmargin: 0 .5em;\n\t}\n`)
customElements.define("c-popup-progress",PopupProgress)
export class PopupNotif extends(MxPopupable(BaseElement,EPopupType.floating)){get level(){return this.getAttribute("level")}get kind(){return this.getAttribute("kind")}set kind(k){DOM.setAttr(this,"kind",k)}_initialize(init){super._initialize(init)
if(init.level)this.setAttribute("level",init.level)
if(init.kind)this.setAttribute("kind",init.kind)
this.autoHide=init.autoHide==undefined?null:init.autoHide
this.contentRoot.insertBefore(JSX.createElement("span",{id:"kind"}),this.contentRoot.firstChild)
if(init.classes)this.setAttribute("class",init.classes)
if(!init.noCloseBtn){const btn=this.contentRoot.appendChild(JSX.createElement("c-button",{title:"Fermer cette notification","tabindex-custom":"-1"}))
btn.onclick=function(ev){DOMSH.findHost(ev.target).tryClose()}
btn.tabIndexCustom=-1}}setContent(ct){if(this._contentNode)this._contentNode.remove()
if(typeof ct==="string"){this._contentNode=this.appendChild(JSX.createElement("div",{class:"msg"},ct))
this._autoHide=this.autoHide==null?2e3+ct.length*20:this.autoHide
if(this.opened)this.planifHide()}else{this._contentNode=this.appendChild(ct)
this._autoHide=this.autoHide==null?2e3+ct.textContent.length*20:this.autoHide
if(this.opened)this.planifHide()}return this}show(anchor,uiContainer,logicalParent){if(super.show(anchor||{viewPortX:"middle",viewPortY:"bottom",viewPortPadding:10},logicalParent)){this.planifHide()
return true}return false}close(){if(super.close()){DOM.setStyle(this,"max-width",null)
return true}return false}planifHide(){if(this._timeout)clearTimeout(this._timeout)
if(this._autoHide>0)this._timeout=setTimeout(this.close.bind(this),this._autoHide)}}REG.reg.registerSkin("c-popup-notif",1,`\n\t#content {\n\t\tflex-direction: row;\n\t\talign-items: center;\n\t\tborder: solid 1px var(--border-color);\n\t\tborder-radius: 4px;\n\t\tbox-shadow: 1px 1px 5px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\tpadding: 1em;\n\t\tmargin-inline-end: .55em;\n\t\tz-index: 51;\n\t}\n\n\t:host(.hover) > #content {\n\t\tpadding: .2em;\n\t\topacity: .8;\n\t\tbox-shadow: none;\n\t}\n\n\t:host([level='medium']) #content {\n\t\tz-index: 52;\n\t}\n\n\t:host([level='major']) #content {\n\t\tz-index: 53;\n\t}\n\n\t:host([kind='info']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/info.svg);\n\t}\n\n\t:host([kind='warning']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/warning.svg);\n\t}\n\n\t:host([kind='error']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/error.svg);\n\t}\n\n\t:host([kind='forbidden']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/forbidden.svg);\n\t}\n\n\n\tc-button {\n\t\tposition: absolute;\n\t\ttop: -.5rem;\n\t\tright: -.5rem;\n\t\tborder: 1px solid var(--border-color);\n\t\tborder-radius: .3rem;\n\t\tbox-sizing: border-box;\n\t\twidth: 1.3rem;\n\t\theight: 1.3rem;\n\t\tbackground: center / .8rem no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/icons/close.svg) var(--bgcolor);\n\t}\n\n\t::slotted(.msg) {\n\t\ttext-align: center;\n\t\tuser-select: none;\n\t\twhite-space: pre-wrap;\n\t}\n\n\t/* Pour c-popup-notif-actions. */\n\tslot[name=actions] > *:not([hidden]) {\n\t\tdisplay: block;\n\t\torder: 1;\n\t}\n`)
customElements.define("c-popup-notif",PopupNotif)
export class PopupNotifActions extends PopupNotif{_initialize(init){init.skin="c-popup-notif"
super._initialize(init)
const actionsBar=this.contentRoot.appendChild(JSX.createElement("slot",{name:"actions"}))
for(const action of init.actions){const button=ActionBtn.buildButton(action,init.actionContext,"dialog",actionsBar)
actionsBar.appendChild(button)}return this}}customElements.define("c-popup-notif-actions",PopupNotifActions)
export function isTooltipPointer(n){return n&&n.popupTooltip!=null}export class PopupTooltip extends(MxPopupable(BaseElement,EPopupType.tooltip)){get hoverAllowed(){return this.hasAttribute("hover-allowed")}detachTooltip(){if(this.tooltipOf){this.tooltipOf.removeEventListener("pointerenter",this._lstn)
this.tooltipOf.removeEventListener("pointerleave",this._lstn)
this.tooltipOf.removeEventListener("pointercancel",this._lstn)
this.close()
if(this.tooltipOf.popupTooltip===this)this.tooltipOf.popupTooltip=null
this.tooltipOf=null}}_initialize(init){super._initialize(init)
if(init.hoverAllowed)this.setAttribute("hover-allowed","")
if(init.anchor)this.anchor=init.anchor
this.tooltipOf=init.tooltipOf?init.tooltipOf:DOMSH.getFlatParentElt(this)
if(this.tooltipOf.popupTooltip)this.tooltipOf.popupTooltip.detachTooltip()
this.tooltipOf.popupTooltip=this
this._lstn=ev=>{if(this._timer){window.clearTimeout(this._timer)
this._timer=0}if(ev.type==="pointerenter"){this._timer=window.setTimeout(()=>{this._timer=0
if(this.tooltipOf&&this.tooltipOf.isConnected)this.show(this.anchor||this.tooltipOf,this.tooltipOf)},POPUP.TOOLTIP_retarder)}else{if(this.hoverAllowed){if(ev.currentTarget===this.contentRoot){const x=ev.clientX,y=ev.clientY
const r=this.tooltipOf.getBoundingClientRect()
if(Math.floor(r.left)<=x+1&&Math.ceil(r.right)>=x-1&&Math.floor(r.top)<=y+1&&Math.ceil(r.bottom)>=y-1)return}let tooltip=this
do{if(DOMSH.isFlatAncestor(tooltip,ev.relatedTarget))break
const parent=tooltip.parentElement
tooltip.close()
tooltip=IS_Popupable(parent)&&parent.popupType===EPopupType.tooltip&&parent}while(tooltip)}else{this.close()}}}
this.tooltipOf.addEventListener("pointerenter",this._lstn)
if(!DEBUG_TOOLTIP){this.tooltipOf.addEventListener("pointerleave",this._lstn)
this.tooltipOf.addEventListener("pointercancel",this._lstn)
if(this.hoverAllowed){this.contentRoot.addEventListener("pointerleave",this._lstn)
this.contentRoot.addEventListener("pointercancel",this._lstn)}}}show(anchor,uiContainer,logicalParent){const shown=super.show(anchor,uiContainer,logicalParent)
if(shown&&this.tooltipOf&&!this._checkOwner){if(!this._checkOwnerFct){this._checkOwnerFct=()=>{if(!this.tooltipOf.isConnected)this.close()}}this._checkOwner=setInterval(this._checkOwnerFct,250)}return shown}close(returnValue){if(this._checkOwner){clearInterval(this._checkOwner)
this._checkOwner=0}return super.close(returnValue)}forwardPointerEnter(ev){this._lstn.call(this.tooltipOf,ev)}}REG.reg.registerSkin("c-popup-tooltip",1,`\n\t#content {\n\t\tdisplay: block;\n\t\tborder: solid 1px var(--tooltip-border-color, #fcffc8);\n\t\tborder-radius: 3px;\n\t\tbox-shadow: 1px 1px 2px var(--fade-color);\n\t\tbackground-color: var(--tooltip-bgcolor, #feffe5);\n\t\tz-index: 101;\n\t\tuser-select: none;\n\t}\n`)
customElements.define("c-popup-tooltip",PopupTooltip)
export class PopupAutoComplete extends(MxPopupable(BaseElement,EPopupType.tooltip)){constructor(){super(...arguments)
this._data=new GridDataHolderJsonArray}get entries(){return this._data.getDatas()}set entries(val){this._data.setDatas(val)}_initialize(init){super._initialize(init)
this._grid=this.contentRoot.appendChild((new GridSmall).initialize({selType:"monoOver",columnDefs:[new GridColDef("main").setFlex("1rem",1,1).setCellBuilder(init.cellBuilder)],dataHolder:this._data,hideHeaders:true,skinOver:"c-popup-autocomplete/grid",defaultAction:(new Action).setExecute(self=>{const selection=self._data.getSelectedDatas()
if(selection.length)this.close(selection[0])}),defaultActionCtx:this,defaultActionOn:"mousedown",skinScroll:"scroll/small"}))
this._grid.removeAttribute("tabindex")
this.entries=init.entries||[]}static createFromInputEvent(createOpts,popupInit){return new Promise(resolve=>{const{input:input}=createOpts
let popup
function create(ev){if(popup)return
popup=(new PopupAutoComplete).initialize(popupInit)
resolve(popup)
find(true,ev)
return popup}function find(newSession,ev){createOpts.finder.findAutoComplete(newSession,ev).then(entries=>{if(entries==null)return
if(entries.length){popup.entries=entries
popup.show({elem:createOpts.finder.autoCompleteAnchor||input},input)
if(createOpts.autoSelOnShow)popup._grid.setSelectedRows(0)}else{popup.close()}})}function onInput(ev){if(!create(ev))find(false,ev)}function prevent(ev){ev.preventDefault()
ev.stopPropagation()}function onKeyDown(ev){if(ev.key==="Enter"&&ev.altKey){prevent(ev)
if(!create(ev))find(false,ev)}else if(popup===null||popup===void 0?void 0:popup.opened){const{_grid:grid}=popup
let selected=grid.getSelectedRow()
if(ev.key==="ArrowDown"){prevent(ev)
if(selected===undefined)selected=-1
if(++selected<popup.entries.length){grid.setSelectedRows(selected)
grid.ensureRowVisible(selected)}}else if(ev.key==="ArrowUp"){prevent(ev)
if(selected!==undefined){if(--selected>=0){grid.setSelectedRows(selected)
grid.ensureRowVisible(selected)}else grid.setSelectedRows(-1)}}else if(ev.key==="Enter"){if(selected!==undefined)ACTION.doOnEvent(grid.defaultAction.execute(grid.defaultActionCtx,ev),ev)}else if(ev.key==="Escape"){prevent(ev)
popup.close()}}}input.addEventListener("input",onInput)
document.addEventListener("selectionchange",onInput)
input.addEventListener("dblclick",create,{once:true})
input.addEventListener("keydown",onKeyDown)
input.addEventListener("focusout",()=>{input.removeEventListener("input",onInput)
document.removeEventListener("selectionchange",onInput)
input.removeEventListener("dblclick",create)
input.removeEventListener("keydown",onKeyDown)},{once:true})})}}REG.reg.registerSkin("c-popup-autocomplete",1,`\n\t#content {\n\t\tdisplay: block;\n\t\tborder: solid 1px var(--tooltip-border-color);\n\t\tborder-radius: 3px;\n\t\tbox-shadow: 1px 1px 2px var(--fade-color);\n\t\tz-index: 101;\n\t\tuser-select: none;\n\t\t--row-bgcolor: var(--tooltip-bgcolor);\n\t\t--row-inSel-unfocus-bgcolor: var(--row-inSel-bgcolor);\n\t}\n`)
REG.reg.registerSkin("c-popup-autocomplete/grid",1,`\n\t:host {\n\t\tborder: none;\n\t\tmax-height: 16em;\n\t\tmax-width: 16em;\n\t}\n`)
customElements.define("c-popup-autocomplete",PopupAutoComplete)
export class PopupConfirm extends(MxPopupable(BaseElement,EPopupType.dialog)){get kind(){return this.getAttribute("kind")}set kind(k){DOM.setAttr(this,"kind",k)}_initialize(init){super._initialize(init)
this.findReg(init).installSkin("webzone:panel",this.shadowRoot)
if(init.kind)this.setAttribute("kind",init.kind)
this.contentRoot.appendChild(JSX.createElement("slot",{name:"details"}))
const actionsBar=this.contentRoot.appendChild(JSX.createElement("slot",{name:"actions"}))
this.okButton=actionsBar.appendChild(JSX.createElement("c-button",{"ui-context":"dialog",label:init.okLbl||(init.cancelLbl!==null?"OK":"Fermer"),class:"default",onclick:this.onOK}))
if(init.cancelLbl!==null)this.cancelButton=actionsBar.appendChild(JSX.createElement("c-button",{"ui-context":"dialog",label:init.cancelLbl||"Annuler",onclick:this.onCancel}))
this.onkeypress=this.onKeyPress}_builBodySlot(){this._bodySlot=JSX.createElement("slot",{id:"body"})
this.contentRoot.appendChild(JSX.createElement("div",{id:"msgBox"},JSX.createElement("span",{id:"kind"}),this._bodySlot))}setContent(ct){if(this._contentNode)this._contentNode.remove()
if(typeof ct==="string"){this._contentNode=this.appendChild(JSX.createElement("div",{class:"msg"},ct))}else{this._contentNode=this.appendChild(ct)}return this}onOK(){DOMSH.findHost(this).tryClose(true)}onCancel(){DOMSH.findHost(this).tryClose(false)}onKeyPress(ev){if(ev.key==="Enter")this.tryClose(true)
else if(ev.key==="Escape")this.tryClose(false)}}REG.reg.registerSkin("c-popup-confirm",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t\tbackground-color: rgba(0, 0, 0, .5);\n\t\tz-index: 1011;\n\t}\n\n\t#content {\n\t\tborder: 2px solid var(--dialog-bgcolor);\n\t\tbox-shadow: 1px 1px 4px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\tborder-radius: 5px;\n\t}\n\n\t#msgBox {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t}\n\n\t#body {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tmargin: .5em;\n\t}\n\n\t:host([kind='question']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/question.svg);\n\t}\n\n\t:host([kind='info']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/info.svg);\n\t}\n\n\t:host([kind='warning']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/warning.svg);\n\t}\n\n\t:host([kind='error']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/error.svg);\n\t}\n\n\t:host([kind='forbidden']) #kind {\n\t\tmin-width: 1.5em;\n\t\tmin-height: 1.5em;\n\t\tmargin: .5em;\n\t\tbackground: center no-repeat url(https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wsk/6.1.10.202401191026/commons/widgets/popupable/forbidden.svg);\n\t}\n\n\t::slotted([slot=details]) {\n\t\tdisplay: block;\n\t\tmargin: .5em 2em;\n\t}\n\n\tslot[name=actions] {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t}\n\n\tslot[name=actions] > c-button {\n\t\tmargin: 1em .5em;\n\t}\n`)
customElements.define("c-popup-confirm",PopupConfirm)
export class PopupPrompt extends(MxPopupable(BaseElement,EPopupType.dialog)){_initialize(init){super._initialize(init)
this._inputRequired=init.inputRequired
this.contentRoot.appendChild(JSX.createElement("slot",{name:"details"}))
const actionsBar=this.contentRoot.appendChild(JSX.createElement("slot",{name:"actions"}))
this.okButton=actionsBar.appendChild(JSX.createElement("c-button",{"ui-context":"dialog",label:init.okLbl||"OK",class:"default",onclick:this.onOK}))
this.cancelButton=actionsBar.appendChild(JSX.createElement("c-button",{"ui-context":"dialog",label:init.cancelLbl||"Annuler",onclick:this.onCancel}))
this.onkeypress=this.onKeyPress}setContent(ct){if(this._contentNode)this._contentNode.remove()
if(typeof ct==="string"){this._contentNode=this.appendChild(JSX.createElement("div",{class:"content"},JSX.createElement("div",{class:"msg"},ct),JSX.createElement("input",{required:this._inputRequired?"":undefined})))}else{this._contentNode=this.appendChild(ct)}return this}onOK(){const self=DOMSH.findHost(this)
const input=self.querySelector("input")
if(input.reportValidity()){self.tryClose(input.value)}}onCancel(){DOMSH.findHost(this).tryClose()}onKeyPress(ev){if(ev.key==="Enter")this.onOK.call(this.okButton)
else if(ev.key==="Escape")this.tryClose()}}REG.reg.registerSkin("c-popup-prompt",1,`\n\t:host([opened]) {\n\t\tpointer-events: auto;\n\t\tbackground-color: rgba(0, 0, 0, .5);\n\t}\n\n\t#content {\n\t\tborder: 2px solid var(--dialog-bgcolor);\n\t\tbox-shadow: 1px 1px 4px var(--fade-color);\n\t\tbackground-color: var(--bgcolor);\n\t\tcolor: var(--color);\n\t\tborder-radius: 5px;\n\t\tmin-width: 5em;\n\t\tmin-height: 2em;\n\t}\n\n\t#body {\n\t\tflex: 1;\n\t\tdisplay: flex;\n\t\tmin-height: 0;\n\t\tmin-width: 0;\n\t\tflex-direction: column;\n\t\toverflow: auto;\n\t\tmargin: .5em;\n\t}\n\n\t::slotted(.content) {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmin-width: 0;\n\t\tmin-height: 5em;\n\t\tjustify-content: space-evenly;\n\t}\n\n\t::slotted(.content) > * {\n\t\tmargin: 0.5em 0;\n\t}\n\n\t::slotted([slot=details]) {\n\t\tdisplay: block;\n\t\tmargin: .5em 2em;\n\t}\n\n\tslot[name=actions] {\n\t\tdisplay: flex;\n\t\tmin-height: min-content;\n\t\tmin-width: 0;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-end;\n\t}\n\n\tslot[name=actions] > c-button {\n\t\tmargin: 1em .5em;\n\t}\n`)
customElements.define("c-popup-prompt",PopupPrompt)
export var POPUP;(function(POPUP){async function confirm(msg,from,options){if(!options)options={}
if(!("kind"in options))options.kind=options.cancelLbl!==null?"question":"info"
const popup=(new PopupConfirm).initialize(options)
popup.setContent(msg)
popup.show({viewPortX:"middle",viewPortY:"1/3"},from)
return popup.onNextClose()}POPUP.confirm=confirm
async function confirmCheck(msg,from,checkLbl,checkSt,options){if(!options)options={}
if(!("kind"in options))options.kind=options.cancelLbl!==null?"question":"info"
const popup=(new PopupConfirm).initialize(options)
popup.setContent(msg)
const input=JSX.createElement("input",{type:"checkbox",checked:checkSt})
input.checked=checkSt
popup.appendChild(JSX.createElement("label",{slot:"details"},input,JSX.createElement("span",null,checkLbl)))
popup.show({viewPortX:"middle",viewPortY:"1/3"},from)
const result=await popup.onNextClose()
if(result)return input.checked?"checked":"unchecked"
else return false}POPUP.confirmCheck=confirmCheck
function showPopupActions(init,anchor,from){if(!init.actions||init.actions.length===0)return Promise.resolve(null)
const popupMenu=(new PopupActions).initialize(init)
popupMenu.show(anchor,from)
return new Promise(resolve=>{popupMenu.addEventListener("c-close",ev=>{resolve(ev.detail.returnValue)})})}POPUP.showPopupActions=showPopupActions
async function prompt(msg,from,options){const popup=(new PopupPrompt).initialize(options)
popup.setContent(msg)
popup.show({viewPortX:"middle",viewPortY:"1/3"},from)
return popup.onNextClose()}POPUP.prompt=prompt
function showPopupActionsFromEvent(init,ev,fromContext){if(ev instanceof MouseEvent&&ev.pageX>0&&ev.pageY>0){return showPopupActions(init,{initX:ev.pageX,initY:ev.pageY},fromContext||ev.target)}else if(ev instanceof Event){return showPopupActions(init,fromContext||ev.target,fromContext||ev.target)}else{return showPopupActions(init,ev,fromContext||ev)}}POPUP.showPopupActionsFromEvent=showPopupActionsFromEvent
function showDialog(content,from,init){if(!init)init={}
const dialog=(new PopupDialog).initialize(init)
dialog.usedOnce=true
dialog.appendChild(content)
if(!init.viewPortY)init.viewPortY="1/3"
if(!("fixSize"in init))init.fixSize=true
dialog.show(init,from)
return dialog}POPUP.showDialog=showDialog
function showNotif(content,from,init,anchor){if(!init)init={}
const notif="actions"in init?new PopupNotifActions:new PopupNotif
if("actions"in init&&!("autoHide"in init))init.autoHide=0
notif.initialize(init)
notif.usedOnce=true
notif.setContent(content)
notif.show(anchor,from)
return notif}POPUP.showNotif=showNotif
function showNotifInfo(content,from,init,anchor){if(init)init.kind="info"
else init={kind:"info"}
return showNotif(content,from,init,anchor)}POPUP.showNotifInfo=showNotifInfo
function showNotifWarning(content,from,init,anchor){if(init)init.kind="warning"
else init={kind:"warning"}
return showNotif(content,from,init,anchor)}POPUP.showNotifWarning=showNotifWarning
function showNotifError(content,from,init,anchor){if(init)init.kind="error"
else init={kind:"error"}
return showNotif(content,from,init,anchor)}POPUP.showNotifError=showNotifError
function showNotifForbidden(content,from,init,anchor){if(init)init.kind="forbidden"
else init={kind:"forbidden"}
return showNotif(content,from,init,anchor)}POPUP.showNotifForbidden=showNotifForbidden
function showFloating(content,anchor,fromContext,init){const popup=(new PopupFloating).initialize(init||{})
popup.usedOnce=true
popup.appendChild(typeof content==="function"?content(popup):content)
if(!("fixSize"in anchor)&&!(anchor instanceof HTMLElement))anchor.fixSize=true
popup.show(anchor,fromContext)
return popup}POPUP.showFloating=showFloating
function showProgress(fromContext,title,anchor){const popup=(new PopupProgress).initialize({titleBar:{barLabel:{label:title}}})
popup.usedOnce=true
if(!anchor)anchor={viewPortX:"end",viewPortY:"top",initWidth:"20em",initHeight:"4em"}
if(!("fixSize"in anchor)&&!(anchor instanceof HTMLElement))anchor.fixSize=true
popup.show(anchor,fromContext,null)
return popup}POPUP.showProgress=showProgress
function showFloatingFromEvent(content,ev,fromContext,init,initSize){const anchor=initSize?initSize:{}
if(ev instanceof MouseEvent&&ev.pageX>0&&ev.pageY>0){anchor.initX=ev.pageX
anchor.initY=ev.pageY
return showFloating(content,anchor,fromContext||ev.target,init)}else if(ev instanceof Event){anchor.elem=fromContext||ev.target
return showFloating(content,anchor,fromContext||ev.target,init)}else{anchor.elem=ev
return showFloating(content,anchor,fromContext||ev,init)}}POPUP.showFloatingFromEvent=showFloatingFromEvent
function showMenu(content,anchor,fromContext,init){if(init&&init.titleBar&&typeof init.titleBar!=="string"&&!("closeButton"in init.titleBar))init.titleBar.closeButton=null
const dialog=(new PopupMenu).initialize(init)
dialog.usedOnce=true
dialog.appendChild(content)
dialog.show(anchor,fromContext)
return dialog}POPUP.showMenu=showMenu
function showMenuFromEvent(content,ev,fromContext,init,initSize){const anchor=initSize?initSize:{}
if(ev instanceof MouseEvent&&ev.pageX>0&&ev.pageY>0){anchor.initX=ev.pageX
anchor.initY=ev.pageY
return showMenu(content,anchor,fromContext||ev.target,init)}else if(ev instanceof Event){anchor.elem=fromContext||ev.target
return showMenu(content,anchor,fromContext||ev.target,init)}else{anchor.elem=ev
return showMenu(content,anchor,fromContext||ev,init)}}POPUP.showMenuFromEvent=showMenuFromEvent
function attachTooltip(owner,content){const tooltip=(new PopupTooltip).initialize({tooltipOf:owner})
if(content)tooltip.appendChild(content)
return tooltip}POPUP.attachTooltip=attachTooltip
function promiseTooltip(owner,contentBd,init){return mouseOverRetarderCaller(owner,true,async()=>{if(!owner.isConnected)return
if(!init)init={tooltipOf:owner}
else{init=Object.create(init)
init.tooltipOf=owner}const tooltip=(new PopupTooltip).initialize(init)
const ct=await contentBd(owner,tooltip)
if(!ct||!owner.isConnected)return
tooltip.appendChild(ct)
tooltip.show(init.anchor||owner,owner)
return tooltip})}POPUP.promiseTooltip=promiseTooltip
function mouseOverRetarderCaller(overElt,doOnce,cb){let timer
const executor=function(){if(timer){window.clearTimeout(timer)
timer=0}if(doOnce){overElt.removeEventListener("pointerenter",lstn)
overElt.removeEventListener("pointerleave",lstn)
overElt.removeEventListener("pointercancel",lstn)}return cb()}
const lstn=function(ev){if(timer){window.clearTimeout(timer)
timer=0}if(ev.type==="pointerenter")timer=window.setTimeout(executor,POPUP.TOOLTIP_retarder)}
overElt.addEventListener("pointerenter",lstn)
overElt.addEventListener("pointerleave",lstn)
overElt.addEventListener("pointercancel",lstn)
return executor}POPUP.mouseOverRetarderCaller=mouseOverRetarderCaller
async function closeAllPopup(logicalRoot){for(const child of Array.from(document.body.children)){if(IS_Popupable(child)&&DOMSH.isLogicalFlatAncestor(logicalRoot,child)){if(!await child.tryClose())return false}}return true}POPUP.closeAllPopup=closeAllPopup
POPUP.findPopupableParent=findPopupableParentImp
POPUP.TOOLTIP_retarder=800})(POPUP||(POPUP={}))

//# sourceMappingURL=popups.js.map