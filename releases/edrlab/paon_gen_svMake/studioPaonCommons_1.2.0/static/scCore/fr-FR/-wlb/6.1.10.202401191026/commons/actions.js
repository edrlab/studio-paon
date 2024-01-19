import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{Signboard}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/signboard.js"
export class Action extends Signboard{isMenu(ctx){return false}isToggle(ctx){return false}getDatas(api,ctx){return null}buildCustomButton(ctx,uiContext,parent){return undefined}initButtonNode(buttonNode,ctx){}execute(ctx,ev){}executeIfAvailable(ctx,ev){if(this.isAvailable(ctx)){this.execute(ctx,ev)
return true}return false}setExecute(method){this.execute=method
return this}override(name,val){this[name]=val
return this}}export class EnumEntryAction extends Action{constructor(key,label,selected){super(key)
this._label=label
this.selected=selected}isToggle(ctx){return true}getDatas(api,ctx){return this.selected}isEnabled(ctx){if(this.selected)return false
return super.isEnabled(ctx)}}export class ActionMenu extends Action{isMenu(ctx){return true}setActions(actions){this._actions=actions
return this}setActionLists(actionLists){this._actionLists=actionLists
return this}setGroupOrder(groupOrder){this._groupOrder=groupOrder
return this}getGroupOrder(ctx){return typeof this._groupOrder==="function"?this._groupOrder(ctx,this):this._groupOrder}getActions(ctx){if(this._actions)return typeof this._actions==="function"?this._actions(ctx,this):this._actions
const actionLists=typeof this._actionLists==="function"?this._actionLists(ctx,this):this._actionLists
this._actions=actionLists?ACTION.injectSepByGroup(REG.getReg(ctx).mergeLists(...actionLists.split(" ")),this.getGroupOrder(ctx),ctx):[]
return this._actions}getDatas(api,ctx){return this.getActions(ctx)}}export class ActionMenuDep extends ActionMenu{isEnabled(ctx){if(!super.isEnabled(ctx))return false
for(const action of this.getActions(ctx)){if(action.isEnabled(ctx)&&!(action instanceof ActionSeparator))return true}return false}isVisible(ctx){if(!super.isVisible(ctx))return false
for(const action of this.getActions(ctx)){if(action.isVisible(ctx)&&!(action instanceof ActionSeparator))return true}return false}isInstantiable(ctx){for(const action of this.getActions(ctx)){if(action.isInstantiable(ctx)&&!(action instanceof ActionSeparator))return true}return false}}export class ActionSignboardWrapper extends Action{getWrapped(ctx){return this._wrapped||ACTION.NULL}getLabel(ctx){return this._label!==undefined?super.getLabel(ctx):this.getWrapped(ctx).getLabel(ctx)}getDescription(ctx){return this._description!==undefined?super.getDescription(ctx):this.getWrapped(ctx).getDescription(ctx)}getIcon(ctx){return this._icon!==undefined?super.getIcon(ctx):this.getWrapped(ctx).getIcon(ctx)}getGroup(ctx){return this._group!==undefined?super.getGroup(ctx):this.getWrapped(ctx).getGroup(ctx)}isVisible(ctx){if(this._visible!==undefined)return super.isVisible(ctx)
if(!this.checkObjectRootVisiblePerm(ctx))return false
return this.getWrapped(ctx).isVisible(ctx)}isEnabled(ctx){if(this._enabled!==undefined)return super.isEnabled(ctx)
if(!this.checkObjectRootPerm(ctx))return false
return this.getWrapped(ctx).isEnabled(ctx)}isInstantiable(ctx){if(this._instantiable!==undefined)return super.isInstantiable(ctx)
return this.getWrapped(ctx).isInstantiable(ctx)}}export class ActionWrapper extends ActionSignboardWrapper{getWrapped(ctx){return this._wrapped||ACTION.NULL}setOverridenSvc(svc){this._wrapped=svc
return this}isMenu(ctx){return this.getWrapped(ctx).isMenu(ctx)}isToggle(ctx){return this.getWrapped(ctx).isToggle(ctx)}getDatas(api,ctx){return this.getWrapped(ctx).getDatas(api,ctx)}buildCustomButton(ctx,uiContext,parent){return this.getWrapped(ctx).buildCustomButton(ctx,uiContext,parent)}initButtonNode(buttonNode,ctx){this.getWrapped(ctx).initButtonNode(buttonNode,ctx)}execute(ctx,ev){return this.getWrapped(ctx).execute(ctx,ev)}}export class ActionWrapperFromSvc extends ActionWrapper{getWrappedSvcCd(){return this._svcCd}setWrappedSvcCd(svcCd){this._svcCd=svcCd
return this}getWrapped(ctx){return REG.getReg(ctx).getSvc(this._svcCd)||ACTION.NULL}}export class ActionWrapperFromList extends ActionWrapper{getActionsList(ctx){return this._actionsList}setActionsList(actionsList){this._actionsList=actionsList
return this}getWrapped(ctx){const list=this.getList(ctx)
let firstVisible=null
for(let i=0;i<list.length;i++){const subAction=list[i]
if(subAction.isVisible(ctx)){firstVisible=subAction
if(subAction.isEnabled(ctx))return subAction}}return firstVisible||ACTION.NULL}getList(ctx){if(!this._actionsList)return[]
return(ctx.reg||REG.reg).getList(this._actionsList)||[]}}export class ActionHackCtx extends Action{constructor(sub){super(sub.getId())
this.sub=sub}getLabel(ctx){return this.sub.getLabel(this.wrapCtx(ctx))}getIcon(ctx){return this.sub.getIcon(this.wrapCtx(ctx))}getDescription(ctx){return this.sub.getDescription(this.wrapCtx(ctx))}isVisible(ctx){return this.sub.isVisible(this.wrapCtx(ctx))}isEnabled(ctx){return this.sub.isEnabled(this.wrapCtx(ctx))}isInstantiable(ctx){return this.sub.isInstantiable(this.wrapCtx(ctx))}getGroup(ctx){return this.sub.getGroup(this.wrapCtx(ctx))}getSkin(ctx){return this.sub.getSkin(this.wrapCtx(ctx))}getSkinOver(ctx){return this.sub.getSkinOver(this.wrapCtx(ctx))}getDatas(api,ctx){return this.sub.getDatas(api,this.wrapCtx(ctx))}getLastDatasKey(ctx){return this.sub.getLastDatasKey(this.wrapCtx(ctx))}isMenu(ctx){return this.sub.isMenu(this.wrapCtx(ctx))}isToggle(ctx){return this.sub.isToggle(this.wrapCtx(ctx))}initButtonNode(buttonNode,ctx){return this.sub.initButtonNode(buttonNode,this.wrapCtx(ctx))}buildCustomButton(ctx,uiContext,parent){return this.sub.buildCustomButton(this.wrapCtx(ctx),uiContext,parent)}execute(ctx,ev){return this.sub.execute(this.wrapCtx(ctx),ev)}}export class ActionWrapEltReg extends ActionHackCtx{constructor(sub,reg){super(sub)
this.reg=reg}wrapCtx(ctx){return Object.assign({},ctx,{reg:this.reg})}initButtonNode(buttonNode,ctx){buttonNode.reg=this.reg
this.sub.initButtonNode(buttonNode,this.wrapCtx(ctx))}}export class ActionSeparator extends Action{constructor(){super(ActionSeparator.ID)
this._enabled=false
this._group=ActionSeparator.ID
this._label=""}buildCustomButton(ctx,uiContext,parent){const hr=document.createElement("hr")
hr.action=this
hr.disabled=true
return hr}}ActionSeparator.ID="#SEP"
export var ACTION;(function(ACTION){ACTION.NULL=Object.freeze(new Action("#NULL").setVisible(false).setEnabled(false))
function injectSepByGroup(actions,groupsOrder,ctx){if(!actions)return[]
const grpByCd={}
let grpStart
const grpAny=[]
let grpEnd
const names=!groupsOrder||groupsOrder==="*"?null:groupsOrder.split(" ")
let offsetAny=names?names.indexOf("*"):0
if(offsetAny<0)offsetAny=names.length
for(let i=0;i<actions.length;i++){const action=actions[i]
const group=action.getGroup(ctx)||""
if(group===ActionSeparator.ID)continue
const list=grpByCd[group]
if(!list){if(names){const idx=names.indexOf(group)
if(idx>=0){if(idx<offsetAny){if(!grpStart)grpStart=[]
grpStart[idx]=grpByCd[group]=[action]}else{if(!grpEnd)grpEnd=[]
grpEnd[idx-offsetAny]=grpByCd[group]=[action]}continue}}grpAny.push(grpByCd[group]=[action])}else list.push(action)}const result=[]
if(grpStart)for(const g of grpStart)if(g)result.push(...g,new ActionSeparator)
for(const g of grpAny)result.push(...g,new ActionSeparator)
if(grpEnd)for(const g of grpEnd)if(g)result.push(...g,new ActionSeparator)
if(result.length>0)result.length=result.length-1
return result}ACTION.injectSepByGroup=injectSepByGroup
function isAccelPressed(ev){return IS_MAC?ev.metaKey:ev.ctrlKey}ACTION.isAccelPressed=isAccelPressed
function isAnyControlPressed(ev){return ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey}ACTION.isAnyControlPressed=isAnyControlPressed
function isCopyOverMove(ev){return IS_MAC?ev.altKey:ev.ctrlKey}ACTION.isCopyOverMove=isCopyOverMove
function mergeAccelKeyMgr(reg,...list){const id=list.length===1?list[0]:list.join()
let ak=reg.cache.get(id)
if(ak===undefined){const actions=reg.mergeListsAsMap(...list)
ak=actions&&Object.keys(actions).length>0?(new AccelKeyMgr).initFromMapActions(actions):null
reg.cache.set(id,ak)}return ak}ACTION.mergeAccelKeyMgr=mergeAccelKeyMgr
function getAccelText(info){let text=info.mainKey||""
if(text){if(info.shiftKey)text="Shift+"+text
if(info.altKey)text="Alt+"+text
if(info.ctrlKey||info.accelKey&&!IS_MAC)text="Ctrl+"+text
if(info.metaKey||info.accelKey&&IS_MAC)text=(IS_MAC?"⌘":"Meta+")+text}return text}ACTION.getAccelText=getAccelText
function getLocalizedKey(key){return LOCALIZED_KEYS[key]||key}ACTION.getLocalizedKey=getLocalizedKey
function doOnEvent(r,ev){if(!ev)return r
if(!r){ev.stopImmediatePropagation()
if(ev.cancelable)ev.preventDefault()}else{if(r!=="noStopPropag"&&r!=="noStopPropag-noPreventDefault")ev.stopImmediatePropagation()
if(ev.cancelable&&r!=="noPreventDefault"&&r!=="noStopPropag-noPreventDefault")ev.preventDefault()}return r}ACTION.doOnEvent=doOnEvent
ACTION.spellcheckSymbol=Symbol("spellcheck")})(ACTION||(ACTION={}))
export class AccelKeyMgr{constructor(){this._accelKeys=new Map
this._anyAccelKeys=new Map}setAccelKeyMgrParent(parent){this._accelKeyParent=parent
return this}addAccelKey(key,modifiers,action){const accelKey=new AccelKey(key,modifiers,action)
let idx=0
if(accelKey.charCode!=0){idx|=16
idx|=accelKey.charCode<<5}else{idx|=accelKey.keyIndex<<5}if(accelKey.isAnyModifier()){this._anyAccelKeys.set(idx,accelKey)}else{if(accelKey.ctrlKey)idx|=1
if(accelKey.shiftKey)idx|=2
if(accelKey.altKey)idx|=4
if(accelKey.metaKey)idx|=8
this._accelKeys.set(idx,accelKey)}return this}initFromMapActions(mapActions){if(mapActions)for(const fullKey in mapActions){const sep=fullKey.indexOf("-",1)
const key=sep>=1?fullKey.substring(0,sep):fullKey
const modifiers=sep>=1?fullKey.substring(sep+1):""
this.addAccelKey(key,modifiers,mapActions[fullKey])}return this}reset(){this._accelKeys.clear()
this._anyAccelKeys.clear()}handleKeyboardEvent(ev,ctx){let idx=0
if(ev.key.length===1&&ev.key!==" "){idx|=16
idx|=ev.key.toLowerCase().charCodeAt(0)<<5}else{idx|=getIndexKey(ev.key)<<5}let accelKey=this._anyAccelKeys.get(idx)
if(accelKey){if(accelKey.action.isAvailable(ctx)){ev.stopImmediatePropagation()
const r=accelKey.action.execute(ctx,ev)
if(ev.cancelable&&r!=="noPreventDefault")ev.preventDefault()
return 2}return 1}if(ev.ctrlKey)idx|=1
if(ev.shiftKey)idx|=2
if(ev.altKey)idx|=4
if(ev.metaKey)idx|=8
accelKey=this._accelKeys.get(idx)
if(accelKey){if(accelKey.action.isInstantiable(ctx)&&accelKey.action.isAvailable(ctx)){ACTION.doOnEvent(accelKey.action.execute(ctx,ev),ev)
return 2}return 1}if(this._accelKeyParent)return this._accelKeyParent.handleKeyboardEvent(ev,ctx)
return 0}searchAccelText(action){const id=action.getId()
for(const accelKey of this._accelKeys.values()){if(id===accelKey.action.getId())return accelKey.getAccelText()}for(const accelKey of this._anyAccelKeys.values()){if(id===accelKey.action.getId())return accelKey.getAccelText()}if(this._accelKeyParent)return this._accelKeyParent.searchAccelText(action)
return""}}export function isAccelKeyMgrPointer(c){return c&&c.accelKeyMgr}class AccelKey{constructor(key,modifiers,action){this.key=key
this.action=action
this.modifiers=modifiers||""
if(key.length===1&&key!==" "){this.charCode=key.toLowerCase().charCodeAt(0)
this.keyIndex=0}else{this.charCode=0
this.keyIndex=getIndexKey(key)}}isAnyModifier(){return this.modifiers==="any"}get mainKey(){return this.charCode>0?this.key.toUpperCase():ACTION.getLocalizedKey(this.key)}get ctrlKey(){return this.modifiers.indexOf("ctrl")>=0||!IS_MAC&&this.modifiers.indexOf("accel")>=0}get shiftKey(){return this.modifiers.indexOf("shift")>=0}get altKey(){return this.modifiers.indexOf("alt")>=0}get metaKey(){return this.modifiers.indexOf("meta")>=0||IS_MAC&&this.modifiers.indexOf("accel")>=0}getAccelText(){if(this._accelText!==undefined)return this._accelText
return this._accelText=ACTION.getAccelText(this)}}function getIndexKey(key){return INDEX_KEYS[key]||0}const LOCALIZED_KEYS={Help:"Aide",Backspace:"Arr.",Insert:"Ins.",Delete:"Suppr.",Enter:"Entrée",Pause:"Pause",Escape:"Echap",PageUp:"Page haut",PageDown:"Page bas",End:"Fin",Home:"Début",ArrowLeft:"Flèche gauche",ArrowUp:"Flèche haut",ArrowRight:"Flèche droite",ArrowDown:"Flèche bas",PrintScreen:"Impr",F1:"F1",F2:"F2",F3:"F3",F4:"F4",F5:"F5",F6:"F6",F7:"F7",F8:"F8",F9:"F9",F10:"F10",F11:"F11",F12:"F12",F13:"F13",F14:"F14",F15:"F15",F16:"F16"," ":"Espace"}
const INDEX_KEYS={};(function(){let i=0
for(const k in LOCALIZED_KEYS)INDEX_KEYS[k]=++i})()
const IS_MAC=navigator.platform.indexOf("Mac")>=0

//# sourceMappingURL=actions.js.map