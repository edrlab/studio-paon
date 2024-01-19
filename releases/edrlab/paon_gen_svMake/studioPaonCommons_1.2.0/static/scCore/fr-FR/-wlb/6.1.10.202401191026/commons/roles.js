import{DOM,JSX}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/dom.js"
import{Area,AREAS}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/areas.js"
import{REG}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/registry.js"
import{MxFormElement}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/forms.js"
import{BaseElementAsync}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wbk/6.1.10.202401191026/commons/basis.js"
import{render}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wre/6.1.10.202401191026/litHtml/lib/render.js"
import{xhtml}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/utils/htmlLit.js"
import{DOMSH}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/xml/domsh.js"
import{SEC}from"https://studio-paon.edrlab.org/~~static/scCore/fr-FR/-wlb/6.1.10.202401191026/commons/security.js"
var FALLBACK_ROLE_NAME=SEC.FALLBACK_ROLE_NAME
export class RoleEditUiHandler extends Area{constructor(roleCode){super(roleCode)
this.roleCode=roleCode}setUiLayerSgnPattern(sgnPattern){this._uiLayerSgnPattern=sgnPattern
return this}dependsOnRole(roleCode){if(!this._dependsOfRoles)this._dependsOfRoles=[]
this._dependsOfRoles.push(roleCode)
return this}getLabel(ctx){let label=super.getLabel(ctx)||ctx.reg.getRoleProperty(this.roleCode,"title")||this.roleCode
if(this.isForcedVisible(ctx)===true&&(ctx.grantedRoles&&ctx.grantedRoles.includes(this.roleCode)||ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)))label=`${label} [rôle invalide]`
return label}getDescription(ctx){let desc=super.getDescription(ctx)||ctx.reg.getRoleProperty(this.roleCode,"description")
if(this.isForcedVisible(ctx)===true&&(ctx.grantedRoles&&ctx.grantedRoles.includes(this.roleCode)||ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)))desc=desc?`Ce rôle est invalide ou inconnu dans ce contexte.\n${desc}`:"Ce rôle est invalide ou inconnu dans ce contexte."
return desc}isVisible(ctx){if(this.isForcedVisible(ctx)===true)return true
if(this._uiLayerSgnPattern){if(!ctx.uiLayerSgn||!this._uiLayerSgnPattern.test(ctx.uiLayerSgn))return false}if(this._dependsOfRoles){let userRoles=ROLES.resolveUserRoles(ctx,true)
if(!userRoles||!this._dependsOfRoles.find(entry=>userRoles.indexOf(entry)>-1?true:false))return false}return super.isVisible(ctx)}isForcedVisible(ctx){let resolverRoles=ROLES.resolveUserRoles(ctx,true)
if(ctx.forceVisibilityIfSetOrInherited&&(resolverRoles.includes(this.roleCode)||ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)||ctx.grantedRoles&&ctx.grantedRoles.includes(this.roleCode))){if(this._uiLayerSgnPattern){if(!ctx.uiLayerSgn||!this._uiLayerSgnPattern.test(ctx.uiLayerSgn))return true}if(this._dependsOfRoles){let userRoles=ROLES.resolveUserRoles(ctx,true)
if(!userRoles||!this._dependsOfRoles.find(entry=>userRoles.indexOf(entry)>-1?true:false))return true}}return undefined}isEnabled(ctx){if(this.isForcedVisible(ctx)===true&&!(ctx.grantedRoles&&ctx.grantedRoles.includes(this.roleCode)||ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)))return false
let setPerm=ctx.reg.getRoleProperty(this.roleCode,"setPerm")
if(setPerm&&!this.checkObjectRootPerm(ctx,setPerm))return false
return super.isEnabled(ctx)}getGroup(ctx){return ROLES.extractGroupFromRole(this.roleCode)}buildBody(ctx){const control=this._buildControl(ctx)
this._initControlElement(control,ctx)
const body=this._buildControlLabel(control,ctx)
this._initControlLabelElement(body,control,ctx)
return body}_buildControl(ctx){let exclusifGroup=this.getGroup(ctx)?this.getGroup(ctx)+":":null
let input=JSX.createElement("input",{name:exclusifGroup||this.roleCode,type:exclusifGroup?"radio":"checkbox",value:this.roleCode})
return input}_initControlElement(input,ctx){DOM.setHidden(input,!this.isVisible(ctx))
DOM.setAttrBool(input,"disabled",!this.isEnabled(ctx))
if(this.canBeIndeterminate(ctx)){if(ctx.refusedRoles&&ctx.refusedRoles.indexOf(this.roleCode)>-1){RoleEditUiHandler.setIndeterminate(input,false)
RoleEditUiHandler.setInputChecked(input,false)}else if(ctx.grantedRoles&&ctx.grantedRoles.indexOf(this.roleCode)>-1){RoleEditUiHandler.setIndeterminate(input,false)
RoleEditUiHandler.setInputChecked(input,true)}else{let userRoles=ROLES.resolveUserRoles(ctx,true)
if(ctx.inheritedRoles&&ctx.inheritedRoles.indexOf(this.roleCode)>-1&&userRoles.indexOf(this.roleCode)>-1){RoleEditUiHandler.setIndeterminate(input,true)
RoleEditUiHandler.setInputChecked(input,true)}}}else{if(ctx.grantedRoles&&ctx.grantedRoles.indexOf(this.roleCode)>-1)RoleEditUiHandler.setInputChecked(input,true)}Object.assign(input,{extractJson:function(parent){throw"No extractJson. Used global init object"},fillJson:function(parent,root){throw"No fillJson. Used global init object"}})}_buildControlLabel(control,ctx,label=this.getLabel(ctx)){const elemId=this.getId()+"~"+Math.floor(Math.random()*1e5).toString(36)
control.id=elemId
return JSX.createElement("span",{class:"ctrlLbl"},control,JSX.createElement("label",{class:"lbl",for:elemId},label))}canBeIndeterminate(ctx){if(!ctx.inheritedRoles)return false
let currentGroup=this.getGroup(ctx)
if(currentGroup)return ctx.inheritedRoles.find(role=>ROLES.extractGroupFromRole(role)===currentGroup)?true:false
else return ctx.inheritedRoles.indexOf(this.roleCode)>-1}_initControlLabelElement(ctrl,input,ctx){ctrl.setAttribute("area-id",this.getId())
if(this.getDescription(ctx))ctrl.title=this.getDescription(ctx)
DOM.setHidden(ctrl,!this.isVisible(ctx))
DOM.setAttrBool(ctrl,"disabled",!this.isEnabled(ctx))
DOM.setAttrBool(ctrl,"data-forced-vivibility-currentlevel",this.isForcedVisible(ctx)===true&&(ctx.grantedRoles&&ctx.grantedRoles.includes(this.roleCode)||ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)))
DOM.setAttrBool(ctrl,"data-forced-vivibility",this.isForcedVisible(ctx))
DOM.setAttrBool(ctrl,"data-forced-refused",ctx.refusedRoles&&ctx.refusedRoles.includes(this.roleCode)&&!this.getGroup(ctx))
const canBeIndeterminate=this.canBeIndeterminate(ctx)
ctrl.addEventListener("click",(function(ev){if(!input.readOnly&&!input.disabled){let currentGoup=ROLES.extractGroupFromRole(input.value)
if(canBeIndeterminate){if(RoleEditUiHandler.isIndeterminate(input)){RoleEditUiHandler.setInputChecked(input,false)
RoleEditUiHandler.setIndeterminate(input,false)}else if(RoleEditUiHandler.isInputChecked(input)){RoleEditUiHandler.setInputChecked(input,false)
RoleEditUiHandler.setIndeterminate(input,true)}else{RoleEditUiHandler.setInputChecked(input,true)
RoleEditUiHandler.setIndeterminate(input,false)}ev.stopPropagation()
ev.preventDefault()
input.dispatchEvent(new CustomEvent("change",{bubbles:true,composed:true}))}else{RoleEditUiHandler.setInputChecked(input,input.checked)}}}))
ctrl.addEventListener("input",(function(ev){ev.stopPropagation()
ev.preventDefault()}))
ctrl.addEventListener("change",function(ev){if(!ctx.grantedRoles)ctx.grantedRoles=[]
if(!ctx.refusedRoles)ctx.refusedRoles=[]
let currentGoup=ROLES.extractGroupFromRole(this.value)
if(currentGoup){ctx.grantedRoles=ctx.grantedRoles.filter(value=>!value.startsWith(currentGoup+":"))
ctx.refusedRoles=ctx.refusedRoles.filter(value=>!value.startsWith(currentGoup+":"))}if(RoleEditUiHandler.isIndeterminate(this)&&!RoleEditUiHandler.isInputChecked(this)){ctx.grantedRoles=ctx.grantedRoles.filter(value=>value!==this.value)
ctx.refusedRoles=ctx.refusedRoles.filter(value=>value!==this.value)}else{RoleEditUiHandler.setIndeterminate(this,false)
if(ctx.inheritedRoles&&ctx.inheritedRoles.indexOf(this.value)>-1&&!RoleEditUiHandler.isInputChecked(this)){ctx.grantedRoles=ctx.grantedRoles.filter(value=>value!==this.value)
if(!currentGoup||ctx.groupCanBeUnchecked)ctx.refusedRoles.push(this.value)}else if(RoleEditUiHandler.isInputChecked(this)){ctx.refusedRoles=ctx.refusedRoles.filter(value=>value!==this.value)
ctx.grantedRoles.push(this.value)}else if(!RoleEditUiHandler.isInputChecked(this)){ctx.grantedRoles=ctx.grantedRoles.filter(value=>value!==this.value)
ctx.refusedRoles=ctx.refusedRoles.filter(value=>value!==this.value)}}RoleEditUiHandler.dispatchChangeEvent(this)
ev.stopPropagation()}.bind(input))
if(this.canBeIndeterminate(ctx)){let currentGoup=ROLES.extractGroupFromRole(this.roleCode)
if(currentGoup){let groupIsSet=false
if(ctx.grantedRoles&&ctx.grantedRoles.find(entry=>entry.startsWith(currentGoup+":")))groupIsSet=true
else if(ctx.refusedRoles&&ctx.refusedRoles.find(entry=>entry.startsWith(currentGoup+":")))groupIsSet=true
if(!groupIsSet){DOM.setAttrBool(ctrl,"data-group-indeterminate-state",true)
RoleEditUiHandler.setIndeterminate(ctrl,RoleEditUiHandler.isIndeterminate(input))}}else{if(RoleEditUiHandler.isIndeterminate(input)){DOM.setAttrBool(ctrl,"data-group-indeterminate-state",true)
RoleEditUiHandler.setIndeterminate(ctrl,RoleEditUiHandler.isIndeterminate(input))}}}}static dispatchChangeEvent(elt){let ev=new CustomEvent("roles-select-change",{bubbles:true,composed:true})
elt.dispatchEvent(ev)}static isIndeterminate(ctrl){return ctrl.hasAttribute("data-is-indeterminate-checked")}static setIndeterminate(ctrl,value){DOM.setAttrBool(ctrl,"data-is-indeterminate-checked",value)
if(value)ctrl.title="Rôle affecté dans un autre niveau (groupes, ...)."
else ctrl.title=""}static isInputChecked(ctrl){return ctrl.hasAttribute("data-is-checked")}static setInputChecked(ctrl,value){DOM.setAttrBool(ctrl,"data-is-checked",value)
ctrl.checked=value}}export class RolesSelectorInput extends(MxFormElement(BaseElementAsync)){constructor(){super(...arguments)
this._setValuePending=undefined
this._disabledForcedByContext=false}async _initialize(init){this._params=Object.assign({rolesLists:[ROLES.UI_ROLES_LIST],autocleanEmptyFieldset:true,forceVisibilityIfSetOrInherited:true,groupCanBeUnchecked:true},init)
this.reg=this.findReg(init)
this._form=JSX.createElement("form",null)
let onFormUpdateRequest=0
this._form.addEventListener("roles-select-change",ev=>{if(onFormUpdateRequest){clearTimeout(onFormUpdateRequest)
onFormUpdateRequest=0}onFormUpdateRequest=setTimeout(async()=>{onFormUpdateRequest=0
await this.onCtxChange()},100)})
this._attach(this.localName,init,this._form)
await this._refresh()
this.addEventListener("keydown",async ev=>{if(!this.disabled&&(ev.key==="Delete"||ev.key==="Backspace")&&this===DOMSH.findDocumentOrShadowRoot(this).activeElement){await this.setRolesValues(this._params.canBeIndeterminate?{}:{refusedRoles:[],grantedRoles:[]})
ev.stopPropagation()
return true}return false})
this._initializeForm(init)}get value(){throw"ERROR : use extractJson/fillJson instead"}set value(vals){throw"ERROR : use extractJson/fillJson instead"}set disabled(val){super.disabled=val
this.refreshDisabledUi()}get disabled(){return super.disabled}refreshDisabledUi(){const isDisabled=this.disabled===true||this._disabledForcedByContext===true
let fieldsetList=this._form.querySelectorAll("fieldset")
fieldsetList.forEach(fieldset=>{fieldset.disabled=isDisabled})}set indeterminate(val){DOM.setAttrBool(this,"indeterminate",val)}get indeterminate(){return this.hasAttribute("indeterminate")}async setRolesValues(vals){let params={refusedRoles:vals.refusedRoles?vals.refusedRoles.slice():null,grantedRoles:vals.grantedRoles?vals.grantedRoles.slice():null}
Object.assign(this._params,params)
return this.onCtxChange()}async setInheritedRoles(value){this._params.inheritedRoles=value
return this.onCtxChange()}async rolesLayout(ctx){if(this._params.rolesLayout)return this._params.rolesLayout(ctx)
else if(this.reg.getSvc("roles.sets.tpl")){return this.reg.getSvc("roles.sets.tpl")(ctx)}else{let areasList=await Promise.all(this.reg.mergeLists(...this._params.rolesLists))
let groupsSet=new Set
let result=[]
areasList.forEach(area=>{if(area.isVisible(this._params)){if(area.getGroup(this._params))groupsSet.add(area.getGroup(this._params))}})
groupsSet.forEach(groupCode=>{result.push(JSX.createElement("fieldset",{id:groupCode+":","area-groups":groupCode,"data-bypass":true}))})
result.push(JSX.createElement("fieldset",{id:"other","area-ids":"*",class:"subLevel","data-bypass":true}))
return xhtml`${result}`}}async _refresh(){try{this.refreshFreeze(1)
super._refresh()
await this.onCtxChange()}finally{this.refreshFreeze(-1)}}async onCtxChange(){await render(await this.rolesLayout(this._params),this._form)
await AREAS.applyLayout(this._form,await Promise.all(this.reg.mergeLists(...this._params.rolesLists)),this._params,true)
if(this._params.autocleanEmptyFieldset){let fieldsetList=this._form.querySelectorAll("fieldset")
fieldsetList.forEach(fieldset=>{DOM.setHidden(fieldset,!fieldset.querySelector("input:not([hidden])"))})}this.refreshDisabledUi()
if(this._params.canBeIndeterminate&&!(this._params.grantedRoles||this._params.refusedRoles)){this.indeterminate=true}else this.indeterminate=false
this.dispatchEvent(new CustomEvent("change",{bubbles:true,cancelable:false}))
this.dispatchEvent(new CustomEvent("input",{bubbles:true,cancelable:false}))}extractJson(parent){this._setValuePending=parent
this.setRolesValues(parent).then(async()=>{await this.setInheritedRoles(parent["inheritedRoles"])
this._setValuePending=undefined})
return true}fillJson(parent,root){let roles=this._setValuePending?{grantedRoles:this._setValuePending.grantedRoles?this._setValuePending.grantedRoles.sort():undefined,refusedRoles:this._setValuePending.refusedRoles?this._setValuePending.refusedRoles.sort():undefined}:{grantedRoles:this._params.grantedRoles?this._params.grantedRoles.sort():undefined,refusedRoles:this._params.refusedRoles?this._params.refusedRoles.sort():undefined}
Object.assign(parent,roles)}formDisabledCallback(disabled){this._disabledForcedByContext=disabled
this.refreshDisabledUi()}}REG.reg.registerSkin("c-input-roles-selector",1,`\n\t:host {\n\t\tbackground-color: var(--form-bgcolor);\n\t\tborder: 1px solid var(--border-color);\n\t}\n\n\t:host(:disabled) {\n\t\tbackground-color: transparent;\n\t}\n\n\t:host([indeterminate]) {\n\t\topacity: .5;\n\t}\n\n\tfieldset > legend {\n\t\tletter-spacing: .1rem;\n\t}\n\n\tfieldset {\n\t\tborder: 1px solid var(--alt1-border-color);\n\t\tborder-radius: 5px;\n\t\tpadding: .3rem;\n\t\tmargin-block-end: .5rem;\n\t\tmargin-block-start: .1rem;\n\t}\n\n\tfieldset[data-bypass] {\n\t\tborder: none;\n\t}\n\n\tfieldset[disabled] {\n\t\topacity: .5;\n\t}\n\n\tfieldset[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t.subLevel {\n\t\tmargin-inline-start: 2rem;\n\t}\n\n\t.ctrlLbl {\n\t\tdisplay: inline-flex;\n\t\tmargin-inline-end: 1rem;\n\t\tpadding: 1px;\n\t}\n\n\n\t.ctrlLbl[data-is-indeterminate-checked] {\n\t\tbackground-color: var(--row-inSel-unfocus-bgcolor);\n\t\tborder-radius: 5px;\n\n\t}\n\n\t.ctrlLbl[data-group-indeterminate-state] {\n\t\t/*font-style: italic;*/\n\t\topacity: .6;\n\t}\n\n\t.ctrlLbl[data-forced-vivibility-currentlevel] {\n\t\tcolor: var(--warning-color);\n\t}\n\n\t.ctrlLbl[data-forced-refused] {\n\t\ttext-decoration: line-through;\n\t}\n\n\t.ctrlLbl[hidden] {\n\t\tdisplay: none;\n\t}\n\n\t.ctrlLbl[disabled] {\n\t\topacity: .6;\n\t}\n\n\t.lbl {\n\t\tmargin-inline-end: .5rem;\n\t\tuser-select: none;\n\t}\n\n`)
customElements.define("c-input-roles-selector",RolesSelectorInput)
REG.reg.addToList("user:roles",FALLBACK_ROLE_NAME,1,new RoleEditUiHandler(FALLBACK_ROLE_NAME).setLabel("Rôle non défini").setVisible(false))
export var ROLES;(function(ROLES){ROLES.GROUP_ROLES_MAIN="main"
ROLES.UI_ROLES_LIST="user:roles"
function extractGroupFromRole(code){if(!code)return null
return code.indexOf(":")>-1?code.substring(0,code.indexOf(":")):null}ROLES.extractGroupFromRole=extractGroupFromRole
function findGroupDef(code){if(!code)return null
switch(code){case ROLES.GROUP_ROLES_MAIN:return{label:"principal",color:"var(--inv-bgcolor)"}
default:return{label:code,color:"var(--inv-bgcolor)"}}}ROLES.findGroupDef=findGroupDef
function resolveUserRoles(userRoles,disabledFallback=false){if(userRoles.inheritedRoles){let roles
roles=userRoles.refusedRoles?userRoles.inheritedRoles.filter(r=>userRoles.refusedRoles.indexOf(r)===-1):userRoles.inheritedRoles.concat()
if(!userRoles.grantedRoles)return roles
userRoles.grantedRoles.forEach(r=>{const sep=r.indexOf(":")
if(sep>0){const categ=r.substring(0,sep+1)
roles=roles.filter(r2=>!r2.startsWith(categ))
roles.push(r)}else{if(roles.indexOf(r)===-1)roles.push(r)}})
return disabledFallback?roles:SEC.injectFallbackRole(roles)}if(disabledFallback)return userRoles.grantedRoles||[]
else return SEC.injectFallbackRole(Array.from(userRoles.grantedRoles||[]))}ROLES.resolveUserRoles=resolveUserRoles
async function resolveRolesList(roles,ctx,rolesUiHandlers){if(!rolesUiHandlers)rolesUiHandlers=await Promise.all(ctx.reg.mergeLists(ROLES.UI_ROLES_LIST))
let result=[]
roles.forEach(role=>{let currentRoleUiIndex=rolesUiHandlers.findIndex(roleUi=>roleUi.roleCode===role)
let currentRoleUi=currentRoleUiIndex>-1?rolesUiHandlers[currentRoleUiIndex]:null
if(currentRoleUi||ctx.reg.getRoleProperty(role,"priority")!==undefined){result.push({role:role,name:currentRoleUi&&currentRoleUi.getLabel(ctx)||ctx.reg.getRoleProperty(role,"title")||role,sortUi:currentRoleUiIndex||Infinity,sortAlgo:ctx.reg.getRoleProperty(role,"priority"),level:currentRoleUi?ctx.grantedRoles&&ctx.grantedRoles.includes(role)?"set":"inherited":"unknown"})}})
result.sort((l1,l2)=>{const g1=extractGroupFromRole(l1.role)
const g2=extractGroupFromRole(l2.role)
if(g1===ROLES.GROUP_ROLES_MAIN&&g2!==ROLES.GROUP_ROLES_MAIN)return-1
if(g1!==ROLES.GROUP_ROLES_MAIN&&g2===ROLES.GROUP_ROLES_MAIN)return 1
return l1.sortUi-l2.sortUi})
return result}ROLES.resolveRolesList=resolveRolesList})(ROLES||(ROLES={}))

//# sourceMappingURL=roles.js.map