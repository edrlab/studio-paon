import{BaseElement,BASIS,isEltRefreshable}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{ACTION}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/actions.js"
import{isRefreshHook}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
export class Actionable extends BaseElement{get icon(){if(this._icon)return this._icon
if(this._action)return this._action.getIcon(this._actionContext)
return null}set icon(val){if(this._icon!==val){this._icon=val
this.refresh()}}get label(){if(this._label!=null)return this._label
if(this._action)return this._action.getLabel(this._actionContext)
return null}set label(val){if(this._label!=val){this._label=val
this.refresh()}}get title(){if(this._title!=null)return this._title
if(this._action)return this._action.getDescription(this._actionContext)
return null}set title(val){if(this._title!=val){this._title=val
this.refresh()}}get ariaLabel(){if(this._ariaLabel!=null)return this._ariaLabel
const label=this.label
return label||this.title}set ariaLabel(val){if(this._ariaLabel!=val){this._ariaLabel=val
this.refresh()}}get disabled(){if(this._disabled!=null)return this._disabled
if(this._action)return!this._action.isEnabled(this._actionContext)
return false}set disabled(val){if(this._disabled!==val){this._disabled=val
this.refresh()}}get hidden(){if(this._hidden!=null)return this._hidden
if(this._action)return!this._action.isVisible(this._actionContext)
return true}set hidden(val){if(this._hidden!==val){this._hidden=val
this.refresh()}}get action(){return this._action}get actionContext(){return this._actionContext}get toggleOn(){if(!this._action||!this._action.isToggle(this._actionContext))return undefined
return this._action.getDatas("toggle",this._actionContext)}_initialize(init){BASIS.makeClickable(this)
this._icon=init.icon
this._label=init.label
this._title=init.title
this._disabled=init.disabled
this._hidden=init.hidden
this.tabIndexCustom=init.tabIndexCustom||0
this._action=init.action
this._actionContext=init.actionContext
this._action.initButtonNode(this,this._actionContext)
if(!this.onclick){this.onclick=this._executeAction}}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.actionContext=ACTIONABLES.extractActionContextFromDom(this,init)
init.action=ACTIONABLES.extractActionFromDom(this,init)
if(this.hasAttribute("tabindex-custom"))init.tabIndexCustom=BASIS.extractAttrAsNumber(this,"tabindex-custom",0)
if(this.hasAttribute("label"))init.label=BASIS.extractAttr(this,"label")
if(this.hasAttribute("icon"))init.icon=BASIS.extractAttr(this,"icon")
if(this.hasAttribute("disabled"))init.disabled=this.getAttribute("disabled")!=="false"
if(this.hasAttribute("hidden"))init.hidden=this.getAttribute("hidden")!=="false"
return init}resetAction(action,ctx){this._action=action
this._actionContext=ctx
this.refresh()}_executeAction(ev){if(this._action.isAvailable(this._actionContext))this.dispatchEvent(new CustomEvent("c-actioned",{detail:{actionable:this},bubbles:true,composed:true}))}_createIcon(){this._iconElt=this.shadowRoot.appendChild(JSX.createElement("span",{class:"icon"}))}_createLabel(){this._labelElt=this.shadowRoot.appendChild(JSX.createElement("span",{class:"label"}))}_refresh(){const hidden=this.hidden
DOM.setHidden(this,hidden)
if(hidden)return
const label=this.label
const title=this.title
const icon=this.icon
if(icon){if(!this._iconElt)this._createIcon()
if(this._lastUrlIcon!==icon){this._lastUrlIcon=icon
this.style.setProperty("--icon-img",icon.startsWith("--")?`var(${icon})`:`url("${icon}")`)}DOM.setAttr(this,"aria-label",this.ariaLabel)
DOM.setHidden(this._iconElt,false)}else{if(this._iconElt)DOM.setHidden(this._iconElt,true)}if(label!=null){if(!this._labelElt)this._createLabel()
DOM.setTextContent(this._labelElt,label)
DOM.setHidden(this._labelElt,false)}else{if(this._labelElt)DOM.setHidden(this._labelElt,true)}DOM.setAttr(this,"title",title)
const disabled=this.disabled
DOM.setAttrBool(this,"disabled",disabled)
DOM.setAttr(this,"tabindex",disabled?null:this.tabIndexCustom===-2?null:(this.tabIndexCustom||0).toString())
const toggleOn=this.toggleOn
DOM.setAttr(this,"aria-pressed",toggleOn===undefined?null:toggleOn===null?"mixed":toggleOn.toString())}}export class ActionableList extends BaseElement{get actions(){return this._actions}set actions(actions){if(this._actions!==actions){this._actions=this.groupOrder==null?actions:ACTION.injectSepByGroup(actions,this.groupOrder,this._actionContext)
this.refresh()}}get actionContext(){return this._actionContext}refreshContent(){if(isRefreshHook(this._actionContext)&&this._actionContext.onRefreshCycle(true)==="stop")return
try{DOM.findNext(this,this,elt=>{if(isEltRefreshable(elt))elt.refresh()
return false})
ACTIONABLES.cleanupDoubleSep(this)}finally{if(isRefreshHook(this._actionContext))this._actionContext.onRefreshCycle(false)}}_initialize(init){this._actionContext=init.actionContext
this.uiContext=init.uiContext||"bar"
this.groupOrder=init.groupOrder
this.actions=init.actions}buildInitFromAtts(init){init=super.buildInitFromAtts(init)
init.actions=ACTIONABLES.extractActionsFromDom(this,init)
init.actionContext=ACTIONABLES.extractActionContextFromDom(this,init)
if(this.hasAttribute("ui-context"))init.uiContext=BASIS.extractAttr(this,"ui-context")
if(this.hasAttribute("group-order"))init.groupOrder=BASIS.extractAttr(this,"group-order")
return init}_refresh(){if(!this._actionContext){this.textContent=null
return}if(isRefreshHook(this._actionContext)&&this._actionContext.onRefreshCycle(true)==="stop")return
try{let nextTag=this.firstElementChild
if(this._actions)for(let i=0;i<this._actions.length;i++){const action=this._actions[i]
if(IS_Actionable(nextTag)&&nextTag.action===action){if(isEltRefreshable(nextTag))nextTag.refresh()
nextTag=nextTag.nextElementSibling}else{const b=this._createButton(action)
if(b)this.insertBefore(b,nextTag)}}while(nextTag){const toRem=nextTag
nextTag=nextTag.nextElementSibling
toRem.remove()}ACTIONABLES.cleanupDoubleSep(this)}finally{if(isRefreshHook(this._actionContext))this._actionContext.onRefreshCycle(false)}}_createButton(action){throw Error("To implement")}}export const IS_Actionable=n=>n&&n.action
export const IS_ActionableEnabled=n=>n&&n.action&&!n.hidden&&!n.disabled
export var ACTIONABLES;(function(ACTIONABLES){function cleanupDoubleSep(root){let prevWdgt=false
let lastSep=null
for(let ch=root.firstElementChild;ch;ch=ch.nextElementSibling){if(IS_Actionable(ch)&&ch.action.getId()==="#SEP"){DOM.setHidden(ch,!prevWdgt)
prevWdgt=false
lastSep=ch}else if(!prevWdgt&&!ch.hidden){prevWdgt=true}}if(!prevWdgt&&lastSep)DOM.setHidden(lastSep,!prevWdgt)}ACTIONABLES.cleanupDoubleSep=cleanupDoubleSep
function extractActionFromDom(elt,init){const action=elt.getAttribute("action")
return action?elt.findReg(init).getSvc(action):null}ACTIONABLES.extractActionFromDom=extractActionFromDom
function extractActionContextFromDom(elt,init){const actionCtx=elt.getAttribute("action-context")
return actionCtx?elt.findReg(init).getSvc(actionCtx):elt}ACTIONABLES.extractActionContextFromDom=extractActionContextFromDom
function extractActionsFromDom(elt,init){const actions=BASIS.extractAttr(elt,"actions")
return actions?elt.findReg(init).mergeLists(...actions.split(" ")):[]}ACTIONABLES.extractActionsFromDom=extractActionsFromDom})(ACTIONABLES||(ACTIONABLES={}))

//# sourceMappingURL=actionables.js.map